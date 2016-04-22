/**
 * Created by Sarah on 17/02/2016.
 */
'use strict';

angular.module('volunteers').directive('volunteerList', ['Volunteers', 'Notify',
  function(Volunteers, Notify) {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'modules/volunteers/client/views/volunteer-list-template.html',
      link: function(scope, element, attrs){
        //when a new volunteer is added, update the volunteer list
        Notify.getMsg('NewVolunteer', function(event, data) {
          scope.volunteersCtrl.volunteers = Volunteers.query();
        });
        Notify.getMsg('UpdatedVolunteer', function(event, data) {
          scope.volunteersCtrl.volunteers = Volunteers.query();
        });
      }
    };
  }]);
