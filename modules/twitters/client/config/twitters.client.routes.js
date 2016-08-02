(function () {
  'use strict';

  angular
    .module('twitters')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('twitters', {
        abstract: true,
        url: '/twitters',
        template: '<ui-view/>'
      })
      .state('twitters.list', {
        url: '',
        templateUrl: 'modules/twitters/client/views/list-twitters.client.view.html',
        controller: 'TwittersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Twitters List'
        }
      })
      .state('twitters.create', {
        url: '/create',
        templateUrl: 'modules/twitters/client/views/form-twitter.client.view.html',
        controller: 'TwittersController',
        controllerAs: 'vm',
        resolve: {
          twitterResolve: newTwitter
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Twitters Create'
        }
      })
      .state('twitters.edit', {
        url: '/:twitterId/edit',
        templateUrl: 'modules/twitters/client/views/form-twitter.client.view.html',
        controller: 'TwittersController',
        controllerAs: 'vm',
        resolve: {
          twitterResolve: getTwitter
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Twitter {{ twitterResolve.name }}'
        }
      })
      .state('twitters.view', {
        url: '/:twitterId',
        templateUrl: 'modules/twitters/client/views/view-twitter.client.view.html',
        controller: 'TwittersController',
        controllerAs: 'vm',
        resolve: {
          twitterResolve: getTwitter
        },
        data:{
          pageTitle: 'Twitter {{ articleResolve.name }}'
        }
      });
  }

  getTwitter.$inject = ['$stateParams', 'TwittersService'];

  function getTwitter($stateParams, TwittersService) {
    return TwittersService.get({
      twitterId: $stateParams.twitterId
    }).$promise;
  }

  newTwitter.$inject = ['TwittersService'];

  function newTwitter(TwittersService) {
    return new TwittersService();
  }
})();
