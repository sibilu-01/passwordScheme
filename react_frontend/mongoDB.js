//const colours = require('./colours.js');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://sibilu:123whatsgood@cluster0-imwg0.mongodb.net/test?retryWrites=true&w=majority"


// MongoClient.connect(url, function(err, client) {
//    if(err) {
//         console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
//    }
//    console.log('Connected...');
//    const collection = client.db("test").collection("devices");
//    // perform actions on the collection object
//    client.close();
// });

const createCollection = (collectionName) => 
{
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.createCollection(collectionName, function(err, res) {
            if (err) throw err;
            console.log("Collection created!");
            db.close();
        });
    });
}

const addData = (collectionName, data) => MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection(collectionName).insertMany(data, function(err, res) {
      if (err) throw err;
      console.log("Number of documents inserted: " + res.insertedCount);
      db.close();
    });
});

const findData = (collectionName, query) => MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection(collectionName).find(query).toArray(function(err, result) {
      if (err) throw err;
      console.log('result is =' + result);
      db.close();
    });
});

const deleteData = (collectionName, query) => MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection(collectionName).deleteMany(query, function(err, obj) {
      if (err) throw err;
      console.log(obj.result.n + " document(s) deleted");
      db.close();
    });
});

const dropCollection = (collectionName) => MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection(collectionName).drop(function(err, delOK) {
      if (err) throw err;
      if (delOK) console.log("Collection deleted");
      db.close();
    });
});

module.exports = {
    createCollection: createCollection,
    addData: addData,
    findData: findData,
    deleteData: deleteData,
    dropCollection: dropCollection
}