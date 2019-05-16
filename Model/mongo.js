var mongoClient = require("mongodb").MongoClient;
// const url = "mongodb://server:5sLUdMe7XGk2iSM@ds153766.mlab.com:53766/weather";
const url = "mongodb://localhost:27017/weather"
// 'mongodb://linh:dEG5kkBdWqFeCQ6@ds147454.mlab.com:47454/alpha'
var ObjectId = require("mongodb").ObjectID;
var dbmodel = {
  addUser: async function (user) {
    let client = await mongoClient.connect(url, { useNewUrlParser: true });
    let db = client.db("weather");
    try {
      let object = await db
        .collection("User")
        .findOne({ username: user.username });
      if (object != null) return Promise.reject("usernameAlreadyInSystem");
      let a = await db.collection("User").insertOne(user);
      return Promise.resolve(a.insertedId);
    } catch (error) {
      return Promise.reject(error);
    } finally {
      client.close();
    }
  },
  getUser: async function (username) {
    let client = await mongoClient.connect(url, { useNewUrlParser: true });
    let db = client.db("weather");
    try {
      let object = await db.collection("User").findOne({ username: username });
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
  getListNews: async function (limit, offset, lat, lon) {
    let client = await mongoClient.connect(url, { useNewUrlParser: true });
    let db = client.db("weather");
    try {
      let count = await db.collection("News").find().count();
      let arr = await db.collection("News").find().sort({ _id: -1 }).skip(offset).limit(limit).toArray();
      for (let i = 0; i < arr.length; i++) {
        arr[i].time_create = ObjectId(arr[i]._id).getTimestamp();
        lati = arr[i].location.coordinates[0];
        loni = arr[i].location.coordinates[1];
        arr[i].distance = getDistance(lat, lon, lati, loni);
        delete arr[i]["location"];
      }
      if (arr != null) {
        return Promise.resolve({ news_Arr: arr, total: count });
      }
      return Promise.reject("notFound");
    } catch (error) {
      return Promise.reject(error);
    } finally {
      client.close();
    }
  },
  getListNews_orderByLocation: async function (limit, offset, lat, lon) {
    let client = await mongoClient.connect(url, { useNewUrlParser: true });
    let db = client.db("weather");
    try {
      let query = {
        location:
        {
          $near:
          {
            $geometry: { type: "Point", coordinates: [lon, lat] },
          }
        }
      };
      let count = await db.collection("News").find().count();
      let arr = await db.collection("News").find(query).skip(offset).limit(limit).toArray();
      for (let i = 0; i < arr.length; i++) {
        arr[i].time_create = ObjectId(arr[i]._id).getTimestamp();
        lati = arr[i].location.coordinates[0];
        loni = arr[i].location.coordinates[1];
        arr[i].distance = getDistance(lat, lon, lati, loni);
        delete arr[i]["location"];
      }
      if (arr != null) {
        return Promise.resolve({ news_Arr: arr, total: count });
      }
      return Promise.reject("notFound");
    } catch (error) {
      return Promise.reject(error);
    } finally {
      client.close();
    }
  },
  getNews: async function (newsID) {
    let client = await mongoClient.connect(url, { useNewUrlParser: true });
    let db = client.db("weather");
    try {
      let object = await db.collection("News").findOne({ _id: ObjectId(newsID) });
      if (object != null) {
        object.time_create = ObjectId(object._id).getTimestamp();
        delete object["location"];
        return Promise.resolve(object);
      }
      return Promise.reject("notFound");
    } catch (error) {
      return Promise.reject(error);
    } finally {
      client.close();
    }
  },
  addNews: async function (newsObject, lat, lon) {
    let client = await mongoClient.connect(url, { useNewUrlParser: true });
    let db = client.db("weather");
    try {
      newsObject.location = {
        type: "Point",
        coordinates: [lat, lon]
      }
      let a = await db.collection("News").insertOne(newsObject);
      return Promise.resolve(a.insertedId);
    } catch (error) {
      return Promise.reject(error);
    } finally {
      client.close();
    }
  },
  updateFavorite: async function (userID, favoriteObject) {
    let client = await mongoClient.connect(url, { useNewUrlParser: true });
    let db = client.db("weather");
    try {
      let query = { _id: ObjectId(userID) };
      let update = { $set: { "favorites": favoriteObject } }
      let a = await db.collection("User").updateOne(query, update);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      client.close();
    }
  }
};
function getDistance(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d / 10;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}


function objectIdWithTimestamp(timestamp) {
  // Convert string date to Date object (otherwise assume timestamp is a date)
  if (typeof timestamp == "string") {
    timestamp = new Date(timestamp);
  }
  // Convert date object to hex seconds since Unix epoch
  var hexSeconds = Math.floor(timestamp / 1000).toString(16);
  // Create an ObjectId with that hex timestamp
  var constructedObjectId = ObjectId(hexSeconds + "0000000000000000");
  return constructedObjectId;
}

module.exports = dbmodel;
// dbmodel.getListNews_orderByLocation(4, 0, 21, 105).then(r => console.log(r)).catch(e => console.log(e));
