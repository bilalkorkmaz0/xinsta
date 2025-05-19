const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

const dataPath = path.join(__dirname, 'data.json');

function readData() {
  if (!fs.existsSync(dataPath)) return { users: [], posts: [] };
  const raw = fs.readFileSync(dataPath);
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

app.get('/data.json', (req, res) => {
  res.sendFile(dataPath);
});

app.post('/save', (req, res) => {
  writeData(req.body);
  res.json({ success: true });
});

app.get('/', (req, res) => {
  res.redirect('/index.html');
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});