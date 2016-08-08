(function () {
  'use strict';

  angular
    .module('lightsensors')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Lightsensors',
      state: 'lightsensors',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'lightsensors', {
      title: 'List Lightsensors',
      state: 'lightsensors.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'lightsensors', {
      title: 'Create Lightsensor',
      state: 'lightsensors.create',
      roles: ['user']
    });
  }
})();
