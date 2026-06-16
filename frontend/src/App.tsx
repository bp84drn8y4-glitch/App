import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [selectedRole, setSelectedRole] = useState<'employee' | 'admin' | 'customer'>('employee');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  if (isLoggedIn) {
    return (
      <Dashboard 
        userRole={selectedRole} 
        username={username || 'User'} 
        onLogout={handleLogout} 
      />
    );
  }

  // Guaranteed clean styles matching your screen layout exactly
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      padding: '40px',
      maxWidth: '420px',
      width: '100%',
      border: '1px solid #f1f5f9',
      textAlign: 'center' as const
    },
    title: {
      fontSize: '26px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 6px 0'
    },
    subtitle: {
      fontSize: '14px',
      color: '#64748b',
      margin: '0 0 28px 0'
    },
    tabGroup: {
      display: 'flex',
      backgroundColor: '#f1f5f9',
      padding: '4px',
      borderRadius: '12px',
      marginBottom: '20px'
    },
    tabButton: (isActive: boolean) => ({
      flex: 1,
      padding: '10px 0',
      fontSize: '14px',
      fontWeight: '600' as const,
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: isActive ? '#2563eb' : 'transparent',
      color: isActive ? '#ffffff' : '#475569',
      boxShadow: isActive ? '0 4px 6px -1px rgba(0,0,0,0.08)' : 'none'
    }),
    badge: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#2563eb',
      backgroundColor: '#eff6ff',
      padding: '6px 14px',
      borderRadius: '8px',
      display: 'inline-block',
      marginBottom: '24px',
      transition: 'all 0.2s'
    },
    form: {
      textAlign: 'left' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '18px'
    },
    label: {
      display: 'block',
      fontSize: '13px',
      fontWeight: '600',
      color: '#334155',
      marginBottom: '6px'
    },
    input: {
      width: '100%',
      padding: '11px 14px',
      border: '1px solid #cbd5e1',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      boxSizing: 'border-box' as const,
      backgroundColor: '#ffffff'
    },
    submitButton: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#2563eb',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '6px',
      boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
    }
  };

  // Helper text to make sure mode text matches beautifully
  const getModeLabel = () => {
    if (selectedRole === 'admin') return 'Administrator Login';
    if (selectedRole === 'customer') return 'Customer Portal';
    return 'Employee Login';
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        <h1 style={styles.title}>Time recording</h1>
        <p style={styles.subtitle}>Please select your role</p>

        {/* Fixed 3-Tab Group with uppercase Customer */}
        <div style={styles.tabGroup}>
          <button
            type="button"
            onClick={() => setSelectedRole('employee')}
            style={styles.tabButton(selectedRole === 'employee')}
          >
            Employees
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('admin')}
            style={styles.tabButton(selectedRole === 'admin')}
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('customer')}
            style={styles.tabButton(selectedRole === 'customer')}
          >
            Customer
          </button>
        </div>

        {/* Dynamic Mode Badge that listens perfectly to the state update */}
        <div style={styles.badge}>
          Mode: {getModeLabel()}
        </div>

        <form onSubmit={handleLoginSubmit} style={styles.form}>
          <div>
            <label style={styles.label}>user name</label>
            <input 
              type="text" 
              placeholder="Username entering..."
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={styles.label}>password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" style={styles.submitButton}>
            Log in (Sign In)
          </button>
        </form>

      </div>
    </div>
  );
}
