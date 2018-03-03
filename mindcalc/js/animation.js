window.addEventListener('load', function () {
	// localStorage.clear();
	// Global Variables
	var num1 = 0,
		num2 = 0,
		digit_num1 = 2,
		digit_num2 = 2;
	var str_num1 = null,
		str_num2 = null,
		str_digit_num1 = null,
		str_digit_num2 = null;
	var isUserOptionChanged = false;
	var isAutoMode = false,
		flashAnswerNext = false;
	var clrIntrQuest = null;
	var clrIntrAns = null;
	var clrIntrTimer = null;
	var digitalTimerCounter = 0,
		sec = 0,
		timeoutSec = 0,
		timeoutSecConst = 6 * 60;
	var digitalTimerString = '00:00:00';
	var isAnswerVerified = false,
		isEasyMode = false,
		isAudioOff = true;

	var faqAdd = [
		[6, 7, '+'], // [endDigit, endDigit, operator]
		[7, 8, '+'],
		[6, 8, '+'],
	];

	var faqMul = [
		['-', 9, 'X'], // [anyDigit, endDigit, operator]
		['-', 11, 'X'], // Note: Don't use '$' instead of '-' bcos it has spl meaning.
	];

	var operator = '+';
	var tempAry = [];

	var textToSpeech = null;

	timeoutSec = timeoutSecConst;

	// Enum
	var USER_OPTION = {
		ALL_DEFAULT: 'ALL_DEFAULT',
		AUTO_MODE: 'AUTO_MODE',
		TWO_DIGITS_MULT: 'TWO_DIGITS_MULT',
		TWO_DIGITS_SQR: 'TWO_DIGITS_SQR',
		THREE_TWO_DIGITS_ADD: 'THREE_TWO_DIGITS_ADD',
		THREE_SPL_TWO_DIGITS_ADD: 'THREE_SPL_TWO_DIGITS_ADD', // 3 digits multiple of 10 x 2 digits
		VAR_LEN_MULT: 'VAR_LEN_MULT',
		VAR_LEN_ADD: 'VAR_LEN_ADD',
		TWO_DIGITS_SPL: 'TWO_DIGITS_SPL',
		FAQ_ADD_DIGITS: 'FAQ_ADD_DIGITS',
		FAQ_MUL_DIGITS: 'FAQ_MUL_DIGITS',
	};

	// var userOption =  USER_OPTION.THREE_TWO_DIGITS_ADD;
	var userOption = USER_OPTION.ALL_DEFAULT;

	///////////////////////////////////////////////////////////////////////////////////
	// Persistent Data (even after refresh)
	var persistLastSetting = null;
	var testMode = true;
	if (!testMode) {
		persistLastSetting = window.localStorage.getItem("persistLastSetting");
		if (persistLastSetting) {
			var ary = persistLastSetting.split(',');
			userOption = ary[0];
			digit_num1 = parseInt(ary[1]);
			digit_num2 = parseInt(ary[2]);
		} else {
			digit_num1 = 2;
			digit_num2 = 2;
			persistLastSetting = "TWO_DIGITS_MULT,2,2";
			window.localStorage.setItem("persistLastSetting", persistLastSetting);
		}
	} else {
		digit_num1 = 2;
		digit_num2 = 1;
		persistLastSetting = "TWO_DIGITS_MULT,2,2";
	}

	function quest() {
		digitalTimerCounter = 0;
		createQuestion(isUserOptionChanged);
	}

	function createQuestion(isUserOptionChanged) {
		clearAnswer(); // Clear input field

		switch (userOption) {
			case USER_OPTION.FAQ_ADD_DIGITS:
				tempAry = faqAdd[randomRange(0, faqAdd.length - 1)];
				if(isEasyMode)
				{
					num1 = randomRange(0, 9) * 10 + tempAry[0];
					num2 = tempAry[1];
				}
				else
				{
					num1 = randomRange(1, 9) * 10 + tempAry[0];
					num2 = randomRange(1, 9) * 10 + tempAry[1];
				}
				operator = tempAry[2];
				break;
			case USER_OPTION.FAQ_MUL_DIGITS:
				tempAry = faqMul[randomRange(0, faqMul.length - 1)];
				if(tempAry[0]=== '-')
				{
					num1 =  randomRange(10, 99);
				}
				else
				{
					num1 = randomRange(0, 9) * 10 + tempAry[0];
				}
				
				num2 = tempAry[1];
				operator = tempAry[2];
				break;
			case USER_OPTION.THREE_TWO_DIGITS_ADD:
				num1 = randomRange(100, 999);
				num2 = randomRange(10, 99);
				// Persistent Data (even after refresh)
				persistLastSetting = 'THREE_TWO_DIGITS_ADD' + ',' + 3 + ',' + 2; // 2,2 ;
				break;

			case USER_OPTION.THREE_SPL_TWO_DIGITS_ADD:
				num1 = randomRange(10, 99) * 10;
				num2 = randomRange(10, 99);
				// Persistent Data (even after refresh)
				persistLastSetting = 'THREE_SPL_TWO_DIGITS_ADD' + ',' + 3 + ',' + 2; // 2,2 ;
				break;

			case USER_OPTION.ALL_DEFAULT:
				num1 = randomRange(10, 99);
				if (!testMode) num2 = randomRange(10, 99);
				else num2 = randomRange(1, 9);
				// Persistent Data (even after refresh)
				persistLastSetting = 'ALL_DEFAULT' + ',' + 2 + ',' + 2; // 2,2 ;
				break;

			case USER_OPTION.TWO_DIGITS_MULT:
				num1 = randomRange(10, 99);
				num2 = randomRange(10, 99);
				// Persistent Data (even after refresh)
				persistLastSetting = 'TWO_DIGITS_MULT' + ',' + 2 + ',' + 2; // 2,2 ;
				break;

			case USER_OPTION.TWO_DIGITS_SQR:
				num1 = num2 = randomRange(10, 99);
				// Persistent Data (even after refresh)
				persistLastSetting = 'TWO_DIGITS_SQR' + ',' + 2 + ',' + 2; // 2,2 ;
				break;

			case USER_OPTION.TWO_DIGITS_SPL:
				// Persistent Data (even after refresh)
				persistLastSetting = 'TWO_DIGITS_SQR' + ',' + 2 + ',' + 2; // 2,2 ;
				break;

			case USER_OPTION.VAR_LEN_MULT:
				// 0 9
				// 10 99
				// 100 999
				// 1000 9999
				num1 = randomRange(Math.pow(10, digit_num1 - 1), Math.pow(10, digit_num1) - 1);
				num2 = randomRange(Math.pow(10, digit_num2 - 1), Math.pow(10, digit_num2) - 1);
				// Persistent Data (even after refresh)
				persistLastSetting = 'VAR_LEN_MULT' + ',' + str_digit_num1 + ',' + str_digit_num2; // 2,2 ;               
				break;

			case USER_OPTION.VAR_LEN_ADD:
				// 0 9
				// 10 99
				// 100 999
				// 1000 9999
				num1 = randomRange(Math.pow(10, digit_num1 - 1), Math.pow(10, digit_num1) - 1);
				num2 = randomRange(Math.pow(10, digit_num2 - 1), Math.pow(10, digit_num2) - 1);
				// More prossiblities for getting bigger number
				if ((num1 < 5 || !(num1 % 10)) && randomRange(0, 10))
					num1 = randomRange(Math.pow(10, digit_num1 - 1), Math.pow(10, digit_num1) - 1);
				if ((num2 < 5 || !(num2 % 10)) && randomRange(0, 10))
					num2 = randomRange(Math.pow(10, digit_num2 - 1), Math.pow(10, digit_num2) - 1);
				// Persistent Data (even after refresh)
				persistLastSetting = 'VAR_LEN_ADD' + ',' + str_digit_num1 + ',' + str_digit_num2; // 2,2 ;
				break;

			default:
				// error
		}

		var qStr;

		if (userOption == USER_OPTION.FAQ_ADD_DIGITS || userOption == USER_OPTION.FAQ_MUL_DIGITS) {
			if (num1 > num2) qStr = num1.toString() + ' ' + operator + ' ' + num2.toString();
			else qStr = num2.toString() + ' ' + operator + ' ' + num1.toString();
		} else if (userOption == USER_OPTION.VAR_LEN_ADD || userOption == USER_OPTION.THREE_TWO_DIGITS_ADD ||
			userOption == USER_OPTION.THREE_SPL_TWO_DIGITS_ADD) {
			if (num1 > num2) qStr = num1.toString() + ' + ' + num2.toString();
			else qStr = num2.toString() + ' + ' + num1.toString();
		} else {
			if (num1 > num2) qStr = num1.toString() + ' X ' + num2.toString();
			else qStr = num2.toString() + ' X ' + num1.toString();
		}

		document.getElementById("numOne").innerHTML = qStr;
		//document.getElementById("divMainAppId").style.backgroundColor = '#239B56'; // getRandomColor();

		// Text to Speech
		// ref: http://blog.teamtreehouse.com/getting-started-speech-synthesis-api
		// window.speechSynthesis.cancel();
		// textToSpeech = new SpeechSynthesisUtterance(qStr);
		// window.speechSynthesis.speak(textToSpeech);

		if (isUserOptionChanged) {
			isUserOptionChanged = false;
			// Persistent Data (even after refresh)
			window.localStorage.setItem("persistLastSetting", persistLastSetting);
		}
	}

	// Clear Speech Queue
	window.speechSynthesis.cancel();
	createQuestion(false);

	function checkAnswer() {
		var expAns = 0;

		if (userOption == USER_OPTION.FAQ_ADD_DIGITS || userOption == USER_OPTION.FAQ_MUL_DIGITS ) {
			switch (operator) {
				case '+':
					expAns = num1 + num2;
					break;
				case '-':
					expAns = num1 - num2;
					break;
				case 'X':
					expAns = num1 * num2;
					break;
			}
		} else if (userOption == USER_OPTION.VAR_LEN_ADD || userOption == USER_OPTION.THREE_TWO_DIGITS_ADD ||
			userOption == USER_OPTION.THREE_SPL_TWO_DIGITS_ADD) {
			expAns = num1 + num2;
		} else {
			expAns = num1 * num2;
		}

		var eLen = expAns.toString().length;

		// Text to Speech
		// ref: http://blog.teamtreehouse.com/getting-started-speech-synthesis-api
		// window.speechSynthesis.cancel();
		if(isAudioOff)
		{
			textToSpeech = new SpeechSynthesisUtterance(expAns.toString());
			window.speechSynthesis.speak(textToSpeech);
		}

		var ans = 0;
		if (flashAnswerNext) {
			ans = expAns;
			document.getElementById("ansId").value = ans;
			flashAnswerNext = false;
		} else {
			var usrAns = document.getElementById("ansId").value;
			var uLen = usrAns.toString().length;
			ans = parseInt(usrAns);
		}

		if ((userOption == USER_OPTION.VAR_LEN_ADD || userOption == USER_OPTION.THREE_TWO_DIGITS_ADD ||
				userOption == USER_OPTION.THREE_SPL_TWO_DIGITS_ADD) && num1 + num2 === ans) {
			// Tick Mark as HTML entity in UTF-8  ->  &#10004;
			document.getElementById("ansId").value += " " + decodeEntities('&#10004;');
			setAnswerVerified()
		} else if ((userOption != USER_OPTION.VAR_LEN_ADD || userOption != USER_OPTION.THREE_TWO_DIGITS_ADD ||
				userOption != USER_OPTION.THREE_SPL_TWO_DIGITS_ADD) && num1 * num2 === ans) {
			// Tick Mark as HTML entity in UTF-8  ->  &#10004;
			document.getElementById("ansId").value += " " + decodeEntities('&#10004;');
			setAnswerVerified();
		} else if (ans !== expAns && eLen === uLen) {
			// Cross Mark as HTML entity in UTF-8 ->  &#10008;
			document.getElementById("ansId").value += " " + decodeEntities('&#10008;');
			setAnswerVerified();
		}
	}

	function clearAnswer() {
		isAnswerVerified = false;
		document.getElementById("ansId").value = '';
	}

	function setAnswerVerified() {
		isAnswerVerified = true;
	}

	function appendNumPadValue(num) {
		if (-1 === num) {
			clearAnswer();
		} else if (!isAnswerVerified) {
			document.getElementById("ansId").value += num;
			checkAnswer();
		}
	}

	// Number Pad
	document.getElementById('numPadBtn1').onclick = function () {
		appendNumPadValue(1);
	};
	document.getElementById('numPadBtn2').onclick = function () {
		appendNumPadValue(2);
	};
	document.getElementById('numPadBtn3').onclick = function () {
		appendNumPadValue(3);
	};
	document.getElementById('numPadBtn4').onclick = function () {
		appendNumPadValue(4);
	};
	document.getElementById('numPadBtn5').onclick = function () {
		appendNumPadValue(5);
	};
	document.getElementById('numPadBtn6').onclick = function () {
		appendNumPadValue(6);
	};
	document.getElementById('numPadBtn7').onclick = function () {
		appendNumPadValue(7);
	};
	document.getElementById('numPadBtn8').onclick = function () {
		appendNumPadValue(8);
	};
	document.getElementById('numPadBtn9').onclick = function () {
		appendNumPadValue(9);
	};
	document.getElementById('numPadBtn0').onclick = function () {
		appendNumPadValue(0);
	};
	document.getElementById('numPadBtnC').onclick = function () {
		appendNumPadValue(-1);
	};

	document.getElementById('autoModeBtn').onclick = function () {
		if (isAutoMode) {
			isAutoMode = false;
			clearInterval(clrIntrQuest);
			clearInterval(clrIntrAns);
			clearInterval(clrIntrTimer);
			document.getElementById("timer").innerHTML = "";

			cancelAnimationFrame(reqAnimatId);
		} else {
			isAutoMode = true;
			clearInterval(clrIntrQuest);
			clearInterval(clrIntrAns);
			clearInterval(clrIntrTimer);

			clearAnswer();
			document.getElementById("timer").innerHTML = "";
			autoMode();
		}
	}

	// Auto Mode
	function autoMode() {
		digitalTimerCounter = 0;
		requestAnimationFrame(repeatOften);
	}

	function repeatOften() {
		if (digitalTimerCounter === timeoutSec) // 60*6
		{
			flashAnswerNext = true;
			checkAnswer(); // fill and check answer
		} else if (digitalTimerCounter > timeoutSec + 120) // 60*8
		{
			digitalTimerCounter = 0;
			quest();
		}
		++digitalTimerCounter;
		var milliSec = digitalTimerCounter % 60;
		var sec = Math.floor(digitalTimerCounter / 60) % 60;
		var min = Math.floor(digitalTimerCounter / (60 * 60)) % 60;
		digitalTimerString = (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec) + ':' + (milliSec < 10 ? '0' + milliSec : milliSec);

		document.getElementById("timer").innerHTML = digitalTimerString;
		reqAnimatId = requestAnimationFrame(repeatOften);
	}

	var btnNext = document.getElementById('btnNext');
	btnNext.onclick = function () {
		clearAnswer();
		flashAnswerNext = true;
		checkAnswer(); // fill and check answer
		setTimeout(function () {
			quest();
		}.bind(this), 1000);
	};

	var btnEasyMode = document.getElementById('btnIdEasyMode');
	btnEasyMode.onclick = function () {
		if(isEasyMode)
		{
			isEasyMode = false;
		}
		else
		{
			isEasyMode = true;
		}
	};

	var btnEasyMode = document.getElementById('btnIdAudioOff');
	btnEasyMode.onclick = function () {
		if(isAudioOff)
		{
			isAudioOff = false;
		}
		else
		{
			isAudioOff = true;
		}
	};

	var btnHide = document.getElementById('btnIdHide');
	btnHide.onclick = function () {
		var divMainApp = document.getElementById('divMainAppId');
		var divHide = document.getElementById('hideDiv');

		if (!divHide.style.display || divHide.style.display === 'none') {
			divHide.style.display = 'block';
			divMainApp.style.display = 'none';
		} else {
			divHide.style.display = 'none';
			divMainApp.style.display = 'block';
		}
	};

	// Settings Panel
	var btnSet = document.getElementById('btnOpenSettings');
	btnSet.onclick = function () {
		// Disable Variable Length Multiply / Add input fields 
		document.getElementById("digitFirst_mul").disabled = true;
		document.getElementById("digitSecond_mul").disabled = true;
		document.getElementById("digitFirst_add").disabled = true;
		document.getElementById("digitSecond_add").disabled = true;

		var div = document.getElementById('settingsDiv');
		var divMain = document.getElementById('divMainAppId');

		if (!div.style.display || div.style.display === 'none') {
			div.style.display = 'block';
			divMain.style.display = 'none';
		} else {
			div.style.display = 'none';
		}
	};

	var btnSave = document.getElementById('btnSaveSettings');
	btnSave.addEventListener('click', function () {
		var div = document.getElementById('settingsDiv');
		var divMain = document.getElementById('divMainAppId');
		if (!div.style.display || div.style.display === 'none') {
			div.style.display = 'block';
		} else {
			divMain.style.display = 'block';
			div.style.display = 'none';
			// Check the Radio Buttons
			var radios = document.getElementsByName("modeRadio");
			for (var i = 0; i < radios.length; i++) {
				if (radios[i].checked) {
					userOption = radios[i].value;
					break;
				}
			}

			if (userOption == 'VAR_LEN_MULT') {
				// Get the User setting values
				str_digit_num1 = document.getElementById("digitFirst_mul").value;
				str_digit_num2 = document.getElementById("digitSecond_mul").value;
				digit_num1 = parseInt(str_digit_num1);
				digit_num2 = parseInt(str_digit_num2);
				if (!Number.isInteger(digit_num1) || !Number.isInteger(digit_num2)) {
					digit_num1 = digit_num2 = 2;
					userOption = 'TWO_DIGITS_MULT';
				}
			} else if (userOption == 'VAR_LEN_ADD') {
				// Get the User setting values
				str_digit_num1 = document.getElementById("digitFirst_add").value;
				str_digit_num2 = document.getElementById("digitSecond_add").value;
				digit_num1 = parseInt(str_digit_num1);
				digit_num2 = parseInt(str_digit_num2);
				if (!Number.isInteger(digit_num1) || !Number.isInteger(digit_num2)) {
					digit_num1 = digit_num2 = 2;
					userOption = 'TWO_DIGITS_ADD';
				}
			}

			var timeValue = parseInt(document.getElementById("autoTimerInput").value);
			if (Number.isInteger(timeValue)) {
				timeoutSec = timeValue * 60;
			} else {
				timeoutSec = timeoutSecConst;
			}

			isUserOptionChanged = true;
			createQuestion(isUserOptionChanged);
		}
	});

	userRadioOption = function (radioOption) {
		userOption = radioOption.value;

		document.getElementById("digitFirst_mul").disabled = true;
		document.getElementById("digitSecond_mul").disabled = true;
		document.getElementById("digitFirst_add").disabled = true;
		document.getElementById("digitSecond_add").disabled = true;

		if (userOption == 'VAR_LEN_MULT') {
			document.getElementById("digitFirst_mul").disabled = false;
			document.getElementById("digitSecond_mul").disabled = false;
		} else if (userOption == 'VAR_LEN_ADD') {
			document.getElementById("digitFirst_add").disabled = false;
			document.getElementById("digitSecond_add").disabled = false;
		}
	}

	////////////////////////////////////////////////////////////////////////////////////////////
	// Utility Functions    
	function randomRange(min, max) {
		return ~~(Math.random() * (max - min + 1)) + min
	}

	function getRandomColor() {
		/*
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++ ) {
		color += letters[Math.floor(Math.random() * 16)];
		}   
		return color;
		*/
		// Ref: http://htmlcolorcodes.com/
		var color = [
			'#C70039', '#FF5733', '#FFC30F', '#808000',
			'#008080',
			'#B9770E',
			'#239B56',

			'#616A6B',
			'#1F618D',

			'#CD5C5C',
			'#AF7AC5', '#2980B9', '#45B39D', '#B7950B'
		];
		return color[Math.floor(Math.random() * color.length)];
	}

	// Decode the HTML elements (hex value of unicode like tick, cross marks) as text
	// ref: https://stackoverflow.com/questions/5796718/html-entity-decode
	var decodeEntities = (function () {
		// this prevents any overhead from creating the object each time
		var element = document.createElement('div');

		function decodeHTMLEntities(str) {
			if (str && typeof str === 'string') {
				// strip script/html tags
				str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
				str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
				element.innerHTML = str;
				str = element.textContent;
				element.textContent = '';
			}
			return str;
		}
		return decodeHTMLEntities;
	})();


	// I can't use a script tag in this example
	// var text = decodeEntities('<strong>sri &#10004; I&apos;m safer &amp; faster than using jQuery!</strong>');      
	// document.write(text);

}); // window.addEventListener('load', function() {