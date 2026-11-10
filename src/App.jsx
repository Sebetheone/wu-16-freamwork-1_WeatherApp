import { useState } from 'react'
import './App.css'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

async function fetchJson(url) {
  const response = await fetch(url)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Der opstod en fejl ved hentning af vejret.')
  }

  return data
}

function getWeatherIcon(icon) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`
}

function App() {
  const [cityInput, setCityInput] = useState('')
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const city = cityInput.trim()

    if (!city) {
      setError('Skriv navnet på en by for at søge.')
      return
    }

    if (!API_KEY) {
      setError('API-nøglen mangler. Tilføj VITE_OPENWEATHER_API_KEY i .env-filen.')
      return
    }

    setIsLoading(true)
    setError('')
    setWeather(null)

    try {
      const geocodingUrl = new URL('https://api.openweathermap.org/geo/1.0/direct')
      geocodingUrl.search = new URLSearchParams({
        q: city,
        limit: '1',
        appid: API_KEY,
      })

      const locations = await fetchJson(geocodingUrl)

      if (locations.length === 0) {
        setError(`Vi kunne ikke finde en by, der hedder “${city}”. Prøv igen.`)
        return
      }

      const location = locations[0]
      const weatherUrl = new URL('https://api.openweathermap.org/data/2.5/weather')
      weatherUrl.search = new URLSearchParams({
        lat: location.lat,
        lon: location.lon,
        units: 'metric',
        lang: 'da',
        appid: API_KEY,
      })

      const currentWeather = await fetchJson(weatherUrl)
      setWeather({ ...currentWeather, location })
    } catch (requestError) {
      setError(
        requestError.message === 'Failed to fetch'
          ? 'Kunne ikke oprette forbindelse. Tjek din internetforbindelse, og prøv igen.'
          : requestError.message,
      )
    } finally {
      setIsLoading(false)
    }
  }

  const temperature = weather ? Math.round(weather.main.temp) : null
  const feelsLike = weather ? Math.round(weather.main.feels_like) : null

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Vejrudsigt – forsiden">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 36 36" fill="none">
              <circle cx="23.5" cy="12.5" r="6.5" fill="currentColor" />
              <path
                d="M8 25.5a6.5 6.5 0 0 1 11.6-4.1A5.5 5.5 0 1 1 25 29H9.5A4.5 4.5 0 0 1 8 25.5Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span>vejr<span className="brand-light">udsigt</span></span>
        </a>
        <span className="topbar-note"><span className="live-dot" /> Aktuelt vejr</span>
      </header>

      <section className="hero" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow"><span /> DIN LILLE VEJRPAUSE</p>
          <h1 id="page-title">Ude eller<br />inde i dag<span className="title-period">?</span></h1>
          <p className="hero-description">
            Find vejret lige dér, hvor du er — eller hvor du skal hen.
          </p>
        </div>

        <div className="sun-art" aria-hidden="true">
          <div className="sun-halo" />
          <div className="sun-disc" />
          <div className="art-cloud art-cloud-one" />
          <div className="art-cloud art-cloud-two" />
          <span className="sun-sparkle sparkle-one">✳</span>
          <span className="sun-sparkle sparkle-two">✳</span>
          <span className="sun-sparkle sparkle-three">✳</span>
        </div>
      </section>

      <section className="weather-panel" aria-label="Søg efter vejret">
        <form className="search-form" onSubmit={handleSubmit}>
          <label className="search-label" htmlFor="city-search">Søg på en by</label>
          <div className="search-controls">
            <div className="input-wrap">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.7" />
                <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
              <input
                id="city-search"
                type="search"
                value={cityInput}
                onChange={(event) => setCityInput(event.target.value)}
                placeholder="F.eks. København"
                autoComplete="off"
                aria-describedby={error ? 'search-message' : undefined}
              />
            </div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="button-spinner" aria-hidden="true" />
                  Søger
                </>
              ) : (
                <>
                  Find vejret
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </div>
          {error && <p className="search-message" id="search-message" role="alert">{error}</p>}
        </form>

        {weather ? (
          <div className="weather-result" aria-live="polite">
            <div className="result-heading">
              <div>
                <p className="result-kicker">VEJRET LIGE NU</p>
                <h2>{weather.location.name}<span>{weather.location.country}</span></h2>
                <p className="weather-description">{weather.weather[0].description}</p>
              </div>
              <img
                className="weather-icon"
                src={getWeatherIcon(weather.weather[0].icon)}
                alt={weather.weather[0].description}
              />
            </div>
            <div className="weather-summary">
              <p className="temperature">{temperature}<span>°</span></p>
              <p className="feels-like">Føles som {feelsLike}°</p>
            </div>
            <div className="weather-details">
              <div>
                <span className="detail-icon">↗</span>
                <span className="detail-label">Vind</span>
                <strong>{Math.round(weather.wind.speed)} <small>m/s</small></strong>
              </div>
              <div>
                <span className="detail-icon">◌</span>
                <span className="detail-label">Luftfugtighed</span>
                <strong>{weather.main.humidity}<small>%</small></strong>
              </div>
              <div>
                <span className="detail-icon">⌖</span>
                <span className="detail-label">Skydække</span>
                <strong>{weather.clouds.all}<small>%</small></strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state" aria-live="polite">
            <div className="empty-icon" aria-hidden="true">
              <svg viewBox="0 0 48 48" fill="none">
                <circle cx="31" cy="17" r="8" fill="currentColor" />
                <path d="M9 33a7 7 0 0 1 12.4-4.4A6 6 0 1 1 26 37H11a5 5 0 0 1-2-4Z" fill="currentColor" />
              </svg>
            </div>
            <div>
              <p className="empty-title">En lille vejrudsigt venter</p>
              <p className="empty-description">Søg på en by, og se hvordan det ser ud udenfor.</p>
            </div>
            <span className="empty-arrow" aria-hidden="true">↗</span>
          </div>
        )}
      </section>

      <footer className="footer">
        <span>Lavet til at gøre dagen lidt lettere.</span>
        <span>VEJRET OPDATERES LIVE <span className="live-dot" /></span>
      </footer>
    </main>
  )
}

export default App
