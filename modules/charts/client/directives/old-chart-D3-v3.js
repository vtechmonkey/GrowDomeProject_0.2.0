// /*
//  * Created by Sarah on 24/04/2016.
//  */
// (function () {
//   'use strict';

//   angular
//   .module('charts')
//   .directive('linearChart', linearChart);

//   linearChart.$inject = [ '$window'];

//   function linearChart($window) {
    
//     return{
//       restrict: 'EA',
//       template: '<svg width="850" height="350"></svg>',
//       link: function postLink(scope, elem, attrs){
        
//         console.log(scope.vm.charts[0].hour);

//         var chartData= scope.vm.charts;
//         var padding = 20;
//         var pathClass='path';
//         var xScale, yScale, xAxisGen, yAxisGen, lineFun;

//         var d3 = $window.d3;
//         var rawSvg=elem.find('svg');
//         var svg = d3.select(rawSvg[0]);
        

//         function setChartParameters(){

//           xScale = d3.scale.linear()
//              .domain([0,10])
//              .range([padding + 5, rawSvg.attr('width') - padding]);

//           yScale = d3.scale.linear()
//              .domain([0, d3.max(chartData, function (d) {
//                return d.sales;
//              })])
//              .range([rawSvg.attr('height') - padding, 0]);

//           xAxisGen = d3.svg.axis()
//              .scale(xScale)
//              .orient('bottom')
//              .ticks(10); //chartData.length - 1);

//           yAxisGen = d3.svg.axis()
//              .scale(yScale)
//              .orient('left')
//              .ticks(5);

//           lineFun = d3.svg.line()
//              .x(function (d) {
//                return xScale(d.hour);

//              })
//              .y(function (d) {
//                return yScale(d.sales);
//              })
//              .interpolate('linear');
//         }

//         function drawLineChart() {

//           setChartParameters();

//           svg.append('svg:g')
//              .attr('class', 'x axis')
//              .attr('transform', 'translate(20,300)')
//              .call(xAxisGen);

//           svg.append('svg:g')
//              .attr('class', 'y axis')
//              .attr('transform', 'translate(80,0)')
//              .call(yAxisGen);

//           svg.append('svg:path')
//              .attr({
//                d: lineFun(chartData),
//                'stroke': 'pink',
//                'stroke-width': 2,
//                'fill': 'none',
//                'class': pathClass
//              });
//         }

//         drawLineChart();
//       }
//     };
//   }
// })();