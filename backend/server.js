const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/hairstyles', require('./routes/hairstyles'));
app.use('/api/upload', require('./routes/upload'));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running!' });
});
app.get("/", (req, res) => {
  res.send("✅ Backend is live and working!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
