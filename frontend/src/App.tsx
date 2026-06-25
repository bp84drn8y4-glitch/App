import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';

// Asset logo imports
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [selectedRole, setSelectedRole] = useState<'employee' | 'admin' | 'customer'>('employee');
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedBusiness(null);
    setUsername('');
    setSelectedRole('employee');
  };

  // Phase 1: Login Screen (Uses the verified Database Logic)
  if (!isLoggedIn) {
    return (
      <Login onLoginSuccess={(user) => {
        setUsername(user.username);
        setSelectedRole(user.role as 'employee' | 'admin' | 'customer');
        
        // SECURITY: If employee, lock them to their assigned business immediately.
        // This prevents them from ever seeing the business selection screen.
        if (user.role === 'employee') {
          setSelectedBusiness(user.businessId);
        }
        
        setIsLoggedIn(true);
      }} />
    );
  }

  // Phase 2: Admins/Customers need to select a business
  if (!selectedBusiness) {
    return (
      <div style={styles.portalContainer}>
        <div style={styles.topBar}>
          <button style={styles.topBarButton} onClick={handleLogout}>Abmelden</button>
        </div>
        <div style={styles.portalHeader}>
          <h1>Unternehmensbereich wählen</h1>
          <p>Angemeldet als: <strong>{selectedRole}</strong></p>
        </div>
        <div style={styles.portalGrid}>
          {businesses.map((biz) => (
            <button key={biz.id} onClick={() => setSelectedBusiness(biz.id)} style={styles.portalCard}>
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

  // Phase 3: Dashboard
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
