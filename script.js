const form=document.getElementById("searchForm");
const cityInput=document.getElementById("cityInput");
const statusEl=document.getElementById("status");
const weatherEl=document.getElementById("weather");
const fields={
city:document.getElementById("cityName"),
country:document.getElementById("countryName"),
temperature:document.getElementById("temperature"),
condition:document.getElementById("condition"),
feelsLike:document.getElementById("feelsLike"),
humidity:document.getElementById("humidity"),
windSpeed:document.getElementById("windSpeed"),
icon:document.getElementById("weatherIcon")
};

const weatherCodes={
0:["Clear sky","☀️"],1:["Mainly clear","🌤️"],2:["Partly cloudy","⛅"],3:["Overcast","☁️"],
45:["Fog","🌫️"],48:["Rime fog","🌫️"],51:["Light drizzle","🌦️"],53:["Drizzle","🌦️"],55:["Heavy drizzle","🌧️"],
61:["Light rain","🌦️"],63:["Rain","🌧️"],65:["Heavy rain","🌧️"],71:["Light snow","🌨️"],73:["Snow","❄️"],
75:["Heavy snow","❄️"],80:["Rain showers","🌦️"],81:["Rain showers","🌧️"],82:["Heavy showers","⛈️"],
95:["Thunderstorm","⛈️"],96:["Thunderstorm with hail","⛈️"],99:["Thunderstorm with hail","⛈️"]
};

function setStatus(message=""){statusEl.textContent=message}

async function getWeather(city){
setStatus("Loading weather...");weatherEl.classList.add("hidden");
try{
const geoUrl=`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
const geoResponse=await fetch(geoUrl);
if(!geoResponse.ok)throw new Error("Unable to find the city.");
const geoData=await geoResponse.json();
if(!geoData.results?.length)throw new Error("City not found. Please check the spelling.");
const place=geoData.results[0];

const params=new URLSearchParams({
latitude:place.latitude,longitude:place.longitude,
current:"temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
timezone:"auto"
});
const weatherResponse=await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
if(!weatherResponse.ok)throw new Error("Weather data could not be loaded.");
const data=await weatherResponse.json();
const current=data.current;
const [condition,icon]=weatherCodes[current.weather_code]||["Unknown","🌤️"];

fields.city.textContent=place.name;
fields.country.textContent=[place.admin1,place.country].filter(Boolean).join(", ");
fields.temperature.textContent=Math.round(current.temperature_2m);
fields.condition.textContent=condition;
fields.feelsLike.textContent=`${Math.round(current.apparent_temperature)}°C`;
fields.humidity.textContent=`${current.relative_humidity_2m}%`;
fields.windSpeed.textContent=`${Math.round(current.wind_speed_10m)} km/h`;
fields.icon.textContent=icon;
setStatus("");weatherEl.classList.remove("hidden");
}catch(error){setStatus(error.message||"Something went wrong. Please try again.")}
}

form.addEventListener("submit",event=>{
event.preventDefault();
const city=cityInput.value.trim();
if(!city){setStatus("Please enter a city name.");return}
getWeather(city);
});
