const axios = require("axios");
const API_KEY = "&appid=58d7143e8d3b465efbd462516a49c7c1&units=metric";
var weather = {
  get_current_weather_by_cityName: async function(cityName) {
    var API_URL = "http://api.openweathermap.org/data/2.5/weather?q=";
    var response = await axios.get(API_URL + cityName + API_KEY);
    if ((response.status = 200)) {
      //weatherAPI trả về kết quả
      var result = extractCurrentData(response.data);
      var lat = response.data.coord.lat;
      var lon = response.data.coord.lon;
      try {
        result.uv = await this.get_current_uv_by_position(lat, lon);
      } catch (error) {
        result.uv = "no data";
      }
      try {
        result.air_pollution = await this.get_current_airpollution(lat, lon);
      } catch (error) {
        result.air_pollution = "no data";
      }
      return Promise.resolve(result);
    } else
      return Promise.reject(
        "No response! [Model/weather.js/get_current_weather_by_cityName]"
      );
  },

  get_current_weather_by_position: async function(lat, lon) {
    var API_URL =
      "http://api.openweathermap.org/data/2.5/weather?lat=" +
      lat +
      "&lon=" +
      lon;
    var response = await axios.get(API_URL + API_KEY);
    if ((response.status = 200)) {
      //weatherAPI trả về kết quả
      var result = extractCurrentData(response.data);
      try {
        result.uv = await this.get_current_uv_by_position(lat, lon);
      } catch (error) {
        result.uv = "no data";
      }
      try {
        result.air_pollution = await this.get_current_airpollution(lat, lon);
      } catch (error) {
        result.air_pollution = "no data";
      }
      return Promise.resolve(result);
    } else
      return Promise.reject(
        "No response! [Model/weather.js/get_current_weather_by_position]"
      );
  },

  get_current_uv_by_position: async function(lat, lon) {
    var API_URL =
      "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon;
    var response = await axios.get(API_URL + API_KEY);
    if ((response.status = 200)) {
      //weatherAPI trả về kết quả
      return Promise.resolve(response.data.value);
    } else
      return Promise.reject(
        "No response! [Model/weather.js/get_uv_by_position]"
      );
  },

  get_current_airpollution: async function(lat, lon) {
    var API_URL =
      "http://api.openweathermap.org/pollution/v1/co/" +
      lat +
      "," +
      lon +
      "/current.json?";
    var response = await axios.get(API_URL + API_KEY);
    if ((response.status = 200)) {
      //weatherAPI trả về kết quả
      return Promise.resolve(response.data);
    } else
      return Promise.reject(
        "No response! [Model/weather.js/get_current_airpollution]"
      );
  },

  get_5day_3hour_by_position: async function(lat, lon) {
    var API_URL =
      "http://api.openweathermap.org/data/2.5/forecast?lat=" +
      lat +
      "&lon=" +
      lon;
    var response = await axios.get(API_URL + API_KEY);
    if ((response.status = 200)) {
      return Promise.resolve(response.data);
    } else
      return Promise.reject(
        "No response! [Model/weather.js/get__5day_3hour_by_position]"
      );
  },
  get_5day_3hour_by_cityName: async function(cityName) {
    var API_URL = "http://api.openweathermap.org/data/2.5/forecast?q=";
    var response = await axios.get(API_URL + cityName + API_KEY);
    if ((response.status = 200)) {
      return Promise.resolve(response.data);
    } else
      return Promise.reject(
        "No response! [Model/weather.js/get__5day_3hour_by_cityName]"
      );
  }
};

function extractCurrentData(data) {
  var result = {};
  result.city = data.name; //tên thành phố
  result.main = data.weather[0].main; //tình trạng thời tiết
  result.iconId = data.weather[0].id; //id của icon
  result.icon = data.weather[0].icon; //mã icon
  result.description = data.weather[0].description; //mô tả
  result.temp = data.main.temp; //nhiệt độ
  result.pressure = data.main.pressure; //áp suất
  result.humidity = data.main.humidity; //độ ẩm
  result.temp_min = data.main.temp_min; //nhiệt độ thấp nhất
  result.temp_max = data.main.temp_max; //nhiệt độ cao nhất
  result.clouds = data.clouds.all; //độ che phủ của mây (%)
  result.wind_speed = data.wind.speed; // tốc độ gió
  result.wind_deg = data.wind.deg; //góc gió
  result.visibility = data.visibility / 1000; //tầm nhìn (km)
  return result;
}

function extractHourlyData(data) {
  var result = {};
  result.time = data.dt_txt;
  result.city = data.name; //tên thành phố
  result.main = data.weather[0].main; //tình trạng thời tiết
  result.iconId = data.weather[0].id; //id của icon
  result.icon = data.weather[0].icon; //mã icon
  result.description = data.weather[0].description; //mô tả
  result.temp = data.main.temp; //nhiệt độ
  result.pressure = data.main.pressure; //áp suất
  result.humidity = data.main.humidity; //độ ẩm
  result.temp_min = data.main.temp_min; //nhiệt độ thấp nhất
  result.temp_max = data.main.temp_max; //nhiệt độ cao nhất
  result.clouds = data.clouds.all; //độ che phủ của mây (%)
  result.wind_speed = data.wind.speed; // tốc độ gió
  result.wind_deg = data.wind.deg; //góc gió
  return result;
}
// // weather.get_current_weather_by_cityName("London");
// weather.get_current_weather_by_position(35,139)
// .then(r=> console.log(r)).catch(e=> console.log(e));
// weather.get_current_uv_by_position(35,139.6).then(r=>console.log(r)).catch(e=>console.log(e));
module.exports = weather;
