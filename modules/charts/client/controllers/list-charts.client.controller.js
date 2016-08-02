(function () {
  'use strict';

  angular
    .module('charts')
    .controller('ChartsListController', ChartsListController);

  ChartsListController.$inject = ['ChartsService'];

  function ChartsListController(ChartsService) {
    var vm = this;

    vm.charts = ChartsService.query();
  }
})();
