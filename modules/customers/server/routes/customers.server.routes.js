'use strict';

module.exports = function(app) {
  var customers = require('../controllers/customers.server.controller');
  var customersPolicy = require('../policies/customers.server.policy');

  // Customers Routes
  app.route('/api/customers').all()
    .get(customers.list).all(customersPolicy.isAllowed)
    .post(customers.create);

  app.route('/api/customers/:customerId').all(customersPolicy.isAllowed)
    .get(customers.read)
    .put(customers.update)
    .delete(customers.delete);

  // Finish by binding the Customer middleware
  app.param('customerId', customers.customerByID);
};
