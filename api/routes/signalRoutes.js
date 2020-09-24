'use strict';
const express = require('express');
const router = express.Router();
const signal = require('../controllers/signalController');

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