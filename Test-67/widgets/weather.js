import { config } from '../config.js';
import { updateTemperatureChart } from '../chart-setup.js';

const weatherStatus = document.getElementById('weatherStatus');
const weatherSpinner = document.getElementById('weatherSpinner');
const weatherContent = document.getElementById('weatherContent');
const weatherLocation = document.getElementById('weatherLocation');
const weatherIcon = document.getElementById('weatherIcon');
const weatherTemp = document.getElementById('weatherTemp');
const weatherCondition = document.getElementById('weatherCondition');
const weatherFeels = document.getElementById('weatherFeels');
const weatherHumidity = document.getElementById('weatherHumidity');
const weatherWind = document.getElementById('weatherWind');
const weatherForecast = document.getElementById('weatherForecast');
const weatherWidget = document.getElementById('weather');
const cacheKey = `${config.cachePrefix}-weather`;
let isUpdating = false;

function setLoading(loading) {
  weatherWidget.classList.toggle('loading', loading);
  if (loading) {
    weatherStatus.textContent = 'Загрузка...';
  }
}

function setStatus(text, isError = false) {
  weatherStatus.textContent = text;
  weatherStatus.style.color = isError ? '#f87171' : 'var(--muted)';
}

function saveCache(data) {
  localStorage.setItem(cacheKey, JSON.stringify({ data, updated: Date.now() }));
}

function loadCache() {
  const raw = localStorage.getItem(cacheKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw).data;
  } catch {
    return null;
  }
}

function getWeatherIcon(condition) {
  const text = condition.toLowerCase();
  if (text.includes('sun') || text.includes('ясно') || text.includes('clear')) return '☀️';
  if (text.includes('cloud') || text.includes('облачно') || text.includes('cloudy')) return '☁️';
  if (text.includes('rain') || text.includes('дождь') || text.includes('shower')) return '🌧️';
  if (text.includes('snow') || text.includes('снег')) return '❄️';
  if (text.includes('storm') || text.includes('гроза')) return '⛈️';
  if (text.includes('fog') || text.includes('туман')) return '🌫️';
  return '🌤️';
}

function formatCondition(current) {
  return `${current.FeelsLikeC}°C · ${current.weatherDesc[0].value}`;
}

function renderWeather(data, source = 'live') {
  const current = data.current_condition[0];
  const forecast = data.weather.slice(0, 5);
  weatherLocation.textContent = `${config.weatherCity}, KG`;
  weatherIcon.textContent = getWeatherIcon(current.weatherDesc[0].value);
  weatherTemp.textContent = `${current.temp_C}°C`;
  weatherCondition.textContent = formatCondition(current);
  weatherFeels.textContent = `${current.FeelsLikeC}°`;
  weatherHumidity.textContent = `${current.humidity}%`;
  weatherWind.textContent = `${current.windspeedKmph} км/ч`;
  weatherForecast.innerHTML = forecast
    .slice(0, 3)
    .map((item) => {
      const date = new Date(item.date);
      const dayName = date.toLocaleDateString('ru-RU', { weekday: 'short' });
      const desc = item.hourly?.[4]?.weatherDesc?.[0]?.value || item.hourly?.[0]?.weatherDesc?.[0]?.value || '';
      return `
        <div class="forecast-card">
          <div class="forecast-day">${dayName}</div>
          <div class="forecast-temp">${item.maxtempC}° / ${item.mintempC}°</div>
          <div class="forecast-desc">${desc}</div>
        </div>
      `;
    })
    .join('');
  const labels = forecast.map((item) => item.date.slice(5).replace('-', '.'));
  const temps = forecast.map((item) => {
    const n = Number(item.avgtempC);
    return Number.isFinite(n) ? n : null;
  });
  // If all values are null, skip updating chart
  if (temps.every((v) => v === null)) {
    console.warn('Weather: no numeric temperature values for forecast, skipping chart update', forecast);
  } else {
    updateTemperatureChart(labels, temps);
  }
  weatherWidget.classList.add('updated');
  setStatus(source === 'cache' ? 'Показаны последние данные' : 'Данные обновлены');
}

function createTimeoutSignal(ms) {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

export async function updateWeatherWidget() {
  if (isUpdating) return;
  isUpdating = true;
  setLoading(true);
  weatherWidget.classList.remove('updated');

  try {
    const response = await fetch(`https://wttr.in/${encodeURIComponent(config.weatherCity)}?format=j1`, {
      signal: createTimeoutSignal(config.apiTimeoutMs),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    renderWeather(data);
    saveCache(data);
  } catch (error) {
    console.error('Ошибка погоды:', error);
    const cache = loadCache();
    if (cache) {
      renderWeather(cache, 'cache');
    } else {
      setStatus('Не удалось загрузить данные', true);
      weatherContent.innerHTML = '<p>Погодные данные временно недоступны.</p>';
    }
  } finally {
    setLoading(false);
    isUpdating = false;
  }
}
