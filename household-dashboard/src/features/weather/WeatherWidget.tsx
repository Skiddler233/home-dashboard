import { useCallback, useEffect, useState } from "react";
import { fetchCurrentWeather } from "../../api/weatherApi";
import { getWeatherLocation, saveWeatherLocation } from "../../api/settingsApi";
import type { CurrentWeather } from "../../types/weatherForecast";

export function WeatherWidget() {
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [locationInput, setLocationInput] = useState("");
  const [savedLocation, setSavedLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(async (location: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchCurrentWeather(location);
      setWeather(data);
    } catch (err) {
      setWeather(null);
      setError(err instanceof Error ? err.message : "Failed to load weather");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const location = await getWeatherLocation();
        setSavedLocation(location);
        setLocationInput(location);
        await loadWeather(location);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load settings");
        setLoading(false);
      }
    }

    init();
  }, [loadWeather]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const location = locationInput.trim();
    if (!location || location === savedLocation) return;

    setSaving(true);
    setError(null);

    try {
      const persisted = await saveWeatherLocation(location);
      setSavedLocation(persisted);
      setLocationInput(persisted);
      await loadWeather(persisted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save location");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="weather-widget">
      <form className="weather-form" onSubmit={handleSubmit}>
        <input
          className="input"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          placeholder="Enter city name..."
          aria-label="Weather location"
        />
        <button
          className="btn btn-primary"
          type="submit"
          disabled={saving || !locationInput.trim()}
        >
          {saving ? "Saving..." : "Update"}
        </button>
      </form>

      {loading && (
        <div className="weather-status">
          <span className="spinner" aria-hidden="true" />
          <span>Fetching conditions...</span>
        </div>
      )}

      {!loading && error && <p className="weather-error">{error}</p>}

      {!loading && !error && weather && (
        <div className="weather-display">
          <p className="weather-location">
            {weather.location}
            <span className="weather-country">{weather.country}</span>
          </p>

          <div className="weather-hero">
            <span className="weather-temperature">
              {Math.round(weather.temperature)}
            </span>
            <span className="weather-unit">°C</span>
          </div>

          <p className="weather-condition">{weather.condition}</p>

          <div className="weather-metrics">
            <div className="metric">
              <span className="metric-label">Humidity</span>
              <span className="metric-value">{weather.humidity}%</span>
            </div>
            <div className="metric">
              <span className="metric-label">Wind</span>
              <span className="metric-value">
                {Math.round(weather.windSpeed)} km/h
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
