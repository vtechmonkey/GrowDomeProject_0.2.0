//D3s service used to communicate D3s REST endpoints
(function () {
  'use strict';

  angular
    .module('d3s')
    .factory('D3sService', D3sService);

  D3sService.$inject = ['$resource'];

  function D3sService($resource) {
    return $resource('api/d3s/:d3Id', {
      d3Id: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
