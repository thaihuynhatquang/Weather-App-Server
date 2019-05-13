const express = require("express");
const app = express();
var morgan = require('morgan');
app.use(morgan('combined'));
app.use((req, res, next) => {
  // hỗ trợ nhận request post/get chứa cookie dạng json từ client
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,X-Requested-With"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST");
  next();
});

// app.get('/login',(req,res)=>{
//     res.send("DFSDFSDFD");
// });
var route = require("./Route/main_route");
route.route(app);
app.use("/img", express.static("images"));

app.listen(process.env.PORT || 9000, () => {
  console.log("weather server đang hoạt động ở cổng 9000 !");
});
