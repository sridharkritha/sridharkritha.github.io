// Win Constants with respect to sports
const WC = (function() {
	// Private Members

	const sportsWinConstants = {
		"tennis": {
			// "betAfterEventStarted": true, // "in-running-flag"
			// g_betMinutesOffset = -1; // place bet: +1 min before the start time, -5 min after the start time
			"g_betMinutesOffset": 3,         // g_betMinutesOffset

			"g_winConfidencePercentage": 80, // ex: 80 => (80% or more)

			"g_minProfitOdd": 0.7 // 0.7 => £0.7,  ex: 1 => £1 (1/1 = 1 even odd [or] 2.00 in decimal)
		}
	};

	return {

		// Public Members
		isFileExist: async (fileName) => { 
			// const result = await fs.stat(fileName).then(() => true).catch(() => false);
			// return result;  // same as below one line statement
			return await fs.stat(fileName).then(() => true).catch(() => false); // caller: await isFileExist(); =>  MUST have await bcos true/false is wrapped by promise bcos of async function
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	};
})();


// exports the variables and functions above so that other modules can use them
module.exports.isFileExist = FA.isFileExist;





