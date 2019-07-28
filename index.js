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
    request("http://api.apixu.com/v1/current.json?key=f2606afa6756456195e34300192807&q="+userCity, (respone, error , body) => {
        if(body){
            const data = JSON.parse(body);
            const city = data.location.name;
            const region = data.location.region;
            const country = data.location.country;
            const temp = data.current.temp_c;
            const wind = data.current.wind_mph;
            const condition = data.current.condition.text;
            var dataArr = [city, region, country, temp, wind, condition];
            res.render("data.ejs", {dataArr : dataArr});
        }
    })
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running at port 3000...")
})