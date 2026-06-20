import infoService from "../services/getinfo";
import { useState, useEffect } from "react";

const WeatherInfo = ({ weather }) => {
  if (weather.main) {
    const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
    return (
      <div>
        <p>Temperature {weather.main.temp} Celsius</p>
        <img src={iconUrl}></img>
        <p>Wind {weather.wind.speed} m/s</p>
      </div>
    );
  }
  return <p>Loading...</p>;
};

const CountryInfo = ({ country }) => {
  const [weather, setWeather] = useState({});

  const listStyle = {
    margin: 0,
    padding: 0,
  };

  const flagStyle = {
    margin: 0,
    padding: 0,
    fontSize: 200,
  };

  const lat = country.capitalInfo.latlng[0];
  const lon = country.capitalInfo.latlng[1];

  useEffect(() => {
    infoService.getWeather(lat, lon).then((w) => {
      setWeather(w);
    });
  }, [lat, lon]);

  const languages = Object.values(country.languages);

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p style={listStyle}>Capital: {country.capital}</p>
      <p style={listStyle}>Area: {country.area}</p>
      <h2>Languages</h2>
      <ul>
        {languages.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
      <p style={flagStyle}>{country.flag}</p>
      <h1>Weather in {country.capital}</h1>
      <WeatherInfo weather={weather} />
    </div>
  );
};

export default CountryInfo;
