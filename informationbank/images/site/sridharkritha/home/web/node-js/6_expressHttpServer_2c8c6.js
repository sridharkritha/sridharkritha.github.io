// Http Module
//var http = require("http");
// Framework(Express) which sit top of Http Module
var express = require("express");
console.log("Starting");
var host = "127.0.0.1";
//var port = 1337;
// File Module
var fs = require("fs");
// Read and Convert the text file into Javascript Object by JSON
var jsObj = JSON.parse(fs.readFileSync("./files/config.json"));
var port = jsObj.port;

// Create Server using Express Framework
var app = express(); // express.createServer();
// Use root directory
app.use(app.router);
// http://localhost:1337/
app.get("/", function(request, response) {
               response.send("Hello! Express !!");
			 });
// http://localhost:1337/html.html			 
// Use the specified directory and then load the requested
// requested static file from the specified directory 
app.use(express.static(__dirname + "/files"));


http://localhost:1337/sri/see u tomorrow		 
app.get("/sri/:text", function(request, response) {
               response.send("Good Day!!" + request.params.text);
			 });
			 
var emailIDs ={
    "1":{
		"Account": "Gmail",
		"UserName": "sridhar"			
    },
    "2":{
		"Account": "Hotmail",
		"UserName": "sumitha"		
	}
};

// http://localhost:1337/user/2
// Get the user information by entering their ids ( 1 or 2 )
app.get("/user/:id", function(request, response){
    var ret = emailIDs[request.params.id];
	if(ret) {
		response.send("<a href='http://www.gmail.com" + ret.Account +"'>Login "+ ret.UserName+"Enter</a>");
	} else {
	    response.send("Sorry! We cannot find the user !", 404);
	}

})

			 
			 
app.listen(port, host);		

