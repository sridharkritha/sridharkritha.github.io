// File Module
var fs = require("fs");
// Method 1: Sync File Read Mode (Blocking)
console.log("Starting - Sync File Read\n");
// Read and Convert the text file into Javascript Object by JSON
var jsObj = JSON.parse(fs.readFileSync("./files/config.json"));
console.log("Content of the file is:\n\n", jsObj);
// Watch the file for changes and the print the modified file  
fs.watchFile("./files/config.json",function(current,previous){
   console.log("File Changed !!!\n");  
   jsObj = JSON.parse(fs.readFileSync("./files/config.json"));
   console.log("Content of the file - after Change:\n\n", jsObj);
});
