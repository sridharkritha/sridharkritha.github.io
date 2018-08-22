// Ref: https://www.html5rocks.com/en/tutorials/file/dndfiles/

window.addEventListener('load', function() {

	// Global variables
	var canvas = null;
	var ctx = null;
	var img = null;
	var isImgLoaded = false;

	  // Update Button on Click
	  document.getElementById('updateBtnId').onclick = function () {
		  if(isImgLoaded)
		  {
			isImgLoaded = false;
			// Position
			posX = parseInt(document.getElementById("positionX").value) || 0;
			posY = parseInt(document.getElementById("positionY").value) || 0;
			// Scale
			scaleX = parseFloat(document.getElementById("scaleX").value) || 1;
			scaleY = parseFloat(document.getElementById("scaleY").value) || 1;
			// Clip Top Position
			clipX = parseInt(document.getElementById("ClipTopPositionX").value) || 0;
			clipY = parseInt(document.getElementById("ClipTopPositionY").value) || 0;
			// Resolution
			img.width = parseInt(document.getElementById("resolutionWidth").value) || img.width;
			img.height = parseInt(document.getElementById("resolutionHeight").value) || img.height;

			// Use a canvas
			canvas = document.getElementById("myCanvas");
			ctx = canvas.getContext("2d");
			// TRS
			ctx.translate(posX, posY);
			// ctx.rotate(30 * Math.PI/180);
			// var scale = 0.5;

			// var xCoord = img.width/2 ;
			// var yCoord = img.height/2;
			// ctx.setTransform(scaleX, 0, 0, scaleY, xCoord,yCoord); // sets scale and origin
			// ctx.drawImage(img, 0, 0, img.width, img.height, clipX, clipY,img.width * scaleX, img.height * scaleY);
			ctx.drawImage(img, clipX, clipY, img.width - clipX, img.height - clipY, 0, 0,(img.width - clipX) * scaleX, (img.height - clipY) * scaleY);
		  }

	};

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
	  }

	  // FileReader
		img = document.createElement("img");
		var reader = new FileReader();
		reader.onload = function(e) 
		{
			img.src = e.target.result;

			img.onload = function() {
				isImgLoaded = true;
/*
				// Use a canvas
				var canvas = document.getElementById("myCanvas");
				ctx = canvas.getContext("2d");
				// TRS
				ctx.translate(350,200);
				ctx.rotate(30 * Math.PI/180);
				var scale = 0.5;
				var xCoord = img.width/2 ;
				var yCoord = img.height/2;
				ctx.setTransform(scale, 0, 0, scale, xCoord,yCoord); // sets scale and origin
				ctx.drawImage(img, 0, 0,img.width, img.height);
*/
			  };
		};
		reader.readAsDataURL(f);



	  /*
	  // File information
	  var output = [];
	  output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
				  '</li>');
	*/

	/*
	// Thumbnail image(s) one after another by sidewise

      var reader = new FileReader();
      // Closure to capture the file information.
      reader.onload = (function(event) {
        return function(e) {
          // Render thumbnail.
          var span = document.createElement('span');
          span.innerHTML = ['<img class="noThumbnail" src="', e.target.result,
                            '" title="', escape(event.name), '"/>'].join('');
          document.getElementById('list').insertBefore(span, null);
        };
      })(f);

      // Read in the image file as a data URL.
	  reader.readAsDataURL(f);
	  */
	
	}
	// File Information
	// document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);


  
});