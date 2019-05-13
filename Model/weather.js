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
      var result = response.data;
      try {
        result.current = await this.get_current_weather_by_position(lat, lon);
      } catch (error) {
        result.current = null;
      }
      return Promise.resolve(result);
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
  },
  get_list_city: async function(cityName) {
    var API_URL = "https://openweathermap.org/data/2.5/find?q=";
    var API_KEY = "&appid=b6907d289e10d714a6e88b30761fae22&units=metric";
    var cityNameEncode = encodeURIComponent(cityName);
    var response = await axios.get(API_URL + cityNameEncode + API_KEY);
    if ((response.status = 200)) {
      const listCity = response.data.list.map(city => {
        return {
          id: city.id,
          name: city.name,
          coord: city.coord,
          country: city.sys.country
        };
      });
      return Promise.resolve(listCity);
    } else
      return Promise.reject("No response! [Model/weather.js/get_list_city]");
  },
  get_address_by_location: async function(lat,lon) {
    var API_URL = "https://api.opencagedata.com/geocode/v1/json?q=";
    var API_KEY = "&key=55f3c34bb9a3424d96a72154deca11ea&no_annotations=1&language=vi";
    var response = await axios.get(API_URL + lat+"+"+lon + API_KEY);
    if ((response.status = 200)) {
      return Promise.resolve(response.data.results[0].formatted);
    } else
      return Promise.reject("No response! [Model/weather.js/get_list_city]");
  }
};

function extractCurrentData(data) {
  var result = {};
  result.city = data.name; //tên thành phố
  result.country = data.sys.country;
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

module.exports = weather;
// // weather.get_current_weather_by_cityName("London");
// weather.get_address_by_location(21,105.7783)
// .then(r=> console.log(r)).catch(e=> console.log(e));
// weather.get_current_uv_by_position(35,139.6).then(r=>console.log(r)).catch(e=>console.log(e));
