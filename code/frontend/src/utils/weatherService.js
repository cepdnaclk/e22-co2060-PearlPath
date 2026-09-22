// Sri Lanka Destinations & Coordinates Database
export const LOCATION_COORDINATES = {
  'sigiriya': { lat: 7.9570, lon: 80.7603, region: 'Cultural Triangle', name: 'Sigiriya' },
  'central province': { lat: 7.9570, lon: 80.7603, region: 'Cultural Triangle', name: 'Sigiriya' },
  'ella': { lat: 6.8667, lon: 81.0466, region: 'Hill Country', name: 'Ella' },
  'badulla': { lat: 6.9897, lon: 81.0560, region: 'Hill Country', name: 'Badulla' },
  'yala': { lat: 6.3725, lon: 81.5170, region: 'South-East', name: 'Yala National Park' },
  'southern province': { lat: 6.0535, lon: 80.2210, region: 'South Coast', name: 'Galle / Mirissa' },
  'kegalle': { lat: 7.2513, lon: 80.3464, region: 'Sabaragamuwa', name: 'Kegalle' },
  'galle': { lat: 6.0535, lon: 80.2210, region: 'South Coast', name: 'Galle' },
  'hambantota': { lat: 6.1429, lon: 81.1212, region: 'South Coast', name: 'Hambantota' },
  'matara': { lat: 5.9485, lon: 80.5353, region: 'South Coast', name: 'Matara' },
  'kuliyapitiya': { lat: 7.4689, lon: 80.0401, region: 'Wayamba', name: 'Kuliyapitiya' },
  'kurunegala': { lat: 7.4863, lon: 80.3647, region: 'Wayamba', name: 'Kurunegala' },
  'ratnapura': { lat: 6.6828, lon: 80.4012, region: 'Sabaragamuwa', name: 'Ratnapura' },
  'kandy': { lat: 7.2906, lon: 80.6337, region: 'Hill Country', name: 'Kandy' },
  'mirissa': { lat: 5.9483, lon: 80.4716, region: 'South Coast', name: 'Mirissa' },
  'nuwara eliya': { lat: 6.9497, lon: 80.7891, region: 'Hill Country', name: 'Nuwara Eliya' },
  'colombo': { lat: 6.9271, lon: 79.8612, region: 'West Coast', name: 'Colombo' },
  'western province': { lat: 6.9271, lon: 79.8612, region: 'West Coast', name: 'Colombo' },
  'trincomalee': { lat: 8.5874, lon: 81.2152, region: 'East Coast', name: 'Trincomalee' },
  'arugam bay': { lat: 6.8413, lon: 81.8358, region: 'East Coast', name: 'Arugam Bay' },
  'dambulla': { lat: 7.8742, lon: 80.6511, region: 'Cultural Triangle', name: 'Dambulla' },
  'anuradhapura': { lat: 8.3114, lon: 80.4037, region: 'Cultural Triangle', name: 'Anuradhapura' },
  'polonnaruwa': { lat: 7.9403, lon: 81.0188, region: 'Cultural Triangle', name: 'Polonnaruwa' },
  'jaffna': { lat: 9.6615, lon: 80.0255, region: 'North', name: 'Jaffna' },
  'negombo': { lat: 7.2008, lon: 79.8737, region: 'West Coast', name: 'Negombo' },
  'bentota': { lat: 6.4256, lon: 79.9967, region: 'West Coast', name: 'Bentota' },
  'hikkaduwa': { lat: 6.1392, lon: 80.1063, region: 'South Coast', name: 'Hikkaduwa' }
};

/**
 * Exact whole-word matcher to prevent "kegalle" from matching "galle"
 */
export const findLocationMatch = (locationName) => {
  if (!locationName) return null;
  const normalized = locationName.toLowerCase().trim();
  const words = normalized.split(/[^a-z0-9]+/);

  // 1. Exact full string match first
  for (const key in LOCATION_COORDINATES) {
    if (key === normalized) {
      return LOCATION_COORDINATES[key];
    }
  }

  // 2. Exact word match
  for (const key in LOCATION_COORDINATES) {
    if (words.includes(key)) {
      return LOCATION_COORDINATES[key];
    }
  }

  // 3. Multi-word key match
  for (const key in LOCATION_COORDINATES) {
    const keyWords = key.split(/[^a-z0-9]+/);
    if (keyWords.every(kw => words.includes(kw))) {
      return LOCATION_COORDINATES[key];
    }
  }

  return null;
};

/**
 * Calculates Sri Lanka Seasonality & Safety Advisory based on location region and current month.
 */
