const secure = require("./secure");
var db = require("../Model/mongo");

var fs = require("fs");
module.exports = {
  getListNews: function(req, res) {
    let limit = parseInt(req.query.limit || 1);
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
  getNews: function(req, res) {
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
  addNews: function(req, res) {
    let user = secure.verifyUserToken(req.headers.token);
    if (user == null) {
      res.statusCode = 401;
      res.send();
    } else {
      //ghi file ảnh
      fs.readFile(req.file.path, (err, contents) => {
        if (err) {
          console.log("Error: ", err);
        } else {
          console.log("File contents ", contents);
        }
      });
    }
  }
};
