'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var signalSchema = new Schema({
  currency: {
    type: String,
    required: 'Introduce la moneda'
  },
  commodity: {
    type: String,
    required: 'Introduce la moneda base (ETH/BTC)'
  },
  price: {
    type: Number,
    required: 'Introduce el precio actual'
  },
  current_price: {
    type: Number,
    default: null
  },
  close_price: {
    type: Number,
    default: null
  },
  creation_date: {
    type: Date,
    default: Date.now
  },
  close_date: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['waiting', 'active', 'linked', 'won', 'lost', 'rejected'],
    default: 'waiting'
  },
  price_history: [{
    price: {
      type: Number,
      default: null
    },
    date: {
      type: Date,
      default: null
    }
  }]
});

module.exports = mongoose.model('Signal', signalSchema);