var jsonParser = require("body-parser").json(); // nhận json từ client
var weather_route = require("./weather_route");
var user_route = require("./user_route");

module.exports = {
  route: function(app) {
    app.get("/", (req, res) => res.send("Hello, I am OK now!"));
    app.get("/weather/current/lat=:lat/lon=:lon", (req, res) =>
      weather_route.send_current_weather_by_location(req, res)
    ); //ok
    app.get("/weather/current/:cityName", (req, res) =>
      weather_route.send_current_weather_by_cityName(req, res)
    ); //ok
    app.get("/weather/postcast5day/", (req, res) =>
      weather_route.send_fiveday_weather_by_location(req, res)
    ); //ok
    app.get("/weather/postcast5day/:cityName", (req, res) =>
      weather_route.send_fiveday_weather_by_cityName(req, res)
    ); //ok
    app.post("/user/loginWithGoogle", jsonParser, (req, res) =>
      user_route.loginGoogle(req, res)
    );
  }
};
