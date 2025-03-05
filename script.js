
    // API Configuration
    const API_KEY = '9f0cada5966ca8901247131e308ac92f'; //OpenWeatherMap API key
    const BASE_URL = 'https://api.openweathermap.org/data/2.5';
    
    // DOM Elements
    const searchInput = document.querySelector('input');
    const searchBtn = document.querySelectorAll('button')[0];
    const locationBtn = document.querySelectorAll('button')[1];
    const weatherDetails = document.querySelector('.weather-details');
    const dayForecast = document.querySelector('.day-forecast');
    let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];

    // Event Listeners
    searchBtn.addEventListener('click', () => handleSearch(searchInput.value));
    locationBtn.addEventListener('click', getCurrentLocation);
    searchInput.addEventListener('input', showRecentCities);

    // Main Functions
    async function handleSearch(city) {
        if (!city.trim()) {
            alert('Please enter a city name');
            return;
        }
        
        try {
            const weatherData = await getWeatherData(city);
            updateUI(weatherData);
            addToRecentCities(city);
        } catch (error) {
            showError(error.message || 'City not found. Please try again.');
        }
    }

    async function getCurrentLocation() {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await fetch(
                    `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
                );
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch location data');
                }
                const data = await response.json();
                updateUI(data);
                addToRecentCities(data.name);
            } catch (error) {
                showError(error.message || 'Failed to get location data');
            }
        }, () => {
            showError('Please enable location permissions');
        });
    }

    // UI Updates
    function updateUI(data) {
        // Current Weather
        const currentWeather = document.querySelector('.display-weather');
        currentWeather.innerHTML = `
            <div class="weather-details">
                <h2 class="mb-[5vmin]">${data.name} (${new Date().toISOString().split('T')[0]})</h2>
                <p class="mb-[3.5vmin]">Temperature: ${Math.round(data.main.temp)}°C</p>
                <p class="mb-[3.5vmin]">Wind: ${data.wind.speed} M/S</p>
                <p class="mb-[3.5vmin]">Humidity: ${data.main.humidity}%</p>
            </div>
            <div class="icon">
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" 
                     alt="${data.weather[0].description}" class="mt-[-4vmin]">
                <p class="text-center mt-[-4vmin]">${data.weather[0].main}</p>
            </div>
        `;

        // 5-Day Forecast
        fetch(`${BASE_URL}/forecast?q=${data.name}&units=metric&appid=${API_KEY}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch forecast data');
                return res.json();
            })
            .then(forecastData => {
                const dailyForecast = filterDailyForecast(forecastData.list);
                const forecastHTML = dailyForecast.map(day => `
                    <li class="cards bg-[#232121] p-[2vmin] rounded-[20px]">
                        <h3>${new Date(day.dt_txt).toISOString().split('T')[0]}</h3>
                        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" 
                             alt="${day.weather[0].description}">
                        <p class="mb-[2vmin]">Temp: ${Math.round(day.main.temp)}°C</p>
                        <p class="mb-[2vmin]">Wind: ${day.wind.speed} M/S</p>
                        <p class="mb-[2vmin]">Humidity: ${day.main.humidity}%</p>
                    </li>
                `).join('');
                document.querySelector('.weather-cards').innerHTML = forecastHTML;
            })
            .catch(error => {
                console.error('Forecast Error:', error.message);
                showError('Failed to fetch forecast data');
            });
    }

    // Helper Functions
    async function getWeatherData(city) {
        const response = await fetch(
            `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
        );
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch weather data');
        }
        return await response.json();
    }

    function filterDailyForecast(forecastList) {
        return forecastList.filter((_, index) => index % 8 === 0).slice(0, 5);
    }

    function addToRecentCities(city) {
        if (!recentCities.includes(city)) {
            recentCities = [city, ...recentCities].slice(0, 5);
            localStorage.setItem('recentCities', JSON.stringify(recentCities));
        }
    }

    function showRecentCities() {
        const existingDropdown = document.querySelector('.recent-cities-dropdown');
        if (existingDropdown) existingDropdown.remove();
    
        if (!searchInput.value.trim() || recentCities.length === 0) return;
    
        const dropdown = document.createElement('div');
        dropdown.className = 'recent-cities-dropdown';
    
        recentCities.forEach(city => {
            const item = document.createElement('div');
            item.className = 'p-[2vmin] text-white hover:bg-gray-600 cursor-pointer';
            item.textContent = city;
            item.addEventListener('click', () => {
                searchInput.value = city;
                dropdown.remove();
            });
            dropdown.appendChild(item);
        });
    
        // Add to search container instead of user-input
        const searchContainer = document.querySelector('.search-container');
        searchContainer.appendChild(dropdown);
    
        // Click outside handler
        document.addEventListener('click', function clickOutside(e) {
            if (!searchContainer.contains(e.target)) {
                dropdown.remove();
                document.removeEventListener('click', clickOutside);
            }
        });
    }
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4';
        errorDiv.textContent = message;
        weatherDetails.prepend(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }
