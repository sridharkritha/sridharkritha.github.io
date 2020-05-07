Upgrade the 'npm' to version 6.14.0
     npm i -g npm@6.14.0
View the latest available 'npm' version from web
    npm view npm versions

Update the "node" to latest 'stable' version
    npm install -g node stable

Install:
    npm i express@latest
    npm i express@4.5.6
    npm i express@4        // latest of '4'  => 4.8.12

List all the installed modules/dependency tree
    npm ls 
List the packages which are outdated/will be updated if do 'npm update'
    npm outdated
Update the packages with respect to sematic version(~,^,=)
    npm update

show the version history/latest version of any module
    npm show express version


nvm: Node version Manager- You need to install by window installer NOT by 'npm'

Switch to different version of "node"
    >nvm list
    >nvm use 12.2.0

module semantic versioning:
ex:  4.5.6  => major.minor.patch
major: Breaking changes so most probably you need to update your own code to adopt it.
minor: Backward compatible changes only allowed
patch: minor bug fixes
~4.5.6 => upgrade to latest "patch" version ex: 4.5.18
^4.5.6 => upgrade to higher "minor" version ex: 4.8.2
=4.5.6 => exactly install the same version  ex: 4.5.6
4.5.6  => exactly install the same version  ex: 4.5.6


Publish a package:
1. Create a folder and do 'npm init' (NOT with -y ) and give an unique 'name' (name : 'sridhar_remote_provider' ) for the module.
2. create a 'index.js' and write your functions and the export the public functions using exports [ module.exports = printFunc; ]
3.  npm login
            <type username, password, email address>
    npm publish
   Check the publish content in the npm website:
    // https://www.npmjs.com/package/sridhar_remote_provider


To start REPL (read eval print loop) session - for quick test of node/javascript commands :

    node
    >Math.random()  

'tab' - to list all global available functions and auto completion
'-'   - stores last value

To start the REPL editor:
    .editor

    function fun() {
        return "sridhar";
    }

    Exit the editor by ^D and run the function in REPL
        fun()

##########################################################################################################################################
Modern Javascript:
------------------
Arrow function:
Ex:
// single argument
const rocks = who => { console.log(who + ' rocks'); };
setTimeout(rocks, 4 * 1000, 'pluralsight');

Ex:
const square = (a) => { return a * a; };   // or
const square = (a) => a * a;               // or
const square = a   => a * a;

Ex:
[1, 2, 3, 4].map(a => a * a);

Ex: Arrow function and 'this'

const X = function() {
    // "this" here is the caller of X
}

const Y = function() {
    // "this" here is NOT the caller of Y
    // It's the same 'this' found in Y's scope
}

Ex: 1
this.id = 'hello';
console.log(this); // { id: 'hello'}

const testObj = {
    func1: function()    { console.log(this); }, // { func1: [Function: func1], func2: [Function: func2] }
    func2:         () => { console.log(this); }  // { id: 'hello'}
};

testObj.func1();
testObj.func2();


Object Literals:
-----------------
const mystery = "answer";
const PI = Math.PI;

const obj = {
  age: 10,
  f1() {},         // function inside an object
  f2: () => {},    // arrow function inside an object
  [mystery]: 43,   // "answer": 43, (Dynamically 'mystery' will evaluated and then it become property)
  PI,              // PI: PI,       (same - short hand)
};

console.log(obj.mystery); // undefined
console.log(obj.answer);  // 43


Ex: Destruction (Extract) from Math library
const PI = Math.PI;
const E = Math.E;
const SQRT2 = Math.SQRT2;

   // [or]

const { PI, E, SQRT2 }  = Math;

Ex 2:

const circle = {
  label: 'circleX',
  radius: 2,
};

// Extract ONLY "radius" property from the circle object using destructuring syntax {}
const circleArea = ({ radius }) => (Math.PI * radius * radius).toFixed(2);   // 12.57
console.log( circleArea(circle) );

const sphereArea = ({ radius }, {precision}) => (Math.PI * radius * radius).toFixed(precision); // 12.56637
console.log( sphereArea(circle, {precision: 5}) ); // Passing extra argument

const sphereAreaDefault_1 = ({ radius }, {precision = 2}) => (Math.PI * radius * radius).toFixed(precision); // 12.57
console.log( sphereAreaDefault_1(circle, {}) ); // Passing EMPTY extra argument and use default parameters

