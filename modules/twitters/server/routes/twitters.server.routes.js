'use strict';

/**
 * Module dependencies
 */
var twittersPolicy = require('../policies/twitters.server.policy'),
  twitters = require('../controllers/twitters.server.controller');

module.exports = function(app) {
  // Twitters Routes
  app.route('/api/twitters').all(twittersPolicy.isAllowed)
    .get(twitters.list)
    .post(twitters.create);

  app.route('/api/twitters/:twitterId').all(twittersPolicy.isAllowed)
    .get(twitters.read)
    .put(twitters.update)
    .delete(twitters.delete);

  // Finish by binding the Twitter middleware
  app.param('twitterId', twitters.twitterByID);
};
