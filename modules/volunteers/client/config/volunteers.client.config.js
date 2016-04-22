'use strict';


angular
  .module('volunteers').run(['Menus',

  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Volunteers',
      state: 'volunteers',
      type: 'dropdown'
   //   roles: ['*']
    });

    // add dropdown list item
    Menus.addSubMenuItem('topbar', 'volunteers', {
      title: 'List Volunteers',
      state: 'listVolunteers'
    });

  }
]);
