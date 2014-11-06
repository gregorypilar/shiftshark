var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var timestamps = require('mongoose-times');

/*
 * SHIFT SCHEMA
 *
 * assignee:     the original employee that an employer assigned to the shift
 *               if null, this is an open shift
 *
 * claimant:     the current employee who has claimed this shift
 *
 * day:          the day of this shift, as an integer between 0 and 6 (0 -> Monday, etc)
 *
 * startTime:    the number of minutes from midnight (00:00) that this shift begins
 *
 * endTime:      the number of minutes from midnight (00:00) that this shift ends
 *
 * startDate:    the first day that this shift occurs
 *
 * endDate:      the last day that this shift occurs 
 *               if null, this shift is indefinitely recurring
 *
 * trading:      true if this shift is offered for trading and can be claimed by another user
 *
 * created:      timestamp denoting when shift was initially created
 *
 * lastUpdated:  timestamp denoting when shift was last updated
 *
 */

var shiftSchema = mongoose.Schema({
  // TODO: make assignee immutable
  assignee: {
    type: mongoose.Schema.ObjectId,
    ref: 'Employee',
    required: true
  },
  claimant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Employee',
    default: null,
    required: true
  },
  day: {
    type: Number,
    min: 0,
    max: 6,
    required: true
  },
  startTime: {
    type: Number,
    min: 0,
    max: 60*24,
    required: true
  },
  endTime: {
    type: Number,
    min: 0,
    max: 60*24,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  trading: {
    type: Boolean,
    default: false,
    required: true
  }
});

shiftSchema.plugin(timestamps);
var Shift = mongoose.model('Shift', shiftSchema);


// validate that the end time is after the start time
Shift.schema.path('endTime').validate(function (endTime) {
  return endTime > this.startTime;
});

module.exports = Shift;