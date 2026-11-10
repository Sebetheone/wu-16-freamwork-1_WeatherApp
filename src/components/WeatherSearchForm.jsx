function WeatherSearchForm({
  cityInput,
  error,
  isLoading,
  onCityInputChange,
  onSubmit,
}) {
  return (
    <form className="search-form" onSubmit={onSubmit}>
      <label className="search-label" htmlFor="city-search">Søg på en by</label>
      <div className="search-controls">
        <input
          id="city-search"
          type="search"
          value={cityInput}
          onChange={(event) => onCityInputChange(event.target.value)}
          placeholder="F.eks. København"
          autoComplete="off"
          aria-describedby={error ? 'search-message' : undefined}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? (
            <><span className="button-spinner" aria-hidden="true" /> Søger</>
          ) : (
            'Find vejret'
          )}
        </button>
      </div>
      {error && <p className="search-message" id="search-message" role="alert">{error}</p>}
    </form>
  )
}

export default WeatherSearchForm
