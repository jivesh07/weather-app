const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherCard = document.getElementById("weatherCard");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const feelsLike = document.getElementById("feelsLike");

function getWeatherDescription(code) {
    const weatherCodes = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Slight snow",
        73: "Moderate snow",
        75: "Heavy snow",
        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        95: "Thunderstorm"
    };

    return weatherCodes[code] || "Unknown weather";
}

function getWeatherIcon(code) {
    if (code === 0) return "☀️";
    if (code === 1 || code === 2) return "🌤️";
    if (code === 3) return "☁️";
    if (code >= 45 && code <= 48) return "🌫️";
    if (code >= 51 && code <= 65) return "🌧️";
    if (code >= 71 && code <= 75) return "❄️";
    if (code >= 80 && code <= 82) return "🌦️";
    if (code === 95) return "⛈️";
    return "🌤️";
}

async function getWeather(city) {
    try {
        errorMessage.textContent = "";
        loading.style.display = "block";
        weatherCard.style.display = "none";

        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Unable to find city");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found");
        }

        const location = geoData.results[0];

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Weather data unavailable");
        }

        const weatherData = await weatherResponse.json();
        const currentWeather = weatherData.current;

        cityName.textContent = `${location.name}, ${location.country}`;
        temperature.textContent = `${Math.round(currentWeather.temperature_2m)}°C`;
        description.textContent = getWeatherDescription(currentWeather.weather_code);
        humidity.textContent = `${currentWeather.relative_humidity_2m}%`;
        windSpeed.textContent = `${currentWeather.wind_speed_10m} km/h`;
        feelsLike.textContent = `${Math.round(currentWeather.apparent_temperature)}°C`;

        document.querySelector(".weather-icon").textContent =
            getWeatherIcon(currentWeather.weather_code);

        weatherCard.style.display = "block";
    } catch (error) {
        errorMessage.textContent =
            error.message || "Something went wrong. Please try again.";
        weatherCard.style.display = "none";
    } finally {
        loading.style.display = "none";
    }
}

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (city === "") {
        errorMessage.textContent = "Please enter a city name.";
        return;
    }

    getWeather(city);
});

cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});

getWeather("Delhi");
