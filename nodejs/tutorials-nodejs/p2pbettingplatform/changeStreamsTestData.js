	// https://zellwk.com/blog/async-await/
	/**
	 * This script can be used to create, update, and delete sample data.
	 * This script is especially helpful when testing change streams.
	 */
	const { MongoClient } = require('mongodb');
	const MONGO_DATABASE_NAME = 'racecardDB';
	const MONGO_COLLECTION_NAME = 'horserace';

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
				await updateListing(client, MONGO_DATABASE_NAME, MONGO_COLLECTION_NAME, {name: "Sridhar"}, { wins: counter });
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