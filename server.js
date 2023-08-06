// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;
const dataPath = './data.json';

app.use(bodyParser.json());

// Read data from JSON file
function readData() {
  const rawData = fs.readFileSync(dataPath);
  return JSON.parse(rawData);
}

// Write data to JSON file
function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// CRUD Operations
// GET - All items
app.get('/items', (req, res) => {
  const data = readData();
  res.json(data.items);
});

// GET - One item details
app.get('/items/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const item = data.items.find((item) => item.id === id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// POST - Add an item
app.post('/items', (req, res) => {
  const data = readData();
  const newItem = req.body;
  newItem.id = data.items.length + 1;
  data.items.push(newItem);
  writeData(data);
  res.status(201).json(newItem);
});

// PUT - Update a item
app.put('/items/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const updatedItem = req.body;
  const index = data.items.findIndex((item) => item.id === id);
  if (index !== -1) {
    data.items[index] = { ...data.items[index], ...updatedItem };
    writeData(data);
    res.json(data.items[index]);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// DELETE - Delete one item
app.delete('/items/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const index = data.items.findIndex((item) => item.id === id);
  if (index !== -1) {
    const deletedItem = data.items.splice(index, 1)[0];
    writeData(data);
    res.json(deletedItem);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
