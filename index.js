const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.get('/', (req, res) => {
  res.send('Mining server ishlayapti');
});

// WebSocket orqali real vaqtda balansni uzatish
wss.on('connection', (ws) => {
  console.log('Mijoz ulandi');

  let balance = 0;
  const miningRatePerSecond = 0.001; // Har soniyada qo'shiladigan miqdor

  const interval = setInterval(() => {
    balance += miningRatePerSecond;
    ws.send(JSON.stringify({ balance: balance.toFixed(4) }));
  }, 1000);

  ws.on('close', () => {
    clearInterval(interval);
    console.log('Mijoz uzildi');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishlamoqda`);
});
