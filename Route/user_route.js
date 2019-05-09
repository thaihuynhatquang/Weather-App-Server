var db = require('../Model/mongo')
const secure = require('./secure')
var verifier = require('google-id-token-verifier');
var clientId = require('./key').google.clientID;
var user_router = {
    loginG: function(req,res){
        console.log(req.body);
        verifier.verify(req.body.t, clientId, function (err, tokenInfo) {
            if (!err) {
                // use tokenInfo in here.
                console.log(tokenInfo);
                //kiểm tra đã tồn tại hay chưa
                db.getuser(tokenInfo.email).then(r=>{
                    console.log("user đã tồn tại");
                        let x = secure.createUserToken({u:r.username,n:r.name});
                        res.statusCode=200;
                        res.send(JSON.stringify({userID:r._id,tk:x,name:r.name}));
                }).catch(e=>{ // user chưa tồn tại
                    let newuser = {
                        name: tokenInfo.name,
                        // listBannedWebSite: [],
                        username: tokenInfo.email,
                        dark: tokenInfo.sub,
                    };
                    db.adduser(newuser).then(r => {
                        let x = secure.createUserToken({u:tokenInfo.email,n:tokenInfo.name});
                        res.statusCode=200;
                        res.send(JSON.stringify({userID:r,tk:x,name:tokenInfo.name}));
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
            db.adduser(newuser).then(r => {
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
                    res.send(JSON.stringify({userID:r._id,tk:x,name:r.name}));
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
        
        if(secure.verifyUserToken(req.body.tk)== null) {res.statusCode = 401; res.send(); return;}

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