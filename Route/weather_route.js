var jsonParser = require("body-parser").json(); // nhận json từ client
var weather_model = require("../Model/weather");
module.exports = {
  send_current_weather_by_location: function(req, res) {
    console.log(
      "Receive request get current weather by location [Route/weather_route.js/send_current_weather_by_location]"
    );

    var lat = req.query.lat;
    var lon = req.query.lon;
    weather_model
      .get_current_weather_by_position(lat, lon)
      .then(r => {
        res.status(200);
        res.send(r);
      })
      .catch(e => {
        console.log(e);
        res.status(500);
        res.send();
      });
  },

  send_current_weather_by_cityName: function(req, res) {
    console.log(
      "Receive request get current weather by city name [Route/weather_route.js/send_current_weather_by_cityName]"
    );

    var cityName = req.params.cityName;
    weather_model
      .get_current_weather_by_cityName(cityName)
      .then(r => {
        res.status(200);
        res.send(r);
      })
      .catch(e => {
        console.log(e);
        res.status(500);
        res.send();
      });
  },

  send_fiveday_weather_by_location: function(req, res) {
    console.log(
      "Receive request get current weather by city name [Route/weather_route.js/send_fiveday_weather_by_location]"
    );

    var lat = req.query.lat;
    var lon = req.query.lon;
    weather_model
      .get_5day_3hour_by_position(lat, lon)
      .then(r => {
        res.status(200);
        res.send(r);
      })
      .catch(e => {
        console.log(e);
        res.status(500);
        res.send();
      });
  },
  send_fiveday_weather_by_cityName: function(req, res) {
    console.log(
      "Receive request get current weather by city name [Route/weather_route.js/send_fiveday_weather_by_location]"
    );

    var cityName = req.params.cityName;
    weather_model
      .get_5day_3hour_by_cityName(cityName)
      .then(r => {
        res.status(200);
        res.send(r);
      })
      .catch(e => {
        console.log(e);
        res.status(500);
        res.send("error server");
      });
  },
  send_list_city: function(req, res) {
    console.log(
      "Receive request find list city [Route/weather_route.js/send_list_city]"
    );
    var cityName = req.query.cityName;
    console.log(cityName, "test citynam");
    weather_model
      .get_list_city(cityName)
      .then(r => {
        res.status(200);
        res.send(r);
      })
      .catch(e => {
        console.log(e);
        res.status(500);
        res.send("error server");
      });
  }
};
