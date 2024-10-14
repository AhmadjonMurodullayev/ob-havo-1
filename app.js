const id = '9505fd1df737e20152fbd78cdb289b6a'; 
const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${id}`;
const cityElement = document.querySelector('.name');
const form = document.querySelector("form");
const temperatureElement = document.querySelector('.temperature');
const descriptionElement = document.querySelector('.description');
const searchInput = document.getElementById('name');
const cloudsElement = document.getElementById('clouds');
const humidityElement = document.getElementById('humidity');
const pressureElement = document.getElementById('pressure');
const mainElement = document.querySelector('main');
const forecastSection = document.querySelector('.forecast-grid');

form.addEventListener("submit", (e) => {
    e.preventDefault();  
    if (searchInput.value !== '') {  
        fetchWeatherData();
    }
});

const fetchWeatherData = () => {
    fetch(`${url}&q=${searchInput.value}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            updateWeatherUI(data);
            return fetchForecastData();
        })
        .then(forecastData => {
            console.log(forecastData);
            displayForecast(forecastData);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            mainElement.classList.add('error'); 
            setTimeout(() => {
                mainElement.classList.remove('error');  
            }, 1000);
        })
        .finally(() => {
            searchInput.value = ''; 
        });
};

const updateWeatherUI = (data) => {
    cityElement.querySelector('figcaption').innerText = data.name; 
    cityElement.querySelector('img').src = `https://flagsapi.com/${data.sys.country}/shiny/32.png`;
    temperatureElement.querySelector('img').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`; 
    temperatureElement.querySelector('span').innerText = `${data.main.temp}°C`;
    descriptionElement.innerText = data.weather[0].description;  

    cloudsElement.innerText = `${data.clouds.all}%`;  
    humidityElement.innerText = `${data.main.humidity}%`; 
    pressureElement.innerText = `${data.main.pressure} hPa`;  
};

const fetchForecastData = () => {
    return fetch(`https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=${id}&q=${searchInput.value}`)
        .then(response => response.json());
};

const displayForecast = (forecastData) => {
    forecastSection.innerHTML = '';
    const dailyData = [];
    
    forecastData.list.forEach(item => {
        const date = new Date(item.dt_txt);
        if (date.getHours() === 12) { 
            dailyData.push(item);
        }
    });

    dailyData.forEach(day => {
        const forecastEl = document.createElement('div');
        forecastEl.classList.add('forecast-day');
        const date = new Date(day.dt_txt).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' });
        forecastEl.innerHTML = `
            <h3>${date}</h3>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather icon">
            <p>${day.weather[0].description}</p>
            <p><strong>${day.main.temp}°C</strong></p>
        `;
        forecastSection.appendChild(forecastEl);
    });
};

const initApp = () => {
    searchInput.value = 'Tashkent';  
    fetchWeatherData(); 
};

initApp();
