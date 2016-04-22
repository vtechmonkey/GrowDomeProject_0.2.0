'use strict';

//Volunteers service used to communicate Volunteers REST endpoints
angular
  .module('volunteers')
  .factory('Volunteers', ['$resource',
    function ($resource) {
      return $resource('api/volunteers/:volunteerId', {
        volunteerId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      });
    }
  ]);





