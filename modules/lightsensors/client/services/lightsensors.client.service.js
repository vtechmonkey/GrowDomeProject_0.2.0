//Lightsensors service used to communicate Lightsensors REST endpoints
(function () {
  'use strict';

  angular
    .module('lightsensors')
    .factory('LightsensorsService', LightsensorsService);

  LightsensorsService.$inject = ['$resource'];

  function LightsensorsService($resource) {
    return $resource('api/lightsensors/:lightsensorId', {
      lightsensorId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
