/*
// Use require() for including the external modules instead of referring by script tag in the HTML file
// <script src="node_modules/moment/min/moment.min.js"></script> 
// bcos require() is not known by the browser so we need to convert this index.js file into browser readable
// file using the command -> browserify index.js -o bundle.js
var moment = require('moment');
console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));

var multiply = require('./sridhar');
console.log(multiply(2, 3));

console.log("Hello from JavaScript!");

*/
// ref: https://stackoverflow.com/questions/19850234/node-js-variable-declaration-and-scope
// https://stackoverflow.com/questions/43627622/what-is-the-global-object-in-nodejs/43630118
// https://www.hacksparrow.com/global-variables-in-node-js.html
// https://stackoverflow.com/questions/500431/what-is-the-scope-of-variables-in-javascript?rq=1
// https://stackoverflow.com/questions/30469755/why-a-variable-defined-global-is-undefined



// http://www.hacksparrow.com/javascript-apply-and-call.html

// https://www.hacksparrow.com/javascript-convert-arguments-to-array.html
// https://stackoverflow.com/questions/960866/how-can-i-convert-the-arguments-object-to-an-array-in-javascript
// https://johnresig.com/apps/learn/#43
// https://stackoverflow.com/questions/4301920/john-resig-advanced-javascript-question



firstName = 'Sridhar';     // without var
var lastName = 'Krishnan'; // with var

console.log('-------Global Scope----------------');
console.log(firstName, this.firstName, GLOBAL.firstName); // nodejs => Sridhar undefined Sridhar
                                                          // browser=> Sridhar Sridhar  Error: GLOBAL is not defined

console.log(lastName, this.lastName, GLOBAL.lastName);    // nodejs => Krishnan undefined undefined
                                                          // browser=> Krishnan Krishnan  Error: GLOBAL is not defined

function fun() {
    console.log('-------Inside Function Scope-------');
    console.log(firstName, this.firstName, GLOBAL.firstName); // nodejs => Sridhar Sridhar Sridhar
                                                              // browser=> Sridhar Sridhar  Error: GLOBAL is not defined

    console.log(lastName, this.lastName, GLOBAL.lastName); // nodejs => Krishnan undefined undefined
                                                           // browser=> Krishnan Krishnan  Error: GLOBAL is not defined
}

fun();


/*
//var name = 'mermaid';
//var sound = 'sing';

name = 'mermaid'; // without var
console.log(name, this.name, GLOBAL.name); // nodejs => mermaid undefined mermaid
                                           // browser=> mermaid mermaid  Error: GLOBAL is not defined


var sound = 'sing'; // with var
// console.log(sound, this.sound, GLOBAL.sound); // nodejs => sing undefined undefined
                                              // browser=> sing sing  Error: GLOBAL is not defined

// var dog = {type:'dog', name:'Tommy', sound:'bark'};
// var cat = {type:'cat', name:'Kitty', sound:'meow'};
// var cow = {type:'cow', name:'Lakshmi', sound:'moo'};

function vocalize(quality) {
    // console.log(this.name +' '+ this.sound +'s '+ quality);
    console.log(name, this.name, GLOBAL.name);
}

function act(when, why) {
    console.log(this.name +' is a '+ this.type +' who '+ this.sound + 's ' + when +' '+ why);
}

vocalize('sadly');

vocalize.call(dog, 'loudly');
vocalize.call(cat, 'happily');
vocalize.call(cow, 'slowly');

act.apply(dog, ['at night', 'because he is angry']);
act.apply(cat, ['in the morning', 'because he is sleepy']);
act.apply(cow, ['in the afternoon', 'because she is hungry']);
*/