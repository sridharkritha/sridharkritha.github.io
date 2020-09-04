	var express = require('express');

	function routes(Book) {
	var bookRouter = express.Router();

		// Route 2:
	bookRouter.route('/books')
	.post((req, res) => {
		const newBookEntry = new Book(req.body); // Create a new Book object using MongoDb and req.body
		newBookEntry.save(); // save the new book entry to the MongoDb database

		console.log(newBookEntry);
		// return res.json(newBookEntry);
		return res.status(201).json(newBookEntry);
	})
	.get((req,res) => {

		// 1: Directly access the query string
		// const query = req.query;

		// 2. De-structure the query string by ES6 way
		// const {query} = req; // ES6 way

		// 3: Error check the query string before extract
		const query = {};
		if(req.query.genre) {
			query.genre = req.query.genre;
		}

		// http://localhost:3000/api/books?genre=Fantasy
		// Query the MongoDB and filter the result using url query string
		Book.find(query, (err, books) => {
			if(err) return res.send(err); // NOTE: return is prefixed
			return res.json(books);
		});


		// http://localhost:3000/api/books
		// Return all the book collection from the MongoDB using MongoDB find method.
		// Book.find((err, books) => {
		//     if(err) return res.send(err); // NOTE: return is prefixed
		//     return res.json(books);
		// });

		// const someJson = {"Slogan": 'Hello World'};
		// res.json(someJson); // sending - json
	});

	// Route 3:
	// Find 1 book by its id number
	bookRouter.route('/books/:someBookId')
	.get((req,res) => {
		// http://localhost:3000/api/books/5ec3c7c57c3bc53ca6cd5c01
		// Query the MongoDB by id using the mongoDb findById() method
		const reqBookId = req.params.someBookId;
		Book.findById(reqBookId, (err, book) => {
			if(err) return res.send(err); // NOTE: return is prefixed
			return res.json(book);
		});
	});

	return bookRouter; // return wrapper object

	}

	module.exports = routes; // export the routes() function

