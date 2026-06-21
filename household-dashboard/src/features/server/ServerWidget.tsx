import { useCallback, useEffect, useState } from "react";
import { fetchServerHealth, type ServerHealth } from "../../api/serverApi";
import { Widget } from "../../components/Widget";

function formatBytes(bytes: number | null) {
  if (bytes === null || bytes === undefined) return "N/A";
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function ServerWidget() {
  const [health, setHealth] = useState<ServerHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchServerHealth();
      setHealth(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setHealth(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, [load]);

  return (
    <Widget title="Server" icon="⎈">
      <div className="server-widget">
        {loading && <div className="status-row">Fetching server metrics...</div>}

        {!loading && error && <div className="status-row">{error}</div>}

        {!loading && !error && health && (
          <div className="server-display">
            <div className="metric-row">
              <div className="metric">
                <span className="metric-label">CPU</span>
                <span className="metric-value">{health.cpu.usage?.toFixed(1) ?? 'N/A'}%</span>
              </div>
              <div className="metric">
                <span className="metric-label">GPU</span>
                <span className="metric-value">{health.gpu != null ? `${health.gpu}%` : 'N/A'}</span>
              </div>
            </div>

            <div className="metric-row">
              <div className="metric">
                <span className="metric-label">Memory free</span>
                <span className="metric-value">{formatBytes(health.memory.free)} ({health.memory.freePercent}%)</span>
              </div>
              <div className="metric">
                <span className="metric-label">Disk free</span>
                <span className="metric-value">{health.disk ? `${formatBytes(health.disk.free)} (${health.disk.usedPercent}% used)` : 'N/A'}</span>
              </div>
            </div>

            <div className="metric-row">
              <div className="metric">
                <span className="metric-label">Net RX</span>
                <span className="metric-value">{health.network.rx_sec != null ? `${formatBytes(health.network.rx_sec)}/s` : 'N/A'}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Net TX</span>
                <span className="metric-value">{health.network.tx_sec != null ? `${formatBytes(health.network.tx_sec)}/s` : 'N/A'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Widget>
  );
}
