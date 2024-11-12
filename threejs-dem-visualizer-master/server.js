const express = require('express');
const path = require('path');
const multer = require('multer');
const { mul } = require('three/webgpu');

const app = express();
const PORT = 8080;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'textures/'),
  filenema: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });
