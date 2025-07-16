import { useState, useEffect } from 'react'
import './App.css'

const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [currentCity, setCurrentCity] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [prevWeather, setPrevWeather] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentCity) return;

    try {
      const response = await fetch(`https://api.weatherstack.com/current?access_key=${ACCESS_KEY}&query=${encodeURIComponent(currentCity)}`);
      const data = await response.json();

      if (data.error) {
        alert(`Error: ${data.error.info}`);
        return;
      }

      const tempC = data.current.temperature;
      const tempF = (tempC * 9) / 5 + 32;

      const weatherInfo = {
        city: data.location.name,
        country: data.location.country,
        description: data.current.weather_descriptions[0],
        humidity: data.current.humidity,
        tempC,
        tempF,
        date: new Date().toLocaleString(),
      };

      setCurrentWeather(weatherInfo);
      setPrevWeather((prev) => [weatherInfo, ...prev]);
      setCurrentCity(""); // Clear input
    } catch (error) {
      console.error("Error fetching weather:", error);
      alert("Failed to fetch weather data.");
    }
  };
  const getTempEmoji = (tempF) => {
    if (tempF < 36) {
      return "🧊";
    } else if (tempF < 70) {
      return "🌬️";
    } else if (tempF > 80) {
      return "🔥";
    } else {
      return ""; 
    }
  };
  const filteredWeather = prevWeather.filter((weather) =>
  weather.city.toLowerCase().includes(searchTerm.toLowerCase())
);
  
  return (
    <div className='whole-page'>
        <h1>Weather App🌤️</h1>
        <br></br>
        <h2>Enter City:</h2>
        <form className="form-container" onSubmit={handleSubmit}>
          <input type="text" placeholder="Enter city name" value={currentCity} onChange={(e => setCurrentCity(e.target.value))}/>
          <button type="submit">Get Weather!⚡</button>
        </form>
        {currentWeather && (
        <div className="current-weather">
          <h3>
            Current Weather in {currentWeather.city}, {currentWeather.country}🌤️
          </h3>
          <p>
            <strong>Description:</strong> {currentWeather.description}
          </p>
          <p>
            <strong>Temperature:</strong> {currentWeather.tempF.toFixed(0)} °F{getTempEmoji(currentWeather.tempF)} ({currentWeather.tempC} °C)
          </p>
          <p>
            <strong>Humidity:</strong> {currentWeather.humidity}%
          </p>
          <p>
            <em>{currentWeather.date}</em>
          </p>
        </div>
      )}

<hr />

<div className="previous-weather">
<input
  type="text"
  placeholder="Search previous cities..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  style={{ marginBottom: "1rem", padding: "0.5rem" }}
/>
  <h3>Previous Searches:</h3>
  {filteredWeather.length === 0 ? (
  <p>No matching results.</p>
) : (
  <ul>
    {filteredWeather.map((weather, index) => (
      <li key={index}>
        <strong>
          {weather.city}, {weather.country}
        </strong>{" "}
        – {weather.tempF.toFixed(1)} °F, {weather.humidity}% humidity,{" "}
        {weather.description} <em>({weather.date})</em>
      </li>
    ))}
  </ul>
  )}
</div>


    </div>



  )
}

export default App
