'use strict';
const debug = require('debug')('scalping-listener:main');
const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');

const config = require('./config');

require('./api/models/db');
require('./api/config/passport');

const binance = require('node-binance-api');
const signalController = require('./api/controllers/signalController');
const signalManager = require('./api/controllers/signalManager');
const binanceManager = require('./api/controllers/binanceManager');
const telegramListener = require('./api/controllers/telegramListener');

const app = express();
const routesApi = require('./api/routes/index');

const setupServer = function() {

	app.use(cors());
	app.use(logger('dev'));
	app.use(passport.initialize());
	app.use('/api', routesApi);
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(cookieParser());
	app.use(cors());


	app.listen(config.serverPort);
	setupAppErrors();
	debug('Signal RESTful API server started on: ' + config.serverPort);
}

const setupTelegram = function() {
	telegramListener
		.init(config)
		.listen().on('signal', signal => {
			debug(signal);
			signalManager.onSignal(signal);
	});
}
const setupSignalManager = function() {
	binanceManager.init(signalController, binance, config);
	signalManager.init(signalController, binanceManager, config);
}

const setupAppErrors = function() {
	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	// error handlers

	// [SH] Catch unauthorised errors
	app.use(function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		res.status(401);
		res.json({"message" : err.name + ": " + err.message});
	}
	});

	// development error handler
	// will print stacktrace
	if (app.get('env') === 'development') {
		app.use(function(err, req, res, next) {
			res.status(err.status || 500);
			res.render('error', {
				message: err.message,
				error: err
			});
		});
	}

	// production error handler
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			//error: {}
			error: err
		});
	});
}

setupServer();
setupTelegram();
setupSignalManager();