export const getSeasonalityAdvisory = (locationName, currentMonth = new Date().getMonth() + 1) => {
  const matchedLocation = findLocationMatch(locationName);

  const region = matchedLocation ? matchedLocation.region : 'South Coast';

  // Monsoon Evaluation Logic
  const isSouthWestMonsoon = currentMonth >= 5 && currentMonth <= 9; // May - Sept
  const isNorthEastMonsoon = currentMonth >= 10 || currentMonth <= 1; // Oct - Jan
  const isInterMonsoon = currentMonth >= 2 && currentMonth <= 4; // Feb - April

  if (region === 'South Coast' || region === 'West Coast') {
    if (isSouthWestMonsoon) {
      return {
        type: 'warning', // Advisory Warning
        badge: 'Monsoon Safety Advisory',
        title: 'South-West Monsoon Season (May – Sept)',
        description: 'Rough sea waves and heavy afternoon rain showers expected. Water sports & whale watching may be restricted.',
        tips: ['Caution advised for ocean swimming', 'Carry umbrellas/waterproof gear', 'Ideal time to visit the East Coast beaches!'],
        icon: 'AlertTriangle'
      };
    } else if (isInterMonsoon || currentMonth === 12 || currentMonth === 1) {
      return {
        type: 'peak', // Peak Season
        badge: 'Peak Tourist Season ✨',
        title: 'Optimal Travel Conditions (Dec – April)',
        description: 'Calm ocean waters, sunny skies, and pleasant beach weather along South & West coasts.',
        tips: ['Ideal for surfing & whale watching', 'Book accommodations in advance', 'Great photography weather'],
        icon: 'Sparkles'
      };
    } else {
      return {
        type: 'moderate',
        badge: 'Transitional Weather',
        title: 'Inter-Monsoon Period',
        description: 'Short scattered afternoon showers expected. Morning activities are recommended.',
        tips: ['Plan outdoor tours before 2 PM', 'Warm tropical temperatures'],
        icon: 'Info'
      };
    }
  } else if (region === 'East Coast') {
    if (isNorthEastMonsoon) {
      return {
        type: 'warning',
        badge: 'Monsoon Safety Advisory',
        title: 'North-East Monsoon Season (Oct – Jan)',
        description: 'Heavy rainfall and sea swells on the East coast (Trincomalee, Arugam Bay).',
        tips: ['Surfing off-season in Arugam Bay', 'Check beach red flags before swimming'],
        icon: 'AlertTriangle'
      };
    } else {
      return {
        type: 'peak',
        badge: 'Peak East Coast Season ✨',
        title: 'Sunny Skies & Calm Seas (May – Sept)',
        description: 'Perfect weather for diving, snorkeling, and surfing in Trincomalee & Arugam Bay.',
        tips: ['Peak surfing season in Arugam Bay', 'Great ocean visibility for diving'],
        icon: 'Sparkles'
      };
    }
  } else if (region === 'Hill Country') {
    if (isSouthWestMonsoon || isNorthEastMonsoon) {
      return {
        type: 'moderate',
        badge: 'Mist & Scenic Rain',
        title: 'Cool Mountain Climate',
        description: 'Frequent mist, rain showers, and cool temperatures in Nuwara Eliya, Ella & Kandy.',
        tips: ['Pack warm clothing & rain jackets', 'Exercise care on mountain roads & trails', 'Stunning green tea estate views!'],
        icon: 'CloudRain'
      };
    } else {
      return {
        type: 'peak',
        badge: 'Best Mountain Trekking Season ✨',
        title: 'Clear Sky Window (Feb – April)',
        description: 'Mild temperatures and clear mountain views. Perfect for Little Adam\'s Peak & Ella Rock hikes.',
        tips: ['Ideal trekking conditions', 'Panoramas across Ella Gap are crystal clear'],
        icon: 'Sun'
      };
    }
  } else {
    // Cultural Triangle & North
    if (isNorthEastMonsoon) {
      return {
        type: 'moderate',
        badge: 'N-E Rainfall Season',
        title: 'Cultural Triangle Rainfall (Oct – Dec)',
        description: 'Moderate rains rejuvenate ancient lakes & reservoirs around Sigiriya & Polonnaruwa.',
        tips: ['Climb Sigiriya Rock early morning', 'Wear non-slip footwear on rock surfaces'],
        icon: 'Info'
      };
    } else {
      return {
        type: 'peak',
        badge: 'Great Sightseeing Weather ✨',
        title: 'Dry & Warm Conditions',
        description: 'Warm sunny weather ideal for exploring UNESCO World Heritage ruins & wildlife safaris.',
        tips: ['Stay hydrated during rock climbs', 'Morning or late afternoon visits recommended'],
        icon: 'Sparkles'
      };
    }
  }
};

