(function () {
  'use strict';

  angular
    .module('charts')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('charts', {
        abstract: true,
        url: '/charts',
        template: '<ui-view/>'
      })
      .state('charts.list', {
        url: '',
        templateUrl: 'modules/charts/client/views/list-charts.client.view.html',
        controller: 'ChartsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Charts List'
        }
      })
      .state('charts.create', {
        url: '/create',
        templateUrl: 'modules/charts/client/views/form-chart.client.view.html',
        controller: 'ChartsController',
        controllerAs: 'vm',
        resolve: {
          chartResolve: newChart
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Charts Create'
        }
      })
      .state('charts.edit', {
        url: '/:chartId/edit',
        templateUrl: 'modules/charts/client/views/form-chart.client.view.html',
        controller: 'ChartsController',
        controllerAs: 'vm',
        resolve: {
          chartResolve: getChart
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Chart {{ chartResolve.name }}'
        }
      })
      .state('charts.view', {
        url: '/:chartId',
        templateUrl: 'modules/charts/client/views/view-chart.client.view.html',
        controller: 'ChartsController',
        controllerAs: 'vm',
        resolve: {
          chartResolve: getChart
        },
        data:{
          pageTitle: 'Chart {{ articleResolve.name }}'
        }
      });
  }

  getChart.$inject = ['$stateParams', 'ChartsService'];

  function getChart($stateParams, ChartsService) {
    return ChartsService.get({
      chartId: $stateParams.chartId
    }).$promise;
  }

  newChart.$inject = ['ChartsService'];

  function newChart(ChartsService) {
    return new ChartsService();
  }
})();
