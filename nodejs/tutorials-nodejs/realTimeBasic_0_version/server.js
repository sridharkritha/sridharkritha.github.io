const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);
const port = 3000;

// Listen for a client connection 
io.on("connection", (socket) => {
    // Socket is a Link to the Client 
    console.log("New Client is Connected!");
    // Here the client is connected and we can exchanged data
    socket.emit("myEvent", "Hello and Welcome to the Server");
});

// Listen the HTTP Server 
httpServer.listen(port, () => {
    console.log("Server Is Running Port: " + port);
});