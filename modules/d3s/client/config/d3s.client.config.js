(function () {
  'use strict';

  angular
    .module('d3s')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'D3s',
      state: 'd3s',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'd3s', {
      title: 'List D3s',
      state: 'd3s.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'd3s', {
      title: 'Create D3',
      state: 'd3s.create',
      roles: ['user']
    });
  }
})();
