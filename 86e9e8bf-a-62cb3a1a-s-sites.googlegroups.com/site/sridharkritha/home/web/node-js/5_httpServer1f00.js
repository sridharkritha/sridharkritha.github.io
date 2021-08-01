// Http Module
var http = require("http");
console.log("Starting");
var host = "127.0.0.1";
//var port = 1337;
// File Module
var fs = require("fs");
// Read and Convert the text file into Javascript Object by JSON
var jsObj = JSON.parse(fs.readFileSync("./files/config.json"));
var port = jsObj.port;

var server = http.createServer(function (request,response) {
              // Requesting Root Directory PATH 
              console.log("Received Request", request.url);
			  //response.writeHead(200,{"Content-type":"text/plain"});
			  //response.write("Welcome to Home Page - Root Directory");
			  
			  // Taking request from Root directory(/) and (/files) directory 
			  fs.readFile("./files"+request.url,function(error,data) {
			  if(error) {
			  // File was not found then prepare and display a plain text message
			  response.writeHead(404,{"Content-type":"text/plain"});
			  response.end("Sorry the page was not found");
			  } 
			  else {
			  // File is found then display the content of requested .html file
			  response.writeHead(200,{"Content-type":"text/html"});
			  response.end(data);
              }			  
			  });			  
	});
			  
			  
server.listen(port,host,function() {
              console.log("Listening" + host + ":" +port);
			  
			 });
			 
// Watch the file for changes and the print the modified file  
fs.watchFile("./files/config.json",function(current,previous){
   console.log("File Changed !!!\n");  
   jsObj = JSON.parse(fs.readFileSync("./files/config.json"));
   port = jsObj.port;
   server.close(); // Close the old port binded connection
   server.listen(port,host,function() {
              console.log("Now Listening" + host + ":" +port);
			  
			 });
   
   console.log("Content of the file - after Change:\n\n", jsObj);
});

			 
