import type { WeatherData } from "./types";
import type { ForecastData } from "./types";

const API_KEY = "e79a0d12ba2f55747a13ca54e077c4b4";

const cityInput = document.getElementById("cityInput") as HTMLInputElement;
const searchBtn = document.getElementById("searchBtn") as HTMLButtonElement;
const cityName = document.getElementById("cityName") as HTMLElement;

const temperature = document.getElementById("temperature") as HTMLElement;

const description = document.getElementById("description") as HTMLElement;

const humidity = document.getElementById("humidity") as HTMLElement;

const windSpeed = document.getElementById("windSpeed") as HTMLElement;

const pressure = document.getElementById("pressure") as HTMLElement;

const detailHumidity = document.getElementById("detailHumidity") as HTMLElement;

const detailSpeed = document.getElementById("detailWindSpeed") as HTMLElement;

const detailPressure = document.getElementById("detailPressure") as HTMLElement;

const firstDay = document.getElementById("firstday") as HTMLElement;
const firstDayWeather = document.getElementById(
  "firstday-weather",
) as HTMLElement;
const firstDayTemperature = document.getElementById(
  "firstday-temperature",
) as HTMLElement;

const secondDay = document.getElementById("secondday") as HTMLElement;
const secondDayWeather = document.getElementById(
  "secondday-weather",
) as HTMLElement;
const secondDayTemperature = document.getElementById(
  "secondday-temperature",
) as HTMLElement;

const thirdDay = document.getElementById("thirdDay") as HTMLElement;
const thirdDayWeather = document.getElementById(
  "thirdDay-weather",
) as HTMLElement;
const thirdDayTemperature = document.getElementById(
  "thirdDay-temperature",
) as HTMLElement;

const dayElements = [firstDay, secondDay, thirdDay];

const weatherElements = [firstDayWeather, secondDayWeather, thirdDayWeather];

const temperatureElements = [
  firstDayTemperature,
  secondDayTemperature,
  thirdDayTemperature,
];

async function getWeather(city: string): Promise<void> {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
  );
  const data: WeatherData = await response.json();
  displayWeather(data);
}

// Forecast for 3 days
async function getForecast(city: string): Promise<void> {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`,
  );

  const data: ForecastData = await response.json();

  displayForecast(data);
}

async function getWeatherByLocation(
  latitude: number,
  longitude: number,
): Promise<void> {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`,
  );

  const data: WeatherData = await response.json();

  displayWeather(data);
}

async function getForecastByLocation(
  latitude: number,
  longitude: number,
): Promise<void> {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`,
  );

  const data: ForecastData = await response.json();

  displayForecast(data);
}

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (!city) return;
  localStorage.setItem("lastCity", city);
  getWeather(city);
  getForecast(city);
});

function displayWeather(data: WeatherData): void {
  cityName.textContent = data.name;

  temperature.textContent = Math.round(data.main.temp).toString();

  description.textContent = `${data.weather[0]?.description}`;

  humidity.textContent = `Humidity: ${data.main.humidity}%`;

  windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;

  pressure.textContent = `Pressure: ${data.main.pressure} hPa`;

  detailHumidity.textContent = `${data.main.humidity}%`;

  detailSpeed.textContent = `${data.wind.speed} m/s`;

  detailPressure.textContent = `${data.main.pressure} hPa`;
}

function displayForecast(data: ForecastData): void {
  const threeDayForecast = data.list
    .filter((forecast) => forecast.dt_txt.includes("12:00:00"))
    .slice(1, 4);
  console.log(threeDayForecast);
  threeDayForecast.forEach((forecast, index) => {
    const dayElement = dayElements[index];
    const weatherElement = weatherElements[index];
    const temperatureElement = temperatureElements[index];

    if (!dayElement || !weatherElement || !temperatureElement) {
      return;
    }

    dayElement.textContent = new Date(forecast.dt_txt).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
      },
    );

    weatherElement.textContent = forecast.weather[0]?.description ?? "Unknown";

    temperatureElement.textContent = `${Math.round(forecast.main.temp)}°C`;

    const weatherMain = forecast.weather[0]?.main ?? "";
    updateForecastIcon(index, weatherMain);
  });
}
const forecastIcons = [
  {
    sun: document.getElementById("firstday-sun") as HTMLElement,
    cloud: document.getElementById("firstday-cloud") as HTMLElement,
    rain: document.getElementById("firstday-cloudrain") as HTMLElement,
  },
  {
    sun: document.getElementById("secondday-sun") as HTMLElement,
    cloud: document.getElementById("secondday-cloud") as HTMLElement,
    rain: document.getElementById("secondday-cloudrain") as HTMLElement,
  },
  {
    sun: document.getElementById("thirdday-sun") as HTMLElement,
    cloud: document.getElementById("thirdday-cloud") as HTMLElement,
    rain: document.getElementById("thirdday-cloudrain") as HTMLElement,
  },
];
function updateForecastIcon(index: number, weather: string): void {
  const icons = forecastIcons[index];

  if (!icons) return;

  icons.sun.classList.add("hidden");
  icons.cloud.classList.add("hidden");
  icons.rain.classList.add("hidden");

  if (weather === "Clear") {
    icons.sun.classList.remove("hidden");
  } else if (weather === "Rain" || weather === "Drizzle") {
    icons.rain.classList.remove("hidden");
  } else {
    icons.cloud.classList.remove("hidden");
  }
}
const savedCity = localStorage.getItem("lastCity");

if (savedCity) {
  cityInput.value = savedCity;

  getWeather(savedCity);
  getForecast(savedCity);
} else {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      getWeatherByLocation(latitude, longitude);
      getForecastByLocation(latitude, longitude);
    },
    () => {
      getWeather("Kathmandu");
      getForecast("Kathmandu");
    },
  );
}
