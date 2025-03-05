Weather Forecast Application
A simple weather forecast application that allows users to search for weather information by city name or use their current location. The application displays current weather conditions and a 5-day forecast.

Features
Search by City: Enter a city name to get weather details.

Current Location: Use your device's location to fetch weather data.

Recent Searches: Dropdown menu displays recently searched cities.

Responsive Design: Works on all screen sizes (desktop, tablet, mobile).

5-Day Forecast: Displays weather forecasts for the next 5 days.

Technologies Used
Frontend:

HTML, CSS, JavaScript

Tailwind CSS for styling

Boxicons for icons

Google Fonts for custom fonts

API:

OpenWeatherMap API for weather data


Setup Instructions
1. Clone the Repository

git clone https://github.com/your-username/weather-forecast-app.git
cd weather-forecast-app

2. Get an API Key
Sign up for a free account at OpenWeatherMap.

Get your API key from the API keys section.

Replace the placeholder API key in the script.js file:

const API_KEY = 'your-api-key-here'; // Replace with your OpenWeatherMap API key

3. Run the Application
Open the index.html file in your browser.

Alternatively, use a local server (e.g., VS Code Live Server or http-server).


Usage
Search by City:

Enter a city name in the search bar (e.g., "London").

Click the Search button to fetch weather data.

Use Current Location:

Click the Use Current Location button.

Allow the browser to access your location.

Recent Searches:

As you search for cities, they will appear in a dropdown menu below the search bar.

Click a recent city to populate the search bar.

View Weather Details:

Current weather conditions (temperature, wind, humidity) are displayed.

A 5-day forecast is shown below the current weather.


weather-forecast-app/
├── index.html          # Main HTML file
├── script.js           # JavaScript for functionality
├── README.md           # Project documentation