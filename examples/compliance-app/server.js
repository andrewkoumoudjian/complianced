const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/trades', (req, res) => {
  res.json([
    { id: 1, symbol: 'ABC', qty: 100, status: 'ok' },
    { id: 2, symbol: 'XYZ', qty: 5000, status: 'flag' },
  ]);
});

app.listen(3000, () => {
  console.log('API listening on http://localhost:3000');
});
