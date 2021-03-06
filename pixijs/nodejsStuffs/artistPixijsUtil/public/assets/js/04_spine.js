// NOTE: File access(images) are allowed through web server so run local HTTP server.
// http-server -c-1
// If HTTP server is NOT installed then install by
// npm install -g http-server 
// run the example
// http://127.0.0.1:8080/00_index.html

// ref: https://pixijs.io/examples/#/plugin-spine/spineboy.js
// https://github.com/pixijs/examples/blob/gh-pages/examples/js/plugin-spine/spineboy.js

// window.addEventListener('load', function () {

	// Global variables
	let app = null;

	// init();

	var spinRef = null;

	function init(spineJsonUrl) {
		 app = new PIXI.Application( {
			// produces a black 256 pixel by 256 pixel canvas element
											width: window.innerWidth,         // default: 800   
											height: 512 // window.innerHeight / 2,        // default: 600
											// antialias: true,    // default: false
											// transparent: false, // default: false / show canvas
											// resolution: 1,      // default: 1
											// forceCanvas: false	// default WebGL
										 }
		 );
		document.body.appendChild(app.view);

		var fileNameFromPath = spineJsonUrl.replace(/^.*[\\\/]/, ''); // extract the last file name part from the full path
		var arr = fileNameFromPath.split(".");
		var fileNameWithoutExt = arr[0] + '-' + Date.now(); // file name without extension
		// fileNameWithoutExt = spineJsonUrl.replace(/[\.\/]/g, '_'); // replace '/' [OR] '.' by '-' 
		var extension = arr[1];

		if(extension === 'json') {
			spinRef = fileNameWithoutExt;
		}


		// load spine data
		//PIXI.loaders.shared
		app.loader
			// .add('spineboy', './assets/spineAnimation/spineboy/spineboy.json')
			.add(fileNameWithoutExt, spineJsonUrl)
			.load(onAssetsLoaded);
	}

	function animationButton(spineBoy, animationName) {
		var button = document.createElement('button');
		button.innerHTML = "  " + animationName + "  "; // 'click me';
		button.onclick = function(){
			//alert('here be dragons');
			//spineBoy.state.setAnimation(0, 'jump', false);
			//spineBoy.state.addAnimation(0, 'walk', true, 0);
			spineBoy.state.addAnimation(0, animationName, true, 0);
			return false;
		};
		document.body.appendChild(button);
	}
	
	function onAssetsLoaded(loader, res) {
		// create a spine boy
		//  const spineBoy = new PIXI.spine.Spine(res.spineboy.spineData);
		const spineBoy = new PIXI.spine.Spine(res[spinRef].spineData);

		 var listAnimations = [];
		 var nAnimations = 0;
		 var animationName = null;
		 for(var i = 0, nAnimations = spineBoy.spineData.animations.length; i < nAnimations; ++i) {
			 console.log(spineBoy.spineData.animations[i].name);
			 animationName = spineBoy.spineData.animations[i].name;

			 
			if(nAnimations > 1) {
				animationButton(spineBoy, animationName);
			}
		 }


		// set the position
		// spineBoy.x = app.screen.width / 2;
		// spineBoy.y = app.screen.height;

		spineBoy.x = app.screen.width / 4 - 40;  //500;
		spineBoy.y = 0 ; //500;
	
		// spineBoy.scale.set(1.5);


		 if(animationName) {
			// play animation forever, little boy!
			spineBoy.state.setAnimation(0, animationName, true);
		 }

		 app.stage.addChild(spineBoy);


		 // requestForDeletingOldFiles();
		
	


		
	/*
		// set up the mixes!
		spineBoy.stateData.setMix('walk', 'jump', 0.2);
		spineBoy.stateData.setMix('jump', 'walk', 0.4);
	
		// play animation
		spineBoy.state.setAnimation(0, 'walk', true);
	
		app.stage.addChild(spineBoy);
	
		app.stage.interactive = true;
		app.stage.on('pointerdown', () => {
			spineBoy.state.setAnimation(0, 'jump', false);
			spineBoy.state.addAnimation(0, 'walk', true, 0);
		});
		*/



		// setTimeout(function() {
		// 	spineBoy.state.clearTrack(0); // stop the spin animation
		// }.bind(this), 3000);
	}

// }, false);

/**
 * Upload the photos using ajax request.
 *
 * @param formData
 */
function requestForDeletingOldFiles() {
	$.ajax({
		url: '/delete_photos',
		method: 'get',
		data: null,
		processData: false,
		contentType: false,
		xhr: function () {
			var xhr = new XMLHttpRequest();
			return xhr;
		}
	}).done(handleSuccess).fail(function (xhr, status) {
		alert(status);
	});
}



/**
 * app   - canvas / renderer
 * stage - root container on top of canvas -->
 */



