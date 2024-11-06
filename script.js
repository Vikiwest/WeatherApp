function showWelcomeMessage() {
  const hours = new Date().getHours();
  let message;

  if (hours < 12) {
    message = "Good morning!";
  } else if (hours < 18) {
    message = "Good afternoon! ";
  } else {
    message = "Good evening! ";
  }

  document.getElementById("welcomeMessage").textContent = message;
}

// Call the function on page load
window.onload = showWelcomeMessage;

// Get all necessary elements from the DOM
const app = document.querySelector(".weather-app");
const temp = document.getElementById("temperature");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const conditionOutput = document.querySelector(".condition");
const nameOutput = document.querySelector(".name");
const icon = document.querySelector(".icon");
const cloudOutput = document.querySelector(".cloud");
const humidityOutput = document.querySelector(".humidity");
const windOutput = document.querySelector(".wind");
const form = document.getElementById("locationInput");
const search = document.querySelector(".search");
const btn = document.querySelector(".submit");
const cities = document.querySelectorAll(".city");

// Default city when the page loads
let cityInput = "Lagos";
let apiKey = "11d7c2026be44641b85195426240211";

// Add click event to each city in the panel
cities.forEach((city) => {
  city.addEventListener("click", (e) => {
    // Change from default city to clicked one
    cityInput = e.target.innerHTML.trim();
    console.log("Updated city:", cityInput);

    //Updated city name Output
    nameOutput.innerHTML = cityInput;

    //Fetch the new weather data and fade out the app for smooth transition
    fetchWeatherData();
    app.style.opacity = "0"; // Fade out the app
  });
});

// Add submit event to the form
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent default form behavior

  if (search.value.length === 0) {
    alert("Please type in a city name");
  } else {
    cityInput = search.value;
    console.log("Updated city (search):", cityInput);

    // Update the city name output to show the searched city
    nameOutput.innerHTML = cityInput;

    //Fetch new weather data
    fetchWeatherData();

    search.value = ""; // Clear input field
    app.style.opacity = "0"; // Fade out the app
  }
});

// Function that returns a day of the week
function dayOfTheWeek(day, month, year) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekday[new Date(`${year}-${month}-${day}`).getDay()]; // Corrected date format
}

// Function that fetches and displays the data from the weather API
function fetchWeatherData() {
  app.style.opacity = "0";
  fetch(
    `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityInput}&aqi=no`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error.message); // Show error message
        app.style.opacity = "1"; // Fade in again
        return; // Exit if there's an error
      }
      console.log(data); // Console the data

      // Add temperature and weather condition to the page
      let isCelsius = true;
      let temperatureCelsius = null; // Set to the temperature value in Celsius

      // Store the temperature in Celsius for later use
      temperatureCelsius = data.current.temp_c;

      // Display initial temperature in Celsius
      temp.innerHTML = temperatureCelsius + "&#176;C";
      conditionOutput.innerHTML = data.current.condition.text;

      // Add click event to toggle temperature on click
      temp.addEventListener("click", toggleTemperature);

      function toggleTemperature() {
        if (isCelsius) {
          // Convert Celsius to Fahrenheit
          let temperatureFahrenheit = (temperatureCelsius * 9) / 5 + 32;
          temp.innerHTML = `${temperatureFahrenheit.toFixed(1)}&#176;F`;
        } else {
          // Display temperature in Celsius
          temp.innerHTML = `${temperatureCelsius}&#176;C`;
        }
        isCelsius = !isCelsius;
      }

      // Get the date and time from the city
      const date = data.location.localtime;
      const y = parseInt(date.substr(0, 4));
      const m = parseInt(date.substr(5, 2));
      const d = parseInt(date.substr(8, 2));
      const time = date.substr(11);

      // Reformat the date
      dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m} ${y}`;
      timeOutput.innerHTML = time;

      // Get the corresponding icon URL
      const iconId = data.current.condition.icon.substr(
        "//cdn.weatherapi.com/weather/64x64/".length
      );
      console.log("Icon ID:", iconId);
      icon.src = `https://cdn.weatherapi.com/weather/64x64/${iconId}`;

      // Add the weather details to the page
      cloudOutput.innerHTML = data.current.cloud + "%";
      humidityOutput.innerHTML = data.current.humidity + "%";
      windOutput.innerHTML = data.current.wind_kph + "km/h";

      // Set default time of day
      let timeOfDay = "day";
      if (!data.current.is_day) {
        timeOfDay = "night";
      }

      // Define code variable
      const code = data.current.condition.code;

      // Set background images based on weather conditions
      if (code === 1000) {
        app.style.backgroundImage = `url(./images/${timeOfDay}/clear.jpg)`;
        btn.style.background = timeOfDay == "night" ? "#181e27" : "#e5ba92";
      } else if ([1003, 1006, 1009].includes(code)) {
        app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpg)`;
        btn.style.background = timeOfDay == "night" ? "#181e27" : "#fa6d1b";
      } else if ([1063, 1069, 1072, 1150, 1153].includes(code)) {
        app.style.backgroundImage = `url(./images/${timeOfDay}/rainy.jpg)`;
        btn.style.background = timeOfDay == "night" ? "#325c80" : "#647d75";
      } else {
        app.style.backgroundImage = `url(./images/${timeOfDay}/snowy.jpg)`;
        btn.style.background = timeOfDay == "night" ? "#1b1b1b" : "#4d72aa";
      }

      // Fade in the page once all is done
      app.style.opacity = "1";
    })
    .catch(() => {
      alert("City not found, please try again");
      app.style.opacity = "1";
    });
}

// Call the function on page load
fetchWeatherData();
// // Fade in the page
// app.style.opacity = "1";
