//Twitters service used to communicate Twitters REST endpoints
(function () {
  'use strict';

  angular
    .module('twitters')
    .factory('TwittersService', TwittersService);

  TwittersService.$inject = ['$resource'];

  function TwittersService($resource) {
    return $resource('api/twitters/:twitterId', {
      twitterId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
