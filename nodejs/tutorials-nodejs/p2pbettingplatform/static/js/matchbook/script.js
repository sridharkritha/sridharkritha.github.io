window.addEventListener('load', function () {
// Utility Functions
function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/////////////////////////////////// TEST ///////////////////////////////////////
// https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
// https://stackoverflow.com/questions/3103962/converting-html-string-into-dom-elements?noredirect=1&lq=1

// https://stackoverflow.com/questions/23030080/get-text-of-nested-childnodes-javascript





/////////////////////////////////// TEST (start) ///////////////////////////////////////////////////////////////////////
 
function test() {

}
// test();
////////////////////////////////// TEST (end) //////////////////////////////////////////////////////////////////////////
// A quick script you can paste into your console to report any duplicates.
// Alternate solution: http://validator.w3.org/
/*
var allElements = document.getElementsByTagName("*"), allIds = {}, dupIDs = [];
for (var i = 0, n = allElements.length; i < n; ++i) {
  var el = allElements[i];
  if (el.id) {
  	if (allIds[el.id] !== undefined) dupIDs.push(el.id);
  	allIds[el.id] = el.name || el.id;
    }
  }
if (dupIDs.length) { console.error("Duplicate ID's:", dupIDs);} else { console.log("No Duplicates Detected"); }
*/


///////////// CONVERTS: HTML TAGS ==> DOM NODE GENERATING CODE (start) /////////////////////////////////////////////////

let htmlGenStr = `\n let elemRef = null;\n`; // final output
const filterProp = ['nodeName', 'nodeType', 'nodeValue'];
let autoIdIndex = 0;


function extractNodeAttributes(node) {
	let propObj = {};

	// copy the node attributes to propObj
	if(node.attributes) {
		[...node.attributes].forEach( attr => { 
									propObj[attr.nodeName] = attr.nodeValue;
		});
	}

	propObj.nodeName =  node.nodeName;   // "DIV"
	propObj.nodeType =  node.nodeType;   // 1
	propObj.nodeValue =  node.nodeValue; // ""

	return propObj;
}

function createDomElement(node, parentNode) {
	const propObj = extractNodeAttributes(node);
	let elemRef = null;

	if(propObj.nodeName) {
		if(propObj.nodeType === 3) { // '#text' - node
			elemRef = document.createTextNode(propObj.nodeValue.trim());
			htmlGenStr += `\n elemRef = document.createTextNode("${propObj.nodeValue.trim()}");`;
		}
		else {
			elemRef = document.createElement(propObj.nodeName);
			htmlGenStr += `\n elemRef = document.createElement("${propObj.nodeName}");`;

			// Generate id if it is NOT exist.
			if(!propObj.id) {
				propObj.id = 'myParentId_'+ parentNode.id + '_myId_' + autoIdIndex++;
				elemRef.id = propObj.id;
				node.id = propObj.id;
			}

			for (let key in propObj) {
				if (propObj.hasOwnProperty(key) && !filterProp.includes(key)) {
					elemRef.setAttribute(key,propObj[key]);
					htmlGenStr += `\n elemRef.setAttribute("${key}","${propObj[key]}");`;
				}
			}

		}

		// parentNode.appendChild(elemRef);
		htmlGenStr += `\n document.getElementById("${parentNode.id}").appendChild(elemRef);\n`;
	}
}

function domTreeTraversal(node) {
	for(let i = 0; i < node.childNodes.length; i++) {
		let child = node.childNodes[i];
		// skip the empty text nodes(nodeType = 3) and comments (nodeType = 8)
		if(child.nodeType != 8 && (child.nodeType != 3 || (child.nodeType === 3 && child.nodeValue.trim()))) {
			console.log(child);
			createDomElement(child, child.parentNode );
		}

		domTreeTraversal(child); // recursive call - tree traversal
	}
}


// domTreeTraversal(document.getElementById('htmlStringWrapper'));
domTreeTraversal(document.getElementById('betSlipContainer'));
console.log(htmlGenStr);

///////////// CONVERTS: HTML TAGS ==> DOM NODE GENERATING CODE (end) /////////////////////////////////////////////////

function domTreeTest() {
	let elemRef = null; 
    
	elemRef = document.createElement("DIV");
	elemRef.setAttribute("id","timeVenueId");
	elemRef.setAttribute("class","gridColumnLayout gridColumnLayout_2");
	document.getElementById("betSlipContainer").appendChild(elemRef); 
    
	elemRef = document.createElement("DIV");
	elemRef.setAttribute("id","timeId");
	document.getElementById("timeVenueId").appendChild(elemRef); 
    
	elemRef = document.createTextNode("13:00");
	document.getElementById("timeId").appendChild(elemRef); 
    
	elemRef = document.createElement("DIV");
	elemRef.setAttribute("id","venueId");
	document.getElementById("timeVenueId").appendChild(elemRef); 
    
	elemRef = document.createTextNode("Wolverhampton");
	document.getElementById("venueId").appendChild(elemRef); 
    
	elemRef = document.createElement("DIV");
	elemRef.setAttribute("id","outcomePlayerId");
	elemRef.setAttribute("class","gridColumnLayout gridColumnLayout_2");
	document.getElementById("betSlipContainer").appendChild(elemRef); 
    
	elemRef = document.createElement("DIV");
	elemRef.setAttribute("id","outcomeId");
	document.getElementById("outcomePlayerId").appendChild(elemRef); 
    
	elemRef = document.createTextNode("Win");
	document.getElementById("outcomeId").appendChild(elemRef); 
    
	elemRef = document.createElement("DIV");
	elemRef.setAttribute("id","playerId");
	elemRef.setAttribute("class","halfOpaque");
	document.getElementById("outcomePlayerId").appendChild(elemRef); 
    
	elemRef = document.createTextNode("8 She's A Deva");
	document.getElementById("playerId").appendChild(elemRef); 
    
	elemRef = document.createElement("DIV");
	elemRef.setAttribute("id","backStakeProfitBetBinId");
	elemRef.setAttribute("class","gridColumnLayout gridColumnLayout_5 gridCenterVH");
	document.getElementById("betSlipContainer").appendChild(elemRef); 
    
	elemRef = document.createElement("DIV");
	elemRef.setAttribute("id","backPlusMinusId");
	elemRef.setAttribute("class","gridColumnLayout gridColumnLayout_3");
	document.getElementById("backStakeProfitBetBinId").appendChild(elemRef); 
    
	elemRef = document.createElement("DIV");
	elemRef.setAttribute("id","subtractBackId");
	elemRef.setAttribute("class","gridCenterVH backMainBgColor");
	document.getElementById("backPlusMinusId").appendChild(elemRef); 
    
	elemRef = document.createTextNode("-");
	document.getElementById("subtractBackId").appendChild(elemRef); 
    
	elemRef = document.createElement("DIV");
	elemRef.setAttribute("id","backOthersBgColorId");
	elemRef.setAttribute("class","backOthersBgColor");
	document.getElementById("backPlusMinusId").appendChild(elemRef); 
    
	elemRef = document.createElement("DIV");
	elemRef.setAttribute("id","backMainFontColorId");
	elemRef.setAttribute("class","backMainFontColor");
	document.getElementById("backOthersBgColorId").appendChild(elemRef); 
    
	elemRef = document.createTextNode("BACK");
	document.getElementById("backMainFontColorId").appendChild(elemRef); 
    
	elemRef = document.createElement("DIV");
	elemRef.setAttribute("id","backValueContainerId");
	document.getElementById("backOthersBgColorId").appendChild(elemRef); 
    
	elemRef = document.createElement("INPUT");
	elemRef.setAttribute("id","backValueId");
	elemRef.setAttribute("type","number");
	elemRef.setAttribute("placeholder","4.3");
	document.getElementById("backValueContainerId").appendChild(elemRef); 
    
	elemRef = document.createElement("DIV");
	elemRef.setAttribute("id","additionBackId");
	elemRef.setAttribute("class","gridCenterVH backMainBgColor");
	document.getElementById("backPlusMinusId").appendChild(elemRef); 
    
	elemRef = document.createTextNode("+");
	document.getElementById("additionBackId").appendChild(elemRef); 
    
	elemRef = document.createElement("DIV");
	elemRef.setAttribute("id","stakeBackOthersBgColor");
	elemRef.setAttribute("class","backOthersBgColor");
	document.getElementById("backStakeProfitBetBinId").appendChild(elemRef); 
    
	elemRef = document.createElement("DIV");
	elemRef.setAttribute("id","stakeId");
	elemRef.setAttribute("class","backMainFontColor");
	document.getElementById("stakeBackOthersBgColor").appendChild(elemRef); 
    
	elemRef = document.createTextNode("STAKE");
	document.getElementById("stakeId").appendChild(elemRef); 
    
	elemRef = document.createElement("DIV");
	elemRef.setAttribute("id","stakeValueId");
	document.getElementById("stakeBackOthersBgColor").appendChild(elemRef); 
    
	elemRef = document.createTextNode("4.3");
	document.getElementById("stakeValueId").appendChild(elemRef); 
    
	elemRef = document.createElement("DIV");
	elemRef.setAttribute("id","profitBackOthersBgColorId");
	elemRef.setAttribute("class","backOthersBgColor");
	document.getElementById("backStakeProfitBetBinId").appendChild(elemRef); 
    
	elemRef = document.createElement("DIV");
	elemRef.setAttribute("id","profitBackMainFontColorId");
	elemRef.setAttribute("class","backMainFontColor");
	document.getElementById("profitBackOthersBgColorId").appendChild(elemRef); 
    
	elemRef = document.createTextNode("PROFIT");
	document.getElementById("profitBackMainFontColorId").appendChild(elemRef); 
    
	elemRef = document.createElement("DIV");
	elemRef.setAttribute("id","profitValueBackMainFontColorId");
	document.getElementById("profitBackOthersBgColorId").appendChild(elemRef); 
    
	elemRef = document.createTextNode("4.3");
	document.getElementById("profitValueBackMainFontColorId").appendChild(elemRef); 
    
	elemRef = document.createElement("DIV");
	elemRef.setAttribute("id","placeBetButtonId");
	elemRef.setAttribute("class","tickButtonBackground");
	document.getElementById("backStakeProfitBetBinId").appendChild(elemRef); 
    
	elemRef = document.createTextNode("✔");
	document.getElementById("placeBetButtonId").appendChild(elemRef); 
    
	elemRef = document.createElement("DIV");
	elemRef.setAttribute("id","deleteBetButtonId");
	elemRef.setAttribute("class","binButtonBackground");
	document.getElementById("backStakeProfitBetBinId").appendChild(elemRef); 
    
	elemRef = document.createTextNode("🗑");
	document.getElementById("deleteBetButtonId").appendChild(elemRef);
}
// domTreeTest();


// Read local json file (browser side)
//////////////////////////// Read json by fetch api (start) ////////////////////
fetch('../db/sportsDB.json')	// return promise so it needs 'then' and 'catch'
.then((res)  => {        // executes if resolved otherwise go to next line
	if(res.status != 200) {
		throw new Error('cannot fetch the data'); // automatically it became 'reject' promise and function exits
	}
	console.log(res);           // data is hidden inside the 'body' property
	// console.log(res.json()); // data is available but .json() return promise so return it to another 'then'
	return res.json();          // return promise / chaining
})
.then((db) => { 
	console.log(db);
	processInputData(db);
}) // 'then' for 'res.json()' promise.
.catch((err) => { 
	console.log(err); // executes if rejected
});
//////////////////////////// Read json by fetch api (end) //////////////////////


//////////////////////////// Client to Server communication (start) //////////////////////
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
socket.connect(); // need bcos 'autoConnect:false'

// socket.on("myEventChangeHappened", (data) => { 
// 	document.getElementById('winsId').textContent = JSON.parse(data).wins;
// });



// socket.on => listener; socket.emit => sends event.
// Add listener for the event "myEvent" but NOT execute the callback
// Callback will be executed only after if you get the "myEvent"
// console.log('myEvent - addListener is ready for the server');
socket.on("myEvent", (data) => {
	console.log("Message: ", data); // gets executed only after the "myEvent" arrives.

	const db = JSON.parse(data); // Read the json file from server.js from mongodb
	console.log(db);
	processInputData(db[0]);
});

//////////////////////////// Client to Server communication (end) //////////////////////




////////////////////// Dynamically construct - Race Card (start) ///////////////
function processInputData(data) {
	const gameName = 'horseRace';
	const region = 'uk';
	const raceName = 'Cartmel';
	const date = '2021-09-20';
	const time = '12:00';

	const ref = data[gameName][region][raceName][date][time];
	const matchType = ref.matchType;
	const runLength = ref.runLength;
	const players = ref.players;

	let eventinfo = {	'raceName': raceName,
					'time': time,
				 };
	


	let raceCardContainer = document.getElementById('sportsEventContainer');


	let elem = document.createElement("div");
	elem.innerHTML = time + '&nbsp' + raceName;
	raceCardContainer.appendChild(elem);

	elem = document.createElement("div");
	elem.innerHTML = matchType + '&nbsp' + '|' + '&nbsp' + runLength;
	raceCardContainer.appendChild(elem);

	for(let i = 0, n = 2 /*players.length*/; i < n; ++i) {
		let playerinfo = { };
		let idString = null;

		// 1st row
		let elem1 = document.createElement("div");
		elem1.classList = "gridColumnLayout gridColumnLayout_2 size_4_6 gameBetContainer";
		raceCardContainer.appendChild(elem1);
		let elem2 = document.createElement("div");
		elem2.classList = "gridColumnLayout gridColumnLayout_2 size_1_9 gameContainer";
		elem1.appendChild(elem2);
		// silk
		let elem3 = document.createElement("div");
		elem2.appendChild(elem3);
		let elem4 = document.createElement("img");
		elem4.src = players[i].silk;
		elem3.appendChild(elem4);
		// Horse Name
		elem3 = document.createElement("div");
		elem2.appendChild(elem3);
		elem4 = document.createElement("div");
		elem4.classList = "player";
		playerinfo["horseName"] = players[i].horseName;
		elem4.innerHTML = players[i].horseName;
		elem3.appendChild(elem4);
		// Jockey and Trainer Name
		elem4 = document.createElement("div");
		elem4.classList = "playerDesc";
		elem4.innerHTML = 'J:' + players[i].jockeyName + '&nbsp' + 'T:'+ players[i].trainerName;
		elem3.appendChild(elem4);

		// odd range - back
		elem2 = document.createElement("div");
		elem2.classList = "gridColumnLayout gridColumnLayout_6 backLayBetContainer cellSize";
		elem1.appendChild(elem2);
		// 111
		elem3 = document.createElement("div");
		elem3.classList = "backBetLowContainer backOthersBgColor";
		// elem3.setAttribute("id","oddSelected_xxx"); //   oddSelected_111
		idString = eventinfo.time+'_'+eventinfo.raceName+'_'+playerinfo.horseName+'_'+'back'+'_'+players[i].backOdds[0];
		elem3.setAttribute("id", idString); //   oddSelected_111
		playerinfo["odd"] = players[i].backOdds[0];
		playerinfo["betType"] = "back";
		elem3.setAttribute("data-eventinfo",  JSON.stringify(eventinfo));
		elem3.setAttribute("data-playerinfo", JSON.stringify(playerinfo));
		elem3.addEventListener('click', addToBetSlip); // works
		elem2.appendChild(elem3);

		elem4 = document.createElement("div");
		elem4.classList = "odd";
		elem4.innerHTML = players[i].backOdds[0];
		// elem3.appendChild(elem4);

		elem5 = document.createElement("div");
		elem5.classList = "totalAmt";
		elem5.innerHTML = "£ " + players[i].backOdds[0];
		// elem3.appendChild(elem5);
		elem3.append(elem4,elem5);

		// 122
		elem3 = document.createElement("div");
		elem3.classList = "backBetMidContainer backOthersBgColor";
		//elem3.setAttribute("id","oddSelected_122");
		idString = eventinfo.time+'_'+eventinfo.raceName+'_'+playerinfo.horseName+'_'+'back'+'_'+players[i].backOdds[0];
		elem3.setAttribute("id", idString); //   oddSelected_111
		playerinfo["odd"] = players[i].backOdds[1];
		playerinfo["betType"] = "back";
		elem3.setAttribute("data-eventinfo",  JSON.stringify(eventinfo));
		elem3.setAttribute("data-playerinfo", JSON.stringify(playerinfo));
		elem3.addEventListener('click', addToBetSlip); // works
		elem2.appendChild(elem3);

		elem4 = document.createElement("div");
		elem4.classList = "odd";
		elem4.innerHTML = players[i].backOdds[1];
		elem3.appendChild(elem4);

		elem4 = document.createElement("div");
		elem4.classList = "totalAmt";
		elem4.innerHTML = "£ " + players[i].backOdds[1];
		elem3.appendChild(elem4);

		// 133
		elem3 = document.createElement("div");
		elem3.classList = "backBetHighContainer backMainBgColor";
		//elem3.setAttribute("id","oddSelected_133");
		idString = eventinfo.time+'_'+eventinfo.raceName+'_'+playerinfo.horseName+'_'+'back'+'_'+players[i].backOdds[0];
		elem3.setAttribute("id", idString); //   oddSelected_111
		playerinfo["odd"] = players[i].backOdds[2];
		playerinfo["betType"] = "back";
		elem3.setAttribute("data-eventinfo",  JSON.stringify(eventinfo));
		elem3.setAttribute("data-playerinfo", JSON.stringify(playerinfo));
		elem3.addEventListener('click', addToBetSlip); // works
		elem2.appendChild(elem3);

		elem4 = document.createElement("div");
		elem4.classList = "odd";
		elem4.innerHTML = players[i].backOdds[2];
		elem3.appendChild(elem4);

		elem4 = document.createElement("div");
		elem4.classList = "totalAmt";
		elem4.innerHTML = "£ " + players[i].backOdds[2];
		elem3.appendChild(elem4);

		// odd range - lay
		// 144
		elem3 = document.createElement("div");
		elem3.classList = "layBetLowContainer layMainBgColor";
		// elem3.setAttribute("id","oddSelected_144");
		idString = eventinfo.time+'_'+eventinfo.raceName+'_'+playerinfo.horseName+'_'+'lay'+'_'+players[i].layOdds[0];
		elem3.setAttribute("id", idString); //   oddSelected_111
		playerinfo["odd"] = players[i].layOdds[0];
		playerinfo["betType"] = "lay";
		elem3.setAttribute("data-eventinfo",  JSON.stringify(eventinfo));
		elem3.setAttribute("data-playerinfo", JSON.stringify(playerinfo));
		elem3.addEventListener('click', addToBetSlip); // works
		elem2.appendChild(elem3);

		elem4 = document.createElement("div");
		elem4.classList = "odd";
		elem4.innerHTML = players[i].layOdds[0];
		elem3.appendChild(elem4);

		elem4 = document.createElement("div");
		elem4.classList = "totalAmt";
		elem4.innerHTML = "£ " + players[i].layOdds[0];
		elem3.appendChild(elem4);

		// 155
		elem3 = document.createElement("div");
		elem3.classList = "layBetMidContainer layOthersBgColor";
		//elem3.setAttribute("id","oddSelected_155");
		idString = eventinfo.time+'_'+eventinfo.raceName+'_'+playerinfo.horseName+'_'+'lay'+'_'+players[i].layOdds[1];
		elem3.setAttribute("id", idString); //   oddSelected_111
		playerinfo["odd"] = players[i].layOdds[1];
		playerinfo["betType"] = "lay";
		elem3.setAttribute("data-eventinfo",  JSON.stringify(eventinfo));
		elem3.setAttribute("data-playerinfo", JSON.stringify(playerinfo));
		elem3.addEventListener('click', addToBetSlip); // works
		elem2.appendChild(elem3);

		elem4 = document.createElement("div");
		elem4.classList = "odd";
		elem4.innerHTML = players[i].layOdds[1];
		elem3.appendChild(elem4);

		elem4 = document.createElement("div");
		elem4.classList = "totalAmt";
		elem4.innerHTML = "£ " + players[i].layOdds[1];
		elem3.appendChild(elem4);

		// 166
		elem3 = document.createElement("div");
		elem3.classList = "layBetHighContainer layOthersBgColor";
		//elem3.setAttribute("id","oddSelected_166");
		idString = eventinfo.time+'_'+eventinfo.raceName+'_'+playerinfo.horseName+'_'+'lay'+'_'+players[i].layOdds[2];
		elem3.setAttribute("id", idString); //   oddSelected_111
		playerinfo["odd"] = players[i].layOdds[2];
		playerinfo["betType"] = "lay";
		elem3.setAttribute("data-eventinfo",  JSON.stringify(eventinfo));
		elem3.setAttribute("data-playerinfo", JSON.stringify(playerinfo));
		elem3.addEventListener('click', addToBetSlip); // works
		elem2.appendChild(elem3);

		elem4 = document.createElement("div");
		elem4.classList = "odd";
		elem4.innerHTML = players[i].layOdds[2];
		elem3.appendChild(elem4);

		elem4 = document.createElement("div");
		elem4.classList = "totalAmt";
		elem4.innerHTML = "£ " + players[i].layOdds[2];
		elem3.appendChild(elem4);	
	}

	// // bet slip container
	// let oddSelectedXXX = document.getElementById('oddSelected_xxx');
	// 	oddSelectedXXX.addEventListener('click', function () {
	// 	document.getElementById('betSlipContainer').style.display = 'block';
	// });

	// bet slip container
	let oddSelectedXXX = document.getElementById('oddSelected_xxx');
	oddSelectedXXX.addEventListener('click', myFunction); // works
	// oddSelectedXXX.removeEventListener('click', myFunction); // works
}


function myFunction(e) {
	console.log(this);
	console.log(e.currentTarget); // element you clicked
	console.log(this.dataset.sridhar);
	console.log(this.getAttribute('krishnan'));

	console.log(JSON.parse(this.dataset.eventinfo));
	console.log(JSON.parse(this.dataset.playerinfo));

	// do something with e, param1 and param2
	// console.log(e, param1, param2);
	document.getElementById('betSlipContainer').style.display = 'block';
}



    
////////////////////// Dynamically construct - Race Card (end) ///////////////


/////////////// Dynamically construct - Bet slip (start) ///////////////////////

let betSlipSheet = {};



// passing attributes from HTML -> JS by data-
// https://stackoverflow.com/questions/51617527/parameter-passing-in-javascript-onclick-this-id-versus-other-attributes

// default 'e' is send by the function
function addToBetSlip(e) {

	if(!betSlipSheet[this.id]) {
		betSlipSheet[this.id] = { };
		betSlipSheet[this.id].eventinfo = JSON.parse(this.dataset.eventinfo);
		betSlipSheet[this.id].playerinfo = JSON.parse(this.dataset.playerinfo);
		constructBetSlip(betSlipSheet);
	}




	console.log(this);
	console.log(e.currentTarget); // element you clicked
	console.log(this.dataset.sridhar);
	console.log(this.getAttribute('krishnan'));

	console.log(JSON.parse(this.dataset.eventinfo));
	console.log(JSON.parse(this.dataset.playerinfo));

	// do something with e, param1 and param2
	// console.log(e, param1, param2);
	document.getElementById('betSlipContainer').style.display = 'block';
}




function constructBetSlip(betSlipSheet) {
	let elemRef = null; 


	for (let key in betSlipSheet) {
		if (betSlipSheet.hasOwnProperty(key)) {

			elemRef = document.createElement("DIV");
			elemRef.setAttribute("id","timeVenueId");
			elemRef.setAttribute("class","gridColumnLayout gridColumnLayout_2");
			if(document.getElementById("betSlipContainer").lastElementChild) {
				document.getElementById("betSlipContainer").lastElementChild.appendChild(elemRef); 
			}
			else {
				document.getElementById("betSlipContainer").appendChild(elemRef); 
			}
		
			elemRef = document.createElement("DIV");
			elemRef.setAttribute("id","timeId");
			document.getElementById("timeVenueId").appendChild(elemRef); 
		
			elemRef = document.createTextNode(betSlipSheet[key].eventinfo.time); // ("13:00");
			document.getElementById("timeId").appendChild(elemRef); 
		
			elemRef = document.createElement("DIV");
			elemRef.setAttribute("id","venueId");
			document.getElementById("timeVenueId").appendChild(elemRef); 
		
			elemRef = document.createTextNode(betSlipSheet[key].eventinfo.raceName); //("Wolverhampton");
			document.getElementById("venueId").appendChild(elemRef); 
		
			elemRef = document.createElement("DIV");
			elemRef.setAttribute("id","outcomePlayerId");
			elemRef.setAttribute("class","gridColumnLayout gridColumnLayout_2");
			document.getElementById("betSlipContainer").appendChild(elemRef); 
		
			elemRef = document.createElement("DIV");
			elemRef.setAttribute("id","outcomeId");
			document.getElementById("outcomePlayerId").appendChild(elemRef); 
		
			elemRef = document.createTextNode(betSlipSheet[key].playerinfo.betType); // ("Win");
			document.getElementById("outcomeId").appendChild(elemRef); 
		
			elemRef = document.createElement("DIV");
			elemRef.setAttribute("id","playerId");
			elemRef.setAttribute("class","halfOpaque");
			document.getElementById("outcomePlayerId").appendChild(elemRef); 
		
			elemRef = document.createTextNode(betSlipSheet[key].playerinfo.horseName); // ("8 She's A Deva");
			document.getElementById("playerId").appendChild(elemRef); 
		
			elemRef = document.createElement("DIV");
			elemRef.setAttribute("id","backStakeProfitBetBinId");
			elemRef.setAttribute("class","gridColumnLayout gridColumnLayout_5 gridCenterVH");
			document.getElementById("betSlipContainer").appendChild(elemRef); 
		
			elemRef = document.createElement("DIV");
			elemRef.setAttribute("id","backPlusMinusId");
			elemRef.setAttribute("class","gridColumnLayout gridColumnLayout_3");
			document.getElementById("backStakeProfitBetBinId").appendChild(elemRef); 
		
			elemRef = document.createElement("DIV");
			elemRef.setAttribute("id", key+"_subtractBackId");
			elemRef.setAttribute("class","gridCenterVH backMainBgColor");
			elemRef.addEventListener('click', subtractOdd);
			document.getElementById("backPlusMinusId").appendChild(elemRef); 
		
			elemRef = document.createTextNode("-");
			document.getElementById( key+"_subtractBackId").appendChild(elemRef); 
		
			elemRef = document.createElement("DIV");
			elemRef.setAttribute("id","backOthersBgColorId");
			elemRef.setAttribute("class","backOthersBgColor");
			document.getElementById("backPlusMinusId").appendChild(elemRef); 
		
			elemRef = document.createElement("DIV");
			elemRef.setAttribute("id","backMainFontColorId");
			elemRef.setAttribute("class","backMainFontColor");
			document.getElementById("backOthersBgColorId").appendChild(elemRef); 
		
			elemRef = document.createTextNode(betSlipSheet[key].playerinfo.betType); //("BACK");
			document.getElementById("backMainFontColorId").appendChild(elemRef); 
		
			elemRef = document.createElement("DIV");
			elemRef.setAttribute("id","backValueContainerId");
			document.getElementById("backOthersBgColorId").appendChild(elemRef); 
		
			elemRef = document.createElement("INPUT");
			elemRef.setAttribute("id", key+"_oddValueId");   // "backValueId");
			elemRef.setAttribute("type","number");
			elemRef.setAttribute("value",betSlipSheet[key].playerinfo.odd);
			// elemRef.setAttribute("placeholder","4.3");
			document.getElementById("backValueContainerId").appendChild(elemRef); 
		
			elemRef = document.createElement("DIV");
			elemRef.setAttribute("id", key+"_additionBackId");
			elemRef.setAttribute("class","gridCenterVH backMainBgColor");
			elemRef.addEventListener('click', addOdd);
			document.getElementById("backPlusMinusId").appendChild(elemRef); 
		
			elemRef = document.createTextNode("+");
			document.getElementById(key+"_additionBackId").appendChild(elemRef); 
		
			elemRef = document.createElement("DIV");
			elemRef.setAttribute("id","stakeBackOthersBgColor");
			elemRef.setAttribute("class","backOthersBgColor");
			document.getElementById("backStakeProfitBetBinId").appendChild(elemRef); 
		
			elemRef = document.createElement("DIV");
			elemRef.setAttribute("id","stakeId");
			elemRef.setAttribute("class","backMainFontColor");
			document.getElementById("stakeBackOthersBgColor").appendChild(elemRef); 
		
			elemRef = document.createTextNode("STAKE");
			document.getElementById("stakeId").appendChild(elemRef); 
		
			elemRef = document.createElement("DIV");
			elemRef.setAttribute("id","stakeValueId");
			document.getElementById("stakeBackOthersBgColor").appendChild(elemRef); 
		
			elemRef = document.createTextNode("4.3");
			document.getElementById("stakeValueId").appendChild(elemRef); 
		
			elemRef = document.createElement("DIV");
			elemRef.setAttribute("id","profitBackOthersBgColorId");
			elemRef.setAttribute("class","backOthersBgColor");
			document.getElementById("backStakeProfitBetBinId").appendChild(elemRef); 
		
			elemRef = document.createElement("DIV");
			elemRef.setAttribute("id","profitBackMainFontColorId");
			elemRef.setAttribute("class","backMainFontColor");
			document.getElementById("profitBackOthersBgColorId").appendChild(elemRef); 
		
			elemRef = document.createTextNode("PROFIT");
			document.getElementById("profitBackMainFontColorId").appendChild(elemRef); 
		
			elemRef = document.createElement("DIV");
			elemRef.setAttribute("id","profitValueBackMainFontColorId");
			document.getElementById("profitBackOthersBgColorId").appendChild(elemRef); 
		
			elemRef = document.createTextNode("4.3");
			document.getElementById("profitValueBackMainFontColorId").appendChild(elemRef); 
		
			elemRef = document.createElement("DIV");
			elemRef.setAttribute("id","placeBetButtonId");
			elemRef.setAttribute("class","tickButtonBackground");
			document.getElementById("backStakeProfitBetBinId").appendChild(elemRef); 
		
			elemRef = document.createTextNode("✔");
			document.getElementById("placeBetButtonId").appendChild(elemRef); 
		
			elemRef = document.createElement("DIV");
			elemRef.setAttribute("id","deleteBetButtonId");
			elemRef.setAttribute("class","binButtonBackground");
			document.getElementById("backStakeProfitBetBinId").appendChild(elemRef); 
		
			elemRef = document.createTextNode("🗑");
			document.getElementById("deleteBetButtonId").appendChild(elemRef);
		}
	 }
	
}

// constructBetSlip();
///////////////// Dynamically construct - Bet slip  (end) //////////////////////


////////////////// stack addition and subtraction (start) //////////////////////


function subtractOdd(e) {

	const oddId = this.id.replace('_subtractBackId','_oddValueId'); // src, dst

	const oddValue = document.getElementById(oddId); 

	const value = Number(oddValue.value);

	if(value > 0.5) {
		document.getElementById(oddId).value = (value - 0.5).toFixed(2);
	}
	else document.getElementById(oddId).value = (0).toFixed(2);
}

function addOdd(e) {

	const oddId = this.id.replace('_additionBackId','_oddValueId'); // src, dst

	const oddValue = document.getElementById(oddId); 

	const value = Number(oddValue.value);

	if(value) {
		document.getElementById(oddId).value = (value+ 0.5).toFixed(2);
	}
	else document.getElementById(oddId).value = (0.5).toFixed(2);
}




/*

const backValue = document.getElementById('backValueId'); 

let subtractBack = document.getElementById('subtractBackId');
subtractBack.addEventListener('click', function () {
	const value = Number(backValue.value);
	if(value > 0.5) {
		document.getElementById('backValueId').value = (value - 0.5).toFixed(2);
	}
	else document.getElementById('backValueId').value = (0).toFixed(2);
});

let additionBack = document.getElementById('additionBackId');
additionBack.addEventListener('click', function () {
	const value = Number(backValue.value);
	if(value) {
		document.getElementById('backValueId').value = (value+ 0.5).toFixed(2);
	}
	else document.getElementById('backValueId').value = (0.5).toFixed(2);
});

// Place a bet
let placeBetButton = document.getElementById('placeBetButtonId');
placeBetButton.addEventListener('click', function () {
	const value = Number(backValue.value);
	if(value) {
		document.getElementById('backValueId').value = (value+ 0.5).toFixed(2);
	}
	else console.error("Invalid bet amount");
});

// Delete the bet slip
let deleteBetButton = document.getElementById('deleteBetButtonId');
deleteBetButton.addEventListener('click', function () {
	document.getElementById('betSlipContainer').style.display = 'none';
});

*/
////////////////// stack addition and subtraction (end) ////////////////////////

///////////////////////////// Odd range selection //////////////////////////////
// let oddSelected = document.getElementById('oddSelected_111');
// oddSelected.addEventListener('click', function () {
// 	document.getElementById('betSlipContainer').style.display = 'block';
// });

////////////////////////////////////////////////////////////////////////////////

	let winnerPredictor = function(range, pickerBoxesId) {
		if(range > 1 && range > pickerBoxesId.length) {
			let overItems = []; // document.getElementById('pickerBoxOneId');
			let indexes = [];
			// [...[...Array(5).keys()].map(x => x+1), ...[...Array(3).keys()].map(x => x+2).reverse()]
			// [1, 2, 3, 4, 5, 4, 3, 2] <= forward and backward movement indexes
			let idxValues = [...[...Array(range).keys()].map(x => x+1), ...[...Array(range - 2).keys()].map(x => x+2).reverse()];
			let indexValuesLength = idxValues.length;

			for(let i = 0, j =   pickerBoxesId.length; i < j; ++i) {
				overItems.push(document.getElementById(pickerBoxesId[i]));
				indexes.push(0);
			}

			let randomPickScroller = function(i) {
				overItems[i].style.gridColumnStart = idxValues[indexes[i]];
				indexes[i] = (indexes[i]+1) % indexValuesLength;
			};

			// delay = ++delay % pickerBoxesId.length;
			setInterval(()=>randomPickScroller(0), 1000);
			setInterval(()=>randomPickScroller(1), 2000);
			setInterval(()=>randomPickScroller(2), 3000);
		}
	};

	// winnerPredictor(6, ['pickerBoxOneId', 'pickerBoxTwoId', 'pickerBoxThreeId']);
	// winnerPredictor(6, ['pickerBoxOneId', 'pickerBoxTwoId']);
////////////////////////////////////////////////////////////////////////////////

	function css( element, property ) {
		let prop =  window.getComputedStyle( element, null ).getPropertyValue( property );
		return window.getComputedStyle( element, null ).getPropertyValue( property );
	}

	// resizeSlidingWindow = function() {
	// 	let shuffleItem = document.getElementById('shuffleItemId');
	// 	let shuffleItemWidth = parseInt( css( shuffleItem, 'width' ), 10 ); // "10.992px" => 10.992
	// 	// let shuffleItemLeft  = parseInt( css( shuffleItem, 'left' ), 10 );

	// 	document.getElementById('slideOverBoxId').style.width = shuffleItemWidth + 'px';
	// 	// document.getElementById('slideOverBoxId').style.left  = shuffleItemLeft + 'px';
	// 	// Note: style.left <= offsetLeft
	// 	document.getElementById('slideOverBoxId').style.left = document.getElementById('shuffleItemId').offsetLeft + 'px';	

	// }();

	function translationAnimation(containerElementId, sliderObjs) {
		let shuffleItemsContainer = document.querySelector('#'+containerElementId);
		let children = shuffleItemsContainer.children; // gets array of children from the parent

		let startPos = children[0].offsetLeft;
		let endPos = children[children.length -  1].offsetLeft - startPos; // containerWidth - shuffleItemWidth;

		let sliderObjects = []; // array of objects
		for (let key in sliderObjs) {
			if (sliderObjs.hasOwnProperty(key)) {
				let obj = {};
				obj.sliderElement = document.querySelector('#'+key);  // slider element
				obj.stopPos = children[sliderObjs[key]].offsetLeft - startPos; // stop position in pixels
				obj.isForwardMove = true;
				obj.isFinalPositionReached = false;
				obj.currentPos = 0;
				obj.delta = randomIntFromInterval(60, 90); // speed of movement = 18; // 
				obj.timeout = randomIntFromInterval(3000, 9000); // between 3 and 9 seconds = 4801; // 
				sliderObjects.push(obj);
				console.log(`delta: ${obj.delta}, timeout: ${obj.timeout}`);
			}
		}

		// let currentPos = 0;
		// let isForwardMove = true;
	
		// let timeout = 4000;
		// let delta = 20;


		// let startPos = elem.style.left;
		// let left = parseInt( css( element, 'left' ), 10 ); // "10.992px" => 10.992
		// let left = element.offsetLeft;

		// let shuffleItemsContainer = document.getElementById('shuffleItemsContainerId');


		// let isFinalPositionReached = false;
		// let shuffleItem = document.getElementById('pickerBoxOneId');
		// let containerWidth = parseInt( css( shuffleItemsContainer, 'width' ), 10 ); // "10.992px" => 10.992
		// let shuffleItemWidth = parseInt( css( shuffleItem, 'width' ), 10 ); // "10.992px" => 10.992
		// let shuffleLastItemLeft = document.getElementById('shuffleLastItemId').offsetLeft;


		let arrayIndex = 0;
		let arrayLength = sliderObjects.length;
		let countFinalPositionReached = 0;
		let startTimeStamp; //  = window.performance.now();
		
		function callbackLoop(currentTimeStamp) {
			if (startTimeStamp === undefined) startTimeStamp = currentTimeStamp;
			let elapsed = currentTimeStamp - startTimeStamp;
			
			if(!sliderObjects[arrayIndex].isFinalPositionReached) {
				if(sliderObjects[arrayIndex].isForwardMove) {
					// currentPos += elapsed * 0.01;
					sliderObjects[arrayIndex].currentPos += sliderObjects[arrayIndex].delta;
					if(sliderObjects[arrayIndex].currentPos < endPos) {
						sliderObjects[arrayIndex].sliderElement.style.transform = 'translateX(' + sliderObjects[arrayIndex].currentPos + 'px)';
					}
					else {
						sliderObjects[arrayIndex].isForwardMove = false;
						sliderObjects[arrayIndex].sliderElement.style.transform = 'translateX(' + endPos + 'px)';
					}
				}
				else {
					// currentPos -= elapsed * 0.01;
					sliderObjects[arrayIndex].currentPos -= sliderObjects[arrayIndex].delta;
					if(sliderObjects[arrayIndex].currentPos > 0) {
						sliderObjects[arrayIndex].sliderElement.style.transform = 'translateX(' + sliderObjects[arrayIndex].currentPos + 'px)';
					}
					else {
						sliderObjects[arrayIndex].isForwardMove = true;
						sliderObjects[arrayIndex].sliderElement.style.transform = 'translateX(' + 0 + 'px)';
					}
				}
			}

			if(!sliderObjects[arrayIndex].isFinalPositionReached && elapsed > sliderObjects[arrayIndex].timeout && 
				Math.abs(sliderObjects[arrayIndex].currentPos - sliderObjects[arrayIndex].stopPos) <= sliderObjects[arrayIndex].delta &&
				((sliderObjects[arrayIndex].isForwardMove && sliderObjects[arrayIndex].currentPos > sliderObjects[arrayIndex].stopPos) || 
				(!sliderObjects[arrayIndex].isForwardMove && sliderObjects[arrayIndex].currentPos < sliderObjects[arrayIndex].stopPos))) {
				sliderObjects[arrayIndex].isFinalPositionReached = true;
				++countFinalPositionReached;
				sliderObjects[arrayIndex].sliderElement.style.transform = 'translateX(' + sliderObjects[arrayIndex].stopPos + 'px)';
				// exit condition - after 3 sec
				if(arrayLength != countFinalPositionReached) window.requestAnimationFrame(callbackLoop);
			}
			else {
				arrayIndex = ++arrayIndex % arrayLength;
				window.requestAnimationFrame(callbackLoop);
			}
		}
		window.requestAnimationFrame(callbackLoop);
	}

	// caller => 	'pickerBoxOneId','shuffleItemsContainerId', 3

	// translationAnimation('shuffleItemsContainerId', { "pickerBoxOneId": 2, "pickerBoxTwoId": 4 });
// 	translationAnimation('shuffleItemsContainerId', { "pickerBoxOneId": 5});
translationAnimation('shuffleItemsContainerId', { "pickerBoxOneId": 5, "pickerBoxTwoId": 1, "pickerBoxThreeId": 0  });


    /*
// https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
// https://www.youtube.com/watch?v=tS6oP1NveoI
let start, previousTimeStamp;

function step(timestamp) {
  if (start === undefined)
    start = timestamp;
  const elapsed = timestamp - start;

  if (previousTimeStamp !== timestamp) {
    // Math.min() is used here to make sure the element stops at exactly 200px
    const count = Math.min(0.5 * elapsed, timeDuration);
    element.style.transform = 'translateX(' + count + 'px)';
  }

  if (elapsed < timeDuration) { // Stop the animation after 2 seconds
    previousTimeStamp = timestamp;
    window.requestAnimationFrame(step);
  }
}

// 

function translate(elem, duration) {
  element = elem; // global
  timeDuration = duration; // global

//     step(0, elem);
    window.requestAnimationFrame(step);
}

*/

    // java script Animation
    // https://javascript.info/js-animation

    /*
        function animate({duration, draw, timing}) {

        let start = performance.now();
      
        requestAnimationFrame(function animate(time) {
          let timeFraction = (time - start) / duration;
          if (timeFraction > 1) timeFraction = 1;
      
          let progress = timing(timeFraction);
      
          draw(progress);
      
          if (timeFraction < 1) {
            requestAnimationFrame(animate);
          }
      
        });
      }
      
    function translate(elem) {
        animate({
            duration: 5000,
            timing: function(timeFraction) {
              return timeFraction;
            },
            draw: function(progress) {
                // elem.style.width = progress * 100 + '%';
                elem.style.left = progress * 100 + '%';
            }
          });
    }
    */

    // function translate( elem, x, y ) {
    //     var left = parseInt( css( elem, 'left' ), 10 ),
    //         top = parseInt( css( elem, 'top' ), 10 ),
    //         dx = 0,
    //         dy = 0,
    //         i = 1,
    //         count = 200,
    //         delay = 0;

    //         dx = x!= undefined ?   left - x: 0;
    //         dy = y!= undefined ?   top - y: 0;

        
    //     function loop() {
    //         if ( i >= count ) { return; }
    //         i += 1;
    //         elem.style.left = ( left - ( dx * i / count ) ).toFixed( 0 ) + 'px';
    //         elem.style.top = ( top - ( dy * i / count ) ).toFixed( 0 ) + 'px';
    //         setTimeout( loop, delay );
    //     }
        
    //     loop();
    // }
    
    // function css( element, property ) {
    //     return window.getComputedStyle( element, null ).getPropertyValue( property );
    // }


    // let x = 1;
    // leftRightAlternateMove = function(evt) {
    //     evt.style.left = x + 'px';
    //     ++x;
    //     setInterval(()=>leftRightAlternateMove(evt), 1000);
    // };



    let slideOverBox = document.getElementById('pickerBoxOneId');
	slideOverBox.addEventListener('click', function () {
		// leftRightAlternateMove(this);
        // translate(this, 900);
        // translate(this, 2000);
		// translationAnimation(this,0, 600);
		translationAnimation(this, 'shuffleItemsContainerId', 3); // this => 'slideOverBox'

		
	});





});