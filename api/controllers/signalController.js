'use strict';

const mongoose = require('mongoose'),
  moment = require('moment'),
  momentDurationFormatSetup = require("moment-duration-format"),
  signal = mongoose.model('Signal'),
  debug = require('debug')('scalping-listener:signal-controller');
  momentDurationFormatSetup(moment);

function extend(obj, src) {
  Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
  return obj;
}

exports.getSignals = function(req, res) {
  const queryParams = req.query;
  let query = {}, status = null, sort = {};
  if (queryParams.type == 'active') status = {$in: ['active', 'linked']};
  if (queryParams.type == 'ended') status =  {$in: ['won', 'lost']};
  if (queryParams.type == 'rejected') status = 'rejected';
  if (queryParams.type == 'waiting') status =  'waiting';
  if (status !== null) {
    query.status = status;
  }
  if (queryParams.filter !== null ) {
    query.currency = new RegExp(queryParams.filter.toUpperCase());
  }
  const filter = queryParams.filter || '',
  pageNumber = parseInt(queryParams.pageNumber) || 0,
  pageSize = parseInt(queryParams.pageSize) || 0;

  if (queryParams.sortDirection && queryParams.sortActive) sort[queryParams.sortActive] = (queryParams.sortDirection == 'asc') ? 1 : -1;
  signal.find(query, null, {sort: sort}, function(err, sig) {
    if (err)
      res.send(err);
    sig = sig.map(sig => {
      if (sig.status === 'won') sig.status = 'Ganado';
      if (sig.status === 'lost') sig.status = 'Perdido';
      if (sig.status === 'active') sig.status = 'Activo';
      if (sig.status === 'linked') sig.status = 'Enlazado';
      if (sig.status === 'waiting') sig.status = 'En Espera';
      if (sig.status === 'rejected') sig.status = 'Rechazado';
      return sig;
    });

    if (filter) {
      sig = sig.filter(sig => sig.currency.trim().toLowerCase().search(filter.toLowerCase()) >= 0);
    }
    if (!pageSize) return res.json(sig);
    const initialPos = pageNumber * pageSize;
    const signalPage = sig.slice(initialPos, initialPos + pageSize);
    res.json(signalPage);
  });
};

exports.getSignalsLength = function(req, res) {
  const queryParams = req.query;
  let status = {};
  if (queryParams.type == 'active') status =  {status: ['active', 'linked']};
  if (queryParams.type == 'ended') status =  {status: ['won', 'lost']};
  if (queryParams.type == 'rejected') status =  {status: 'rejected'};
  if (queryParams.type == 'waiting') status =  {status: 'waiting'};

  const filter = queryParams.filter || '';
  status = extend(status, {currency: { "$regex": filter.trim().toLowerCase(), "$options": "i" }} );
  signal.count(status, function(err, count) {
    if (err)
      res.send(err);
    return res.json(count);
  });
};

exports.getStats = function(req, res) {

  Promise.all([last24Ended(), allTimeEnded()])
  .then(values => {
    //debug('promise all %j', values);
    return res.json({last24: values[0], alltime: values[1]});
  })
};

exports.postSignal = function(req, res) {
  var new_sig = new signal(req.body);
  new_sig.save(function(err, sig) {
    if (err)
      res.send(err);
    res.json(sig);
  });
};

exports.getSignal = function(req, res) {
  signal.findById(req.params.signal, function(err, sig) {
    if (err)
      res.send(err);
    res.json(sig);
  });
};

exports.putSignal = function(req, res) {
  signal.findOneAndUpdate({_id: req.params.signal}, req.body, {new: true}, function(err, sig) {
    if (err)
      res.send(err);
    res.json(sig);
  });
};

exports.deleteSignal = function(req, res) {
  signal.remove({
    _id: req.params.signal
  }, function(err, sig) {
    if (err)
      res.send(err);
    res.json({ message: 'Signal successfully deleted' });
  });
};

exports.deleteSignals = function(req, res) {
  signal.remove({}, function(err, sig) {
    if (err)
      res.send(err);
    res.json({ message: 'All Signals successfully deleted' });
  });
};

exports.localPostSignal = function(sig) {
  var new_sig = new signal(sig);
  return new_sig
    .save()
    .then((saved) => {
      return saved;
    })
    .catch((err) => {
      debug(err);
      //throw (err);
    });
}

exports.localGetSignals = function(options = {}) {
  return signal
    .find(options)
    .then((signals) => {
      return signals;
    })
    .catch((err) => {
      debug(err);
      //throw (err);
    });
};

exports.localGetSignal = function(options = {}) {
  return signal
    .find(options)
    .limit(1)
    .then((signals) => {
      if (!signals) return null;
      return signals[0];
    })
    .catch((err) => {
      debug(err);
      //throw (err);
    });
};

exports.localUpdateSignals = function(filter = {}, update = {}) {
  return signal.update(filter, update, {multi:true}, function(err, updated){
    if (err) {
      throw err;
    }
  });
}

exports.localUpdateSignal = function(filter = {}, update = {}) {
  return signal.update(filter, update, {}, function(err, updated){
    if (err) {
      throw err;
    }
    return updated;
  });
}

exports.rejectTimedoutSignals = function(keepAlive) {
  let thresholdTime = moment().subtract(keepAlive, 'second');
  return signal.update({status: 'waiting', creation_date: {$lt: thresholdTime.toDate()}}, {status: 'rejected'}, {multi: true}, function(err, updated) {
    if (err)
      throw err;  
  });
}

exports.localLinkSignal = function(currency) {
  return signal.update({status: 'waiting', currency: currency}, {status: 'linked'})
}

exports.addPriceToSignal = function(sig, price) {
  sig.current_price = price;
  sig.price_history.push({price: price, date: Date.now()});
  return sig.save();
}

exports.getActiveSignals = function(strict = false) {
  let activeSignals = ['active'];
  if (!strict) {
    activeSignals.push('linked');
  }
  return signal
    .find({status: {$in: activeSignals}})
    .then((signals) => {
      return signals;
    })
    .catch((err) => {
      throw (err);
    });
}
exports.getWaitingSignals = function() {
  return signal
    .find({status: 'waiting'})
    .then((signals) => {
      return signals;
    })
    .catch((err) => {
      throw (err);
    });
}

let last24Ended = function() {
  const last24 = new Date(Date.now() - 24*60*60 * 1000);
  return signal.find({status: {$in: ['won', 'lost']}, close_date: {$gt: last24}})
    .exec()
    .then(sigs => {
      var stats = {};
      sigs.forEach(function(x) { stats[x.status] = (stats[x.status] || 0)+1; });
      debug(stats);
      return stats;
    });
}

let allTimeEnded = function () {
  return signal.find({status: {$in: ['won', 'lost']}})
    .exec()
    .then(sigs => {
      var stats = {};
      sigs.forEach(function(x) { stats[x.status] = (stats[x.status] || 0)+1; });
      debug(stats);
      return stats;
    });
}