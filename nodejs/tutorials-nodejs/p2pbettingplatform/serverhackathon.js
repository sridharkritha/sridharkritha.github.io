	// https://www.youtube.com/watch?v=UUA0YaBdqYk
	const express = require("express");
	const app = express();
	const port = 3000;
	// const httpServer = app.listen(port); // reuse the express 'http' server
	const httpServer = require("http").createServer(app); // explicitly create a 'http' server
	const io = require("socket.io")(httpServer);
	const path = require('path');
	const fs = require('fs');
	const { MongoClient } = require('mongodb');

	///////////////////////////////////////////////////////////////////////////


	app.use('/', express.static(path.join(__dirname, 'static')));
	app.use(express.json());// app.use(bodyParser.json());

	/////////////////////////// login(start) ///////////////////////////////////////////////////////////


	const mongoose = require('mongoose');
	const User = require('./model/user');
	const bcrypt = require('bcryptjs');
	const jwt = require('jsonwebtoken');

	const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk';
	// const uri = "mongodb+srv://sridharkritha:2244@cluster0.02kdt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
	// mongodb://localhost:27017/login-app-db

	// https://mongoosejs.com/docs/connections.html

	(async () => {
		try {
			await mongoose.connect('mongodb+srv://sridharkritha:2244@cluster0.02kdt.mongodb.net/p2pbettingplatformdb?retryWrites=true&w=majority', {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useCreateIndex: true
			});
			console.log("UserAccount DB connection : Success");
		} catch (error) {
			console.log("UserAccount DB connection error :", error);
		}

	})();
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	app.post('/api/register', async (req, res) => {
		const { username, password: plainTextPassword } = req.body;

		if (!username || typeof username !== 'string') {
			return res.json({ status: 'error', error: 'Invalid username' });
		}

		if (!plainTextPassword || typeof plainTextPassword !== 'string') {
			return res.json({ status: 'error', error: 'Invalid password' });
		}

		if (plainTextPassword.length < 5) {
			return res.json({
				status: 'error',
				error: 'Password too small. Should be at-least 6 characters'
			});
		}

		const password = await bcrypt.hash(plainTextPassword, 10); // passes = 10

		try {
			const response = await User.create({
				username,
				password
			});
			console.log('User created successfully: ', response);
		} catch (error) {
			if (error.code === 11000) {
				// duplicate key
				return res.json({ status: 'error', error: 'Username already in use' });
			}
			throw error;
		}

		res.json({ status: 'ok' });
	});

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	app.post('/api/login', async (req, res) => {
		const { username, password } = req.body;
		const user = await User.findOne({ username }).lean();

		if (!user) {
			return res.json({ status: 'error', error: 'Invalid username/password' });
		}

		if (await bcrypt.compare(password, user.password)) {
			// the username, password combination is successful
			// generate jwt token
			const token = jwt.sign(	{
									id: user._id,
									username: user.username
								},
								JWT_SECRET
							);

			return res.json({ status: 'ok', data: token }); // send the token to client
		}

		res.json({ status: 'error', error: 'Invalid username/password' });
	});

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	app.post('/api/change-password', async (req, res) => {
		const { token, newpassword: plainTextPassword } = req.body;

		if (!plainTextPassword || typeof plainTextPassword !== 'string') {
			return res.json({ status: 'error', error: 'Invalid password' });
		}

		if (plainTextPassword.length < 5) {
			return res.json({
				status: 'error',
				error: 'Password too small. Should be atleast 6 characters'
			});
		}

		try {
			const user = jwt.verify(token, JWT_SECRET); // is token tampered ?

			const _id = user.id;

			const password = await bcrypt.hash(plainTextPassword, 10);

			await User.updateOne(
				{ _id },
				{
					$set: { password }
				}
			);
			res.json({ status: 'ok' });
		} catch (error) {
			console.log(error);
			res.json({ status: 'error', error: ';))' });
		}
	});

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	app.post('/api/placeBet', async (req, res) => {
		const { token, betstr, oddvalue } = req.body;

		try {
			const user = jwt.verify(token, JWT_SECRET); // is token tampered ?

			const _id = user.id;

			console.log("betAfter: ", betstr);


			// array update
			// {
			// 	'links':[ {
			// 			 "text" : "XYZ1",
			// 			 "url" : "www.xyz.com1"
			// 		    } ]
			//     }

			
			// db.users.update ({_id: '123'}, { '$set': {"friends.0.emails.0.email" : '2222'} });

			// await updateListingByName(client, MONGO_DATABASE_NAME, MONGO_COLLECTION_NAME, {name: "Sridhar"}, { wins: 12799 });
			// await updateListingByName(client, MONGO_DATABASE_NAME, MONGO_COLLECTION_NAME, JSON.parse(data).findObject, JSON.parse(data).updateObject);
			
			let changeObj = {};
			changeObj[betstr] = oddvalue; // need temp object. Direct object assingment NOT works => { betstr : oddvalue }
			const result = await updateListingByName(client, MONGO_DATABASE_NAME, MONGO_COLLECTION_NAME, 
									{}, changeObj);

			console.log("Placed bet sucessfully: ", result);

			// working
			// await updateListingByName(client, MONGO_DATABASE_NAME, MONGO_COLLECTION_NAME, 
			// 	{'horseRace.uk.Cartmel.2021-09-20.12:00.players.0.horseName': "11 French Company"}, 
			// 	{'horseRace.uk.Cartmel.2021-09-20.12:00.players.0.backOdds' : [1,2,3]});

			res.json({ status: 'ok' });
		} catch (error) {
			console.log(error);
			res.json({ status: 'error', error });
		}
	});

	/////////////////////////// login(end) /////////////////////////////////////////////////////////////
	
	const MONGO_DATABASE_NAME = 'p2pbettingplatformdb';
	const MONGO_COLLECTION_NAME = 'sportscollection';
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

	// main().catch(console.error);

	async function returnAllDouments(client, dataBaseName, collectionName) {
		// See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#find for the find() docs
		// const cursor = await client.db(dataBaseName).collection(collectionName).find({ }, {_id: 1, name: 1, wins: 1 });
		// const cursor = await COLL.find({ }, {_id: 1, name: 1, wins: 1 });
		if(COLL) {
			const cursor = await COLL.find({ }, {});

			// Store the results in an array
			const results = await cursor.toArray();

			io.emit('myEvent', JSON.stringify({ ...results }));

			// Print the results
			if (results.length > 0) {
				console.log(`Documents found inside the collection - ${collectionName} :`);
				results.forEach((result, i) => {
					console.log(`${i + 1}. : ${JSON.stringify(result)}`);
					// console.log(`   wins: ${result.wins}`);
				});
			} else {
				console.log("NO document found in the database");
			}
		}
	}


	// Read the json file from local storage and move to mongodb atlas
	function uploadLocalJsonCollectionToDB(client, dataBaseName, collectionName) {
		
		//////////////////////////// Read json by nodejs fs (start) ////////////////////
		// var jsonObject;
		fs.readFile('db/sportsDB.json', 'utf8', function (err, data) {
		  if (err) {
			console.error("Unable to read the json file");
			throw err;
		  }
		  console.error("Read the local json successfully");
		  const jsonObject = JSON.parse(data);
		  console.log(jsonObject);
		  createMultipleDocuments(client, dataBaseName, collectionName, [jsonObject]);
		});
		//////////////////////////// Read json by nodejs fs (end) //////////////////////
	}

	/**
	 * Create multiple documents inside the collection inside the database inside the cluster
	 * documents => collection => database => cluster
	 * @param {MongoClient} client A MongoClient that is connected to a cluster with the racecardDB database
	 */
	async function createMultipleDocuments(client, dataBaseName, collectionName, collData) {
		// let collData =  [	{ name: "Jay",		wins: 5, location: { city: "Chennai", country: "India"} },
		// 					{ name: "Sridhar",	wins: 9, location: { city: "London",  country: "UK"}},
		// 					{ name: "Sumitha",	wins: 7, location: { city: "Didcot",  country: "America"}}
		// ];

		// See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#insertMany for the insertMany() docs
		const result = await client.db(dataBaseName).collection(collectionName).insertMany(collData);

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
		changeStream.on('change', (changedData) => {
			console.log(changedData);
			if(changedData.operationType === 'update') {
				const updatedFieldsObject = changedData.updateDescription.updatedFields;
				io.emit('myEventChangeHappened', JSON.stringify(updatedFieldsObject));
			} else if(change.operationType === 'insert') { 
			} else if(change.operationType === 'delete') { }
		});

		// Wait the given amount of time and then close the change stream
		// await closeChangeStream(timeInMs, changeStream);
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
		await monitorListingsUsingEventEmitter(client, MONGO_DATABASE_NAME, MONGO_COLLECTION_NAME, 30000);

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



	httpServer.listen(port, async () => {
		console.log("Server is running on the port: " + httpServer.address().port);

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
				await client.connect();
				console.log("Cluster connection is successfully");


				DB = client.db(MONGO_DATABASE_NAME);
				if(!DB) {
					console.log(`Database - ${MONGO_DATABASE_NAME} - connection error`);
					return console.error(DB);
				}
				console.log(`Database - ${MONGO_DATABASE_NAME} - connected successfully`);

				COLL = DB.collection(MONGO_COLLECTION_NAME);
				if(!COLL) {
					console.log(`Collection - ${MONGO_COLLECTION_NAME} - connection error`);
					return console.error(COLL);
				}
				console.log(`Collection - ${MONGO_COLLECTION_NAME} - connected successfully`);

				// 0. Upload json doc(a set of collection) to db
				// uploadLocalJsonCollectionToDB(client, MONGO_DATABASE_NAME, MONGO_COLLECTION_NAME);

		} catch(e) {
			console.error(e);
		}
		
	});

