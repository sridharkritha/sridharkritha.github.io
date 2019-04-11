// https://www.tutorialsteacher.com/nodejs/expressjs-web-application

// Installation required:
// npm install express --save
// npm install body-parser --save

var express = require('express');
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

/*
app.get('/', function (req, res) {
	//res.send('<html><body><h1>Hello World</h1></body></html>');
    res.sendFile('index.html', {root: __dirname });
});

app.post('/submit-student-data', function (req, res) {
    var name = req.body.firstName + ' ' + req.body.lastName;
    res.send(name + ' Submitted Successfully!');
});
*/
// GET
var i = 1;
app.get('/sri', function (req, res) {
    i += 1;
    //res.send('<html><body><h1>Hello World</h1></body></html>');
    //res.send({a: str});
    res.send(JSON.stringify(i));

});


/*
app.put('/update-data', function (req, res) {
    res.send('PUT Request');
});

app.delete('/delete-data', function (req, res) {
    res.send('DELETE Request');
});
*/


/*
var http = require('http');
// var url = process.argv[2]; // url passed in on the command line

var url = 'http://localhost:1239/sri'; // url passed in on the command line
 
setInterval(function() {
	http.get(url, function(response) {
		response.setEncoding('utf8');
		response.on('data', function(data) {
			console.log(data);
		});
		response.on('err', function(err){
			console.log(err);
		});
	});
}.bind(this), 500);
*/



var port = process.env.PORT || 1239;
var server = app.listen(port, function () {
    console.log('Node server is running..');
});
