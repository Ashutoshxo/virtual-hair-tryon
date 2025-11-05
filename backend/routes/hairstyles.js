const express = require('express');
const router = express.Router();
const db = require('../config/db');


router.get('/', async (req, res) => {
  try {
    const { length } = req.query;
    
    let query = 'SELECT * FROM hairstyles';
    let params = [];
    
    if (length) {
      query += ' WHERE length = ?';
      params.push(length);
    }
    
    const [rows] = await db.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, length, image_url, color } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO hairstyles (name, length, image_url, color) VALUES (?, ?, ?, ?)',
      [name, length, image_url, color || 'black']
    );
    
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;