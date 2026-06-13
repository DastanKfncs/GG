/**
 * SVG icon utilities for dashboard widgets
 */

export const icons = {
  sun: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>`,

  moon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>`,

  cloud: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 17H2v-2a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v2z"></path>
    <path d="M22 17v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-2"></path>
    <line x1="12" y1="11" x2="12" y2="17"></line>
  </svg>`,

  cloudRain: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
    <line x1="16" y1="13" x2="16" y2="17"></line>
    <line x1="8" y1="13" x2="8" y2="17"></line>
    <line x1="12" y1="15" x2="12" y2="19"></line>
  </svg>`,

  cloudSnow: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path>
    <line x1="8" y1="19" x2="8" y2="21"></line>
    <line x1="8" y1="13" x2="8" y2="15"></line>
    <line x1="16" y1="19" x2="16" y2="21"></line>
    <line x1="16" y1="13" x2="16" y2="15"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="12" y1="15" x2="12" y2="17"></line>
  </svg>`,

  cloudLightning: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M19 16A5 5 0 0 0 14 3H7a5 5 0 0 0 0 10H5"></path>
    <polyline points="13 11 9 17 15 17 11 23"></polyline>
  </svg>`,

  cloudFog: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 14.899a7 7 0 1 1 14.072-3.21A4.5 4.5 0 0 1 16.9 20H7.128A4 4 0 0 1 4 14.9"></path>
    <line x1="3.5" y1="10" x2="20.5" y2="10"></line>
  </svg>`,

  cloudMist: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 14.899a7 7 0 1 1 14.072-3.21A4.5 4.5 0 0 1 16.9 20H7.128A4 4 0 0 1 4 14.9"></path>
    <line x1="4" y1="10" x2="20" y2="10"></line>
  </svg>`,

  cloudDrizzle: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 19v2m4-2v2m4-2v2M20.38 20.78a5 5 0 0 0-9.55-1.5A4.97 4.97 0 0 0 4 17a6 6 0 0 0 7.09 5.93"></path>
  </svg>`,
};

/**
 * Get weather icon based on condition text
 */
export function getWeatherIconSVG(condition) {
  const text = condition.toLowerCase();
  if (text.includes('sun') || text.includes('ясно') || text.includes('clear')) return icons.sun;
  if (text.includes('cloud') || text.includes('облачно') || text.includes('cloudy')) return icons.cloud;
  if (text.includes('rain') || text.includes('дождь') || text.includes('shower')) return icons.cloudRain;
  if (text.includes('snow') || text.includes('снег')) return icons.cloudSnow;
  if (text.includes('storm') || text.includes('гроза') || text.includes('thunder')) return icons.cloudLightning;
  if (text.includes('fog') || text.includes('туман') || text.includes('mist')) return icons.cloudFog;
  if (text.includes('drizzle') || text.includes('морось')) return icons.cloudDrizzle;
  return icons.sun;
}

/**
 * Create SVG element from string
 */
export function createSVGElement(svgString) {
  const temp = document.createElement('div');
  temp.innerHTML = svgString;
  return temp.firstElementChild;
}
