	const express = require("express");
	const app = express();
	const httpServer = require("http").createServer(app);
	const io = require("socket.io")(httpServer);
	const { MongoClient } = require('mongodb');
	const port = 3000;

	const MONGO_DATABASE_NAME = 'racecardDB';
	const MONGO_COLLECTION_NAME = 'horserace';
	let client = null; // mongodb client
	let DB = null;     // database
	let COLL = null;   // collection
	/**
	 * An aggregation pipeline that matches on new listings in the country of Australia and the Sydney market
	 */
	const pipeline = [
		{
			'$match': {
			// 'operationType': 'insert',
			// 'fullDocument.location.country': 'India',
			// 'fullDocument.location.city': 'Chennai'

			'operationType': 'update'

			}
		}
	];

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
		client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

		try {
			// Connect to the MongoDB cluster
			// await client.connect();

			// await connectToCluster(client);
			client.connect(async (err) => {
			if (err) {
				console.log("Cluster connection error");
				return console.error(err);
			}
			console.log("Cluster connection is successfully");

			DB = client.db(MONGO_DATABASE_NAME);
			if(!DB) {
				console.log(`Database - ${MONGO_DATABASE_NAME} - connection error`);
				return console.error(DB);
			}
			console.log(`Database - ${MONGO_DATABASE_NAME} - connected successfully`);

			COLL = client.db(MONGO_COLLECTION_NAME);
			if(!COLL) {
				console.log(`Collection - ${MONGO_COLLECTION_NAME} - connection error`);
				return console.error(COLL);
			}
			console.log(`Collection - ${MONGO_COLLECTION_NAME} - connected successfully`);

			// const result = await client.db(MONGO_DATABASE_NAME).collection(MONGO_COLLECTION_NAME).find( { }, {_id: 0, names: 1, wins: 1 } );
			// console.log(result);

			// await returnAllDouments(client, MONGO_DATABASE_NAME, MONGO_COLLECTION_NAME);
			});

			// 1. Add some documents inside the collection
			// await createMultipleDocuments(client, MONGO_DATABASE_NAME, MONGO_COLLECTION_NAME);

			// 2. Delete ALL documents inside the collection
			// await dropAllDocuments(client, MONGO_DATABASE_NAME, MONGO_COLLECTION_NAME);

			// 3. Update any single document with the new value ({ wins: 99 }) - only if the document has {name: "Sridhar"} entry.
			// await updateListingByName(client, MONGO_DATABASE_NAME, MONGO_COLLECTION_NAME, {name: "Sridhar"}, { wins: 99 });



			// Monitor new listings using EventEmitter's on() function.
			// await monitorListingsUsingEventEmitter(client, MONGO_DATABASE_NAME, MONGO_COLLECTION_NAME, 30000, pipeline);
		} finally {
			// Close the connection to the MongoDB cluster
			// await client.close(); // why we need to close it ??
		}
	}

	main().catch(console.error);

	async function returnAllDouments(client, dataBaseName, collectionName) {
		// See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#find for the find() docs
		const cursor = await client.db(dataBaseName).collection(collectionName).find({ }, {_id: 1, name: 1, wins: 1 });

		// Store the results in an array
		const results = await cursor.toArray();

		io.emit('myEvent', JSON.stringify({ ...results }));

		// Print the results
		if (results.length > 0) {
			console.log(`Documents found inside the collection - ${collectionName} :`);
			results.forEach((result, i) => {
				console.log(`${i + 1}. names: ${result.name}`);
				console.log(`   wins: ${result.wins}`);
			});
		} else {
			console.log("NO document found in the database");
		}
	}

	/**
	 * Create multiple documents inside the collection inside the database inside the cluster
	 * documents => collection => database => cluster
	 * @param {MongoClient} client A MongoClient that is connected to a cluster with the racecardDB database
	 */
	async function createMultipleDocuments(client, dataBaseName, collectionName) {
		let raceCard =  [	{ name: "Jay",		wins: 5, location: { city: "Chennai", country: "India"} },
							{ name: "Sridhar",	wins: 9, location: { city: "London",  country: "UK"}},
							{ name: "Sumitha",	wins: 7, location: { city: "Didcot",  country: "America"}}
		];

		// See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#insertMany for the insertMany() docs
		const result = await client.db(dataBaseName).collection(collectionName).insertMany(raceCard);

		console.log(`${result.insertedCount} new listing(s) created with the following id(s):`);
		console.log(result.insertedIds);
	}

	async function dropAllDocuments(client, dataBaseName, collectionName) {
		// Delete collection including all its documents
		let result = await client.db(dataBaseName).collection(collectionName).drop();
		// console.log("drop =>" + result);

		// Re-create a collection again
		result = await client.db(dataBaseName).createCollection(collectionName);
		// console.log(result);
	}

	/**
	 * Update an Airbnb listing with the given name
	 * Note: If more than one listing has the same name, only the first listing the database finds will be updated.
	 * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_airbnb database
	 * @param {string} nameOfListing The name of the listing you want to update
	 * @param {object} updatedListing An object containing all of the properties to be updated for the given listing
	 */
	async function updateListingByName(client, dataBaseName, collectionName, findObject, updateObject) {
		// See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#updateOne for the updateOne() docs
		const result = await client.db(dataBaseName).collection(collectionName).updateOne(findObject, { $set: updateObject });

		console.log(`${result.matchedCount} document(s) matched the query criteria.`);
		console.log(`${result.modifiedCount} document(s) was/were updated.`);
	}

	/**
	 * Monitor listings in the listingsAndReviews collections for changes
	 * This function uses the on() function from the EventEmitter class to monitor changes
	 * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_airbnb database
	 * @param {Number} timeInMs The amount of time in ms to monitor listings
	 * @param {Object} pipeline An aggregation pipeline that determines which change events should be output to the console
	 */
	async function monitorListingsUsingEventEmitter(client, dataBaseName, collectionName, timeInMs = 60000, pipeline = []) {
		const collection = client.db(dataBaseName).collection(collectionName);

		// See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#watch for the watch() docs
		const changeStream = collection.watch(pipeline);


		// ChangeStream inherits from the Node Built-in Class EventEmitter (https://nodejs.org/dist/latest-v12.x/docs/api/events.html#events_class_eventemitter).
		// We can use EventEmitter's on() to add a listener function that will be called whenever a change occurs in the change stream.
		// See https://nodejs.org/dist/latest-v12.x/docs/api/events.html#events_emitter_on_eventname_listener for the on() docs.
		changeStream.on('change', (next) => {
			console.log(next);
		});

		// Wait the given amount of time and then close the change stream
		await closeChangeStream(timeInMs, changeStream);
	}

	/**
	 * Close the given change stream after the given amount of time
	 * @param {*} timeInMs The amount of time in ms to monitor listings
	 * @param {*} changeStream The open change stream that should be closed
	 */
	function closeChangeStream(timeInMs = 60000, changeStream) {
		return new Promise((resolve) => {
			setTimeout(() => {
				console.log("Closing the change stream");
				changeStream.close();
				resolve();
			}, timeInMs);
		});
	}

	////////////////////////////////////////////////////////////////////////////////

	// io.on('myEventClientReady', async (data) => {
	// 	console.log("Server: Recieved 'myEventClientReady' even from client");
	// 	if(JSON.parse(data).isClientReady) {
	// 		await returnAllDouments(client, MONGO_DATABASE_NAME, MONGO_COLLECTION_NAME);
	// 	}
	// });

	io.on('connection', async (socket) => {
		console.log('Server: A new client connected to me');
		await returnAllDouments(client, MONGO_DATABASE_NAME, MONGO_COLLECTION_NAME);
		// await monitorListingsUsingEventEmitter(client, MONGO_DATABASE_NAME, MONGO_COLLECTION_NAME, 30000, pipeline);
		// await monitorListingsUsingEventEmitter(client, MONGO_DATABASE_NAME, MONGO_COLLECTION_NAME, 30000);

		socket.on('mySubmitEvent', async (data) => {      // note: async
			console.log('user joined room');
			console.log(data);
			// socket.join(data.myID);
			try {
				// await updateListingByName(client, MONGO_DATABASE_NAME, MONGO_COLLECTION_NAME, {name: "Sridhar"}, { wins: 12799 });
				await updateListingByName(client, MONGO_DATABASE_NAME, MONGO_COLLECTION_NAME, JSON.parse(data).findObject, JSON.parse(data).updateObject);
			} catch (e) {
				console.error(e);
			}
		});
	});

	// Listen the HTTP Server 
	httpServer.listen(port, () => {
		console.log("Server is running on the port: " + port);
	});















