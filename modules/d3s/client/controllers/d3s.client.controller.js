(function () {
  'use strict';

  // D3s controller
  angular
    .module('d3s')
    .controller('D3sController', D3sController);

  D3sController.$inject = ['$scope', '$state', 'Authentication', 'd3Resolve'];

  function D3sController ($scope, $state, Authentication, d3) {
    var vm = this;

    vm.authentication = Authentication;
    vm.d3 = d3;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing D3
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.d3.$remove($state.go('d3s.list'));
      }
    }

    // Save D3
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.d3Form');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.d3._id) {
        vm.d3.$update(successCallback, errorCallback);
      } else {
        vm.d3.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('d3s.view', {
          d3Id: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
