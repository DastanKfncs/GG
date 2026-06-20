export function initClock() {
  const timeEl = document.getElementById('clockTime');
  const dateEl = document.getElementById('clockDate');
  const statusEl = document.getElementById('clockStatus');

  function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('ru-RU', { hour12: false });
    const date = now.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
    timeEl.textContent = time;
    dateEl.textContent = date;
    statusEl.textContent = navigator.onLine ? 'Онлайн' : 'Офлайн';
  }

  updateClock();
  setInterval(updateClock, 1000);
  window.addEventListener('online', updateClock);
  window.addEventListener('offline', updateClock);
}
