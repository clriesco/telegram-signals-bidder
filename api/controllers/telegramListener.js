'use strict';
const events = require('events');
const TelegramAPI = require('tg-cli-node');
const TelegramParser = require('./TelegramParser');
const debug = require('debug')('scalping-listener:telegram-listener');

class TelegramListener  extends events.EventEmitter {
	init (config) {
		this.config = config;
		return this;
	}

	listen() {

		const telegramClient = new TelegramAPI(this.config);

		telegramClient.connect(connection => {
			debug('Telegram API Connected');
		    connection.on('message', message => {
				const parser = new TelegramParser(this.config);
		    	const ret = parser.analyze(message.text, message.from.username);
		    	if (ret != false) {
		    		this.emit('signal', ret);
		    	}
		    });

		    connection.on('error', e => {
		        debug('Error from Telegram API: %j', e);
		        this.emit('error', e);
		    });

		    connection.on('disconnect', () => {
		        debug('Disconnected from Telegram API');
		        this.emit('disconnected');
		    });
		});
		return this;
	}

}

module.exports = new TelegramListener();