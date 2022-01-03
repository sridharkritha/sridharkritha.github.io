
window.addEventListener('load', function() {


	const g_betObj = 
	[
		{
		  "status": "matched",
		  "sport-id": 24735152712200,
		  "sport-name": "Horse Racing",
		  "event-id": 1950771327400016,
		  "event-name": "17:00 Wolverhampton",
		  "runner-name": "2 Night Glass",
		  "decimal-odds": 1.9,
		  "stake": 0.2,
		  "event-full-details": {
			"2 Night Glass": {
			  "runnerId": 1950771327770016,
			  "back": 1.83,
			  "lay": 1.93,
			  "name": "2 Night Glass",
			  "numberOfRunners": 4,
			  "winPercentage": 145.9016393442623,
			  "startTime": "2022-01-03T17:00:00.000Z",
			  "raceId": 1950771327400016,
			  "raceName": "17:00 Wolverhampton",
			  "sportName": "Horse Racing"
			},
			"1 Achnamara": {
			  "runnerId": 1950771327730016,
			  "back": 6.2,
			  "lay": 8.6,
			  "name": "1 Achnamara"
			},
			"4 State Legend": {
			  "runnerId": 1950771327830016,
			  "back": 4.5,
			  "lay": 5.7,
			  "name": "4 State Legend"
			},
			"3 Themoonsaballoon": {
			  "runnerId": 1950771327800016,
			  "back": 5.7,
			  "lay": 7.4,
			  "name": "3 Themoonsaballoon"
			},
			"id": 1950771327400016,
			"start": "2022-01-03T17:00:00.000Z",
			"luckyWinner": {
			  "runnerId": 1950771327770016,
			  "back": 1.83,
			  "lay": 1.93,
			  "name": "2 Night Glass",
			  "numberOfRunners": 4,
			  "winPercentage": 145.9016393442623,
			  "startTime": "2022-01-03T17:00:00.000Z",
			  "raceId": 1950771327400016,
			  "raceName": "17:00 Wolverhampton",
			  "sportName": "Horse Racing"
			}
		  },
		  "bet-placed-time": "09:27:07  03-01-2022"
		},
		{
		  "status": "matched",
		  "sport-id": 15,
		  "sport-name": "Soccer",
		  "event-id": 1950234584360016,
		  "event-name": "Manama Club vs Al-Muharraq",
		  "runner-name": "Al-Muharraq",
		  "decimal-odds": 1.8,
		  "stake": 0.2,
		  "event-full-details": {
			"Manama Club": {
			  "runnerId": 1950234587290016,
			  "back": 4.2,
			  "lay": 4.9,
			  "name": "Manama Club"
			},
			"Al-Muharraq": {
			  "runnerId": 1950234587320116,
			  "back": 1.76,
			  "lay": 2.08,
			  "name": "Al-Muharraq",
			  "numberOfRunners": 3,
			  "winPercentage": 87.49999999999999,
			  "startTime": "2022-01-03T17:20:00.000Z",
			  "raceId": 1950234584360016,
			  "raceName": "Manama Club vs Al-Muharraq",
			  "sportName": "Soccer"
			},
			"DRAW (Man/Al-)": {
			  "runnerId": 1950234587360116,
			  "back": 3.3,
			  "lay": 4.4,
			  "name": "DRAW (Man/Al-)"
			},
			"id": 1950234584360016,
			"start": "2022-01-03T17:20:00.000Z",
			"luckyWinner": {
			  "runnerId": 1950234587320116,
			  "back": 1.76,
			  "lay": 2.08,
			  "name": "Al-Muharraq",
			  "numberOfRunners": 3,
			  "winPercentage": 87.49999999999999,
			  "startTime": "2022-01-03T17:20:00.000Z",
			  "raceId": 1950234584360016,
			  "raceName": "Manama Club vs Al-Muharraq",
			  "sportName": "Soccer"
			}
		  },
		  "bet-placed-time": "09:27:08  03-01-2022"
		},
		{
		  "status": "matched",
		  "sport-id": 15,
		  "sport-name": "Soccer",
		  "event-id": 1950228839560016,
		  "event-name": "Vilafranquense vs Casa Pia",
		  "runner-name": "Casa Pia",
		  "decimal-odds": 2,
		  "stake": 0.2,
		  "event-full-details": {
			"Vilafranquense": {
			  "runnerId": 1950228842900016,
			  "back": 4.5,
			  "lay": 4.9,
			  "name": "Vilafranquense"
			},
			"Casa Pia": {
			  "runnerId": 1950228842940016,
			  "back": 1.91,
			  "lay": 1.98,
			  "name": "Casa Pia",
			  "numberOfRunners": 3,
			  "winPercentage": 80.62827225130891,
			  "startTime": "2022-01-03T18:00:00.000Z",
			  "raceId": 1950228839560016,
			  "raceName": "Vilafranquense vs Casa Pia",
			  "sportName": "Soccer"
			},
			"DRAW (Vil/Cas)": {
			  "runnerId": 1950228842970116,
			  "back": 3.45,
			  "lay": 3.7,
			  "name": "DRAW (Vil/Cas)"
			},
			"id": 1950228839560016,
			"start": "2022-01-03T18:00:00.000Z",
			"luckyWinner": {
			  "runnerId": 1950228842940016,
			  "back": 1.91,
			  "lay": 1.98,
			  "name": "Casa Pia",
			  "numberOfRunners": 3,
			  "winPercentage": 80.62827225130891,
			  "startTime": "2022-01-03T18:00:00.000Z",
			  "raceId": 1950228839560016,
			  "raceName": "Vilafranquense vs Casa Pia",
			  "sportName": "Soccer"
			}
		  },
		  "bet-placed-time": "09:27:08  03-01-2022"
		}
	];

	const g_sportsWiseBetList = {};

	convertToSportsWiseBetList = function(betObj) {
		for(let i = 0, n = betObj.length; i < n; ++i) {
			if(!g_sportsWiseBetList[betObj[i]['sport-name']]) g_sportsWiseBetList[betObj[i]['sport-name']] = [];
			g_sportsWiseBetList[betObj[i]['sport-name']].push(betObj[i]);
		}
		console.log(g_sportsWiseBetList);
	};

	

	createPredictedWinnersTable = function() {
		convertToSportsWiseBetList(g_betObj);

	};

	createPredictedWinnersTable();




	

/*


	//////////// SOCKET.IO /////////////////////////////////////////////////////// 

	const socket = io(); // NOTE: you MUST run by http://localhost:3000/index.html

	// [Client => Server] Send the data from client to server 
	function notifyToServer(event, data) {
		socket.emit(event, data);
	}

	notifyToServer('CLIENT_TO_SERVER_EVENT', JSON.stringify({ name:'sridhar', age: 40}));


	// [Client <= Server] Receive data from server to client
	socket.on("SERVER_TO_CLIENT_EVENT", async (data) => {
		const obj = JSON.parse(data);
		console.log(obj);
	});

	///////////////////// REST API /////////////////////////////////////////////////////////////////////////////////////
	////////////// Basic HTTP VERBS //////////////////////////////
	// 1. Get    : Get the data from server
	// 2. Post   : Add some data to server
	///////////// Extended HTTP VERBS /////////////////////
	// 3. Delete : (like Get) Delete the data from the server
	// 4. Put    : (like Post) Replace the existing data object by the new data object in the server.
	// 5. Patch  : (like Post) Make a minor correction/edit inside the object (property alteration) which is in the server
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	

	// 1a. GET(?): get user details by key value pair
	const getUserByName = async (keyValue) => {
		try {
				const response = await fetch('/api/getUserByQuery?' + keyValue); // or from browser: http://localhost:3000/api/getUserByQuery?name=Sridhar
				const data = await response.json();
				// enter you logic when the fetch is successful
				console.log(data);
			} catch(error) {
				// enter your logic for when there is an error (ex. error toast)
				console.log(error);
			}
	};

	getUserByName("name=Sridhar");

	// 1b. GET(/): get user details by user id value
	const getUserByValue = async (value) => {
		try {
				const response = await fetch('/api/getUserIdValue/' + value); // or from browser: http://localhost:3000/api/getUserIdValue/5ec3c7c
				const data = await response.json();
				// enter you logic when the fetch is successful
				console.log(data);
			} catch(error) {
				// enter your logic for when there is an error (ex. error toast)
				console.log(error);
			}
	};

	getUserByValue("5ec3c7c");

	// 2. POST: Add user - login method
	async function login(username, password) {
		// To handle an error in an async function, you MUST use try/catch
		try {
			// fetch() starts a request and returns a promise.
			// Warning: fetch does NOT FAIL even for the incorrect page url request (Page NOT found error) bcos it consider's as successfully HTTP request.
			// It throws error only if there is some network failure(not able to send the request / not able to receive response from the server).
			// Issues like "page not found" in server [eg: serverErrors (500–599),clientErrors (400–499)], you can only find by 'response.ok' and 'response.status' from the successful response msg.
			const response = await fetch('/api/login', {
											method: 'POST',
											headers: { 'Content-Type': 'application/json' },
											body: JSON.stringify({
																	username,
																	password
																 })
											});
			// 'response.ok == true' ONLY if status range 200-299
			if (!response.ok) throw Error(`An error has occured: ${response.status}`);
			// if (response.status < 200 && response.status > 299) throw Error(`An error has occured: ${response.status}`);

			const result = await response.json();
			console.log(result); // msg from Server
		}
		catch(e) {
			console.log(e);
		}
	}

	login("sridhar", "1234");

	// 3. DELETE:
	async function deleteItem(id) {
		try {
			let response = await fetch(`https://url/${id}`, { method: "DELETE" });
		} catch (err) {
		}
	}

	// 3. PUT:
	async function replaceItem(obj) {
		try {
			let response = await fetch(`/api/replaceData`, {
			//let response = await fetch(`/api/replaceData/${obj.myId}`, {
											method: "PUT",
											headers: { "Content-Type": "application/json" },
											body: JSON.stringify(todo)
										});
		} catch (err) {
		}
	}

	replaceItem({myId: 3456})

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

}); // window.addEventListener('load', function() {
