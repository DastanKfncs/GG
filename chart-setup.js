export let temperatureChart = null;

export function initTemperatureChart() {
  const canvas = document.getElementById('temperatureChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const css = getComputedStyle(document.documentElement);
  const muted = css.getPropertyValue('--muted').trim() || '#94a3b8';
  const text = css.getPropertyValue('--text').trim() || '#111827';
  const accent = css.getPropertyValue('--accent').trim() || '#60a5fa';
  const accentBg = css.getPropertyValue('--accent-soft').trim() || 'rgba(96,165,250,0.2)';
  temperatureChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Температура °C',
        data: [],
        borderColor: accent,
        backgroundColor: accentBg,
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: accent,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: { color: muted },
          grid: { color: 'rgba(148, 163, 184, 0.08)' },
        },
        y: {
          ticks: { color: muted },
          grid: { color: 'rgba(148, 163, 184, 0.08)' },
        },
      },
      plugins: {
        legend: {
          labels: { color: text },
        },
        tooltip: {
          callbacks: {
            label(context) {
              return `${context.parsed.y} °C`;
            },
          },
        },
      },
    },
  });
}

export function updateTemperatureChart(dates, values) {
  if (!temperatureChart) return;
  temperatureChart.data.labels = dates;
  temperatureChart.data.datasets[0].data = values;
  temperatureChart.update();
}
