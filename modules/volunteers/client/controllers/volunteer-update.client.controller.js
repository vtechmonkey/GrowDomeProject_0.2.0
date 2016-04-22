'use strict';

angular.module('volunteers').controller('VolunteersUpdateController', ['$scope', 'Volunteers', 'Notify',
  function ($scope, Volunteers, Notify) {

    $scope.experienceLevel = [
      { id: '1', item: 'beginner' },
      { id: '2', item: 'intermediate' },
      { id: '3', item: 'advanced' }

    ];

    //Update existing Volunteer
    this.update = function (updatedVolunteer) {
      var volunteer = updatedVolunteer;

      volunteer.$update(function (response) {

        Notify.sendMsg('UpdatedVolunteer', { 'id': response._id });

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

  }
]);

