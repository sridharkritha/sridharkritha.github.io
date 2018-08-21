// Ref: https://www.html5rocks.com/en/tutorials/file/dndfiles/

window.addEventListener('load', function() {

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
	  }

	  /*
	  var output = [];
	  output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
				  '</li>');
	*/

	
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
	
	}
	// document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);
});