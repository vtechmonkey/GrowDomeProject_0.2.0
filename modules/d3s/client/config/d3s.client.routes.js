(function () {
  'use strict';

  angular
    .module('d3s')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('d3s', {
        abstract: true,
        url: '/d3s',
        template: '<ui-view/>'
      })
      .state('d3s.list', {
        url: '',
        templateUrl: 'modules/d3s/client/views/list-d3s.client.view.html',
        controller: 'D3sListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'D3s List'
        }
      })
      .state('d3s.create', {
        url: '/create',
        templateUrl: 'modules/d3s/client/views/form-d3.client.view.html',
        controller: 'D3sController',
        controllerAs: 'vm',
        resolve: {
          d3Resolve: newD3
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'D3s Create'
        }
      })
      .state('d3s.edit', {
        url: '/:d3Id/edit',
        templateUrl: 'modules/d3s/client/views/form-d3.client.view.html',
        controller: 'D3sController',
        controllerAs: 'vm',
        resolve: {
          d3Resolve: getD3
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit D3 {{ d3Resolve.name }}'
        }
      })
      .state('d3s.view', {
        url: '/:d3Id',
        templateUrl: 'modules/d3s/client/views/view-d3.client.view.html',
        controller: 'D3sController',
        controllerAs: 'vm',
        resolve: {
          d3Resolve: getD3
        },
        data:{
          pageTitle: 'D3 {{ articleResolve.name }}'
        }
      });
  }

  getD3.$inject = ['$stateParams', 'D3sService'];

  function getD3($stateParams, D3sService) {
    return D3sService.get({
      d3Id: $stateParams.d3Id
    }).$promise;
  }

  newD3.$inject = ['D3sService'];

  function newD3(D3sService) {
    return new D3sService();
  }
})();
