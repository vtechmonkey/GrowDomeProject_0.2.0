'use strict';

// Volunteers controller
angular.module('volunteers').controller('VolunteersController', ['$scope', '$stateParams','$location', 'Authentication', 'Volunteers', '$modal', '$log',
  function ($scope,$location, $stateParams, Authentication, Volunteers, $modal, $log) {


    this.authentication = Authentication;

    // If user is not signed in then redirect back home
    if (!Authentication.user) {
      $location.path('/');
    }

    // Find a list of Volunteers
    this.volunteers = Volunteers.query();

    //open a modal window to create a single volunteer record
    this.modalCreate = function (size) {

      var modalInstance = $modal.open({
        templateUrl: 'modules/volunteers/client/views/create-volunteer.modal.view.html',
        controller: function ($scope, $modalInstance) {


          $scope.ok = function (isValid) {
            console.log(isValid);
            $modalInstance.close();
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        },
        size: size
      });
      modalInstance.result.then(function (selectedItem) {

      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    //open a modal window to update a single volunteer record
    this.modalUpdate = function (size, selectedVolunteer) {

      var modalInstance = $modal.open({

        templateUrl: 'modules/volunteers/client/views/update-volunteer.modal.view.html',
        controller: function ($scope, $modalInstance, aVolunteer) {

          $scope.theVolunteer = {};

          $scope.theVolunteer = angular.copy(aVolunteer);

          $scope.ok = function () {
            $modalInstance.close();
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        },
        size: size,
        resolve: {
          aVolunteer: function () {
            return selectedVolunteer;
          }
        }
      });
      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };


    // Remove existing Volunteer
    this.remove = function (volunteer) {
      if (volunteer) {
        volunteer.$remove();

        for (var i in this.volunteers) {
          if (this.volunteers [i] === volunteer) {
            this.volunteers.splice(i, 1);
          }
        }
      } else {
        this.volunteer.$remove(function () {
        });
      }
    };
  }
]);







