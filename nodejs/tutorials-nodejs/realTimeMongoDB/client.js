
window.addEventListener('load', function () { // needed only for the Method 1.

    // Method 1: Using HTML - Load "client.html" (do NOT run "node client.js")
    // It uses 'io' from the distributed version of socket.io from "client-dist/socket.io.js"
    const socket = io("http://localhost:3456", { transports : ['websocket'] }); // internally emits "connection" event
    
    /*
    // Method 2: Without using HTML - directly run "node client.js"
    // It uses 'io' from the "socket.io-client" which is installed by "npm install socket.io-client --save"
    const io = require("socket.io-client");
    // First Connect to the Server on the Specific URL (HOST:PORT)
    let socket = io("http://localhost:3000"); // internally emits "connection" event
    */
    
    // socket.on => listener. socket.emit => sends event.
    // Add listener for the event "myEvent" but NOT execute the callback
    // Callback will be executed only after if you get the "myEvent"
    socket.on("myEvent", (data) => {
      console.log("Message: ", data); // gets executed only after the "myEvent" arrives.
    });
  
  
  }); // needed only for the Method 1.


//window.addEventListener('load', function () {
  /*
    const io = require("socket.io-client"); // without web
    const socket = io.connect("http://localhost:3456");
    socket.on("welcome", (data) => {
      console.log("Client:", data);
    });

   //  const socket = io("http://localhost:3100"); // web

    socket.on("connect", () => {
        console.log(socket.id); // "G5p5..."
      });     


    try {
        //setInterval(()=> {
            socket.emit('joinRoom', JSON.stringify({ "name": "raj", "age": "12"}));
        //}, 1000);

        // socket.emit('joinRoom', JSON.stringify({ "name": "kumar", "age": "39"}));
      }
      catch(err) {
        // document.getElementById("demo").innerHTML = err.message;
        console.log(err.message);
      }


    // socket.on("changes", {
    //     it.forEach {
    //         Log.d(TAG, "onchange: "+it)
    //     }
    // })
    */

//});




