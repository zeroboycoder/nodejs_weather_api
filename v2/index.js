const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

app.get("/", (req,res) => {
    res.render("index.ejs")
})

app.post("/", (req,res) => {
    const userCity = req.body.cityName;
    request("http://api.weatherstack.com/current?access_key=189d90b254bf31411d010d35090f2de3&query="+userCity, (respone, error , body) => {
        if(body){
            const data = JSON.parse(body);
	    const city = data.location.name;
            const country = data.location.country;
            const localtime = data.location.localtime;
            const temp = data.current.temperature
            const wind = data.current.wind_speed;
            const condition = data.current.weather_descriptions[0];
            const image = data.current.weather_icons[0];
            const humidity = data.current.humidity;
            const precip = data.current.precip;
            var isday = data.current.is_day;
            

            const time = localtime.substring(11,16);
            // var hour = time.substring(0,2);
            // const min = time.substring(3,5);
            // var period;
            // if( hour > 12){
            //     hour = Number(hour)-12;
            //     period = "PM";
            // } else{
            //     period = "AM";
            // }

            if(isday == 'yes'){
                isday = "Day";
            } else{
                isday = "Night";
            }
            var min;
            var period;

            var d = new Date();
            const year = localtime.substring(0,4);
            const tempmonth = localtime.substring(6,7);
            const day = localtime.substring(8,10);
            var month = tempmonth-1;
            d.setUTCMonth(month);
            var dd = String(d);
            var finalMonth = dd.substring(4,7);
            var dataArr = [city, country, temp, wind, condition, humidity, precip, image, time, min, period, isday, year, finalMonth, day];
            res.render("data.ejs", {dataArr : dataArr});
        } else{
            console.log(error);
            res.write("You entered city is not have");
        }
    })
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running at port 3000...");
})
