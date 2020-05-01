// NOTE: File access(images) are allowed through web server so run local HTTP server.
// http-server -c-1
// If HTTP server is NOT installed then install by
// npm install -g http-server 
// run the example
// http://127.0.0.1:8080/00_index.html

// ref: https://pixijs.io/examples/#/plugin-spine/spineboy.js
// https://github.com/pixijs/examples/blob/gh-pages/examples/js/plugin-spine/spineboy.js

window.addEventListener('load', function () {

	// Global variables
	let app = null;

	init();


	function init() {
		 app = new PIXI.Application();
		document.body.appendChild(app.view);

		// load spine data
		app.loader
			.add('spineboy', './assets/spineAnimation/spineboy/spineboy.json')
			.load(onAssetsLoaded);
	}	
	
	function onAssetsLoaded(loader, res) {
		// create a spine boy
		const spineBoy = new PIXI.spine.Spine(res.spineboy.spineData);
	
		// set the position
		spineBoy.x = app.screen.width / 2;
		spineBoy.y = app.screen.height;
	
		spineBoy.scale.set(1.5);
	
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
	}

/*
	/// File selector
	document.getElementById('myFile').addEventListener('change', function () {
		myFunction();
	}.bind(this), false);

	function myFunction(){
		var x = document.getElementById("myFile");
		var txt = "";
		if ('files' in x) {
		  if (x.files.length == 0) {
			txt = "Select one or more files.";
		  } else {
			for (var i = 0; i < x.files.length; i++) {
			  txt += "<br><strong>" + (i+1) + ". file</strong><br>";
			  var file = x.files[i];
			  if ('name' in file) {
				txt += "name: " + file.name + "<br>";
			  }
			  if ('size' in file) {
				txt += "size: " + file.size + " bytes <br>";
			  }
			}
		  }
		} 
		else {
		  if (x.value == "") {
			txt += "Select one or more files.";
		  } else {
			txt += "The files property is not supported by your browser!";
			txt  += "<br>The path of the selected file: " + x.value; // If the browser does not support the files property, it will return the path of the selected file instead. 
		  }
		}
		document.getElementById("demo").innerHTML = txt;
	  }
*/

var fileCatcher = document.getElementById('file-catcher');
  var fileInput = document.getElementById('file-input');
  var fileListDisplay = document.getElementById('file-list-display');
  
  var fileList = [];
  var renderFileList, sendFile;
  
  fileCatcher.addEventListener('submit', function (evnt) {
  	evnt.preventDefault();
    fileList.forEach(function (file) {
    	sendFile(file);
    });
  });
  
  fileInput.addEventListener('change', function (evnt) {
 		fileList = [];
  	for (var i = 0; i < fileInput.files.length; i++) {
    	fileList.push(fileInput.files[i]);
    }
    renderFileList();
  });
  
  renderFileList = function () {
  	fileListDisplay.innerHTML = '';
    fileList.forEach(function (file, index) {
    	var fileDisplayEl = document.createElement('p');
      fileDisplayEl.innerHTML = (index + 1) + ': ' + file.name;
      fileListDisplay.appendChild(fileDisplayEl);
    });
  };
  
  sendFile = function (file) {
  	var formData = new FormData();
    var request = new XMLHttpRequest();
 
    formData.set('file', file);
	// request.open("POST", 'https://jsonplaceholder.typicode.com/photos');
	request.open("POST", 'http://127.0.0.1:8080/serverdb/');
	
    request.send(formData);
  };

}, false);





/**
 * app   - canvas / renderer
 * stage - root container on top of canvas -->
 */



