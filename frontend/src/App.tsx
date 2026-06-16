import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import fuerstHauserLogo from './assets/logos/fuerst_hauser.jpg';
import hauserMittelLogo from './assets/logos/hauser_mittel.jpg';
import bullaugeLogo from './assets/logos/bullauge.jpg';
import signatureVistaLogo from './assets/logos/signature_vista.jpg';

const logoMap: Record<string, string> = {
  fuerst_hauser: fuerstHauserLogo,
  hauser_mittel: hauserMittelLogo,
  bullauge: bullaugeLogo,
  signature_vista: signatureVistaLogo,
};

// Step 1: Define the structured Business type definition
interface Business {
  id: string;
  name: string;
  logo: string;
}

// Global configuration array mapping your four companies
const businesses: Business[] = [
  { id: 'fuerst_hauser', name: 'Fürst Hauser Gebäudeservice', logo: '/src/assets/logos/fuerst_hauser.jpg' },
  { id: 'hauser_mittel', name: 'Hauser Reinigungsmittel', logo: '/src/assets/logos/hauser_mittel.jpg' },
  { id: 'bullauge', name: 'Bullauge Waschsalon', logo: '/src/assets/logos/bullauge.jpg' },
  { id: 'signature_vista', name: 'Signature Vista', logo: '/src/assets/logos/signature_vista.jpg' },
];

export default function App() {
  const [selectedRole, setSelectedRole] = useState<'employee' | 'admin' | 'customer'>('employee');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // New state tracking which business area was selected in the portal gateway
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedBusiness(null);
    setUsername('');
    setPassword('');
  };

  // Guaranteed clean styles matching your screen layout exactly
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxSizing: 'border-box' as const,
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
    portalContainer: {
      minHeight: '100vh',
      backgroundColor: '#f1f5f9',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxSizing: 'border-box' as const,
      position: 'relative' as const
    },
    portalHeader: {
      textAlign: 'center' as const,
      marginBottom: '40px'
    },
    portalGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
      maxWidth: '800px',
      width: '100%'
    },
    portalCard: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      outline: 'none'
    },
    imageWrapper: {
      height: '140px',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '16px',
      boxSizing: 'border-box' as const,
      overflow: 'hidden' as const
    },
    logoImg: {
      maxHeight: '100%',
      maxWidth: '100%',
      objectFit: 'contain' as const
    },
    portalCardTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#334155',
      marginTop: '8px'
    },
    topBarButton: {
      position: 'absolute' as const,
      top: '24px',
      right: '24px',
      padding: '10px 18px',
      backgroundColor: '#ef4444',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '13px',
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
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
      marginBottom: '24px'
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
      
  const getModeLabel = () => {
    if (selectedRole === 'admin') return 'Administrator Login';
    if (selectedRole === 'customer') return 'Customer Portal';
    return 'Employee Login';
  };

  // Phase 1: Not authenticated yet -> Show login card 
  if (!isLoggedIn) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Time recording</h1>
          <p style={styles.subtitle}>Please select your role</p>
      
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

  // Phase 2: Logged in, but hasn't chosen a business -> Show Gateway Portal Screen
  if (!selectedBusiness) {
    return (
      <div style={styles.portalContainer}>
        <button style={styles.topBarButton} onClick={handleLogout}>
          Abmelden (Logout)
        </button>

        <div style={styles.portalHeader}>
          <h1 style={{ ...styles.title, fontSize: '32px' }}>Unternehmensbereich wählen</h1>
          <p style={styles.subtitle}>Wählen Sie einen Bereich, um die Arbeitszeiten zu verwalten</p>
        </div>

        <div style={styles.portalGrid}>
          {businesses.map((biz) => (
            <button
              key={biz.id}
              onClick={() => setSelectedBusiness(biz.id)}
              style={styles.portalCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >

<div style={styles.imageWrapper}>
  <img 
    src={logoMap[biz.id]} 
    alt={biz.name} 
    style={{
      ...styles.logoImg,
      width: '100%',
      height: '100%',
      objectFit: 'contain'
    }} 
  />
</div>

              <span style={styles.portalCardTitle}>{biz.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Phase 3: Both authenticated and business chosen -> Render filtered tracking dashboard
  return (
    <Dashboard
      userRole={selectedRole}
      username={username || 'User'}
      businessId={selectedBusiness}
      onLogout={handleLogout}
      onBackToPortal={() => setSelectedBusiness(null)} // Allows changing sectors easily
    />
  );
}
