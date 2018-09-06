/*
Ref: 
https://gyandeeps.com/json-file-write/
http://stackabuse.com/reading-and-writing-json-files-with-node-js/
*/

/////////////////////////////////// 1. Write a simple word(hello sridhar) in a file ////////////////////////////////////
/*
// 
var fs = require("fs");
var fileContent = "hello sridhar";

fs.writeFile("./sample.txt", fileContent, function(err) {
    if (err) {
        console.error(err);
        return;
    };
    console.log("File has been created");
});
*/

/////////////////////////////////// 2. Write a simple JSON object to a file ////////////////////////////////////////////

var fs = require('fs');
var student = {  
    name: 'Mike',
    age: 23, 
    gender: 'Male',
    department: 'English',
    car: 'Honda' 
};

var data = JSON.stringify(student, null, 2);
// Asynchronous file write
fs.writeFile('./student.json', data, function(err)  {  
    if (err) throw err;
    console.log('Data written to file');
});
console.log('This is after the write call');  

/////////////////////////////////// 3. Read a simple JSON object from a file ///////////////////////////////////////////
/*
var fs = require('fs');
// Asynchronous file read
fs.readFile('./student.json', function(err, data) {  
    if (err) throw err;
    var student = JSON.parse(data);
    console.log(student);
});

console.log('This is after the read call'); 
*/


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
