const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server); // .listen(3100)
const port = 3456; //  process.env.PORT || 3100
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser')



  io.on('connection',(socket)=> {

    socket.emit("welcome", "I'm from server");
    console.log('user connected');
    // socket.on('joinRoom',(data)=>{      // data will look like => {myID: "123123"}
    //     console.log('user joined room');
    //    //  console.log(data.myID)
    //     socket.join(data.myID);
    // });
});

server.listen(port, () => {
    console.log('Server listening at port %d', port);
  });

/*
// app.use(bodyParser.json())

// collections
const Users = require('./UserModel');

// database connection

mongoose.connect('mongodb://localhost:27119/sriDB',{useNewUrlParser:true},
    function(err){
        if(err){
            throw err;
        }
        console.log('Database connected');
        
        io.on('connection',(socket)=>{
            console.log('user connected');
            socket.on('joinRoom',(data)=>{      // data will look like => {myID: "123123"}
                console.log('user joined room');
               //  console.log(data.myID)
                socket.join(data.myID);
            });
        });

        Users.watch().on('change',(change)=>{
            console.log('Something has changed');
            io.to(change.fullDocument._id).emit('changes',change.fullDocument);
        });

});

*/




