import Database from 'better-sqlite3';
const db = new Database('zeiterfassung.db');

// Enable WAL mode for performance
db.pragma('journal_mode = WAL');

// 1. Create Core Application Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'employee'
  );

  CREATE TABLE IF NOT EXISTS time_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    employee TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    task TEXT NOT NULL,
    customer TEXT NOT NULL,
    hours REAL NOT NULL,
    business_type TEXT NOT NULL,
    sonstiges_desc TEXT
  );

  CREATE TABLE IF NOT EXISTS material_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    time_entry_id INTEGER NOT NULL,
    item_key TEXT NOT NULL,
    ordered_amount INTEGER DEFAULT 0,
    returned_amount INTEGER DEFAULT 0,
    FOREIGN KEY(time_entry_id) REFERENCES time_entries(id) ON DELETE CASCADE
  );
`);

// 2. Initialize Core Admin Credentials safely
const checkUser = db.prepare('SELECT * FROM users WHERE username = ?');
if (!checkUser.get('admin')) {
  db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)')
    .run('admin', 'Sam18@admin', 'employer');
}

export default db;
