'use strict';

 //gruntConfiguring the Customers module
angular.module('customers').run(['Menus',
  function (Menus) {
    // Add the Customers dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Customers',
      state: 'customers',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'customers', {
      title: 'List Customers',
      state: 'listCustomers'
    });

  }
]);
