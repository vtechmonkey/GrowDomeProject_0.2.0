(function () {
  'use strict';

  angular
    .module('charts')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Charts',
      state: 'charts',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'charts', {
      title: 'List Charts',
      state: 'charts.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'charts', {
      title: 'Create Chart',
      state: 'charts.create',
      roles: ['user']
    });
  }
})();
