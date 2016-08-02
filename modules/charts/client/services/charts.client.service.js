//Charts service used to communicate Charts REST endpoints
(function () {
  'use strict';

  angular
    .module('charts')
    .factory('ChartsService', ChartsService);

  ChartsService.$inject = ['$resource'];

  function ChartsService($resource) {
    return $resource('api/charts/:chartId', {
      chartId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
