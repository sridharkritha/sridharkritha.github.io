window.addEventListener('load', function () {

	var decodeEntities = (function () { })();


	// Number Pad
	document.getElementById('speak').onclick = function () {
		var wordCount = wordList.length;
		var clearIntervalHandle = null;

		clearInterval(clearIntervalHandle)
		clearIntervalHandle = setInterval(() => {
			var word = wordList[Math.floor(Math.random() * wordCount)];     // 0 to wordCount - 1
			window.speechSynthesis.cancel();
			textToSpeech = new SpeechSynthesisUtterance(word);
			window.speechSynthesis.speak(textToSpeech);
		}, 1000);

		// var qStr = "Jay is going to do show and tell tomorrow.";

	};


}); // window.addEventListener('load', function() {