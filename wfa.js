const mainCard = document.querySelector(".mainCard");
const upcomingForecastBox = document.querySelector(".upcomingForecastBox");
const otherInfo = document.querySelector(".otherInfo");

//search
const search = document.querySelector("#search");
const searchBtn = document.querySelector(".searchBtn");

let searchValue = "Lucknow";
search.addEventListener("input", () => {
  searchValue = search.value;
});

searchBtn.addEventListener("click", () => {
  if (searchValue.trim() !== "") fetchWeatherInformation(searchValue);
});

search.addEventListener("keydown", (e) => { //enter key action
  if (e.key == "Enter") searchBtn.click();
});

//fetching and showinf main(today's) information
const cityName = document.querySelector(".cityName");
const dayAndDate = document.querySelector(".dayAndDate");
const emoji = document.querySelector(".emoji");
const weatherCondition = document.querySelector(".weatherCondition");
const temp = document.querySelector(".temp");
const feelsLike = document.querySelector(".feelsLike");
const min = document.querySelector(".min");
const max = document.querySelector(".max");
//other relevant information of today
const humidityValue = document.querySelector(".humidityValue");
const windSpeedValue = document.querySelector(".windSpeedValue");
const visibilityValue = document.querySelector(".visibilityValue");
//next 24 hour outlook
const next24outlook = document.querySelector(".next24outlook");
const next24 = document.querySelector(".next24");
//showing error screen
const alertErrors = document.querySelector(".alertErrors");
//for ma and min temp in next 24 hours
let maxTemp=-1000;
let minTemp=1000;

const fetchWeatherInformation = async (city) => {
  reset(); //resetting everything

  try {
    const getGeo = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=8becb0ac7bc1ed7c41d29bf515f922fd`,
    );
    let geoObj = await getGeo.json();

    let lat, lon;
    if (geoObj.length == 0) { //if : no city is found with the given name in searchbar
      alertErrors.classList.remove("hide");
      mainCard.classList.add("hide");
      otherInfo.classList.add("hide");
      next24outlook.classList.add("hide");
      upcomingForecastBox.classList.add("hide");
    } else {
      lat = geoObj[0].lat;
      lon = geoObj[0].lon;
      console.log(lat);
      console.log(lon);
    }

    const fetchInfo = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=8becb0ac7bc1ed7c41d29bf515f922fd`,
    );
    let infoObj = await fetchInfo.json();

    calcOutlook(infoObj.list);  //function to calculate next 24 hour temp and min,max tem in next 24 hour
    calcForecast(infoObj.list);  //function to give forecast of next 4 days

    cityName.textContent = `📍 ${infoObj.city.name}`;
    weatherCondition.textContent = infoObj.list[0].weather[0].description;

    let dateTime = infoObj.list[0].dt_txt; // gives string in format: "yyyy-mm-dd hh:mm:ss"
    let day = new Date(dateTime).toLocaleDateString("en-US", {
      weekday: "long",
    }); //it gaves the day on the given "dateTime" value (dateTime=infoObj.list[0].dt_txt)

    dayAndDate.textContent = `${day}, ${dateTime.slice(0, 10)}`;

    let e = codeTOEmoji(infoObj.list[0].weather[0].icon);
    emoji.textContent = e;

    temp.textContent = `🌡️ ${infoObj.list[0].main.temp}°C`;
    feelsLike.textContent = `Feels like: ${infoObj.list[0].main.feels_like}°C`;
    min.textContent = `Min: ${minTemp}°C`;
    max.textContent = `Max: ${maxTemp}°C`;
    humidityValue.textContent = `${infoObj.list[0].main.humidity}%`;
    windSpeedValue.textContent = `${infoObj.list[0].wind.speed} km/h`;

    let visibilityInKm = parseInt(infoObj.list[0].visibility) / 1000;
    visibilityValue.textContent = `${visibilityInKm} km`;

    console.log(infoObj.city.name);
    console.log(infoObj.list[0].dt_txt);
    console.log(
      new Date(dateTime).toLocaleDateString("en-US", { weekday: "long" }),
    );
    console.log(infoObj.list[0].weather[0].description);
    console.log(infoObj.list[0].weather[0].icon);
    console.log("Temp:",infoObj.list[0].main.temp);
    console.log("Feels Like",infoObj.list[0].main.feels_like);
    console.log("Min temp in this 3 hour window:",infoObj.list[0].main.temp_min);
    console.log("Max temp in this 3 hour window:",infoObj.list[0].main.temp_max);
    console.log(infoObj.list[0].main.humidity);
    console.log(infoObj.list[0].wind.speed);
    console.log(infoObj.list[0].visibility);
    console.log(infoObj.list);

    maxTemp=-1000;
    minTemp=1000;

    let currentTime=infoObj.list[0].dt;
    let sunrise=infoObj.city.sunrise;
    let sunset=infoObj.city.sunset;
    setTheme(currentTime,sunrise,sunset); //setting day or night theme

  } catch (err) {
    console.error("Error:", err);
  }
};

