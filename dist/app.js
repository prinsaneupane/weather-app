var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_KEY = "e79a0d12ba2f55747a13ca54e077c4b4";
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const pressure = document.getElementById("pressure");
const detailHumidity = document.getElementById("detailHumidity");
const detailSpeed = document.getElementById("detailWindSpeed");
const detailPressure = document.getElementById("detailPressure");
const firstDay = document.getElementById("firstday");
const firstDayWeather = document.getElementById("firstday-weather");
const firstDayTemperature = document.getElementById("firstday-temperature");
const secondDay = document.getElementById("secondday");
const secondDayWeather = document.getElementById("secondday-weather");
const secondDayTemperature = document.getElementById("secondday-temperature");
const thirdDay = document.getElementById("thirdDay");
const thirdDayWeather = document.getElementById("thirdDay-weather");
const thirdDayTemperature = document.getElementById("thirdDay-temperature");
const dayElements = [firstDay, secondDay, thirdDay];
const weatherElements = [firstDayWeather, secondDayWeather, thirdDayWeather];
const temperatureElements = [
    firstDayTemperature,
    secondDayTemperature,
    thirdDayTemperature,
];
function getWeather(city) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = yield response.json();
        displayWeather(data);
    });
}
// Forecast for 3 days
function getForecast(city) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
        const data = yield response.json();
        displayForecast(data);
    });
}
function getWeatherByLocation(latitude, longitude) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
        const data = yield response.json();
        displayWeather(data);
    });
}
function getForecastByLocation(latitude, longitude) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
        const data = yield response.json();
        displayForecast(data);
    });
}
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (!city)
        return;
    localStorage.setItem("lastCity", city);
    getWeather(city);
    getForecast(city);
});
function displayWeather(data) {
    var _a;
    cityName.textContent = data.name;
    temperature.textContent = Math.round(data.main.temp).toString();
    description.textContent = `${(_a = data.weather[0]) === null || _a === void 0 ? void 0 : _a.description}`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
    pressure.textContent = `Pressure: ${data.main.pressure} hPa`;
    detailHumidity.textContent = `${data.main.humidity}%`;
    detailSpeed.textContent = `${data.wind.speed} m/s`;
    detailPressure.textContent = `${data.main.pressure} hPa`;
}
function displayForecast(data) {
    const threeDayForecast = data.list
        .filter((forecast) => forecast.dt_txt.includes("12:00:00"))
        .slice(1, 4);
    console.log(threeDayForecast);
    threeDayForecast.forEach((forecast, index) => {
        var _a, _b, _c, _d;
        const dayElement = dayElements[index];
        const weatherElement = weatherElements[index];
        const temperatureElement = temperatureElements[index];
        if (!dayElement || !weatherElement || !temperatureElement) {
            return;
        }
        dayElement.textContent = new Date(forecast.dt_txt).toLocaleDateString("en-US", {
            weekday: "long",
        });
        weatherElement.textContent = (_b = (_a = forecast.weather[0]) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : "Unknown";
        temperatureElement.textContent = `${Math.round(forecast.main.temp)}°C`;
        const weatherMain = (_d = (_c = forecast.weather[0]) === null || _c === void 0 ? void 0 : _c.main) !== null && _d !== void 0 ? _d : "";
        updateForecastIcon(index, weatherMain);
    });
}
const forecastIcons = [
    {
        sun: document.getElementById("firstday-sun"),
        cloud: document.getElementById("firstday-cloud"),
        rain: document.getElementById("firstday-cloudrain"),
    },
    {
        sun: document.getElementById("secondday-sun"),
        cloud: document.getElementById("secondday-cloud"),
        rain: document.getElementById("secondday-cloudrain"),
    },
    {
        sun: document.getElementById("thirdday-sun"),
        cloud: document.getElementById("thirdday-cloud"),
        rain: document.getElementById("thirdday-cloudrain"),
    },
];
function updateForecastIcon(index, weather) {
    const icons = forecastIcons[index];
    if (!icons)
        return;
    icons.sun.classList.add("hidden");
    icons.cloud.classList.add("hidden");
    icons.rain.classList.add("hidden");
    if (weather === "Clear") {
        icons.sun.classList.remove("hidden");
    }
    else if (weather === "Rain" || weather === "Drizzle") {
        icons.rain.classList.remove("hidden");
    }
    else {
        icons.cloud.classList.remove("hidden");
    }
}
const savedCity = localStorage.getItem("lastCity");
if (savedCity) {
    cityInput.value = savedCity;
    getWeather(savedCity);
    getForecast(savedCity);
}
else {
    navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        getWeatherByLocation(latitude, longitude);
        getForecastByLocation(latitude, longitude);
    }, () => {
        getWeather("Kathmandu");
        getForecast("Kathmandu");
    });
}
export {};
//# sourceMappingURL=app.js.map