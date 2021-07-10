// READING A FILE by Sync / Async Methods
// File Module
var fs = require("fs");
// Method 1: Sync File Read Mode (Blocking)
console.log("Starting - Sync File Read\n");
var content = fs.readFileSync("./files/readme.txt");
console.log("Content of the file is:\n\n"+content);                       
console.log("Carry On Executing\n");

// Method 2: Async File Read Mode - Non Blocking(need function callback)
console.log("Starting - Async File Read\n");
fs.readFile("./files/readme.txt",function(error,data){
                            // If no Error
            console.log("Content of the file is:\n\n"+data);
                         });
console.log("Carry On Executing\n");
