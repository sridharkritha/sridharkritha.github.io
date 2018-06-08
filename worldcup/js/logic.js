window.addEventListener('load', function() {
	var countries = ['Australia', 'Costa Rica', 'Belgium', 'Iran'];
	var countryA, countryB, countryAgoal, countryBgoal;
	var objDB = [];
	countryA = countryB = countries[0];
	countryAgoal = countryAgoal = 0;
	////////////////////////////////////////  TEAM A ////////////////////////////////////////////////////////
	///////////////////  INPUT BOX
	var nodeInputBoxA = document.createElement('INPUT');
	nodeInputBoxA.setAttribute("id", "teamA_inputbox");
	nodeInputBoxA.setAttribute("type", "number");
	nodeInputBoxA.setAttribute("value", 0);
	// Add to HTML documents
	document.getElementById("teamA").appendChild(nodeInputBoxA);
	////////////////// DROP DOWN 
	var nodeDropDownA = document.createElement('select'); // Drop down - select / option
	nodeDropDownA.setAttribute("id", "teamA_dropdown"); 	 // Assign Id Name
	// Populate Countries
	for (var i = 0; i < countries.length; i++) {
		var country = new Option(countries[i], i); // Option("key", "value");
		nodeDropDownA.options.add(country);
	}
	// Add to HTML documents
	document.getElementById("teamA").appendChild(nodeDropDownA);
	////////////////////////////////////////  TEAM B ////////////////////////////////////////////////////////
	///////////////////  INPUT BOX
	var nodeInputBoxB = document.createElement('INPUT');
	nodeInputBoxB.setAttribute("id", "teamB_inputbox");
	nodeInputBoxB.setAttribute("type", "number");
	nodeInputBoxB.setAttribute("value", 0);
	// Add to HTML documents
	document.getElementById("teamA").appendChild(nodeInputBoxB);
	////////////////// DROP DOWN 
	var nodeDropDownB = document.createElement('select'); // Drop down - select / option
	nodeDropDownB.setAttribute("id", "teamB_dropdown"); 	 // Assign Id Name
	// Populate Countries
	for (var i = 0; i < countries.length; i++) {
		var country = new Option(countries[i], i);
		nodeDropDownB.options.add(country);
	}
	// Add to HTML documents
	document.getElementById("teamA").appendChild(nodeDropDownB);
	///////////////////////////////////////// Buttons //////////////////////////////////////////////////////
	var btn = document.createElement("BUTTON");        // Create a <button> element
	btn.setAttribute("id", "btnId");
	var t = document.createTextNode("Add");       // Create a text node
	btn.appendChild(t);                                // Append the text to <button>
	document.getElementById("teamA").appendChild(btn); // Append <button> to <body>
	/////////////////////////////////////// EVENT HANDLERS //////////////////////////////////////////////////
	// Event Handler for Drop down
	document.querySelector('select[id="teamA_dropdown"]').onchange = OnTeamAorBselected;
	document.querySelector('select[id="teamB_dropdown"]').onchange = OnTeamAorBselected;
	// Callback function - for Drop down selection
	function OnTeamAorBselected(event) {
		var countryList = event.target; // Drop Down teamA_dropdown or teamB_dropdown
		var selCountry = countryList.options[countryList.selectedIndex].value;
		if(countryList.id === "teamA_dropdown")
		{
			countryA = countries[selCountry];
		}
		else if(countryList.id === "teamB_dropdown")
		{
			countryB = countries[selCountry];
		}
		// Display the result
		// var result = document.getElementById("result");
		// result.innerHTML += countries[selCountry];
	}
	
	// Event Handler for Button
	document.getElementById("btnId").addEventListener("click", displayDate);
	// Callback function - for Button click
	function displayDate() {
		countryAgoal = document.getElementById("teamA_inputbox").value;
		countryBgoal = document.getElementById("teamB_inputbox").value;

		var obj = {}; // (or) var obj = new Object();
		obj.Agoal = countryAgoal;
		obj.Bgoal = countryBgoal;
		obj.Acountry = countryA;
		obj.Bcountry = countryB;
		objDB.push(obj);

		document.getElementById("result").innerHTML = countryAgoal + " " + countryA + countryBgoal + " " + countryB ;
	}
}); // window.addEventListener('load', function() {


/*
window.addEventListener('load', function() {

document.querySelector('select[id="car"]').onchange=ChangeCarList;



var carsAndModels = {};
carsAndModels['VO'] = ['V70', 'XC60', 'XC90'];
carsAndModels['VW'] = ['Golf', 'Polo', 'Scirocco', 'Touareg'];
carsAndModels['BMW'] = ['M6', 'X5', 'Z3'];

function ChangeCarList() {
    var carList = document.getElementById("car");
    var modelList = document.getElementById("carmodel");
    var selCar = carList.options[carList.selectedIndex].value;
    while (modelList.options.length) {
        modelList.remove(0);
    }
    var cars = carsAndModels[selCar];
    if (cars) {
        var i;
        for (i = 0; i < cars.length; i++) {
            var car = new Option(cars[i], i);
            modelList.options.add(car);
        }
    }
}

}); // window.addEventListener('load', function() {

*/