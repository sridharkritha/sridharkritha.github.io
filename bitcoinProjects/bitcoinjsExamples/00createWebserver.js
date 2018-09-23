var http = require("http");
var reqCounter  = 0;
// Create a quick web server in nodejs
http.createServer(function(req, res)
{
	// server log
	console.log(++reqCounter + ' Request from => ' + req.url);
	
	// Run the webserver => node createWebserver.js
	// Request the webserver from browser => localhost:99
	// Prints the welcome msg in the browser
	res.end('Hello ... new visitor...sridhar');
}).listen(99);