fetchWeatherInformation(searchValue);

//upcoming days weather information

// function to create new row of forecast
function newForecast(day, emote, condition, temp) {
  let elem = document.createElement("div");
  elem.classList.add("upcomingForecast");
  elem.innerHTML = `<span class="upcomingDay">${day}</span>
          <span class="upcomingEmoji">${emote}</span>
          <span class="upcomingCondition">${condition}</span>
          <span class="upcomingTemp">${temp}</span>`;
  upcomingForecastBox.append(elem);
}

function codeTOEmoji(emote) {
  let e;
  if (emote == "01d") e = "☀️";
  else if (emote == "02d") e = "🌤️";
  else if (emote == "03d") e = "☁️";
  else if (emote == "04d") e = "☁️";
  else if (emote == "09d") e = "🌧️";
  else if (emote == "10d") e = "🌦️";
  else if (emote == "11d") e = "⛈️";
  else if (emote == "13d") e = "❄️";
  else if (emote == "50d") e = "🌫️";
  else if (emote == "01n") e = "🌙";
  else if (emote == "02n") e = "☁️";
  else if (emote == "03n") e = "☁️";
  else if (emote == "04n") e = "☁️";
  else if (emote == "09n") e = "🌧️";
  else if (emote == "10n") e = "🌧️";
  else if (emote == "11n") e = "🌩️";
  else if (emote == "13n") e = "🌨️";
  else if (emote == "50n") e = "🌁";
  return e;
}

function calcForecast(x) {
  let count = 0;
  let skip4 = 0;//to skip the 12'O clock on first(current day) (3*4)
  x.forEach((element) => {
    let dateTime = element.dt_txt;
    let dt = dateTime.slice(11, 13);

    if (dt == "12" && count < 4 && skip4>=4) {
      let elemDay = new Date(dateTime).toLocaleDateString("en-US", {
        weekday: "long",
      });
      let elemEmote = codeTOEmoji(element.weather[0].icon);
      let elemCondition = element.weather[0].description;
      let elemTemp = element.main.temp;
      newForecast(elemDay, elemEmote, elemCondition, elemTemp); //creating new forecast by calling the newForecast

      count++;
    }
    skip4++;
  });
}

//reset : everytime the user searches a city everything resets first
function reset() {
  alertErrors.classList.add("hide");
  mainCard.classList.remove("hide");
  otherInfo.classList.remove("hide");
  next24outlook.classList.remove("hide");
  upcomingForecastBox.classList.remove("hide");
  upcomingForecastBox.textContent = `4-DAY FORECAST`;
}

//calculate the sliding 24 hour outlook

function calcOutlook(x) {
  for (let i = 0; i < 8; i++) {
    const item = x[i];
    let dateTime = item.dt_txt;
    let dt = dateTime.slice(8, 10);
    let month = dateTime.slice(5, 7);

    let monthName = {
      "01": "Jan",
      "02": "Feb",
      "03": "Mar",
      "04": "Apr",
      "05": "May",
      "06": "Jun",
      "07": "Jul",
      "08": "Aug",
      "09": "Sep",
      "10": "Oct",
      "11": "Nov",
      "12": "Dec",
    };
    let f = monthName[month];
    let ti=dateTime.slice(11,16);
    let e = codeTOEmoji(item.weather[0].icon);
    let te = item.main.temp;
    
    let minT = parseInt(item.main.temp_min); // for calculating the min temperature in next 24 hour
    minTemp=Math.min(minTemp,minT);
    let maxT = parseInt(item.main.temp_max);// for calculating the max temperature in next 24 hour
    maxTemp=Math.max(maxTemp,maxT);
    

    let element = document.createElement("div");
    element.classList.add("scrollItem");
    element.innerHTML = `<p class="scrollItemDate">${f} ${dt}</p>
    <p class="scrollItemTime">${ti}</p>
        <p class="scrollItemEmoji">${e}</p>
        <p class="scrollItemTemp">${te}</p>`;
    next24.append(element);
  }
}

