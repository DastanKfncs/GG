import { config } from './config.js';
import { initClock } from './widgets/clock.js';
import { updateWeatherWidget } from './widgets/weather.js';
import { updateCurrencyWidget } from './widgets/currency.js';
import { updateNewsWidget } from './widgets/news.js';
import { initTemperatureChart } from './chart-setup.js';

const themeToggle = document.getElementById('themeToggle');
const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
const tabs = Array.from(document.querySelectorAll('.widget--tab'));

function setTheme(theme) {
  document.body.classList.toggle('theme-dark', theme === 'dark');
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '☀️  Светлая' : '🌙  Тёмная';
    themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }
  localStorage.setItem(config.themeStorageKey, theme);
}

function loadTheme() {
  const saved = localStorage.getItem(config.themeStorageKey);
  if (saved === 'dark' || saved === 'light') {
    setTheme(saved);
    return;
  }
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(prefersDark ? 'dark' : 'light');
}

function initTheme() {
  loadTheme();
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
      setTheme(nextTheme);
    });
    themeToggle.setAttribute('role', 'switch');
  }
}

function initFullscreen() {
  const fullscreenToggle = document.getElementById('fullscreenToggle');
  if (!fullscreenToggle) return;

  function updateFullscreenLabel() {
    const isFull = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    fullscreenToggle.textContent = isFull ? 'Выйти из ТВ' : 'TV режим';
  }

  fullscreenToggle.addEventListener('click', async () => {
    const elem = document.documentElement;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (elem.requestFullscreen) {
      await elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      await elem.webkitRequestFullscreen();
    }
  });

  document.addEventListener('fullscreenchange', updateFullscreenLabel);
  document.addEventListener('webkitfullscreenchange', updateFullscreenLabel);
  document.addEventListener('mozfullscreenchange', updateFullscreenLabel);
  document.addEventListener('MSFullscreenChange', updateFullscreenLabel);
  updateFullscreenLabel();
}

function initTabs() {
  if (!tabButtons.length) return;
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.target;
      tabButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
      tabs.forEach((widget) => widget.classList.toggle('active', widget.dataset.tab === target));
    });
  });
}

async function refreshAllWidgets() {
  await Promise.all([
    updateWeatherWidget(),
    updateCurrencyWidget(),
    updateNewsWidget(),
  ]);
}

window.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  initTabs();
  initFullscreen();
  initClock();
  initTemperatureChart();

  await refreshAllWidgets();
  setInterval(refreshAllWidgets, config.refreshIntervalMs);
});
