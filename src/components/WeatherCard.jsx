function WeatherCard({ weather }) {
  const temperature = Math.round(weather.main.temp)
  const feelsLike = Math.round(weather.main.feels_like)
  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`

  return (
    <div className="weather-result" aria-live="polite">
      <div className="result-heading">
        <div>
          <p className="result-kicker">Vejret lige nu</p>
          <h2>{weather.location.name}<span>{weather.location.country}</span></h2>
          <p className="weather-description">{weather.weather[0].description}</p>
        </div>
        <img
          className="weather-icon"
          src={iconUrl}
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
  )
}

export default WeatherCard