//automatic day mode and night mode
function toNight(){
  document.documentElement.style.setProperty(`--bg`,`linear-gradient(135deg, #0F172A, #1E293B, #334155)`);
  document.documentElement.style.setProperty(`--card`,`rgba(15, 23, 42, 0.6)`);
  document.documentElement.style.setProperty(`--text`,`#F8FAFC`);

  document.documentElement.style.setProperty(`--input-bg`,`#1f2937`);
  document.documentElement.style.setProperty(`--input-text`,`#f9fafb`);
  document.documentElement.style.setProperty(`--input-border`,`#334155`);
  document.documentElement.style.setProperty(`--input-placeholder`,`#94a3b8`);
  document.documentElement.style.setProperty(`--input-focus`,`#60a5fa`);

  document.documentElement.style.setProperty(`--bg-search-btn`,`#3b82f6`);
  document.documentElement.style.setProperty(`--text-search-btn`,`#ffffff`);
  document.documentElement.style.setProperty(`--bg-search-btn-hover`,`#2563eb`);
  document.documentElement.style.setProperty(`--border-search-btn`,`#60a5fa`);
  document.documentElement.style.setProperty(`--border-search-btn-hover`,`#93c5fd`);

  document.documentElement.style.setProperty(`--card-bg`,`#1e293b`);
  document.documentElement.style.setProperty(`--card-border`,`#334155`);
  document.documentElement.style.setProperty(`--container-shadow`,`rgba(15, 23, 42, 0.35)`);
  document.documentElement.style.setProperty(`--heading`,`#f8fafc`);
  document.documentElement.style.setProperty(`--text`,`#e2e8f0`);
  document.documentElement.style.setProperty(`--subtext`,`#94a3b8`);
  document.documentElement.style.setProperty(`--box-shadow`,`rgba(255,255,255,0.08)`);
}

function toDay(){
  document.documentElement.style.setProperty(`--bg`,`linear-gradient(135deg, #70A1FF, #9DE0FF, #E0FAFF)`);
  document.documentElement.style.setProperty(`--card`,`rgba(255, 255, 255, 0.8)`);
  document.documentElement.style.setProperty(`--text`,`#0A192F`);

  document.documentElement.style.setProperty(`--input-bg`,`#ffffff`);
  document.documentElement.style.setProperty(`--input-text`,`#1f2937`);
  document.documentElement.style.setProperty(`--input-border`,`#cbd5e1`);
  document.documentElement.style.setProperty(`--input-placeholder`,`#64748b`);
  document.documentElement.style.setProperty(`--input-focus`,`#3b82f6`);

  document.documentElement.style.setProperty(`--bg-search-btn`,`#2563eb`);
  document.documentElement.style.setProperty(`--text-search-btn`,`#ffffff`);
  document.documentElement.style.setProperty(`--bg-search-btn-hover`,`#1d4ed8`);
  document.documentElement.style.setProperty(`--border-search-btn`,`#1d4ed8`);
  document.documentElement.style.setProperty(`--border-search-btn-hover`,`#2563eb`);

  document.documentElement.style.setProperty(`--card-bg`,`#ffffff`);
  document.documentElement.style.setProperty(`--card-border`,`#dbeafe`);
  document.documentElement.style.setProperty(`--container-shadow`,`rgba(148, 163, 184, 0.2)`);
  document.documentElement.style.setProperty(`--heading`,`#1e293b`);
  document.documentElement.style.setProperty(`--text`,`#334155`);
  document.documentElement.style.setProperty(`--subtext`,`#64748b`);
  document.documentElement.style.setProperty(`--box-shadow`,`rgba(0,0,0,0.3)`);
}

function setTheme(currentTime,sunrise,sunset){
  if(currentTime>=sunrise && currentTime<sunset)
    toDay();
  else
    toNight();
}
