'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Chart = mongoose.model('Chart'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Chart
 */
exports.create = function(req, res) {
  var chart = new Chart(req.body);
  chart.user = req.user;

  chart.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(chart);
    }
  });
};

/**
 * Show the current Chart
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var chart = req.chart ? req.chart.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  chart.isCurrentUserOwner = req.user && chart.user && chart.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(chart);
};

/**
 * Update a Chart
 */
exports.update = function(req, res) {
  var chart = req.chart ;

  chart = _.extend(chart , req.body);

  chart.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(chart);
    }
  });
};

/**
 * Delete an Chart
 */
exports.delete = function(req, res) {
  var chart = req.chart ;

  chart.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(chart);
    }
  });
};

/**
 * List of Charts
 */
exports.list = function(req, res) { 
  Chart.find().sort('-created').populate('user', 'displayName').exec(function(err, charts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(charts);
    }
  });
};

/**
 * Chart middleware
 */
exports.chartByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Chart is invalid'
    });
  }

  Chart.findById(id).populate('user', 'displayName').exec(function (err, chart) {
    if (err) {
      return next(err);
    } else if (!chart) {
      return res.status(404).send({
        message: 'No Chart with that identifier has been found'
      });
    }
    req.chart = chart;
    next();
  });
};
