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
app.get("/", function(request, response) {
               response.send("Hello! Express !!");
			 });
app.listen(port, host);		

