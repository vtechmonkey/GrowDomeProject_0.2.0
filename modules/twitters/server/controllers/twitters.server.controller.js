'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Twitter = mongoose.model('Twitter'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Twitter
 */
exports.create = function(req, res) {
  var twitter = new Twitter(req.body);
  twitter.user = req.user;

  twitter.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(twitter);
    }
  });
};

/**
 * Show the current Twitter
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var twitter = req.twitter ? req.twitter.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  twitter.isCurrentUserOwner = req.user && twitter.user && twitter.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(twitter);
};

/**
 * Update a Twitter
 */
exports.update = function(req, res) {
  var twitter = req.twitter ;

  twitter = _.extend(twitter , req.body);

  twitter.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(twitter);
    }
  });
};

/**
 * Delete an Twitter
 */
exports.delete = function(req, res) {
  var twitter = req.twitter ;

  twitter.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(twitter);
    }
  });
};

/**
 * List of Twitters
 */
exports.list = function(req, res) { 
  Twitter.find().sort('-created').populate('user', 'displayName').exec(function(err, twitters) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(twitters);
    }
  });
};

/**
 * Twitter middleware
 */
exports.twitterByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Twitter is invalid'
    });
  }

  Twitter.findById(id).populate('user', 'displayName').exec(function (err, twitter) {
    if (err) {
      return next(err);
    } else if (!twitter) {
      return res.status(404).send({
        message: 'No Twitter with that identifier has been found'
      });
    }
    req.twitter = twitter;
    next();
  });
};
