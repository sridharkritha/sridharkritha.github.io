// Ref: http://www.labbookpages.co.uk/web/realtime.html
window.addEventListener('load', function()
{
	var xhr = null;
	var requestMode = 'POST'; // 'GET' or 'POST'

	getXmlHttpRequestObject = function()
	{
		if(!xhr)
		{
			// All modern browsers have a built-in XMLHttpRequest object to request data from a server
			// Create a new XMLHttpRequest object 
			xhr = new XMLHttpRequest();
		}
		return xhr;
	};

	updateLiveData = function()
	{
		xhr = getXmlHttpRequestObject();
		xhr.onreadystatechange = evenHandler;
		if(requestMode === 'GET')
		{
			// GET
			var now = new Date();
			// Date string is appended as a query with live data for not to use the cached version 
			var url = 'livefeed.txt?' + now.getTime();		
			// asynchronous requests
			xhr.open("GET", url, true);
			// Send the request over the network
			xhr.send(null);
		}
		else
		{
			//ref: https://learn.freecodecamp.org/data-visualization/json-apis-and-ajax/post-data-with-the-javascript-xmlhttprequest-method/
			// https://github.com/freeCodeCamp/freeCodeCamp/issues/14002

			// POST
			var url = 'https://api.imgur.com/3/image';
			var clientid =  '4409588f10776f7'; //You can change this ClientID
			// asynchronous requests
			xhr.open("POST", url, true);
			xhr.setRequestHeader('Authorization', 'Client-ID ' + clientid);
			// Send the request over the network
			var fd = new FormData();
			var imagePath = "C:/\Users/\skrishnan/\Documents/\GitHub/\sridharkritha.github.io/\sriImgUpload/\test.png";
			fd.append('image', imagePath);
			xhr.send(fd);
		}
		
	};

	updateLiveData();

	function evenHandler()
	{
		if(requestMode === 'GET')
		{
			// GET
			// Check response is ready or not
			if(xhr.readyState == 4 && xhr.status == 200)
			{
				dataDiv = document.getElementById('liveData');
				// Set current data text
				dataDiv.innerHTML = xhr.responseText;
				// Update the live data every 1 sec
				setTimeout(updateLiveData(), 1000);
			}
		}
		else
		{
			// POST
			// Check response is ready or not
			if(xhr.readyState == 4 && xhr.status == 201)
			{
				dataDiv = document.getElementById('liveData');
				// Set current data text
				//dataDiv.innerHTML = JSON.parse(xhr.response);
				dataDiv.innerHTML = xhr.responseText;
				// Update the live data every 1 sec
				// setTimeout(updateLiveData(), 1000);
			}
		}
	}
});

// Local web server
// http-server  -p 8059 -c-1