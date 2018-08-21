// Ref: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
// http://blog.teamtreehouse.com/cross-domain-messaging-with-postmessage
// https://www.dyn-web.com/tutorials/iframes/postmessage/access/parent.php

// Cross-window messaging / postMessage: Allows windows to talk to each other no matter which origin they are from.

window.addEventListener('load', function() {
	// RECEIVE msg:  iFrame(Child) to Parent
	var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
	var eventer = window[eventMethod];
	var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

	// Listen to message from child window
	eventer(messageEvent,function(e) {
		var key = e.message ? "message" : "data";
		var data = e[key];

		// Get a reference to the <div> on the page that will display the message text.
		var messageEle = document.getElementById('localMessageId');
		// Update the div element to display the message.
		messageEle.innerHTML += data;
	},false);

	//SEND mg: Parent to Child (iFrame)
	document.getElementById('buttonId').onclick = function ()
	{
		var someText; 
		someText = document.getElementById("inputId").value;
		someText = "I'm from parent page: "+ someText;
		window.frames[0].postMessage(someText, '*');
	};

	// Create and append iFrame inside the parent
	function init()
	{
		iFramePage = document.createElement("IFRAME");
		iFramePage.src = "./externalDomain/externalPage.html";
		iFramePage.width = "1000px";
		iFramePage.height = "500px";
		document.body.appendChild(iFramePage);
	}
	init();
});