var mongoClient = require('mongodb').MongoClient;
const url = require('../key').mongodb;
var ObjectId = require('mongodb').ObjectID;
var dbmodel = {
    addUser: async function(user) {
        let client = await mongoClient.connect(url, { useNewUrlParser: true });
        let db = client.db('weatherdatabase');
        try {
            let object = await db.collection('User').findOne({username:user.username});
            if (object != null) return Promise.reject("usernameAlreadyInSystem")
            let a =await db.collection('User').insertOne(user);
            return Promise.resolve(a.insertedId);
        } catch (error) {
            return Promise.reject(error);
        } finally {
            client.close();
        }
    },
    getUser: async function(username){
        let client = await mongoClient.connect(url, { useNewUrlParser: true });
        let db = client.db('weatherdatabase');
        try {
            let object = await db.collection('User').findOne({username:username});
            if (object != null) {
                return Promise.resolve(object);
            }
            return Promise.reject("notFound");
        } catch (error) {
            return Promise.reject(error);
        } finally {
            client.close();
        }
    },
    
    
}
function objectIdWithTimestamp(timestamp) {
    // Convert string date to Date object (otherwise assume timestamp is a date)
    if (typeof (timestamp) == 'string') {
        timestamp = new Date(timestamp);
    }
    // Convert date object to hex seconds since Unix epoch
    var hexSeconds = Math.floor(timestamp / 1000).toString(16);
    // Create an ObjectId with that hex timestamp
    var constructedObjectId = ObjectId(hexSeconds + "0000000000000000");
    return constructedObjectId
}

module.exports = dbmodel;