(function () {
  'use strict';

  angular
    .module('core')
    .directive('d3Directive', d3Directive);

  d3Directive.$inject = [/*Example: '$state', '$window' */];

  function d3Directive(/*Example: $state, $window */) {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        // D3 directive directive logic
        // ...

        element.text('this is the d3Directive directive');
      }
    };
  }
})();
