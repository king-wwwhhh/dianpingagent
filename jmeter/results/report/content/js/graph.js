/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
$(document).ready(function() {

    $(".click-title").mouseenter( function(    e){
        e.preventDefault();
        this.style.cursor="pointer";
    });
    $(".click-title").mousedown( function(event){
        event.preventDefault();
    });

    // Ugly code while this script is shared among several pages
    try{
        refreshHitsPerSecond(true);
    } catch(e){}
    try{
        refreshResponseTimeOverTime(true);
    } catch(e){}
    try{
        refreshResponseTimePercentiles();
    } catch(e){}
});


var responseTimePercentilesInfos = {
        data: {"result": {"minY": 1.0, "minX": 0.0, "maxY": 99.0, "series": [{"data": [[0.0, 1.0], [0.1, 4.0], [0.2, 5.0], [0.3, 5.0], [0.4, 5.0], [0.5, 5.0], [0.6, 5.0], [0.7, 6.0], [0.8, 6.0], [0.9, 6.0], [1.0, 6.0], [1.1, 6.0], [1.2, 6.0], [1.3, 6.0], [1.4, 6.0], [1.5, 6.0], [1.6, 7.0], [1.7, 7.0], [1.8, 7.0], [1.9, 7.0], [2.0, 7.0], [2.1, 7.0], [2.2, 7.0], [2.3, 7.0], [2.4, 7.0], [2.5, 7.0], [2.6, 7.0], [2.7, 8.0], [2.8, 8.0], [2.9, 8.0], [3.0, 8.0], [3.1, 8.0], [3.2, 8.0], [3.3, 8.0], [3.4, 8.0], [3.5, 8.0], [3.6, 8.0], [3.7, 9.0], [3.8, 9.0], [3.9, 9.0], [4.0, 9.0], [4.1, 9.0], [4.2, 9.0], [4.3, 9.0], [4.4, 9.0], [4.5, 9.0], [4.6, 9.0], [4.7, 9.0], [4.8, 9.0], [4.9, 9.0], [5.0, 9.0], [5.1, 10.0], [5.2, 10.0], [5.3, 10.0], [5.4, 10.0], [5.5, 10.0], [5.6, 10.0], [5.7, 10.0], [5.8, 10.0], [5.9, 10.0], [6.0, 10.0], [6.1, 10.0], [6.2, 10.0], [6.3, 10.0], [6.4, 10.0], [6.5, 10.0], [6.6, 10.0], [6.7, 10.0], [6.8, 11.0], [6.9, 11.0], [7.0, 11.0], [7.1, 11.0], [7.2, 11.0], [7.3, 11.0], [7.4, 11.0], [7.5, 11.0], [7.6, 11.0], [7.7, 11.0], [7.8, 11.0], [7.9, 11.0], [8.0, 11.0], [8.1, 11.0], [8.2, 11.0], [8.3, 11.0], [8.4, 11.0], [8.5, 11.0], [8.6, 11.0], [8.7, 11.0], [8.8, 11.0], [8.9, 11.0], [9.0, 11.0], [9.1, 12.0], [9.2, 12.0], [9.3, 12.0], [9.4, 12.0], [9.5, 12.0], [9.6, 12.0], [9.7, 12.0], [9.8, 12.0], [9.9, 12.0], [10.0, 12.0], [10.1, 12.0], [10.2, 12.0], [10.3, 12.0], [10.4, 12.0], [10.5, 12.0], [10.6, 12.0], [10.7, 12.0], [10.8, 12.0], [10.9, 12.0], [11.0, 12.0], [11.1, 12.0], [11.2, 12.0], [11.3, 12.0], [11.4, 12.0], [11.5, 12.0], [11.6, 12.0], [11.7, 12.0], [11.8, 12.0], [11.9, 12.0], [12.0, 12.0], [12.1, 12.0], [12.2, 12.0], [12.3, 12.0], [12.4, 12.0], [12.5, 13.0], [12.6, 13.0], [12.7, 13.0], [12.8, 13.0], [12.9, 13.0], [13.0, 13.0], [13.1, 13.0], [13.2, 13.0], [13.3, 13.0], [13.4, 13.0], [13.5, 13.0], [13.6, 13.0], [13.7, 13.0], [13.8, 13.0], [13.9, 13.0], [14.0, 13.0], [14.1, 13.0], [14.2, 13.0], [14.3, 13.0], [14.4, 13.0], [14.5, 13.0], [14.6, 13.0], [14.7, 13.0], [14.8, 13.0], [14.9, 13.0], [15.0, 13.0], [15.1, 13.0], [15.2, 13.0], [15.3, 13.0], [15.4, 13.0], [15.5, 13.0], [15.6, 13.0], [15.7, 13.0], [15.8, 13.0], [15.9, 13.0], [16.0, 13.0], [16.1, 13.0], [16.2, 13.0], [16.3, 13.0], [16.4, 13.0], [16.5, 13.0], [16.6, 13.0], [16.7, 13.0], [16.8, 13.0], [16.9, 13.0], [17.0, 13.0], [17.1, 13.0], [17.2, 13.0], [17.3, 13.0], [17.4, 13.0], [17.5, 13.0], [17.6, 13.0], [17.7, 13.0], [17.8, 13.0], [17.9, 13.0], [18.0, 13.0], [18.1, 14.0], [18.2, 14.0], [18.3, 14.0], [18.4, 14.0], [18.5, 14.0], [18.6, 14.0], [18.7, 14.0], [18.8, 14.0], [18.9, 14.0], [19.0, 14.0], [19.1, 14.0], [19.2, 14.0], [19.3, 14.0], [19.4, 14.0], [19.5, 14.0], [19.6, 14.0], [19.7, 14.0], [19.8, 14.0], [19.9, 14.0], [20.0, 14.0], [20.1, 14.0], [20.2, 14.0], [20.3, 14.0], [20.4, 14.0], [20.5, 14.0], [20.6, 14.0], [20.7, 14.0], [20.8, 14.0], [20.9, 14.0], [21.0, 14.0], [21.1, 14.0], [21.2, 14.0], [21.3, 14.0], [21.4, 14.0], [21.5, 14.0], [21.6, 14.0], [21.7, 14.0], [21.8, 14.0], [21.9, 14.0], [22.0, 14.0], [22.1, 14.0], [22.2, 14.0], [22.3, 14.0], [22.4, 14.0], [22.5, 14.0], [22.6, 14.0], [22.7, 14.0], [22.8, 14.0], [22.9, 14.0], [23.0, 14.0], [23.1, 14.0], [23.2, 14.0], [23.3, 14.0], [23.4, 14.0], [23.5, 14.0], [23.6, 14.0], [23.7, 14.0], [23.8, 14.0], [23.9, 14.0], [24.0, 14.0], [24.1, 14.0], [24.2, 14.0], [24.3, 14.0], [24.4, 14.0], [24.5, 14.0], [24.6, 14.0], [24.7, 14.0], [24.8, 14.0], [24.9, 14.0], [25.0, 14.0], [25.1, 14.0], [25.2, 14.0], [25.3, 14.0], [25.4, 14.0], [25.5, 14.0], [25.6, 14.0], [25.7, 14.0], [25.8, 14.0], [25.9, 14.0], [26.0, 15.0], [26.1, 15.0], [26.2, 15.0], [26.3, 15.0], [26.4, 15.0], [26.5, 15.0], [26.6, 15.0], [26.7, 15.0], [26.8, 15.0], [26.9, 15.0], [27.0, 15.0], [27.1, 15.0], [27.2, 15.0], [27.3, 15.0], [27.4, 15.0], [27.5, 15.0], [27.6, 15.0], [27.7, 15.0], [27.8, 15.0], [27.9, 15.0], [28.0, 15.0], [28.1, 15.0], [28.2, 15.0], [28.3, 15.0], [28.4, 15.0], [28.5, 15.0], [28.6, 15.0], [28.7, 15.0], [28.8, 15.0], [28.9, 15.0], [29.0, 15.0], [29.1, 15.0], [29.2, 15.0], [29.3, 15.0], [29.4, 15.0], [29.5, 15.0], [29.6, 15.0], [29.7, 15.0], [29.8, 15.0], [29.9, 15.0], [30.0, 15.0], [30.1, 15.0], [30.2, 15.0], [30.3, 15.0], [30.4, 15.0], [30.5, 15.0], [30.6, 15.0], [30.7, 15.0], [30.8, 15.0], [30.9, 15.0], [31.0, 15.0], [31.1, 15.0], [31.2, 15.0], [31.3, 15.0], [31.4, 15.0], [31.5, 15.0], [31.6, 15.0], [31.7, 15.0], [31.8, 15.0], [31.9, 15.0], [32.0, 15.0], [32.1, 15.0], [32.2, 15.0], [32.3, 15.0], [32.4, 15.0], [32.5, 15.0], [32.6, 15.0], [32.7, 15.0], [32.8, 15.0], [32.9, 15.0], [33.0, 15.0], [33.1, 15.0], [33.2, 15.0], [33.3, 15.0], [33.4, 15.0], [33.5, 15.0], [33.6, 15.0], [33.7, 15.0], [33.8, 15.0], [33.9, 15.0], [34.0, 15.0], [34.1, 15.0], [34.2, 15.0], [34.3, 15.0], [34.4, 15.0], [34.5, 15.0], [34.6, 15.0], [34.7, 15.0], [34.8, 15.0], [34.9, 15.0], [35.0, 15.0], [35.1, 15.0], [35.2, 15.0], [35.3, 15.0], [35.4, 15.0], [35.5, 15.0], [35.6, 15.0], [35.7, 15.0], [35.8, 15.0], [35.9, 15.0], [36.0, 15.0], [36.1, 15.0], [36.2, 15.0], [36.3, 15.0], [36.4, 15.0], [36.5, 16.0], [36.6, 16.0], [36.7, 16.0], [36.8, 16.0], [36.9, 16.0], [37.0, 16.0], [37.1, 16.0], [37.2, 16.0], [37.3, 16.0], [37.4, 16.0], [37.5, 16.0], [37.6, 16.0], [37.7, 16.0], [37.8, 16.0], [37.9, 16.0], [38.0, 16.0], [38.1, 16.0], [38.2, 16.0], [38.3, 16.0], [38.4, 16.0], [38.5, 16.0], [38.6, 16.0], [38.7, 16.0], [38.8, 16.0], [38.9, 16.0], [39.0, 16.0], [39.1, 16.0], [39.2, 16.0], [39.3, 16.0], [39.4, 16.0], [39.5, 16.0], [39.6, 16.0], [39.7, 16.0], [39.8, 16.0], [39.9, 16.0], [40.0, 16.0], [40.1, 16.0], [40.2, 16.0], [40.3, 16.0], [40.4, 16.0], [40.5, 16.0], [40.6, 16.0], [40.7, 16.0], [40.8, 16.0], [40.9, 16.0], [41.0, 16.0], [41.1, 16.0], [41.2, 16.0], [41.3, 16.0], [41.4, 16.0], [41.5, 16.0], [41.6, 16.0], [41.7, 16.0], [41.8, 16.0], [41.9, 16.0], [42.0, 16.0], [42.1, 16.0], [42.2, 16.0], [42.3, 16.0], [42.4, 16.0], [42.5, 16.0], [42.6, 16.0], [42.7, 16.0], [42.8, 16.0], [42.9, 16.0], [43.0, 16.0], [43.1, 16.0], [43.2, 16.0], [43.3, 16.0], [43.4, 16.0], [43.5, 16.0], [43.6, 16.0], [43.7, 16.0], [43.8, 16.0], [43.9, 16.0], [44.0, 16.0], [44.1, 16.0], [44.2, 16.0], [44.3, 16.0], [44.4, 16.0], [44.5, 16.0], [44.6, 16.0], [44.7, 16.0], [44.8, 16.0], [44.9, 16.0], [45.0, 16.0], [45.1, 16.0], [45.2, 16.0], [45.3, 16.0], [45.4, 16.0], [45.5, 16.0], [45.6, 16.0], [45.7, 16.0], [45.8, 16.0], [45.9, 16.0], [46.0, 16.0], [46.1, 16.0], [46.2, 16.0], [46.3, 16.0], [46.4, 16.0], [46.5, 16.0], [46.6, 16.0], [46.7, 16.0], [46.8, 16.0], [46.9, 16.0], [47.0, 16.0], [47.1, 16.0], [47.2, 16.0], [47.3, 16.0], [47.4, 16.0], [47.5, 16.0], [47.6, 16.0], [47.7, 16.0], [47.8, 16.0], [47.9, 16.0], [48.0, 16.0], [48.1, 16.0], [48.2, 16.0], [48.3, 16.0], [48.4, 16.0], [48.5, 16.0], [48.6, 16.0], [48.7, 16.0], [48.8, 16.0], [48.9, 16.0], [49.0, 16.0], [49.1, 16.0], [49.2, 17.0], [49.3, 17.0], [49.4, 17.0], [49.5, 17.0], [49.6, 17.0], [49.7, 17.0], [49.8, 17.0], [49.9, 17.0], [50.0, 17.0], [50.1, 17.0], [50.2, 17.0], [50.3, 17.0], [50.4, 17.0], [50.5, 17.0], [50.6, 17.0], [50.7, 17.0], [50.8, 17.0], [50.9, 17.0], [51.0, 17.0], [51.1, 17.0], [51.2, 17.0], [51.3, 17.0], [51.4, 17.0], [51.5, 17.0], [51.6, 17.0], [51.7, 17.0], [51.8, 17.0], [51.9, 17.0], [52.0, 17.0], [52.1, 17.0], [52.2, 17.0], [52.3, 17.0], [52.4, 17.0], [52.5, 17.0], [52.6, 17.0], [52.7, 17.0], [52.8, 17.0], [52.9, 17.0], [53.0, 17.0], [53.1, 17.0], [53.2, 17.0], [53.3, 17.0], [53.4, 17.0], [53.5, 17.0], [53.6, 17.0], [53.7, 17.0], [53.8, 17.0], [53.9, 17.0], [54.0, 17.0], [54.1, 17.0], [54.2, 17.0], [54.3, 17.0], [54.4, 17.0], [54.5, 17.0], [54.6, 17.0], [54.7, 17.0], [54.8, 17.0], [54.9, 17.0], [55.0, 17.0], [55.1, 17.0], [55.2, 17.0], [55.3, 17.0], [55.4, 17.0], [55.5, 17.0], [55.6, 17.0], [55.7, 17.0], [55.8, 17.0], [55.9, 17.0], [56.0, 17.0], [56.1, 17.0], [56.2, 17.0], [56.3, 17.0], [56.4, 17.0], [56.5, 17.0], [56.6, 17.0], [56.7, 17.0], [56.8, 17.0], [56.9, 17.0], [57.0, 17.0], [57.1, 17.0], [57.2, 17.0], [57.3, 17.0], [57.4, 17.0], [57.5, 17.0], [57.6, 17.0], [57.7, 17.0], [57.8, 17.0], [57.9, 17.0], [58.0, 17.0], [58.1, 17.0], [58.2, 17.0], [58.3, 17.0], [58.4, 17.0], [58.5, 17.0], [58.6, 17.0], [58.7, 17.0], [58.8, 17.0], [58.9, 17.0], [59.0, 17.0], [59.1, 17.0], [59.2, 17.0], [59.3, 17.0], [59.4, 17.0], [59.5, 17.0], [59.6, 17.0], [59.7, 17.0], [59.8, 17.0], [59.9, 17.0], [60.0, 17.0], [60.1, 17.0], [60.2, 17.0], [60.3, 17.0], [60.4, 17.0], [60.5, 17.0], [60.6, 17.0], [60.7, 17.0], [60.8, 17.0], [60.9, 17.0], [61.0, 17.0], [61.1, 17.0], [61.2, 17.0], [61.3, 17.0], [61.4, 17.0], [61.5, 17.0], [61.6, 17.0], [61.7, 17.0], [61.8, 17.0], [61.9, 18.0], [62.0, 18.0], [62.1, 18.0], [62.2, 18.0], [62.3, 18.0], [62.4, 18.0], [62.5, 18.0], [62.6, 18.0], [62.7, 18.0], [62.8, 18.0], [62.9, 18.0], [63.0, 18.0], [63.1, 18.0], [63.2, 18.0], [63.3, 18.0], [63.4, 18.0], [63.5, 18.0], [63.6, 18.0], [63.7, 18.0], [63.8, 18.0], [63.9, 18.0], [64.0, 18.0], [64.1, 18.0], [64.2, 18.0], [64.3, 18.0], [64.4, 18.0], [64.5, 18.0], [64.6, 18.0], [64.7, 18.0], [64.8, 18.0], [64.9, 18.0], [65.0, 18.0], [65.1, 18.0], [65.2, 18.0], [65.3, 18.0], [65.4, 18.0], [65.5, 18.0], [65.6, 18.0], [65.7, 18.0], [65.8, 18.0], [65.9, 18.0], [66.0, 18.0], [66.1, 18.0], [66.2, 18.0], [66.3, 18.0], [66.4, 18.0], [66.5, 18.0], [66.6, 18.0], [66.7, 18.0], [66.8, 18.0], [66.9, 18.0], [67.0, 18.0], [67.1, 18.0], [67.2, 18.0], [67.3, 18.0], [67.4, 18.0], [67.5, 18.0], [67.6, 18.0], [67.7, 18.0], [67.8, 18.0], [67.9, 18.0], [68.0, 18.0], [68.1, 18.0], [68.2, 18.0], [68.3, 18.0], [68.4, 18.0], [68.5, 18.0], [68.6, 18.0], [68.7, 18.0], [68.8, 18.0], [68.9, 18.0], [69.0, 18.0], [69.1, 18.0], [69.2, 18.0], [69.3, 18.0], [69.4, 18.0], [69.5, 18.0], [69.6, 18.0], [69.7, 18.0], [69.8, 18.0], [69.9, 18.0], [70.0, 18.0], [70.1, 18.0], [70.2, 18.0], [70.3, 18.0], [70.4, 18.0], [70.5, 18.0], [70.6, 18.0], [70.7, 18.0], [70.8, 18.0], [70.9, 18.0], [71.0, 18.0], [71.1, 18.0], [71.2, 18.0], [71.3, 18.0], [71.4, 18.0], [71.5, 18.0], [71.6, 18.0], [71.7, 18.0], [71.8, 18.0], [71.9, 18.0], [72.0, 18.0], [72.1, 18.0], [72.2, 18.0], [72.3, 18.0], [72.4, 18.0], [72.5, 18.0], [72.6, 18.0], [72.7, 18.0], [72.8, 18.0], [72.9, 18.0], [73.0, 18.0], [73.1, 18.0], [73.2, 18.0], [73.3, 19.0], [73.4, 19.0], [73.5, 19.0], [73.6, 19.0], [73.7, 19.0], [73.8, 19.0], [73.9, 19.0], [74.0, 19.0], [74.1, 19.0], [74.2, 19.0], [74.3, 19.0], [74.4, 19.0], [74.5, 19.0], [74.6, 19.0], [74.7, 19.0], [74.8, 19.0], [74.9, 19.0], [75.0, 19.0], [75.1, 19.0], [75.2, 19.0], [75.3, 19.0], [75.4, 19.0], [75.5, 19.0], [75.6, 19.0], [75.7, 19.0], [75.8, 19.0], [75.9, 19.0], [76.0, 19.0], [76.1, 19.0], [76.2, 19.0], [76.3, 19.0], [76.4, 19.0], [76.5, 19.0], [76.6, 19.0], [76.7, 19.0], [76.8, 19.0], [76.9, 19.0], [77.0, 19.0], [77.1, 19.0], [77.2, 19.0], [77.3, 19.0], [77.4, 19.0], [77.5, 19.0], [77.6, 19.0], [77.7, 19.0], [77.8, 19.0], [77.9, 19.0], [78.0, 19.0], [78.1, 19.0], [78.2, 19.0], [78.3, 19.0], [78.4, 19.0], [78.5, 19.0], [78.6, 19.0], [78.7, 19.0], [78.8, 19.0], [78.9, 19.0], [79.0, 19.0], [79.1, 19.0], [79.2, 19.0], [79.3, 19.0], [79.4, 19.0], [79.5, 19.0], [79.6, 19.0], [79.7, 19.0], [79.8, 19.0], [79.9, 19.0], [80.0, 19.0], [80.1, 19.0], [80.2, 19.0], [80.3, 19.0], [80.4, 19.0], [80.5, 19.0], [80.6, 19.0], [80.7, 19.0], [80.8, 19.0], [80.9, 19.0], [81.0, 19.0], [81.1, 19.0], [81.2, 19.0], [81.3, 19.0], [81.4, 19.0], [81.5, 19.0], [81.6, 19.0], [81.7, 19.0], [81.8, 19.0], [81.9, 20.0], [82.0, 20.0], [82.1, 20.0], [82.2, 20.0], [82.3, 20.0], [82.4, 20.0], [82.5, 20.0], [82.6, 20.0], [82.7, 20.0], [82.8, 20.0], [82.9, 20.0], [83.0, 20.0], [83.1, 20.0], [83.2, 20.0], [83.3, 20.0], [83.4, 20.0], [83.5, 20.0], [83.6, 20.0], [83.7, 20.0], [83.8, 20.0], [83.9, 20.0], [84.0, 20.0], [84.1, 20.0], [84.2, 20.0], [84.3, 20.0], [84.4, 20.0], [84.5, 20.0], [84.6, 20.0], [84.7, 20.0], [84.8, 20.0], [84.9, 20.0], [85.0, 20.0], [85.1, 20.0], [85.2, 20.0], [85.3, 20.0], [85.4, 20.0], [85.5, 20.0], [85.6, 20.0], [85.7, 20.0], [85.8, 20.0], [85.9, 20.0], [86.0, 20.0], [86.1, 20.0], [86.2, 20.0], [86.3, 20.0], [86.4, 20.0], [86.5, 20.0], [86.6, 20.0], [86.7, 20.0], [86.8, 20.0], [86.9, 20.0], [87.0, 20.0], [87.1, 20.0], [87.2, 20.0], [87.3, 20.0], [87.4, 20.0], [87.5, 20.0], [87.6, 20.0], [87.7, 20.0], [87.8, 20.0], [87.9, 20.0], [88.0, 20.0], [88.1, 20.0], [88.2, 20.0], [88.3, 20.0], [88.4, 21.0], [88.5, 21.0], [88.6, 21.0], [88.7, 21.0], [88.8, 21.0], [88.9, 21.0], [89.0, 21.0], [89.1, 21.0], [89.2, 21.0], [89.3, 21.0], [89.4, 21.0], [89.5, 21.0], [89.6, 21.0], [89.7, 21.0], [89.8, 21.0], [89.9, 21.0], [90.0, 21.0], [90.1, 21.0], [90.2, 21.0], [90.3, 21.0], [90.4, 21.0], [90.5, 21.0], [90.6, 21.0], [90.7, 21.0], [90.8, 21.0], [90.9, 21.0], [91.0, 21.0], [91.1, 21.0], [91.2, 21.0], [91.3, 21.0], [91.4, 21.0], [91.5, 21.0], [91.6, 21.0], [91.7, 21.0], [91.8, 21.0], [91.9, 21.0], [92.0, 21.0], [92.1, 21.0], [92.2, 21.0], [92.3, 21.0], [92.4, 21.0], [92.5, 21.0], [92.6, 21.0], [92.7, 21.0], [92.8, 21.0], [92.9, 21.0], [93.0, 22.0], [93.1, 22.0], [93.2, 22.0], [93.3, 22.0], [93.4, 22.0], [93.5, 22.0], [93.6, 22.0], [93.7, 22.0], [93.8, 22.0], [93.9, 22.0], [94.0, 22.0], [94.1, 22.0], [94.2, 22.0], [94.3, 22.0], [94.4, 22.0], [94.5, 22.0], [94.6, 22.0], [94.7, 22.0], [94.8, 22.0], [94.9, 22.0], [95.0, 22.0], [95.1, 22.0], [95.2, 22.0], [95.3, 22.0], [95.4, 22.0], [95.5, 22.0], [95.6, 22.0], [95.7, 22.0], [95.8, 23.0], [95.9, 23.0], [96.0, 23.0], [96.1, 23.0], [96.2, 23.0], [96.3, 23.0], [96.4, 23.0], [96.5, 23.0], [96.6, 23.0], [96.7, 23.0], [96.8, 23.0], [96.9, 23.0], [97.0, 23.0], [97.1, 23.0], [97.2, 23.0], [97.3, 24.0], [97.4, 24.0], [97.5, 24.0], [97.6, 24.0], [97.7, 24.0], [97.8, 24.0], [97.9, 24.0], [98.0, 24.0], [98.1, 24.0], [98.2, 24.0], [98.3, 24.0], [98.4, 25.0], [98.5, 25.0], [98.6, 25.0], [98.7, 25.0], [98.8, 25.0], [98.9, 26.0], [99.0, 26.0], [99.1, 26.0], [99.2, 26.0], [99.3, 27.0], [99.4, 27.0], [99.5, 28.0], [99.6, 29.0], [99.7, 31.0], [99.8, 35.0], [99.9, 40.0]], "isOverall": false, "label": "POST /voucher-order/seckill", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
        getOptions: function() {
            return {
                series: {
                    points: { show: false }
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentiles'
                },
                xaxis: {
                    tickDecimals: 1,
                    axisLabel: "Percentiles",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Percentile value in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : %x.2 percentile was %y ms"
                },
                selection: { mode: "xy" },
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentiles"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesPercentiles"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesPercentiles"), dataset, prepareOverviewOptions(options));
        }
};

/**
 * @param elementId Id of element where we display message
 */
function setEmptyGraph(elementId) {
    $(function() {
        $(elementId).text("No graph series with filter="+seriesFilter);
    });
}

// Response times percentiles
function refreshResponseTimePercentiles() {
    var infos = responseTimePercentilesInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimePercentiles");
        return;
    }
    if (isGraph($("#flotResponseTimesPercentiles"))){
        infos.createGraph();
    } else {
        var choiceContainer = $("#choicesResponseTimePercentiles");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesPercentiles", "#overviewResponseTimesPercentiles");
        $('#bodyResponseTimePercentiles .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimeDistributionInfos = {
        data: {"result": {"minY": 291630.0, "minX": 0.0, "maxY": 291630.0, "series": [{"data": [[0.0, 291630.0]], "isOverall": false, "label": "POST /voucher-order/seckill", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 4.9E-324, "title": "Response Time Distribution"}},
        getOptions: function() {
            var granularity = this.data.result.granularity;
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    barWidth: this.data.result.granularity
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " responses for " + label + " were between " + xval + " and " + (xval + granularity) + " ms";
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimeDistribution"), prepareData(data.result.series, $("#choicesResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshResponseTimeDistribution() {
    var infos = responseTimeDistributionInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeDistribution");
        return;
    }
    if (isGraph($("#flotResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var syntheticResponseTimeDistributionInfos = {
        data: {"result": {"minY": 1205.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 290425.0, "series": [{"data": [[0.0, 1205.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [[3.0, 290425.0]], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 3.0, "title": "Synthetic Response Times Distribution"}},
        getOptions: function() {
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendSyntheticResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times ranges",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                    tickLength:0,
                    min:-0.5,
                    max:3.5
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    align: "center",
                    barWidth: 0.25,
                    fill:.75
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " " + label;
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            options.xaxis.ticks = data.result.ticks;
            $.plot($("#flotSyntheticResponseTimeDistribution"), prepareData(data.result.series, $("#choicesSyntheticResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshSyntheticResponseTimeDistribution() {
    var infos = syntheticResponseTimeDistributionInfos;
    prepareSeries(infos.data, true);
    if (isGraph($("#flotSyntheticResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerSyntheticResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var activeThreadsOverTimeInfos = {
        data: {"result": {"minY": 62.34156189307995, "minX": 1.78919886E12, "maxY": 191.42458024582396, "series": [{"data": [[1.78919892E12, 191.42458024582396], [1.78919886E12, 62.34156189307995]], "isOverall": false, "label": "秒杀线程组", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.78919892E12, "title": "Active Threads Over Time"}},
        getOptions: function() {
            return {
                series: {
                    stack: true,
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 6,
                    show: true,
                    container: '#legendActiveThreadsOverTime'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                selection: {
                    mode: 'xy'
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : At %x there were %y active threads"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesActiveThreadsOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotActiveThreadsOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewActiveThreadsOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Active Threads Over Time
function refreshActiveThreadsOverTime(fixTimestamps) {
    var infos = activeThreadsOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotActiveThreadsOverTime"))) {
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesActiveThreadsOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotActiveThreadsOverTime", "#overviewActiveThreadsOverTime");
        $('#footerActiveThreadsOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var timeVsThreadsInfos = {
        data: {"result": {"minY": 6.398437499999999, "minX": 6.0, "maxY": 56.5, "series": [{"data": [[6.0, 56.5], [7.0, 15.000000000000002], [8.0, 12.781250000000002], [9.0, 14.296296296296298], [10.0, 16.03448275862069], [11.0, 15.705882352941178], [12.0, 14.368421052631582], [13.0, 13.833333333333334], [14.0, 17.095238095238095], [15.0, 16.761904761904763], [16.0, 16.600000000000005], [17.0, 17.510204081632658], [18.0, 18.086956521739122], [19.0, 18.93617021276595], [20.0, 18.444444444444454], [21.0, 19.096153846153847], [22.0, 19.836363636363632], [23.0, 20.017857142857142], [24.0, 18.0], [25.0, 20.534482758620694], [26.0, 20.147540983606557], [27.0, 24.44444444444444], [28.0, 22.91935483870967], [29.0, 21.147058823529417], [30.0, 16.8314606741573], [31.0, 15.379310344827587], [32.0, 10.219298245614034], [33.0, 9.693548387096767], [34.0, 8.502702702702702], [35.0, 6.398437499999999], [36.0, 10.846153846153845], [38.0, 25.45454545454545], [39.0, 7.701960784313724], [40.0, 8.915151515151516], [41.0, 8.961538461538462], [42.0, 13.506172839506176], [43.0, 8.750000000000004], [44.0, 8.514522821576765], [45.0, 7.573275862068966], [46.0, 7.93538461538462], [47.0, 8.090551181102368], [48.0, 6.665573770491801], [49.0, 7.269005847953219], [50.0, 7.458064516129034], [51.0, 6.713043478260865], [52.0, 9.159169550173006], [53.0, 10.437768240343349], [54.0, 9.33085501858737], [55.0, 8.034055727554179], [56.0, 7.811320754716983], [57.0, 8.70754716981131], [58.0, 7.963414634146341], [59.0, 7.761772853185598], [60.0, 8.643598615916959], [61.0, 9.385542168674695], [62.0, 7.719197707736392], [63.0, 7.835897435897439], [64.0, 9.06140350877193], [65.0, 8.275568181818183], [66.0, 7.393939393939388], [67.0, 8.906250000000009], [68.0, 9.172106824925821], [69.0, 7.764705882352942], [70.0, 7.250554323725054], [71.0, 8.039119804400977], [72.0, 8.321782178217815], [73.0, 9.418032786885247], [74.0, 8.931506849315065], [75.0, 7.979746835443048], [76.0, 8.220164609053496], [77.0, 8.945799457994578], [78.0, 10.246537396121893], [79.0, 8.85851318944844], [80.0, 11.312101910828027], [81.0, 10.947802197802199], [82.0, 14.24372759856631], [83.0, 13.406896551724138], [84.0, 11.80493827160493], [85.0, 12.308641975308646], [86.0, 11.506631299734751], [87.0, 13.783783783783782], [88.0, 12.554006968641112], [89.0, 10.766169154228857], [90.0, 11.364269141531317], [91.0, 10.75], [92.0, 11.75141242937854], [93.0, 13.350746268656719], [94.0, 11.182266009852214], [95.0, 11.553763440860212], [96.0, 14.23888888888888], [97.0, 11.666666666666666], [98.0, 11.667539267015703], [99.0, 12.55555555555557], [100.0, 13.719723183391007], [101.0, 12.711864406779666], [102.0, 14.719879518072291], [103.0, 13.819875776397513], [104.0, 15.711688311688325], [105.0, 15.070512820512821], [106.0, 13.963350785340323], [107.0, 13.881868131868137], [108.0, 16.20053475935829], [109.0, 14.867816091954031], [110.0, 15.502857142857135], [111.0, 13.978891820580474], [112.0, 13.85869565217391], [113.0, 16.456790123456805], [114.0, 14.976804123711347], [115.0, 12.778325123152708], [116.0, 14.534883720930235], [117.0, 12.936915887850468], [118.0, 14.750724637681158], [119.0, 15.925641025641033], [120.0, 15.870558375634527], [121.0, 14.508670520231215], [122.0, 15.550335570469812], [123.0, 17.164133738601826], [124.0, 18.679715302491097], [125.0, 16.840616966580964], [126.0, 16.120786516853947], [127.0, 17.256410256410266], [128.0, 16.366995073891626], [129.0, 14.775590551181098], [130.0, 17.381818181818193], [131.0, 17.217983651226138], [132.0, 27.12875536480689], [133.0, 13.534403669724783], [134.0, 15.78743961352657], [135.0, 19.301939058171744], [136.0, 15.041214750542292], [137.0, 17.371345029239762], [138.0, 19.30376344086022], [139.0, 17.2684210526316], [140.0, 15.304609218436884], [141.0, 15.662650602409629], [142.0, 17.01769911504425], [143.0, 18.343653250773997], [144.0, 22.050704225352117], [145.0, 18.69704433497536], [146.0, 19.839050131926122], [147.0, 19.30790190735695], [148.0, 18.653846153846164], [149.0, 17.0264423076923], [150.0, 22.414239482200657], [151.0, 19.089285714285726], [152.0, 17.797101449275356], [153.0, 15.94394618834079], [154.0, 14.545105566218822], [155.0, 16.030303030303042], [156.0, 14.078039927404728], [157.0, 16.310344827586224], [158.0, 15.834070796460182], [159.0, 16.84380952380954], [160.0, 19.60056657223795], [161.0, 17.578124999999986], [162.0, 15.655172413793105], [163.0, 16.974885844748872], [164.0, 17.506756756756758], [165.0, 25.11764705882351], [166.0, 16.24394785847299], [167.0, 17.20594479830149], [168.0, 24.09631728045324], [169.0, 16.21792260692466], [170.0, 16.32078853046596], [171.0, 17.926096997690518], [172.0, 17.065439672801652], [173.0, 17.658536585365855], [174.0, 17.639080459770124], [175.0, 18.37701149425288], [176.0, 15.693050193050203], [177.0, 17.062381852552004], [178.0, 21.04906542056076], [179.0, 18.279475982532745], [180.0, 17.299820466786343], [181.0, 18.53990610328639], [182.0, 19.357740585774053], [183.0, 20.149425287356316], [184.0, 20.680898876404495], [185.0, 18.940409683426438], [186.0, 24.852348993288597], [187.0, 20.815730337078648], [188.0, 20.78947368421053], [189.0, 17.547309833024112], [190.0, 19.108384458077726], [191.0, 20.977064220183507], [192.0, 19.630268199233722], [193.0, 19.510917030567697], [194.0, 20.4789356984479], [195.0, 18.135325131810195], [196.0, 18.38282647584972], [197.0, 19.246728971962614], [198.0, 20.726098191214458], [199.0, 19.998165137614667], [200.0, 16.912574908390077]], "isOverall": false, "label": "POST /voucher-order/seckill", "isController": false}, {"data": [[182.76414634982828, 16.454946336111497]], "isOverall": false, "label": "POST /voucher-order/seckill-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 200.0, "title": "Time VS Threads"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: { noColumns: 2,show: true, container: '#legendTimeVsThreads' },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s: At %x.2 active threads, Average response time was %y.2 ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesTimeVsThreads"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotTimesVsThreads"), dataset, options);
            // setup overview
            $.plot($("#overviewTimesVsThreads"), dataset, prepareOverviewOptions(options));
        }
};

// Time vs threads
function refreshTimeVsThreads(){
    var infos = timeVsThreadsInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTimeVsThreads");
        return;
    }
    if(isGraph($("#flotTimesVsThreads"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTimeVsThreads");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTimesVsThreads", "#overviewTimesVsThreads");
        $('#footerTimeVsThreads .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var bytesThroughputOverTimeInfos = {
        data : {"result": {"minY": 41276.083333333336, "minX": 1.78919886E12, "maxY": 1119996.8, "series": [{"data": [[1.78919892E12, 547373.8333333334], [1.78919886E12, 41276.083333333336]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.78919892E12, 1119996.8], [1.78919886E12, 81088.95]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.78919892E12, "title": "Bytes Throughput Over Time"}},
        getOptions : function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity) ,
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Bytes / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendBytesThroughputOverTime'
                },
                selection: {
                    mode: "xy"
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y"
                }
            };
        },
        createGraph : function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesBytesThroughputOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotBytesThroughputOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewBytesThroughputOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Bytes throughput Over Time
function refreshBytesThroughputOverTime(fixTimestamps) {
    var infos = bytesThroughputOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotBytesThroughputOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesBytesThroughputOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotBytesThroughputOverTime", "#overviewBytesThroughputOverTime");
        $('#footerBytesThroughputOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimesOverTimeInfos = {
        data: {"result": {"minY": 9.965654707145024, "minX": 1.78919886E12, "maxY": 16.92163608562697, "series": [{"data": [[1.78919892E12, 16.92163608562697], [1.78919886E12, 9.965654707145024]], "isOverall": false, "label": "POST /voucher-order/seckill", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.78919892E12, "title": "Response Time Over Time"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average response time was %y ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Times Over Time
function refreshResponseTimeOverTime(fixTimestamps) {
    var infos = responseTimesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotResponseTimesOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesOverTime", "#overviewResponseTimesOverTime");
        $('#footerResponseTimesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var latenciesOverTimeInfos = {
        data: {"result": {"minY": 9.946744352448182, "minX": 1.78919886E12, "maxY": 16.921371442013513, "series": [{"data": [[1.78919892E12, 16.921371442013513], [1.78919886E12, 9.946744352448182]], "isOverall": false, "label": "POST /voucher-order/seckill", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.78919892E12, "title": "Latencies Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response latencies in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendLatenciesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average latency was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesLatenciesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotLatenciesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewLatenciesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Latencies Over Time
function refreshLatenciesOverTime(fixTimestamps) {
    var infos = latenciesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyLatenciesOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotLatenciesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesLatenciesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotLatenciesOverTime", "#overviewLatenciesOverTime");
        $('#footerLatenciesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var connectTimeOverTimeInfos = {
        data: {"result": {"minY": 0.021083274523641938, "minX": 1.78919886E12, "maxY": 0.03833180006133083, "series": [{"data": [[1.78919892E12, 0.021083274523641938], [1.78919886E12, 0.03833180006133083]], "isOverall": false, "label": "POST /voucher-order/seckill", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.78919892E12, "title": "Connect Time Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getConnectTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average Connect Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendConnectTimeOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average connect time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesConnectTimeOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotConnectTimeOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewConnectTimeOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Connect Time Over Time
function refreshConnectTimeOverTime(fixTimestamps) {
    var infos = connectTimeOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyConnectTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotConnectTimeOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesConnectTimeOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotConnectTimeOverTime", "#overviewConnectTimeOverTime");
        $('#footerConnectTimeOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var responseTimePercentilesOverTimeInfos = {
        data: {"result": {"minY": 11.0, "minX": 1.78919886E12, "maxY": 59.0, "series": [{"data": [[1.78919886E12, 59.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.78919886E12, 24.0]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.78919886E12, 29.0]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.78919886E12, 26.0]], "isOverall": false, "label": "95th percentile", "isController": false}, {"data": [[1.78919886E12, 11.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.78919886E12, 19.0]], "isOverall": false, "label": "Median", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.78919886E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Response Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentilesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Response time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentilesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimePercentilesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimePercentilesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Time Percentiles Over Time
function refreshResponseTimePercentilesOverTime(fixTimestamps) {
    var infos = responseTimePercentilesOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotResponseTimePercentilesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimePercentilesOverTime", "#overviewResponseTimePercentilesOverTime");
        $('#footerResponseTimePercentilesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var responseTimeVsRequestInfos = {
    data: {"result": {"minY": 7.0, "minX": 122.0, "maxY": 23.0, "series": [{"data": [[1039.0, 19.0], [4284.0, 23.0], [122.0, 14.0]], "isOverall": false, "label": "Successes", "isController": false}, {"data": [[9185.0, 16.0], [9339.0, 19.0], [9439.0, 20.0], [10219.0, 19.0], [9902.0, 19.0], [10461.0, 18.0], [10700.0, 18.0], [10558.0, 18.0], [11022.0, 18.0], [11078.0, 17.0], [11580.0, 17.0], [11579.0, 17.0], [11385.0, 17.0], [12096.0, 16.0], [12141.0, 16.0], [12101.0, 16.0], [12008.0, 16.0], [12205.0, 16.0], [12212.0, 16.0], [12179.0, 16.0], [12425.0, 16.0], [12438.0, 16.0], [3429.0, 16.0], [4284.0, 7.0], [6768.0, 8.0], [7353.0, 10.0], [7192.0, 13.0], [7528.0, 16.0], [7663.0, 17.0]], "isOverall": false, "label": "Failures", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 12438.0, "title": "Response Time Vs Request"}},
    getOptions: function() {
        return {
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Response Time in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: {
                noColumns: 2,
                show: true,
                container: '#legendResponseTimeVsRequest'
            },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median response time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesResponseTimeVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotResponseTimeVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewResponseTimeVsRequest"), dataset, prepareOverviewOptions(options));

    }
};

// Response Time vs Request
function refreshResponseTimeVsRequest() {
    var infos = responseTimeVsRequestInfos;
    prepareSeries(infos.data);
    if (isGraph($("#flotResponseTimeVsRequest"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeVsRequest");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimeVsRequest", "#overviewResponseTimeVsRequest");
        $('#footerResponseRimeVsRequest .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var latenciesVsRequestInfos = {
    data: {"result": {"minY": 7.0, "minX": 122.0, "maxY": 23.0, "series": [{"data": [[1039.0, 19.0], [4284.0, 23.0], [122.0, 14.0]], "isOverall": false, "label": "Successes", "isController": false}, {"data": [[9185.0, 16.0], [9339.0, 19.0], [9439.0, 20.0], [10219.0, 19.0], [9902.0, 19.0], [10461.0, 18.0], [10700.0, 18.0], [10558.0, 18.0], [11022.0, 18.0], [11078.0, 17.0], [11580.0, 17.0], [11579.0, 17.0], [11385.0, 17.0], [12096.0, 16.0], [12141.0, 16.0], [12101.0, 16.0], [12008.0, 16.0], [12205.0, 16.0], [12212.0, 16.0], [12179.0, 16.0], [12425.0, 16.0], [12438.0, 16.0], [3429.0, 16.0], [4284.0, 7.0], [6768.0, 8.0], [7353.0, 10.0], [7192.0, 13.0], [7528.0, 16.0], [7663.0, 17.0]], "isOverall": false, "label": "Failures", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 12438.0, "title": "Latencies Vs Request"}},
    getOptions: function() {
        return{
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Latency in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: { noColumns: 2,show: true, container: '#legendLatencyVsRequest' },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median Latency time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesLatencyVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotLatenciesVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewLatenciesVsRequest"), dataset, prepareOverviewOptions(options));
    }
};

// Latencies vs Request
function refreshLatenciesVsRequest() {
        var infos = latenciesVsRequestInfos;
        prepareSeries(infos.data);
        if(isGraph($("#flotLatenciesVsRequest"))){
            infos.createGraph();
        }else{
            var choiceContainer = $("#choicesLatencyVsRequest");
            createLegend(choiceContainer, infos);
            infos.createGraph();
            setGraphZoomable("#flotLatenciesVsRequest", "#overviewLatenciesVsRequest");
            $('#footerLatenciesVsRequest .legendColorBox > div').each(function(i){
                $(this).clone().prependTo(choiceContainer.find("li").eq(i));
            });
        }
};

var hitsPerSecondInfos = {
        data: {"result": {"minY": 327.5833333333333, "minX": 1.78919886E12, "maxY": 4532.916666666667, "series": [{"data": [[1.78919892E12, 4532.916666666667], [1.78919886E12, 327.5833333333333]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.78919892E12, "title": "Hits Per Second"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of hits / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendHitsPerSecond"
                },
                selection: {
                    mode : 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y.2 hits/sec"
                }
            };
        },
        createGraph: function createGraph() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesHitsPerSecond"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotHitsPerSecond"), dataset, options);
            // setup overview
            $.plot($("#overviewHitsPerSecond"), dataset, prepareOverviewOptions(options));
        }
};

// Hits per second
function refreshHitsPerSecond(fixTimestamps) {
    var infos = hitsPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if (isGraph($("#flotHitsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesHitsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotHitsPerSecond", "#overviewHitsPerSecond");
        $('#footerHitsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var codesPerSecondInfos = {
        data: {"result": {"minY": 20.083333333333332, "minX": 1.78919886E12, "maxY": 4534.4, "series": [{"data": [[1.78919886E12, 20.083333333333332]], "isOverall": false, "label": "200", "isController": false}, {"data": [[1.78919892E12, 4534.4], [1.78919886E12, 306.01666666666665]], "isOverall": false, "label": "401", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.78919892E12, "title": "Codes Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendCodesPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "Number of Response Codes %s at %x was %y.2 responses / sec"
                }
            };
        },
    createGraph: function() {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesCodesPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotCodesPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewCodesPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Codes per second
function refreshCodesPerSecond(fixTimestamps) {
    var infos = codesPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotCodesPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesCodesPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotCodesPerSecond", "#overviewCodesPerSecond");
        $('#footerCodesPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var transactionsPerSecondInfos = {
        data: {"result": {"minY": 20.083333333333332, "minX": 1.78919886E12, "maxY": 4534.4, "series": [{"data": [[1.78919886E12, 20.083333333333332]], "isOverall": false, "label": "POST /voucher-order/seckill-success", "isController": false}, {"data": [[1.78919892E12, 4534.4], [1.78919886E12, 306.01666666666665]], "isOverall": false, "label": "POST /voucher-order/seckill-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.78919892E12, "title": "Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTransactionsPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                }
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTransactionsPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTransactionsPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewTransactionsPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Transactions per second
function refreshTransactionsPerSecond(fixTimestamps) {
    var infos = transactionsPerSecondInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTransactionsPerSecond");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotTransactionsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTransactionsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTransactionsPerSecond", "#overviewTransactionsPerSecond");
        $('#footerTransactionsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var totalTPSInfos = {
        data: {"result": {"minY": 20.083333333333332, "minX": 1.78919886E12, "maxY": 4534.4, "series": [{"data": [[1.78919886E12, 20.083333333333332]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [[1.78919892E12, 4534.4], [1.78919886E12, 306.01666666666665]], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.78919892E12, "title": "Total Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTotalTPS"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                },
                colors: ["#9ACD32", "#FF6347"]
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTotalTPS"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTotalTPS"), dataset, options);
        // setup overview
        $.plot($("#overviewTotalTPS"), dataset, prepareOverviewOptions(options));
    }
};

// Total Transactions per second
function refreshTotalTPS(fixTimestamps) {
    var infos = totalTPSInfos;
    // We want to ignore seriesFilter
    prepareSeries(infos.data, false, true);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotTotalTPS"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTotalTPS");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTotalTPS", "#overviewTotalTPS");
        $('#footerTotalTPS .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

// Collapse the graph matching the specified DOM element depending the collapsed
// status
function collapse(elem, collapsed){
    if(collapsed){
        $(elem).parent().find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    } else {
        $(elem).parent().find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up");
        if (elem.id == "bodyBytesThroughputOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshBytesThroughputOverTime(true);
            }
            document.location.href="#bytesThroughputOverTime";
        } else if (elem.id == "bodyLatenciesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesOverTime(true);
            }
            document.location.href="#latenciesOverTime";
        } else if (elem.id == "bodyCustomGraph") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCustomGraph(true);
            }
            document.location.href="#responseCustomGraph";
        } else if (elem.id == "bodyConnectTimeOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshConnectTimeOverTime(true);
            }
            document.location.href="#connectTimeOverTime";
        } else if (elem.id == "bodyResponseTimePercentilesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimePercentilesOverTime(true);
            }
            document.location.href="#responseTimePercentilesOverTime";
        } else if (elem.id == "bodyResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeDistribution();
            }
            document.location.href="#responseTimeDistribution" ;
        } else if (elem.id == "bodySyntheticResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshSyntheticResponseTimeDistribution();
            }
            document.location.href="#syntheticResponseTimeDistribution" ;
        } else if (elem.id == "bodyActiveThreadsOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshActiveThreadsOverTime(true);
            }
            document.location.href="#activeThreadsOverTime";
        } else if (elem.id == "bodyTimeVsThreads") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTimeVsThreads();
            }
            document.location.href="#timeVsThreads" ;
        } else if (elem.id == "bodyCodesPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCodesPerSecond(true);
            }
            document.location.href="#codesPerSecond";
        } else if (elem.id == "bodyTransactionsPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTransactionsPerSecond(true);
            }
            document.location.href="#transactionsPerSecond";
        } else if (elem.id == "bodyTotalTPS") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTotalTPS(true);
            }
            document.location.href="#totalTPS";
        } else if (elem.id == "bodyResponseTimeVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeVsRequest();
            }
            document.location.href="#responseTimeVsRequest";
        } else if (elem.id == "bodyLatenciesVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesVsRequest();
            }
            document.location.href="#latencyVsRequest";
        }
    }
}

/*
 * Activates or deactivates all series of the specified graph (represented by id parameter)
 * depending on checked argument.
 */
function toggleAll(id, checked){
    var placeholder = document.getElementById(id);

    var cases = $(placeholder).find(':checkbox');
    cases.prop('checked', checked);
    $(cases).parent().children().children().toggleClass("legend-disabled", !checked);

    var choiceContainer;
    if ( id == "choicesBytesThroughputOverTime"){
        choiceContainer = $("#choicesBytesThroughputOverTime");
        refreshBytesThroughputOverTime(false);
    } else if(id == "choicesResponseTimesOverTime"){
        choiceContainer = $("#choicesResponseTimesOverTime");
        refreshResponseTimeOverTime(false);
    }else if(id == "choicesResponseCustomGraph"){
        choiceContainer = $("#choicesResponseCustomGraph");
        refreshCustomGraph(false);
    } else if ( id == "choicesLatenciesOverTime"){
        choiceContainer = $("#choicesLatenciesOverTime");
        refreshLatenciesOverTime(false);
    } else if ( id == "choicesConnectTimeOverTime"){
        choiceContainer = $("#choicesConnectTimeOverTime");
        refreshConnectTimeOverTime(false);
    } else if ( id == "choicesResponseTimePercentilesOverTime"){
        choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        refreshResponseTimePercentilesOverTime(false);
    } else if ( id == "choicesResponseTimePercentiles"){
        choiceContainer = $("#choicesResponseTimePercentiles");
        refreshResponseTimePercentiles();
    } else if(id == "choicesActiveThreadsOverTime"){
        choiceContainer = $("#choicesActiveThreadsOverTime");
        refreshActiveThreadsOverTime(false);
    } else if ( id == "choicesTimeVsThreads"){
        choiceContainer = $("#choicesTimeVsThreads");
        refreshTimeVsThreads();
    } else if ( id == "choicesSyntheticResponseTimeDistribution"){
        choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        refreshSyntheticResponseTimeDistribution();
    } else if ( id == "choicesResponseTimeDistribution"){
        choiceContainer = $("#choicesResponseTimeDistribution");
        refreshResponseTimeDistribution();
    } else if ( id == "choicesHitsPerSecond"){
        choiceContainer = $("#choicesHitsPerSecond");
        refreshHitsPerSecond(false);
    } else if(id == "choicesCodesPerSecond"){
        choiceContainer = $("#choicesCodesPerSecond");
        refreshCodesPerSecond(false);
    } else if ( id == "choicesTransactionsPerSecond"){
        choiceContainer = $("#choicesTransactionsPerSecond");
        refreshTransactionsPerSecond(false);
    } else if ( id == "choicesTotalTPS"){
        choiceContainer = $("#choicesTotalTPS");
        refreshTotalTPS(false);
    } else if ( id == "choicesResponseTimeVsRequest"){
        choiceContainer = $("#choicesResponseTimeVsRequest");
        refreshResponseTimeVsRequest();
    } else if ( id == "choicesLatencyVsRequest"){
        choiceContainer = $("#choicesLatencyVsRequest");
        refreshLatenciesVsRequest();
    }
    var color = checked ? "black" : "#818181";
    if(choiceContainer != null) {
        choiceContainer.find("label").each(function(){
            this.style.color = color;
        });
    }
}

