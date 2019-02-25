// ref: https://www.codexpedia.com/node-js/
// https://www.dev2qa.com/node-js-http-server-get-post-example/
// http://shiya.io/send-http-requests-to-a-server-with-node-js/
// https://code-maven.com/http-client-request-in-nodejs
var http = require('http');
var server = http.createServer(function (req, res) {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("Hey, this is a response from a server!\n");
});
server.listen(1212); // listening on port 1212

/*
How to run Run:
1. node httpServer.js

*/