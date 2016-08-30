(function () {
  'use strict';

  angular
    .module('lightsensors')
    .controller('LightsensorsListController', LightsensorsListController);

  LightsensorsListController.$inject = ['LightsensorsService', '$scope'];

  function LightsensorsListController(LightsensorsService, $scope) {
    var vm = this;
    vm.lightsensors = LightsensorsService.query();
  }
})();