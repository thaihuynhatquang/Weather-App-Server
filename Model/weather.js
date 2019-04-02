const axios = require('axios');
const API_KEY="&appid=58d7143e8d3b465efbd462516a49c7c1";
var weather={
  get_current_weather_by_cityName: async function(cityName) {
    var API_URL="http://api.openweathermap.org/data/2.5/weather?q=";
    var response= await axios.get(API_URL+cityName+API_KEY);
    if(response.status=200){
      //weatherAPI trả về kết quả
      return Promise.resolve(response.data);
    }
    else return Promise.reject("No response! [Model/weather.js/get_current_weather_by_cityName]");
  },

  get_current_weather_by_position: async function(lat,lon){
    var API_URL="http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon;
    var response= await axios.get(API_URL+API_KEY);
    if(response.status=200){
      //weatherAPI trả về kết quả
      return Promise.resolve(response.data);
    }
    else return Promise.reject("No response! [Model/weather.js/get_current_weather_by_position]");
  }
}
// // weather.get_current_weather_by_cityName("London");
// weather.get_current_weather_by_position(35,139)
// .then(r=> console.log(r)).catch(e=> console.log(e));
module.exports= weather;