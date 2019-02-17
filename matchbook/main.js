(function () {
	// https://developers.matchbook.com/reference
	var request = require('request');
	var fs = require('fs');
	var sessionToken = null;
	var db = {};
	db.sportId = {};
	db.eventId = {};
	db.runnerId = {};

	getDefaultOptions = function()
	{
		return {
			method: 'GET',
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};
	};

	var sportsName = ['American Football','Athletics','Australian Rules','Baseball','Basketball','Boxing','Cricket','Cross Sport Special',
	'Cross Sport Specials','Current Events','Cycling','Darts','Gaelic Football','Golf','Greyhound Racing','Horse Racing',
	'Horse Racing (Ante Post)','Horse Racing Beta','Hurling','Ice Hockey'];

	writeJsonFile = function(jsonString, fileName)
	{
		// var jsonFormat = JSON.parse(jsonString);
		var jsonFormat = jsonString;
		var data = JSON.stringify(jsonFormat, null, 2);
		
		// Asynchronous file write
		fs.writeFile(fileName, data, function(err) {
			if (err) throw err;
			//console.log('Data written to file');
		});
	};

	requestResponse = function(options, obj, destObj, keys, closureSave) {
		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			db.sportId[closureSave][obj] = {};

			var jsonFormat = JSON.parse(body);

			for(var key in jsonFormat[obj])
			{
				if( jsonFormat[obj].hasOwnProperty(key))
				{
					key = Number(key);
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
		});



		/////////////////////////////////////////////////////////////////////////////////
		/*
		var options = getDefaultOptions();

		if(!url) return null;
		options.url = url;
		if(method)	options.method = method;
		if(headers)	options.headers = headers;
		if(qs)	options.qs = qs;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);
	
			//console.log(body);
		});
		*/
	};

	// Login
	// Login to Matchbook and create a new session.
	// The response includes a session token value. This value should be included with all subsequent requests as either a 
	// cookie named "session-token" or a header named "session-token".
	// Matchbook sessions live for approximately 6 hours so only 1 login request every 6 hours is required. The same session 
	// should be used for all requests in that period.
	login = function () {
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

					// getSession
					var options = getDefaultOptions();
					options.url = 'https://api.matchbook.com/bpapi/rest/security/session';

					// Cookie data for maintaining the session
					options.headers['session-token'] = sessionToken;
			
					request(options, function (error, response, body) {
						if (error) throw new Error(error);
						// console.log(options);
						// console.log(body);
					});
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
	getSports = function () {
		var options = getDefaultOptions();
		options.url = 'https://api.matchbook.com/edge/rest/lookups/sports';
		options.qs = { offset: '0', 'per-page': '20', order: 'name asc', status: 'active' };

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

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
	getEvents = function (sportId) {
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
		requestResponse(options, 'events', 'name', ['id'],'Horse Racing');

		/*
		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			var jsonFormat = JSON.parse(body);

			for(var event in jsonFormat['events'])
			{
				if( jsonFormat['events'].hasOwnProperty(event))
				{
					event = Number(event);
					db.eventId[jsonFormat['events'][event].name] = jsonFormat['events'][event].id;

					//db.sportId[jsonFormat['sports'][sport].name].id = jsonFormat['sports'][sport].id;
				}
			}

			writeJsonFile(body,'event.json');
			// console.log(Object.keys(db.eventId));

			// console.log(body);
		});
		*/
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

	/*
	// Get Event
	getEvent = function (event_id) {
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

			for(var runner in runners)
			{
				if(runners.hasOwnProperty(runner))
				{
					runner = Number(runner);
					db.runnerId[runners[runner].name] = {};
					db.runnerId[runners[runner].name].runnerId = runners[runner].id;

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

					db.runnerId[runners[runner].name].back = back.length ? Math.max.apply(null, back): 0;
					db.runnerId[runners[runner].name].lay  =  lay.length ? Math.min.apply(null, lay): 0;
				}
			}

			writeJsonFile(body,'runners.json');
			//console.log(Object.keys(db.runnerId));

			//console.log(body);
		});
	};
	*/

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
	}

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

	// Submit Offers
	// Submit one or more offers i.e. your intention or willingness to have bets with other users.
	submitOffers = function () {
		// https://api.matchbook.com/edge/rest/v2/offers
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

	var nCallbacks = 0;
	var nCallbacksCompleted = 0;
	getEventInfo = function(sportName, event, eventId) {
		getEvent(eventId, function(obj) {
					console.log(obj);
			db.sportId[sportName].events[event] = obj;
			db.sportId[sportName].events[event].id = eventId;

			++nCallbacksCompleted;
			if(nCallbacks === nCallbacksCompleted)
			{
				writeJsonFile(db.sportId[sportName],'result.json');
			}
		});
	};

	(function () {

		login();
		// logout();
		
		setTimeout(function(){

			// input  - null
			// output - sports id - {"name":"Horse Racing","id":24735152712200,"type":"SPORT"}
			// https://api.matchbook.com/edge/rest/lookups/sports
			getSports();

			// input  - sports id
			// output - event id
			// https://api.matchbook.com/edge/rest/events?sport-ids=24735152712200
			// getEvents('24735152712200'); // sportsid
			setTimeout(function() { 
				getEvents(db.sportId['Horse Racing']); }.bind(this), 2000);

			

			// input  - event id
			// output - id (player)
			// https://api.matchbook.com/edge/rest/events/1033210398700016
			// getEvent('1033210398700016'); // eventid
			
			setTimeout(function() {
				// var arr = Object.keys(db.eventId);
				// getEvent(db.eventId[arr[0]]);
				var arr = Object.keys(db.sportId['Horse Racing'].events);
				// getEvent(db.sportId['Horse Racing'].events[arr[0]].id, function(obj) {
				// 	console.log(obj);
				// });

				// getEventInfo('Horse Racing', arr[0], db.sportId['Horse Racing'].events[arr[0]].id);

				nCallbacks = arr.length;
				for(var i = 0; i < arr.length; ++i)
				{
					getEventInfo('Horse Racing', arr[i], db.sportId['Horse Racing'].events[arr[i]].id);
				}

			}.bind(this), 10000);

			

			// input - event id, market id
			// output -
			// https://www.matchbook.com/edge/rest/events/1033210398700016/markets/1033210399940016/runners
			//getRunners('1033210398700016','1033210399940016');
			
		}.bind(this), 5000);
	})();
}());

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

*/