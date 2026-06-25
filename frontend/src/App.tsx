import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';

// Asset logo imports
import fuerstHauserLogo from './assets/logos/fuerst_hauser.jpg';
import hauserMittelLogo from './assets/logos/hauser_mittel.jpg';
import bullaugeLogo from './assets/logos/bullauge.jpg';
import signatureVistaLogo from './assets/logos/signature_vista.jpg';

// Static config mappings
const logoMap: Record<string, string> = {
  fuerst_hauser: fuerstHauserLogo,
  hauser_mittel: hauserMittelLogo,
  bullauge: bullaugeLogo,
  signature_vista: signatureVistaLogo,
};

interface Business {
  id: string;
  name: string;
  logo: string;
}

const businesses: Business[] = [
  { id: 'fuerst_hauser', name: 'Fürst Hauser Gebäudeservice', logo: '' },
  { id: 'hauser_mittel', name: 'Hauser Reinigungsmittel', logo: '' },
  { id: 'bullauge', name: 'Bullauge Waschsalon', logo: '' },
  { id: 'signature_vista', name: 'Signature Vista', logo: '' },
];

const styles = {
  container: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' },
  loginCard: { padding: '30px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', width: '360px' },
  tabsContainer: { display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: '20px', width: '100%' },
  tabButton: (isActive: boolean) => ({
    flex: 1,
    padding: '10px 0',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: isActive ? '3px solid #3b82f6' : '3px solid transparent',
    color: isActive ? '#3b82f6' : '#64748b',
    fontWeight: isActive ? ('bold' as const) : ('normal' as const),
    cursor: 'pointer',
    textAlign: 'center' as const,
    fontSize: '0.9rem',
    marginBottom: '-2px',
    transition: 'all 0.2s'
  }),
  inputGroup: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
  input: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' as const },
  submitButton: { width: '100%', padding: '10px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '5px' },
  portalContainer: { padding: '4px', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' },
  topBar: { display: 'flex', justifyContent: 'flex-end', padding: '20px' },
  topBarButton: { padding: '10px 16px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  portalHeader: { textAlign: 'center' as const, marginTop: '40px', marginBottom: '40px' },
  portalGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px', maxWidth: '1000px', margin: '0 auto', padding: '0 20px' },
  portalCard: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
  imageWrapper: { width: '160px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' },
  logoImg: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' as const },
  portalCardTitle: { fontWeight: 'bold', color: '#1e293b', fontSize: '1.1rem', textAlign: 'center' as const }
};

export default function App() {
  const [selectedRole, setSelectedRole] = useState<'employee' | 'admin' | 'customer'>('employee');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedBusiness(null);
    setUsername('');
    setPassword('');
  };

  // ==========================================
  // Phase 1: Not logged in -> Render Login Panel with Role Tabs
  // ==========================================
  if (!isLoggedIn) {
    return (
      <div style={styles.container}>
        <div style={styles.loginCard}>
          <h2 style={{ textAlign: 'center', marginTop: 0, marginBottom: '20px' }}>Zeiterfassung Login</h2>
          
          {/* Three Role Selection Tabs */}
          <div style={styles.tabsContainer}>
            <button 
              type="button"
              style={styles.tabButton(selectedRole === 'employee')} 
              onClick={() => setSelectedRole('employee')}
            >
              Mitarbeiter
            </button>
            <button 
              type="button"
              style={styles.tabButton(selectedRole === 'admin')} 
              onClick={() => setSelectedRole('admin')}
            >
              Admin
            </button>
            <button 
              type="button"
              style={styles.tabButton(selectedRole === 'customer')} 
              onClick={() => setSelectedRole('customer')}
            >
              Kunde
            </button>
          </div>

          <form onSubmit={handleLoginSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nutzername</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Passwort</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
            </div>
            <button type="submit" style={styles.submitButton}>Einloggen</button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // Phase 2: Logged in, no company -> Show Portal Grid Selection
  // ==========================================
  if (!selectedBusiness) {
    return (
      <div style={styles.portalContainer}>
        <div style={styles.topBar}>
          <button style={styles.topBarButton} onClick={handleLogout}>
            Abmelden (Logout)
          </button>
        </div>
        
        <div style={styles.portalHeader}>
          <h1 style={{ fontSize: '32px', color: '#1e293b', marginBottom: '10px' }}>Unternehmensbereich wählen</h1>
          <p style={{ color: '#64748b' }}>Angemeldet als: <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{selectedRole}</span></p>
        </div>

        <div style={styles.portalGrid}>
          {businesses.map((biz) => (
            <button
              key={biz.id}
              onClick={() => setSelectedBusiness(biz.id)}
              style={styles.portalCard}
            >
              <div style={styles.imageWrapper}>
                <img src={logoMap[biz.id]} alt={biz.name} style={styles.logoImg} />
              </div>
              <span style={styles.portalCardTitle}>{biz.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================
  // Phase 3: Company picked -> Render Working Dashboard View
  // ==========================================
  return (
    <Dashboard
      userRole={selectedRole}
      username={username}
      businessId={selectedBusiness}
      onLogout={handleLogout}
      onBackToPortal={() => setSelectedBusiness(null)}
    />
  );
}
