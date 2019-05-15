const secure = require("./secure");
var db = require("../Model/mongo");
var ObjectId = require("mongodb").ObjectID;

var fs = require("fs");
module.exports = {
  getListNews: function (req, res) {
    let limit = parseInt(req.query.limit || 5);
    let offset = parseInt(req.query.offset || 0);
    let order = req.query.order || "location";
    let lat = parseFloat(req.query.lat);
    let lon = parseFloat(req.query.lon);
    console.log({ limit, offset, order });
    if (!lat || !lon) {
      res.statusCode = 402;
      res.send("Location undefined");
    } else {
      if (order == "time") {
        db.getListNews(limit, offset, lat, lon)
          .then(r => {
            let next_offset = null;
            let prev_offset = null;
            if (r.total > (offset + 1) * limit)
              next_offset = (offset + 1) * limit + 1;
            if (offset - limit > 0) prev_offset = offset - limit - 1;
            r.next_offset = next_offset;
            r.prev_offset = prev_offset;
            r.offset = offset;
            r.order = order;
            res.statusCode = 200;
            res.send(r);
          })
          .catch(e => {
            console.log(e);
            res.statusCode = 500;
            res.send();
          });
      }
      if (
        order == "location" &&
        req.query.lat != null &&
        req.query.lon != null
      ) {
        db.getListNews_orderByLocation(limit, offset, lat, lon)
          .then(r => {
            let next_offset = null;
            let prev_offset = null;
            if (r.total > (offset + 1) * limit)
              next_offset = (offset + 1) * limit + 1;
            if (offset - limit > 0) prev_offset = offset - limit - 1;
            r.next_offset = next_offset;
            r.prev_offset = prev_offset;
            res.statusCode = 200;
            res.send(r);
          })
          .catch(e => {
            res.statusCode = 500;
            res.send();
          });
      }
    }
  },
  getNews: function (req, res) {
    let newsID = req.params.newsID;
    db.getNews(newsID)
      .then(r => {
        res.statusCode = 200;
        res.send(r);
      })
      .catch(e => {
        res.statusCode = 500;
        console.log(e);
        res.send();
      });
  },
  addNews: async function (req, res) {
    let user = secure.verifyUserToken(req.headers.authorization);
    // console.log(req.headers);
    // let user = { username: "tranquanglinh.pt@gmail.com" };
    if (user == null) {
      // token không xác thực được
      res.statusCode = 401;
      res.send();
    } else {
      console.log("user:", user);
      //ghi file ảnh
      // console.log(JSON.parse(req.body.title));
      // console.log(req.body.title);
      var newsObject = {};
      let image = (req.files != null) ? req.files.photo : null;
      // console.log(req.files);
      try {
        if (image != null) {
          console.log("here!!!");
          var path = require('path');
          // // tạo ra đường dẫn để lưu vào database
          let databasePath = user.u + "__" + secure.createSalt() + secure.createSalt() + image.name;
          // // tạo đường dẫn để ghi file
          let serverPath = "/images/news/" + databasePath;

          // console.log(databasePath, " <- databasePath");
          var file = path.join(__dirname, "..", serverPath);
          await image.mv(file);
          newsObject.picture = databasePath;
        }
        newsObject.title = req.body.title;
        newsObject.content = req.body.content;
        newsObject.authorName = user.n;
        newsObject.authorID = ObjectId(user.i);
        console.log(newsObject);
        let lat = parseFloat(req.body.lat);
        let lon = parseFloat(req.body.lon);
        await db.addNews(newsObject, lat, lon);
        // return Promise.resolve("success update profile")
        res.statusCode = 201;
        res.send();
      } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.send();
        // return Promise.reject(new Error("update profile fail"))
      }
    }
  }
};
