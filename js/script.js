const apiKey = "71940c254b18c16676e30b18cd7e9263";

const searchForm = document.querySelector("#search-form");
const cityInput = document.querySelector("#city-input");
const weatherInfoContainer = document.querySelector("#weather-info-container");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const cityName = cityInput.value.trim();

  if (cityName) {
    localStorage.setItem('lastCity', cityName);
    getWeather(cityName);
  } else {
    alert("กรุณากรอกชื่อเมือง");
  }
});

async function getWeather(city) {
  weatherInfoContainer.innerHTML = `<p>☹︎□︎♋︎♎︎♓︎■︎♑︎📬︎📬︎📬︎</p>`;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=th`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("☠︎□︎⧫︎ ♐︎□︎◆︎■︎♎︎");
    }
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    weatherInfoContainer.innerHTML = `<p class="error">${error.message}</p>`;
  }
}

function displayWeather(data) {
  const { name, main, weather } = data;
  const { temp, humidity } = main;
  const { description, icon, main: mainWeather } = weather[0];

  const weatherHtml = `
        <h2 class="text-2xl font-bold">${name}</h2>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
        <p class="temp">${temp.toFixed(1)}°C</p>
        <p>${description}</p>
        <p>ความชื้น: ${humidity}%</p>
    `;
  weatherInfoContainer.innerHTML = weatherHtml;
  weatherInfoContainer.classList.remove("fade-in"); 
  void weatherInfoContainer.offsetWidth; 
  weatherInfoContainer.classList.add("fade-in");
  setBackgroundByWeather(mainWeather);
}

function setBackgroundByWeather(mainWeather) {
  const body = document.body;

  const weatherColors = {
    Clear: "#f9cf7aff",
    Clouds: "#607D8B",
    Rain: "#4A90E2",
    Thunderstorm: "#3E3E3E",
    Drizzle: "#76c7c0",
    Snow: "#ECEFF1",
    Mist: "#B0BEC5",
    Haze: "#B0BEC5",
    Fog: "#90A4AE",
    Smoke: "#757575",
    Dust: "#bcaaa4",
    Sand: "#f4a261",
    Ash: "#8e8e8e",
    Squall: "#37474F",
    Tornado: "#212121",
  };

  const color = weatherColors[mainWeather] || "#051923";
  body.style.backgroundColor = color;
}

document.addEventListener('DOMContentLoaded', () => {
  const lastCity = localStorage.getItem('lastCity');
  if (lastCity) {
    cityInput.value = lastCity;
    getWeather(lastCity);
  }
});