var jsonParser = require("body-parser").json(); // nhận json từ client
var weather_model = require("../Model/weather");
var weather_route = {
  send_current_weather_by_location: function (req, res) {
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

  send_current_weather_by_cityName: function (req, res) {
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

  send_fiveday_weather_by_location: function (req, res) {
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
  send_fiveday_weather_by_location_new: function (req, res) {
    var lat = req.query.lat;
    var lon = req.query.lon;
    weather_model
      .get_5day_3hour_by_position(lat, lon)
      .then(r => {
        r.list = extractWeatherByDay(r.list);
        console.log(r);
        res.status(200);
        res.send(r);
      })
      .catch(e => {
        console.log(e);
        res.status(500);
        res.send();
      });
  },
  send_fiveday_weather_by_cityName: function (req, res) {
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
  send_fiveday_weather_by_cityName_new: function (req, res) {
    var cityName = req.params.cityName;
    weather_model
      .get_5day_3hour_by_cityName(cityName)
      .then(r => {
        r.list = extractWeatherByDay(r.list);
        res.status(200);
        res.send(r);
      })
      .catch(e => {
        console.log(e);
        res.status(500);
        res.send("error server");
      });
  },
  send_list_city: function (req, res) {
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


function extractWeatherByDay(list) {
  var list_final = [];
  var list_element = [];
  var day = list[0].dt_txt.substring(0, 10);
  list.forEach(element => {
    if (element.dt_txt.substring(0, 10) == day) {
      list_element.push(element);
    } else {
      day = element.dt_txt.substring(0, 10);
      list_final.push(list_element);
      list_element = [];
      list_element.push(element);
    }
  });
  return list_final;
}
module.exports = weather_route;
var req = {};
var res = {};
req.query = { lat: 21, lon: 105 };
// weather_route.send_fiveday_weather_by_location_new(req, res);
