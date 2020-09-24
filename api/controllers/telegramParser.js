const debug = require('debug')('scalping-listener:telegram-parser');
class TelegramParser {


	constructor(config) {
		this.sender = config.botName;
		this.exchange = config.exchange;

		this.regexps = [
			new RegExp("^Hola (.*)\. Sugerencia de Scalping\. \\(COMPRAR \@ (.*)\\)$", 'g'),
			new RegExp("^Par-Moneda: (.*)$", 'g'),
			new RegExp("^Precio Actual: (.*)$", 'g'),
			'',
			'',
			'',
			new RegExp("^Temporalidad: (.*) Minutos\.$", 'g')
		]
	}

	analyze(message, sender) {
		if (sender != this.sender) {
			//debug('Emisor desechado (%s)', sender);
			return false;
		}
		const msgArray = message.split(/\r?\n/g);
		if (!msgArray.length) {
			return false;
		}
		//Línea 0
		const line0 = this.regexps[0].exec(msgArray[0]);
		if (!line0 || !line0.length) {
			debug('No es sugerencia de Scalping "%s" %s', msgArray[0], line0);
			return false;
		}
		if (line0[2] != this.exchange) {
			debug('Sugerencia de Scalping de exchange incorrecto "%s"', line0[2]);
			return false;
		}

		debug('Sugerencia de Scalping encontrada');

		//Línea 1
		const line1 = this.regexps[1].exec(msgArray[1]);
		if (!line1 || !line1.length) {
			debug('Reg Exp Error in string "%s" %s', msgArray[1], line1);
			return false;
		}
		debug('Par: %s', line1[1]);

		//Línea 2
		const line2 = this.regexps[2].exec(msgArray[2]);
		if (!line2 || !line2.length) {
			debug('Reg Exp Error in string "%s" %s', msgArray[2], line2);
			return false;
		}
		debug('Precio Actual: %s', line2[1]);

		//Línea 6
		const line6 = this.regexps[6].exec(msgArray[6]);
		if (!line6 || !line6.length) {
			debug('Reg Exp Error in string "%s" %s', msgArray[6], line6);
			return false;
		}
		debug('Temporalidad: %s Minutos', line6[1]);

		return this._formatSuggestion(line1[1], line2[1]);

	}

	_formatSuggestion(pair, price) {
		var currency, commodity
		if (~pair.indexOf('BTC')) {
			commodity = 'BTC';
		}
		else if (~pair.indexOf('ETH')) {
			commodity = 'ETH';
		} else {
			debug('Commodity not BTC nor ETH');
			return false;
		}
		currency = pair.replace(commodity, '');
		return {
			currency: currency,
			commodity: commodity,
			price: parseFloat(price)
		}
	}
}

module.exports = TelegramParser;