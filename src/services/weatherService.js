async function fetchJson(url) {
  const response = await fetch(url)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Der opstod en fejl ved hentning af vejret.')
  }

  return data
}

function createApiUrl(endpoint, parameters) {
  const url = new URL(endpoint)
  Object.entries(parameters).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  return url
}

export async function getWeatherByCity(city) {
  const apiKey = import.meta.env.VITE_OPENWEATHER_MAP_API_KEY
  const geocodingEndpoint = import.meta.env.VITE_GEOCODING_URL
  const currentWeatherEndpoint = import.meta.env.VITE_CURRENT_WEATHER_URL

  if (!apiKey || !geocodingEndpoint || !currentWeatherEndpoint) {
    throw new Error('OpenWeatherMap-konfigurationen mangler i .env-filen.')
  }

  const locations = await fetchJson(createApiUrl(geocodingEndpoint, {
    q: city,
    limit: '1',
    appid: apiKey,
  }))

  if (locations.length === 0) {
    throw new Error(`Vi kunne ikke finde en by, der hedder “${city}”. Prøv igen.`)
  }

  const location = locations[0]
  const currentWeather = await fetchJson(createApiUrl(currentWeatherEndpoint, {
    lat: location.lat,
    lon: location.lon,
    units: 'metric',
    lang: 'da',
    appid: apiKey,
  }))

  return { ...currentWeather, location }
}
