window.addEventListener('load', function () 
{
	/*
	1. Grouping 100% chance winners
	2. Grouping one half 100% winners and another half 90% winners
	3. 2 folds -> 100% + (90 - 95)%
	4. 3 folds -> 100% + 100% + (90 - 95)%
	5. 4 folds -> 100% + 100% + 100% + (90 - 95)%
	6. 5 folds -> 100% + 100% + 100% + (90 - 95)% + (80 - 90)%

	Note: 
	1. EW can't be folder in Win only
	*/

	var raceData = [];
	var pageNoCurr = 0; // current page number
	var pageNoTotal = 0; // total page numbers
	var prevPosition = 0;
	// Enum - Win Type
	var WIN_TYPE = {
		WIN_ONLY		: 'WIN_ONLY',           
		TWO_PLACES		: 'TWO_PLACES',	     
		THREE_PLACES	: 'THREE_PLACES',     
		FOUR_PLACES		: 'FOUR_PLACES',       
		FIVE_PLACES		: 'FIVE_PLACES',       
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

	function populateRaceCard(key) 
	{
		// Browse the object in Desending order
		// for(var key = raceData.length - 1; key >= 0; --key)
		if (raceData.hasOwnProperty(key)) 
		{
			var obj = raceData[key];
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

	document.getElementById('btnFoldId').onclick = function () {};

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
		var key = 0;

		if (pageNoCurr) 
		{
			--pageNoCurr;
			key = pageNoCurr;
		}

		populateRaceCard(key);
	};

	document.getElementById('btnNextId').onclick = function () 
	{
		if (pageNoCurr === pageNoTotal) 
		{
			timeData = document.getElementById("timeId").value;
			nRunnersData = document.getElementById("nRunnersId").value;
			horseData = document.getElementById("horseId").value;
			winPercentageData = document.getElementById("winPercentageId").value;
			oddData = document.getElementById("oddId").value;			
			// oddNumerator = Number(oddData.slice(0,2));
			// oddDenominator = Number(oddData.slice(3,5));
			oddFraction = Number(oddData.slice(0,2)) / Number(oddData.slice(3,5));
			if(timeData && nRunnersData && horseData && oddData && winPercentageData)
			{
				// DB: Race meeting 
				raceData.push({
					pageNo:pageNoCurr,
					time: timeData,
					horse: horseData,
					odd: {
						string: oddData,
						fraction: oddFraction,
					},					
					winPercentage: winPercentageData,
					nRunners: nRunnersData,
					winType: winTypeData		
					
				});
				++pageNoCurr;
				pageNoTotal = pageNoCurr;
				clear();
			}
		}
		else if (pageNoCurr === pageNoTotal - 1) 
		{
			// Last page reached
			++pageNoCurr;
			clear();
		} 
		else if (pageNoCurr < pageNoTotal) 
		{
			++pageNoCurr;
			populateRaceCard(pageNoCurr);
		}
	};
}); // window.addEventListener('load', function() {