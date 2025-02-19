const box = document.querySelector(".box"),
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
weatherPart = box.querySelector(".weather-part"),
wIcon = weatherPart.querySelector("img"),
arrowBack = box.querySelector("header i");

const apiKey = "c33b3d947fd84464a2d172606251902"; // Replace with your WeatherAPI key
let api;

inputField.addEventListener("keyup", e => {
    // if user pressed enter and input value is not empty
    if (e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) { // Check if browser supports geolocation API
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser does not support geolocation API");
    }
});

// Function to get weather by city name
function requestApi(city) {
    api = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
    fetchData();
}

// Function to get weather by geolocation
function onSuccess(position) {
    const { latitude, longitude } = position.coords; // Get latitude & longitude
    api = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&aqi=no`;
    fetchData();
}

// Function to handle errors
function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

// Function to fetch weather data
function fetchData() {
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");

    fetch(api)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then(result => weatherDetails(result))
        .catch(error => {
            console.error("Fetch error:", error);
            infoTxt.innerText = "Failed to fetch weather data. Please check the city name or try again later.";
            infoTxt.classList.replace("pending", "error");
        });
}

// Function to display weather details
function weatherDetails(info) {
    if (!info || !info.location) {
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
        return;
    }

    const city = info.location.name;
    const country = info.location.country;
    const { text: description, code } = info.current.condition;
    const temp = info.current.temp_c;
    const feels_like = info.current.feelslike_c;
    const humidity = info.current.humidity;

    // Set weather icon based on condition code
    if (code === 1000) {
        wIcon.src = "icons/clear.svg"; // Clear sky
    } else if ([1087, 1273, 1276, 1279, 1282].includes(code)) {
        wIcon.src = "icons/storm.svg"; // Thunderstorms
    } else if ([1066, 1114, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code)) {
        wIcon.src = "icons/snow.svg"; // Snow
    } else if ([1030, 1135, 1147].includes(code)) {
        wIcon.src = "icons/haze.svg"; // Fog/Mist
    } else if ([1003, 1006, 1009, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code)) {
        wIcon.src = "icons/cloud.svg"; // Cloudy
    } else {
        wIcon.src = "icons/rain.svg"; // Default to rain
    }

    // Update UI with weather data
    weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
    weatherPart.querySelector(".weather").innerText = description;
    weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
    weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
    
    infoTxt.classList.remove("pending", "error");
    infoTxt.innerText = "";
    inputField.value = "";
    box.classList.add("active");
}

// Event listener for back button
arrowBack.addEventListener("click", () => {
    box.classList.remove("active");
});
