'use strict';

/**
 * Module dependencies
 */
var chartsPolicy = require('../policies/charts.server.policy'),
  charts = require('../controllers/charts.server.controller');

module.exports = function(app) {
  // Charts Routes
  app.route('/api/charts').all(chartsPolicy.isAllowed)
    .get(charts.list)
    .post(charts.create);

  app.route('/api/charts/:chartId').all(chartsPolicy.isAllowed)
    .get(charts.read)
    .put(charts.update)
    .delete(charts.delete);

  // Finish by binding the Chart middleware
  app.param('chartId', charts.chartByID);
};
