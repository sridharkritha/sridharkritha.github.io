// WRITING A FILE by Sync / Async Methods
// File Module
var fs = require("fs");

// Method 1: Sync File Write Mode (Blocking)
console.log("Starting - Sync File Write\n");
fs.writeFileSync("./files/writeMe_Sync.txt","Hello World! Synchronous!");                      
console.log("Carry On Executing\n");

// Method 2: Async File Write Mode - Non Blocking(need function callback)
console.log("Starting - Async File Write\n");
fs.writeFile("./files/writeMe_Async.txt","Hello World! Asynchronous!",function(error){
                            // If no Error
            console.log("File Written\n");
                         });
console.log("Carry On Executing\n");
