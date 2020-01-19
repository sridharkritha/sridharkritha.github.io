window.addEventListener('load', function () {

	var decodeEntities = (function () { })();


	// Number Pad
	document.getElementById('speak').onclick = function () {

		var qStr = "Jay is going to do show and tell tomorrow.";
			window.speechSynthesis.cancel();
			textToSpeech = new SpeechSynthesisUtterance(qStr);
			window.speechSynthesis.speak(textToSpeech);
	};


}); // window.addEventListener('load', function() {