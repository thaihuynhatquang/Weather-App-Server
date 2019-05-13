//api lấy dữ liệu thời tiết hiện tại

{
    "city": "Hanoi",//tên thành phố
    "main": "Clouds",//tình trạng thời tiết
    "iconId": 803,//id của icon
    "icon": "04n",//mã icon
    "description": "broken clouds",//mô tả
    "temp": 302.15,//nhiệt độ (độ K)
    "pressure": 1005,//áp suất ( Hectopascal (hPa))
    "humidity": 74,//độ ẩm (%)
    "temp_min": 302.15,//nhiệt độ thấp nhất (độ K)
    "temp_max": 302.15,//nhiệt độ cao nhất (độ K)
    "clouds": 75,//độ che phủ của mây (%)
    "wind_speed": 5.1,// tốc độ gió (m/s)
    "wind_deg": 110,//góc gió (0: Bắc, 90: Đông, 180:Nam, 270: Tây )
    "visibility": 10,//tầm nhìn (km)
    "uv":9.57 // chỉ số tử ngoại
                // 0–2.9	Nguy cơ gây hại từ tia cực tím thấp=>	Đeo kính râm, thoa kem chống nắng nếu trời đổ tuyết vì tuyết phản xạ tia cực tím.
                // 3.0–5.9	Nguy cơ gây hại từ tia cực tím trung bình=>	Có những biện pháp phòng ngừa, chẳng hạn như che chắn khi ra ngoài. Ở dưới bóng râm vào khoảng giữa trưa, lúc ánh nắng sáng chói nhất.
                // 6.0–7.9	Nguy cơ gây hại từ tia cực tím cao=>	Đeo kính râm, thoa kem chống nắng SPF 30+, mặc quần áo chống nắng và đội nón rộng vành. Giảm thời gian tiếp xúc với ánh nắng trong khoảng 3 giờ trước và sau giữa trưa.
                // 8.0–10.9	Nguy cơ gây hại từ tia cực tím rất cao=>	Bôi kem chống nắng SPF 30+, mặc áo sơ-mi, kính râm, và đội mũ. Không nên đứng dưới nắng quá lâu.
                // 11.0+	Nguy cơ gây hại từ tia cực tím cực cao =>	Mang tất cả các biện pháp phòng ngừa, bao gồm: thoa kem chống nắng SPF 30+, kính râm, áo sơ-mi dài tay, quần dài, đội mũ rộng vành, và tránh ánh nắng mặt trời 3 giờ trước và sau giữa trưa.
}


//news:
{
  newsID:string,
  authorID: string,//userID của người đăng bài
  authorName:string,
  time_create: ISO-8601,
  location:string,
  tile:string,
  picture:string,
  content:string,
}


//listNews:
{
  total: number,//tổng số tin tức trên server
  next_offset:number,//trang tiếp theo =null => không có trang trước đó.
  prev_offset:number,//trang trước đó  =null => không có trang tiếp theo.
  news_Arr: [
    {
      newID:string,
      title:string, //tiêu đề bài đăng.
      picture: string,//nơi ảnh lưu trên server    VD: /news/adfhiaudf32543432jdsa.png -> truy cập bằng http://localhost:9000/img/news/adfhiaudf32543432jdsa.png
      time_create: ISO-8601,//thời gian của bài đăng
      location: string,// tên địa điểm đăng bài, parse từ coords.
      distance: number,//(km) //khoảng cách ước lượng từ nơi đăng bài đến địa điểm hiện tại
    },
    {},
    ....
  ],
   //
}



