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

        // 3: Error check the query string before extract
        const query = {};
        if(req.query.genre) {
            query.genre = req.query.genre;
        }

        // http://localhost:3000/api/books?genre=Fantasy
        // Query the MongoDB and filter the result using url query string
        Book.find(query, (err, books) => {
            if(err) return res.send(err); // NOTE: return is prefixed

            // HATEOAS - Hypermedia link by id
            const reqBook = books.map((book) => {
                var newBook = book.toJSON();
                newBook.links = {}; // Add a hypermedia link
                newBook.links.self = `http://${req.headers.host}/api/books/${book._id}`;
                return newBook;
            });

            return res.json(reqBook);  // res.json(books)
        });
    }); // end of route


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
    .get((req,res)  => { 

        // HATEOAS - filter by genre
        const reqBook = req.body.toJSON();
        reqBook.links = {}; // Add a hypermedia link
        const genre = req.book.genrer.replace(' ', '%20'); // replace space by '%20'
        reqBook.links.FilterByThisGenre = `http://${req.headers.host}/api/books/?genre=${genre}`;

        res.json(req.reqBook); // req.book
    })
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
        });

        // Asynchronous save
        req.book.save((err) => {
            if(err) return res.send(err);
            return res.json(book);
        });

    })

    .delete((res,req) => {
        req.book.remove((err) => {              // delete from MongoDb
            if(err) return res.send(err);
            return res.sendStatus(204); // 204 - successfully deleted
        });
    }); // end of route

    return bookRouter; // return wrapper object

    }

    module.exports = routes; // export the routes() function

