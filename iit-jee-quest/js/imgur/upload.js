window.addEventListener('load', function () {

	// Renders the image from the cloud storage
	var feedback = function (res) {
		if (res.success === true) {
			var get_link = res.data.link.replace(/^http:\/\//i, 'https://');
			/*
			document.querySelector('.status').classList.add('bg-success');
			document.querySelector('.status').innerHTML =
							'Image : ' + '<br><input class="image-url" value=\"' + get_link + '\"/>' + '<img class="img" alt="Imgur-Upload" src=\"' + get_link + '\"/>';
			*/

			// document.getElementById('txtAreaId').value += 'Image : ' + '<br><input class="image-url" value=\"' + get_link + '\"/>';

			// Append the text on the text area
			document.getElementById('txtAreaId').value += '<img alt="Imgur-Upload" src=\"' + get_link + '\"/>';
			// Update the preview
			document.getElementById('textAreaPreviewer').innerHTML = document.getElementById('txtAreaId').value;

			// Hide the image uploader dialog box
			document.querySelector('#divImgDlgBoxWrapperId').style.display = "none";
		}
	};

	// Creates a new instance of Imgur
	new Imgur( {	clientid: '271e5071940b388', // '4409588f10776f7', //You can change this ClientID
					callback: feedback
	});

}, false);