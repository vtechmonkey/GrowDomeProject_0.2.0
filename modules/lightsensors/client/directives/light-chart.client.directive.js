/*
 * Created by Sarah on 24/04/2016.
 */
(function () {
  'use strict';

  angular
  .module('lightsensors')
  .directive('lightChart', lightChart);

  lightChart.$inject = ['$window'];

  function lightChart($window) {
        
    return{
      restrict:'EA',
      template:'<svg width="950" height="350"></svg>',
      link: function link(scope, elem, attrs){
        var data = scope.vm.lightsensors;
        var padding= 20;
        var pathClass='path';
        var xScale, yScale, lineFun;

        var d3 = $window.d3;
        var rawSvg=elem.find('svg');
        var svg =d3.select(rawSvg[0]);
      
      
        
        function setChartParameters(){

          xScale = d3.scaleLinear()
          .domain([
            d3.min(data,function(d){
              return d.payload.timestamp;
            }), 
            d3.max(data, function(d){
              return d.payload.timestamp;
            })])
          .range ([padding + 5, rawSvg.attr('width') - padding]);

          yScale = d3.scaleLinear()
            .domain([0,d3.max(data, function(d){
              return d.payload.value;
            })])
            .range([rawSvg.attr('height') -padding, 0]);

          lineFun = d3.line()
            .x(function(d){
              return xScale(d.payload.timestamp);
            })
            .y(function(d){
              return yScale(d.payload.value);
            });
        }

        function drawLineChart() {

          setChartParameters();

          svg.append('svg:g')
              .attr('transform', 'translate(0,330)')
              .call(d3.axisBottom(xScale));

          svg.append('svg:g')
              .attr('transform', 'translate(20,0)')
              .call(d3.axisLeft(yScale));

          svg.append('svg:path')
              .data([data])
              .attr('class', pathClass)
              .attr('d', lineFun);
        }

        drawLineChart();
          
      }
        
    };
  }
})();


          //parse the timestamp
       // var parseTime = d3.timeFormat('%d-%m-%y %H:%M');
           