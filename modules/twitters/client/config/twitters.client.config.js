(function () {
  'use strict';

  angular
    .module('twitters')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Tweets',
      state: 'twitters',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'twitters', {
      title: 'List Tweets',
      state: 'twitters.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'twitters', {
      title: 'Create Twitter',
      state: 'twitters.create',
      roles: ['user']
    });
  }
})();
