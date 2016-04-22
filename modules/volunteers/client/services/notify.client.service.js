/**
 * Created by Sarah on 17/02/2016.
 */
'use strict';

angular.module('volunteers').factory('Notify', ['$rootScope',
  function($rootScope) {
    // Notify service logic
    // Public API

    var notify = {};

    notify.sendMsg = function(msg, data) {
      data = data || {};
      $rootScope.$emit(msg, data);

    };

    notify.getMsg = function(msg, func, scope) {
      var unbind = $rootScope.$on(msg, func);

      if (scope) {
        scope.$on('destroy', unbind);
      }
    };

    return notify;
  }

]);
