const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();

// HTML va static fayllarni ochib berish
app.use(express.static(__dirname));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Bosh sahifa
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// WebSocket orqali real vaqtda balansni uzatish
wss.on('connection', (ws) => {
  console.log('Foydalanuvchi ulandi');

  let balance = 0;
  const miningRatePerSecond = 0.001; // Har soniyada qazib olinadigan miqdor

  const interval = setInterval(() => {
    balance += miningRatePerSecond;
    ws.send(JSON.stringify({ balance: balance.toFixed(4) }));
  }, 1000);

  ws.on('close', () => {
    clearInterval(interval);
    console.log('Foydalanuvchi uzildi');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishlamoqda`);
});
