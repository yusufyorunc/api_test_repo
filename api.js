require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

let items = [
  { id: 1, name: 'Örnek item 1' },
  { id: 2, name: 'Örnek item 2' }
];
let nextId = 3;

app.get('/', (req, res) => {
  res.json({ message: 'API çalışıyor' });
});

app.get('/items', (req, res) => {
  res.json(items);
});

app.get('/items/:id', (req, res, next) => {
  const id = Number(req.params.id);
  const item = items.find(i => i.id === id);
  if (!item) return next({ status: 404, message: 'Item bulunamadı' });
  res.json(item);
});

app.post('/items', (req, res, next) => {
  const { name } = req.body;
  if (!name) return next({ status: 400, message: 'name alanı gerekli' });
  const newItem = { id: nextId++, name };
  items.push(newItem);
  res.status(201).json(newItem);
});

app.put('/items/:id', (req, res, next) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return next({ status: 404, message: 'Item bulunamadı' });
  if (!name) return next({ status: 400, message: 'name alanı gerekli' });
  items[idx].name = name;
  res.json(items[idx]);
});


app.delete('/items/:id', (req, res, next) => {
  const id = Number(req.params.id);
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return next({ status: 404, message: 'Item bulunamadı' });
  const deleted = items.splice(idx, 1)[0];
  res.json({ message: 'Silindi', deleted });
});

app.use((req, res, next) => {
  res.status(404).json({ error: 'Bulunamadı' });
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Sunucu hatası' });
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
