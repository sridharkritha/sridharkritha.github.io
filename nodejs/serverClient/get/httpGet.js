var http = require('http');
var url = process.argv[2]; // url passed in on the command line
 
http.get(url, function(response) {
    response.setEncoding('utf8');
    response.on('data', function(data) {
        console.log(data);
    });
    response.on('err', function(err){
        console.log(err);
    });
});

/*
How to run Run:
1. node httpGet.js http://localhost:1212
(or)
2. Browser:
No need of this Code. Directly communicate the server by typing the url in the browser

http://localhost:1212

(or)

3. Curl: 
curl http://localhost:1212

*/