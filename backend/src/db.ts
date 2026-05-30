import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Connected to the standard SQLite cloud database.');
    // Initialize your tracking tables here
    db.run(`CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employeeName TEXT,
      orderedAmount TEXT,
      bringBackAmount TEXT,
      date TEXT
    )`);
  }
});

export default db;
