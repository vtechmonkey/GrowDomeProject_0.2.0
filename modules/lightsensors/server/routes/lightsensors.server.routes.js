'use strict';

/**
 * Module dependencies
 */
var lightsensorsPolicy = require('../policies/lightsensors.server.policy'),
  lightsensors = require('../controllers/lightsensors.server.controller');

module.exports = function(app) {
  // Lightsensors Routes
  app.route('/api/lightsensors').all(lightsensorsPolicy.isAllowed)
    .get(lightsensors.list)
    .post(lightsensors.create);

  app.route('/api/lightsensors/:lightsensorId').all(lightsensorsPolicy.isAllowed)
    .get(lightsensors.read)
    .put(lightsensors.update)
    .delete(lightsensors.delete);

  // Finish by binding the Lightsensor middleware
  app.param('lightsensorId', lightsensors.lightsensorByID);
};
