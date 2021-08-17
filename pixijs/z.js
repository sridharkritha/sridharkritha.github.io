// test: 
/*
1. fun() + fun()

2. fun();
   fun();
3. Ternary tree:
	fun()
	fun()
	fun()

*/

var c = 0;
/*

function bar(n) {
	if(n<1) return;
	// console.log(++c); // total loop count = 4 times for 4
	console.log(n); // pre Order: 4 3 2 1
	bar(n-1);        
	console.log(n); // in/post Order: 1 2 3 4
}
// 4 3 2 1 1 2 3 4



function bar(n) {
	if(n<1) return;
	//console.log(++c);  // total loop count = 2 times for 4
	console.log(n); // pre Order: 4 2
	bar(n-2);       
	console.log(n); // in/post Order: 2 4
}
// 4 2 2 4



function bar(n) {
	if(n<1) return;
	//console.log(++c); // total loop count = 15 times for 4
	
	console.log(n); // pre Order: 4  3  2  1  1  2  1  1  3  2  1  1  2  1  1
	bar(n-1);        
	console.log(n); // in Order: 1  2  1  3  1  2  1  4  1  2  1  3  1  2  1
	bar(n-1);
	console.log(n); // post Order: 1  1  2  1  1  2  3  1  1  2  1  1  2  3  4  
}
// 4  3  2  1  1  1  2  1  1  1  2  3  2  1  1  1  2  1  1  1  2  3  4  3  2  1  1  1  2  1  1  1  2  3  2  1  1  1  2  1  1  1  2  3  4



function bar(n) {
	if(n<1) return;
	//console.log(++c); // total loop count = 7 times for 4
	
	console.log(n); // pre Order:  4  3  2  1  1  2  1  
	bar(n-1);        
	console.log(n); // in Order:  1  2  3  1  4  1  2  
	bar(n-2);
	console.log(n); // post Order: 1  2  1  3  1  2  4  
}
//  4  3  2  1  1  1  2  2  3  1  1  1  3  4  2  1  1  1  2  2  4  





function bar(n) {
	if(n<1) return;
	// total loop count = 40 times for 4
	// total loop count = 13 times for 3
	// console.log(++c);
	
	console.log(n); // pre Order:  3  2  1  1  1  2  1  1  1  2  1  1  1  
	bar(n-1);
	console.log(n); // in Order:  1  2  1  1  3  1  2  1  1  1  2  1  1  
	bar(n-1);	
	console.log(n); // in Order:  1  1  2  1  1  1  2  1  3  1  1  2  1  
	bar(n-1);
	console.log(n); // post Order: 1  1  1  2  1  1  1  2  1  1  1  2  3  
}
bar(3);
// 3  2  1  1  1  1  2  1  1  1  1  2  1  1  1  1  2  3  2  1  1  1  1  2  1  1  1  1  2  1  1  1  1  2  3  2  1  1  1  1  2  1  1  1  1  2  1  1  1  1  2  3  

function bar(n) {
	if(n<1) return;
	
	//console.log(++c); // total loop count = 4 times for n = 3
	
	console.log(n); // pre Order:  3  2  1  1
	bar(n-1);
	console.log(n); // in Order:  1  2  3  1   
	bar(n-2);	
	console.log(n); // in Order:  1 2 1 3
	bar(n-3);
	console.log(n); // post Order: 1 2 1 3
}
// 3  2  1  1  1  1  2  2  2  3  1  1  1  1  3  3  


bar(3);
*/

let v = 0;
for(let i = 0; i < 4; ++i) console.log(v++); // 0 1 2 3
                                            // 1 2 3 4 = ++v
                                               // 1 1 1 1   = v+ 1

/*
function fun(v)
{
	if(v > 3) return; // exit condition
	console.log(v);  // 0 1 2 3
	fun(++v); // k++ gives infinite number of zero's and then stack overflow
	console.log(v); // 4 3 2 1
}
fun(0);
// 0 1 2 3 4 3 2 1


function fun(v)
{
	if(v > 3) return; // exit condition
	//console.log(v);  // 0 1 2 3
	fun(v + 1); // k++ gives infinite number of zero's and then stack overflow
	console.log(v); // 3 2 1 0
}
fun(0);
// 0 1 2 3 3 2 1 0

*/

/*
function fun(v)
{
	if(v < 1) return; // exit condition
	console.log(v);  // 4 3 2 1
	fun(--v); // k++ gives infinite number of zero's and then stack overflow
	console.log(v); // 0 1 2 3
}
fun(4);
// 4 3 2 1 0 1 2 3



function fun(v)
{
	if(v < 1) return; // exit condition
	console.log(v);  // 4 3 2 1
	fun(v -1); // k++ gives infinite number of zero's and then stack overflow
	console.log(v); // 1 2 3 4
}
// 4 3 2 1 1 2 3 4
fun(4);

*/

















// window.addEventListener('load', function () {
// 	// Global variables
// 	let app = null;

// 	init();


// 	function init() {
// 	}

// }, false);