const sphereAreaDefault_2 = ({ radius }, {precision = 2} = {}) => (Math.PI * radius * radius).toFixed(precision); // 12.56637
console.log( sphereAreaDefault_2(circle) ); // Passing NO extra argument and use default parameters

ex:
// array -destructing:
const [first, second,,forth] = [10,20,30,40];
// forth = 40, second = 20. Here we skipped the value 30

// array - destructing and rest and spread ...
const [first, ...restOfItems] = [10,20,30,40];
// first = 10 and restOfItems = [20,30,40] <- creates an arry using remaining items

// ex: object - destructing and rest and spread ...
const data = {
    temp1: '001',
    temp2: '002',
    firstName: 'John',
    lastName: 'Doe',
  };
  
  const { temp1, temp2, ...person } = data;
  // person = { firstName: 'John', lastName: 'Doe',}
  
 

Ex: 3
// With require - ONLY extract "readFile" function from 'fs' module
const { readFile } = require('fs');

Template Literals / strings:
const greeting = "Hello World"; // or
const greeting = 'Hello World';
// `backtick character` : Template literals are string literals - `${}' - Support "multi lines" and "injecting some dynamic values"
const singleLine = `<div> ${Math.random()} </div>`;

const multiLine = `
  <div>
    ${Math.random()}
  </div>
`;

######################################################################################################################################

Module: Folder with source files.

Ex 1:
// moduleTest.js
    module.exports.b = 20;  // Here 'module.exports' is an 'Object' by default. 
    exports.a = 10;         // Alias - same as above

// app.js
const moduleApi = require('./moduleTest');
console.log(moduleApi);  // { b: 20, a: 10 }

Ex 2: What is hidden inside the module ?

// function(exports, module, require, __filename, __dirname) { // hidden wrapping function
        console.log(arguments); // exports, module, require, __filename, __dirname
                                // They are NOT global variables. It is the arguments of hidden wrapper function
// return module.exports; }     // hidden return statement

Ex 3:
// function(exports, module, require, __filename, __dirname) { // hidden wrapping function

        let g = 9; // It is NOT a global variable in Node (Unlike browser). It is defined inside the hidden wrapper function.
        global.answer = 42; // Global variable. 'global' object here is like 'window' object in browser
        question = 25;      // Global variable - without 'let'

        module.exports.b = 20;  // Here 'module.exports' is an 'Object' by default. 
        exports.a = 10;         // Alias - same as above

        // module.exports: default 'object' can be changed into 'function' or 'array' or 'string'
        // Change the 'module.exports' object to function
        module.exports = () => {}; // Here 'module.exports' is an 'function'
        // exports = () => {};     // ERROR - alias - NOT work here.

// return module.exports; }   // hidden return statement

Ex 1: Global variables
// moduleGlobal.js

let g = 9;      // NOT a global variable. Local to the module
global.p = 50; // Global variable. 'global' object here is like 'window' object in browser
q = 100;       // Global variable like browser - without 'let'

exports.a = 1;
module.exports.b = 2;
module.exports = { c: 2};     // overwrites the previous object
exports.d = 3;
module.exports.e = 4;        // inject the value to existing object -  { c: 2, e: 4 }
// module.exports = { f: 5}; // overwrites the previous object


// app.js
const moduleGlobalApi = require('./moduleGlobal');
console.log(moduleGlobalApi);  // { c: 2, e: 4 }
console.log(moduleGlobalApi.g);  // undefined
console.log(g);  // error

console.log(moduleGlobalApi.p); // undefined
console.log(p);  // 50 - you can directly access the global variables once it's module has been defined.
console.log(q);  // 100

Ex 4: 'module.exports' as 'object':
    // moduleObject.js
    exports.a = 10; // no need to use  'module.exports.a = 10;' - it is optional
    exports.b = 20;
    exports.c = 30;

Ex 5: 'module.exports' as 'array':
    // moduleArray.js
    module.exports = [10,20,30]; // you SHOULD use 'module.exports' bcos it is NOT used as an object

Ex 6: 'module.exports' as 'string':
// moduleString.js
module.exports = " Hello World "; // you SHOULD use 'module.exports' bcos it is NOT used as an object

Ex 6: 'module.exports' as 'function':
// moduleFunction.js
// you SHOULD use 'module.exports' bcos it is NOT used as an object
module.exports = title => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <title>${title}</title>
  </head>
  <body>  </body>
  </html>
