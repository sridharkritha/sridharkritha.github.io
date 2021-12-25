(function () {
	// https://developers.matchbook.com/reference
	const request = require('request');
	const fs = require('fs');
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	const UTIL = require('./util');
	const DOOR = require('./door');
	const MISC = require('./misc');
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	let sri = 0;
	let g_sessionToken = null;
	let g_db = {};
	g_db.sportId = {};
	let g_predictedWinners = [];
	let g_successfulBets = null; // array
	let g_pastTime = 0;
	let g_currentTime = 0;
	let g_betNow = [];
	const g_sessionExpireTimeLimit = 5 * 60 * 60 * 1000; // 6 hours but create a new session every 5 hours
	let g_sessionStartTime = 0;
	let g_sportsList = [];
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	let g_winConfidencePercentage = 80; // ex: 100  (100% or more)
	let g_minProfitOdd = 0.8; // ex: 1 (1/1 = 1 even odd [or] 2.00 in decimal)
	let g_betMinutesOffset = 1; // place bet: +1 min before the start time, -5 min after the start time
	let g_maxRunnersCount = 8;
	let g_whichDayEvent = 'today'; // 'today' or 'tomorrow' or "2019-12-24" (ISO specific date)
	/*
	const sportsName = ['American Football','Athletics','Australian Rules','Baseball','Basketball','Boxing','Cricket','Cross Sport Special',
	'Cross Sport Specials','Current Events','Cycling','Darts','Gaelic Football','Golf','Greyhound Racing','Horse Racing',
	'Horse Racing (Ante Post)','Horse Racing Beta','Hurling','Ice Hockey'];
	*/
	// ['Horse Racing'];  ['ALL']; ['Cricket']; ['Horse Racing','Greyhound Racing', 'Cricket'];
	// let g_sportsInterested = ['Horse Racing','Greyhound Racing', 'Cricket'];  
	let g_sportsInterested = ['Horse Racing'];  

	const g_isLockedForBetting = true; // true

	if(g_isLockedForBetting)
	{
		g_winConfidencePercentage = 1; // ex: 100  (100% or more)
		g_minProfitOdd = 0.1; // ex: 1 (1/1 = 1 even odd [or] 2.00 in decimal)
		g_betMinutesOffset = 300; // place bet: +1 min before the start time, -5 min after the start time		
		g_whichDayEvent = '2021-12-26'; // 'today' or 'tomorrow' or "2019-12-24" (ISO specific date)
	}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	callbackCount = function(currentCount , totalCount) {
		this.currentCount = currentCount || 0;
		this.totalCount = totalCount || 0;
	};

	isAlreadyBetPlacedEvent = function(eventId) {
		if(g_successfulBets && g_successfulBets.length) {
			for(let count  = 0; count < g_successfulBets.length; ++count) {
				if("event-id" in  g_successfulBets[count]) {
					if(g_successfulBets[count]["event-id"] === eventId) 
						return true;
				}
			}
		}
		return false;
	};

	populateEventData = function(jsonFormat, callback, extraArgs) {

		// extraArgs = { obj, destObj, keys, filterDay, closureSave, sports_cbCount }
		
		if (jsonFormat[extraArgs.obj] && Object.keys(jsonFormat[extraArgs.obj]).length) {
			// not empty
			g_db.sportId[extraArgs.closureSave][extraArgs.obj] = {};

			for(let key in jsonFormat[extraArgs.obj])
			{
				if( jsonFormat[extraArgs.obj].hasOwnProperty(key))
				{
					key = Number(key);
					const index = extraArgs.keys.indexOf("start");
					let dateString;

					if(index !== -1)
					{
						dateString = jsonFormat[extraArgs.obj][key][extraArgs.keys[index]]; // "start": "2019-03-01T16:10:00.000Z"
						let dateObject = new Date(dateString);
						let currentDate = new Date();
						if(extraArgs.filterDay === 'today')
						{
							// Thu Feb 28 2019 22:04:39 GMT+0000
							currentDate = new Date();
						}
						else if(extraArgs.filterDay === 'tomorrow')
						{
							// Fri Mar 01 2019 00:04:39 GMT+0000
							let today = new Date();
							let tomorrow = new Date();
							currentDate = new Date(tomorrow.setDate(today.getDate()+1)); // next day
						}
						else if(new Date(extraArgs.filterDay).getDate() === new Date(dateString).getDate())
						{
							// some specific date
							currentDate = new Date(extraArgs.filterDay);
						}

						if(dateObject.getDate() !== currentDate.getDate() || dateObject.getMonth() !== currentDate.getMonth()
							|| dateObject.getFullYear() !== currentDate.getFullYear())
						{
							console.log('SKIP: ' + dateObject + ' !== ' + currentDate);
							continue; // skip
						}
					}

					const name = jsonFormat[extraArgs.obj][key][extraArgs.destObj];
					g_db.sportId[extraArgs.closureSave][extraArgs.obj][name] = {};

					for(let i = 0; i < extraArgs.keys.length; ++i)
					{
						g_db.sportId[extraArgs.closureSave][extraArgs.obj][name][extraArgs.keys[i]] = jsonFormat[extraArgs.obj][key][extraArgs.keys[i]];
					}
				}
			}
		}
		
		//UTIL.writeJsonFile(body,'event.json');
		// console.log(Object.keys(g_db.eventId));
		// console.log(body);
		// ++extraArgs.closureSave.currentCount;
		return callback(null, extraArgs.closureSave, extraArgs.closureSave);
	};

	requestResponse = function(options, obj, destObj, keys, filterDay, closureSave, sports_cbCount, callback) {
		request(options, function (error, response, body) {
			if (error) {
				return callback(error, sports_cbCount, null);
			}

			const jsonData = JSON.parse(body);

			morePages(options, jsonData.total, populateEventData, callback, { obj, destObj, keys, filterDay, closureSave, sports_cbCount });

		});
	};

	// Get Sports
	// Get the list of sports supported by Matchbook
	getSports = function (callback) {
		const options = UTIL.getDefaultOptions();
		options.url = 'https://api.matchbook.com/edge/rest/lookups/sports';
		options.qs = { offset: '0', 'per-page': '20', order: 'name asc', status: 'active' };

		// Cookie data for maintaining the session
		options.headers['session-token'] = g_sessionToken;

		request(options, function (error, response, body) {
			if (error) {
				return callback(error,null);
			}

			const jsonData = JSON.parse(body);

			morePages(options, jsonData.total, populateSportIds, callback);
		});
	};

	populateSportIds = function(jsonData, callback) {
		let sportsName = null;
		g_sportsList = [];

		for(let sport in jsonData['sports'])
		{
			if(jsonData['sports'].hasOwnProperty(sport))
			{
				sport = Number(sport);
				// g_db.sportId[jsonData['sports'][sport].name] = jsonData['sports'][sport].id;
				sportsName = jsonData['sports'][sport].name;
				g_sportsList.push(sportsName);
				g_db.sportId[jsonData['sports'][sport].name] = {};
				g_db.sportId[jsonData['sports'][sport].name].id = jsonData['sports'][sport].id;
			}
		}

		// UTIL.writeJsonFile(body,'g_sportsList.json');
		// console.log(body);
		// console.log(Object.keys(g_db.sportId));
		return callback(null);
	};

	morePages = function(options, perPage, updateMethod, callback, extraArgs) {

		options.qs['per-page'] = perPage;

		request(options, function (error, response, body) {
			if (error) {
				return callback(error,null);
			}

			const jsonData = JSON.parse(body);

			updateMethod(jsonData, callback, extraArgs);
		});
	};

	// Get Events
	// Get a list of events available on Matchbook ordered by start time.
	getEvents = function (sport, sports_cbCount, callback) {
		const sportId = g_db.sportId[sport];
		const options = UTIL.getDefaultOptions();
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
		options.headers['session-token'] = g_sessionToken;

		// closure needed for storing the sport name ????
		requestResponse(options, 'events', 'name', ['id','start'], g_whichDayEvent, sport, sports_cbCount, callback);
	};

	// Get Event
	getEvent = function (event_id, returnFunction) {
		const options = UTIL.getDefaultOptions();
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
		options.headers['session-token'] = g_sessionToken;

		request(options, function (error, response, body) {
			if (error) 
			throw new Error(error);

			const jsonFormat = JSON.parse(body);

			const runnersObj = {};

			if(jsonFormat.markets && jsonFormat.markets.length)
			//if(jsonFormat.markets.length && (jsonFormat.markets[0].name === 'WIN' || jsonFormat.markets[0].name === 'Winner'))
			{
				if(jsonFormat.name === "13:05 Turffontein")
				{
					let x;
					x = 10;
				}

				let runners = jsonFormat.markets[0].runners;

			for(let runner in runners)
			{
				if(runners.hasOwnProperty(runner))
				{
					runner = Number(runner);
					
					runnersObj[runners[runner].name] = {};
					runnersObj[runners[runner].name].runnerId = runners[runner].id;

					const back = [];
					const lay = [];
					for(let price in runners[runner]['prices'])
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
		}

			returnFunction(runnersObj); // return the object from the callback function 

			// UTIL.writeJsonFile(body,'runners.json');
			//console.log(Object.keys(runnersObj));
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

	luckyMatchFilter = function(jsonObj, objLevelFilter, callback) {
		g_predictedWinners = []; 
		for(let prop in jsonObj) {
			if(jsonObj.hasOwnProperty(prop)) {
				if(prop === objLevelFilter) { // events: { }
				for(let race in jsonObj[prop]) { 
					if(jsonObj[prop].hasOwnProperty(race)) { // 15:05 Sandown
						const raceId = jsonObj[prop][race].id;

							// Check if already a successful bet has been placed on that event
							if(!isAlreadyBetPlacedEvent(raceId))
							{
								const startTime = jsonObj[prop][race].start;
								const raceName = race;
								const luckyRunner = [];
								for(let runner in jsonObj[prop][race]) { 
									if(jsonObj[prop][race].hasOwnProperty(runner)) {
										if(typeof jsonObj[prop][race][runner] === "object") {
											let runnerObj = jsonObj[prop][race][runner];
											runnerObj.name = runner;
											let back = jsonObj[prop][race][runner].back;
											if(!back) {
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
									let winPercentage = (luckyRunner[1][0] - luckyRunner[0][0]) * 100 / luckyRunner[0][0];
									luckyRunner[0][1].numberOfRunners = luckyRunner.length;
									// winPercentage = winPercentage + (5 / luckyRunner.length * 6);
									luckyRunner[0][1].winPercentage = winPercentage;
									luckyRunner[0][1].startTime = startTime;
									luckyRunner[0][1].raceId = raceId;
									luckyRunner[0][1].raceName = raceName;
									let profitOdd = luckyRunner[0][1].back - 1;
								
									jsonObj[prop][race].luckyWinner = luckyRunner[0][1]; // first element from an array
		
									// Build the predictedWinner list
									if((winPercentage > g_winConfidencePercentage) && (profitOdd > g_minProfitOdd) && luckyRunner.length <= g_maxRunnersCount)
									{
										g_predictedWinners.push(luckyRunner[0][1]);
									}
								}
							}
					}
				}
				}
			}
		}
		g_betNow = findHotBet(g_predictedWinners);
		return callback(null, g_betNow);
	};

	findLuckyMatch = function(jsonObj, objLevelFilter, callback) {
		if(g_successfulBets) {
			// Read from array
			luckyMatchFilter(jsonObj, objLevelFilter, callback);
		}
		else {
			// Check if a file is exist or not
			fs.open('./data/successfulBets.json', 'r', function(err, fd)
			{
				if(err)
				{
					if(err.code === 'ENOENT')
					{
						// File is not exist, creat a empty file
						fs.closeSync(fs.openSync('./data/successfulBets.json', 'w'));
						g_successfulBets = [] ;
						luckyMatchFilter(jsonObj, objLevelFilter, callback);
						console.log("Success: ./data/successfulBets.json - created and saved!");
					}
				}
				else
				{
					// File is exist, read from the file (Asynchronous 'json' file read)
					fs.readFile('./data/successfulBets.json', function(err, data) {
						if (err) throw err;
						if(data && data.length) {
							g_successfulBets = JSON.parse(data);
						}
						else {
							g_successfulBets = [] ;
						}
						
						luckyMatchFilter(jsonObj, objLevelFilter, callback);
					});
				}
			});
		}
	};

	findHotBet = function(g_predictedWinners) {
		g_betNow = [];
		for(let i = 0; i < g_predictedWinners.length; ++i) {
			let obj = g_predictedWinners[i];
			let startTime = new Date(obj.startTime);
			let g_currentTime =  new Date();

			// { 	"runner-id":1052216604020016,
				// 	"side":"back",
				// 	"odds": 2.4,
				// 	"stake": 0.0
			// }

			if( startTime.getDate() === g_currentTime.getDate() && startTime.getMonth() === g_currentTime.getMonth() && 
				startTime.getFullYear() === g_currentTime.getFullYear())
			{
				// g_betMinutesOffset = 1; // place bet: +1 min before the start time, -5 min after the start time
				if(g_currentTime.getTime() > (startTime.getTime() - (g_betMinutesOffset * 60 * 1000)))
				{
					if(!(g_currentTime.getTime() > startTime.getTime() + 2* 60*1000))
					{
						let betObj = {};

						let fractionNumber = 0;
						fractionNumber = g_predictedWinners[i].back;
						let numberBeforeDecimalPoint  = Math.floor(fractionNumber); // 2.13453 => 2
						let numberAfterDecimalPoint = (fractionNumber % 1).toFixed(2); // 2.13453 => 0.13
						let roundToNearestDecimalTen = (Math.ceil((((numberAfterDecimalPoint) * 100)+1)/10)*10)/100; // 0.13 = 0.20
						let roundedOdd = numberBeforeDecimalPoint + roundToNearestDecimalTen; // 2.13453 => 2.20

						betObj.odds = roundedOdd; // for reducing the commission charge
						// betObj.odds = g_predictedWinners[i].back;
						betObj['runner-id'] = g_predictedWinners[i].runnerId;
					
						betObj.side = 'back';
						betObj.stake = 0.1; // 1.0

						if(g_isLockedForBetting)
						{
							// mock bet
							betObj['event-id'] = g_predictedWinners[i].raceId;
							betObj['status'] = 'matched';
							betObj['decimal-odds'] = betObj.odds;
							betObj['event-name'] =  g_predictedWinners[i].raceName;
							betObj['runner-name'] = g_predictedWinners[i].name;
						}

						g_betNow.push(betObj);
					}
				}
			}
		}
		return g_betNow;
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

		let luckyBet = { "odds-type":"DECIMAL", "exchange-type":"back-lay" };
			luckyBet.offers = g_betNow; // list of bets

			let options = UTIL.getDefaultOptions();
		options.method = 'POST';
		options.url = 'https://api.matchbook.com/edge/rest/v2/offers';
		// Cookie data for maintaining the session
		options.headers['session-token'] = g_sessionToken;
		// options.json = JSON.stringify(luckyBet); // Bet info
		// options.body = JSON.stringify(luckyBet); // Bet info
		options.json = luckyBet; // Bet info

		if(luckyBet.offers.length) {
			if(!g_isLockedForBetting) {
				request(options, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						//console.log(response);
						return callback(null, response);
					}
					else {
						console.log(response.statusCode + " Error in bet placed");

						if(response.body.offers) {
							for(let count = 0; count < response.body.offers.length; ++count) {
								console.log(response.body.offers[count].errors);
							}
						}

						return callback(error,null);
					}
				});
			}
			else
			{
				// mock bet placed
				//console.log(response);
				for(let i = 0; i < g_betNow.length; ++i) {
					let lastBetResult = g_betNow[i];

					let obj = {		"event-id":lastBetResult['event-id'],
									"status":lastBetResult['status'],
									"decimal-odds":lastBetResult['decimal-odds'],
									"event-name":lastBetResult['event-name'],
									"runner-name":lastBetResult['runner-name'],
									"time": UTIL.getCurrentTimeDate() 
							};
					console.log(obj);
					g_successfulBets.push(obj);
					
					UTIL.writeJsonFile(g_successfulBets,'./data/mockSuccessfulBets.json');
				}
			}
		}
	};

	getEventInfo = function(sportName, event, eventId, startTime, sports_cbCount, events_cbCount, callback) {
		getEvent(eventId, function(obj) {
					//console.log(obj);
			
			g_db.sportId[sportName].events[event] = obj;  /// ?? events --- null
			g_db.sportId[sportName].events[event].id = eventId;
			g_db.sportId[sportName].events[event].start = startTime;

			++events_cbCount.currentCount;
			if(events_cbCount.currentCount === events_cbCount.totalCount)
			{
				UTIL.writeJsonFile(g_db.sportId[sportName],'./data/result.json');

				findLuckyMatch(g_db.sportId[sportName], "events", function(err, data) {
						if(err){
							console.log(err);
							throw new Error(err);
						}
						else{
							if(data) {
								return callback(null, sports_cbCount, events_cbCount, true);
							}
						}
					});
			}
			return callback(null, sports_cbCount, events_cbCount, false);
		});
	};

	run = function()
	{
		++sri;
		console.log(UTIL.getCurrentTimeDate());
		g_pastTime = new Date().getTime();

		// findSportsIds();
	};

	findSportsIds = function() {
		// input  - null
		// output - sports id - {"name":"Horse Racing","id":24735152712200,"type":"SPORT"}
		// https://api.matchbook.com/edge/rest/lookups/sports
		getSports(callback_getSports);
	};

	callback_getSports = function(err, data) {
		if(err) {
			console.log(err);
			throw new Error(err);
		}
		else{
			if(g_sportsInterested.length === 1 && g_sportsInterested[0].toLowerCase() === 'all') {
				g_sportsInterested = g_sportsList;
			}

			--sri;
			console.log(sri);


			let sports_cbCount = new callbackCount(0, g_sportsInterested.length);
			// Calling callback functions inside a loop
			g_sportsInterested.forEach(function(sport) {
				// input  - sports id
				// output - event id
				// https://api.matchbook.com/edge/rest/events?sport-ids=24735152712200
				// getEvents('24735152712200'); // sportsid
				// getEvents(g_db.sportId['Horse Racing'], function(err, data) {
				getEvents(sport, sports_cbCount, callback_getEvents);
			}); //forEach
		}
	};

	callback_getEvents = function(err, sports_cbCount, sport) {
		if(err){
			console.log(err);
			console.log("ERROR: TRYING AGAIN BY A NEW REQUEST");
			run();

			// throw new Error(err);
		}
		else{
			if('events' in g_db.sportId[sport]) {
				// 14:00 Newbury, 14:10 Fontwell, 14:20 Ayr, 14:35 Newbury, 14:40 Fairview...... etc
				let races = Object.keys(g_db.sportId[sport].events);
				let events_cbCount = new callbackCount(0, races.length);

				races.forEach(function(race) {
					// input  - event id
					// output - id (player)
					// https://api.matchbook.com/edge/rest/events/1033210398700016
					getEventInfo(sport, race, g_db.sportId[sport].events[race].id, g_db.sportId[sport].events[race].start, 
									sports_cbCount, events_cbCount, callback_getEventInfo);
				}); //forEach
			}
		}
	};

	callback_getEventInfo = function(err, sports_cbCount, events_cbCount, isReadyForBetting) {
		if(err){
			console.log(err);
			throw new Error(err);
		}

		if(isReadyForBetting) {

			++sports_cbCount.currentCount;

			submitOffers(callback_submitOffers); // sports wise bet submission not as submitting all sports bet in one go.

			if(events_cbCount.totalCount && events_cbCount.currentCount === events_cbCount.totalCount &&
				sports_cbCount.totalCount && sports_cbCount.currentCount === sports_cbCount.totalCount)		
			{
				events_cbCount.currentCount = events_cbCount.totalCount = 0;
				sports_cbCount.currentCount = sports_cbCount.totalCount = 0;

				g_currentTime = new Date().getTime();
				remainingTime = g_currentTime - g_pastTime;
				remainingTime = (1000 - remainingTime) > 0 ? 1000 - remainingTime : 0;

				setTimeout(function() {
					// Check for session expire timeout
					if(g_currentTime - new Date(g_sessionStartTime).getTime() > g_sessionExpireTimeLimit) {
						getNewSession();
					}
					else {
						run();
					}
				}.bind(this), remainingTime);
			}
		}
	};

	callback_submitOffers = function(err, response) {
		if(err){
			console.log(err);
		}
		else{
			//console.log(response);
			for(let i = 0; i < response.body.offers.length; ++i) {
				let lastBetResult = response.body.offers[i];
				if(lastBetResult.status === 'matched' || lastBetResult.status === 'open') {
					let obj = {   "event-id":lastBetResult['event-id'],
					"status":lastBetResult['status'],
					"decimal-odds":lastBetResult['decimal-odds'],
					"event-name":lastBetResult['event-name'],
					"runner-name":lastBetResult['runner-name'],
					"time": UTIL.getCurrentTimeDate() };
					console.log(obj);
					g_successfulBets.push(obj);
					
					UTIL.writeJsonFile(g_successfulBets,'./data/g_successfulBets.json');
				}
			}
		}
	};

	loginCallback = function(err, sessionToken, sessionStartTime) {
		if(err){
			g_sessionToken = null;
			g_sessionStartTime = 0;
			console.log(err);
		}
		else{
			g_sessionToken = sessionToken;
			g_sessionStartTime = sessionStartTime;

			findSportsIds(); // run once bcos sports id's are constant

			run();
		} 
	};

	getNewSession = function() {
		DOOR.getLastSession(loginCallback);	
		// DOOR.login(loginCallback); // login
	};

	// Entry Function
	(function () {
		getNewSession();
	})(); // IIF - Main entry (login)
}()); // namespace

/*

Note: 'Sport id' is NOT EQUAL to 'Event id'
	  Sport id is constant(HorseRace = 24735152712200) but Event id changes every day(24thDec Kempton HorseRace = 1942888205470016)
	




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