// File Module
var fs = require("fs");
// Method 1: Sync File Read Mode (Blocking)
console.log("Starting - Sync File Read\n");
var content = fs.readFileSync("./files/config.json");
console.log("Content of the file is:\n\n"+content);
// Convert the text file into Javascript Object by JSON
var config = JSON.parse(content);
console.log("Display all the Contents:\n"+content);
// Read the Parsed File Object  
console.log("Display only Password:"+config.password);                     
console.log("Carry On Executing\n");
