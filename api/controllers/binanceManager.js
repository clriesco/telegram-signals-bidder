'use strict'
const debug = require('debug')('scalping-listener:binance-manager');
const moment = require('moment');

class BinanceManager {

	constructor() {
        this.wallet = {};
	}

	init(signalController, binance, config) {
		this.signalController = signalController;
		this.config = config;
		this.binance = binance;
		this.binance.options(this.config.exchangeOptions);
		setInterval(this.listenToPrices.bind(this), this.config.priceRefreshRate);
        this._loadBalance();
	}

	listenToPrices() {

		this.binance.prices((error, ticker) => {
			if (error) {
				throw error;
			}

			this.signalController
			.getWaitingSignals()
			.then((signals) => {
				if (!signals.length) {
					return;
				}
				for (let signal of signals) {
					signal.price = ticker[signal.currency + signal.commodity];
					signal.save();
				}
			})

			this.signalController
			.getActiveSignals()
			.then((signals) => {
				if (!signals.length) {
					//debug('No active signals');
					return;
				}
				for (let signal of signals) {
					let signalPrice = ticker[signal.currency + signal.commodity];
					if (signalPrice != undefined && signalPrice > signal.price*this.config.takeProfitThreshold) {
						this.signalController.addPriceToSignal(signal, signalPrice)
						.then((err, updated) => this.signalController.localUpdateSignal({_id: signal._id}, {
							status: 'won', 
							close_price: signalPrice,
							current_price: signalPrice,
							close_date: Date.now()
						}))
						.then((err, updated) => {
							this.wallet[signal.commodity].slots++;
							debug('%s%s: WON | Initial Price: %d, Last Price %d (%d%)', 
								signal.currency, 
								signal.commodity, 
								signal.price, signalPrice, 
								parseFloat((signalPrice/signal.price -1)*100).toFixed(2)
							);
						})
					} 
					else if (signalPrice != undefined && signalPrice < signal.price*this.config.stopLossThresshold) {
						this.signalController.addPriceToSignal(signal, signalPrice)
						.then((err, updated) => this.signalController.localUpdateSignal({_id: signal._id}, {
							status: 'lost', 
							close_price: signalPrice,
							current_price: signalPrice,
							close_date: Date.now()
						}))
						.then((err, updated) => {
							this.wallet[signal.commodity].slots++;
							debug('%s%s: LOST | Initial Price: %d, Last Price %d (%d%)', 
								signal.currency, 
								signal.commodity, 
								signal.price, signalPrice, 
								parseFloat((signalPrice/signal.price -1)*100).toFixed(2)
							);
						});
					}
					else {
						if (signal.price_history.length == 0) {
							signal.price = signalPrice;
						}
						this.signalController.addPriceToSignal(signal, signalPrice)
						.then((saved) => {
							debug('%s%s: Initial Price: %d, Ticker price: %d (%d%)', 
								signal.currency, 
								signal.commodity, 
								signal.price, signalPrice, 
								parseFloat((signalPrice/signal.price -1)*100).toFixed(2)
							);
						});
					}
				}
			});
		});
	}

	getPrice(currency, commodity) {
		return this.binance.prices(currency+commodity, (err, ticker) => {
			return new Promise((resolve, reject) => {
				debug(ticker);
				return resolve(ticker);
			});
		})
	}
    
    placeOrder(signal) {
		debug(signal);
		if (this.wallet[signal.commodity].slots <= 0) {
			debug('No free slots for commodity %s', signal.commodity );
			return false;
		}
		signal.status = 'active';
		signal.save();
		this.wallet[signal.commodity].slots--;
		let pair = signal.currency + signal.commodity;
        //this.binance.marketBuy(pair, );
		return true;
    }

    _loadBalance() {
        this.binance.balance((error, balances) => {
            console.log("balances()", balances);
            this.wallet.BTC = {
                credit: balances.BTC.available,
                slots: this.config.maxOrders
            };
            this.wallet.ETH = {
                credit: balances.ETH.available,
                slots: this.config.maxOrders
			};
			this.signalController.getActiveSignals(true)
				.then(signals => {
					for (let sig of signals) {
						this.wallet[sig.commodity].slots--;
					}
					debug(this.wallet);
				})
        });
        this.binance.openOrders(false, (error, openOrders) => {
            console.log("openOrders()", openOrders);
		});
	}
	
	getSlots(commodity) {
		return this.wallet[commodity].slots;
	}

}

module.exports = new BinanceManager();
