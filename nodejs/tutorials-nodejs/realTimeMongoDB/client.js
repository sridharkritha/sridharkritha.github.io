//window.addEventListener('load', function () {
    const io = require("socket.io-client"); // without web
    const socket = io.connect("http://localhost:3456");
    socket.on("welcome", (data) => {
      console.log("Client:", data);
    });

   //  const socket = io("http://localhost:3100"); // web
/*
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




