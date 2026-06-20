import { config } from '../config.js';

const currencyStatus = document.getElementById('currencyStatus');
const currencySpinner = document.getElementById('currencySpinner');
const currencyRates = document.getElementById('currencyRates');
const currencyWidget = document.getElementById('currency');
const cacheKey = `${config.cachePrefix}-currency`;
let isUpdating = false;

function setLoading(loading) {
  currencyWidget.classList.toggle('loading', loading);
  if (loading) {
    currencyStatus.textContent = 'Загрузка...';
  }
}

function setStatus(text, isError = false) {
  currencyStatus.textContent = text;
  currencyStatus.style.color = isError ? '#f87171' : 'var(--muted)';
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

function renderRates(data, source = 'live') {
  currencyRates.innerHTML = config.currencySymbols
    .map((symbol) => {
      const value = data.rates[symbol];
      return `<li><span>${symbol}</span><strong>${value.toFixed(4)}</strong></li>`;
    })
    .join('');
  currencyWidget.classList.add('updated');
  setStatus(source === 'cache' ? 'Показаны последние данные' : 'Данные обновлены');
}

function createTimeoutSignal(ms) {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

export async function updateCurrencyWidget() {
  if (isUpdating) return;
  isUpdating = true;
  setLoading(true);
  currencyWidget.classList.remove('updated');

  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${config.currencyBase}`, {
      signal: createTimeoutSignal(config.apiTimeoutMs),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (data.result !== 'success') throw new Error(data['error-type'] || 'API error');
    renderRates(data);
    saveCache(data);
  } catch (error) {
    console.error('Ошибка валют:', error);
    const cache = loadCache();
    if (cache) {
      renderRates(cache, 'cache');
    } else {
      setStatus('Не удалось загрузить данные', true);
      currencyRates.innerHTML = '<li>Сервис недоступен</li>';
    }
  } finally {
    setLoading(false);
    isUpdating = false;
  }
}
