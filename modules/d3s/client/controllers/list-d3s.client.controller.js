(function () {
  'use strict';

  angular
    .module('d3s')
    .controller('D3sListController', D3sListController);

  D3sListController.$inject = ['D3sService'];

  function D3sListController(D3sService) {
    var vm = this;

    vm.d3s = D3sService.query();
  }
})();
