window.addEventListener('load', function () {
	var running = false;
	var wordCount = wordList.length;
	var wordDelay = 2000;
	var clearIntervalHandle = null;
	var utterThis = null;
	var isRandomMode = false;
	var index = 0;

	getWord = function() {
		var word;
		if(isRandomMode)
		{
			word = wordList[Math.floor(Math.random() * wordCount)];     // 0 to wordCount - 1
		}
		else
		{
			// this.index = this.index++;
			// index = (index++) % wordCount;
			index = index % wordCount;
			word = wordList[index];
			index = index + 1;
		}
		return word;
	};

	startSpeaking = function() {
		window.speechSynthesis.cancel();
		utterThis  = new SpeechSynthesisUtterance(this.getWord());

		utterThis.addEventListener('boundary', function(event) { 
			console.log(event.name + ' boundary reached after ' + event.elapsedTime + ' milliseconds.');
			clearInterval(clearIntervalHandle);
			if(running) {
				clearIntervalHandle = setTimeout(function() { this.startSpeaking(); }, wordDelay);
			} 
		});

		window.speechSynthesis.speak(utterThis );
	};

	// Stop button
	document.getElementById('stop').onclick = function () { running = false; };

	// Next button
	document.getElementById('next').onclick = function () {
		running = false; startSpeaking(); };

	// Auto speak button
	document.getElementById('speak').onclick = function () {
		if(!running) {
			running = true;
			startSpeaking();
		}
	};

	// Speak in random order
	document.getElementById('btnIdRandomMode').onclick = function () {
		isRandomMode = isRandomMode ? isRandomMode = false : isRandomMode = true; // toggle
	};

	// Text Area
	document.getElementById('txtArea').onkeypress = function (event) {
		// Enter key code is 13
		if (event.keyCode == 13 && !event.shiftKey) {
			running = false;
			startSpeaking();
		}
	};

}); // window.addEventListener('load', function() {