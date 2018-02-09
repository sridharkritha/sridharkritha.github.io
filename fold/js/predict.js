window.addEventListener('load', function () 
{
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

	////////////////////////////////////////////////////////////
	var winOnlyClass_100_100 = []; // Class 1 - XXXXXX
	var winOnlyClass_95_99   = []; // Class 2 - Fold 2
	var winOnlyClass_90_94   = []; // Class 3 - Fold 3
	var winOnlyClass_85_89   = []; // Class 4 - Fold 4
	var winOnlyClass_80_84   = []; // Class 5 - Fold 5
	////////////////////////////////////////////////////
	var winOnlyClass_75_79   = []; // Class 6
	var winOnlyClass_70_74   = []; // Class 7
	var winOnlyClass_0_69    = []; // Class 8
	////////////////////////////////////////////////////////////
	
	var selectedList = [];

	// Enum - Win Type
	var WIN_TYPE = {
		WIN_ONLY		: 'WIN_ONLY',
		TWO_PLACES		: 'TWO_PLACES',
		THREE_PLACES	: 'THREE_PLACES',
		MORE_PLACES		: 'MORE_PLACES',
	};	
	var winTypeData = WIN_TYPE.WIN_ONLY;

	// Enum - Fold Type
	var FOLD_TYPE = {
		TWO_FOLD	 :'TWO_FOLD',
		THREE_FOLD	 :'THREE_FOLD',
		FOUR_FOLD	 :'FOUR_FOLD',
		FIVE_FOLD	 :'FIVE_FOLD',
	};
	var foldTypeData = FOLD_TYPE.TWO_FOLD;

	winTypeRadioOption = function (radioOption) 
	{
		winTypeData = radioOption.value;
	}

	foldTypeRadioOption = function (radioOption) 
    {
		foldTypeData = radioOption.value;
	}

	showValue = function (newValue, slide)
	{
		document.getElementById(slide).innerHTML=newValue;
	}

	function clear() 
	{
		document.getElementById("timeId").value = '';
		document.getElementById("horseId").value = '';
		document.getElementById("oddId").value = '';
		document.getElementById("winPercentageId").value = '';
		document.getElementById("nRunnersId").value = '';
		document.getElementById("winPercentageId").value = document.getElementById("sliderID").innerHTML = '50';
	}

	//2 folds -> 100% + (90 - 95)%
	function winOnlyTwoFold()
	{
		selectedList

		for(var i = 0; i < allWinEachWayPercentRankDB.length; ++i)
		{
			// document.getElementById("predictDataId").innerHTML += allWinEachWayPercentRankDB[i][1].time + '	' 
			// + allWinEachWayPercentRankDB[i][1].winPercentage + '	' 
			// 	+ allWinEachWayPercentRankDB[i][1].odd.string + '<br />';
			document.getElementById("predictDataId").innerHTML += allWinOnlyPercentRankDB[i][1].time + '	' 
			+ allWinOnlyPercentRankDB[i][1].winPercentage + '	' 
				+ allWinOnlyPercentRankDB[i][1].odd.string + '<br />';
		}
	}

	function classify()
	{
		/*
		3. 2 folds -> 100% + (90 - 95)%
		4. 3 folds -> 100% + 100% + (90 - 95)%
		5. 4 folds -> 100% + 100% + (90 - 95)% + (90 - 95)%
		6. 5 folds -> 100% + 100% + 100% + (90 - 95)% + (80 - 90)%
		*/
		////////////////////////////////////////////////////////////
		winOnlyClass_100_100.length = 0; // Class 1 - XXXXXX
		winOnlyClass_95_99.length = 0;   // Class 2 - Fold 2
		winOnlyClass_90_94.length = 0;   // Class 3 - Fold 3
		winOnlyClass_85_89.length = 0;   // Class 4 - Fold 4
		winOnlyClass_80_84.length = 0;   // Class 5 - Fold 5
		////////////////////////////////////////////////////////////
		winOnlyClass_75_79.length = 0;   // Class 6
		winOnlyClass_70_74.length = 0;   // Class 7
		winOnlyClass_0_69.length = 0;    // Class 8
		////////////////////////////////////////////////////////////

		
		for(var i = 0; i < allWinOnlyPercentRankDB.length; ++i)
		{
			if(Number(allWinOnlyPercentRankDB[i].winPercentage) === 100)
			{
				winOnlyClass_100_100.push(allWinOnlyPercentRankDB[i]);
			}
			else if(Number(allWinOnlyPercentRankDB[i].winPercentage) > 94)
			{
				winOnlyClass_95_99.push(allWinOnlyPercentRankDB[i]);
			}
			else if(Number(allWinOnlyPercentRankDB[i].winPercentage) > 89)
			{
				winOnlyClass_90_94.push(allWinOnlyPercentRankDB[i]);
			}
			else if(Number(allWinOnlyPercentRankDB[i].winPercentage) > 84)
			{
				winOnlyClass_85_89.push(allWinOnlyPercentRankDB[i]);
			}
			else if(Number(allWinOnlyPercentRankDB[i].winPercentage) > 79)
			{
				winOnlyClass_80_84.push(allWinOnlyPercentRankDB[i]);
			}
			else if(Number(allWinOnlyPercentRankDB[i].winPercentage) > 74)
			{
				winOnlyClass_75_79.push(allWinOnlyPercentRankDB[i]);
			}
			else if(Number(allWinOnlyPercentRankDB[i].winPercentage) > 69)
			{
				winOnlyClass_70_74.push(allWinOnlyPercentRankDB[i]);
			}
			else
			{
				winOnlyClass_0_69.push(allWinOnlyPercentRankDB[i]);
			}			
		}
	}

	function dbCollection()
	{
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
		for (var key in raceData) 
		{
			if (raceData.hasOwnProperty(key)) 
			{
				// Store as a array instead of object for doing sorting at the later stage
				allWinEachWayPercentRankDB.push([key, raceData[key]]);
				allOddRankDB.push([key, raceData[key]]);
				allTimeRankDB.push([key, raceData[key]]);

				selectedList.push([key, false]);				
			}
		}

		// Sort by ascending order of odd value [ex: 10/11  -> 15/2 ]
		allOddRankDB.sort(function(a, b) 
		{			
			return Number(a[1].odd.fraction) - Number(b[1].odd.fraction);
		});

		// Sort by descending order of win percentage [100% -> 0%]
		allWinEachWayPercentRankDB.sort(function(a, b) 
		{			
			return Number(b[1].winPercentage) - Number(a[1].winPercentage);
		});

		// Sort by ascending order of odd value [ex: 9.30, 10.25, 11.57 ]
		allTimeRankDB.sort(function(a, b) 
		{
			var hrA = Number(a[1].time.slice(0,2));
			var minA = Number(a[1].time.slice(3,5));
			var hrB = Number(b[1].time.slice(0,2)); 
			var minB = Number(b[1].time.slice(3,5));

			if(hrA === hrB)
			{
				return minA < minB ? false :  true;			
			}
			else if(hrA < hrB)
			{
				return false;
			}
			else
			{
				return true;
			}
		});

		for(var i = 0; i < allWinEachWayPercentRankDB.length; ++i)
		{
			switch(allWinEachWayPercentRankDB[i][1].winType)
			{
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
		classify();
	}

	function populateRaceCard(pageNumber) 
	{
		// Browse the object in Desending order
		// for(var pageNumber = raceData.length - 1; pageNumber >= 0; --pageNumber)
		if (raceData.hasOwnProperty(pageNumber)) 
		{
			var obj = raceData[pageNumber];
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop)) 
				{
					// alert(prop + " = " + obj[prop]);
					switch (prop) 
					{
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
							document.getElementById("oddId").value = obj[prop];
							break;
						case "winPercentage":
							document.getElementById("winPercentageId").value = obj[prop];
							break;
					}
				}
			}
		}
	}

	function editAndUpdate(pageNumber)
	{
		if (raceData.hasOwnProperty(pageNumber)) 
		{
			var obj = raceData[pageNumber];
			// Browse through all the properties inside an object
			for (var prop in obj) 
			{
				if (obj.hasOwnProperty(prop)) 
				{
					// alert(prop + " = " + obj[prop]);
					switch (prop) 
					{
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
							obj[prop] = document.getElementById("oddId").value;
							break;
						case "winPercentage":
							obj[prop] = document.getElementById("winPercentageId").value;
							break;
					}
				}
			}
		}
	}

	function fetchFormValues() 
	{
		timeData = document.getElementById("timeId").value;
		nRunnersData = document.getElementById("nRunnersId").value;
		horseData = document.getElementById("horseId").value;
		winPercentageData = document.getElementById("winPercentageId").value;
		oddData = document.getElementById("oddId").value;
		// oddNumerator = Number(oddData.slice(0,2));
		// oddDenominator = Number(oddData.slice(3,5));
		oddFraction = Number(oddData.slice(0, 2)) / Number(oddData.slice(3, 5));
	}

	function printPrediction()
	{
		document.getElementById("predictDataId").innerHTML = 'Time	%	Odd' + '<br />';

		winOnlyTwoFold();

		// for(var i = 0; i < allWinEachWayPercentRankDB.length; ++i)
		// {
		// 	document.getElementById("predictDataId").innerHTML += allWinEachWayPercentRankDB[i][1].time + '	' 
		// 	+ allWinEachWayPercentRankDB[i][1].winPercentage + '	' 
		// 		+ allWinEachWayPercentRankDB[i][1].odd.string + '<br />';
		// }
	}

	document.getElementById('btnFoldId').onclick = function () 
	{
		dbCollection();
		printPrediction();

		var divForm = document.getElementById('divForm');
		var divSettings = document.getElementById('divSettings');

		divForm.style.display = 'none';
		divSettings.style.display = 'block';
	};

	document.getElementById('btnCloseId').onclick = function () 
	{
		var divForm = document.getElementById('divForm');
		var divSettings = document.getElementById('divSettings');

		divForm.style.display = 'block';
		divSettings.style.display = 'none';
	};

	document.getElementById('btnPrevId').onclick = function () 
	{
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

		if (pageNoCurr) 
		{
			editAndUpdate(pageNoCurr);
			--pageNoCurr;
			pageNumber = pageNoCurr;
		}

		populateRaceCard(pageNumber);
	};

	document.getElementById('btnNextId').onclick = function () 
	{
		if (pageNoCurr === pageNoTotal) 
		{
			fetchFormValues();			

			// if(timeData && nRunnersData && horseData && oddData && winPercentageData)
			if(1)
			{
				// DB: Race meeting 
				raceData.push({
					pageNo:pageNoCurr,
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
		else if (pageNoCurr === pageNoTotal - 1) 
		{
			// Last page reached
			editAndUpdate(pageNoCurr);
			++pageNoCurr;
			clear();
		} 
		else if (pageNoCurr < pageNoTotal) 
		{	
			editAndUpdate(pageNoCurr);		
			++pageNoCurr;
			populateRaceCard(pageNoCurr);			
		}
	};

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