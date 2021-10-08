let searchFormEl = document.querySelector('#searchForm');
let searchHistoryEl = document.querySelector('#searchHistory');
let cityInputEl = document.querySelector('#city');
let currentWeatherEl = document.querySelector('#currentWeather');
let currentTempEl = document.querySelector('#currentTemp');
let currentWindEl = document.querySelector('#currentWind');
let currentHumidityEl = document.querySelector('#currentHumidity');
let currentUVEl = document.querySelector('#currentUV');
let cityDisplayEl = document.querySelector('#city-name')
let fiveDayForecastEl = document.querySelector('#five-day-forecast');

// render search history 
//form submission handler
//search history button event handler
// store search history to localstorage
// fetches 
// render current weather display
// render daily weather display 

let cities = [];

const renderSearchHistory = () => {
    searchHistoryEl.innerHTML = '';
    let numberOfCities = cities.length;
    for (let i = 0; i < numberOfCities; i++) {
        let city = cities[i];

        let button = document.createElement("button");
        button.classList.add('btn', 'btn-primary' + [i]);
        button.setAttribute('id', 'searchHistoryButtons');
        button.textContent = city;
        searchHistoryEl.appendChild(button);
        button.addEventListener('click', callHistory);
    };
};

const callData = (event) => {
    event.preventDefault();

    let city = cityInputEl.value;
    if(city === ''){
        console.error("Please enter a city name")
        return;
    } else {
        fetchApi(city);
        cities.push(city);
        cityInputEl.value = '';
        storeCities();
        renderSearchHistory();
    }
    
};

const callHistory = (event) => {
    event.preventDefault();
    console.log('button clicked');
    city = event.target.textContent;
    console.log(city);
    fetchApi(city);
}

const storeCities = () => {
    localStorage.setItem("cities", JSON.stringify(cities));
}

const init = () => {
    console.log('Ignition...');

    let storedCities = JSON.parse(localStorage.getItem("cities"));

    if(storedCities !== null) {
        cities = storedCities;
    }

    renderSearchHistory();
}

// button click handler
// get city from the user input to create the api call

const fetchApi = (city) => {
    console.log('so fetch...');
    let apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=88cbdd38232fa62b5e7c1f5c2ad6b1df';
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            let name = data[0].name;
            let state = data[0].state;
            let lat = data[0].lat;
            let lon = data[0].lon;
            cityWeather(name, state, lat, lon);
        })
}

const cityWeather = (name, state, lat, lon) => {
    cityDisplayEl.textContent = name + ', ' + state;
    console.log('Ignite!');
    let apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly&units=imperial&appid=88cbdd38232fa62b5e7c1f5c2ad6b1df';
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            getCurrentWeather(data.current);
            getFiveDay(data.daily);
        })
}

const getCurrentWeather = (current) => {
    let currentTemperature = current.temp;
    let currentWind = current.wind_speed;
    let currentHumidity = current.humidity;
    let currentUVIndex = current.uvi;
    let currentWeatherDescription = current.weather[0].description;
    currentTempEl.textContent = 'Temp: ' + currentTemperature + ' F';
    currentWindEl.textContent = 'Wind: ' + currentWind + ' miles/hour';
    currentHumidityEl.textContent = 'Humidity: ' + currentHumidity + ' %';
    currentUVEl.textContent = 'UV Index: ' + currentUVIndex;
    currentWeatherEl.innerHTML = currentWeatherDescription;
}




searchFormEl.addEventListener('submit', callData);
init();