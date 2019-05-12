var jsonParser = require("body-parser").json(); // nhận json từ client
var weather_model = require("../Model/weather");
module.exports = {
  send_current_weather_by_location: function(req, res) {
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
    var cityName = req.query.cityName;
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
