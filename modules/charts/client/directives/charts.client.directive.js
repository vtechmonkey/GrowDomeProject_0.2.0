/*
 * Created by Sarah on 24/04/2016.
 */
(function () {
  'use strict';

  angular
  .module('charts')
  .directive('linearChart', linearChart);

  linearChart.$inject = [ '$window'];

  function linearChart($window) {
    
    return{
      restrict: 'EA',
      template: '<svg width="850" height="350"></svg>',
      link: function postLink(scope, elem, attrs){
        
        console.log(scope.vm.charts[0].hour);

        var chartData= scope.vm.charts;
        var padding = 20;
        var pathClass='path';
        var xScale, yScale, lineFun;

        var d3 = $window.d3;
        var rawSvg=elem.find('svg');
        var svg = d3.select(rawSvg[0]);
        

        function setChartParameters(){

          xScale = d3.scaleLinear()
             .domain([0,10])
             .range([padding + 5, rawSvg.attr('width') - padding]);

          yScale = d3.scaleLinear()
             .domain([0, d3.max(chartData, function (d) {
               return d.sales;
             })])
             .range([rawSvg.attr('height') - padding, 0]);           

          lineFun = d3.line()
             .x(function (d) {
               return xScale(d.hour);
             })
             .y(function (d) {
               return yScale(d.sales);
             });          
        }

        function drawLineChart() {

          setChartParameters();

          svg.append('svg:g')
             .attr('transform', 'translate(20,300)')
             .call(d3.axisBottom(xScale));

          svg.append('svg:g')
             .attr('transform', 'translate(80,0)')
             .call(d3.axisLeft(yScale));

          svg.append('svg:path')
             .data([chartData])
             .attr('class', pathClass)
             .attr('d', lineFun);
              
        }

        drawLineChart();
      }
    };
  }
})();