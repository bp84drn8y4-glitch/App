import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabase = createClient('https://hichuaezkyuvdaovyrlh.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpY2h1YWV6a3l1dmRhb3Z5cmxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1OTQ4MjQsImV4cCI6MjA5NzE3MDgyNH0.u5HKNlUESD9mKMszhVOH2NChBNEiB-rPV0tGkFn-wt0');

interface LoginProps {
  onLoginSuccess: (user: { id: string; username: string; role: string; businessId: string }) => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Query the users table directly in Supabase
      const { data, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (dbError || !data) {
        setError('Benutzername oder Passwort ungültig.');
        return;
      }

      // On success, pass the user details (including businessId) back to the app
      onLoginSuccess({
        id: data.id,
        username: data.username,
        role: data.role,
        businessId: data.businessId
      });
    } catch (err) {
      setError('Verbindung zum Datenbank-Server fehlgeschlagen.');
    }
  };

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '35px', background: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '25px', textAlign: 'center' }}>Login</h2>
        
        {error && (
          <div style={{ padding: '10px', marginBottom: '20px', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleAuth}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Benutzername (Username)</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }} 
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Passwort (Password)</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }} 
            />
          </div>

          <button 
            type="submit" 
            style={{ width: '100%', padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
          >
            Anmelden
          </button>
        </form>
      </div>
    </div>
  );
}
