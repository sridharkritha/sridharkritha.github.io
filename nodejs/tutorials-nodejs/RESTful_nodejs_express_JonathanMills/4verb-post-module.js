	// Parsing POST data with Body Parser. Parsing req.body

	var express = require('express');
	var app     = express();
	var port    = process.env.PORT || 3000;

	const Book = require('./models/bookModel.js'); // mongoDB schema and connection

	// Above can also be written using "express.Router()" which encapsulates all the HTTP verbs.
	// var bookRouter = express.Router();
	const bookRouter = require('./routes/bookRouter')(Book);// injecting the Book model
	// const authorRouter = require('./routes/authorRouter')(Author);// injecting the Book model

	var bodyParser = require('body-parser');
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());

	// wire up
	app.use('/api', bookRouter); // http://localhost:3000/api/books

	// Route 1:
	app.get('/', (req, res) => {
		res.send("RESTful API Course"); // sending - string
	});     // http://localhost:3000/


	app.listen(port, () => { console.log('Running Server on port ' + port); }); 