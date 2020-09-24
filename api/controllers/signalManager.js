'use strict'
const debug = require('debug')('scalping-listener:signal-manager');

class SignalManager {

	constructor() {
	}

	init(signalController, binanceManager, config) {
		this.signalController = signalController;
		this.binanceManager = binanceManager;
		this.config = config;
		setInterval(this.rejectTimedoutSignals.bind(this), this.config.signalRefreshRate)
	}

	rejectTimedoutSignals() {
		this.signalController
			.rejectTimedoutSignals(this.config.waitingSignalKeepAlive)
			.then((update) => {
				if (update.nModified != undefined && update.nModified > 0) {
					debug('%j signals rejected', update);
				}
			});
	}

	onSignal(signal) {
	 	this.signalController
	 		.localGetSignals({currency: signal.currency, status: {$nin: ['rejected', 'won', 'lost']}})
	 		.then((signals) => {
	 			if (!signals.length ) {
	 				debug('Saving signal %s%s', signal.currency, signal.commodity);
	    			this.signalController.localPostSignal(signal);
	 			} else {
					let commodityFlag = false;
					let statusFlag = false;
	 				for (let sig of signals) {
	 					if (sig.commodity == signal.commodity) {
	 						commodityFlag = true;
	 					
	 					} else if (sig.status == 'active' || sig.status == 'linked') {
	 						statusFlag = true
	 					}
	 				}
	 				if (!commodityFlag && !statusFlag) {
	    				this.onDualConfirmation(signal);
	 				} else {
	 					if (commodityFlag)
	 						debug('Signal not saved. Reason: Commodity found');
	 					if (statusFlag)
	 						debug('Signal not saved. Reason: status active or linked');
	 				}
	 			}
	 		})
	 		.catch((err) => {
	 			debug(err);
	 			throw err;
	 		});
	}

	onDualConfirmation(signal) {
		debug('Dual Confirmation');
		let oldCommodity = 'BTC';
		if (signal.commodity == 'BTC') {
			oldCommodity = 'ETH';
		}
		this.signalController.localGetSignal({status: 'waiting', currency: signal.currency, commodity: oldCommodity})
		.then (oldSignal => {
			if (oldSignal != null) this.binanceManager.placeOrder(oldSignal);
		});

		this.signalController.localPostSignal(signal)
		.then(saved => 
			this.binanceManager.placeOrder(saved)
		);
		
		
	}

}

module.exports = new SignalManager();