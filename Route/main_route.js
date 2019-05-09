var jsonParser = require('body-parser').json();  // nhận json từ client
var weather_route = require('./weather_route');
var user_route= require('./user_route');

module.exports = {
    route: function (app) {
        app.get('/',(req,res)=>res.send("Hello, I am OK now!")); 
        app.get('/weather/current/lat=:lat/lon=:lon',(req,res)=>weather_route.send_current_weather_by_location(req,res));  //ok
        app.get('/weather/current/:cityName',(req,res)=>weather_route.send_current_weather_by_cityName(req,res));  //ok
        app.get('/weather/detailfiveday/lat=:lat/lon=:lon',(req,res)=>weather_route.send_fiveday_weather_by_location(req,res));  //ok
        app.get('/weather/detailfiveday/:cityName',(req,res)=>weather_route.send_fiveday_weather_by_cityName(req,res));  //ok
        app.post('/user/login',jsonParser,(req,res)=>user_route.login(req,res));
        app.post('/user/register',jsonParser,(req,res)=>user_route.register(req,res));
        app.post('/user/loginWithGoogle',jsonParser,(req,res)=>user_route.loginG(req,res));
    }
}