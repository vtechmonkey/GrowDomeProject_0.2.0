(function () {
  'use strict';

  // Lightsensors controller
  angular
    .module('lightsensors')
    .controller('LightsensorsController', LightsensorsController);

  LightsensorsController.$inject = ['$scope', '$state', 'Authentication', 'lightsensorResolve'];

  function LightsensorsController ($scope, $state, Authentication, lightsensor) {
    var vm = this;

    vm.authentication = Authentication;
    vm.lightsensor = lightsensor;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Lightsensor
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.lightsensor.$remove($state.go('lightsensors.list'));
      }
    }

    // Save Lightsensor
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.lightsensorForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.lightsensor._id) {
        vm.lightsensor.$update(successCallback, errorCallback);
      } else {
        vm.lightsensor.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('lightsensors.view', {
          lightsensorId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
