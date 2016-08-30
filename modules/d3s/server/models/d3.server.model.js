'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * D3 Schema
 */
var D3Schema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill D3 name',
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

mongoose.model('D3', D3Schema);
