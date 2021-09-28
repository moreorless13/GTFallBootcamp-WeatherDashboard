let userFormEl = document.querySelector('#user-form');
let previousSearches = document.querySelector('#citiesList');
let cityInputEl = document.querySelector('#city');
let currentWeatherEl = document.querySelector('#current-weather');
let cityNameEl = document.querySelector('#city-name');
let currentTemperatureEl = document.querySelector('#current-temperature');
let currentWindEl = document.querySelector('#current-wind');
let currentHumidityEl = document.querySelector('#current-humidity');
let currentUVIndexEl = document.querySelector('#current-UVIndex');
let fiveDayForecastEl = document.querySelector('#five-day-forecast');
let apiKey = '88cbdd38232fa62b5e7c1f5c2ad6b1df'

let cities = [];
// form submit handler
const renderCities = () => {
    previousSearches.innerHTML = '';
    for (let i = 0; i < cities.length; i++) {
        let storedCity = cities[i];
        let li = document.createElement("li");
        li.textContent = storedCity;
        li.setAttribute('data-index', i);
        previousSearches.appendChild(li);
    }
}

const init = () => {
    let storedCities = JSON.parse(localStorage.getItem("cities"));

    if(storedCities !== null) {
        cities = storedCities;
    }

    renderCities();
    formSubmitHandler();
}
const storeCities = () => {
    localStorage.setItem("cities", JSON.stringify(cities));
}

const formSubmitHandler = (event) =>{
    event.preventDefault();

    let cityName = cityInputEl.value.trim();
    if(cityName){
        getCityInput(cityName);
        cities.push(cityName);
        cityInputEl.value = '';

    } 
    storeCities();
    renderCities();
}
// button click handler
// get city from the user input to create the api call

const getCityInput = (city) => {
    let apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=88cbdd38232fa62b5e7c1f5c2ad6b1df';
    fetch(apiUrl)
        .then(function(response) {
            if(response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);
                    console.log(data[0].name);
                    console.log(data[0].lat);
                    console.log(data[0].lon);
                    getDisplayName(data[0].name);
                    getCityWeather(data[0].lat, data[0].lon);
                });
            } else {
                alert('Please enter a valid city: ' + response.statusText)
            }
        })
        .catch(function (error) {
            alert('Unable to find City');
        })
}

const getCityWeather = (lat, lon) => {
    let keyUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly&units=imperial&appid=' + apiKey;
    fetch(keyUrl)
        .then(function (response) {
            if(response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    console.log(data.current);
                    getWeatherDisplayInfo(data.current, data.daily)
                })
            }
        })
}

const getDisplayName = (name) => {
    let cityNameDisplay = name;
    cityNameEl.textContent = cityNameDisplay; 
}

const getWeatherDisplayInfo = (current, daily) => {
    let currentTemperature = current.temp;
    let currentWind = current.wind_speed;
    let currentHumidity = current.humidity;
    let currentUVIndex = current.uvi;
    let currentWeather = current.weather;
    let currentWeatherDescription = current.weather[0].description;
    currentTemperatureEl.textContent = currentTemperature + ' F';
    currentWindEl.textContent = currentWind + ' miles/hour';
    currentHumidityEl.textContent = currentHumidity + ' %';
    currentUVIndexEl.textContent = currentUVIndex;
    currentWeatherEl.textContent = currentWeatherDescription;
}




userFormEl.addEventListener('submit', formSubmitHandler);
init();