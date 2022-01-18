// Namespace using Module Pattern 
const UTIL = (function() {
	// Private Members
	return {
		
		///////////////////////   Public Members ///////////////////////////////
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
		print: (level, msg) => {
			switch(level)
			{
				case "must":
					console.log(msg);
					break;
				case "info":
					console.log(msg);
					break;
				case "ignore":
					// console.log(msg);
					break;
				case "log":
					console.log(msg);
					break;
				default:
					console.log(msg);
					break;
			}
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		randomIntFromInterval: function (min, max) { // min and max included 
			return Math.floor(Math.random() * (max - min + 1) + min);
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// round after 2 decimal places
		roundIt: function(value) {
			// return Math.floor(value * 100) / 100;                    // 0.3 - 0.2 = 0.09  (or) 1.256 => 1.25 
			return Math.round((value + Number.EPSILON) * 100) / 100; // 0.3 - 0.2 = 0.1
		}
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	};
})();


// exports the variables and functions above so that other modules can use them
module.exports.getDefaultOptions = UTIL.getDefaultOptions;
module.exports.randomIntFromInterval = UTIL.randomIntFromInterval;
module.exports.roundIt = UTIL.roundIt;
module.exports.print = UTIL.print;














