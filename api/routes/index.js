'use strict';
const express = require('express');
const router = express.Router();
const signal = require('../controllers/signalController');
const jwt = require('express-jwt');
const auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});
/* GET home page. */
router
    .get('/signals', signal.getSignals)
    .get('/signals-length', signal.getSignalsLength)
    .get('/stats', signal.getStats)
    .post('/signals', signal.postSignal)
    .delete('/signals', signal.deleteSignals)
    .get('/signals/:signal', signal.getSignal)
    .post('/signals/:signal', signal.putSignal)
    .delete('/signals/:signal', signal.deleteSignal);


module.exports = router;