(function () {
  'use strict';

  // Twitters controller
  angular
    .module('twitters')
    .controller('TwittersController', TwittersController);

  TwittersController.$inject = ['$scope', '$state', 'Authentication', 'twitterResolve'];

  function TwittersController ($scope, $state, Authentication, twitter) {
    var vm = this;

    vm.authentication = Authentication;
    vm.twitter = twitter;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Twitter
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.twitter.$remove($state.go('twitters.list'));
      }
    }

    // Save Twitter
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.twitterForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.twitter._id) {
        vm.twitter.$update(successCallback, errorCallback);
      } else {
        vm.twitter.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('twitters.view', {
          twitterId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
