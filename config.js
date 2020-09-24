const path = require('path');

module.exports = {
	//Telegram
    telegram_cli_path: path.join(__dirname, 'tg/bin/telegram-cli'), //path to tg-cli (see https://github.com/vysheng/tg)
    telegram_cli_socket_path: path.join(__dirname, 'socket'), // path for socket file
    server_publickey_path: path.join(__dirname, 'tg/tg-server.pub'), // path to server key (traditionally, in %tg_cli_path%/tg-server.pub)
    botName: '*****',
    exchange: 'Binance',

    //Binance
    exchangeOptions: {
	  APIKEY: '****', //Exchange API Key
	  APISECRET: '****', //Exchange API Secret
	  useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
	  test: true // If you want to use sandbox mode where orders are simulated
	},

	//Signal Manager
	waitingSignalKeepAlive: 1800, //Seconds
	signalRefreshRate: 10000, //Miliseconds

	//Price Listener
	priceRefreshRate: 30000, //Miliseconds
	stopLossThresshold: 0.97,
	takeProfitThreshold: 1.02,

	//Wallet Manager
	maxOrders: 5,

	//Server
	serverPort: 3000,

	originsWhitelist: [
		'http://localhost:4200'      //this is my front-end url for development
		//'http://www.myproductionurl.com'
	],
	corsOptions: {
		origin: function(origin, callback){
			var isWhitelisted = ~originsWhitelist.indexOf(origin);
			callback(null, isWhitelisted);
		},
		credentials:true
	}
}