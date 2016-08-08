'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Lightsensor = mongoose.model('Lightsensor'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Lightsensor
 */
exports.create = function(req, res) {
  var lightsensor = new Lightsensor(req.body);
  lightsensor.user = req.user;

  lightsensor.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(lightsensor);
    }
  });
};

/**
 * Show the current Lightsensor
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var lightsensor = req.lightsensor ? req.lightsensor.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  lightsensor.isCurrentUserOwner = req.user && lightsensor.user && lightsensor.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(lightsensor);
};

/**
 * Update a Lightsensor
 */
exports.update = function(req, res) {
  var lightsensor = req.lightsensor ;

  lightsensor = _.extend(lightsensor , req.body);

  lightsensor.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(lightsensor);
    }
  });
};

/**
 * Delete an Lightsensor
 */
exports.delete = function(req, res) {
  var lightsensor = req.lightsensor ;

  lightsensor.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(lightsensor);
    }
  });
};

/**
 * List of Lightsensors
 */
exports.list = function(req, res) { 
  Lightsensor.find().sort('-created').populate('user', 'displayName').exec(function(err, lightsensors) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(lightsensors);
    }
  });
};

/**
 * Lightsensor middleware
 */
exports.lightsensorByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Lightsensor is invalid'
    });
  }

  Lightsensor.findById(id).populate('user', 'displayName').exec(function (err, lightsensor) {
    if (err) {
      return next(err);
    } else if (!lightsensor) {
      return res.status(404).send({
        message: 'No Lightsensor with that identifier has been found'
      });
    }
    req.lightsensor = lightsensor;
    next();
  });
};
