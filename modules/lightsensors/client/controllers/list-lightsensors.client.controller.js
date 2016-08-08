(function () {
  'use strict';

  angular
    .module('lightsensors')
    .controller('LightsensorsListController', LightsensorsListController);

  LightsensorsListController.$inject = ['LightsensorsService'];

  function LightsensorsListController(LightsensorsService) {
    var vm = this;

    vm.lightsensors = LightsensorsService.query();
  }
})();
