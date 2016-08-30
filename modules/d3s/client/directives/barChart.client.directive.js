(function () {
  'use strict';

  angular
    .module('d3s')
    .directive('barChart', barChart);

  barChart.$inject = ['chart','d3s'/*Example: '$state', '$window' */];

  function barChart(chart,d3s/*Example: $state, $window */) {
    return {
      template: '<div></div>',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
        
        // barChart directive logic
        // ...

        element.text('this is the barChart directive');
      }
    };
  }
})(); 
