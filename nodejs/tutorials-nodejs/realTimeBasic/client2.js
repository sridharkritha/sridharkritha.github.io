
window.addEventListener('load', function () { // needed only for the Method 1.

	// Method 1: Using HTML - Load "client.html" (do NOT run "node client.js")
	// It uses 'io' from the distributed version of socket.io from "client-dist/socket.io.js"
	const socket = io("http://localhost:3000", { autoConnect:false, transports : ['websocket'] }); // internally emits "connection" event

/*	
	// // Method 2: Without using HTML - directly run "node client.js"
	// // It uses 'io' from the "socket.io-client" which is installed by "npm install socket.io-client --save"
	// const io = require("socket.io-client");
	// // First Connect to the Server on the Specific URL (HOST:PORT)
	// let socket = io("http://localhost:3000"); // internally emits "connection" event
	
*/

	socket.on("connect", async () => {
		// console.log('myEventClientReady - event is sent');
		socket.emit('myEventClientReady', JSON.stringify({ isClientReady: true }));
	});
	socket.connect(); // neeed bcos 'autoConnect:false'

	socket.on("myEventChangeHappened", (data) => { 
		document.getElementById('winsId').textContent = JSON.parse(data).wins;
	});



	// socket.on => listener. socket.emit => sends event.
	// Add listener for the event "myEvent" but NOT execute the callback
	// Callback will be executed only after if you get the "myEvent"
	// console.log('myEvent - addListener is ready for the server');
	socket.on("myEvent", (data) => {
	   console.log("Message: ", data); // gets executed only after the "myEvent" arrives.

		const db = JSON.parse(data);
		let divElem, spanElem, elem;
		for (var i in db) {
			if (db.hasOwnProperty(i)) {
				// console.log(db[i]);
				// row
				divElem = document.createElement("div");

				for (var j in db[i]) {
					if (db[i].hasOwnProperty(j)) {
						if(j == 'name') {
							spanElem = document.createElement("span");
							spanElem.textContent = db[i][j];
							divElem.appendChild(spanElem);
						}
						else if(j == 'wins') {
							spanElem = document.createElement("span");
							spanElem.setAttribute("id","winsId");
							spanElem.textContent = db[i][j];
							divElem.appendChild(spanElem);
						}
						// console.log(db[i][j]);
					}
				}
				document.body.appendChild(divElem);
			}
		}

		elem = document.createElement("input");
		elem.setAttribute("id","oddId");
		document.body.appendChild(elem);

		elem = document.createElement("button");
		elem.setAttribute("id","buttonId");
		elem.textContent = "Bet";
		elem.style.cssText = 'width:50px; height:22px';
		elem.addEventListener('click', submitCallback);
		document.body.appendChild(elem);

	});

	/*
	socket.emit('myEvent', JSON.stringify({
											"findObject": {
												"name": "Sumitha"
											},
											"updateObject": {
												"wins": "12345"
											},
										}));
	*/


// GUI
function submitCallback() {
	// console.log(document.getElementById('nameId').firstChild.textContent);
	// console.log(document.getElementById('winsId').firstChild.textContent);
	// console.log(Number(document.getElementById('oddId').value) + 12.1);
	let newValue = Number(document.getElementById('oddId').value);

	socket.emit('mySubmitEvent', JSON.stringify({
		"findObject": { },
		"updateObject": { "wins": newValue }
	}));

}
/*
let elem = document.createElement("span");
elem.setAttribute("id","nameId");
document.body.appendChild(elem);

elem = document.createElement("span");
elem.setAttribute("id","winsId");
document.body.appendChild(elem);

elem = document.createElement("input");
elem.setAttribute("id","oddId");
document.body.appendChild(elem);

elem = document.createElement("button");
elem.setAttribute("id","buttonId");
elem.textContent = "Bet";
elem.style.cssText = 'width:50px; height:22px';
elem.addEventListener('click', submitCallback);
document.body.appendChild(elem);


function submitCallback() {
	// console.log(document.getElementById('nameId').firstChild.textContent);
	// console.log(document.getElementById('winsId').firstChild.textContent);
	console.log(Number(document.getElementById('oddId').value) + 12.1);
}

*/

	// // Add Listener
	// let ahrefPrev = document.getElementById('ahrefPrevId');
	// ahrefPrev.addEventListener('click', function () {
	// 	renderQuestionAnswer();
	// });


// elem.setAttribute("class","myStyleClass");
// elem.textContent = "HorseName";
// elem.style.cssText = 'display:block; padding:0';






}); // needed only for the Method 1.



