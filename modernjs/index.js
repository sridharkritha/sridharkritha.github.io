// Use require() for including the external modules instead of referring by script tag in the HTML file
// <script src="node_modules/moment/min/moment.min.js"></script> 
// bcos require() is not known by the browser so we need to convert this index.js file into browser readable
// file using the command -> browserify index.js -o bundle.js
var moment = require('moment');
console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));

var multiply = require('./sridhar');
console.log(multiply(2, 3));

console.log("Hello from JavaScript!");
