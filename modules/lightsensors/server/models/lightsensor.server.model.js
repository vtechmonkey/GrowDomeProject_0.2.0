'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Lightsensor Schema
 */
var LightsensorSchema = new Schema({

  payload: Number,

  name: {
    type: String,
    default: '',
    required: 'Please fill Lightsensor name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Lightsensor', LightsensorSchema);
