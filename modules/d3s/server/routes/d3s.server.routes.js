'use strict';

/**
 * Module dependencies
 */
var d3sPolicy = require('../policies/d3s.server.policy'),
  d3s = require('../controllers/d3s.server.controller');

module.exports = function(app) {
  // D3s Routes
  app.route('/api/d3s').all(d3sPolicy.isAllowed)
    .get(d3s.list)
    .post(d3s.create);

  app.route('/api/d3s/:d3Id').all(d3sPolicy.isAllowed)
    .get(d3s.read)
    .put(d3s.update)
    .delete(d3s.delete);

  // Finish by binding the D3 middleware
  app.param('d3Id', d3s.d3ByID);
};
