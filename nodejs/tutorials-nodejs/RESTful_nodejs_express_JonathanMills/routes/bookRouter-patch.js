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
	}); // end of route

	/*
	// Method 1: Without middleware - so you've to repeat findById for every HTTP verb
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
	})

	// Replace the old object by an new object
	.put((req, res) => {
		// http://localhost:3000/api/books/5ec3c7c57c3bc53ca6cd5c01
		// Query the MongoDB by id using the mongoDb findById() method
		const reqBookId = req.params.someBookId;
		Book.findById(reqBookId, (err, book) => {
			if(err) return res.send(err); // NOTE: return is prefixed

			book.title  = req.body.title; // Update query result using req.body
			book.author = req.body.author;
			book.genre  = req.body.genre;
			book.read   = req.body.read;
			book.save();                    // save in database

			return res.json(book);
		});
	}); // end of route

	*/

	//Method 2: Create a middleware and move the common part(findById()) inside the middleware
	bookRouter.use('/books/:someBookId', (req, res, next) => {
		Book.findById(req.params.someBookId, (err, book) => {
			if(err) return res.send(err); // NOTE: return is prefixed

			if(book) {
				req.book = book; // change the request and return book
				return next(); // move to next middleware if any
			}
			return res.sendStatus(404); // Not found
		});
	}); // end of middleware

	// Route 3:
	// Find 1 book by its id number
	bookRouter.route('/books/:someBookId')
	//.get((req,res)  => { res.json(req.book); })
	.get((req,res)  => res.json(req.book)) // NOTE: remove the ';'
	.put((req, res) => {
				const { book } = req;

				book.title  = req.body.title; // Update query result using req.body
				book.author = req.body.author;
				book.genre  = req.body.genre;
				book.read   = req.body.read;
				// synchronous save
				book.save();                // save in database
				return res.json(book);
	})
	.patch((req,res) => {
		const { book } = req;
		if(req.body._id) {
			delete req.body._id; // Don't allow 'id' update
		}

		Object.entries(req.body).forEach((item) => {
			const key   = item[0];
			const value = item[1];
			book[key] = value;
			console.log(key);
			console.log(value);
		});

		// Asynchronous save
		req.book.save((err) => {
			if(err) return res.send(err);
			return res.json(book);
		});

	}); // end of route

	return bookRouter; // return wrapper object

	}

	module.exports = routes; // export the routes() function

