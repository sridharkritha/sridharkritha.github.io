// HTTPS Module
var https = require("https");
var userName = 'sridharkritha';
// Outdate Access Option -- Check the latest http://developer.github.com/v3/
var options = {
            host: 'api.github.com',
			path: '/repos/'+userName+'Euler',
			method: 'GET'
};

var request = https.request(options, function(response) {
    var body = '';
	response.on("data",function(chunk) {
	        // Concatenate returned Jason String Object from the server
	        body += chunk.toString('utf8');
		});
		response.on("end", function(){   
		     // Print all the content
		     console.log("Body: ", body);
			 // Parse the content using JSON parser
			 var json = JSON.parse(body);	
			 // Count the content
			 console.log("Count No. of Repos: ", json.length);
			 var repositiories = [];
			 json.forEach(function(repo) {
			       repositiories.push({
				          name: repo.name,
						  description: repo.description
				   });
			 });
			 console.log("Repos: ", repos);
		});
});
request.end();