`;

// app.js
const moduleObjectApi = require('./moduleObject');
console.log(moduleObjectApi);  // {  a: 10, b: 20, c: 30 }

const moduleArrayApi = require('./moduleArray');
console.log(moduleArrayApi);  // [10, 20, 30]

const moduleStringApi = require('./moduleString');
console.log(moduleStringApi);  //  Hello World

const moduleFunctionApi = require('./moduleFunction');
const myTemplate = moduleFunctionApi('****** Hello Jay Bose! ********'); // passing argument
console.log(myTemplate);

<!DOCTYPE html>
  <html lang="en">
  <head>
    <title>****** Hello Jay Bose! ********</title>
  </head>
  <body>  </body>
  </html>

  //////////////////////////////////////////////////////////////////////////////////////////////////////////
Synchronous Pattern:

const fs   = require('fs');
const data = fs.readFileSync(__filename); // Synchronous - NOT goes to the Event loop. Wait until OS return the file data 
console.log('File data is', data);
console.log('TEST');

Asynchronous Patterns:
Method 1 - Using Callback:

const fs = require('fs');
fs.readFile(__filename, function cb(err, data) { // asynchronous - "Event loop" and "OS" interaction will takes place
  console.log('File data is', data);
});

console.log('TEST');

Note:
// Async function always has 'callback' function as their 'last' argument. ex: fs.readFile(__filename, cb);
// Callback function alway has 'error' object as their 'first' argument (Error first Callback pattern). ex: function cb(err, data) { }

Method 2 - Using Promise:

const fs   = require('fs');
const util = require('util'); // promisify function defined

const readFilePromised = util.promisify(fs.readFile);

async function main() {
  const data = await readFilePromised(__filename);
  console.log('File data is', data);
}

main();

console.log('TEST');

Method 3 - Using Native Promise Modules:

const { readFilePromised } = require('fs').promises; // Native promise 'fs' module

async function main() {
  const data = await readFilePromised(__filename);
  console.log('File data is', data);
}

main();

console.log('TEST');

Nesting Asynchronous :
Method 1 - using callbacks:

const fs = require('fs');

fs.readFile(__filename, function cb1(err, data) {
  fs.writeFile(__filename + '.copy', data, function cb2(err) {
    // Nest more callbacks here...
  });
});

console.log('TEST');


Method 2 - Using Native Promise Modules:

const fs = require('fs').promises;

async function main() {
  const data = await fs.readFile(__filename);
  await fs.writeFile(__filename + '.copy', data);
  // More awaits here...
}

main();
console.log('TEST');

///////////////////////////////////////////////////////////////////////////////////////////////////
Event Emitter:

Streams are Event Emitters
Ex 1: process.stdin, process.stdout are event emitters

Ex 2:
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

myEmitter.emit('TEST_EVENT'); // fires the event 'TEST_EVENT'

// subscribes for the event 'TEST_EVENT' 
myEmitter.on('TEST_EVENT', () => {
                                     console.log("Fired 'TEST_EVENT' by 'emit' method is capture here by 'on' method");
                                });
myEmitter.on('TEST_EVENT', () => {
                                    console.log("Fired 'TEST_EVENT' by 'emit' method is capture here by 'on' method");
                                });
// Note: Above subscribe methods will not capture the fired event bcos it is subscribed after the event emit.
// So either those methods should be moved above emit() or emit method should be inside the setTimeout.

Solution 1:

const EventEmitter = require('events');
const myEmitter = new EventEmitter();


// subscribes for the event 'TEST_EVENT' 
myEmitter.on('TEST_EVENT', () => {
                                     console.log("Fired 'TEST_EVENT' by 'emit' method is capture here by 'on' method");
                                });
myEmitter.on('TEST_EVENT', () => {
                                    console.log("Fired 'TEST_EVENT' by 'emit' method is capture here by 'on' method");
                                });

myEmitter.emit('TEST_EVENT'); // fires the event 'TEST_EVENT'

Solution 2:
const EventEmitter = require('events');
const myEmitter = new EventEmitter();
setTimeout(() => {
                    myEmitter.emit('TEST_EVENT'); // fires the event 'TEST_EVENT'
                 }, 0)

// subscribes for the event 'TEST_EVENT' 
myEmitter.on('TEST_EVENT', () => {
                                     console.log("Fired 'TEST_EVENT' by 'emit' method is capture here by 'on' method");
                                });
myEmitter.on('TEST_EVENT', () => {
                                    console.log("Fired 'TEST_EVENT' by 'emit' method is capture here by 'on' method");
                                });


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Web servers:

Native HTTP server:
Method 1:
    const http   = require('http');
    const server = http.createServer((res,req) => { req.end("Hello Sridhar"); }); // res, req are objects and streams
    server.listen(4242, () => { console.log("Server is running")});

Method 2 - Separate the request listener:
    const http            = require('http');
    const requestListener = (res,req) => { req.end("Hello Sridhar"); } // requestListener gets called whenever the 'request' event is fired
    const server          = http.createServer(requestListener);
    server.listen(4242, () => { console.log("Server is running")});

Meth0d 3 - Event Emitter way:
    const http            = require('http');
    const requestListener = (res,req) => { req.end("Hello Sridhar"); }  // res, req are objects and streams
    const server          = http.createServer();                        // create a server
    server.on("request", requestListener);                              // subscribe for the 'request' event
    server.listen(4242, () => { console.log("Server is running")});     // run the created server



Note:
    Functions are the first class Object => Functions can be passed just like a normal variable(argument) to another function.
    Higher Order function                => Function can takes a another function as the argument or return an another function.
    ex: createServer() - is a higher order function


What (res, req) has under the hood ?
    const http            = require('http');

    // res, req are objects and also it's stream as well.
    // res - readable stream, req - writeable steam. Bcos these are stream are event emitters so you can use 'emit' and 'on' methods
    const requestListener = (res,req) => { 
        //console.log(res);           // plenty of information
        console.dir(req, {depth: 0}); // print only the first level of the property NOT nested properties
        console.log(req.url);         // print the requesting url

        //req.end("Hello Sridhar");  // req: NOT res.end()
        res.write("Hello Sridhar");  // res: write the response
        res.end();                   // res: stream ends here 
    }  // res, req are streams


    const server          = http.createServer();                        // create a server
    server.on("request", requestListener);                              // subscribe for the 'request' event
    server.listen(4242, () => { console.log("Server is running")});     // run the created server



Web Server framework:
* 'http' Module- No api support for directly reading the 'body' parameters in the 'post' request. You have to manually parse the 'text'.
* Famous Web webserver frameworks for rescue - express / meteor.

express - as web server framework:

    const express = require('express');
    const server  = express();

    server.get('/',      (req,res) => { res.send("Hello Express"); });
    server.get('/about', (req,res) => { res.send("Hello about page..."); });   // Even you could pass an object

    server.listen(4242, () => { console.log('Express Server is running...'); });


Web template Framework / Server side static HTML Pages rendering:
* Instead of displaying the response in text, for server display the response in the form of static html pages using Web template frameworks.
* Famous Web template frameworks: ejs, handlebars. JSX

index.js
    const express = require('express');
    const server  = express();

    server.set('view engine', 'ejs'); // set the express to use the 'ejs' view engine

    server.get('/',      (req,res) => { res.render('index'); });  // render the 'ejs' static index.html file from view folder
    server.get('/about', (req,res) => { res.render('about'); });  // render the 'ejs' static about.html file from view folder

    server.listen(4242, () => { console.log('Express Server is running...'); });

views/index.ejs
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>INDEX</title>
    </head>
    <body>
      <h2>Hello EJS</h2>
      <div>
        <!-- write your javascript stuffs -->
        <%-
            Math.random()
        -%>
      </div>
    </body>
    </html>

views/about.ejs
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>INDEX</title>
    </head>
    <body>
    <h2>About...</h2>
    </body>
    </html>

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
Debug - nodejs code in chrome dev tool:
convertArrayToObject.js
    // Convert 'array' into 'object'
    function convertArrayToObject(arr) {
    return arr.reduce((acc, curr) => { acc[curr[0]] = curr[1]; return acc; }, {});
    }

    const obj = convertArrayToObject([ [1, 'One'], [2, 'Two'], [3, 'Three']]);
    console.log(obj);
    
step 1: attact the node debugger 
        node --inspect-brk convertArrayToObject.js
step 2: Go to 'chrome browser' and type the below url. Select 'inspect' from the listed target 
        chrome://inspect/

/////////////////////////////////////////////////////////////////////////////////////////////////////////////



    



















  





















    C:\Users\michela.frederico\AppData\Roaming\nvm