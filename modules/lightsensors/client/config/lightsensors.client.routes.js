(function () {
  'use strict';

  angular
    .module('lightsensors')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('lightsensors', {
        abstract: true,
        url: '/lightsensors',
        template: '<ui-view/>'
      })
      .state('lightsensors.list', {
        url: '',
        templateUrl: 'modules/lightsensors/client/views/list-lightsensors.client.view.html',
        controller: 'LightsensorsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Lightsensors List'
        }
      })
      .state('lightsensors.create', {
        url: '/create',
        templateUrl: 'modules/lightsensors/client/views/form-lightsensor.client.view.html',
        controller: 'LightsensorsController',
        controllerAs: 'vm',
        resolve: {
          lightsensorResolve: newLightsensor
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Lightsensors Create'
        }
      })
      .state('lightsensors.edit', {
        url: '/:lightsensorId/edit',
        templateUrl: 'modules/lightsensors/client/views/form-lightsensor.client.view.html',
        controller: 'LightsensorsController',
        controllerAs: 'vm',
        resolve: {
          lightsensorResolve: getLightsensor
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Lightsensor {{ lightsensorResolve.name }}'
        }
      })
      .state('lightsensors.view', {
        url: '/:lightsensorId',
        templateUrl: 'modules/lightsensors/client/views/view-lightsensor.client.view.html',
        controller: 'LightsensorsController',
        controllerAs: 'vm',
        resolve: {
          lightsensorResolve: getLightsensor
        },
        data:{
          pageTitle: 'Lightsensor {{ articleResolve.name }}'
        }
      });
  }

  getLightsensor.$inject = ['$stateParams', 'LightsensorsService'];

  function getLightsensor($stateParams, LightsensorsService) {
    return LightsensorsService.get({
      lightsensorId: $stateParams.lightsensorId
    }).$promise;
  }

  newLightsensor.$inject = ['LightsensorsService'];

  function newLightsensor(LightsensorsService) {
    return new LightsensorsService();
  }
})();
