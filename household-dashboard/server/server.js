'use strict';
const express = require('express');
const os = require('os');
const fs = require('fs');
const { exec } = require('child_process');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5174;

let lastNet = null;

function sampleCpu() {
  const cpus = os.cpus();
  let idle = 0, total = 0;
  for (const c of cpus) {
    for (const t in c.times) {
      total += c.times[t];
    }
    idle += c.times.idle;
  }
  return { idle, total };
}

function getCpuUsage() {
  return new Promise((resolve) => {
    const start = sampleCpu();
    setTimeout(() => {
      const end = sampleCpu();
      const idle = end.idle - start.idle;
      const total = end.total - start.total;
      const usage = total > 0 ? (1 - idle / total) * 100 : 0;
      resolve(Math.round(usage * 10) / 10);
    }, 100);
  });
}

function getDisk() {
  return new Promise((resolve) => {
    exec('df -kP /', (err, stdout) => {
      if (err) return resolve(null);
      const lines = stdout.trim().split('\n');
      if (lines.length < 2) return resolve(null);
      const cols = lines[1].split(/\s+/);
      const total = parseInt(cols[1], 10) * 1024;
      const used = parseInt(cols[2], 10) * 1024;
      const avail = parseInt(cols[3], 10) * 1024;
      const usedPct = total > 0 ? Math.round((used / total) * 1000) / 10 : 0;
      resolve({ total, used, free: avail, usedPercent: usedPct });
    });
  });
}

function getMemory() {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  const freePercent = total > 0 ? Math.round((free / total) * 1000) / 10 : 0;
  return { total, free, used, freePercent };
}

function readNet() {
  try {
    const data = fs.readFileSync('/proc/net/dev', 'utf8');
    const lines = data.split('\n').slice(2);
    let rx = 0, tx = 0;
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (!parts[0]) continue;
      const iface = parts[0].replace(':', '');
      if (iface === 'lo') continue;
      rx += parseInt(parts[1], 10) || 0;
      tx += parseInt(parts[9], 10) || 0;
    }
    return { rx, tx, time: Date.now() };
  } catch (e) {
    return null;
  }
}

function getNetworkRates() {
  const now = readNet();
  if (!now) return { rx_sec: null, tx_sec: null };
  if (!lastNet) {
    lastNet = now;
    return { rx_sec: 0, tx_sec: 0 };
  }
  const dt = (now.time - lastNet.time) / 1000;
  const rx_sec = dt > 0 ? Math.round((now.rx - lastNet.rx) / dt) : 0;
  const tx_sec = dt > 0 ? Math.round((now.tx - lastNet.tx) / dt) : 0;
  lastNet = now;
  return { rx_sec, tx_sec };
}

function getGpu() {
  return new Promise((resolve) => {
    exec('nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader,nounits', (err, stdout) => {
      if (err) return resolve(null);
      const v = parseFloat(stdout.trim().split('\n')[0]);
      if (isNaN(v)) return resolve(null);
      resolve(Math.round(v * 10) / 10);
    });
  });
}

app.get('/api/server-health', async (req, res) => {
  try {
    const [cpu, disk, gpu] = await Promise.all([getCpuUsage(), getDisk(), getGpu()]);
    const mem = getMemory();
    const net = getNetworkRates();
    res.json({
      cpu: { usage: cpu },
      memory: mem,
      disk: disk,
      network: net,
      gpu: gpu,
      timestamp: Date.now(),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Serve built frontend if present (production)
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
