const BASE_URL = "http://127.0.0.1:5000/api/settings";

export async function getWeatherLocation(): Promise<string> {
  const res = await fetch(`${BASE_URL}/weather-location`);
  if (!res.ok) throw new Error("Failed to fetch weather location");
  const data = await res.json();
  return data.location;
}

export async function saveWeatherLocation(location: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/weather-location`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ location }),
  });

  if (!res.ok) throw new Error("Failed to save weather location");
  const data = await res.json();
  return data.location;
}
