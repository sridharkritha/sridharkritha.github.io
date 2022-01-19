(function () {
	// https://developers.matchbook.com/reference
	const request = require('request');

	const CONNECTIONS = require("./connections");
	const io = CONNECTIONS.io;
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	const FA    = require('./fileAccess');
	const TIMER = require('./timer');
	const UTIL  = require('./util');
	const DOOR  = require('./door');
	const MISC  = require('./misc');
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	const g_betCycleTime = 8000; // 1000 => 1 sec => Every 1 second scan for any new betting opportunity
	let g_betScanRound = 0;
	const g_scanStartTime = new Date();

	const g_BetStakeValue = 0.2;         // ( 0.1 = 1p, 1 = £1) your REAL MONEY !!!!
	const g_todayTotalBetAmountLimit = 10.0; // 10 => £10 = max Limit for today = SUM of all bet stakes
	let   g_remainingTotalBetAmountLimit = 0; 
	let   g_userBalance = 0.00;
	let   g_moneyStatus = {};
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	let g_sessionToken = null;
	let g_db = {};
	g_db.sportId = {};
	let g_predictedWinners = [];

	// const g_onlyOne_raceName = "14:35 Chepstow"; // test only one race
	// const g_onlyOne_raceName = "Burkina Faso vs Ethiopia";
	const g_onlyOne_raceName = null; 

	let g_alreadyPlacedBetList = {};			// client report data
	let g_allPredictedWinnerBetList = {};			// client report data
	let g_currentPredictedWinnerBetList = {};	// client report data

	let g_lastCycleElapsedTime = 0;
	let g_currentTime = 0;
	let g_betNow = [];
	const g_sessionExpireTimeLimit = 5 * 60 * 60 * 1000; // 6 hours but create a new session every 5 hours
	let g_sessionStartTime = 0;
	let g_sportsList = [];
	const g_sportsIdNameMapping = {};
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	

	let g_betMinutesOffset = 600; // (600 = 10hrs before). 1 => place bet: +1 min before the start time, -5 min after the start time	
	let g_winConfidencePercentage = 80; // 80 => comparison with nearest competitor ex: 100  (100% or more)
	let g_minProfitOdd = 0.7; // 0.7 ex: 1 (1/1 = 1 even odd [or] 2.00 in decimal)

	let g_maxRunnersCount = 25; // 16; // 8
	let g_whichDayEvent = 'today'; // 'today' or 'tomorrow' or "2019-12-24" (ISO specific date)

	/*
	const sportsName = ['American Football','Athletics','Australian Rules','Baseball','Basketball','Boxing','Cricket','Cross Sport Special',
	'Cross Sport Specials','Current Events','Cycling','Darts','Gaelic Football','Golf','Greyhound Racing','Horse Racing',
	'Horse Racing (Ante Post)','Horse Racing Beta','Hurling','Ice Hockey'];
	*/
	// ['Horse Racing'];  ['ALL']; ['Cricket']; ['Horse Racing','Greyhound Racing', 'Cricket'];
	// let g_sportsInterested = ['ALL'];
	let g_sportsInterested = [
		'Horse Racing',
		// 'Soccer',
		// 'Greyhound Racing',
		// 'American Football',
		// 'Basketball',
		// "Boxing",
		// "Golf",
		// 'Ice Hockey',
		// 'Rugby Union',
		// 'Enhanced Specials',
		// 'Snooker',


		// "Baseball",
		// "Chess",
		// 'Cricket',
		// "Cycling",
		// "Motor Sport",
		// "Rugby League",
		// "Table Tennis",
		// 'Tennis',
		// "Volleyball"
	];

	//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	//$$$$$$$$$$$$$$$// WARNING !!!! ( false => places the real money bet) //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	
	const g_isLockedForBetting = true; // false => REAL MONEY
	
	//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

	if(g_isLockedForBetting)
	{
		g_betMinutesOffset = 600; //(600 = 10hrs before) place bet: +1 min before the start time, -5 min after the start time

		// g_winConfidencePercentage = 1; // ex: 100  (100% or more)
		// g_minProfitOdd = 0.1; // ex: 1 (1/1 = 1 even odd [or] 2.00 in decimal)
		// g_whichDayEvent = '2021-12-26'; // 'today' or 'tomorrow' or "2019-12-24" (ISO specific date)
	}
	/////////////////////////////////////////// socket.io //////////////////////////////////////////////////////////////////

	// Client request for a new connection
	io.on('connection', async (socket) => {
		CONNECTIONS.print("must",'Server: A new client with socket-id: ${socket.id} is connected to me !'); // socket.id => can be used as UNIQUE id for finding the client 

		// when client(browser) closed/disconnect from the server
		socket.on('disconnect', function() {
			CONNECTIONS.print("must",'A Client has closed / disconnected from the Server !');
		});

		// [Client => Server] Receive data from client to server
		socket.on('CLIENT_TO_SERVER_GIVE_ALL_PREDICTION_EVENT', async (data) => {
			const obj = JSON.parse(data);
			CONNECTIONS.print("must",obj); // client msg

			CONNECTIONS.notifyAllUser('SERVER_TO_CLIENT_ALL_PREDICTED_WINNERS_EVENT', JSON.stringify(g_allPredictedWinnerBetList)); // notify the client
		});

		// [Client => Server] Receive data from client to server
		socket.on('CLIENT_TO_SERVER_GIVE_CURRENT_PREDICTION_EVENT', async (data) => {
			const obj = JSON.parse(data);
			CONNECTIONS.print("must",obj); // client msg

			CONNECTIONS.notifyAllUser('SERVER_TO_CLIENT_CURRENT_PREDICTED_WINNERS_EVENT', JSON.stringify(g_currentPredictedWinnerBetList)); // notify the client
		});

		// [Client => Server] Receive data from client to server
		socket.on('CLIENT_TO_SERVER_GIVE_ALREADY_PLACED_BETS_EVENT', async (data) => {
			const obj = JSON.parse(data);
			CONNECTIONS.print("must",obj); // client msg

			CONNECTIONS.notifyAllUser('SERVER_TO_CLIENT_ALREADY_PLACED_BETS_EVENT', JSON.stringify(g_alreadyPlacedBetList)); // notify the client
		});
	});
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	callbackCount = function(currentCount , totalCount) {
		this.currentCount = currentCount || 0;
		this.totalCount = totalCount || 0;
	};

	isAlreadyBetPlacedEvent = function(eventId) {
		// if(g_onlyOne_raceName) return false; // NEVER do it !!! places duplicate bets

		for (let sport in g_allPredictedWinnerBetList) {
			if (g_allPredictedWinnerBetList.hasOwnProperty(sport)) {
				for(let count  = 0; count < g_allPredictedWinnerBetList[sport].length; ++count) {
					if("event-id" in  g_allPredictedWinnerBetList[sport][count]) {
						if(g_allPredictedWinnerBetList[sport][count]["event-id"] === eventId) 
							return true;
					}
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
							// CONNECTIONS.print("ignore",'SKIP: ' + dateObject + ' !== ' + currentDate);
							continue; // skip
						}
					}

					const name = jsonFormat[extraArgs.obj][key][extraArgs.destObj];
					g_db.sportId[extraArgs.closureSave][extraArgs.obj][name] = {};
					let value = null;

					for(let i = 0; i < extraArgs.keys.length; ++i)
					{
						value = jsonFormat[extraArgs.obj][key][extraArgs.keys[i]];
						if(value || value == 0)
							g_db.sportId[extraArgs.closureSave][extraArgs.obj][name][extraArgs.keys[i]] = value;
					}
				}
			}
		}

		return callback(null, extraArgs.sports_cbCount, extraArgs.closureSave);
	};

	requestResponse = async function(options, obj, destObj, keys, filterDay, closureSave, sports_cbCount, callback) {

		/////////////// Wait for before giving a new Http request //////////////////////////////////////////////////////
		const result = await TIMER.awaitForMaxReqTimeSlot("EVENTS");
		CONNECTIONS.print("ignore",`${result} of min wait time is finished, ready for giving a next Http request - ${new Date().getTime()}`);
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
	getSports = async function (callback) {
		const options = UTIL.getDefaultOptions();
		options.url = 'https://api.matchbook.com/edge/rest/lookups/sports';
		options.qs = { offset: '0', 'per-page': '20', order: 'name asc', status: 'active' };

		// Cookie data for maintaining the session
		options.headers['session-token'] = g_sessionToken;

		/////////////// Wait for before giving a new Http request //////////////////////////////////////////////////////
		const result = await TIMER.awaitForMaxReqTimeSlot("EVENTS");
		CONNECTIONS.print("ignore",`${result} of min wait time is finished, ready for giving a next Http request - ${new Date().getTime()}`);
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
				sportsName = jsonData['sports'][sport].name;
				g_sportsList.push(sportsName);
				g_db.sportId[jsonData['sports'][sport].name] = {};

				// Mappings 
				// (sports name => sports id )      "Horse Racing" => 24735152712200
				g_db.sportId[jsonData['sports'][sport].name].id = jsonData['sports'][sport].id;

				// (sports id => sports name )      24735152712200 => "Horse Racing"
				g_sportsIdNameMapping[jsonData['sports'][sport].id] = jsonData['sports'][sport].name;
			}
		}

		FA.writeJsonFile(g_db,'./data-Report/availableSports.json', true);
		return callback(null);
	};

	// Get Sports Name by Sports Id
	getSportsNameBySportsId = function(sportsId) {
		return g_sportsIdNameMapping[sportsId];
	};

	// Get Sports Id by Sports Name
	getSportsIdBySportsName = function(sportsName) {
		return g_db.sportId[sportsName].id;
	};

	// Return Sports Name, Event Start Time, Players List 
	getEventDetailsByEventId = function(sportsId, eventId) {

		const sportsName = getSportsNameBySportsId(sportsId);

		const eventCollection = g_db["sportId"][sportsName]["events"];

		for (let eventObj in eventCollection) {
			if (eventCollection.hasOwnProperty(eventObj) && eventCollection[eventObj].id === eventId) {
				CONNECTIONS.print("must",eventObj);         // key
				CONNECTIONS.print("must",eventCollection[eventObj]); // value
				return eventCollection[eventObj];
			}
		}
	};

	// Get the full data from all pages (default: 20 pages)
	morePages = async function(options, perPage, updateMethod, callback, extraArgs) {

		options.qs['per-page'] = perPage;

		/////////////// Wait for before giving a new Http request //////////////////////////////////////////////////////
		const result = await TIMER.awaitForMaxReqTimeSlot("EVENTS");
		CONNECTIONS.print("ignore",`${result} of min wait time is finished, ready for giving a next Http request - ${new Date().getTime()}`);
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

		const keysToFetch = ["id", "start", "status", "in-running-flag", "race-length"];

		// closure needed for storing the sport name ????
		requestResponse(options, 'events', 'name', keysToFetch, g_whichDayEvent, sport, sports_cbCount, callback);
	};

	// Get Event
	getEvent = async function (event_id, returnFunction) {
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

		// CONNECTIONS.print("ignore",options);

		/////////////// Wait for before giving a new Http request //////////////////////////////////////////////////////
		const result = await TIMER.awaitForMaxReqTimeSlot("EVENTS");
		CONNECTIONS.print("ignore",`${result} of min wait time is finished, ready for giving a next Http request - ${new Date().getTime()}`);
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		request(options, function (error, response, body) {
			if (error) {
				if (error.code === "ECONNRESET") {
					CONNECTIONS.print("must", "Timeout occurred in getEvent() - Trying again !!!");
					return;
				}
				else throw new Error(error);
			}

			const jsonFormat = JSON.parse(body);
			// jsonFormat.in-running-flag: false
			// jsonFormat.race-length: "0m 7f 14y"

			const runnersObj = {};

			if(jsonFormat.markets && jsonFormat.markets.length)
			//if(jsonFormat.markets.length && (jsonFormat.markets[0].name === 'WIN' || jsonFormat.markets[0].name === 'Winner'))
			{
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

	luckyMatchFilter = function(sportName, jsonObj, objLevelFilter, callback) {
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

								for(let runner in jsonObj[prop][race]["allRunners"]) { 
									if(jsonObj[prop][race]["allRunners"].hasOwnProperty(runner)) {
										if(typeof jsonObj[prop][race]["allRunners"][runner] === "object") {
											let runnerObj = jsonObj[prop][race]["allRunners"][runner];
											runnerObj.name = runner;
											runnerObj['event-name'] = raceName;
											let back = jsonObj[prop][race]["allRunners"][runner].back;
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
									const halfPlayersCount = Math.ceil(luckyRunner.length / 2);
									// At least half of the players should have some betting before doing win calculation 
									if(luckyRunner[halfPlayersCount][0] != Number.MAX_VALUE) {
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
											let obj = luckyRunner[0][1];
											obj.sportName = sportName;
											g_predictedWinners.push(obj);
										}
									}
								}
							}
						}
					}
				}
			}
		}

		g_betNow = findHotBets(g_predictedWinners);
		return callback(null, g_betNow);
	};

	findLuckyMatch = async (sportName, jsonObj, objLevelFilter, callback) => {
		if(UTIL.isNullObject(g_moneyStatus)) {
			if(await FA.isFileExist('./data-Report/money.json'))
			{
				g_moneyStatus = await FA.readJsonFile('./data-Report/money.json');
				if(g_moneyStatus.account.date === new Date().toDateString())
				{
					g_remainingTotalBetAmountLimit = g_moneyStatus.account.remainingTotalBetAmountLimit;
				}
			}
		}

		if(UTIL.isNullObject(g_allPredictedWinnerBetList)) {
			if(await FA.isFileExist('./data-Report/alreadyPlacedBetList.json'))
			{
				g_alreadyPlacedBetList = await FA.readJsonFile('./data-Report/alreadyPlacedBetList.json');

				g_allPredictedWinnerBetList = JSON.parse(JSON.stringify(g_alreadyPlacedBetList)); // deep object clone
			}
		}

		luckyMatchFilter(sportName, jsonObj, objLevelFilter, callback);
	};
	

	findHotBets = function(g_predictedWinners) {
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
				// g_betMinutesOffset = -1; // place bet: +1 min before the start time, -5 min after the start time
				if(g_currentTime.getTime() > (startTime.getTime() - (g_betMinutesOffset * 60 * 1000)))
				{
					if(!(g_currentTime.getTime() > startTime.getTime() + 2*60*1000))
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
						betObj.stake = g_BetStakeValue; // your MONEY !!!! (1.0)
						betObj['event-start-time'] = g_predictedWinners[i].startTime;
						betObj['sportName'] = g_predictedWinners[i].sportName;
						betObj['sport-id'] = g_db.sportId[g_predictedWinners[i].sportName].id;

						if(g_isLockedForBetting)
						{
							// mock bet
							betObj['status'] = 'matched';
							betObj['event-id'] = g_predictedWinners[i].raceId;
							betObj['event-name'] =  g_predictedWinners[i].raceName;

							betObj['runner-name'] = g_predictedWinners[i].name;
							betObj['decimal-odds'] = betObj.odds;
							betObj['stake'] = g_BetStakeValue;

							g_betNow.push(betObj);
						}
						else if(g_userBalance >= g_BetStakeValue && UTIL.roundIt(g_todayTotalBetAmountLimit - g_remainingTotalBetAmountLimit) >= g_BetStakeValue) {

							g_betNow.push(betObj);

							g_userBalance = UTIL.roundIt(g_userBalance - g_BetStakeValue);
							g_remainingTotalBetAmountLimit = UTIL.roundIt(g_remainingTotalBetAmountLimit + g_BetStakeValue);

							if(!g_moneyStatus.account)	g_moneyStatus.account = {};
							g_moneyStatus.account.userBalance = g_userBalance;
							g_moneyStatus.account.remainingTotalBetAmountLimit = g_remainingTotalBetAmountLimit;
							g_moneyStatus.account.todayTotalBetAmountLimit = g_todayTotalBetAmountLimit;
							g_moneyStatus.account.date = new Date().toDateString();
						}
						else if(g_userBalance < g_BetStakeValue) {
							CONNECTIONS.print("must","User Balance is VERY LOW !!!!");
						}
						else if(UTIL.roundIt(g_todayTotalBetAmountLimit - g_remainingTotalBetAmountLimit) < g_BetStakeValue) {
							CONNECTIONS.print("must",`Reached your today's bet limit: ${g_remainingTotalBetAmountLimit} / ${g_todayTotalBetAmountLimit} => No more bets allowed !!!!`);
						}
					}
				}
			}
		}
		return g_betNow;
	};

	// Submit Offers
	// Submit one or more offers i.e. your intention or willingness to have bets with other users.
	submitOffers = async function (callback) {
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
				/////////////// Wait for before giving a new Http request //////////////////////////////////////////////
				const result = await TIMER.awaitForMaxReqTimeSlot("BETTING_WRITE");
				CONNECTIONS.print("ignore",`${result} of min wait time is finished, ready for giving a next Http request - ${new Date().getTime()}`);
				////////////////////////////////////////////////////////////////////////////////////////////////////////
				request(options, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						//CONNECTIONS.print("ignore",response);
						return callback(null, response);
					}
					else {
						CONNECTIONS.print("must",response.statusCode + " Error in bet placed");

						if(response.body.offers) {
							for(let count = 0; count < response.body.offers.length; ++count) {
								CONNECTIONS.print("must",response.body.offers[count].errors);
							}
						}

						return callback(error,null);
					}
				});
			}
			else
			{
				// mock bet placed
				//CONNECTIONS.print("ignore",response);
				for(let i = 0; i < g_betNow.length; ++i) {
					let lastBetResult = g_betNow[i];
					let obj = populateDataAfterBetSubmit(lastBetResult, false);
					CONNECTIONS.print("must",obj);

					// ??????
					// getEventDetailsByEventId(getSportsIdBySportsName(g_betNow[i].sportName), g_betNow[i]['event-id']);
				}
				CONNECTIONS.notifyAllUser('SERVER_TO_CLIENT_ALL_PREDICTED_WINNERS_EVENT', JSON.stringify(g_allPredictedWinnerBetList)); // notify the client
				CONNECTIONS.notifyAllUser('SERVER_TO_CLIENT_CURRENT_PREDICTED_WINNERS_EVENT', JSON.stringify(g_currentPredictedWinnerBetList)); // notify the client
				FA.writeJsonFile(g_allPredictedWinnerBetList,'./data-Report/mockSuccessfulBets.json');
			}
		}
	};


	populateDataAfterBetSubmit = function(lastBetResult, isRealBet) {
		let obj = 	{
			"status":lastBetResult['status'],
			"sport-id":lastBetResult['sport-id'],
			"sport-name": getSportsNameBySportsId(lastBetResult['sport-id']),
			"event-id":lastBetResult['event-id'],
			"event-name":lastBetResult['event-name'],

			"runner-name":lastBetResult['runner-name'],
			"decimal-odds":lastBetResult['decimal-odds'],
			"stake": lastBetResult['stake'], // g_BetStakeValue,

			// g_db["sportId"][sportsName]["events"][eventName]
			"event-full-details": g_db["sportId"][getSportsNameBySportsId(lastBetResult['sport-id'])]["events"][lastBetResult['event-name']],
			// "metaData": lastBetResult['metaData'], // g_db["sportId"]["metaData"],
			"metaData": g_db["sportId"][getSportsNameBySportsId(lastBetResult['sport-id'])]["events"][lastBetResult['event-name']]["metaData"],
			// "event-start-time": new Date(lastBetResult['event-start-time']).toLocaleString('en-GB', { timeZone: 'Europe/London' }),
			"event-start-time": new Date(g_db["sportId"][getSportsNameBySportsId(lastBetResult['sport-id'])]["events"][lastBetResult['event-name']]["start"]).toLocaleString('en-GB', { timeZone: 'Europe/London' }),
			
			"bet-placed-time": TIMER.getCurrentTimeDate() 
		};

		if(isRealBet)
		{
			if(!g_alreadyPlacedBetList[obj["sport-name"]]) g_alreadyPlacedBetList[obj["sport-name"]] = [];
			g_alreadyPlacedBetList[obj["sport-name"]].push(obj); // Update "already bet placed" global object
		}

		if(!g_allPredictedWinnerBetList[obj["sport-name"]]) g_allPredictedWinnerBetList[obj["sport-name"]] = [];
		g_allPredictedWinnerBetList[obj["sport-name"]].push(obj); // Update "already bet placed" global object

		if(!g_currentPredictedWinnerBetList[obj["sport-name"]]) g_currentPredictedWinnerBetList[obj["sport-name"]] = [];
		g_currentPredictedWinnerBetList[obj["sport-name"]].push(obj); // Update "already bet placed" global object

		return obj;
	};

	// Get meta data for each event
	getEventMetaData = () => {
		// meta data
		const metaData = {
			"stakeValue"                   : g_BetStakeValue,
			"todayTotalBetAmountLimit"     : g_todayTotalBetAmountLimit,
			"remainingTotalBetAmountLimit" : g_remainingTotalBetAmountLimit,
			"userBalance"                  : g_userBalance,
			"winConfidencePercentage"      : g_winConfidencePercentage,
			"minProfitOdd"                 : g_minProfitOdd
		};

		return metaData;
	};


	getEventInfo = function(sportName, event, eventId, startTime, sports_cbCount, events_cbCount, callback) {
		getEvent(eventId, function(obj) {
			// CONNECTIONS.print("ignore",obj);
			
			g_db.sportId[sportName].events[event].allRunners = obj;
			g_db.sportId[sportName].events[event].id = eventId;
			g_db.sportId[sportName].events[event].start = startTime;
			// g_db["sportId"][sportName]["events"][raceName]["metaData"] = metaData;
			g_db.sportId[sportName].events[event].metaData = getEventMetaData();

			++events_cbCount.currentCount;
			if(events_cbCount.currentCount === events_cbCount.totalCount)
			{
				// FA.writeJsonFile(g_db.sportId[sportName], `./data/availableEventList_${sportName}.json`);
				FA.writeJsonFile(g_db.sportId[sportName], `./data/availableEventList_ALL_Sports.json`);

				findLuckyMatch(sportName, g_db.sportId[sportName], "events", function(err, data) {
						if(err){
							CONNECTIONS.print("must",err);
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
		++g_betScanRound;

		let scanCurrentTime = new Date();

		let elapsedTime = scanCurrentTime - g_lastCycleElapsedTime;
		
		g_lastCycleElapsedTime = scanCurrentTime.getTime();

		let runningTime = TIMER.milliSecondsToHMS(scanCurrentTime - g_scanStartTime);



		// g_betScanRound.toString().padStart(5, "0"); // 1 ==> 00001
		let logMsg = `BetScanRound: ${g_betScanRound.toString().padStart(5, "0")} ## RunningTime: ${runningTime} ## ScanCurrentTime: ${TIMER.getTimeFromDateObj(scanCurrentTime)} ## ScanStartTime: ${TIMER.getTimeFromDateObj(g_scanStartTime)} ## ElapsedTime: ${elapsedTime.toString().padStart(5, "0")}ms (${TIMER.milliSecondsToHMS(elapsedTime)}) ## Date: ${scanCurrentTime.toDateString()}`;
		CONNECTIONS.print("logClient", logMsg);

		findSportsIds();
	};

	findSportsIds = function() {
		// input  - null
		// output - sports id - {"name":"Horse Racing","id":24735152712200,"type":"SPORT"}
		// https://api.matchbook.com/edge/rest/lookups/sports
		getSports(callback_getSports);
	};

	callback_getSports = async function(err, data) {
		if(err) {
			CONNECTIONS.print("must",err);
			throw new Error(err);
		}
		else{
			if(g_sportsInterested.length === 1 && g_sportsInterested[0].toLowerCase() === 'all') {
				g_sportsInterested = g_sportsList;
			}

			let sports_cbCount = new callbackCount(0, g_sportsInterested.length);
			// Calling callback functions inside a loop
			// g_sportsInterested.forEach(function(sport) {
			for (const sport of g_sportsInterested) {
				// input  - sports id
				// output - event id
				// https://api.matchbook.com/edge/rest/events?sport-ids=24735152712200
				// getEvents('24735152712200'); // sportsid
				// getEvents(g_db.sportId['Horse Racing'], function(err, data) {

				/////////////// Wait for before giving a new Http request //////////////////////////////////////////////////////
				const result = await TIMER.awaitForMaxReqTimeSlot("EVENTS");
				CONNECTIONS.print("ignore",`${result} of min wait time is finished, ready for giving a next Http request - ${new Date().getTime()}`);
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////

				getEvents(sport, sports_cbCount, callback_getEvents);
			}
			//); //forEach
		}
	};

	callback_getEvents = async function(err, sports_cbCount, sport) {
		if(err){
			CONNECTIONS.print("must",err);
			CONNECTIONS.print("must","ERROR: TRYING AGAIN BY A NEW REQUEST");
			run();

			// throw new Error(err);
		}
		else{
			if('events' in g_db.sportId[sport]) {
				// 14:00 Newbury, 14:10 Fontwell, 14:20 Ayr, 14:35 Newbury, 14:40 Fairview...... etc
				let races = Object.keys(g_db.sportId[sport].events);
				let events_cbCount = new callbackCount(0, races.length);

				// races.forEach(function(race) {
				for (const race of races) {
					// input  - event id
					// output - id (player)
					// https://api.matchbook.com/edge/rest/events/1033210398700016

					/////////////// Wait for before giving a new Http request //////////////////////////////////////////////////////
					const result = await TIMER.awaitForMaxReqTimeSlot("EVENTS");
					CONNECTIONS.print("ignore",`${result} of min wait time is finished, ready for giving a next Http request - ${new Date().getTime()}`);
					////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					// g_onlyOne_raceName === "14:00 Southwell"
					if(!g_onlyOne_raceName || race === g_onlyOne_raceName) {
						if(race === g_onlyOne_raceName) events_cbCount.totalCount = 1; // Taking only one race event for testing

						let logMsg = `Sports: ${sport} ############## Event Name: ${race}`;
						CONNECTIONS.print("logClient", logMsg);

						getEventInfo(sport, race, g_db.sportId[sport].events[race].id, g_db.sportId[sport].events[race].start, 
							sports_cbCount, events_cbCount, callback_getEventInfo);
					}
				}
				// ); //forEach




			}
		}
	};

	callback_getEventInfo = function(err, sports_cbCount, events_cbCount, isReadyForBetting) {
		if(err){
			CONNECTIONS.print("must",err);
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
				remainingTime = g_currentTime - g_lastCycleElapsedTime;
				remainingTime = (g_betCycleTime - remainingTime) > 0 ? g_betCycleTime - remainingTime : 0;

				setTimeout(function() {
					// Check for session expire timeout
					if(g_currentTime - new Date(g_sessionStartTime).getTime() > g_sessionExpireTimeLimit) {
						getNewSession();
					}
					else {
						run(); // LOOPS
					}
				}.bind(this), remainingTime);
			}
		}
	};

	callback_submitOffers = function(err, response) {
		if(err){
			CONNECTIONS.print("must",err);
		}
		else{
			//CONNECTIONS.print("ignore",response);
			const nSubmittedBets = response.body.offers.length;
			for(let i = 0; i < nSubmittedBets; ++i) {
				let lastBetResult = response.body.offers[i];
				if(lastBetResult.status === 'matched' || lastBetResult.status === 'open') {
					let obj = populateDataAfterBetSubmit(lastBetResult, true);
					CONNECTIONS.print("must",obj);
				}
			}

			FA.writeJsonFile(g_alreadyPlacedBetList,'./data-Report/alreadyPlacedBetList.json');
			FA.writeJsonFile(g_allPredictedWinnerBetList,'./data-Report/mockSuccessfulBets.json');
			FA.writeJsonFile(g_moneyStatus,'./data-Report/money.json');

			CONNECTIONS.notifyAllUser('SERVER_TO_CLIENT_ALREADY_PLACED_BETS_EVENT', JSON.stringify(g_alreadyPlacedBetList)); // notify the client
			CONNECTIONS.notifyAllUser('SERVER_TO_CLIENT_ALL_PREDICTED_WINNERS_EVENT', JSON.stringify(g_allPredictedWinnerBetList)); // notify the client
			CONNECTIONS.notifyAllUser('SERVER_TO_CLIENT_CURRENT_PREDICTED_WINNERS_EVENT', JSON.stringify(g_currentPredictedWinnerBetList)); // notify the client
		}
	};


	// Get Sports Wallet Balance
	// Get the new sports balance for the user currently logged in.
	// This API requires authentication and will return a 401 in case the session expired or no session token is provided.
	getUserBalance = async function () {
		const options = UTIL.getDefaultOptions();
		options.url = 'https://api.matchbook.com/edge/rest/account/balance';
		// Cookie data for maintaining the session
		options.headers['session-token'] = g_sessionToken;

		/////////////// Wait for before giving a new Http request //////////////////////////////////////////////////////
		const result = await TIMER.awaitForMaxReqTimeSlot("ACCOUNT");
		CONNECTIONS.print("ignore",`${result} of min wait time is finished, ready for giving a next Http request - ${new Date().getTime()}`);
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			const jsonFormat = JSON.parse(body);
			// CONNECTIONS.print("ignore",jsonFormat); // jsonFormat.balance
			g_userBalance = Math.floor(jsonFormat.balance * 100) / 100;
		});
	};


	loginCallback = function(err, sessionToken, sessionStartTime) {
		if(err){
			g_sessionToken = null;
			g_sessionStartTime = 0;
			CONNECTIONS.print("must",err);
		}
		else{
			g_sessionToken = sessionToken;
			g_sessionStartTime = sessionStartTime;

			// findSportsIds(); // run once bcos sports id's are constant
			getUserBalance();

			run();
		}
	};

	getNewSession = function() {
		DOOR.getLastSession(loginCallback);
	};

	////////////////////////////////////////////////////////////////////////
	myTest = async (value) => {
		const result = await TIMER.awaitForMaxReqTimeSlot("EVENTS");
		CONNECTIONS.print("ignore",`sri-after: ${new Date().getTime()}    ${result}`);
	};

	myTestWrapper = async (value) => {
		let result = await myTest(value);
		result = result;
	}

	///////////////////////////////////////////////////////////////////////

	// Entry Function
	(function () {

		if(!g_isLockedForBetting)
		{
			console.log(`
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$            $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ REAL MONEY $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$            $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$			
			`);
		}

		getNewSession();


		////////////////////////////////////////////////////////////////////////
		// correct
		// (async () => {
		// 	await myTest("one");
		// 	await myTest("two");
		// 	await myTest("three");
		// 	await myTest("four");
		// 	await myTest("five");
		// })();



		// Wrong
		// myTestWrapper("one");
		// myTestWrapper("two");
		// myTestWrapper("three");
		// myTestWrapper("four");
		// myTestWrapper("five");

		// myTest("one").then(myTest("two")).then(myTest("three")).then(myTest("four")).then(myTest("five"));

		////////////////////////////////////////////////////////////////////////
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