/*
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
*/

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


