var db = require("../Model/mongo");
const secure = require("./secure");
var verifier = require("google-id-token-verifier");
var androidId = require("./key").google.androidID;
var iosId = require("./key").google.iosID;

var user_router = {
  auth: function (req, res) {
    var token = req.body.token;
    if (secure.verifyUserToken(token)) {
      res.statusCode = 200;
      res.send("Authenticated");
    } else {
      res.statusCode = 401;
      res.send("Unauthenticated");
    }
  },
  loginGoogle: function (req, res) {
    var clientId = req.body.platform == "ios" ? iosId : androidId;
    verifier.verify(req.body.token, clientId, function (err, tokenInfo) {
      if (!err) {
        db.getUser(tokenInfo.email)
          .then(r => {
            console.log(r);
            let x = secure.createUserToken({
              u: r.username,
              n: r.name,
              i: r._id
            });
            res.statusCode = 200;
            res.send(
              JSON.stringify({
                userID: r._id,
                token: x,
                name: r.name,
                avatar: r.avatar
              })
            );
          })
          .catch(e => {
            // user chưa tồn tại
            let newuser = {
              avatar: tokenInfo.picture,
              name: tokenInfo.name,
              // listBannedWebSite: [],
              username: tokenInfo.email,
              dark: tokenInfo.sub
            };
            db.addUser(newuser)
              .then(id => {
                let x = secure.createUserToken({
                  u: tokenInfo.email,
                  n: tokenInfo.name,
                  i: id
                });
                res.statusCode = 200;
                res.send(
                  JSON.stringify({
                    userID: id,
                    token: x,
                    name: tokenInfo.name,
                    avatar: tokenInfo.picture
                  })
                );
              })
              .catch(e => {
                console.log(e);
                res.statusCode = 401;
                res.send();
              });
          });
      } else {
        res.statusCode = 401;
        res.send();
      }
    });
  },
  register: function (req, res) {
    if (
      req.body.username == null ||
      req.body.password == null ||
      req.body.name == null
    ) {
      res.statusCode = 402;
      res.send();
      return;
    }
    try {
      let salt2 = secure.createSalt();
      console.log(salt2);
      let newuser = {
        name: req.body.name,
        // listBannedWebSite: [],
        username: req.body.username,
        dark: salt2,
        password: secure.encrypt(req.body.password, salt2)
      };
      db.addUser(newuser)
        .then(r => {
          console.log(r);
          // res.statusCode = 201;
          // res.send("OK");

          let x = secure.createUserToken({
            u: newuser.username,
            n: newuser.name
          });
          res.statusCode = 200;
          res.send(JSON.stringify({ userID: r, token: x, name: newuser.name }));
        })
        .catch(e => {
          console.log(e);
          res.statusCode = 401;
          res.send();
        });
    } catch (error) {
      console.log(error);
      res.statusCode = 401;
      res.send();
    }
  },
  login: function (req, res) {
    try {
      db.getuser(req.body.username)
        .then(r => {
          console.log(r);
          if (secure.compare(req.body.password, r.password, r.dark)) {
            let x = secure.createUserToken({ u: r.username, n: r.name });
            res.statusCode = 200;
            res.send(JSON.stringify({ userID: r._id, token: x, name: r.name }));
          }
        })
        .catch(e => {
          console.log(e);
          res.statusCode = 401;
          res.send();
        });
    } catch (error) {
      console.log(error);
      res.statusCode = 401;
      res.send();
    }
  },
  updateFavoriteCity: function (req, res) {
    let user = secure.verifyUserToken(req.headers.authorization);
    // console.log(req.headers);
    // let user = { username: "tranquanglinh.pt@gmail.com", i: "5cd7d04fc44be55e88ce79cc" };
    if (user == null) {
      // token không xác thực được
      res.statusCode = 401;
      res.send();
    } else {
      let favorObject = req.body;
      db.updateFavorite(user.i, favorObject).then(r => {
        res.statusCode = 201;
        res.send();
      }).catch(e => {
        res.statusCode = 500;
        res.send();
      })
    }
  },
  sendUserInfo: function (req, res) {
    if (secure.verifyUserToken(req.body.token) == null) {
      res.statusCode = 401;
      res.send();
      return;
    }

    db.getComputerInfo(req.params.id, req.params.firstID, req.params.number)
      .then(r => {
        res.statusCode = 200;
        console.log(r);
        res.send(JSON.stringify(r));
      })
      .catch(e => {
        res.statusCode = 401;
        res.send();
      });
  }
};
module.exports = user_router;
// var res={t:"eyJhbGciOiJSUzI1NiIsImtpZCI6IjI4ZjU4MTNlMzI3YWQxNGNhYWYxYmYyYTEyMzY4NTg3ZTg4MmI2MDQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxMDA2ODg4MjIwMDQwLTN2dWExc3QwZHFhcmcxdGxua2diZTE1amUxbTk5bmw1LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMTAwNjg4ODIyMDA0MC0zdnVhMXN0MGRxYXJnMXRsbmtnYmUxNWplMW05OW5sNS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNDA4NjY0MzMxODczNDM5NDE0MyIsImVtYWlsIjoidHJhbnF1YW5nbGluaC5wdEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6InJxa0JwS3p5N0Z4aFpOSmZtTHBJTkEiLCJuYW1lIjoiUXVhbmcgTGluaCBUcuG6p24iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1iVDVQNkliUWF3Yy9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BQ0hpM3Jmdm9UeHhlclQ0b09KTm9GNUQ4QzJXX3F6cHN3L3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJRdWFuZyBMaW5oIiwiZmFtaWx5X25hbWUiOiJUcuG6p24iLCJsb2NhbGUiOiJ2aSIsImlhdCI6MTU1NzM4ODQ1NiwiZXhwIjoxNTU3MzkyMDU2fQ.gv4tMT6DC_rD5qAaEVzpW36lGLgwYnOk0TqH_jT1coQg02RnI3Sny4ajVTSGyYV9epbRwtbXvZuCHCcBuYfq1CpSL1-IDQdl5ca5FnT7pKB2MKv7CiMV1ocl-33xjddH_1R2k9lvBENgC-lpy_wCKQB5U2b90caTGZZ4A7wkbIe78J8h6SlHu-WLHZqdcMTV_hJ1Sn0eSgeYuv0msr8-GuzabLnp5UzAKz1eqXleYNEbGBeveK1TKC2Ok8qSJRlW10c1MauVvSkMITOJE33QAWsXPYKhICOFCeBzIQ0zuYf-Bgu_EIALnXYzTAy2h5h-wVhg_Lmf0BOFX4eiOVQQCw"}
// var x={};
// x.body=res;
// user_router.loginG(x,null);
