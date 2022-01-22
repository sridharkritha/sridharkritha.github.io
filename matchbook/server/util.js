// Namespace using Module Pattern 
const UTIL = (function() {
	// Private Members
	return {
		///////////////////////   Public Members ///////////////////////////////////////////////////////////////////////

		randomIntFromInterval: function (min, max) { // min and max included 
			return Math.floor(Math.random() * (max - min + 1) + min);
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		// round after 2 decimal places
		roundIt2D: function(value) {
			// return Math.floor(value * 100) / 100;                    // 0.3 - 0.2 = 0.09  (or) 1.256 => 1.25 
			return Math.round((value + Number.EPSILON) * 100) / 100; // 0.3 - 0.2 = 0.1
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
		// Check the given object is NULL object or NOT.
		isNullObject: (obj) => {
			for(let i in obj) return false;
			return true;
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		formatString : (str, length) => {
			// g_betScanRound.toString().padStart(5, "0"); // 1 ==> 00001
			if(str.length < length) return str.padEnd(length," ");
	
			console.log(`Error: String(${str}) length is larger than format length(${length})`);
			return null;
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		isSameDate : (dateObjOne, dateObjTwo) => {
			// check same date (Ignore any time difference) or not ?
			return dateObjOne.toISOString().split('T')[0] === dateObjTwo.toISOString().split('T')[0] ? true : false;
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		getDefaultOptions: function()
		{
			return {
				method: 'GET',
				headers: { 
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'user-agent': 'api-doc-test-client'
					//, 'Accept-Encoding': 'gzip' 
					, 'gzip': true
				}
			};
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	};
})();


// exports the variables and functions above so that other modules can use them
module.exports.getDefaultOptions = UTIL.getDefaultOptions;
module.exports.randomIntFromInterval = UTIL.randomIntFromInterval;
module.exports.roundIt2D = UTIL.roundIt2D;
module.exports.isNullObject = UTIL.isNullObject;
module.exports.formatString = UTIL.formatString;
module.exports.isSameDate = UTIL.isSameDate;














