import { config } from '../config.js';

const newsStatus = document.getElementById('newsStatus');
const newsList = document.getElementById('newsList');
const newsWidget = document.getElementById('news');
const cacheKey = `${config.cachePrefix}-news`;
let isUpdating = false;

function setLoading(loading) {
  newsWidget.classList.toggle('loading', loading);
  if (loading) {
    newsStatus.textContent = 'Загрузка...';
  }
}

function setStatus(text, isError = false) {
  newsStatus.textContent = text;
  newsStatus.style.color = isError ? '#f87171' : 'var(--muted)';
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

function normalizeNewsData(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data.map((item) => ({
    title: item.title || item.name || 'Без заголовка',
    description: item.summary || item.newsSite || '',
    publishedAt: item.publishedAt || item.pubDate || new Date().toISOString(),
    source: item.newsSite || item.source?.name || 'Источник',
    url: item.url || item.link || '#',
  }));
  if (data.articles) {
    return data.articles.map((item) => ({
      title: item.title || 'Без заголовка',
      description: item.description || item.content || '',
      publishedAt: item.publishedAt || new Date().toISOString(),
      source: item.source?.name || 'NewsAPI',
      url: item.url || '#',
    }));
  }
  return [];
}

function renderNews(data, source = 'live') {
  const items = normalizeNewsData(data);
  newsList.innerHTML = items.length
    ? items
        .map(
          (item) => `
      <li class="news-item">
        <a href="${item.url}" target="_blank" rel="noreferrer noopener">
          <h3>${item.title}</h3>
        </a>
        <p class="news-info">${new Date(item.publishedAt).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })} · ${item.source}</p>
        <p class="news-description">${item.description || 'Краткое описание недоступно.'}</p>
      </li>`
        )
        .join('')
    : '<li class="news-item">Новостей не найдено.</li>';
  newsWidget.classList.add('updated');
  setStatus(source === 'cache' ? 'Показаны последние данные' : 'Данные обновлены');
}

function createTimeoutSignal(ms) {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

function buildNewsUrl() {
  if (config.newsApiKey) {
    const query = encodeURIComponent(config.newsQuery);
    return `https://newsapi.org/v2/top-headlines?q=${query}&language=ru&pageSize=8&apiKey=${config.newsApiKey}`;
  }
  return config.newsUrl;
}

export async function updateNewsWidget() {
  if (isUpdating) return;
  isUpdating = true;
  setLoading(true);
  newsWidget.classList.remove('updated');

  try {
    const response = await fetch(buildNewsUrl(), {
      signal: createTimeoutSignal(config.apiTimeoutMs),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    renderNews(data);
    saveCache(data);
  } catch (error) {
    console.error('Ошибка новостей:', error);
    const cache = loadCache();
    if (cache) {
      renderNews(cache, 'cache');
    } else {
      setStatus('Не удалось загрузить данные', true);
      newsList.innerHTML = '<li class="news-item">Новости временно недоступны.</li>';
    }
  } finally {
    setLoading(false);
    isUpdating = false;
  }
}
