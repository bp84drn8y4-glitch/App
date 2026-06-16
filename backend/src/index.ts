import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
app.use(cors());
app.use(express.json());

// 1. NEON POSTGRESQL CONNECTION POOL
// Reads securely from your environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for secure cloud database hosting providers like Neon
  },
});

// 2. AUTHENTICATION: LOGIN ENDPOINT
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Fetch user profile from the database
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Ungültiger Benutzername oder Passwort' });
    }

    // Verify plaintext password match
    if (user.password !== password) {
      return res.status(401).json({ error: 'Ungültiger Benutzername oder Passwort' });
    }

    // Success! Return user profile and role to frontend
    res.json({
      token: "authenticated-session-token",
      user: {
        username: user.username,
        role: user.role // 'admin' or 'employee'
      }
    });

  } catch (error) {
    console.error("Login Server Error:", error);
    res.status(500).json({ error: 'Interner Serverfehler beim Login' });
  }
});

// 3. GET ENTRIES (Role-Filtered History Log Finder)
app.get('/api/entries', async (req, res) => {
  const username = req.headers['x-user-name'] as string;
  const role = req.headers['x-user-role'] as string;

  try {
    let result;

    if (role === 'admin') {
      // Admins see all logs sequentially
      result = await pool.query('SELECT * FROM entries ORDER BY date DESC, id DESC');
    } else {
      // Employees ONLY see rows matching their login username
      result = await pool.query(
        'SELECT * FROM entries WHERE LOWER(employee_name) = LOWER($1) ORDER BY date DESC, id DESC',
        [username]
      );
    }

    // Format fields with fallbacks so your React columns never break or render blank spaces
    const formattedEntries = result.rows.map(row => ({
      id: row.id,
      employeeName: row.employee_name || row.employee,
      employee_name: row.employee_name || row.employee,
      employee: row.employee || row.employee_name,
      business_name: row.business_name || row.business,
      businessName: row.business_name || row.business,
      business: row.business || row.business_name,
      date: row.date,
      startTime: row.start_time,
      start_time: row.start_time,
      endTime: row.end_time,
      end_time: row.end_time,
      tasks: row.tasks || (typeof row.task === 'string' ? JSON.parse(row.task) : row.task) || [],
      materialsList: typeof row.materials_list === 'string' ? JSON.parse(row.materials_list) : row.materials_list,
      miscellaneous: row.miscellaneous,
      customerName: row.customer_name || row.customer,
      customer_name: row.customer_name || row.customer
    }));

    res.json(formattedEntries);
  } catch (error) {
    console.error("Error fetching entries from database:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 4. POST NEW ENTRY (Dual-Column Sync Insertion Engine)
app.post('/api/entries', async (req, res) => {
  try {
    const { 
      employeeName, business, date, startTime, endTime, 
      tasks, miscellaneous, materialsList, customerName 
    } = req.body;

    // Insert payload populating both structural property variations to keep front-end safe
    await pool.query(
      `INSERT INTO entries (
        employee_name, employee, 
        business_name, business, 
        date, 
        start_time, end_time, 
        tasks, task,
        materials_list, 
        miscellaneous, 
        customer_name, customer
      ) VALUES ($1, $1, $2, $2, $3, $4, $5, $6, $6, $7, $8, $9, $9)`,
      [
        employeeName || '',                        // $1
        business || '',                            // $2
        date,                                      // $3
        startTime,                                 // $4
        endTime,                                   // $5
        Array.isArray(tasks) ? tasks : [tasks],    // $6
        typeof materialsList === 'string' ? materialsList : JSON.stringify(materialsList || []), // $7
        miscellaneous || '',                       // $8
        customerName || ''                         // $9
      ]
    );

    res.json({ success: true, message: "Eintrag erfolgreich gespeichert!" });
  } catch (error) {
    console.error("Error inserting entry into database:", error);
    res.status(500).json({ error: "Interner Serverfehler beim Speichern" });
  }
});

// 5. SERVER RUNTIME INITIALIZER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server seamlessly executing on port ${PORT}`);
  console.log(`🔗 Switched completely to Cloud Neon PostgreSQL Engine.`);
});
