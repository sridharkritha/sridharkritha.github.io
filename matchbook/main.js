(function () {
	// https://developers.matchbook.com/reference
	var request = require('request');
	var fs = require('fs');
	var sessionToken = null;
	var db = {};
	db.sportId = {};
	db.eventId = {};
	db.runnerId = {};
	var predictedWinners = [];
	var successfulBets = null; // array
	var pastTime = 0;
	var currentTime = 0;
	var betNow = [];

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	var winConfidencePercentage = 100; // ex: 100  (100% or more)
	var minProfitOdd = 1; // ex: 1 (1/1 = 1 even odd [or] 2.00 in decimal)
	var betMinutesOffset = 50; // place bet: +1 min before the start time, -5 min after the start time
	var isLockedForBetting = false; // true
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var sportsName = ['American Football','Athletics','Australian Rules','Baseball','Basketball','Boxing','Cricket','Cross Sport Special',
	'Cross Sport Specials','Current Events','Cycling','Darts','Gaelic Football','Golf','Greyhound Racing','Horse Racing',
	'Horse Racing (Ante Post)','Horse Racing Beta','Hurling','Ice Hockey'];

	getDefaultOptions = function()
	{
		return {
			method: 'GET',
			headers: { 
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'user-agent': 'api-doc-test-client'
			}
		};
	};

	writeJsonFile = function(jsonString, fileName) {
		var jsonFormat = jsonString;

		if(typeof jsonString === 'string') {
			jsonFormat = JSON.parse(jsonString);
		}
		
		var data = JSON.stringify(jsonFormat, null, 2);
		
		// Asynchronous file write
		fs.writeFile(fileName, data, function(err) {
			if (err) throw err;
			//console.log('Data written to file');
		});
	};

	requestResponse = function(options, obj, destObj, keys, filterDay, closureSave, callback) {
		request(options, function (error, response, body) {
			if (error) {
				return callback(error,null);
			}

			db.sportId[closureSave][obj] = {};

			var jsonFormat = JSON.parse(body);

			for(var key in jsonFormat[obj])
			{
				if( jsonFormat[obj].hasOwnProperty(key))
				{
					key = Number(key);
					var index = keys.indexOf("start");
					var dateString;

					if(index !== -1)
					{
						dateString = jsonFormat[obj][key][keys[index]]; // "start": "2019-03-01T16:10:00.000Z"
						var dateObject = new Date(dateString);
						var currentDate;
						if(filterDay === 'today')
						{
							// Thu Feb 28 2019 22:04:39 GMT+0000
							currentDate = new Date();
						}
						else if(filterDay === 'tomorrow')
						{
							// Fri Mar 01 2019 00:04:39 GMT+0000
							var today = new Date();
							var tomorrow = new Date();
							currentDate = new Date(tomorrow.setDate(today.getDate()+1)); // next day
						}

						if(dateObject.getDate() !== currentDate.getDate() && dateObject.getMonth() !== currentDate.getMonth()
							&& dateObject.getFullYear() !== currentDate.getFullYear())
						{
							continue; // skip
						}
					}

					var name = jsonFormat[obj][key][destObj];
					db.sportId[closureSave][obj][name] = {};

					for(var i = 0; i < keys.length; ++i)
					{
						db.sportId[closureSave][obj][name][keys[i]] = jsonFormat[obj][key][keys[i]];
					}
				}
			}

			//writeJsonFile(body,'event.json');
			// console.log(Object.keys(db.eventId));
			// console.log(body);
			return callback(null,true);
		});
	};

	// Login
	// Login to Matchbook and create a new session.
	// The response includes a session token value. This value should be included with all subsequent requests as either a 
	// cookie named "session-token" or a header named "session-token".
	// Matchbook sessions live for approximately 6 hours so only 1 login request every 6 hours is required. The same session 
	// should be used for all requests in that period.
	login = function (callback) {
	// Asynchronous 'json' file read
	fs.readFile('./../../../credential.json', function(err, data) {
		if (err) throw err;
		var credential = JSON.parse(data);
		// console.log(credential);
		
		request.post(
			'https://api.matchbook.com/bpapi/rest/security/session',
			{ json: credential}, // username and passwords
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					sessionToken = body['session-token'];
					// console.log(sessionToken);
					// console.log(body);
					 return callback(null,sessionToken);
				}
				else {
					return callback(error,null);
				}
			}
		);
	});
	};

	// Logout
	// Logout from Matchbook and terminate the current session.
	logout = function () {
		var options = getDefaultOptions();
		options.method = 'DELETE';
		options.url = 'https://api.matchbook.com/bpapi/rest/security/session';

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			//console.log(body);
		});
	};

	// Get Session
	// Get the current session information.
	// This API provides the ability to validate a session is still active. A successful response indicates a valid and active
	// session. A 401 response means that the session has expired.
	getSession = function () {
		var options = getDefaultOptions();
		options.url = 'https://api.matchbook.com/bpapi/rest/security/session';

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			//console.log(body);
		});
	};

	// Get Account
	// Get the account information for the user currently logged in.
	// This API requires authentication and will return a 401 in case the session expired or no session token is provided.
	getAccount = function () {
		var options = getDefaultOptions();
		options.url = 'https://api.matchbook.com/edge/rest/account';

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			//console.log(body);
		});
	};

	// Get Casino Wallet Balance
	// Get the casino wallet balance for the user currently logged in.
	// This API requires authentication and will return a 401 in case the session expired or no session token is provided.
	getCasioWalletBalance = function () {
		var options = getDefaultOptions();
		options.url = 'https://api.matchbook.com/bpapi/rest/account/balance';

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			//console.log(body);
		});
	};

	// Get Sports Wallet Balance
	// Get the new sports balance for the user currently logged in.
	// This API requires authentication and will return a 401 in case the session expired or no session token is provided.
	getSportsWalletBalance = function () {
		var options = getDefaultOptions();
		options.url = 'https://api.matchbook.com/edge/rest/account/balance';
		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);
			//console.log(body);
		});
	};

	// Wallet Transfer
	// Transfer a specific balance amount between the wallets. The direction of transfer is determined by signal of the value.
	// Values greater than zero: Executes a transfer from the Casino to the Sports wallet.
	// Values smaller than zero: Executes a transfer from the Sports to the Casino wallet.
	walletTransfer = function () {
		// https://api.matchbook.com/bpapi/rest/account/transfer
	};

	// Get Sports
	// Get the list of sports supported by Matchbook
	getSports = function (sessionToken, callback) {
		var options = getDefaultOptions();
		options.url = 'https://api.matchbook.com/edge/rest/lookups/sports';
		options.qs = { offset: '0', 'per-page': '20', order: 'name asc', status: 'active' };

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) {
				return callback(error,null);
			} 

			var jsonFormat = JSON.parse(body);

			for(var sport in jsonFormat['sports'])
			{
				if( jsonFormat['sports'].hasOwnProperty(sport))
				{
					sport = Number(sport);
					// db.sportId[jsonFormat['sports'][sport].name] = jsonFormat['sports'][sport].id;
					db.sportId[jsonFormat['sports'][sport].name] = {};
					db.sportId[jsonFormat['sports'][sport].name].id = jsonFormat['sports'][sport].id;
				}
			}

			// writeJsonFile(body,'sportsList.json');
			// console.log(body);
			// console.log(Object.keys(db.sportId));
			return callback(null,sessionToken);
		});
	};

	// Get Navigation
	// Get the tree structure used for the navigation of events.
	getNavigation = function () {
		var options = getDefaultOptions();
		options.url = 'https://api.matchbook.com/edge/rest/navigation';
		options.qs = { offset: '0', 'per-page': '20'};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			// console.log(body);
		});
	};

	// Get Events
	// Get a list of events available on Matchbook ordered by start time.
	getEvents = function (sportId, callback) {
		var options = getDefaultOptions();
		options.url = 'https://api.matchbook.com/edge/rest/events';
		options.qs = {
			'offset': '0',
			'per-page': '20',
			// 'states': 'open,suspended,closed,graded',
			'states': 'open',
			'exchange-type': 'back-lay',
			'odds-type': 'DECIMAL',
			'include-prices': 'false',
			'price-depth': '3',
			'price-mode': 'expanded',
			'minimum-liquidity': '10',
			'include-event-participants': 'false'
		};		

		if(sportId)
		{
			//options.qs['sport-ids'] = ids;
			//options.qs['ids'] = ids;
			options.url = 'https://api.matchbook.com/edge/rest/events?sport-ids=' + sportId.id;
		}

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		// closure needed for storing the sport name ????
		requestResponse(options, 'events', 'name', ['id','start'],'today', 'Horse Racing', callback);
	};

	// Get Event
	getEvent = function (event_id, returnFunction) {
		var options = getDefaultOptions();
		options.qs = {
			'exchange-type': 'back-lay',
			'odds-type': 'DECIMAL',
			'include-prices': 'false',
			'price-depth': '3',
			'price-mode': 'expanded',
			'minimum-liquidity': '10',
			'include-event-participants': 'false'
		};

		// event id
		options.url = 'https://api.matchbook.com/edge/rest/events/'+event_id;

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			var jsonFormat = JSON.parse(body);

			var runners = jsonFormat.markets[0].runners;

			var runnersObj = {};

			for(var runner in runners)
			{
				if(runners.hasOwnProperty(runner))
				{
					runner = Number(runner);
					
					runnersObj[runners[runner].name] = {};
					runnersObj[runners[runner].name].runnerId = runners[runner].id;

					var back = [];
					var lay = [];
					for(var price in runners[runner]['prices'])
					{
						if(runners[runner]['prices'].hasOwnProperty(price))
						{
							if(runners[runner]['prices'][price]['side'] === "back")
							{
								back.push(Number(runners[runner]['prices'][price].odds));
							}
							else if(runners[runner]['prices'][price]['side'] === "lay")
							{
								lay.push(Number(runners[runner]['prices'][price].odds));
							}
						}
					}

					runnersObj[runners[runner].name].back = back.length ? Math.max.apply(null, back): 0;
					runnersObj[runners[runner].name].lay  =  lay.length ? Math.min.apply(null, lay): 0;
				}
			}

			returnFunction(runnersObj); // return the object from the callback function 

			// writeJsonFile(body,'runners.json');
			//console.log(Object.keys(runnersObj));
			//console.log(body);
		});
	};

	// Get Markets
	getMarkets = function () {
		var options = getDefaultOptions();
		options.url = 'https://api.matchbook.com/edge/rest/events/:event_id/markets';
		options.qs = {
			offset: '0',
			'per-page': '20',
			states: 'open,suspended',
			'exchange-type': 'back-lay',
			'odds-type': 'DECIMAL',
			'include-prices': 'false',
			'price-depth': '3',
			'price-mode': 'expanded',
			'minimum-liquidity': '10'
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			//console.log(body);
		});
	};

	// Get Market
	getMarket = function () {
		var options = getDefaultOptions();
		options.url = 'https://api.matchbook.com/edge/rest/events/:event_id/markets/:market_id';
		options.qs = {
				'exchange-type': 'back-lay',
				'odds-type': 'DECIMAL',
				'include-prices': 'false',
				'price-depth': '3',
				'price-mode': 'expanded',
				'minimum-liquidity': '10'
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			//console.log(body);
		});
	};

	// Get Runners
	getRunners = function (eventId, marketId) {
		var options = getDefaultOptions();
		options.qs = {
			states: 'open,suspended',
			'include-withdrawn': 'true',
			'include-prices': 'true',
			'price-depth': '3',
			'price-mode': 'expanded',
			'exchange-type': 'back-lay',
			'odds-type': 'DECIMAL',
			'minimum-liquidity': '10'
		};

		// event id and market id
		options.url = 'https://api.matchbook.com/edge/rest/events/'+ eventId +'/markets/' + marketId + '/runners';

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			//console.log(body);
		});
	};

	// Get Runner
	getRunner = function () {
		var options = getDefaultOptions();
		options.url = 'https://api.matchbook.com/edge/rest/events/:event_id/markets/:market_id/runners/:runner_id';
		options.qs = {
			'include-prices': 'false',
			'price-depth': '3',
			'price-mode': 'expanded',
			'exchange-type': 'back-lay',
			'odds-type': 'DECIMAL',
			'minimum-liquidity': '10'
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			//console.log(body);
		});
	};

	// Get Prices
	getPrices = function () {
		var options = getDefaultOptions();
		options.url = 'https://api.matchbook.com/edge/rest/events/:event_id/markets/:market_id/runners/:runner_id/prices';
		options.qs = {
				'exchange-type': 'back-lay',
				'odds-type': 'DECIMAL',
				depth: '3',
				'minimum-liquidity': '10',
				'price-mode': 'expanded'
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			//console.log(body);
		});
	};

	// Get Popular Markets
	getPopularMarkets = function () {
		var options = getDefaultOptions();
		options.url = 'https://api.matchbook.com/edge/rest/popular-markets';
		options.qs = {
			'exchange-type': 'back-lay',
			'odds-type': 'DECIMAL',
			'price-depth': '3',
			'price-mode': 'expanded',
			'minimum-liquidity': '10',
			'old-format': 'false'
		};		

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			//console.log(body);
		});
	};

	// Get Popular Sports
	getPopularSports = function () {
		var options = getDefaultOptions();
		options.url = 'https://api.matchbook.com/edge/rest/popular/sports';
		options.qs = { 'num-sports': '5' };

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;
		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			//console.log(body);
		});
	};

	
	// Edit Offers
	// Update the odds or the remaining stake on one or more unmatched offers.
	editOffers = function () {
		// https://api.matchbook.com/edge/rest/v2/offers
	};

	//  Edit Offer
	//  Update the odds or stake on an unmatched offer.
	editOffer = function () {
		// https://api.matchbook.com/edge/rest/v2/offers/:offer_id
	};

	// Cancel Offers
	// Cancel some or all of your open offers.
	cancelOffers = function () {
		var options = getDefaultOptions();
		options.method = 'DELETE';
		options.url = 'https://api.matchbook.com/edge/rest/v2/offers';

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			//console.log(body);
		});
	};

	// Cancel Offer
	// Cancel a specific unmatched offer.
	cancelOffer = function () {
		var options = getDefaultOptions();
		options.method = 'DELETE';
		options.url = 'https://api.matchbook.com/edge/rest/v2/offers/:offer_id';
		
		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			//console.log(body);
		});
	};

	// Get Offers
	// Get the current unsettled offers. This can include offers in all statuses.
	getOffers = function () {
		var options = getDefaultOptions();
		options.url = 'https://api.matchbook.com/edge/rest/v2/offers';
		options.qs = { offset: '0', 'per-page': '20', 'include-edits': 'false' };

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			//console.log(body);
		});
	};

	// Get Offer
	// Get a single specific unsettled offer.
	getOffer = function () {
		var options = getDefaultOptions();
		options.url = 'https://api.matchbook.com/edge/rest/v2/offers/:offer_id';
		options.qs = { offset: '0', 'per-page': '20', 'include-edits': 'false' };

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			//console.log(body);
		});
	};

	// Get Offer Edits
	// Get a single specific unsettled offer.
	getOfferEdits = function () {
		var options = getDefaultOptions();
		options.url = 'https://api.matchbook.com/edge/rest/v2/offers/:offer_id/offer-edits';
		options.qs = { offset: '0', 'per-page': '20' };

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			//console.log(body);
		});
	};

	// Get Offer Edit
	// Get a single specific unsettled offer.
	getOfferEdit = function () {
		var options = getDefaultOptions();
		options.url = 'https://api.matchbook.com/edge/rest/v2/offers/:offer_id/offer-edits/:offer_edit_id';		

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			//console.log(body);
		});
	};

	// Get Old Wallet Transactions
	// Get a list of transactions on the old Matchbook wallet.
	getOldWalletTransactions = function () {
		var options = getDefaultOptions();
		options.url = 'https://api.matchbook.com/bpapi/rest/reports/transactions';
		options.qs = { offset: '0', 'per-page': '20', categories: 'categories'};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			//console.log(body);
		});
	};

	// Get New Wallet Transactions
	// Get a list of transactions on the New Matchbook wallet.
	getNewWalletTransactions = function () {
		var options = getDefaultOptions();
		options.url = 'https://api.matchbook.com/edge/rest/reports/v1/transactions';
		options.qs = { offset: '0', 'per-page': '20'};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			//console.log(body);
		});
	};


	// Get Current Offers
	// Get a list of current offers i.e. offers on markets yet to be settled.
	getCurrentOffers = function () {
		var options = getDefaultOptions();
		options.url = 'https://api.matchbook.com/edge/rest/reports/v2/offers/current';
		options.qs = { offset: '0', 'per-page': '20', 'odds-type': 'DECIMAL'};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			//console.log(body);
		});
	};

	// Get Current Bets
	// Get a list of current bets i.e. bets on markets yet to be settled.
	getCurrentBets = function () {
		var options = getDefaultOptions();
		options.url = 'https://api.matchbook.com/edge/rest/reports/v2/bets/current';
		options.qs = { offset: '0', 'per-page': '20', 'odds-type': 'DECIMAL'};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			//console.log(body);
		});
	};

	// Get Settled Bets
	getSettledBets = function () {
		var options = getDefaultOptions();
		options.url = 'https://api.matchbook.com/edge/rest/reports/v2/bets/settled';
		options.qs = { offset: '0', 'per-page': '20', 'odds-type': 'DECIMAL'};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			//console.log(body);
		});
	};

	// Get Countries
	// Get the list of countries used for account registration.
	getCountries = function () {
		var options = getDefaultOptions();
		options.url = 'https://api.matchbook.com/bpapi/rest/lookups/countries';

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			//console.log(body);
		});
	};

	// Get Regions
	// Get the list of regions within a Country for account registration.
	getRegions = function () {
		var options = getDefaultOptions();
		options.url = 'https://api.matchbook.com/bpapi/rest/lookups/regions/:country_id';

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			//console.log(body);
		});
	};

	// Get Currencies
	// Get the list of currencies supported by Matchbook.
	getCurrencies = function () {
		var options = getDefaultOptions();
		options.url = 'https://api.matchbook.com/bpapi/rest/lookups/currencies';

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			//console.log(body);
		});
	};


	// {
	// 	"id": 24735152712200,
	// 	"events": {
	// 	  "16:30 Wincanton": {
	// 		"5 Tikkapick": {
	// 		  "runnerId": 1052216604020016,
	// 		  "back": 2.42,
	// 		  "lay": 2.44
	// 		},

	luckyMatchFilter = function(successfulBets, jsonObj, objLevelFilter, callback) {
		// console.log(successfulBets);
		predictedWinners = []; 
		for(var prop in jsonObj) {
			if(jsonObj.hasOwnProperty(prop)) {
				if(prop === objLevelFilter) { // events: { }
				for(var race in jsonObj[prop]) { 
					if(jsonObj[prop].hasOwnProperty(race)) { // 15:05 Sandown
						var raceId = jsonObj[prop][race].id;
						// successfulBets = [1,2,3,4,5];
						// writeJsonFile(successfulBets,'successfulBets.json');
						// setTimeout(function() {

							// Check if already a successful bet has been placed on that event
							if(successfulBets.indexOf(raceId) === -1)
							{
								var startTime = jsonObj[prop][race].start;
								var raceName = race;
								var luckyRunner = [];
								for(var runner in jsonObj[prop][race]) { 
									if(jsonObj[prop][race].hasOwnProperty(runner)) {
										if(typeof jsonObj[prop][race][runner] === "object")
										{
											var runnerObj = jsonObj[prop][race][runner];
											runnerObj.name = runner;
											var back = jsonObj[prop][race][runner].back;
											if(!back)
											{
												back = Number.MAX_VALUE;
											}
											luckyRunner.push([back, runnerObj]);
										}
									}
								}
		
								luckyRunner.sort(function(a, b) { return a[0] - b[0]; });
								if(luckyRunner.length > 1)
								{
									// Calculating the win chance by comparing with very next competitor 
									var winPercentage = (luckyRunner[1][0] - luckyRunner[0][0]) * 100 / luckyRunner[0][0];
									var profitOdd = luckyRunner[0][1].back - 1;
									luckyRunner[0][1].winPercentage = winPercentage;
									luckyRunner[0][1].startTime = startTime;
									luckyRunner[0][1].raceId = raceId;
									luckyRunner[0][1].raceName = raceName;
									jsonObj[prop][race].luckyWinner = luckyRunner[0][1]; // first element from an array
		
									// Build the predictedWinner list
									if((winPercentage > winConfidencePercentage) && (profitOdd > minProfitOdd))
									{
										predictedWinners.push(luckyRunner[0][1]);
									}
								}
							}
//}.bind(this), 5000); // timeout
					}
				}
				}
			}
		}
		betNow = findHotBet(predictedWinners);
		return callback(null, betNow);
	};

	findLuckyMatch = function(jsonObj, objLevelFilter, callback) {
		if(successfulBets) {
			// Read from array
			luckyMatchFilter(successfulBets, jsonObj, objLevelFilter, callback);
		}
		else {
			// Read from file
			// Asynchronous 'json' file read
			fs.readFile('successfulBets.json', function(err, data) {
				if (err) throw err;
				successfulBets = JSON.parse(data);
				luckyMatchFilter(successfulBets, jsonObj, objLevelFilter, callback);
			});
		}		
	};

	findHotBet = function(predictedWinners) {
		betNow = [];
		for(var i = 0; i < predictedWinners.length; ++i) {
			var obj = predictedWinners[i];
			var startTime = new Date(obj.startTime);
			var currentTime =  new Date();

			// { 	"runner-id":1052216604020016,
				// 	"side":"back",
				// 	"odds": 2.4,
				// 	"stake": 0.0
			// }

			if( startTime.getDate() === currentTime.getDate() && 
				startTime.getMonth() === currentTime.getMonth() && 
				startTime.getFullYear() === currentTime.getFullYear())
			{
				// st = startTime.getHours() * 60 + startTime.getMinutes();
				// ct = currentTime.getHours() * 60 + currentTime.getMinutes();
				// if(ct - st > 1) // 1 min past from the start time

				// betMinutesOffset = 1; // place bet: +1 min before the start time, -5 min after the start time
				if(currentTime.getTime() > (startTime.getTime() - (betMinutesOffset * 60 * 1000)))
				{
					var betObj = {};
					betObj['runner-id'] = predictedWinners[i].runnerId;					
					betObj.odds = predictedWinners[i].back;
					betObj.side = 'back';
					betObj.stake = 1.0;

					betNow.push(betObj);
				}
			}
		}
		return betNow;
	};

		// Submit Offers
	// Submit one or more offers i.e. your intention or willingness to have bets with other users.
	submitOffers = function (callback) {
		// "16:30 Wincanton": {
		// 	"5 Tikkapick": {
		// 	  "runnerId": 1052216604020016,
		// 	  "back": 2.40,
		// 	  "lay": 2.64
		// 	},

		// var luckyBet = {
		// 	"odds-type":"DECIMAL",
		// 	"exchange-type":"back-lay",
		// 	"offers":
		// 	  [{
		// 		  "runner-id":1052216604020016,
		// 		  "side":"back",
		// 		  "odds": 2.4,
		// 		  "stake": 0.0
		// 	  }
		//   ]};

		// "{"odds-type":"DECIMAL","exchange-type":"back-lay","offers":[{"runner-id":1076420113760015,"odds":1.34482,"side":"back","stake":1}]}"

		var luckyBet = { "odds-type":"DECIMAL", "exchange-type":"back-lay" };
			luckyBet.offers = betNow; // list of bets

		var options = getDefaultOptions();
		options.method = 'POST';
		options.url = 'https://api.matchbook.com/edge/rest/v2/offers';
		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;
		// options.json = JSON.stringify(luckyBet); // Bet info
		// options.body = JSON.stringify(luckyBet); // Bet info
		options.json = luckyBet; // Bet info

		if(luckyBet.offers.length) {
			if(!isLockedForBetting) {
				request(options, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						console.log(response);
						return callback(null, response);
					}
					else {
						console.log(response.statusCode + " Error in bet placed");

						if(response.body.offers) {
							for(var count = 0; count < response.body.offers.length; ++count) {
								console.log(response.body.offers[count].errors);
							}
						}

						return callback(error,null);
					}
				});
			}//if(0)
		}
	};

	var nCallbacks = 0;
	var nCallbacksCompleted = 0;
	getEventInfo = function(sportName, event, eventId, startTime, callback) {
		getEvent(eventId, function(obj) {
					console.log(obj);
			db.sportId[sportName].events[event] = obj;
			db.sportId[sportName].events[event].id = eventId;
			db.sportId[sportName].events[event].start = startTime;

			++nCallbacksCompleted;
			if(nCallbacks === nCallbacksCompleted)
			{
				nCallbacksCompleted = 0;
				writeJsonFile(db.sportId[sportName],'result.json');

				findLuckyMatch(db.sportId[sportName], "events", function(err, data) {
						if(err){
							console.log(err);
							throw new Error(err);
						}
						else{
							if(data) {
								return callback(null, db.sportId[sportName]);
							}
						}
					});
			}
			return callback(null,false);
		});
	};

	run = function(sessionToken)
	{
		pastTime = new Date().getTime();
			// input  - null
			// output - sports id - {"name":"Horse Racing","id":24735152712200,"type":"SPORT"}
			// https://api.matchbook.com/edge/rest/lookups/sports
			getSports(sessionToken, function(err, data) {
				if(err){
					console.log(err);
					throw new Error(err);
				}
				else{
					console.log(data);

					// input  - sports id
					// output - event id
					// https://api.matchbook.com/edge/rest/events?sport-ids=24735152712200
					// getEvents('24735152712200'); // sportsid
					getEvents(db.sportId['Horse Racing'], function(err, data) {
						if(err){
							console.log(err);
							throw new Error(err);
						}
						else{
							console.log(data);
							var arr = Object.keys(db.sportId['Horse Racing'].events);
							
							nCallbacks = arr.length;
							for(var i = 0; i < arr.length; ++i)
							{
								// input  - event id
								// output - id (player)
								// https://api.matchbook.com/edge/rest/events/1033210398700016
								getEventInfo('Horse Racing', arr[i],
								db.sportId['Horse Racing'].events[arr[i]].id,
								db.sportId['Horse Racing'].events[arr[i]].start,
								function(err, data) {
									if(err){
										console.log(err);
										throw new Error(err);
									}
									else{
										if(data) {
											console.log(data); // result data
											// fun(JSON.parse(xhr.responseText), 'events');
											// fun(data, 'events');
											currentTime = new Date().getTime();
											remainingTime = currentTime - pastTime;
											remainingTime = (1000 - remainingTime) > 0 ? 1000 - remainingTime : 0;
											setTimeout(function() {
												run(sessionToken);
											}.bind(this), remainingTime);

											//££££££££££££££££££££££££££££££££££££££££££££££££££££££££££
											// PLACE BET - CAREFULLY :)
											//££££££££££££££££££££££££££££££££££££££££££££££££££££££££££
											setTimeout(function() {
												submitOffers(function(err, response) {
													if(err){
														console.log(err);
													}
													else{
														console.log(response);
														for(var i = 0; i < response.body.offers.length; ++i) {
															var lastBetResult = response.body.offers[i];
															if(lastBetResult.status === 'matched' || lastBetResult.status === 'open') {
																// successfulBets.push(lastBetResult['runner-id']);
																successfulBets.push(lastBetResult['event-id']);
																writeJsonFile(successfulBets,'successfulBets.json');
															}
														}
													}
												});
											}.bind(this), 0);
										}
									}
								});
							}
						}
						}); // getEvents
				}
			}); // getSports
	}; // run

	(function () {
		login(function(err, sessionToken) {
			if(err){
				console.log(err);
			}
			else{
				console.log(sessionToken); // sessionToken
				run(sessionToken);
		} 
		}); // login
	})(); // IIF - Main entry (login)
}()); // namespace

/*

mb_get_sports
mb_get_events
mb_get_markets

https://github.com/xanadunf/matchbook


C# Project: https://www.dropbox.com/s/nm32ispvu8jr7hp/BpapiConsoleProject.zip?dl=0

Submit offers:
https://developers.matchbook.com/discuss/5af4eef233a27b0003957a07

Get Events

You can use the Live Betting category or navigation entry to help you with this.
Examples: 
https://www.matchbook.com/edge/rest/events?sport-ids=1&tag-url-names=live-betting&price-depth=0
https://api.matchbook.com/edge/rest/events?sport-ids=8&category-ids=410468520880009
https://api.matchbook.com/edge/rest/events?sport-ids=8&tag-url-names=live-betting
You can get all sport_ids and competitions :
https://api.matchbook.com/edge/rest/navigation


// browserify
npm install -g browserify --save

// Local web server
http-server  -p 8059 -c-1

*/