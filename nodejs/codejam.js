// Saving The Universe Again
// https://codejam.withgoogle.com/2018/challenges/00000000000000cb/dashboard

// Google Code Jam Qualification Round 2018
// Solution in Javascript / node.js
// By Sridhar

var readline = require('readline');

function totalDamage(s) 
{
	var damage = 0, charge = 1;
	for (var i = 0; i < s.length; ++i) {
		if (s[i] === 'S') {
			damage += charge;
		}
		else {
			charge *= 2;
		}
	}
	return damage;
}

// Change the characters in a string
function setCharAt(str, index, chr)
{
	if (index > str.length - 1) return str;
	return str.substr(0, index) + chr + str.substr(index + 1);
}


function solveCase(maxDamage, s, x) 
{
	// var s = 'SS'; // "CSCSS";
	// var maxDamage = 1; // 3;

	var damage = totalDamage(s);
	var nSwap = 0;
	var resultPrinted = false;

	for (var i = s.length - 2; i !== -1; --i) {
		damage = totalDamage(s);

		if (damage <= maxDamage) {
			console.log('Case #' + x + ': ' + nSwap);
			resultPrinted = true;
			break;
		}

		if (s[i] === 'C' && s[i + 1] === 'S') {
			s = setCharAt(s, i, 'S');
			s = setCharAt(s, i + 1, 'C');

			// s[i] = 'S';
			// s[i+1] = 'C';

			++nSwap;

			i = s.length - 2 + 1; // reset
		}
	}

	if (!resultPrinted) {
		console.log('Case #' + x + ': ' + 'IMPOSSIBLE');
	}
}

var rl = readline.createInterface({
	/* Method 1: Console base input and output */
	// input: process.stdin,
	// terminal: false
	/* Method 2:File based input and output */
	input: require('fs').createReadStream('small.txt')
});

var x = -1;
var tc = 0;
rl.on('line', function (line) {
	x++;

	if (x > 0) {
		var temp = line.split(' ');

		solveCase(parseInt(temp[0]), temp[1], ++tc);
	}
});