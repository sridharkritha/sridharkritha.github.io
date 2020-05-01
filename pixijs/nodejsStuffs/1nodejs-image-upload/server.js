// Ref: https://medium.com/@nitinpatel_20236/image-upload-via-nodejs-server-3fe7d3faa642
// https://github.com/expressjs/multer
// https://dev.to/rizkyrajitha/lets-upload-files-using-expressjs-server-4l0i
/*
    nodeJS-image-upload

    Simple NodeJS Express Program get files as input from user and upload it to the server. 

    To install necessary packages and start the server: 
        
        npm install && npm start

    Then go to [http://localhost:3000](http://localhost:3000). 

    Explanation - https://medium.com/@nitinpatel_20236/image-upload-via-nodejs-server-3fe7d3faa642
*/

const express = require('express');
const multer = require('multer');
const upload = multer({dest: __dirname + '/uploads/images'});

const app = express();
const PORT = 3000;

app.use(express.static('public')); // html form for the file browse in the public directory

// app.post('/upload', upload.single('photo'), (req, res) => {     // upload single image file
   app.post('/upload', upload.array('photo'), (req, res) => {      // upload multiple image files
    if(req.file) {
        res.json(req.file);
    }
    else throw 'error';
});

app.listen(PORT, () => {
    console.log('Listening at ' + PORT );
});