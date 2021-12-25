// Namespace using Module Pattern 
// https://javascriptweblog.wordpress.com/2010/12/07/namespacing-in-javascript/
// https://liangwu.wordpress.com/2016/07/11/module-pattern-variations-and-common-practices/
const fs = require('fs');
const UTIL = (function() {
	// Private Members
	return {
		
		// Public Members
		getCurrentTimeDate: function() {
			const today = new Date();
			const date = (today.getDate().toString().length < 2 ? '0'+ today.getDate() : today.getDate())
								+'-'+
						((today.getMonth()+1).toString().length < 2 ? '0'+ (today.getMonth()+1) : (today.getMonth()+1))
								+'-'+	today.getFullYear();
			const time = (today.getHours().toString().length < 2 ? '0'+ today.getHours() : today.getHours())
								+':'+
						(today.getMinutes().toString().length < 2 ? '0'+ today.getMinutes() : today.getMinutes())
								+':'+
						(today.getSeconds().toString().length < 2 ? '0'+ today.getSeconds() : today.getSeconds());
		
			const timeDate = time + '		' + date;
		
			return timeDate;
		},

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

		writeJsonFile: function(jsonString, fileName) {
			const jsonFormat = jsonString;
	
			if(typeof jsonString === 'string') {
				jsonFormat = JSON.parse(jsonString);
			}
			
			const data = JSON.stringify(jsonFormat, null, 2);
			
			// Asynchronous file write
			fs.writeFile(fileName, data, function(err) {
				if (err) throw err;
				//console.log('Data written to file');
			});
		},

		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		randomIntFromInterval: function (min, max) { // min and max included 
			return Math.floor(Math.random() * (max - min + 1) + min);
		}

	};
})();


// exports the variables and functions above so that other modules can use them
module.exports.getCurrentTimeDate = UTIL.getCurrentTimeDate;
module.exports.getDefaultOptions = UTIL.getDefaultOptions;
module.exports.writeJsonFile = UTIL.writeJsonFile;
module.exports.randomIntFromInterval = UTIL.randomIntFromInterval;






