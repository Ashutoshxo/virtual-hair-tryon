const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

// Create tables
const createTables = async () => {
  try {
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS hairstyles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        length ENUM('short', 'medium', 'long') NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        color VARCHAR(50) DEFAULT 'black',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS user_previews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_photo VARCHAR(500) NOT NULL,
        hairstyle_id INT,
        preview_image VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (hairstyle_id) REFERENCES hairstyles(id) ON DELETE SET NULL
      )
    `);

    console.log('✅ Tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
  }
};

createTables();

module.exports = promisePool;
