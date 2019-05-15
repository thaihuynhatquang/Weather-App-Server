var jsonParser = require("body-parser").json(); // nhận json từ client
var weather_route = require("./weather_route");
var user_route = require("./user_route");
var news_route = require("./news_route");

module.exports = {
  route: function (app) {
    app.get("/", (req, res) => res.send("Hello, I am OK now!"));
    app.get("/weather/current/", (req, res) =>
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
    app.get("/weather/find/", (req, res) =>
      weather_route.send_list_city(req, res)
    ); //ok
    app.post("/user/auth", jsonParser, (req, res) => user_route.auth(req, res));
    app.post("/user/login", jsonParser, (req, res) =>
      user_route.login(req, res)
    );
    app.post("/user/register", jsonParser, (req, res) =>
      user_route.register(req, res)
    );
    app.post("/user/loginWithGoogle", jsonParser, (req, res) =>
      user_route.loginGoogle(req, res)
    );
    app.get("/user/info/userID=:userID", (req, res) =>
      user_route.getUserInfo(req, res)
    );
    // ?limit=:limit/offset=:offset/order=:order/lat=:lat/lon=:lon
    app.get("/news/", (req, res) => news_route.getListNews(req, res));
    app.get("/news/newsID=:newsID", (req, res) => news_route.getNews(req, res));
    app.get("/news/newsID=:newsID", (req, res) => news_route.getNews(req, res));
    app.post("/news/newpost", (req, res) => news_route.addNews(req, res));
  }
};

// function hamBinhthuong() {
//   getLocation().then(
//     res => {
//       //lay thoi tiet
//     }
//   ).catch(error => {
//     // error nay chính là error của navigator.
//   })
// }

// async function getLocation() {
//   try {
//     var location = await navigator.geolocation.getCurrentPosition();
//     return Promise.resolve(location);
//   } catch (error) {
//     return Promise.reject(error);
//   }
// }
