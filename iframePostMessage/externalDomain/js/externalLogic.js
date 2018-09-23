window.addEventListener('load', function () {
	//SEND mg: Child (iFrame) to Parent
	document.getElementById('externalButtonId').onclick = function () {
		var someText;
		someText = document.getElementById("externalInputId").value;
		someText = "I'm from external page: "+ someText;
		parent.postMessage(someText, "*"); // `*` on any domain; parent.postMessage(someText, "http://s.codepen.io");
	};

	// RECEIVE msg:  Parent to iFrame(Child)
	function receiveMessage(e) {
		// Check to make sure that this message came from the correct domain.
		// if (e.origin !== "http://s.codepen.io") return;

		// Get a reference to the <div> on the page that will display the message text.
		var messageEle = document.getElementById('externalMessageId');

		// Update the div element to display the message.
		messageEle.innerHTML += e.data;
	}

	// Setup an event listener that calls receiveMessage() when the window
	// receives a new MessageEvent.
	window.addEventListener('message', receiveMessage);
});