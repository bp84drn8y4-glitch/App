import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

// 1. SUPABASE INITIALIZATION
// Replace these placeholders with your actual credentials from your Supabase Dashboard settings!
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_KEY = 'your-anon-public-key'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. AUTHENTICATION: LOGIN ENDPOINT
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Fetch user profile from Supabase 'users' table
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Ungültiger Benutzername oder Passwort' });
    }

    // Verify plaintext password match
    if (user.password !== password) {
      return res.status(401).json({ error: 'Ungültiger Benutzername oder Passwort' });
    }

    // Return identity profile and role to frontend context
    res.json({
      token: "authenticated-session-token",
      user: {
        username: user.username,
        role: user.role // Returns 'admin' or 'employee' dynamically from Supabase
      }
    });

  } catch (error) {
    console.error("Login Server Error:", error);
    res.status(500).json({ error: 'Interner Serverfehler beim Login' });
  }
});

// 3. GET ENTRIES (Role-Filtered Log Fetcher)
app.get('/api/entries', async (req, res) => {
  const username = req.headers['x-user-name'] as string;
  const role = req.headers['x-user-role'] as string;

  try {
    let query = supabase.from('entries').select('*');

    // Role Enforcement Filter
    if (role !== 'admin') {
      // Employees ONLY fetch rows matching their unique profile username
      query = query.ilike('employee_name', username);
    }

    // Order logs cleanly by date and id descending
    const { data: entries, error } = await query
      .order('date', { ascending: false })
      .order('id', { ascending: false });

    if (error) throw error;

    // Format fields with fallback maps so the React components never encounter unexpected empty rendering fields
    const formattedEntries = (entries || []).map(row => ({
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
    console.error("Error fetching entries from Supabase:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 4. POST NEW ENTRY (Dual-Column Insertion Engine)
app.post('/api/entries', async (req, res) => {
  try {
    const { 
      employeeName, business, date, startTime, endTime, 
      tasks, miscellaneous, materialsList, customerName 
    } = req.body;

    // Insert data by explicitly syncing both historical variant name properties simultaneously
    const { error } = await supabase.from('entries').insert([
      {
        employee_name: employeeName || '',
        employee: employeeName || '',
        business_name: business || '',
        business: business || '',
        date: date,
        start_time: startTime,
        end_time: endTime,
        tasks: Array.isArray(tasks) ? tasks : [tasks],
        task: Array.isArray(tasks) ? JSON.stringify(tasks) : JSON.stringify([tasks]),
        materials_list: typeof materialsList === 'string' ? materialsList : JSON.stringify(materialsList || []),
        miscellaneous: miscellaneous || '',
        customer_name: customerName || '',
        customer: customerName || ''
      }
    ]);

    if (error) throw error;

    res.json({ success: true, message: "Eintrag erfolgreich in Supabase gespeichert!" });
  } catch (error) {
    console.error("Error inserting entry into Supabase:", error);
    res.status(500).json({ error: "Interner Serverfehler beim Speichern" });
  }
});

// 5. SERVER DEPLOYMENT LISTENER
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server successfully executing on port ${PORT}`);
  console.log(`🔗 Connected natively to Supabase Cloud API Instance.`);
});
