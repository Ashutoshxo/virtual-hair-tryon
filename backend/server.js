const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();


app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://virtual-hair-tryon-rfkwxy824-ashutoshs-projects-b06ecb4b.vercel.app',
    'https://virtual-hair-tryon.vercel.app/' 
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


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
