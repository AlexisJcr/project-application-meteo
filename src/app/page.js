'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';

import '../app/globals.css';

//===== ICONS METEO =====//
import icon_soleil from '../assets/weather/soleil.png';
import icon_peu_soleil from '../assets/weather/nuageux.png';
import icon_nuageux from '../assets/weather/nuages.png';
import icon_pluie from '../assets/weather/pluie.png';
import icon_brouillard from '../assets/weather/brouillard.png';
import icon_neige from '../assets/weather/neige.png';
import icon_pluie_fine from '../assets/weather/pluie_fine.png';
import icon_orage from '../assets/weather/orage.png';
import icon_nuit from '../assets/weather/nuit.png';
import icon_nuit_nuageuse from '../assets/weather/nuit_nuageuse.png';
import icon_barometre from '../assets/weather/barometer.png';
import icon_sunrise from '../assets/weather/sunrise.png';
import icon_vent from '../assets/weather/wind.png';

export default function WeatherPage() {
  const [selectedCity, setSelectedCity] = useState('Brest, France');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const favoriteCities = ['Brest France', 'Rennes', 'Paris', 'Berlin', 'Rome', 'New York', 'Hanoi', 'Tokyo', 'Séoul'];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const filterFutureHours = (hourData) => {
    const localTime = new Date(weatherData.location.localtime);
    const currentHour = localTime.getHours();
    const forecastHour = new Date(hourData.time).getHours();
    return forecastHour > currentHour;
  };

  const getLimitedHourlyForecast = () => {
    if (!weatherData) return [];
    const todayForecast = weatherData.forecast.forecastday[0].hour.filter(filterFutureHours);
    let combinedForecast = todayForecast;

    if (combinedForecast.length < 20 && weatherData.forecast.forecastday[1]) {
      const nextDayForecast = weatherData.forecast.forecastday[1].hour;
      combinedForecast = [...combinedForecast, ...nextDayForecast];
    }

    return combinedForecast.slice(0, 14);
  };

  const fetchWeatherData = async (city) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/weatherapi?city=${encodeURIComponent(city)}`);
      setWeatherData(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données météo', error);
    }
    setLoading(false);
};

  //===== DICTIONNAIRE DES ICONS =====//
  const weatherIcons = {
    'neige': icon_neige,
    'brouillard': icon_brouillard,
    'pluie': icon_pluie,
    'pluie légère': icon_pluie,
    'pluie modérée': icon_pluie,
    'brume': icon_nuageux,
    'light rain shower': icon_pluie_fine,
    'light rain': icon_pluie_fine,
    'light drizzle': icon_pluie_fine,
    'orage': icon_orage,
    'thundery outbreaks in nearby': icon_orage,
    'nuit': icon_nuit,
    'nuit nuageuse': icon_nuit_nuageuse,
    'soleil': icon_soleil,
    'peu de soleil': icon_peu_soleil,
    'nuageux': icon_nuageux,
    'baromètre': icon_barometre,
    'vent': icon_vent,
    'sunrise': icon_sunrise
  };

  const getWeatherIcon = (condition) => {
    const conditionKey = condition.toLowerCase();
    if (conditionKey.includes('nuageux')) return icon_nuageux;
    if (conditionKey.includes('couvert')) return icon_nuageux;

    if (conditionKey.includes('averse')) return icon_pluie;
    if (conditionKey.includes('éparse')) return icon_pluie_fine;
    if (conditionKey.includes('bruine')) return icon_pluie_fine;

    if (conditionKey.includes('soleil')) return icon_soleil;
    if (conditionKey.includes('clair')) return icon_nuit;

    return weatherIcons[conditionKey];
  };

  useEffect(() => {
    fetchWeatherData(selectedCity);
  }, [selectedCity]);

  const handleCityClick = (city) => {
    setSelectedCity(city);
  };

  if (!weatherData) return <div>Aucune donnée disponible.</div>;

  const currentWeather = weatherData.current;

  return (
      <div className="meteo-interface">
        <div className="meteo-interface-group">

          <div className="meteo-interface-group-top">
            <ul>
              {favoriteCities.map((city, index) => (
                <li
                  key={index}
                  onClick={() => handleCityClick(city)}
                  style={{ backgroundColor: selectedCity === city ? '#BD3513' : 'transparent', cursor: 'pointer' }}
                >
                  {city}
                </li>
              ))}
            </ul>
          </div>

          <div className="meteo-interface-group-infos">
            <div className="meteo-infos-box1">
              <h1>{formatDate(weatherData.location.localtime)}</h1>
              <h2>{formatTime(weatherData.location.localtime)}</h2>

            </div>
            <div className="meteo-infos-box2">
              <h1>{weatherData.location.name}, {weatherData.location.country}</h1>
              <h2>{Math.round(currentWeather.temp_c)}°C</h2>
              <h3>{currentWeather.condition.text}</h3>

            </div>
            <div className="meteo-infos-box3">
              <div className="meteo-infos-box3-img">
                <Image src={getWeatherIcon(currentWeather.condition.text)} alt={currentWeather.condition.text} width={128} height={128}/>
              </div>
            </div>
          </div>

          <div className="meteo-interface-group-hours">
            <h2>Prévisions horaires</h2>
            <div className='meteo-hours-grid'>
              {getLimitedHourlyForecast().map((hourData, index) => (
                <div key={index} style={{ margin: '0 10px', textAlign: 'center' }}>
                  <ul>
                    <li><h4>{new Date(hourData.time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</h4>
                      <Image src={getWeatherIcon(hourData.condition.text)} alt={hourData.condition.text} width={55} />
                      <h3>{Math.round(hourData.temp_c)}°C</h3>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="meteo-interface-group-conditions">
            <h2>Informations</h2>
            <div className="meteo-interface-conditions-container">
              <div className='meteo-conditions-box1'>
                <ul>
                  <li><Image src={icon_sunrise} alt="Sunrise" width={50} height={50} /></li>
                  <li>
                    {weatherData.forecast.forecastday[0].astro.sunrise}
                  </li>
                  <li>
                    {weatherData.forecast.forecastday[0].astro.sunset}
                  </li>
                </ul>

              </div>
              <div className='meteo-conditions-box2'>
                <ul>
                  <li><Image src={icon_vent} alt="Vent" width={50} height={50}/></li>
                  <li>{weatherData.current.wind_kph} km/h</li>
                </ul>
              </div>
              <div className='meteo-conditions-box3'>
                <ul>
                  <li><Image src={icon_barometre} alt="Baromètre" width={50} height={50}/></li>
                  <li>Pression : {weatherData.current.pressure_mb} hPa</li>
                </ul>
              </div>
              <div className='meteo-conditions-box4'>
                <ul>
                  <li><Image src={icon_soleil} alt="UV" width={50} height={50}/></li>
                  <li>UV : {weatherData.current.uv}</li>
                </ul>
              </div>
            </div>
          </div>

        </div>

        <div className="meteo-interface-right">
          <h2>Prévisions Hebdomadaires</h2>
          <div className="meteo-interface-hebdo">
            <div className="meteo-interface-hebdo-container">
              <ul>
                {weatherData.forecast.forecastday.map((dayData, index) => (
                  <li key={index} style={{ marginBottom: '15px' }}>
                    <h4>{new Date(dayData.date).toLocaleDateString('fr-FR', { weekday: 'short', month: 'short', day: 'numeric' })}</h4>
                    <Image src={getWeatherIcon(dayData.day.condition.text)} alt={dayData.day.condition.text} width={50} />
                    <h3>
                      {Math.round(dayData.day.mintemp_c)}°C | {Math.round(dayData.day.maxtemp_c)}°C
                    </h3>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

    </div>
  );
}
