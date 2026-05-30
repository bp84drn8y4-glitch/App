import express from 'express';
import cors from 'cors';
import //  Change it to this:
import db from './db';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize SQLite database file
const db = new Database('zeiterfassung.db');

// Ensure base entries table structure exists
db.exec(`
  CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee TEXT,
    startTime TEXT,
    endTime TEXT,
    task TEXT,
    customer TEXT,
    hours REAL,
    date TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Safe table migrations to prevent crashes with updated tracking inputs
try { db.exec("ALTER TABLE entries ADD COLUMN businessType TEXT;"); } catch(e){}
try { db.exec("ALTER TABLE entries ADD COLUMN sonstigesDesc TEXT;"); } catch(e){}
try { db.exec("ALTER TABLE entries ADD COLUMN materials TEXT;"); } catch(e){}

// ==========================================
// 1. User Authentication Routes
// ==========================================
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  try {
    const user = db.prepare('SELECT id, username, role FROM users WHERE username = ? AND password = ?').get(username, password);
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: 'Ungültige Anmeldedaten (Invalid credentials)' });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 2. User Management (Admin Provisioning)
// ==========================================
app.post('/api/users/register', (req, res) => {
  const { username, password, role } = req.body;
  try {
    db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?).run(username, password, role || "employee")');
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ success: false, message: 'Benutzername existiert bereits (Username already exists)' });
  }
});

app.get('/api/users', (req, res) => {
  try {
    const users = db.prepare("SELECT id, username, role FROM users WHERE role = 'employee'").all();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 3. Time Sheet & Material Logger Engine
// ==========================================
app.get('/api/entries', (req, res) => {
  const { employee, role } = req.query;
  try {
    let baseEntries;
    if (role === 'employer') {
      baseEntries = db.prepare('SELECT * FROM entries ORDER BY date DESC, id DESC').all();
    } else {
      baseEntries = db.prepare('SELECT * FROM entries WHERE employee = ? ORDER BY date DESC, id DESC').all(employee);
    }
    res.json(baseEntries);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/entries', (req, res) => {
  try {
    const { 
      employee, 
      startTime, 
      endTime, 
      task, 
      customer, 
      hours, 
      businessType, 
      sonstigesDesc, 
      materials 
    } = req.body;

    // Convert material object quantities safely to text strings for SQLite storage
    const materialsJsonString = materials ? JSON.stringify(materials) : '{}';

    const stmt = db.prepare(`
      INSERT INTO entries (
        employee, startTime, endTime, task, customer, hours, businessType, sonstigesDesc, materials
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      employee || '',
      startTime || '',
      endTime || '',
      task || '',
      customer || '',
      hours || 0,
      businessType || '',
      sonstigesDesc || '',
      materialsJsonString
    );

    res.status(201).json({ id: result.lastInsertRowid, success: true });
  } catch (error: any) {
    console.error("Database save error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// ==========================================
// Server Initialization
// ==========================================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Web-Backend active on http://localhost:${PORT}`);
});
