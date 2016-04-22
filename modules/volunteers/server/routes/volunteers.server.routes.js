'use strict';

module.exports = function (app) {

  var volunteers = require('../controllers/volunteers.server.controller');
  var volunteersPolicy = require('../policies/volunteers.server.policy');


  // Articles collection routes
  app.route('/api/volunteers').all()
    .get(volunteers.list).all(volunteersPolicy.isAllowed)
    .post(volunteers.create);

// Single article routes
  app.route('/api/volunteers/:volunteerId').all(volunteersPolicy.isAllowed)
    .get(volunteers.read)
    .put(volunteers.update)
    .delete(volunteers.delete);

// Finish by binding the article middleware
  app.param('volunteerId', volunteers.volunteerByID);
};