/*
	const mongoose = require('mongoose');
	// const createDeleteAPI = require('./routes/createDeleteAPI');
	const port = 3000;


	// const router = express.Router();

	// CREATE
	// router.post('/new', (req, res) => {
	//   Task.create({
	//     task: JSON.stringify({ "name": "raj", "age": "12"}), // req.body.task,
	//   }, (err, task) => {
	//     if (err) {
	//       console.log('CREATE Error: ' + err);
	//       res.status(500).send('Error');
	//     } else {
	//       res.status(200).json(task);
	//     }
	//   });
	// });


	// collections
	const Users = require('./UserModel');
	const db = mongoose.connection;

	// database connection

	mongoose.connect('mongodb://localhost:27119/sriDB?replicaSet=rs',{useNewUrlParser:true},
		function(err){
			if(err){
				console.log('Database connection error: ' + err);
				throw err;
			}
			console.log('Database connected');

			const myCollection = db.collection('sriCollection');
			const myChangeStream = myCollection.watch();



			myChangeStream.on('change', (change) => {
				console.log(change);
				
				if(change.operationType === 'insert') {
				const task = change.fullDocument;
				socket.emit('myEvent', JSON.stringify({ "name": "raj", "age": "12"}));
				} else if(change.operationType === 'delete') {
					socket.emit('myEvent', JSON.stringify({ "name": "raj", "age": "12"}));
				}
			});

			myCollection.insert( { "name": "jay", "age": "7"} );


			
			// io.on('connection',(socket)=>{
			//     console.log('user connected');
			//     socket.on('myEvent',(data)=>{      // data will look like => {myID: "123123"}
			//         console.log('user joined room');
			//         console.log(data);
			//         socket.join(data.myID);
			//     });
			// });

			// Users.watch().on('change',(change)=>{
			//     console.log('Something has changed');
			//     io.to(change.fullDocument._id).emit('changes',change.fullDocument);
			// });

	});





	// Listen the HTTP Server 
	httpServer.listen(port, () => {
		console.log("Server Is Running Port: " + port);
	});

	*/