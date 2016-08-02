(function () {
  'use strict';

  angular
    .module('twitters')
    .controller('TwittersListController', TwittersListController);

  TwittersListController.$inject = ['TwittersService'];

  function TwittersListController(TwittersService) {
    var vm = this;

    vm.twitters = TwittersService.query();
  }
})();
