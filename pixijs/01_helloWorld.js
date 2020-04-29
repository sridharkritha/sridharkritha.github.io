window.addEventListener('load', function () {
	// Global variables
	let app = null;

	init();

	function init() {
		let type = "WebGL"
		if(!PIXI.utils.isWebGLSupported()) { type = "canvas" }

		PIXI.utils.sayHello(type); // prints in console

		//Create a Pixi Application
		app = new PIXI.Application({width: 256, height: 256}); // produces a black 256 pixel by 256 pixel canvas element

		//Add the canvas that Pixi automatically created for you to the HTML document
		document.body.appendChild(app.view);
	}

}, false);