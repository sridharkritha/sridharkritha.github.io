	const express = require("express");
	const app = express();
	const httpServer = require("http").createServer(app);
	const io = require("socket.io")(httpServer);
	const { MongoClient } = require('mongodb');
	const port = 3000;

	const dataBaseName = 'racecardDB';
	const collectionName = 'horserace';
	let client = null; // mongodb client

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
			await client.connect();



			// 1. Add some documents inside the collection
			// await createMultipleDocuments(client, dataBaseName, collectionName);

			// 2. Delete ALL documents inside the collection
			// await dropAllDocuments(client, dataBaseName, collectionName);

			// 3. Update any single document with the new value ({ wins: 99 }) - only if the document has {name: "Sridhar"} entry.
			// await updateListingByName(client, dataBaseName, collectionName, {name: "Sridhar"}, { wins: 99 });

			/**
			 * An aggregation pipeline that matches on new listings in the country of Australia and the Sydney market
			 */
			const pipeline = [
				{
					'$match': {
						'operationType': 'insert',       // 'update',
						'fullDocument.location.country': 'India',
						'fullDocument.location.city': 'Chennai'
					}
				}
			];

			// Monitor new listings using EventEmitter's on() function.
			// await monitorListingsUsingEventEmitter(client, dataBaseName, collectionName, 30000, pipeline);

		} finally {
			// Close the connection to the MongoDB cluster
			// await client.close(); // why we need to close it ??
		}
	}

	main().catch(console.error);


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

	io.on('connection', (socket) => {
		console.log('user connected');
		socket.on('myEvent', async (data) => {      // note: async
			console.log('user joined room');
			console.log(data);
			// socket.join(data.myID);
			try {
				// await updateListingByName(client, dataBaseName, collectionName, {name: "Sridhar"}, { wins: 12799 });
				await updateListingByName(client, dataBaseName, collectionName, JSON.parse(data).findObject, JSON.parse(data).updateObject);
			} catch (e) {
				console.error(e);
			}
		});
	});

	// Listen the HTTP Server 
	httpServer.listen(port, () => {
		console.log("Server Is Running Port: " + port);
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