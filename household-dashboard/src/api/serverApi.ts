export type ServerHealth = {
  cpu: { usage: number | null };
  memory: { total: number; free: number; used: number; freePercent: number };
  disk: { total: number; used: number; free: number; usedPercent: number } | null;
  network: { rx_sec: number | null; tx_sec: number | null };
  gpu: number | null;
  timestamp: number;
};

export async function fetchServerHealth(): Promise<ServerHealth> {
  const url = (import.meta as any).env?.VITE_SERVER_HEALTH_URL || '/api/server-health';
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch server health: ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    const text = await res.text();
    throw new Error(`Expected JSON from ${url}, got: ${text.slice(0,200)}`);
  }
  return res.json();
}
