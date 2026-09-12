@echo off
REM ============================================================
REM 秒杀接口一键压测脚本
REM 用法：双击运行（默认 200 线程 / 10s ramp-up / 60s），或在命令行带参数：
REM   run-seckill-test.bat [threads] [rampup] [duration] [voucherId]
REM 前提：tokens.csv 已就绪（见 README），应用已在 8081 端口运行
REM ============================================================
setlocal

set THREADS=%1
if "%THREADS%"=="" set THREADS=200
set RAMPUP=%2
if "%RAMPUP%"=="" set RAMPUP=10
set DURATION=%3
if "%DURATION%"=="" set DURATION=60
set VOUCHER_ID=%4
if "%VOUCHER_ID%"=="" set VOUCHER_ID=10

cd /d "%~dp0"

if not exist results mkdir results
if not exist tokens.csv (
    echo [错误] 未找到 tokens.csv，请先按 README 准备压测用户 token！
    pause
    exit /b 1
)

echo ============================================
echo 线程数=%THREADS%  RampUp=%RAMPUP%s  时长=%DURATION%s  券ID=%VOUCHER_ID%
echo ============================================

jmeter -n -t seckill-test.jmx ^
  -Jthreads=%THREADS% -Jrampup=%RAMPUP% -Jduration=%DURATION% ^
  -JvoucherId=%VOUCHER_ID% -Jhost=localhost -Jport=8081 ^
  -l results\seckill.jtl -e -o results\report

if errorlevel 1 (
    echo [失败] jmeter 命令未找到或执行出错，请确认 JMeter bin 已加入 PATH
    pause
    exit /b 1
)

echo 完成！HTML 报告：%~dp0results\report\index.html
start "" "%~dp0results\report\index.html"
endlocal
