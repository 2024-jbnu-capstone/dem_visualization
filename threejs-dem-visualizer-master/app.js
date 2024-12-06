const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'scr')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'templates', 'index.html'));
});

app.get('/visualization', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'templates', 'visual.html'));
});

app.get('/jeonghop', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'templates', 'jeonghop.html'));
});

app.get('/report', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'templates', 'pro.html'));
});
