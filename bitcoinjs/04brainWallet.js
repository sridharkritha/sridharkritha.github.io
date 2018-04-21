// Ref: https://www.youtube.com/watch?v=gD20zsE3TEE&t=0s
// Channel: m1xolyd1an

var express = require("express");
var app = express();
var request = require("request");
var bodyparser = require("body-parser");
var bitcore = require("bitcore-lib"); // not bitcorejs-lib

app.use(bodyparser.urlencoded({
	extended: true
}));
app.use(bodyparser.json());

var reqCounter  = 0;
// Create a quick web server in nodejs
app.listen(100, function(){
	// server log
	console.log(++reqCounter + ' Request Count ');
});

// GET
// url request: http://localhost:100/
app.get("/", function(req, res){
	res.sendFile(__dirname + '/wallet.html');
});

// POST
// Receiving msg from user through req from HTML
// Open a file using an url request: http://localhost:100/wallet
app.post("/wallet", function(req, res){
	var brainsrc = req.body.brainsrc;
	console.log(brainsrc);
	// Buffer stream for handling the binary data
	var input = new Buffer(brainsrc);
	var hash = bitcore.crypto.Hash.sha256(input);
	var bn = bitcore.crypto.BN.fromBuffer(hash); // BigNumber
	var pk = new bitcore.PrivateKey(bn).toWIF(); // Wallet Import format
	var addy = new bitcore.PrivateKey(bn).toAddress();
	// Send the output to http://localhost:100/wallet
	res.send('The Brain wallet of : '+ brainsrc + 
			'<br>Addy: '+ addy + '<br>Private key: ' + pk);
});

/*
Input:
satoshi

Output:
The Brain wallet of : satoshi
Addy: 1xm4vFerV3pSgvBFkyzLgT1Ew3HQYrS1V
Private key: L4XnHhvLC1b4ag9L2PM9kRicQxUoYT1Q36PQ21YtLNkrAdWZNos6

Test:
https://blockchain.info/address/1xm4vFerV3pSgvBFkyzLgT1Ew3HQYrS1V
*/