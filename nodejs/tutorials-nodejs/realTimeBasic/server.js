const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);
const mongoose = require('mongoose');
// const createDeleteAPI = require('./routes/createDeleteAPI');
const port = 3000;


// const router = express.Router();

// /* CREATE */
// router.post('/new', (req, res) => {
//   Task.create({
//     task: JSON.stringify({ "name": "raj", "age": "12"}), // req.body.task,
//   }, (err, task) => {
//     if (err) {
//       console.log('CREATE Error: ' + err);
//       res.status(500).send('Error');
//     } else {
//       res.status(200).json(task);
//     }
//   });
// });


// collections
const Users = require('./UserModel');
const db = mongoose.connection;

// database connection

mongoose.connect('mongodb://localhost:27119/sriDB?replicaSet=rs',{useNewUrlParser:true},
    function(err){
        if(err){
            console.log('Database connection error: ' + err);
            throw err;
        }
        console.log('Database connected');

        const myCollection = db.collection('sriCollection');
        const myChangeStream = myCollection.watch();



        myChangeStream.on('change', (change) => {
            console.log(change);
              
            if(change.operationType === 'insert') {
              const task = change.fullDocument;
              socket.emit('myEvent', JSON.stringify({ "name": "raj", "age": "12"}));
            } else if(change.operationType === 'delete') {
                socket.emit('myEvent', JSON.stringify({ "name": "raj", "age": "12"}));
            }
        });

        myCollection.insert( { "name": "jay", "age": "7"} );


        
        // io.on('connection',(socket)=>{
        //     console.log('user connected');
        //     socket.on('myEvent',(data)=>{      // data will look like => {myID: "123123"}
        //         console.log('user joined room');
        //         console.log(data);
        //         socket.join(data.myID);
        //     });
        // });

        // Users.watch().on('change',(change)=>{
        //     console.log('Something has changed');
        //     io.to(change.fullDocument._id).emit('changes',change.fullDocument);
        // });

});





// Listen the HTTP Server 
httpServer.listen(port, () => {
    console.log("Server Is Running Port: " + port);
});