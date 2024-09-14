const apiKey = '511708b21d06dba1fddf7c1796eb3bf8';
let units = 'metric';

document.getElementById('search-btn').addEventListener('click', () => {
    const location = document.getElementById('location-input').value;
    getWeatherData(location);
});

document.getElementById('celsius-btn').addEventListener('click', () => {
    units = 'metric';
    updateWeather();
});

document.getElementById('fahrenheit-btn').addEventListener('click', () => {
    units = 'imperial';
    updateWeather();
});

function getWeatherData(location) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=${units}`)
        .then(response => response.json())
        .then(data => {
            updateCurrentWeather(data);
            getForecastData(location);
        })
        .catch(error => console.error('Error:', error));
}

function updateCurrentWeather(data) {
    document.getElementById('location-name').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('current-temp').textContent = `${Math.round(data.main.temp)}°`;
    document.getElementById('weather-description').textContent = data.weather[0].description;
    document.getElementById('humidity').textContent = data.main.humidity;
    document.getElementById('wind-speed').textContent = data.wind.speed;
    document.getElementById('sunrise-time').textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    document.getElementById('sunset-time').textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    document.getElementById('weather-icon').innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather-icon">`;
    suggestOutfit(data.weather[0].main, data.main.temp);
}

function getForecastData(location) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=${units}`)
        .then(response => response.json())
        .then(data => {
            updateForecast(data);
        })
        .catch(error => console.error('Error:', error));
}

function updateForecast(data) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';

    for (let i = 1; i < 5; i++) {
        const dayData = data.list[i * 8]; // 8 intervals per day
        const dayElement = document.createElement('div');
        dayElement.className = 'forecast-day';
        dayElement.innerHTML = `
            <div>${new Date(dayData.dt * 1000).toLocaleDateString()}</div>
            <div><img src="https://openweathermap.org/img/wn/${dayData.weather[0].icon}.png" alt="weather-icon"></div>
            <div>${Math.round(dayData.main.temp)}°</div>
        `;
        forecastContainer.appendChild(dayElement);
    }
}

function suggestOutfit(weather, temp) {
    let recommendation = '';

    if (temp < 10) {
        recommendation = 'Wear a heavy coat and stay warm!';
    } else if (temp < 20) {
        recommendation = 'A light jacket should be enough.';
    } else if (temp < 30) {
        recommendation = 'T-shirt and jeans should be comfortable.';
    } else {
        recommendation = 'It’s hot! Shorts and a tank top are recommended.';
    }

    if (weather === 'Rain') {
        recommendation += ' Don’t forget an umbrella!';
    } else if (weather === 'Snow') {
        recommendation += ' Wear boots and a scarf!';
    }

    document.getElementById('outfit-recommendation').textContent = recommendation;
}

function updateWeather() {
    const location = document.getElementById('location-name').textContent.split(',')[0];
    if (location) {
        getWeatherData(location);
    }
}