import React, { useState } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';

interface UserState {
  username: string;
  role: string;
}

export default function App() {
  const [user, setUser] = useState<UserState | null>(null);

  // This triggers instantly when the backend verifies the matching credentials
  const handleLoginSuccess = (loginResponse: any) => {
    if (loginResponse && loginResponse.user) {
      setUser({
        username: loginResponse.user.username,
        role: loginResponse.user.role
      });
    } else if (loginResponse && loginResponse.username) {
      // Fallback matching logic
      setUser({
        username: loginResponse.username,
        role: loginResponse.role
      });
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {!user ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}
