// var http = require("http");
var express = require("express"); // npm install express --save
var app = express();

var reqCounter  = 0;
// Create a quick web server in nodejs
app.listen(100, function(){
	// server log
	console.log(++reqCounter + ' Request from => ' /* + req.url */);
});

app.get("/", function(req, res){
	res.send('Hello ... new visitor...sridhar');
});

/*
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
*/