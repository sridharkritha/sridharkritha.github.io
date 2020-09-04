    // get (verb) - getting data from the server
    var express = require('express');
    var app     = express();
    var port    = process.env.PORT || 3000;

    app.get('/', (req, res) => {
        res.send("RESTful API Course"); // sending - string
    });     // http://localhost:3000/

    // Above can also be written using "express.Router()" which encapsulate all the HTTP verbs.
    var bookRouter = express.Router();
    bookRouter.route('/books')
                    .get((req,res) => {
                        const someJson = {"Slogan": 'Hello World'};
                        res.json(someJson); // sending - json
                    });
    app.use('/api', bookRouter); // http://localhost:3000/api/books

    app.listen(port, () => { console.log('Running Server on port ' + port); });