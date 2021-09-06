	// https://zellwk.com/blog/async-await/
	/**
	 * This script can be used to create, update, and delete sample data.
	 * This script is especially helpful when testing change streams.
	 */
	const { MongoClient } = require('mongodb');
	const MONGO_DATABASE_NAME = 'p2pbettingplatformdb';
	const MONGO_COLLECTION_NAME = 'sportscollection';

	async function main() {
		/**
		 * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
		 * See https://docs.mongodb.com/drivers/node/ for more details
		 */
		const uri = "mongodb+srv://sridharkritha:2244@cluster0.02kdt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

		/**
		 * The Mongo Client you will use to interact with your database
		 * See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html for more details
		 * In case: '[MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated...'
		 * pass option { useUnifiedTopology: true } to the MongoClient constructor.
		 * const client =  new MongoClient(uri, {useUnifiedTopology: true})
		 */
		const client = new MongoClient(uri);

		try {
			// Connect to the MongoDB cluster
			await client.connect();


			let counter = 1;
			let clearSetIntervalRef = null;
			clearInterval(clearSetIntervalRef);
			//clearSetIntervalRef = setInterval(async () => {
				for(let i = 0; i < 100; ++i) {
				// await updateListingByName(client, MONGO_DATABASE_NAME, MONGO_COLLECTION_NAME, {name: "Sridhar"}, { wins: 12799 });



				// const gameName = 'horseRace';
				// const region = 'uk';
				// const raceName = 'Cartmel';
				// const date = '2021-09-20';
				// const time = '12:00';
			
				// // const ref = data[gameName][region][raceName][date][time];
				// const ref = gameName.region.raceName.date.time;
				// const matchType = ref.matchType;
				// const runLength = ref.runLength;
				// const players = ref.players;
	
				// elem4.innerHTML = players[i].backOdds[0];
				// elem4.innerHTML = players[i].backOdds[1];
				// elem4.innerHTML = players[i].backOdds[2];
				// elem4.innerHTML = players[i].layOdds[0];
				// elem4.innerHTML = players[i].layOdds[1];
				// elem4.innerHTML = players[i].layOdds[2];

				// const horseName = players[0].horseName;
				// const backOdd = players[0].backOdds[0];

				// https://stackoverflow.com/questions/19603542/mongodb-update-data-in-nested-field
				// db.users.update ({_id: '123'}, { '$set': {"friends.0.emails.0.email" : '2222'} });

				await updateListing(client, MONGO_DATABASE_NAME, MONGO_COLLECTION_NAME, 
					{
						"horseRace.uk.Cartmel.['2021-09-20'].['12:00'].players[0].horseName": "11 French Company"
					}, 
					{ 
						"horseRace.uk.Cartmel.['2021-09-20'].['12:00'].players[0].backOdds[0]": counter 
					});
				if(++counter > 100) clearInterval(clearSetIntervalRef);
				}
			//}, 1000);
		} finally {
			// Close the connection to the MongoDB cluster
			await client.close();
		}
	}

	main().catch(console.error);


	/**
	 * Update an Airbnb listing
	 * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_airbnb database
	 * @param {String} listingId The id of the listing you want to update
	 * @param {object} updatedListing An object containing all of the properties to be updated for the given listing
	 */
	async function updateListing(client, dataBaseName, collectionName, findObject, updateObject) {
		// See http://bit.ly/Node_updateOne for the updateOne() docs
		const result = await client.db(dataBaseName).collection(collectionName).updateOne(findObject, { $set: updateObject });

		console.log(`${result.matchedCount} document(s) matched the query criteria.`);
		console.log(`${result.modifiedCount} document(s) was/were updated.`);
	}