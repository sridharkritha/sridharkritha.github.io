(function () {
	// https://developers.matchbook.com/reference
	var request = require('request');
	var fs = require('fs');
	var sessionToken = null;
	var db = {};
	db.sportId = {};
	db.eventId = {};
	db.runnerId = {};

	var sportsName = ['American Football','Athletics','Australian Rules','Baseball','Basketball','Boxing','Cricket','Cross Sport Special',
	'Cross Sport Specials','Current Events','Cycling','Darts','Gaelic Football','Golf','Greyhound Racing','Horse Racing',
	'Horse Racing (Ante Post)','Horse Racing Beta','Hurling','Ice Hockey'];

	writeJsonFile = function(jsonString, fileName)
	{
		var jsonFormat = JSON.parse(jsonString);
		var data = JSON.stringify(jsonFormat, null, 2);
		
		// Asynchronous file write
		fs.writeFile(fileName, data, function(err) {
			if (err) throw err;
			console.log('Data written to file');
		});
	}

	requestResponse = function(url, method, headers, qs) {
		var options = {
			method: 'GET',
			headers: { 'user-agent': 'api-doc-test-client' }
		};

		if(!url) return null;
		options.url = url;
		if(method)	options.method = method;
		if(headers)	options.headers = headers;
		if(qs)	options.qs = qs;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);
	
			console.log(body);
		});
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

					//////////////////////////////////////////////////////////////
					// getSession
					var options = {
						method: 'GET',
						url: 'https://api.matchbook.com/bpapi/rest/security/session',
						headers: { 
							'Content-Type': 'application/json',
							'user-agent': 'api-doc-test-client' 
						}
					};

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
		var options = {
			method: 'DELETE',
			url: 'https://api.matchbook.com/bpapi/rest/security/session',
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);
		});
	};

	// Get Session
	// Get the current session information.
	// This API provides the ability to validate a session is still active. A successful response indicates a valid and active
	// session. A 401 response means that the session has expired.
	getSession = function () {
		var options = {
			method: 'GET',
			url: 'https://api.matchbook.com/bpapi/rest/security/session',
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);
		});
	};

	// Get Account
	// Get the account information for the user currently logged in.
	// This API requires authentication and will return a 401 in case the session expired or no session token is provided.
	getAccount = function () {
		var options = {
			method: 'GET',
			url: 'https://api.matchbook.com/edge/rest/account',
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);
		});
	};

	// Get Casino Wallet Balance
	// Get the casino wallet balance for the user currently logged in.
	// This API requires authentication and will return a 401 in case the session expired or no session token is provided.
	getCasioWalletBalance = function () {
		var options = {
			method: 'GET',
			url: 'https://api.matchbook.com/bpapi/rest/account/balance',
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);
		});
	};

	// Get Sports Wallet Balance
	// Get the new sports balance for the user currently logged in.
	// This API requires authentication and will return a 401 in case the session expired or no session token is provided.
	getSportsWalletBalance = function () {
		var options = {
			method: 'GET',
			url: 'https://api.matchbook.com/edge/rest/account/balance',
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);
			console.log(body);
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
		var options = {
			method: 'GET',
			url: 'https://api.matchbook.com/edge/rest/lookups/sports',
			qs:
			{
				offset: '0',
				'per-page': '20',
				order: 'name asc',
				status: 'active'
			},
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			var jsonFormat = JSON.parse(body);

			for(var i = 0; i < jsonFormat['sports'].length; ++i)
			{
				db.sportId[jsonFormat['sports'][i].name] = jsonFormat['sports'][i].id;
			}

			writeJsonFile(body,'sportsList.json');
			// console.log(body);
			// console.log(Object.keys(db.sportId));
		});
	};

	// Get Navigation
	// Get the tree structure used for the navigation of events.
	getNavigation = function () {
		var options = {
			method: 'GET',
			url: 'https://api.matchbook.com/edge/rest/navigation',
			qs: { offset: '0', 'per-page': '20' },
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);
		});
	};

	// Get Events
	// Get a list of events available on Matchbook ordered by start time.
	getEvents = function (sportId) {
		var options = {
			method: 'GET',
			url: 'https://api.matchbook.com/edge/rest/events',
			qs:
			{
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
			},
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};

		if(sportId)
		{
			//options.qs['sport-ids'] = ids;
			//options.qs['ids'] = ids;
			options.url = 'https://api.matchbook.com/edge/rest/events?sport-ids=' + sportId;
		}

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			var jsonFormat = JSON.parse(body);

			for(var i = 0; i < jsonFormat['events'].length; ++i)
			{
				db.eventId[jsonFormat['events'][i].name] = jsonFormat['events'][i].id;
			}

			writeJsonFile(body,'event.json');
			console.log(Object.keys(db.eventId));

			console.log(body);
		});
	};

	// Get Event
	getEvent = function (event_id) {
		var options = {
			method: 'GET',
			qs:
			{
				'exchange-type': 'back-lay',
				'odds-type': 'DECIMAL',
				'include-prices': 'false',
				'price-depth': '3',
				'price-mode': 'expanded',
				'minimum-liquidity': '10',
				'include-event-participants': 'false'
			},
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
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
			console.log(Object.keys(db.runnerId));

			//console.log(body);
		});
	};

	// Get Markets
	getMarkets = function () {
		var options = {
			method: 'GET',
			url: 'https://api.matchbook.com/edge/rest/events/:event_id/markets',
			qs:
			{
				offset: '0',
				'per-page': '20',
				states: 'open,suspended',
				'exchange-type': 'back-lay',
				'odds-type': 'DECIMAL',
				'include-prices': 'false',
				'price-depth': '3',
				'price-mode': 'expanded',
				'minimum-liquidity': '10'
			},
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);
		});
	};

	// Get Market
	getMarket = function () {
		var options = {
			method: 'GET',
			url: 'https://api.matchbook.com/edge/rest/events/:event_id/markets/:market_id',
			qs:
			{
				'exchange-type': 'back-lay',
				'odds-type': 'DECIMAL',
				'include-prices': 'false',
				'price-depth': '3',
				'price-mode': 'expanded',
				'minimum-liquidity': '10'
			},
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);
		});
	};

	// Get Runners
	getRunners = function (eventId, marketId) {
		var options = {
			method: 'GET',
			qs:
			{
				states: 'open,suspended',
				'include-withdrawn': 'true',
				'include-prices': 'true',
				'price-depth': '3',
				'price-mode': 'expanded',
				'exchange-type': 'back-lay',
				'odds-type': 'DECIMAL',
				'minimum-liquidity': '10'
			},
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};

		// event id and market id
		options.url = 'https://api.matchbook.com/edge/rest/events/'+ eventId +'/markets/' + marketId + '/runners';

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);
		});
	};

	// Get Runner
	getRunner = function () {
		var options = {
			method: 'GET',
			url: 'https://api.matchbook.com/edge/rest/events/:event_id/markets/:market_id/runners/:runner_id',
			qs:
			{
				'include-prices': 'false',
				'price-depth': '3',
				'price-mode': 'expanded',
				'exchange-type': 'back-lay',
				'odds-type': 'DECIMAL',
				'minimum-liquidity': '10'
			},
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);
		});
	}

	// Get Prices
	getPrices = function () {
		var options = {
			method: 'GET',
			url: 'https://api.matchbook.com/edge/rest/events/:event_id/markets/:market_id/runners/:runner_id/prices',
			qs:
			{
				'exchange-type': 'back-lay',
				'odds-type': 'DECIMAL',
				depth: '3',
				'minimum-liquidity': '10',
				'price-mode': 'expanded'
			},
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);
		});
	};

	// Get Popular Markets
	getPopularMarkets = function () {
		var options = {
			method: 'GET',
			url: 'https://api.matchbook.com/edge/rest/popular-markets',
			qs:
			{
				'exchange-type': 'back-lay',
				'odds-type': 'DECIMAL',
				'price-depth': '3',
				'price-mode': 'expanded',
				'minimum-liquidity': '10',
				'old-format': 'false'
			},
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);
		});
	};

	// Get Popular Sports
	getPopularSports = function () {
		var options = {
			method: 'GET',
			url: 'https://api.matchbook.com/edge/rest/popular/sports',
			qs: { 'num-sports': '5' },
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;
		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);
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
		var options = {
			method: 'DELETE',
			url: 'https://api.matchbook.com/edge/rest/v2/offers',
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);
		});
	};

	// Cancel Offer
	// Cancel a specific unmatched offer.
	cancelOffer = function () {
		var options = {
			method: 'DELETE',
			url: 'https://api.matchbook.com/edge/rest/v2/offers/:offer_id',
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);
		});
	};

	// Get Offers
	// Get the current unsettled offers. This can include offers in all statuses.
	getOffers = function () {
		var options = {
			method: 'GET',
			url: 'https://api.matchbook.com/edge/rest/v2/offers',
			qs: { offset: '0', 'per-page': '20', 'include-edits': 'false' },
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);
		});
	};

	// Get Offer
	// Get a single specific unsettled offer.
	getOffer = function () {
		var options = {
			method: 'GET',
			url: 'https://api.matchbook.com/edge/rest/v2/offers/:offer_id',
			qs: { 'include-edits': 'false' },
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);
		});
	};

	// Get Offer Edits
	// Get a single specific unsettled offer.
	getOfferEdits = function () {
		var options = {
			method: 'GET',
			url: 'https://api.matchbook.com/edge/rest/v2/offers/:offer_id/offer-edits',
			qs: { offset: '0', 'per-page': '20' },
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);
		});
	};

	// Get Offer Edit
	// Get a single specific unsettled offer.
	getOfferEdit = function () {
		var options = {
			method: 'GET',
			url: 'https://api.matchbook.com/edge/rest/v2/offers/:offer_id/offer-edits/:offer_edit_id',
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);
		});
	};

	// Get Old Wallet Transactions
	// Get a list of transactions on the old Matchbook wallet.
	getOldWalletTransactions = function () {
		var options = {
			method: 'GET',
			url: 'https://api.matchbook.com/bpapi/rest/reports/transactions',
			qs: { offset: '0', 'per-page': '20', categories: 'categories' },
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);
		});
	};

	// Get New Wallet Transactions
	// Get a list of transactions on the New Matchbook wallet.
	getNewWalletTransactions = function () {
		var options = {
			method: 'GET',
			url: 'https://api.matchbook.com/edge/rest/reports/v1/transactions',
			qs: { offset: '0', 'per-page': '20' },
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);
		});
	};


	// Get Current Offers
	// Get a list of current offers i.e. offers on markets yet to be settled.
	getCurrentOffers = function () {
		var options = {
			method: 'GET',
			url: 'https://api.matchbook.com/edge/rest/reports/v2/offers/current',
			qs: { offset: '0', 'per-page': '20', 'odds-type': 'DECIMAL' },
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);
		});
	};

	// Get Current Bets
	// Get a list of current bets i.e. bets on markets yet to be settled.
	getCurrentBets = function () {
		var options = {
			method: 'GET',
			url: 'https://api.matchbook.com/edge/rest/reports/v2/bets/current',
			qs: { offset: '0', 'per-page': '50', 'odds-type': 'DECIMAL' },
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);
		});
	};

	// Get Settled Bets
	getSettledBets = function () {
		var options = {
			method: 'GET',
			url: 'https://api.matchbook.com/edge/rest/reports/v2/bets/settled',
			qs: { offset: '0', 'per-page': '20' },
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);
		});
	};

	// Get Countries
	// Get the list of countries used for account registration.
	getCountries = function () {
		var options = {
			method: 'GET',
			url: 'https://api.matchbook.com/bpapi/rest/lookups/countries',
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);
		});
	};


	// Get Regions
	// Get the list of regions within a Country for account registration.
	getRegions = function () {
		var options = {
			method: 'GET',
			url: 'https://api.matchbook.com/bpapi/rest/lookups/regions/:country_id',
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);
		});
	};

	// Get Currencies
	// Get the list of currencies supported by Matchbook.
	getCurrencies = function () {
		var options = {
			method: 'GET',
			url: 'https://api.matchbook.com/bpapi/rest/lookups/currencies',
			headers: { 
				'Content-Type': 'application/json',
				'user-agent': 'api-doc-test-client' 
			}
		};

		// Cookie data for maintaining the session
		options.headers['session-token'] = sessionToken;

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);
		});
	};

	(function () {

		login();

		// logout();

		

		
		setTimeout(function(){
			// getSession();
			// getAccount();
			// getEvents('24776400363101');   //:24735152712200,
			// getEvents();
			// getEvent('241798357140019');
			
			// getPopularMarkets();
			//getNavigation();

			////////////////////////////////////////
			// input  - null
			// output - sports id - {"name":"Horse Racing","id":24735152712200,"type":"SPORT"}
			// https://api.matchbook.com/edge/rest/lookups/sports
			getSports();

			// input  - sports id
			// output - event id
			// https://api.matchbook.com/edge/rest/events?sport-ids=24735152712200
			// getEvents('24735152712200'); // sportsid
			setTimeout(function() { getEvents(db.sportId['Horse Racing']); }.bind(this), 2000);

			

			// input  - event id
			// output - id (player)
			// https://api.matchbook.com/edge/rest/events/1033210398700016
			// getEvent('1033210398700016'); // eventid
			
			setTimeout(function() {
				var arr = Object.keys(db.eventId);
				getEvent(db.eventId[arr[0]]);
			}.bind(this), 4000);

			

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