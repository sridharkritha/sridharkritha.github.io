// Ref: https://www.youtube.com/watch?v=JoTYbWtxVIY
// Channel: m1xolyd1an

var express = require("express"); // npm install express --save
var app = express();
var request = require("request");

// Using request(kind of curl) pull the content from 
// blockchain.info website
request({
	url:"https://blockchain.info/stats?format=json",
	json: true
}, function(error, response, body){
	// print the pulled body content
	btcPrice = body.market_price_usd;
	btcBlocks = body.n_blocks_total;
	// console.log(body);
});

var reqCounter  = 0;
// Create a quick web server in nodejs
app.listen(100, function(){
	// server log
	console.log(++reqCounter + ' Request from => ' /* + req.url */);
});

// url request: http://localhost:100/
app.get("/", function(req, res){
	// res.send('Hello ... new visitor...sridhar');
	res.send('Bitcoin Price - '+ btcPrice);
});

// url request: http://localhost:100/block
app.get("/block", function(req, res){
	res.send('Bitcoin Height - '+ btcBlocks);
});

// Open a file using an url request: http://localhost:100/srifile
app.get("/srifile", function(req, res){
	res.sendfile('index.html');
});