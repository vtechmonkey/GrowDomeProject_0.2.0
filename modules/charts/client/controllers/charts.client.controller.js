(function () {
  'use strict';

  // Charts controller
  angular
    .module('charts')
    .controller('ChartsController', ChartsController);

  ChartsController.$inject = ['$scope', '$state', 'Authentication', 'chartResolve'];

  function ChartsController ($scope, $state, Authentication, chart) {
    var vm = this;

    vm.authentication = Authentication;
    vm.chart = chart;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Chart
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.chart.$remove($state.go('charts.list'));
      }
    }

    // Save Chart
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.ChartForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.chart._id) {
        vm.chart.$update(successCallback, errorCallback);
      } else {
        vm.chart.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('charts.view', {
          ChartId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();



//   // function ChartsController ($scope) {
//     // $scope.salesData = [
//     //   { hour: 1, sales: 54 },
//     //   { hour: 2, sales: 66 },
//     //   { hour: 3, sales: 77 },
//     //   { hour: 4, sales: 70 },
//     //   { hour: 5, sales: 60 },
//     //   { hour: 6, sales: 63 },
//     //   { hour: 7, sales: 55 },
//     //   { hour: 8, sales: 47 },
//     //   { hour: 9, sales: 55 },
//     //   { hour: 10, sales: 30 }
//     // ];

//   // }
