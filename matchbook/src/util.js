// Namespace using Module Pattern 
// https://javascriptweblog.wordpress.com/2010/12/07/namespacing-in-javascript/
// https://liangwu.wordpress.com/2016/07/11/module-pattern-variations-and-common-practices/
const fs = require('fs');
const UTIL = (function() {
	// Private Members
	return {
		
		// Public Members
		getTimeFromDateObj: function(dateObj) {
			const today = dateObj || new Date();
			
			const time = (today.getHours().toString().length < 2 ? '0'+ today.getHours() : today.getHours())
								+':'+
						(today.getMinutes().toString().length < 2 ? '0'+ today.getMinutes() : today.getMinutes())
								+':'+
						(today.getSeconds().toString().length < 2 ? '0'+ today.getSeconds() : today.getSeconds());		
			return time;
		},

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
		
			const timeDate = time + '\t' + date;
		
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

		writeJsonFile: function(jsonString, fileName, isOverwriteNotAllowed) {

			let  isFileExist = false;

			if(isOverwriteNotAllowed) {
				(async () => { 
					isFileExist = await fs.promises.stat(fileName	).then(() => true).catch(() => false);
				})();
			}

			if(!isFileExist) {
				let jsonFormat = jsonString;
	
				if(typeof jsonString === 'string') {
					jsonFormat = JSON.parse(jsonString);
				}
				
				const data = JSON.stringify(jsonFormat, null, 2);
				
				// Asynchronous file write
				fs.writeFile(fileName, data, function(err) {
					if (err) throw err;
					//console.log('Data written to file');
				});
			}
		},

		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		randomIntFromInterval: function (min, max) { // min and max included 
			return Math.floor(Math.random() * (max - min + 1) + min);
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Convert milliSeconds to hh:mm:ss format
		milliSecondsToHMS: function(milliSecs) {
			let secs = Math.floor(milliSecs / 1000);
			function z(n){return (n<10?'0':'') + n;}
			var sign = secs < 0? '-':'';
			secs = Math.abs(secs);
			return sign + z(secs/3600 |0) + ':' + z((secs%3600) / 60 |0) + ':' + z(secs%60);
		}
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		



	};
})();


// exports the variables and functions above so that other modules can use them
module.exports.getCurrentTimeDate = UTIL.getCurrentTimeDate;
module.exports.getDefaultOptions = UTIL.getDefaultOptions;
module.exports.writeJsonFile = UTIL.writeJsonFile;
module.exports.randomIntFromInterval = UTIL.randomIntFromInterval;
module.exports.milliSecondsToHMS = UTIL.milliSecondsToHMS;
module.exports.getTimeFromDateObj = UTIL.getTimeFromDateObj;










