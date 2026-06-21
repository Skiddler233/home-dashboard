import type { CurrentWeather } from "../types/weatherForecast";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

const WEATHER_CODES: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

function weatherDescription(code: number): string {
  return WEATHER_CODES[code] ?? "Unknown";
}

export async function fetchCurrentWeather(location: string): Promise<CurrentWeather> {
  const geoRes = await fetch(
    `${GEOCODING_URL}?name=${encodeURIComponent(location)}&count=1&language=en&format=json`,
  );
  if (!geoRes.ok) throw new Error("Failed to look up location");

  const geoData = await geoRes.json();
  const place = geoData.results?.[0];
  if (!place) throw new Error(`Location "${location}" not found`);

  const forecastRes = await fetch(
    `${FORECAST_URL}?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`,
  );
  if (!forecastRes.ok) throw new Error("Failed to fetch weather");

  const forecastData = await forecastRes.json();
  const current = forecastData.current;

  return {
    location: place.name,
    country: place.country,
    temperature: current.temperature_2m,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    condition: weatherDescription(current.weather_code),
  };
}
