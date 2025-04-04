var unitIsCelcius = true;
var globalForecast = [];

// Maps the API's icons to the ones from https://erikflowers.github.io/weather-icons/
var weatherIconsMap = {
  "01d": "wi-day-sunny",
  "01n": "wi-night-clear",
  "02d": "wi-day-cloudy",
  "02n": "wi-night-cloudy",
  "03d": "wi-cloud",
  "03n": "wi-cloud",
  "04d": "wi-cloudy",
  "04n": "wi-cloudy",
  "09d": "wi-showers",
  "09n": "wi-showers",
  "10d": "wi-day-hail",
  "10n": "wi-night-hail",
  "11d": "wi-thunderstorm",
  "11n": "wi-thunderstorm",
  "13d": "wi-snow",
  "13n": "wi-snow",
  "50d": "wi-fog",
  "50n": "wi-fog"
};


$(function(){
  getClientPosition();
  startClock();  
});


function startClock(){
  setInterval(function(){
    $("#localTime").text(new Date().toLocaleTimeString());
  }, 1000);
}


function getClientPosition() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // 위치 확인용 로그 추가
            console.log("Latitude:", latitude, "Longitude:", longitude);

            // 위도 경도 얻은 후 처리
            updateForecast(latitude, longitude);
        }, function(error) {
            console.error("위치 정보를 가져올 수 없습니다.", error);
        });
    } else {
        alert("이 브라우저는 위치 정보를 지원하지 않습니다.");
    }
}



function getWeatherData(latitude, longitude){
  $.ajax({
    type: "GET",
    url: "https://thingproxy.freeboard.io/fetch/https://api.openweathermap.org/data/2.5/forecast/daily?APPID=9b4bbf30228eb8528d36e79d05da1fac&lat=" + latitude + "&lon=" + longitude + "&units=metric&cnt=5",
    cache: true,
    headers: {
      "Access-Control-Allow-Headers": "x-requested-with"
    },
    success: function(forecast){
      globalForecast = forecast;
      updateForecast(forecast);

      // Stops Refresh button's spinning animation
      $("#refreshButton").html("<i class='fa fa-refresh fa-fw'></i> Refresh");
    },
    error: function(error){
      console.log("Error with ajax: "+ error);
    }
  });
}


function updateForecast(latitude, longitude) {
    console.log("날씨 API 호출, 위도:", latitude, "경도:", longitude);
    
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast/daily?APPID=1d64e23d17960d480fce098907c06bf08&lat=" + latitude + "&lon=" + longitude + "&units=metric&cnt=5",
        success: function(data) {
            console.log("날씨 데이터:", data);
            // 여기에 날씨 데이터 처리 코드 추가
        },
        error: function(error) {
            console.error("날씨 데이터 로딩 오류", error);
        }
    });
}




// Refresh button handler
$("#refreshButton").on("click", function(){
  // Starts Refresh button's spinning animation
  $("#refreshButton").html("<i class='fa fa-refresh fa-spin fa-fw'></i>");
  getWeatherData();
});


// Celcius button handler.
// Converts every shown value to Celcius
$("#celcius").on("click", function(){
  if(!unitIsCelcius){
    $("#farenheit").removeClass("active");
    this.className = "active";

    // main day
    var today = globalForecast.list[0];
    today.temp.day = toCelcius(today.temp.day);
    today.temp.max = toCelcius(today.temp.max);
    today.temp.min = toCelcius(today.temp.min);
    globalForecast.list[0] = today;

    // week
    for(var i = 1; i < 5; i ++){
      var weekDay = globalForecast.list[i];
      weekDay.temp.day = toCelcius(weekDay.temp.day);
      weekDay.temp.max = toCelcius(weekDay.temp.max);
      weekDay.temp.min = toCelcius(weekDay.temp.min);
      globalForecast[i] = weekDay;
    }

    // update view with updated values
    updateForecast(globalForecast);

    unitIsCelcius = true;
  }
});


// Farenheit button handler
// Converts every shown value to Farenheit
$("#farenheit").on("click", function(){  
  if(unitIsCelcius){
    $("#celcius").removeClass("active");
    this.className = "active";
    
    // main day
    var today = globalForecast.list[0];
    today.temp.day = toFerenheit(today.temp.day);
    today.temp.max = toFerenheit(today.temp.max);
    today.temp.min = toFerenheit(today.temp.min);
    globalForecast.list[0] = today;

    // week
    for(var i = 1; i < 5; i ++){
      var weekDay = globalForecast.list[i];
      weekDay.temp.day = toFerenheit(weekDay.temp.day);
      weekDay.temp.max = toFerenheit(weekDay.temp.max);
      weekDay.temp.min = toFerenheit(weekDay.temp.min);
      globalForecast[i] = weekDay;
    }

    // update view with updated values
    updateForecast(globalForecast);
    
    unitIsCelcius = false;
  }
});


// Applies the following format to date: WeekDay, Month Day, Year
function getFormattedDate(date){
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date * 1000).toLocaleDateString("en-US",options);
}


// Formats the text to CamelCase
function toCamelCase(str) {
  var arr = str.split(" ").map(
    function(sentence){
      return sentence.charAt(0).toUpperCase() + sentence.substring(1);
    }
  );
  return arr.join(" ");
}


// Converts to Celcius
function toCelcius(val){
  return Math.round((val - 32) * (5/9));
}


// Converts to Farenheit
function toFerenheit(val){
  var degrees = (val * 1.8) + 32;
  var rounded = Math.round(degrees);
  return rounded;
}