// Namespace using Module Pattern 
// https://javascriptweblog.wordpress.com/2010/12/07/namespacing-in-javascript/
// https://liangwu.wordpress.com/2016/07/11/module-pattern-variations-and-common-practices/
const fs = require('fs').promises; // promise version of require('fs');
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
		
			const timeDate = `${time}  ${date}`;
		
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

		isFileExist: async (fileName) => { 
			// const result = await fs.stat(fileName).then(() => true).catch(() => false);
			// return result;  // same as below one line statement
			return await fs.stat(fileName).then(() => true).catch(() => false); // caller: await isFileExist(); =>  MUST have await bcos true/false is wrapped by promise bcos of async function
		},

		readJsonFile: async(fileName) => {
			try {
					const data = await fs.readFile(fileName, 'utf8'); // promise is returned
					const jsonObject = JSON.parse(data);
					console.log(`Read the ${fileName} file successfully`);
					// console.log(jsonObject);
					return jsonObject;
			}
			catch(e) {
				console.error(`ERROR: Unable to read the ${fileName} file`);
				console.log(e);
			}
		},

		writeJsonFile: async(jsonString, fileName, isOverwriteNotAllowed) => {
			// 1. create a file if NOT exist
			// 2. By default, the file overwrites (isOverwriteNotAllowed = false)
			let  isFileExist = false;

			if(isOverwriteNotAllowed) {
				isFileExist = await UTIL.isFileExist(fileName); // await is MUST
			}

			if(!isFileExist) {
				try {
					await fs.writeFile(fileName, JSON.stringify(jsonString, null, 2), 'utf8'); // promise is returned
					// console.log(`Writing to the ${fileName} file is successfully`);
				}
				catch(e) {
					console.error(`ERROR: Unable to write the ${fileName} file`);
					console.log(e);
				}
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
module.exports.getCurrentTimeDate = UTIL.getCurrentTimeDate;
module.exports.getDefaultOptions = UTIL.getDefaultOptions;
module.exports.isFileExist = UTIL.isFileExist;
module.exports.readJsonFile = UTIL.readJsonFile;
module.exports.writeJsonFile = UTIL.writeJsonFile;
module.exports.randomIntFromInterval = UTIL.randomIntFromInterval;
module.exports.milliSecondsToHMS = UTIL.milliSecondsToHMS;
module.exports.getTimeFromDateObj = UTIL.getTimeFromDateObj;
module.exports.roundIt = UTIL.roundIt;











