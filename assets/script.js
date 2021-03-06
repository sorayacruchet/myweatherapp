// Display the current date and time via timestamp
// Date display
function formatDate(timestamp) {
    let date = new Date(timestamp);
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    let day = days[date.getDay()];
    return `${day} ${formatHours(timestamp)}`;
}

// Hour display
function formatHours(timestamp) {
    let date = new Date(timestamp);
    let hours = date.getHours();
    if (hours < 10) {
        hours = `0${hours}`;
    }
    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    return `${hours}:${minutes}`;
}

/// Display the current weather conditions
function displayWeatherConditions(response) {
    // Display date
    let currentDate = document.querySelector("#current-date");
    currentDate.innerHTML = `Last updated: ${formatDate((response.data.dt + response.data.timezone) * 1000)}`;
    // Display city name
    let cityName = document.querySelector("#city-name");
    cityName.innerHTML = `${response.data.name}, ${response.data.sys.country}`;
    // Display temperature
    celsiusTemperature = response.data.main.temp;
    let apiTemperature = Math.round(celsiusTemperature);
    let temperatureDisplay = document.querySelector("#current-temperature");
    temperatureDisplay.innerHTML = `${apiTemperature}`;
    // Display icon & description
    let currentIcon = document.querySelector("#current-icon");
    currentIcon.innerHTML = `<img title="${response.data.weather[0].description}" src="http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png">`;
    // Display the parameters
    let feels = document.querySelector("#feels-like");
    let humidity = document.querySelector("#humidity");
    let wind = document.querySelector("#wind");
    windSpeed = Math.round(response.data.wind.speed * 3.6);
    feelsTemperature = response.data.main.feels_like;
    feels.innerHTML = `<i class="fas fa-info-circle"></i> Feels like: ${Math.round(feelsTemperature)}°`;
    humidity.innerHTML = `<i class="fas fa-umbrella"></i> Humidity: ${response.data.main.humidity}%`;
    wind.innerHTML = `<i class="fas fa-wind"></i> Wind: ${windSpeed}km/h`;
}

// Display the next hours forecast (every 3 hours)
function displayForecast(response) {
    let forecastElement = document.querySelector("#forecast");
    // Fixing forecast duplication element
    forecastElement.innerHTML = null;
    // Init forecast
    let forecast = null;
    // Display forecasts col
    for (let index = 0; index < 3; index++) {
        forecast = response.data.list[index];
        let timezone = response.data.city.timezone;
        forecastElement.innerHTML += `
      <div class="col p-0">
            <ul>
                <li class="forecast-hours">${formatHours((forecast.dt + timezone) * 1000)}</li>
                <li class="forecast-icons">
                    <img title="${forecast.weather[0].description}" src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png">
                </li>
                <li class="forecast-temperatures">
                    <strong><span class="forecast-max">${Math.round(forecast.main.temp_max)}</span>°</strong>
                    <span class="forecast-min">${Math.round(forecast.main.temp_min)}</span>°
                </li>
            </ul>
        </div>
    `;
    }
}

// Gets the weather conditions after the user submits the form. Use axios to get the API datas related to this city.
function wrongCityInput(event) {
    alert("Mmmmmmm... you are... 🌎📌 not here! Please, type a valid city or country name 🧭!");
}

function search(city) {
    let apiUnit = "metric";
    let apiKey = "c3713b1bcebb5ce5f896fa8a7eec12ab";
    // Current weather conditions
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${apiUnit}&appid=${apiKey}`;
    axios.get(apiUrl).then(displayWeatherConditions).catch(wrongCityInput);
    // Forecast 
    apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${apiUnit}&appid=${apiKey}`;
    axios.get(apiUrl).then(displayForecast);
}

// Form submission
function handleCitySubmit(event) {
    event.preventDefault();
    cityInput = document.querySelector("#city-input");
    search(cityInput.value);
}

// Form submission event
let formSubmit = document.querySelector("form");
formSubmit.addEventListener("submit", handleCitySubmit);

// Current Location button
// Uses the Geolocation API to get users GPS coordinates and display the weather condidtions

