// https://www.youtube.com/watch?v=fbYExfeFsI0&list=PLs6v2qXhOYxn02wymtvXtrfLWswfWbAWO&index=3&t=916s
// https://github.com/mongodb-developer/nodejs-quickstart
// https://www.mongodb.com/developer/quickstart/node-crud-tutorial-3-3-2/
// by Lauren Schaefer

// mongodb - CURD

const {MongoClient} = require('mongodb');

async function main() {
    // connection uri
    const uri = "mongodb+srv://sridharkritha:2244@cluster0.02kdt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    // create instance of mongo clinet
    const client = new MongoClient(uri);

    // connect to cluster
    try {
        await client.connect();
        // await listAllDatabases(client); // get all db's from cluster
        // CRUD - create / read / update / delete
        /*
        // 1a. Create a new document inside a collection inside a database
        await createNewDocument(client, {
            name:"Pebble Drive",
            summary:"Sweet Home",
            bedrooms:2
        });
        */
        // 1b. Create multiple documents
        await createMultipleDocuments(client, [
            {
                name: "Infinite Views",
                summary: "Modern home with infinite views from the infinity pool",
                property_type: "House",
                bedrooms: 5,
                bathrooms: 4.5,
                beds: 5
            },
            {
                name: "Private room in London",
                property_type: "Apartment",
                bedrooms: 1,
                bathroom: 1
            },
            {
                name: "Beautiful Beach House",
                summary: "Enjoy relaxed beach living in this house with a private beach",
                bedrooms: 4,
                bathrooms: 2.5,
                beds: 7,
                last_review: new Date()
            }
        ]);

        /*
        // 2a. Read / Find a single doc
        await findOneDocument(client, {name:"Pebble Drive"});
  
        // 2b. Read / Find the multiple doc
        await findListOfDocuments(client, {
            minimumNumberOfBedrooms: 4,
            minimumNumberOfBathrooms: 2,
            maximumNumberOfResults: 5
        });
        */

    } catch(e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function listAllDatabases(client) {
    const list = await client.db().admin().listDatabases();
    console.log("Databases List");
    list.databases.forEach(db=> console.log(`- ${db.name}`));
}

async function createNewDocument(mongoClient, newDoc) {
    // db         => sample_airbnb
    // collection => listingsAndReviews
    const result = await mongoClient.db("sample_airbnb").collection("listingsAndReviews")
                                    .insertOne(newDoc);
    console.log(`Newly added doc id: ${result.insertedId}`);
}


/**
 * Create multiple Airbnb listings
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_airbnb database
 * @param {Object[]} newListings The new listings to be added
 */
 async function createMultipleDocuments(client, newListings){
    // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#insertMany for the insertMany() docs
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertMany(newListings);

    console.log(`${result.insertedCount} new listing(s) created with the following id(s):`);
    console.log(result.insertedIds);
}

async function findOneDocument(mongoClient, searchValue) {
    const result = await mongoClient.db("sample_airbnb").collection("listingsAndReviews")
                                    .findOne(searchValue);
    if(result) console.log(result); // console.log(`found: ${result}`);
    else console.log('Not found');
}

/**
 * Print Airbnb listings with a minimum number of bedrooms and bathrooms.
 * Results will be limited to the designated maximum number of results.
 * Results will be sorted by the date of the last review in descending order.
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_airbnb database
 * @param {object} queryParams The query params object
 * @param {number} queryParams.minimumNumberOfBedrooms The minimum number of bedrooms
 * @param {number} queryParams.minimumNumberOfBathrooms The minimum number of bathrooms
 * @param {number} queryParams.maximumNumberOfResults The maximum number of Airbnb listings to be printed
 */
 async function findListOfDocuments(client, {
    minimumNumberOfBedrooms = 0,
    minimumNumberOfBathrooms = 0,
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER
} = {}) {

    // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#find for the find() docs
    const cursor = client.db("sample_airbnb").collection("listingsAndReviews")
        .find({
            bedrooms: { $gte: minimumNumberOfBedrooms },     // gte: greater than or equal to
            bathrooms: { $gte: minimumNumberOfBathrooms }
        }
        )
        .sort({ last_review: -1 })   // latest review ie., from last to first
        .limit(maximumNumberOfResults);

    // Store the results in an array
    const results = await cursor.toArray();

    // Print the results
    if (results.length > 0) {
        console.log(`Found listing(s) with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms:`);
        results.forEach((result, i) => {
            const date = new Date(result.last_review).toDateString();

            console.log();
            console.log(`${i + 1}. name: ${result.name}`);
            console.log(`   _id: ${result._id}`);
            console.log(`   bedrooms: ${result.bedrooms}`);
            console.log(`   bathrooms: ${result.bathrooms}`);
            console.log(`   most recent review date: ${date}`);
        });
    } else {
        console.log(`No listings found with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms`);
    }
}
