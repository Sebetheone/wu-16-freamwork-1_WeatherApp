import { useState } from 'react'
import WeatherHero from './components/WeatherHero.jsx'
import WeatherSearchForm from './components/WeatherSearchForm.jsx'
import WeatherCard from './components/WeatherCard.jsx'
import EmptyWeatherState from './components/EmptyWeatherState.jsx'
import { getWeatherByCity } from './services/weatherService.js'
import './App.css'

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

    setIsLoading(true)
    setError('')
    setWeather(null)

    try {
      const currentWeather = await getWeatherByCity(city)
      setWeather(currentWeather)
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

  return (
    <main className="app-shell">
      <WeatherHero />

      <section className="weather-panel" aria-label="Søg efter vejret">
        <WeatherSearchForm
          cityInput={cityInput}
          error={error}
          isLoading={isLoading}
          onCityInputChange={setCityInput}
          onSubmit={handleSubmit}
        />

        {weather ? <WeatherCard weather={weather} /> : <EmptyWeatherState />}
      </section>
    </main>
  )
}

export default App