/**
 * Maps WMO weather code from Open-Meteo to human readable description and Lucide icon.
 */
export const decodeWeatherCode = (code) => {
  if (code === 0) return { label: 'Clear Sky', icon: 'Sun' };
  if (code === 1 || code === 2) return { label: 'Partly Cloudy', icon: 'CloudSun' };
  if (code === 3) return { label: 'Overcast', icon: 'Cloud' };
  if (code >= 45 && code <= 48) return { label: 'Misty / Foggy', icon: 'CloudFog' };
  if (code >= 51 && code <= 55) return { label: 'Light Drizzle', icon: 'CloudDrizzle' };
  if (code >= 61 && code <= 65) return { label: 'Rain Showers', icon: 'CloudRain' };
  if (code >= 80 && code <= 82) return { label: 'Heavy Rain', icon: 'CloudRain' };
  if (code >= 95 && code <= 99) return { label: 'Thunderstorm', icon: 'CloudLightning' };
  return { label: 'Tropical Weather', icon: 'CloudSun' };
};

/**
 * Fetches real-time weather & 3-day forecast from Open-Meteo API.
 */
export const fetchWeatherData = async (locationName) => {
  let coords = findLocationMatch(locationName);

  // Dynamic Open-Meteo Geocoding Lookup if location not in pre-configured dictionary
  if (!coords && locationName) {
    try {
      const cleanName = locationName.replace(/district|factory|station|start|stop|route/gi, '').trim();
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanName)}&count=1`;
      const geoRes = await fetch(geoUrl);
      const geoData = await geoRes.json();
      if (geoData.results && geoData.results.length > 0) {
        const place = geoData.results[0];
        coords = {
          lat: place.latitude,
          lon: place.longitude,
          name: place.name,
          region: place.admin1 || place.name || 'West Coast'
        };
      }
    } catch (gErr) {
      console.warn("Geocoding lookup fallback:", gErr);
    }
  }

  // Fallback to Colombo if location still not resolved
  if (!coords) {
    coords = { lat: 6.9271, lon: 79.8612, name: locationName || 'Colombo', region: 'West Coast' };
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia/Colombo`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch weather data');
    const data = await res.json();

    const current = data.current;
    const daily = data.daily;
    const decodedCurrent = decodeWeatherCode(current.weather_code);

    // Parse 3-day forecast
    const forecast = [];
    const days = ['Today', 'Tomorrow', 'Day 3'];

    if (daily && daily.time) {
      for (let i = 0; i < Math.min(3, daily.time.length); i++) {
        const decodedDaily = decodeWeatherCode(daily.weather_code[i]);
        forecast.push({
          day: days[i] || daily.time[i],
          maxTemp: Math.round(daily.temperature_2m_max[i]),
          minTemp: Math.round(daily.temperature_2m_min[i]),
          precipProb: daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 20,
          label: decodedDaily.label,
          icon: decodedDaily.icon
        });
      }
    }

    const advisory = getSeasonalityAdvisory(coords.name || locationName);

    return {
      success: true,
      locationName: coords.name,
      current: {
        tempC: Math.round(current.temperature_2m),
        tempF: Math.round((current.temperature_2m * 9) / 5 + 32),
        humidity: current.relative_humidity_2m,
        windKm: Math.round(current.wind_speed_10m),
        label: decodedCurrent.label,
        icon: decodedCurrent.icon
      },
      forecast,
      advisory
    };
  } catch (err) {
    console.error('Weather fetch error:', err);
    // Return graceful fallback data so presentation never fails
    const advisory = getSeasonalityAdvisory(locationName);
    return {
      success: false,
      locationName: locationName,
      current: {
        tempC: 29,
        tempF: 84,
        humidity: 78,
        windKm: 14,
        label: 'Tropical Sunny',
        icon: 'Sun'
      },
      forecast: [
        { day: 'Today', maxTemp: 31, minTemp: 24, precipProb: 15, label: 'Sunny', icon: 'Sun' },
        { day: 'Tomorrow', maxTemp: 30, minTemp: 25, precipProb: 25, label: 'Partly Cloudy', icon: 'CloudSun' },
        { day: 'Day 3', maxTemp: 29, minTemp: 24, precipProb: 40, label: 'Light Showers', icon: 'CloudDrizzle' }
      ],
      advisory
    };
  }
};