function showGeolocationConditions(response) {
    // Display date
    let currentDate = document.querySelector("#current-date");
    currentDate.innerHTML = `Last updated: ${formatDate(response.data.dt * 1000)}`;
    // Display the temperature
    celsiusTemperature = response.data.main.temp;
    let apiTemperature = Math.round(celsiusTemperature);
    let temperatureDisplay = document.querySelector("#current-temperature");
    temperatureDisplay.innerHTML = `${apiTemperature}`;
    // Display the location
    let cityName = document.querySelector("#city-name");
    cityName.innerHTML = `${response.data.name}, ${response.data.sys.country}`;
    // Display the parameters
    let feels = document.querySelector("#feels-like");
    let humidity = document.querySelector("#humidity");
    let wind = document.querySelector("#wind");
    windSpeed = Math.round(response.data.wind.speed * 3.6);
    feelsTemperature = response.data.main.feels_like;
    feels.innerHTML = `<i class="fas fa-info-circle"></i> Feels like: ${Math.round(feelsTemperature)}°`;
    humidity.innerHTML = `<i class="fas fa-umbrella"></i> Humidity: ${response.data.main.humidity}%`;
    wind.innerHTML = `<i class="fas fa-wind"></i> Wind: ${windSpeed}km/h`;
}

function geolocationData(event) {
    event.preventDefault();
    function getDataConditions(position) {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        let unit = "metric";
        let apiKey = "c3713b1bcebb5ce5f896fa8a7eec12ab";
        let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;
        axios.get(apiUrl).then(showGeolocationConditions);
        // Forecast 
        apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;
        axios.get(apiUrl).then(displayForecast);
    }
    // First gets the temperature of the current position via getDataConditions and then display its parameters via showGeolocationConditions & displayForecast
    navigator.geolocation.getCurrentPosition(getDataConditions);
}

// Geolocation Btn events
let geolocationBtn = document.querySelector("#geolocation-button");
geolocationBtn.addEventListener("click", geolocationData);

//  Temperature unit conversion: Celsius <-> Fahrenheit
// Setting as global variables to fix conversion bug
let celsiusTemperature = null;
let feelsTemperature = null;
let windSpeed = null;

// Celsius display
function displayCelsius(event) {
    event.preventDefault();
    fahrenheit.classList.remove("active");
    celsius.classList.add("active");
    let temperatureValue = document.querySelector("#current-temperature");
    temperatureValue.innerHTML = Math.round(celsiusTemperature);
    let feels = document.querySelector("#feels-like");
    feels.innerHTML = `<i class="fas fa-info-circle"></i> Feels like: ${Math.round(feelsTemperature)}°`;
    // Keeping wind in km/h
    let wind = document.querySelector("#wind");
    wind.innerHTML = `<i class="fas fa-wind"></i> Wind: ${windSpeed}km/h`;
    // João method for the forecast:
    let forecastMax = document.querySelectorAll(".forecast-max");
    forecastMax.forEach(function (item) {
        // grabbing the current value to convert
        let currentTemp = item.innerHTML;
        // convert to Celsius
        item.innerHTML = Math.round(((currentTemp - 32) * 5) / 9);
    });
    let forecastMin = document.querySelectorAll(".forecast-min");
    forecastMin.forEach(function (item) {
        // grabbing the current value to convert
        let currentTemp = item.innerHTML;
        // convert to Celsius
        item.innerHTML = Math.round(((currentTemp - 32) * 5) / 9);
    });
    // to avoid double conversion
    celsius.removeEventListener("click", displayCelsius);
    fahrenheit.addEventListener("click", displayFahrenheit);
}

// Fahrenheit display
function displayFahrenheit(event) {
    event.preventDefault();
    celsius.classList.remove("active");
    fahrenheit.classList.add("active");
    let temperatureValue = document.querySelector("#current-temperature");
    let fahrenheitValue = Math.round(celsiusTemperature * 9 / 5) + 32;
    temperatureValue.innerHTML = fahrenheitValue;
    let feels = document.querySelector("#feels-like");
    feels.innerHTML = `<i class="fas fa-info-circle"></i> Feels like: ${Math.round((feelsTemperature * 9 / 5) + 32)}°`;
    // Also converting wind into mph
    let wind = document.querySelector("#wind");
    wind.innerHTML = `<i class="fas fa-wind"></i> Wind: ${Math.round(windSpeed/1.609)}mph`;
    // João method for the forecast:
    let forecastMax = document.querySelectorAll(".forecast-max");
    forecastMax.forEach(function (item) {
        // grabbing the current value to convert
        let currentTemp = item.innerHTML;
        // convert to Fahrenheit
        item.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
    });
    let forecastMin = document.querySelectorAll(".forecast-min");
    forecastMin.forEach(function (item) {
        // grabbing the current value to convert
        let currentTemp = item.innerHTML;
        // convert to Fahrenheit
        item.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
    });
    // to avoid double conversion
    celsius.addEventListener("click", displayCelsius);
    fahrenheit.removeEventListener("click", displayFahrenheit);
}

// Conversion click Events
let celsius = document.querySelector("#celsius-temperature");
celsius.addEventListener("click", displayCelsius);

let fahrenheit = document.querySelector("#fahrenheit-temperature");
fahrenheit.addEventListener("click", displayFahrenheit);

// Default city on load
search("Venise");