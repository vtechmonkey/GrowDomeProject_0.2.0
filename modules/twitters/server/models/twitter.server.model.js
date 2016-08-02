'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Twitter Schema
 */
var TwitterSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Twitter name',
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

mongoose.model('Twitter', TwitterSchema);
