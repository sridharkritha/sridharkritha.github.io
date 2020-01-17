	var arr = [1, 2, 3];
	// it inherits from Array.prototype?
	alert( arr.__proto__ === Array.prototype ); // true
	// then from Object.prototype?
	alert( arr.__proto__.__proto__ === Object.prototype ); // true
	// and null on the top.
	alert( arr.__proto__.__proto__.__proto__ ); // null











































































/*

//hasOwnProperty() Vs in

//hasOwnProperty() does not check the inherited properties / prototype but in does check inherited properties / prototype.

var test = function() {};
// Prototype
test.prototype.newProp = function() {};
// Object creation by new operator
var instance = new test();

console.log(instance.hasOwnProperty('newProp')); // false
console.log('newProp' in instance); // true

// Prototype (global object)
Object.prototype.something = function() {};
console.log(instance.hasOwnProperty('something')); // false
console.log('something' in instance); // true

// Object creation by literal notation
var book = {
    title: "High Performance JavaScript"
};

console.log(book.hasOwnProperty("title"));  //true
console.log("title" in book); //true
console.log(book.hasOwnProperty("toString"));  //false
console.log("toString" in book); //true


// NOT bitwise operator (~). 
 ~N = -(N+1)
~-2 = -(-2+1) =  1 
~-1 = -(-1+1) = -0
 ~0 = -(0+1)  = -1 
 ~1 = -(1+1)  = -2


var foo = "bar";
foo.indexOf("b"); // 0
foo.indexOf("z"); // -1

if (~foo.indexOf("b"))  // ~N = -(N+1); ~0 = -(0+1) = -1 = truly 
{
	// item in list
} else {
	// item not in list
}

if (~foo.indexOf("z"))  // ~N = -(N+1); ~(-1) = -(-1+1) = -0 = falsy 
{
	// item not in list
} else {
	// item in list
}

if (!~foo.indexOf("z")) 
{
	// item in list
} else {
	// item not in list
}

// double NOT bitwise operator (~~).

// ~~ will do 2 things:
// 1. Convert from string to number and 
// 2. Trim the fraction part if any

var s = '1234.95';
var n = ~~s; 
console.log(typeof s); // string
console.log(typeof n); // number

// ~~ is then fast way of converting string/number into floor form. Only for +ve numbers.
console.log(n); // 1234

// Using Math.floor
n = 1234.95;
console.log(Math.floor(n)); // 1234

// Negative number: Math.floor and ~~ are different in that case
n = -5.6;
console.log(~~n); // -5
console.log(Math.floor(n)); // -6


// Convert Object into Array
var obj = {"0":"5","1":"6","2":"7","3":"8"};
var arr = Object.keys(obj).map(function(k) { return obj[k]; });
console.log(arr); // [ '5', '6', '7', '8' ]

	
	

	123 == '123';  // true because of type coercion
      1 ==  true;  // true because of type coercion
    123 === '123'; // false because it avoids type coercion
	  1 === true;  // false because it avoids type coercion
	NaN === NaN;   // false
	 +0 === -0;    // true

// reduce - returns a single value out of an array

var euros = [1, 2, 3, 4, 5]; // 1+2, 3+3, 6+4, 10+5 
var average = euros.reduce(function(previous, currentValue, index, array) // (1,2,1,[1, 2, 3, 4, 5])
{
	previous += currentValue;
	if( index === array.length-1) return previous/array.length;
	else return previous;
});
console.log(average);


var o = { 
    a: {value:1}, 
    b: {value:2}, 
    c: {value:3} 
};

var sum = Object.keys(o).reduce(function (previous, key)  // (a, b)
{
    return previous + o[key].value;
});
console.log(sum); // a23

sum = Object.keys(o).reduce(function (previous, key) // (0, a)
{
    return previous + o[key].value;
}, 0); // 0 is the initial value
console.log(sum); // 6

sum = Object.keys(o).reduce(function (previous, key) // (5, a)
{
    return previous + o[key].value;
}, 5); // 5 is the initial value
console.log(sum); // 11



// map - returns an new array with the same length, this method is good 
// when you need to format/process all the elements of your array.
var arr = ['jay', 'bose', 'sridhar'].map(function(value) {
	return value.toUpperCase();
});

console.log(arr); // [ 'JAY', 'BOSE', 'SRIDHAR' ]


// reduce - returns a single value out of an array
var euros = [1, 2, 3, 4, 5]; // 1+2, 3+3, 6+4, 10+5 
var average = euros.reduce(function(start, next, index, array) {
	start += next;
	if( index === array.length-1) return start/array.length;
	else return start;
});

console.log(average);


// every -  Returns true or false if all the elements in the array pass the test in the callback function.
// Check if everybody age over 18 years old.
var ages = [30, 43, 22, 14];  
var result = ages.every(function(value) {
	return value > 18;
});
console.log(result); // false


// filter - Very similar to every except that filter return an new array with the elements 
// that return true to the given function
var ages = [30, 43, 22, 14];
var result = ages.filter(function(value) {
	return value > 18;
});
console.log(result); // [ 30, 43, 22 ]


var result = [1,2,3].some(function(number) {
    return number === 2;
});

console.log(result);





var x = 1234567;
console.log( x.toString().length ); // 7
x = 1e4;
console.log( x.toString().length ); // 5
x = 1.2;
console.log( x.toString().length ); // 3


// 
var obj = { 'name': 'jay', 'school': 'willowcroft', 'location': 'didcot'};
// key
console.log( Object.keys(obj)[0] ); // name
// value
console.log( obj[Object.keys(obj)[0]] ); // jay


// indexOf() : method returns the first index at which a given element can be found in the array/String object, or -1 if it is not present
// Array.prototype.indexOf()
var arr = ['sridhar', 'muthu', 'kavitha', 'krishnan', 'vijaya'];
if(arr.indexOf('kavitha') !== -1)
{
	console.log(arr.indexOf('kavitha')); // 2
}

// String.prototype.indexOf()
var paragraph = 'The quick brown fox jumps over the lazy dog.';
if(paragraph.indexOf('fox') !== -1)
{
	console.log(paragraph.indexOf('fox')); // 16
}

*/






/*
// Last Element
var arr = ['a', 'b', 'c']; 
arr.forEach(function(value, index, array){
   if (index === array.length - 1){ 
       console.log("Last callback call at index " + index + " with value " + value ); // Last callback call at index 2 with value c
   }
});


var arr = [1, 2, 3]; 
arr.forEach(function(value, index, array){
  // Async Function
	setTimeout(function(){ 
		console.log(value); // 1 2 3
	}, 100);
});


var arr = [1, 2, 3]; 
for(var i = 0; i < arr.length; ++i) {
	// Async Function
	setTimeout(function(){ 
		console.log(arr[i]); // undefined undefined undefined -- wrong bcos arr[3] = undefined
	}, 100);
}

var arr = [1, 2, 3]; 
for(var i = 0; i < arr.length; ++i) {
	(function(i) {   // closure as a wrapper function
		// Async Function
		setTimeout(function(){ 
			console.log(arr[i]); // 1 2 3
		}, 100);
	})(i);
}

for(var i = 0; i < 3; ++i) {
	// Async Function
	setTimeout(function(){ 
		console.log(i); // 3 3 3 -- wrong
	}, 100);
}

for(var i = 0; i < 3; ++i) {
	(function(i) { // closure as a wrapper function
		// Async Function
		setTimeout(function(){
			console.log(i); // 0 1 2 -- correct
		}, 100);
	})(i);
}

*/


