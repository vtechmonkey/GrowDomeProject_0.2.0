'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  D3 = mongoose.model('D3'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a D3
 */
exports.create = function(req, res) {
  var d3 = new D3(req.body);
  d3.user = req.user;

  d3.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(d3);
    }
  });
};

/**
 * Show the current D3
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var d3 = req.d3 ? req.d3.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  d3.isCurrentUserOwner = req.user && d3.user && d3.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(d3);
};

/**
 * Update a D3
 */
exports.update = function(req, res) {
  var d3 = req.d3 ;

  d3 = _.extend(d3 , req.body);

  d3.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(d3);
    }
  });
};

/**
 * Delete an D3
 */
exports.delete = function(req, res) {
  var d3 = req.d3 ;

  d3.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(d3);
    }
  });
};

/**
 * List of D3s
 */
exports.list = function(req, res) { 
  D3.find().sort('-created').populate('user', 'displayName').exec(function(err, d3s) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(d3s);
    }
  });
};

/**
 * D3 middleware
 */
exports.d3ByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'D3 is invalid'
    });
  }

  D3.findById(id).populate('user', 'displayName').exec(function (err, d3) {
    if (err) {
      return next(err);
    } else if (!d3) {
      return res.status(404).send({
        message: 'No D3 with that identifier has been found'
      });
    }
    req.d3 = d3;
    next();
  });
};
