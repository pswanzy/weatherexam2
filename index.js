const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

//displays index.html of root path
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html")
});

//invoked after hitting go in the html form
app.post("/", function(req, res) {

  // takes in the zip from the html form, display in // console. Takes in as string, ex. for zip 02139
  var city = String(req.body.cityID);
  console.log(req.body.cityID);

  //build up the URL for the JSON query, API Key is // secret and needs to be obtained by signup 
  const units = "imperial";
  const apiKey = "f418a32419cf73a83192c280a7b273bf";
  const url = "https://api.openweathermap.org/data/2.5/weather?id=" + city + "&units=" + units + "&APPID=" + apiKey;

  // this gets the data from Open WeatherPI
  https.get(url, function(response) {
    console.log(response.statusCode);

    // gets individual items from Open Weather API
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const city2 = weatherData.name;
      const weatherDescription = weatherData.weather[0].description;
      const humidity = weatherData.main.humidity;
      const windspd = weatherData.wind.speed;
      const wind_dir = weatherData.wind.deg;
      const cloudiness = weatherData.clouds.all;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      // displays the output of the results
      res.write("<h1> The weather in " + city2 + " is " + weatherDescription + "</h1>");
      res.write("<h2>The Temperature is " + temp + " Degrees Fahrenheit</h2>");
      res.write("<h2>The humidity is " + humidity + "% with " + cloudiness + "% cloud-cover</h2>");
      res.write("<h2>The wind speed is " + windspd + "mph from " + wind_dir + " nautical degrees</h2>")
      res.write("<img src=" + imageURL + ">");
      res.send();
    });
  });
})


//Code will run on 3000 or any available open port
app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port")
});