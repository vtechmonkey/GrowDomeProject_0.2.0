'use strict';

//Setting up route
angular.module('volunteers').config(['$stateProvider',
  function ($stateProvider) {
    // Volunteers state routing
    $stateProvider.
    state('listVolunteers', {
      url: '/volunteers',
      templateUrl: 'modules/volunteers/client/views/list-volunteers.client.view.html',
      data: {
        roles: ['user', 'admin']
      }
    });
  }
]);
