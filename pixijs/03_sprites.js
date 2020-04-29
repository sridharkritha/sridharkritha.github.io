// NOTE: File access(images) are allowed through web server so run local HTTP server.
// http-server -c-1
// If HTTP server is NOT installed then install by
// npm install -g http-server 

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
		
		// Load and Converts image into texture format 
		// Pixi renders the image on the GPU with WebGL, the image needs to be in a format that the GPU can process. 
		// A WebGL-ready image is called a texture. 
		PIXI.loader
		//.add([ "./assets/cat.png"])
			.add(["./assets/cat.png", "./assets/texturepacked/treasureHunter.json"])
			// .add(["./assets/texturepacked/treasureHunter.json"])
			.load(setup); // call the `setup` function when loading and conversion has completed


	}
	
	
	//This `setup` function will run when the image has loaded
	function setup() {
		// Create the cat sprite from texture format
		//  it’s always best to make a sprite from a texture
		let cat = new PIXI.Sprite(PIXI.loader.resources["./assets/cat.png"].texture); // texture NOT textures
		

		//Change the sprite's position
		cat.x = 96;
		cat.y = 96;	  
		//Change the sprite's size
		cat.width = 80;
		cat.height = 120;
		//scale to doubled the size
		cat.scale.x = 0.5;
		cat.scale.y = 0.5;
		// Rotation
		// cat.rotation = 0.5; // Rotate clockwise and the Pivot at (0,0) top left 
		cat.pivot.set(64/2, 64/2); // Pivot point moved to (64/2, 64/2)  center of an image of 64x64
		cat.rotation = 0.5; // PRotate clockwise and the Pivot at (32,32) center of an image

		// Anything you want to be made visible in the renderer that has to be added to a special Pixi object called the "stage".
		// "stage" is a Pixi Container object. 
		// "stage" object is the root container for all the visible things in your scene. 
		app.stage.addChild(cat); // Add the cat to the stage.

		var frameFromTextureAtlas = new PIXI.Sprite(PIXI.loader.resources["./assets/texturepacked/treasureHunter.json"].textures["explorer.png"]); // textures NOT texture
		app.stage.addChild(frameFromTextureAtlas); // Add the image to the stage.


		// app.stage.removeChild(cat); // to remove a sprite from the stage
		// cat.visible = false; // hide the sprite (for efficient)
	}
}, false);





/**
 * app   - canvas / renderer
 * stage - root container on top of canvas -->
 */



