const apiKey = "71940c254b18c16676e30b18cd7e9263";

const searchForm = document.querySelector("#search-form");
const cityInput = document.querySelector("#city-input");
const weatherInfoContainer = document.querySelector("#weather-info-container");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const cityName = cityInput.value.trim();

  if (cityName) {
    localStorage.setItem("lastCity", cityName);
    getWeather(cityName);
    getForecast(cityName);
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

async function getForecast(city) {
  const forecastContainer = document.querySelector("#forecast-container");
  forecastContainer.innerHTML = `<p>Loading ...</p>`;

  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=th`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("!Not found!");
    const data = await response.json();

    const dailyData = {};
    data.list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      const time = item.dt_txt.split(" ")[1];
      if (!dailyData[date]) dailyData[date] = [];
      dailyData[date].push(item);
    });

    const forecastHtml = Object.keys(dailyData)
      .slice(0, 5)
      .map((date) => {
        const dayItems = dailyData[date];
        let noonItem = dayItems.find((i) => i.dt_txt.includes("12:00:00"));
        if (!noonItem) noonItem = dayItems[Math.floor(dayItems.length / 2)];

        const { temp } = noonItem.main;
        const { description, icon } = noonItem.weather[0];

        const dayName = new Date(date).toLocaleDateString("th-TH", {
          weekday: "short",
          day: "numeric",
          month: "short",
        });

        return `
        <div class="forecast-day">
          <h3>${dayName}</h3>
          <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
          <p>${temp.toFixed(1)}°C</p>
          <p>${description}</p>
        </div>
      `;
      })
      .join("");

    forecastContainer.innerHTML = forecastHtml;
  } catch (error) {
    forecastContainer.innerHTML = `<p class="error">${error.message}</p>`;
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

document.addEventListener("DOMContentLoaded", () => {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    cityInput.value = lastCity;
    getWeather(lastCity);
    getForecast(lastCity);
  }
});
