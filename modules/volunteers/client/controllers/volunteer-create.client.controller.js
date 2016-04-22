'use strict';

angular.module('volunteers').controller('VolunteersCreateController', ['$scope', 'Volunteers', 'Notify',
  function ($scope, Volunteers, Notify) {
    //volunteer controller logic

    $scope.experienceLevel = [
      { id: '1', item: 'beginner' },
      { id: '2', item: 'intermediate' },
      { id: '3', item: 'advanced' }

    ];

    // Create new Volunteer
    this.create = function () {
      // Create new Volunteer object
      var volunteer = new Volunteers({
        firstName: this.firstName,
        lastName: this.lastName,
        phone: this.phone,
        email: this.email,
        experienceLevel: this.experienceLevel
      });

      // Redirect after save
      volunteer.$save(function (response) {

        Notify.sendMsg('NewVolunteer', { 'id': response._id });

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);
/**
 * Created by Sarah on 17/02/2016.
 */
