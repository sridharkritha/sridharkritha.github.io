window.addEventListener('load', function () {
	/*
	1. Grouping 100% chance winners
	2. Grouping one half 100% winners and another half 90% winners
	3. 2 folds -> 100% + (90 - 95)%
	4. 3 folds -> 100% + 100% + (90 - 95)%
	5. 4 folds -> 100% + 100% + (90 - 95)% + (90 - 95)%
	6. 5 folds -> 100% + 100% + 100% + (90 - 95)% + (80 - 90)%
	
	Note: 
	1. EW can't be fold into Win only
	*/
	var raceData = [];
	var pageNoCurr = 0; // current page number
	var pageNoTotal = 0; // total page numbers
	var prevPosition = 0;
	// DB Collections
	var allOddRankDB = [];
	var allWinEachWayPercentRankDB = [];
	var allEachWayPercentRankDB = [];
	var allTimeRankDB = [];

	var allWinOnlyPercentRankDB = [];
	var twoWayPercentRankDB = [];
	var threeWayPercentRankDB = [];
	var fourWayPercentRankDB = [];
	// Result
	var output_winOrEwPercentClass = [];
	var tvShow = [];

	var selectedList = [];

	// Enum - Win Type
	var WIN_TYPE = {
		WIN_ONLY: 'WIN_ONLY',
		TWO_PLACES: 'TWO_PLACES',
		THREE_PLACES: 'THREE_PLACES',
		MORE_PLACES: 'MORE_PLACES',
	};
	var winTypeData = WIN_TYPE.WIN_ONLY;

	// Enum - Fold Type
	var FOLD_TYPE = {
		TWO_FOLD: 'TWO_FOLD',
		THREE_FOLD: 'THREE_FOLD',
		FOUR_FOLD: 'FOUR_FOLD',
		FIVE_FOLD: 'FIVE_FOLD',
	};
	var foldTypeData = FOLD_TYPE.TWO_FOLD;

	winTypeRadioOption = function (radioOption) {
		winTypeData = radioOption.value;
	}

	foldTypeRadioOption = function (radioOption) {
		foldTypeData = radioOption.value;
	}

	showValue = function (newValue, slide) {
		document.getElementById(slide).innerHTML = newValue;
	}

	function clear() {
		document.getElementById("timeId").value = '';
		document.getElementById("horseId").value = '';
		document.getElementById("oddId").value = '';
		document.getElementById("winPercentageId").value = '';
		document.getElementById("nRunnersId").value = '';
		document.getElementById("winPercentageId").value = document.getElementById("sliderID").innerHTML = '50';
	}

	/*
	1. Grouping 100% chance winners
	2. Grouping one half 100% winners and another half 90% winners
	3. 2 folds -> 100% + (90 - 95)%
	4. 3 folds -> 100% + 100% + (90 - 95)%
	5. 4 folds -> 100% + 100% + (90 - 95)% + (90 - 95)%
	6. 5 folds -> 100% + 100% + 100% + (90 - 95)% + (80 - 90)%
	*/

	function printResult(objArray) {
		var printDataByTime = [];
		// Browse the object in ascending order / in the order creation 
		for (var key in objArray) {
			if (objArray.hasOwnProperty(key)) {
				// Store as a array instead of object for doing sorting at the later stage				
				printDataByTime.push([key, objArray[key]]);
			}
		}

		// Sort by ascending order of odd value [ex: 9.30, 10.25, 11.57 ]
		printDataByTime.sort(function (a, b) {
			var hrA = Number(a[1].time.slice(0, 2));
			var minA = Number(a[1].time.slice(3, 5));
			var hrB = Number(b[1].time.slice(0, 2));
			var minB = Number(b[1].time.slice(3, 5));

			if (hrA === hrB) {
				return minA < minB ? false : true;
			}
			else if (hrA < hrB) {
				return false;
			}
			else {
				return true;
			}
		});

		///////////////////////// Print the result ///////////////////////////////////

		var isContainsAnyValid = false;
		for (var i = 0; i < printDataByTime.length; ++i) {
			if (printDataByTime[i]) {
				isContainsAnyValid = true;

				document.getElementById("predictDataId").innerHTML += printDataByTime[i][1].time + '	' +
					printDataByTime[i][1].horse + '	' + printDataByTime[i][1].winPercentage + '	' +
					printDataByTime[i][1].odd.string + '<br />';
			}
		}

		if (isContainsAnyValid) {
			document.getElementById("predictDataId").innerHTML += '---------------------------------' + '<br />';
		}
	}

	function goldCup(array) {
		var winOrEw = shakthiClassify(array);

		var a = 0, b = 0, c = 0, d = 0, e = 0, index = 0;
		var n = 4;

		if (n === 4) {
			--n;
			while (true) {
				index = 0;

				// 100, 100, 95-99, 90-94
				// 100, 95-99, 95-99, 90-94				
				a = winOrEw[index + 0][winOrEw[index + 0].length - 1];   // 100%
				a2 = winOrEw[index + 0][winOrEw[index + 0].length - 2];   // 100%
				b = winOrEw[index + 1][winOrEw[index + 1].length - 1]; // 95-99
				b2 = winOrEw[index + 1][winOrEw[index + 1].length - 2]; // 95-99
				c = winOrEw[index + 2][winOrEw[index + 2].length - 1]; // 90-95

				if (a && a2 && b && c) {
					// 100, 100, 95-99, 90-94
					winOrEw[index + 0].pop();
					winOrEw[index + 0].pop();
					winOrEw[index + 1].pop();
					winOrEw[index + 2].pop();

					printResult([a, a2, b, c]);
					continue;
				}

				if (a && b && b2 && c) {
					// 100, 95-99, 95-99, 90-94	
					winOrEw[index + 0].pop();
					winOrEw[index + 1].pop();
					winOrEw[index + 1].pop();
					winOrEw[index + 2].pop();

					printResult([a, b, b2, c]);
					continue;
				}
				break;
			}
		}

		if (n === 3) {
			--n;
			while (true) {
				index = 0;

				a = winOrEw[index + 0][winOrEw[index + 0].length - 1];   // 100%
				b = winOrEw[index + 1][winOrEw[index + 1].length - 1]; // 95-99
				c = winOrEw[index + 2][winOrEw[index + 2].length - 1]; // 90-95
				d = winOrEw[index + 3][winOrEw[index + 3].length - 1]; // 85-90
				if (a && b && c) {
					// 100, 95-99, 90-95
					winOrEw[index + 0].pop();
					winOrEw[index + 1].pop();
					winOrEw[index + 2].pop();

					printResult([a, b, c]);
					continue;
				}

				if (a && c && d) {
					// 100, 95-99, 90-95
					winOrEw[index + 0].pop();
					winOrEw[index + 2].pop();
					winOrEw[index + 3].pop();

					printResult([a, c, d]);
					continue;
				}

				if (b && c && d) {
					// 100, 95-99, 90-95
					winOrEw[index + 1].pop();
					winOrEw[index + 2].pop();
					winOrEw[index + 3].pop();

					printResult([b, c, d]);
					continue;
				}

				break;
			}
		}

		if (n === 2) {
			--n;
			// 95-90, 80-85
			// 85-90, 80-85
			// 85-90, 75-80
			while (true) {
				index = 0;

				a = winOrEw[index + 2][winOrEw[index + 2].length - 1]; // 95-90
				b = winOrEw[index + 3][winOrEw[index + 3].length - 1]; // 85-90
				c = winOrEw[index + 4][winOrEw[index + 4].length - 1]; // 80-85
				d = winOrEw[index + 5][winOrEw[index + 5].length - 1]; // 75-80

				if (a && c) {
					// 95-90, 80-85						
					winOrEw[index + 2].pop();
					winOrEw[index + 4].pop();

					printResult([a, c]);
					continue;
				}

				if (b && c) {
					// 85-90, 80-85 						
					winOrEw[index + 3].pop();
					winOrEw[index + 4].pop();

					printResult([b, c]);
					continue;
				}

				if (b && d) {
					// 85-90, 75-80						
					winOrEw[index + 3].pop();
					winOrEw[index + 5].pop();

					printResult([b, d]);
					continue;
				}

				break;
			}
		}

		// Remaining 
		var remainingPot = [];
		// 100%, 95-99, 90-95, 85-90, 80-85
		for (var c = 0; c < 5; ++c) {
			for (var i = 0; i < winOrEw[c].length; ++i) {
				remainingPot.push(winOrEw[c].pop());

				--i; // for pop length change
			}
		}

		while (true) {
			if (remainingPot.length > 3) {
				printResult([remainingPot.pop(), remainingPot.pop(), remainingPot.pop(), remainingPot.pop()]);
				continue;
			}

			if (remainingPot.length > 2) {
				printResult([remainingPot.pop(), remainingPot.pop(), remainingPot.pop()]);
				continue;
			}

			if (remainingPot.length > 1) {
				printResult([remainingPot.pop(), remainingPot.pop()]);
				continue;
			}
			break;
		}

		// TV SHOW DB
		for (var c = 0; c < winOrEw.length; ++c) {

			for (var i = 0; i < winOrEw[c].length; ++i) {
				tvShow.push(winOrEw[c].pop());
				--i; // for pop length change
			}
		}
	}

	function losingTvShowGroup() {
		printResult(tvShow);
		tvShow.length = 0;
	}

	function shakthiClassify(input_winOrEwPercentDB) {
		var class_100_100 = [];
		var class_95_99 = [];
		var class_90_94 = [];
		var class_85_89 = [];
		var class_80_84 = [];
		var class_75_79 = [];
		var class_70_74 = [];
		var class_0_69 = [];

		output_winOrEwPercentClass.length = 0;

		for (var i = 0; i < input_winOrEwPercentDB.length; ++i) {
			if (Number(input_winOrEwPercentDB[i].winPercentage) === 100) {
				class_100_100.push(input_winOrEwPercentDB[i]);
			}
			else if (Number(input_winOrEwPercentDB[i].winPercentage) > 94) {
				class_95_99.push(input_winOrEwPercentDB[i]);
			}
			else if (Number(input_winOrEwPercentDB[i].winPercentage) > 89) {
				class_90_94.push(input_winOrEwPercentDB[i]);
			}
			else if (Number(input_winOrEwPercentDB[i].winPercentage) > 84) {
				class_85_89.push(input_winOrEwPercentDB[i]);
			}
			else if (Number(input_winOrEwPercentDB[i].winPercentage) > 79) {
				class_80_84.push(input_winOrEwPercentDB[i]);
			}
			else if (Number(input_winOrEwPercentDB[i].winPercentage) > 74) {
				class_75_79.push(input_winOrEwPercentDB[i]);
			}
			else if (Number(input_winOrEwPercentDB[i].winPercentage) > 69) {
				class_70_74.push(input_winOrEwPercentDB[i]);
			}
			else {
				class_0_69.push(input_winOrEwPercentDB[i]);
			}
		}

		// Shuffle the pots !
		shuffle(class_100_100); // Class 1 - XXXXXX
		shuffle(class_95_99);   // Class 2 - Fold 2
		shuffle(class_90_94);   // Class 3 - Fold 3
		shuffle(class_85_89);   // Class 4 - Fold 4
		shuffle(class_80_84);   // Class 5 - Fold 5
		shuffle(class_75_79);   // Class 6
		shuffle(class_70_74);   // Class 7
		shuffle(class_0_69);    // Class 8

		output_winOrEwPercentClass.push(
			class_100_100,
			class_95_99,
			class_90_94,
			class_85_89,
			class_80_84,
			class_75_79,
			class_70_74,
			class_0_69
		);

		return output_winOrEwPercentClass;
	}

	function dbCollection() {
		// Clean the array
		allWinEachWayPercentRankDB.length = 0;
		allWinOnlyPercentRankDB.length = 0;
		allEachWayPercentRankDB.length = 0;

		twoWayPercentRankDB.length = 0;
		threeWayPercentRankDB.length = 0;
		fourWayPercentRankDB.length = 0;

		allOddRankDB.length = 0;
		allTimeRankDB.length = 0;

		selectedList.length = 0;

		// Browse the object in ascending order / in the order creation 
		for (var key in raceData) {
			if (raceData.hasOwnProperty(key)) {
				// Store as a array instead of object for doing sorting at the later stage
				allWinEachWayPercentRankDB.push([key, raceData[key]]);
				allOddRankDB.push([key, raceData[key]]);
				allTimeRankDB.push([key, raceData[key]]);

				selectedList.push([key, false]);
			}
		}

		// Sort by ascending order of odd value [ex: 10/11  -> 15/2 ]
		allOddRankDB.sort(function (a, b) {
			return Number(a[1].odd.fraction) - Number(b[1].odd.fraction);
		});

		// Sort by descending order of win percentage [100% -> 0%]
		allWinEachWayPercentRankDB.sort(function (a, b) {
			return Number(b[1].winPercentage) - Number(a[1].winPercentage);
		});

		// Sort by ascending order of odd value [ex: 9.30, 10.25, 11.57 ]
		allTimeRankDB.sort(function (a, b) {
			var hrA = Number(a[1].time.slice(0, 2));
			var minA = Number(a[1].time.slice(3, 5));
			var hrB = Number(b[1].time.slice(0, 2));
			var minB = Number(b[1].time.slice(3, 5));

			if (hrA === hrB) {
				return minA < minB ? false : true;
			}
			else if (hrA < hrB) {
				return false;
			}
			else {
				return true;
			}
		});

		for (var i = 0; i < allWinEachWayPercentRankDB.length; ++i) {
			switch (allWinEachWayPercentRankDB[i][1].winType) {
				case 'WIN_ONLY':
					allWinOnlyPercentRankDB.push(allWinEachWayPercentRankDB[i][1]);
					break;
				case 'TWO_PLACES':
					twoWayPercentRankDB.push(allWinEachWayPercentRankDB[i][1]);
					allEachWayPercentRankDB.push(allWinEachWayPercentRankDB[i][1]);
					break;
				case 'THREE_PLACES':
					threeWayPercentRankDB.push(allWinEachWayPercentRankDB[i][1]);
					allEachWayPercentRankDB.push(allWinEachWayPercentRankDB[i][1]);
					break;
				case 'MORE_PLACES':
					fourWayPercentRankDB.push(allWinEachWayPercentRankDB[i][1]);
					allEachWayPercentRankDB.push(allWinEachWayPercentRankDB[i][1]);
					break;
			}
		}
	}

	function populateRaceCard(pageNumber) {
		// Browse the object in Desending order
		// for(var pageNumber = raceData.length - 1; pageNumber >= 0; --pageNumber)
		if (raceData.hasOwnProperty(pageNumber)) {
			var obj = raceData[pageNumber];
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					// alert(prop + " = " + obj[prop]);
					switch (prop) {
						case "time":
							document.getElementById("timeId").value = obj[prop];
							break;
						case "nRunners":
							document.getElementById("nRunnersId").value = obj[prop];
							break;
						case "horse":
							document.getElementById("horseId").value = obj[prop];
							break;
						case "odd":
							document.getElementById("oddId").value = obj[prop].string;
							break;
						case "winPercentage":
							document.getElementById("winPercentageId").value = obj[prop];
							break;
					}
				}
			}
		}
	}

	function editAndUpdate(pageNumber) {
		if (raceData.hasOwnProperty(pageNumber)) {
			var obj = raceData[pageNumber];
			// Browse through all the properties inside an object
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					// alert(prop + " = " + obj[prop]);
					switch (prop) {
						case "time":
							obj[prop] = document.getElementById("timeId").value;
							break;
						case "nRunners":
							obj[prop] = document.getElementById("nRunnersId").value;
							break;
						case "horse":
							obj[prop] = document.getElementById("horseId").value;
							break;
						case "odd":
							obj[prop].string = document.getElementById("oddId").value;
							break;
						case "winPercentage":
							obj[prop] = document.getElementById("winPercentageId").value;
							break;
					}
				}
			}
		}
	}

	function fetchFormValues() {
		timeData = document.getElementById("timeId").value;
		nRunnersData = document.getElementById("nRunnersId").value;
		horseData = document.getElementById("horseId").value;
		winPercentageData = document.getElementById("winPercentageId").value;
		oddData = document.getElementById("oddId").value;
		// oddNumerator = Number(oddData.slice(0,2));
		// oddDenominator = Number(oddData.slice(3,5));
		oddFraction = Number(oddData.slice(0, 2)) / Number(oddData.slice(3, 5));
	}

	function printPrediction() {
		tvShow.length = 0;
		document.getElementById("predictDataId").innerHTML = 'Time	%	Odd' + '<br />';

		document.getElementById("predictDataId").innerHTML += '----------------------' + '<br />' + 'WIN ONLY' + '<br />';
		goldCup(allWinOnlyPercentRankDB);

		document.getElementById("predictDataId").innerHTML += '----------------------' + '<br />' + 'EACH WAY' + '<br />';
		goldCup(allEachWayPercentRankDB);

		document.getElementById("predictDataId").innerHTML += '----------------------' + '<br />' + 'TV SHOW' + '<br />';
		losingTvShowGroup();
	}

	document.getElementById('btnFoldId').onclick = function () {
		dbCollection();

		printPrediction();

		var divForm = document.getElementById('divForm');
		var divSettings = document.getElementById('divSettings');

		divForm.style.display = 'none';
		divSettings.style.display = 'block';
	};

	document.getElementById('btnCloseId').onclick = function () {
		var divForm = document.getElementById('divForm');
		var divSettings = document.getElementById('divSettings');

		divForm.style.display = 'block';
		divSettings.style.display = 'none';
	};

	document.getElementById('btnPrevId').onclick = function () {
		/*
		// Browse the object in ascending order / in the order creation 
		for (var key in raceData) {
		if (raceData.hasOwnProperty(key)) {
		var obj = raceData[key];
		for (var prop in obj) {
		if (obj.hasOwnProperty(prop)) {
		alert(prop + " = " + obj[prop]);
		}
		}
		}
		}
		*/
		var pageNumber = 0;

		if (pageNoCurr) {
			editAndUpdate(pageNoCurr);
			--pageNoCurr;
			pageNumber = pageNoCurr;
		}

		populateRaceCard(pageNumber);
	};

	document.getElementById('btnNextId').onclick = function () {
		if (pageNoCurr === pageNoTotal) {
			fetchFormValues();

			// if(timeData && nRunnersData && horseData && oddData && winPercentageData)
			// if(timeData && horseData && oddData && winPercentageData)
			if (1) {
				// DB: Race meeting 
				raceData.push({
					pageNo: pageNoCurr,
					time: timeData,
					horse: horseData,
					winPercentage: winPercentageData,
					nRunners: nRunnersData,
					winType: winTypeData,
					odd: {
						string: oddData,
						fraction: oddFraction, // Is not possible to use math function directly here ?
					}
				});
				++pageNoCurr;
				pageNoTotal = pageNoCurr;
				clear();
			}
		}
		else if (pageNoCurr === pageNoTotal - 1) {
			// Last page reached
			editAndUpdate(pageNoCurr);
			++pageNoCurr;
			clear();
		}
		else if (pageNoCurr < pageNoTotal) {
			editAndUpdate(pageNoCurr);
			++pageNoCurr;
			populateRaceCard(pageNoCurr);
		}
	};

	/////////////////////////////////////////////// UTILITY FUNCTIONS ///////////////////////////////////////////////////////////

	// Shuffles array
	function shuffle(a) {
		var j, x, i;
		for (i = a.length; i; i--) {
			j = Math.floor(Math.random() * i);
			x = a[i - 1];
			a[i - 1] = a[j];
			a[j] = x;
		}
	}

	// Move the focus to next field when an enter key (#13) has been pressed (behave just like a tab key)
	document.addEventListener('keydown', function (event) {
		if (event.keyCode === 13 && event.target.nodeName === 'INPUT') {
			var form = event.target.form;
			var index = Array.prototype.indexOf.call(form, event.target);
			form.elements[index + 1].focus();
			event.preventDefault();
		}
	});

}); // window.addEventListener('load', function() {