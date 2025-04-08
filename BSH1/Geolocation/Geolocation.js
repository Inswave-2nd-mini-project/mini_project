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



async function getWeatherData(latitude, longitude) {
  const url = `https://thingproxy.freeboard.io/fetch/https://api.openweathermap.org/data/2.5/forecast/daily?APPID=9b4bbf30228eb8528d36e79d05da1fac&lat=${latitude}&lon=${longitude}&units=metric&cnt=5`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      cache: 'force-cache'
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const forecast = await response.json();
    globalForecast = forecast;
    updateForecastData(forecast); // 이름 충돌 방지를 위해 함수 이름 변경

    // Refresh 버튼의 로딩 아이콘 제거
    document.getElementById("refreshButton").innerHTML = "<i class='fa fa-refresh fa-fw'></i> Refresh";
  } catch (error) {
    console.error("Error with fetch:", error);
  }
}

// 업데이트용 함수도 fetch로
async function updateForecast(latitude, longitude) {
  console.log("날씨 API 호출, 위도:", latitude, "경도:", longitude);
  const url = `https://api.openweathermap.org/data/2.5/forecast?appid=34714b1decae1247457c40194af36eb2&lat=${latitude}&lon=${longitude}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    console.log("날씨 데이터:", data);

    // ✅ 현재 날씨 정보 추출 (list[0])
    const current = data.list[0];
    const currentWeather = {
      city: data.city.name,
      country: data.city.country,
      time: new Date().toLocaleTimeString("ko-KR", { hour12: false }),
      date: new Date().toLocaleDateString("ko-KR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      temp: current.main.temp,
      feels_like: current.main.feels_like,
      weather: current.weather[0].description,
      icon: current.weather[0].icon,
      humidity: current.main.humidity,
      wind: current.wind.speed,
      temp_max: current.main.temp_max,
      temp_min: current.main.temp_min
    };

    // ✅ 5일치 요약: 날짜별 최고/최저 기온, 대표 날씨 설명
    const dailyMap = {};
    data.list.forEach(entry => {
      const date = entry.dt_txt.split(' ')[0];
      if (!dailyMap[date]) {
        dailyMap[date] = {
          temps: [],
          descriptions: {},
          minTemp: entry.main.temp_min,
          maxTemp: entry.main.temp_max
        };
      }

      const d = dailyMap[date];
      d.temps.push(entry.main.temp);
      d.minTemp = Math.min(d.minTemp, entry.main.temp_min);
      d.maxTemp = Math.max(d.maxTemp, entry.main.temp_max);

      const desc = entry.weather[0].description;
      d.descriptions[desc] = (d.descriptions[desc] || 0) + 1;
    });

    const dailyForecast = Object.entries(dailyMap).map(([date, values]) => {
      const mostFrequentDescription = Object.entries(values.descriptions).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
      return {
        date,
        min: Math.round(values.minTemp),
        max: Math.round(values.maxTemp),
        description: mostFrequentDescription
      };
    });

    // ✅ 원하는 값 출력
    console.log("현재 날씨 요약:", currentWeather);
    console.log("5일치 요약:", dailyForecast);

    // 이후 currentWeather, dailyForecast로 화면에 뿌릴 수 있음

  } catch (error) {
    console.error("날씨 데이터 로딩 오류", error);
  }
}

// 예시 함수: 실제 UI 업데이트하는 부분
function updateForecastData(forecast) {
  // forecast 데이터를 이용해 DOM 업데이트 등 처리
  console.log("업데이트된 예보:", forecast);
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