import express from 'express';
import cors from 'cors';
import db from './db';

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 🔐 GUARANTEED FALLBACK LOGIN ROUTE
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  // 1. Check fallback credentials FIRST instantly
  if (username.toLowerCase() === 'admin' && password === 'admin') {
    return res.json({ username: 'Admin', role: 'admin' });
  }

  // 2. If it's not the default fallback, check the database
  const sql = 'SELECT username, role, password FROM users WHERE LOWER(username) = LOWER(?)';
  db.get(sql, [username], (err, row: any) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row || row.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }
    res.json({ username: row.username, role: row.role });
  });
});

app.get('/api/entries', (req, res) => {
  const sql = 'SELECT * FROM entries ORDER BY id DESC';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/api/entries', (req, res) => {
  const { employeeName, orderedAmount, bringBackAmount, date } = req.body;
  if (!employeeName || !date) {
    return res.status(400).json({ error: 'Employee name and date are required fields.' });
  }
  const sql = `INSERT INTO entries (employeeName, orderedAmount, bringBackAmount, date) VALUES (?, ?, ?, ?)`;
  db.run(sql, [employeeName, orderedAmount, bringBackAmount, date], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Tracking entry logged successfully.', id: this.lastID });
  });
});

app.get('/', (req, res) => {
  res.send('Time Tracker API Server is live and running smoothly.');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server successfully started on port ${PORT}`);
});
