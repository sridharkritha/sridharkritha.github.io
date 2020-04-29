window.addEventListener('load', function () {
	// Global variables
	let app = null;

	init();


	function init() {
		//Create a Pixi Application
		app = new PIXI.Application({
			// produces a black 256 pixel by 256 pixel canvas element
											width: 256,         // default: 800   
											height: 256,        // default: 600
											antialias: true,    // default: false
											transparent: false, // default: false / show canvas
											resolution: 1,      // default: 1
											forceCanvas: false	// default WebGL
										 }); 
										 
		app.renderer.backgroundColor = 0x061639; // change the canvas(renderer) background colour to blue
		// app.renderer.autoResize = true; // automatically change the screen resolution according to the canvas size	
		// app.renderer.resize(512, 512); // change the canvas size
	
		// canvas to fill the entire window and use css to style them 
		app.renderer.view.style.position = "absolute";
		app.renderer.view.style.display = "block";
		app.renderer.autoResize = true;
		app.renderer.resize(window.innerWidth, window.innerHeight);
	
		//Add the canvas that Pixi automatically created for you to the HTML document
		document.body.appendChild(app.view);
	}

}, false);