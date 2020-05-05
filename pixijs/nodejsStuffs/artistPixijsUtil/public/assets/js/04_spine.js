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
		 app = new PIXI.Application();
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
		PIXI.loaders.shared
		//app.loader
			// .add('spineboy', './assets/spineAnimation/spineboy/spineboy.json')
			.add(fileNameWithoutExt, spineJsonUrl)
			.load(onAssetsLoaded);
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
		 }

		// set the position
		// spineBoy.x = app.screen.width / 2;
		// spineBoy.y = app.screen.height;

		spineBoy.x = 0;
		spineBoy.y = 0;
	
		// spineBoy.scale.set(1.5);

		 if(animationName) {
			// play animation forever, little boy!
			spineBoy.state.setAnimation(0, animationName, true);
		 }

		 app.stage.addChild(spineBoy);


		 requestForDeletingOldFiles();
		
	


		/*
	
		// set up the mixes!
		spineBoy.stateData.setMix('walk', 'jump', 0.2);
		spineBoy.stateData.setMix('jump', 'walk', 0.4);
	
		// play animation
		spineBoy.state.setAnimation(0, 'walk', true);
	
		app.stage.addChild(spineBoy);
	
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



