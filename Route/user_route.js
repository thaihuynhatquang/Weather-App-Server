var db = require('../Model/mongo')
const secure = require('./secure')
var verifier = require('google-id-token-verifier');
var androidId = require('./key').google.androidID;
var iosId = require('./key').google.iosID;
var user_router = {
    loginG: function(req,res){
        // console.log(req.body);
        var clientId= (req.body.platform == "ios")?iosId:androidId;
        verifier.verify(req.body.token, clientId, function (err, tokenInfo) {
            if (!err) {
                // use tokenInfo in here.
                console.log(tokenInfo);
                //kiểm tra đã tồn tại hay chưa
                db.getuser(tokenInfo.email).then(r=>{
                    console.log("user đã tồn tại");
                        let x = secure.createUserToken({u:r.username,n:r.name});
                        res.statusCode=200;
                        res.send(JSON.stringify({userID:r._id,token:x,name:r.name}));
                }).catch(e=>{ // user chưa tồn tại
                    let newuser = {
                        name: tokenInfo.name,
                        // listBannedWebSite: [],
                        username: tokenInfo.email,
                        dark: tokenInfo.sub,
                    };
                    db.addUser(newuser).then(r => {
                        let x = secure.createUserToken({u:tokenInfo.email,n:tokenInfo.name});
                        res.statusCode=200;
                        res.send(JSON.stringify({userID:r,token:x,name:tokenInfo.name}));
                    }).catch(e => {
                        console.log(e);
                        res.statusCode = 401;
                        res.send();
                    })
                });
                
            }else{
                res.statusCode=401;
                res.send();
            }
        });
    },
    register: function (req, res) {
        console.log(req.body)
        if(req.body.username == null || req.body.password == null || req.body.name==null) {res.statusCode=402;res.send();return;}
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
            db.addUser(newuser).then(r => {
                console.log(r);
                res.statusCode = 201;
                res.send("OK");
            }).catch(e => {
                console.log(e);
                res.statusCode = 401;
                res.send();
            })
        } catch (error) {
            console.log(error);
            res.statusCode = 401;
            res.send();
        }
    },
    login:function(req,res){
        try {
            console.log(req.body)
            db.getuser(req.body.username).then(r=>{
                console.log(r);
                if(secure.compare(req.body.password,r.password,r.dark)){
                    let x = secure.createUserToken({u:r.username,n:r.name});
                    res.statusCode=200;
                    res.send(JSON.stringify({userID:r._id,token:x,name:r.name}));
                }
            }).catch(e=>{
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

    sendUserInfo: function (req, res) {
        console.log(req.body);
        
        if(secure.verifyUserToken(req.body.token)== null) {res.statusCode = 401; res.send(); return;}

        db.getComputerInfo(req.params.id, req.params.firstID, req.params.number).then(r => {
            console.log("Đã xử lý yêu cầu xem info computer");
            res.statusCode = 200;
            console.log(r);
            res.send(JSON.stringify(r));
        }).catch(e => {
            res.statusCode = 401;
            res.send();
        })
    },

}
module.exports = user_router;
// var res={t:"eyJhbGciOiJSUzI1NiIsImtpZCI6IjI4ZjU4MTNlMzI3YWQxNGNhYWYxYmYyYTEyMzY4NTg3ZTg4MmI2MDQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxMDA2ODg4MjIwMDQwLTN2dWExc3QwZHFhcmcxdGxua2diZTE1amUxbTk5bmw1LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMTAwNjg4ODIyMDA0MC0zdnVhMXN0MGRxYXJnMXRsbmtnYmUxNWplMW05OW5sNS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNDA4NjY0MzMxODczNDM5NDE0MyIsImVtYWlsIjoidHJhbnF1YW5nbGluaC5wdEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6InJxa0JwS3p5N0Z4aFpOSmZtTHBJTkEiLCJuYW1lIjoiUXVhbmcgTGluaCBUcuG6p24iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1iVDVQNkliUWF3Yy9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BQ0hpM3Jmdm9UeHhlclQ0b09KTm9GNUQ4QzJXX3F6cHN3L3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJRdWFuZyBMaW5oIiwiZmFtaWx5X25hbWUiOiJUcuG6p24iLCJsb2NhbGUiOiJ2aSIsImlhdCI6MTU1NzM4ODQ1NiwiZXhwIjoxNTU3MzkyMDU2fQ.gv4tMT6DC_rD5qAaEVzpW36lGLgwYnOk0TqH_jT1coQg02RnI3Sny4ajVTSGyYV9epbRwtbXvZuCHCcBuYfq1CpSL1-IDQdl5ca5FnT7pKB2MKv7CiMV1ocl-33xjddH_1R2k9lvBENgC-lpy_wCKQB5U2b90caTGZZ4A7wkbIe78J8h6SlHu-WLHZqdcMTV_hJ1Sn0eSgeYuv0msr8-GuzabLnp5UzAKz1eqXleYNEbGBeveK1TKC2Ok8qSJRlW10c1MauVvSkMITOJE33QAWsXPYKhICOFCeBzIQ0zuYf-Bgu_EIALnXYzTAy2h5h-wVhg_Lmf0BOFX4eiOVQQCw"}
// var x={};
// x.body=res;
// user_router.loginG(x,null);