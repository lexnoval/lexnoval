// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// .env'de yoksa 3001 kullan
const PORT = process.env.PORT || 3001;

// ... mongoose.connect(...) vs.

app.use(cors());
app.use(express.json());

// route mount
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// start
app.listen(PORT, () => {
  console.log(`Sunucu port ${PORT} üzerinde çalışıyor.`);
});


