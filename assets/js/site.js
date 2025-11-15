// site.js — front-end behavior for the homepage
// Uses DOMContentLoaded to ensure elements exist before accessing them
// Note: browsers can't set a custom User-Agent header. If the API requires it, proxy the request server-side.
(function(){
  // Use the KSEA station latest observation endpoint (returns a single observation).
  const WEATHER_URL = 'https://api.weather.gov/stations/KSEA/observations/latest';

  // Hand-drawn doodle-style weather icons (SVG paths)
  const weatherIcons = {
    sun: `<svg class="weather-icon-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="18" class="sun-fill"/>
      <line x1="50" y1="10" x2="50" y2="25"/>
      <line x1="50" y1="75" x2="50" y2="90"/>
      <line x1="10" y1="50" x2="25" y2="50"/>
      <line x1="75" y1="50" x2="90" y2="50"/>
      <line x1="21" y1="21" x2="32" y2="32"/>
      <line x1="68" y1="68" x2="79" y2="79"/>
      <line x1="79" y1="21" x2="68" y2="32"/>
      <line x1="32" y1="68" x2="21" y2="79"/>
    </svg>`,
    
    cloudy: `<svg class="weather-icon-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M25,60 Q25,50 35,50 Q35,40 45,40 Q50,35 55,40 Q65,40 65,50 Q75,50 75,60 Q75,70 65,70 L35,70 Q25,70 25,60 Z" class="icon-fill"/>
      <path d="M25,60 Q25,50 35,50 Q35,40 45,40 Q50,35 55,40 Q65,40 65,50 Q75,50 75,60 Q75,70 65,70 L35,70 Q25,70 25,60 Z"/>
    </svg>`,
    
    partlyCloudy: `<svg class="weather-icon-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="35" r="13" class="sun-fill"/>
      <line x1="60" y1="15" x2="60" y2="22"/>
      <line x1="78" y1="35" x2="73" y2="35"/>
      <line x1="73" y1="22" x2="67" y2="28"/>
      <path d="M20,65 Q20,58 27,58 Q27,52 35,52 Q38,48 42,52 Q50,52 50,58 Q57,58 57,65 Q57,72 50,72 L27,72 Q20,72 20,65 Z" class="icon-fill"/>
      <path d="M20,65 Q20,58 27,58 Q27,52 35,52 Q38,48 42,52 Q50,52 50,58 Q57,58 57,65 Q57,72 50,72 L27,72 Q20,72 20,65 Z"/>
    </svg>`,
    
    rain: `<svg class="weather-icon-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M20,45 Q20,38 27,38 Q27,32 35,32 Q38,28 42,32 Q50,32 50,38 Q57,38 57,45 Q57,52 50,52 L27,52 Q20,52 20,45 Z" class="icon-fill"/>
      <path d="M20,45 Q20,38 27,38 Q27,32 35,32 Q38,28 42,32 Q50,32 50,38 Q57,38 57,45 Q57,52 50,52 L27,52 Q20,52 20,45 Z"/>
      <path d="M28,58 L25,68" class="rain-drop"/>
      <path d="M38,60 L35,70" class="rain-drop"/>
      <path d="M48,58 L45,68" class="rain-drop"/>
      <path d="M33,65 L30,75" class="rain-drop"/>
      <path d="M43,67 L40,77" class="rain-drop"/>
    </svg>`,
    
    heavyRain: `<svg class="weather-icon-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M20,40 Q20,33 27,33 Q27,27 35,27 Q38,23 42,27 Q50,27 50,33 Q57,33 57,40 Q57,47 50,47 L27,47 Q20,47 20,40 Z" class="icon-fill"/>
      <path d="M20,40 Q20,33 27,33 Q27,27 35,27 Q38,23 42,27 Q50,27 50,33 Q57,33 57,40 Q57,47 50,47 L27,47 Q20,47 20,40 Z"/>
      <path d="M23,53 L20,65" class="rain-drop"/>
      <path d="M30,55 L27,67" class="rain-drop"/>
      <path d="M37,53 L34,65" class="rain-drop"/>
      <path d="M44,55 L41,67" class="rain-drop"/>
      <path d="M51,53 L48,65" class="rain-drop"/>
      <path d="M26,62 L23,74" class="rain-drop"/>
      <path d="M33,64 L30,76" class="rain-drop"/>
      <path d="M40,62 L37,74" class="rain-drop"/>
      <path d="M47,64 L44,76" class="rain-drop"/>
    </svg>`,
    
    snow: `<svg class="weather-icon-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M20,45 Q20,38 27,38 Q27,32 35,32 Q38,28 42,32 Q50,32 50,38 Q57,38 57,45 Q57,52 50,52 L27,52 Q20,52 20,45 Z" class="icon-fill"/>
      <path d="M20,45 Q20,38 27,38 Q27,32 35,32 Q38,28 42,32 Q50,32 50,38 Q57,38 57,45 Q57,52 50,52 L27,52 Q20,52 20,45 Z"/>
      <g class="snow-flake"><line x1="28" y1="60" x2="28" y2="68"/><line x1="24" y1="64" x2="32" y2="64"/><line x1="25.5" y1="61.5" x2="30.5" y2="66.5"/><line x1="30.5" y1="61.5" x2="25.5" y2="66.5"/></g>
      <g class="snow-flake"><line x1="40" y1="62" x2="40" y2="70"/><line x1="36" y1="66" x2="44" y2="66"/><line x1="37.5" y1="63.5" x2="42.5" y2="68.5"/><line x1="42.5" y1="63.5" x2="37.5" y2="68.5"/></g>
      <g class="snow-flake"><line x1="50" y1="58" x2="50" y2="66"/><line x1="46" y1="62" x2="54" y2="62"/><line x1="47.5" y1="59.5" x2="52.5" y2="64.5"/><line x1="52.5" y1="59.5" x2="47.5" y2="64.5"/></g>
    </svg>`,
    
    fog: `<svg class="weather-icon-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="40" x2="80" y2="40" class="fog-line"/>
      <line x1="25" y1="50" x2="75" y2="50" class="fog-line"/>
      <line x1="20" y1="60" x2="80" y2="60" class="fog-line"/>
      <line x1="30" y1="70" x2="70" y2="70" class="fog-line"/>
    </svg>`,
    
    rainAndFog: `<svg class="weather-icon-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M20,35 Q20,28 27,28 Q27,22 35,22 Q38,18 42,22 Q50,22 50,28 Q57,28 57,35 Q57,42 50,42 L27,42 Q20,42 20,35 Z" class="icon-fill"/>
      <path d="M20,35 Q20,28 27,28 Q27,22 35,22 Q38,18 42,22 Q50,22 50,28 Q57,28 57,35 Q57,42 50,42 L27,42 Q20,42 20,35 Z"/>
      <path d="M26,48 L23,56" class="rain-drop"/>
      <path d="M35,50 L32,58" class="rain-drop"/>
      <path d="M44,48 L41,56" class="rain-drop"/>
      <line x1="18" y1="65" x2="60" y2="65" class="fog-line"/>
      <line x1="22" y1="72" x2="56" y2="72" class="fog-line"/>
      <line x1="18" y1="79" x2="60" y2="79" class="fog-line"/>
    </svg>`,
    
    thunderstorm: `<svg class="weather-icon-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M20,40 Q20,33 27,33 Q27,27 35,27 Q38,23 42,27 Q50,27 50,33 Q57,33 57,40 Q57,47 50,47 L27,47 Q20,47 20,40 Z" class="icon-fill"/>
      <path d="M20,40 Q20,33 27,33 Q27,27 35,27 Q38,23 42,27 Q50,27 50,33 Q57,33 57,40 Q57,47 50,47 L27,47 Q20,47 20,40 Z"/>
      <path d="M35,50 L30,62 L36,62 L31,75" stroke="#ffd700" stroke-width="2" fill="#ffd700" opacity="0.8"/>
    </svg>`
  };

  // Temperature icon (thermometer)
  const tempIcon = `<svg class="weather-icon-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="42" y="20" width="16" height="40" rx="3" class="icon-fill"/>
    <circle cx="50" cy="70" r="12" class="icon-fill"/>
    <rect x="42" y="20" width="16" height="40" rx="3"/>
    <circle cx="50" cy="70" r="12"/>
    <line x1="50" y1="35" x2="50" y2="65" stroke-width="3"/>
  </svg>`;

  // Wind icon (wavy lines)
  const windIcon = `<svg class="weather-icon-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M20,35 Q35,30 50,35 T80,35"/>
    <path d="M15,50 Q30,45 45,50 T75,50"/>
    <path d="M20,65 Q35,60 50,65 T80,65"/>
  </svg>`;

  // Determine weather icon based on description
  function getWeatherIcon(description) {
    if (!description) return weatherIcons.cloudy;
    const desc = description.toLowerCase();
    
    // Check for compound conditions (e.g., "Light Rain and Fog/Mist")
    // Priority: thunder > snow > rain+fog > fog > rain > clouds > clear
    
    if (desc.includes('thunder') || desc.includes('storm')) return weatherIcons.thunderstorm;
    if (desc.includes('snow') || desc.includes('flurr') || desc.includes('sleet')) return weatherIcons.snow;
    
    // Handle combined rain + fog/mist conditions
    const hasRain = desc.includes('rain') || desc.includes('shower') || desc.includes('drizzle');
    const hasFog = desc.includes('fog') || desc.includes('mist') || desc.includes('haze');
    
    if (hasRain && hasFog) {
      // Show combined rain + fog icon for compound conditions
      return weatherIcons.rainAndFog;
    }
    
    if (hasFog) return weatherIcons.fog;
    
    if (hasRain) {
      if (desc.includes('heavy') || desc.includes('moderate')) return weatherIcons.heavyRain;
      if (desc.includes('light')) return weatherIcons.rain;
      return weatherIcons.rain;
    }
    
    if (desc.includes('cloud') || desc.includes('overcast')) {
      if (desc.includes('partly') || desc.includes('scattered') || desc.includes('few')) return weatherIcons.partlyCloudy;
      return weatherIcons.cloudy;
    }
    
    if (desc.includes('clear') || desc.includes('sunny') || desc.includes('fair')) return weatherIcons.sun;
    
    return weatherIcons.partlyCloudy; // default
  }

  function renderPeriods(periods, container, statusEl){
    container.innerHTML = '';
    const shown = (periods || []).slice(0, 12);
    shown.forEach(p => {
      const div = document.createElement('div');
      div.className = 'hour';
      const time = p.startTime ? new Date(p.startTime).toLocaleString() : (p.name || 'Hour');
      
      const desc = p.shortForecast || '';
      const tempText = p.temperature ? `${p.temperature} °${p.temperatureUnit || 'F'}` : '';
      
      const weatherIconSvg = getWeatherIcon(desc);
      
      let detailsHTML = '<div class="weather-details">';
      
      if (tempText) {
        detailsHTML += `<span class="weather-temp">${tempIcon} ${tempText}</span>`;
      }
      
      if (desc) {
        detailsHTML += `<span class="weather-condition">${weatherIconSvg} ${desc}</span>`;
      }
      
      detailsHTML += '</div>';
      
      div.innerHTML = detailsHTML;
      container.appendChild(div);
    });
    statusEl.textContent = '';
  }

  // Try to find a periods-like array anywhere in the JSON response.
  function findPeriodsRec(obj) {
    if (!obj || typeof obj !== 'object') return null;
    if (Array.isArray(obj)) {
      // Heuristic: array of objects where first object has a startTime or temperature
      if (obj.length && typeof obj[0] === 'object' && (obj[0].hasOwnProperty('startTime') || obj[0].hasOwnProperty('temperature'))) return obj;
    }
    for (const k of Object.keys(obj)) {
      try {
        const v = obj[k];
        if (Array.isArray(v)) {
          if (v.length && typeof v[0] === 'object' && (v[0].hasOwnProperty('startTime') || v[0].hasOwnProperty('temperature'))) return v;
        } else if (typeof v === 'object') {
          const found = findPeriodsRec(v);
          if (found) return found;
        }
      } catch (e) {
        // ignore property access errors
      }
    }
    return null;
  }

  async function fetchWeatherHourly(weatherStatus, weatherList){
    weatherStatus.textContent = 'Fetching latest observation...';
    weatherList.innerHTML = '';
    try {
      // Avoid sending a custom Accept header — let the browser negotiate to reduce
      // differences in server behaviour.
      const res = await fetch(WEATHER_URL);
      if (!res.ok) throw new Error('Network response not ok: ' + res.status);
      const data = await res.json();
      // The station/latest endpoint returns a single observation object with
      // `properties` containing fields like `timestamp`, `textDescription`,
      // `temperature` (with `value` in Celsius and `unitCode`), etc.
      // Try to detect a single observation first, otherwise fall back to
      // searching for periods or arrays as before.
      if (data && data.properties && (data.properties.timestamp || data.properties.temperature || data.properties.textDescription)) {
        // Render the single latest observation
        renderObservation(data, weatherList, weatherStatus);
        return;
      }

      // Fallback: try to find periods-like arrays (for other endpoints)
      let periods = (data && data.properties && data.properties.periods) || null;
      if (!periods) periods = findPeriodsRec(data) || [];

      if (!periods || !periods.length) {
        weatherStatus.textContent = 'No usable weather data found in response — see console for the raw response.';
        console.warn('Weather response (no usable data)', data);
        const pre = document.createElement('pre');
        pre.style.maxHeight = '240px';
        pre.style.overflow = 'auto';
        pre.textContent = JSON.stringify(data, null, 2);
        weatherList.appendChild(pre);
        return;
      }

      renderPeriods(periods, weatherList, weatherStatus);
    } catch (err) {
      weatherStatus.textContent = 'Failed to fetch forecast: ' + err.message;
      console.error('fetchWeatherHourly error', err);
    }
  }

  // Render a single station observation into the UI
  function renderObservation(obs, container, statusEl) {
    container.innerHTML = '';
    const p = obs.properties || {};
    const time = p.timestamp ? new Date(p.timestamp).toLocaleString() : (p.rawMessageTime || 'Now');
    
    // Temperature: may be { value: <Celsius>, unitCode: 'unit:degC' }
    let tempText = '';
    if (p.temperature && p.temperature.value !== null) {
      const c = p.temperature.value;
      // Convert to Fahrenheit for readability
      const f = Math.round((c * 9/5) + 32);
      tempText = `${f} °F (${Math.round(c)} °C)`;
    }
    
    const desc = p.textDescription || '';
    
    let windText = '';
    if (p.windSpeed && p.windSpeed.value !== null) {
      // Parse the unit code (e.g., 'wmoUnit:km_h-1' means km/h)
      let unit = p.windSpeed.unitCode.replace('wmoUnit:', '');
      // Convert 'km_h-1' to 'km/h', 'm_s-1' to 'm/s', etc.
      unit = unit.replace(/_/g, '/').replace(/-1$/, '');
      windText = `Wind: ${p.windSpeed.value.toFixed(1)} ${unit}`;
    }

    const weatherIconSvg = getWeatherIcon(desc);

    const div = document.createElement('div');
    div.className = 'hour';
    
    // Build HTML with icons integrated into their respective sections
    let detailsHTML = '<div class="weather-details">';
    
    if (tempText) {
      detailsHTML += `<span class="weather-temp">${tempIcon} ${tempText}</span>`;
    }
    
    if (desc) {
      detailsHTML += `<span class="weather-condition">${weatherIconSvg} ${desc}</span>`;
    }
    
    if (windText) {
      detailsHTML += `<span class="weather-wind">${windIcon} ${windText}</span>`;
    }
    
    detailsHTML += '</div>';
    
    div.innerHTML = detailsHTML;
    container.appendChild(div);
    statusEl.textContent = '';
  }

  document.addEventListener('DOMContentLoaded', function(){
    const weatherStatus = document.getElementById('weather-status');
    const weatherList = document.getElementById('weather-list');
    const timeDisplay = document.getElementById('time-display');

    function updateTime() {
      if (timeDisplay) {
        const now = new Date();
        const timeZone = 'America/Los_Angeles';
        const options = {
          timeZone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        };
        timeDisplay.textContent = now.toLocaleTimeString('en-US', options);
      }
    }

    function renderSkillIcons() {
      const icons = {
        'icon-languages': `<svg viewBox="0 0 100 100"><path d="M30 80 L40 20 L50 20 L60 80 M25 80 L65 80 M45 50 L55 50" class="icon-fill"/></svg>`,
        'icon-frontend': `<svg viewBox="0 0 100 100"><rect x="20" y="30" width="60" height="40" rx="5" class="icon-fill"/><line x1="20" y1="42" x2="80" y2="42"/><line x1="30" y1="30" x2="30" y2="70"/></svg>`,
        'icon-backend': `<svg viewBox="0 0 100 100"><rect x="30" y="20" width="40" height="15" rx="3" class="icon-fill"/><rect x="30" y="42" width="40" height="15" rx="3" class="icon-fill"/><rect x="30" y="64" width="40" height="15" rx="3" class="icon-fill"/><line x1="50" y1="35" x2="50" y2="42"/><line x1="50" y1="57" x2="50" y2="64"/></svg>`,
        'icon-data': `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="30" rx="25" ry="10" class="icon-fill"/><path d="M25 30 C25 45 75 45 75 30"/><path d="M25 45 C25 60 75 60 75 45"/><path d="M25 60 C25 75 75 75 75 60"/></svg>`,
        'icon-cloud': `<svg viewBox="0 0 100 100"><path d="M25,60 Q25,50 35,50 Q35,40 45,40 Q50,35 55,40 Q65,40 65,50 Q75,50 75,60 Q75,70 65,70 L35,70 Q25,70 25,60 Z" class="icon-fill"/></svg>`,
        'icon-ai': `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="10" class="icon-fill"/><line x1="50" y1="40" x2="50" y2="20"/><line x1="50" y1="60" x2="50" y2="80"/><line x1="40" y1="50" x2="20" y2="50"/><line x1="60" y1="50" x2="80" y2="50"/><line x1="35" y1="35" x2="25" y2="25"/><line x1="65" y1="65" x2="75" y2="75"/><line x1="35" y1="65" x2="25" y2="75"/><line x1="65" y1="35" x2="75" y2="25"/></svg>`
      };

      for (const id in icons) {
        const el = document.getElementById(id);
        if (el) {
          el.innerHTML = icons[id];
        }
      }
    }

    if (timeDisplay) {
      updateTime();
      setInterval(updateTime, 1000);
    }

    renderSkillIcons();

    if (weatherStatus && weatherList) {
      // initial fetch + refresh every 5 minutes    
      fetchWeatherHourly(weatherStatus, weatherList);
      setInterval(() => fetchWeatherHourly(weatherStatus, weatherList), 5 * 60 * 1000);
    }

    // Dad Joke API
    const jokeStatus = document.getElementById('joke-status');
    const jokeText = document.getElementById('joke-text');
    const newJokeBtn = document.getElementById('new-joke-btn');

    async function fetchDadJoke() {
      if (!jokeStatus || !jokeText) return;
      
      try {
        jokeStatus.textContent = 'Loading joke...';
        jokeText.textContent = '';
        
        const res = await fetch('https://icanhazdadjoke.com/', {
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!res.ok) throw new Error('Network response not ok: ' + res.status);
        
        const data = await res.json();
        
        if (data.joke) {
          jokeText.textContent = data.joke;
          jokeStatus.textContent = '';
        } else {
          jokeStatus.textContent = 'No joke found';
        }
      } catch (err) {
        jokeStatus.textContent = 'Failed to fetch joke: ' + err.message;
        console.error('fetchDadJoke error', err);
      }
    }

    if (jokeStatus && jokeText) {
      // Initial fetch
      fetchDadJoke();
      
      // Add click handler and hover effect for refresh icon
      if (newJokeBtn) {
        newJokeBtn.addEventListener('click', fetchDadJoke);
        
        // Add rotation on hover
        newJokeBtn.addEventListener('mouseenter', function() {
          this.style.transform = 'rotate(180deg)';
        });
        
        newJokeBtn.addEventListener('mouseleave', function() {
          this.style.transform = 'rotate(0deg)';
        });
        
        // Add rotation on click
        newJokeBtn.addEventListener('click', function() {
          this.style.transform = 'rotate(360deg)';
          setTimeout(() => {
            this.style.transform = 'rotate(0deg)';
          }, 300);
        });
      }
    }
  });
})();
