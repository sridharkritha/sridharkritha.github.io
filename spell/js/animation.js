window.addEventListener('load', function () {
	var running = false;
	var wordCount = wordList.length;
	var wordDelay = 2000;
	var clearIntervalHandle = null;
	var utterThis = null;

	startSpeaking = function() {
		var word = wordList[Math.floor(Math.random() * wordCount)];     // 0 to wordCount - 1

		window.speechSynthesis.cancel();
		utterThis  = new SpeechSynthesisUtterance(word);

		utterThis.addEventListener('boundary', function(event) { 
			console.log(event.name + ' boundary reached after ' + event.elapsedTime + ' milliseconds.');
			if(running) {
				clearInterval(clearIntervalHandle);
				clearIntervalHandle = setTimeout(function() { this.startSpeaking(); }, wordDelay);
			} 
		});

		window.speechSynthesis.speak(utterThis );
	};

	// Stop button
	document.getElementById('stop').onclick = function () { running = false; };

	// speak button
	document.getElementById('speak').onclick = function () {
		if(!running) {
			running = true;
			startSpeaking();
		}
	};


}); // window.addEventListener('load', function() {