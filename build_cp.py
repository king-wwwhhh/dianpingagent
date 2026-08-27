#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
构造编译类路径并编译指定 Java 源文件。
解析 pom.xml 依赖，递归解析 parent/dependencyManagement，并展开 starter 的传递依赖。
"""
import glob
import os
import subprocess
import sys
from xml.etree import ElementTree as ET

M2_REPO = os.path.expanduser("~/.m2/repository")
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
TARGET_CLASSES = os.path.join(PROJECT_DIR, "target", "classes")
NS = {"m": "http://maven.apache.org/POM/4.0.0"}


def pom_path(group, artifact, version):
    return os.path.join(M2_REPO, *group.split("."), artifact, version, f"{artifact}-{version}.pom")


def read_pom(path):
    try:
        return ET.parse(path)
    except Exception:
        return None


def get_text(root, xpath, default=""):
    el = root.find(xpath, NS)
    return (el.text or "").strip() if el is not None else default


def parse_dependency(dep_el):
    group = get_text(dep_el, "m:groupId")
    artifact = get_text(dep_el, "m:artifactId")
    version = get_text(dep_el, "m:version")
    scope = get_text(dep_el, "m:scope")
    return group, artifact, version, scope


def load_dependency_management(root):
    """收集当前 pom 中 dependencyManagement 里的版本锁定"""
    versions = {}
    dm = root.find(".//m:dependencyManagement/m:dependencies", NS)
    if dm is None:
        return versions
    for dep in dm.findall("m:dependency", NS):
        group, artifact, version, _ = parse_dependency(dep)
        if group and artifact and version:
            versions[(group, artifact)] = version
    return versions


def resolve_version(root, group, artifact, version, property_chain=None):
    """解析 ${xxx} 属性，递归 parent chain"""
    if property_chain is None:
        property_chain = [root]
    if not version.startswith("${"):
        return version
    prop_name = version[2:-1]

    # 1. 当前 pom 属性
    for r in property_chain:
        prop = r.find(f".//m:properties/m:{prop_name}", NS)
        if prop is not None and prop.text:
            v = prop.text.strip()
            if not v.startswith("${"):
                return v
            return resolve_version(r, group, artifact, v, property_chain)
    # 2. 内置属性
    if prop_name == "project.version":
        return get_text(root, "m:version") or get_text(root, "m:parent/m:version")
    if prop_name == "project.groupId":
        return get_text(root, "m:groupId") or get_text(root, "m:parent/m:groupId")
    return version


def collect_versions(root, chain):
    """合并当前 pom 及 parent chain 的 dependencyManagement 版本"""
    versions = {}
    for r in chain:
        versions.update(load_dependency_management(r))
    # 再解析一遍 ${}
    resolved = {}
    for (g, a), v in versions.items():
        resolved[(g, a)] = resolve_version(root, g, a, v, chain)
    return resolved


def parent_chain(path):
    """递归加载 parent pom，返回 [current, parent, grandparent, ...]"""
    chain = []
    current_path = path
    visited = set()
    while current_path and current_path not in visited:
        visited.add(current_path)
        tree = read_pom(current_path)
        if tree is None:
            break
        root = tree.getroot()
        chain.append(root)
        parent_group = get_text(root, "m:parent/m:groupId")
        parent_artifact = get_text(root, "m:parent/m:artifactId")
        parent_version = get_text(root, "m:parent/m:version")
        if not (parent_group and parent_artifact and parent_version):
            break
        current_path = pom_path(parent_group, parent_artifact, parent_version)
    return chain


def jar_path(group, artifact, version):
    if not version:
        return None
    folder = os.path.join(M2_REPO, *group.split("."), artifact, version)
    direct = os.path.join(folder, f"{artifact}-{version}.jar")
    if os.path.exists(direct):
        return direct
    jars = [j for j in glob.glob(os.path.join(folder, "*.jar"))
            if "-sources" not in j and "-javadoc" not in j]
    if jars:
        for j in jars:
            if j.endswith(f"{artifact}-{version}.jar"):
                return j
        return sorted(jars, key=lambda x: len(os.path.basename(x)))[0]
    return None


def collect_deps(path):
    """收集项目直接依赖 + parent 管理的版本 + 传递依赖"""
    chain = parent_chain(path)
    root = chain[0]
    managed_versions = collect_versions(root, chain)

    # 1. 直接依赖（本 pom）
    direct = []
    for dep in root.findall(".//m:dependencies/m:dependency", NS):
        group, artifact, version, scope = parse_dependency(dep)
        if scope == "test":
            continue
        if not version:
            version = managed_versions.get((group, artifact), "")
        version = resolve_version(root, group, artifact, version, chain)
        direct.append((group, artifact, version))

    # 2. 展开传递依赖（BFS，只展开 compile/provided/runtime，不展开 test）
    result = set(direct)
    queue = list(direct)
    visited = set(direct)
    while queue:
        group, artifact, version = queue.pop(0)
        pom = read_pom(pom_path(group, artifact, version))
        if pom is None:
            continue
        proot = pom.getroot()
        # 本 pom 自己的 dependencyManagement 也会锁定版本
        sub_chain = parent_chain(pom_path(group, artifact, version))
        sub_managed = collect_versions(proot, sub_chain)
        for dep in proot.findall(".//m:dependencies/m:dependency", NS):
            g, a, v, s = parse_dependency(dep)
            if s == "test" or s == "provided":
                continue
            if not v:
                v = sub_managed.get((g, a), "")
            if not v and (g, a) in managed_versions:
                v = managed_versions[(g, a)]
            v = resolve_version(proot, g, a, v, sub_chain)
            if not v:
                continue
            coord = (g, a, v)
            if coord not in visited:
                visited.add(coord)
                result.add(coord)
                queue.append(coord)
    return result


def build_classpath():
    deps = collect_deps(os.path.join(PROJECT_DIR, "pom.xml"))
    jars = [TARGET_CLASSES]
    for group, artifact, version in deps:
        jp = jar_path(group, artifact, version)
        if jp:
            jars.append(jp)
        else:
            print(f"WARN: missing jar for {group}:{artifact}:{version}")
    return os.pathsep.join(jars), deps


def find_source(files_or_patterns):
    src_root = os.path.join(PROJECT_DIR, "src", "main", "java")
    result = []
    for item in files_or_patterns:
        if os.path.exists(item):
            result.append(os.path.abspath(item))
        else:
            path = os.path.join(src_root, item.replace(".", "") + ".java" if "." in item and "/" not in item else item)
            if os.path.exists(path):
                result.append(path)
            else:
                matches = glob.glob(os.path.join(src_root, item), recursive=True)
                result.extend(matches)
    return result


def main():
    if len(sys.argv) < 2:
        print("Usage: python build_cp.py <java-files-or-patterns>...")
        sys.exit(1)

    cp, deps = build_classpath()
    sources = find_source(sys.argv[1:])

    if not sources:
        print("No source files matched")
        sys.exit(1)

    print(f"Resolved {len(deps)} coordinates, {len(sources)} source files")
    cmd = ["javac", "-encoding", "UTF-8", "-d", TARGET_CLASSES, "-cp", cp] + sources
    subprocess.run(cmd, check=True)
    print("OK")


if __name__ == "__main__":
    main()
