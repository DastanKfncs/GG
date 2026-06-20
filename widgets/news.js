import { config } from '../config.js';

const newsStatus = document.getElementById('newsStatus');
const newsList = document.getElementById('newsList');
const newsWidget = document.getElementById('news');
const cacheKey = `${config.cachePrefix}-news`;
let isUpdating = false;

// Embedded local news as fallback
const embeddedNews = [
  {
    title: 'Офисный дэшборд запущен',
    description: 'Встроенная информационная панель с погодой, курсом валют, новостями и анализом данных в реальном времени.',
    source: 'Dashboard',
    url: '#',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'Темная тема добавлена',
    description: 'Новая функция позволяет переключаться между светлой и тёмной темой с сохранением предпочтений пользователя.',
    source: 'Dashboard',
    url: '#',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'SVG иконки для погоды',
    description: 'Обновлены иконки погоды на масштабируемые SVG вместо эмодзи для лучшей визуализации.',
    source: 'Dashboard',
    url: '#',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'API интеграция расширена',
    description: 'Добавлена поддержка различных источников API для прогноза погоды и курса валют с автоматическим кэшированием.',
    source: 'Dashboard',
    url: '#',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'Мобильная адаптивность',
    description: 'Дэшборд полностью адаптирован для просмотра на различных устройствах: от смартфонов до больших экранов.',
    source: 'Dashboard',
    url: '#',
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'Кэширование в localStorage',
    description: 'Данные сохраняются локально, что позволяет работать с информацией даже при потере интернета.',
    source: 'Dashboard',
    url: '#',
    publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

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

function renderNews(items, source = 'live') {
  // Expects already-normalized array of news items
  if (!Array.isArray(items)) items = [];
  console.log('renderNews:', { itemsCount: items.length, source, firstItem: items[0]?.title });
  const displayItems = items.slice(0, 7);
  newsList.innerHTML = displayItems.length
    ? displayItems
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
  setStatus(source === 'cache' ? 'Показаны последние данные' : source === 'embedded' ? 'Показаны встроенные новости' : 'Данные обновлены');
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
    console.log('updateNewsWidget: Starting fetch from', buildNewsUrl().slice(0, 50));
    const response = await fetch(buildNewsUrl(), {
      signal: createTimeoutSignal(config.apiTimeoutMs),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('updateNewsWidget: API response received', { dataType: typeof data, isArray: Array.isArray(data), count: Array.isArray(data) ? data.length : 0 });
    const apiItems = normalizeNewsData(data);
    console.log('updateNewsWidget: Normalized API items:', apiItems.length);
    // Mix embedded news with API news (embedded first, then API)
    const combined = [...embeddedNews, ...apiItems].slice(0, 7);
    console.log('updateNewsWidget: Combined items:', combined.length);
    renderNews(combined, 'live');
    saveCache(data);
  } catch (error) {
    console.error('Ошибка новостей:', error);
    const cache = loadCache();
    if (cache) {
      const cacheItems = normalizeNewsData(cache);
      const combined = [...embeddedNews, ...cacheItems].slice(0, 7);
      renderNews(combined, 'cache');
    } else {
      // Use only embedded news as fallback
      renderNews(embeddedNews, 'embedded');
    }
  } finally {
    setLoading(false);
    isUpdating = false;
  }
}
