import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client Connection
const SUPABASE_URL = "https://hichuaezkyuvdaovyrlh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpY2h1YWV6a3l1dmRhb3Z5cmxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1OTQ4MjQsImV4cCI6MjA5NzE3MDgyNH0.u5HKNlUESD9mKMszhVOH2NChBNEiB-rPV0tGkFn-wt0";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface DashboardProps {
  userRole: 'employee' | 'admin' | 'customer';
  username: string;
  businessId: string;
  onLogout: () => void;
  onBackToPortal: () => void;
}

interface MaterialRowState {
  name: string;
  specification: string;
  ordered: number;
  returned: number;
}

interface SubmittedRecord {
  id: string;
  employee: string;
  date: string;
  customer: string;
  startTime: string;
  endTime: string;
  tasks: string[];
  materials: { name: string; ordered: number; returned: number }[];
  notes: string;
}

interface UserProfile {
  id: string;
  username: string;
  role: 'employee' | 'admin' | 'customer';
  businessId: string;
}

// Global localization matrices including dynamic translation slots for dropdown components
const translations: Record<string, any> = {
  de: {
    dashboardTitle: 'Arbeitsbereich', backBtn: '← Zurück zur Übersicht', logoutBtn: 'Abmelden', userLabel: 'Nutzer', navEntry: 'Datenerfassung', navRecords: 'Tagesübersicht', navMonthly: 'Monatsübersicht', navUsers: 'Mitarbeiter verwalten', navSettings: 'Einstellungen', headerData: 'Arbeitszeit & Material erfassen', headerRecords: 'Meine erfassten Tagesberichte', headerMonthly: 'Monatliche Arbeitsstunden', headerUsers: 'Neuen Mitarbeiter anlegen', headerSettings: 'Systemeinstellungen', labelCustomer: 'Kunde / Objekt', selectCustomerPlaceholder: '-- Bitte wählen --', labelDate: 'Datum', labelStart: 'Arbeitsbeginn', labelEnd: 'Arbeitsende', sectionTasks: 'Durchgeführte Arbeiten', sectionMaterials: 'Materialverbrauch & Rückgabe', matNameHeader: 'Materialbezeichnung', matSpecHeader: 'Spezifikation', matOrderedHeader: 'Mitgenommen', matReturnedHeader: 'Retoure', labelNotes: 'Zusätzliche Notizen / Bemerkungen', submitBtn: 'Bericht abschicken & Speichern', successMessage: 'Bericht erfolgreich gespeichert!', columnId: 'ID', columnEmployee: 'Mitarbeiter', columnDate: 'Datum', columnCustomer: 'Kunde', columnTime: 'Zeitraum', columnHours: 'Stunden', columnTasks: 'Arbeiten', columnMaterials: 'Material', columnNotes: 'Notizen', noRecords: 'Keine Berichte erfasst.', totalHours: 'Gesamte Arbeitsstunden dieses Monats', filterAllEmployees: 'Alle Mitarbeiter', filterAllCustomers: 'Alle Kunden', placeholderUsername: 'Benutzername', placeholderPassword: 'Passwort', labelRole: 'Rolle', labelBusinessId: 'Betriebsnummer', btnCreateUser: 'Mitarbeiter Account erstellen', langLabel: 'Systemsprache wählen', adminLogTitle: 'System-Aktivitätsprotokoll'
  },
  en: {
    dashboardTitle: 'Workspace', backBtn: '← Back to Portal', logoutBtn: 'Log Out', userLabel: 'User', navEntry: 'Data Entry', navRecords: 'Daily Log', navMonthly: 'Monthly Overview', navUsers: 'Manage Staff', navSettings: 'Settings', headerData: 'Record Time & Materials', headerRecords: 'My Daily Submitted Logs', headerMonthly: 'Monthly Work Hours Summary', headerUsers: 'Create Staff Accounts', headerSettings: 'System Settings', labelCustomer: 'Customer / Facility', selectCustomerPlaceholder: '-- Select a client --', labelDate: 'Date', labelStart: 'Start Time', labelEnd: 'End Time', sectionTasks: 'Performed Tasks & Cleaning Operations', sectionMaterials: 'Material Logs & Dynamic Quantities', matNameHeader: 'Material Name', matSpecHeader: 'Specification', matOrderedHeader: 'Taken out', matReturnedHeader: 'Returned', labelNotes: 'Additional Notes / Comments', submitBtn: 'Submit Log & Save to Database', successMessage: 'Record saved securely!', columnId: 'ID', columnEmployee: 'Employee', columnDate: 'Date', columnCustomer: 'Customer', columnTime: 'Time Window', columnHours: 'Hours', columnTasks: 'Tasks', columnMaterials: 'Materials', columnNotes: 'Notes', noRecords: 'No records matching criteria.', totalHours: 'Total Accumulative Hours for Month', filterAllEmployees: 'All Staff Members', filterAllCustomers: 'All Corporate Clients', placeholderUsername: 'Username String', placeholderPassword: 'Secure Password', labelRole: 'System Access Role', labelBusinessId: 'Business Code', btnCreateUser: 'Provision Staff Credentials', langLabel: 'Choose interface system language', adminLogTitle: 'System Activity Audit Log'
  }
};

export default function Dashboard({ userRole, username, businessId, onLogout, onBackToPortal }: DashboardProps) {
  const [language, setLanguage] = useState('de');
  const t = translations[language] || translations['de'];
  const isRTL = language === 'ar' || language === 'he';

  const [activeTab, setActiveTab] = useState<'entry' | 'records' | 'monthly' | 'users' | 'settings'>(
    userRole === 'admin' ? 'records' : 'entry'
  );

  // Layout navigation state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // App Master Record State linked directly to Supabase table
  const [allRecords, setAllRecords] = useState<SubmittedRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  // Form State Fields
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [workDate, setWorkDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('16:00');
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Core task checklists - tailored for Commercial Cleaning (Fensterreinigung, Glasreinigung, Unterhaltsreinigung)
  const [tasksList, setTasksList] = useState([
    { id: 't1', labelDe: 'Unterhaltsreinigung (Büroräume, Sanitäre Anlagen, Flure)', labelEn: 'Maintenance Cleaning (Offices, Restrooms, Corridors)', checked: false },
    { id: 't2', labelDe: 'Glas- und Fensterreinigung mit Glasrahmenpflege', labelEn: 'Glass & Window Cleaning including frame maintenance', checked: false },
    { id: 't3', labelDe: 'Fassadenreinigung & Außenanlagenpflege', labelEn: 'Facade Cleaning & Exterior grounds upkeep', checked: false },
    { id: 't4', labelDe: 'Grundreinigung & Hartbodenbeschichtung / Versiegelung', labelEn: 'Deep Cleaning & Hard floor stripping / sealing', checked: false },
    { id: 't5', labelDe: 'Teppichbodenreinigung (Sprühexperiment / Schampunieren)', labelEn: 'Carpet Deep Extraction Cleaning', checked: false },
    { id: 't6', labelDe: 'Baureinigung (Zwischenreinigung oder finale Bauendreinigung)', labelEn: 'Construction Site Cleaning (Progressive or Final handover)', checked: false },
    { id: 't7', labelDe: 'Sonderreinigung / Desinfektionsmaßnahmen', labelEn: 'Specialized Disinfection Operations', checked: false }
  ]);

  // Dynamic Materials List Configuration matching company operations inventory rows
  const [materialsRows, setMaterialsRows] = useState<MaterialRowState[]>([
    { name: 'Glasreiniger Konzentrat (Profi)', specification: '1L Flasche', ordered: 0, returned: 0 },
    { name: 'Allzweckreiniger / Neutralreiniger', specification: '10L Kanister', ordered: 0, returned: 0 },
    { name: 'Sanitärreiniger (Säurebasiert)', specification: '1L Flasche', ordered: 0, returned: 0 },
    { name: 'Mikrofasertücher (Blau - Unterhalt)', specification: 'Packung 10 Stk', ordered: 0, returned: 0 },
    { name: 'Mikrofasertücher (Rot - Sanitär)', specification: 'Packung 10 Stk', ordered: 0, returned: 0 },
    { name: 'Fensterleder / Einwascher-Bezug', specification: 'Stück', ordered: 0, returned: 0 },
    { name: 'Gummi-Ersatzlippe für Wischer', specification: '35cm Standard', ordered: 0, returned: 0 },
    { name: 'Müllsäcke LDPE (Blau)', specification: 'Rolle 25 Stk / 120L', ordered: 0, returned: 0 }
  ]);

  // Manage Users Administrative State Array
  const [systemUsers, setSystemUsers] = useState<UserProfile[]>([
    { id: 'u1', username: 'samadhi', role: 'admin', businessId: '10045' },
    { id: 'u2', username: 'cleaner1', role: 'employee', businessId: '10045' }
  ]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'employee' | 'admin' | 'customer'>('employee');

  // Filter Search Configurations for viewports
  const [filterEmployee, setFilterEmployee] = useState('');
  const [filterCustomer, setFilterCustomer] = useState('');

  // Fetch records from Supabase on launch
  const fetchRecordsFromSupabase = async () => {
    setLoadingRecords(true);
    try {
      const { data, error } = await supabase
        .from('tracking_records')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      if (data) {
        // Map database naming properties cleanly into frontend structures
	const formatted: SubmittedRecord[] = data.map((row: any) => ({
          id: row.id,
          employee: row.employee,
          date: row.date,
          customer: row.customer,
          startTime: row.start_time,
          endTime: row.end_time,
          tasks: row.tasks,
          materials: row.materials,
          notes: row.notes || ''
        }));
        setAllRecords(formatted);
      }
    } catch (err) {
      console.error("Error fetching rows from Supabase container instance:", err);
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    fetchRecordsFromSupabase();
  }, []);

  // Form check submission execution calling dynamic endpoints on Supabase client setup
  const handleSubmitLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) {
      alert(language === 'en' ? 'Please choose a target corporate customer site.' : 'Bitte wählen Sie einen Kunden aus.');
      return;
    }

    const completedTasksStrings = tasksList
      .filter(t => t.checked)
      .map(t => language === 'en' ? t.labelEn : t.labelDe);

    const activeMaterialsRecords = materialsRows
      .filter(m => m.ordered > 0 || m.returned > 0)
      .map(m => ({
        name: m.name,
        ordered: Number(m.ordered),
        returned: Number(m.returned)
      }));

    const newLogItem = {
      id: 'REC-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      employee: username,
      date: workDate,
      customer: selectedCustomer,
      start_time: startTime,
      end_time: endTime,
      tasks: completedTasksStrings,
      materials: activeMaterialsRecords,
      notes: notes
    };

    try {
      const { error } = await supabase
        .from('tracking_records')
        .insert([newLogItem]);

      if (error) throw error;

      // Reset state configurations cleanly on successful injection metrics
      setShowSuccess(true);
      setSelectedCustomer('');
      setNotes('');
      setTasksList(prev => prev.map(t => ({ ...t, checked: false })));
      setMaterialsRows(prev => prev.map(m => ({ ...m, ordered: 0, returned: 0 })));
      
      // Refresh list seamlessly
      fetchRecordsFromSupabase();
      
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (err) {
      console.error("Error writing records up into Supabase database cluster table:", err);
      alert("Database Write Failed. Please verify network boundaries.");
    }
  };

  const handleCreateUserAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) return;
    const newProfile: UserProfile = {
      id: 'USR-' + Date.now(),
      username: newUsername,
      role: newRole,
      businessId: businessId
    };
    setSystemUsers([...systemUsers, newProfile]);
    setNewUsername('');
    setNewPassword('');
    alert(`Account user [${newUsername}] configured locally.`);
  };

  const toggleTaskCheckboxElement = (id: string) => {
    setTasksList(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleMaterialCountMutation = (index: number, key: 'ordered' | 'returned', textVal: string) => {
    const parsedValue = parseInt(textVal, 10) || 0;
    setMaterialsRows(prev => {
      const cloned = [...prev];
      cloned[index] = { ...cloned[index], [key]: parsedValue >= 0 ? parsedValue : 0 };
      return cloned;
    });
  };

  const calculateHoursMetricDifference = (start: string, end: string): number => {
    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);
    if (isNaN(sH) || isNaN(eH)) return 0;
    const minutesDelta = (eH * 60 + eM) - (sH * 60 + sM);
    return minutesDelta > 0 ? parseFloat((minutesDelta / 60).toFixed(2)) : 0;
  };

  const calculateTotalFilteredHours = (): number => {
    return allRecords
      .filter(r => (filterEmployee ? r.employee === filterEmployee : true))
      .filter(r => (filterCustomer ? r.customer === filterCustomer : true))
      .reduce((sum, item) => sum + calculateHoursMetricDifference(item.startTime, item.endTime), 0);
  };

  // Filter logical sets depending on administrative configuration levels
  const viewableRecords = allRecords.filter(row => {
    if (userRole === 'employee' && row.employee !== username) return false;
    if (filterEmployee && row.employee !== filterEmployee) return false;
    if (filterCustomer && row.customer !== filterCustomer) return false;
    return true;
  });

  const distinctiveEmployeeStrings = Array.from(new Set(allRecords.map(r => r.employee)));
  const customerListMatrix = ['Gewerbepark Pleiskirchen KG', 'Zahnarztpraxis Dr. Fürst', 'Grundschule Pfarrkirchen Campus', 'Edeka Markt Filiale Süd', 'Autohaus Müller Showroom', 'Sparkasse Head Office'];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', fontFamily: 'sans-serif', backgroundColor: '#f1f5f9', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
      
      {/* MOBILE TRIGGER INLINE STYLESHEET INJECTION BLOCK */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .responsive-sidebar {
            position: fixed !important;
            top: 0;
            bottom: 0;
            left: ${isRTL ? 'auto' : '0'} !important;
            right: ${isRTL ? '0' : 'auto'} !important;
            width: 280px !important;
            height: 100vh !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            transform: ${isSidebarOpen ? 'translateX(0)' : isRTL ? 'translateX(100%)' : 'translateX(-100%)'} !important;
            z-index: 10000 !important;
            transition: transform 0.3s ease-in-out !important;
            box-shadow: 4px 0 15px rgba(0,0,0,0.2) !important;
            background-color: #ffffff !important;
          }
          .sidebar-close-btn {
            display: block !important;
            position: absolute !important;
            top: 16px !important;
            right: 16px !important;
            background: #f1f5f9 !important;
            border: none !important;
            border-radius: 50% !important;
            width: 36px !important;
            height: 36px !important;
            cursor: pointer !important;
            font-size: 16px !important;
            font-weight: bold !important;
            color: #334155 !important;
            z-index: 10001 !important;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1) !important;
          }
          .mobile-trigger-header-btn {
            display: block !important;
          }
          form[onSubmit] {
            display: flex !important;
            flex-direction: column !important;
            gap: 16px !important;
          }
          form[onSubmit] > div {
            grid-template-columns: 1fr !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 16px !important;
          }
          div[style*="display: flex"], 
          div[style*="display:flex"] {
            flex-direction: column !important;
          }
          input, select, textarea, button {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
        }
      `}} />

      {/* Backdrop overlay layout block to capture close actions instantly */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      {/* SIDEBAR NAVIGATION MENU */}
      <nav className="responsive-sidebar" style={{ width: '260px', backgroundColor: '#0f172a', color: '#cbd5e1', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '24px', borderRight: '1px solid #1e293b' }}>
        <button className="sidebar-close-btn" style={{ display: 'none' }} onClick={() => setIsSidebarOpen(false)}>✕</button>
        
        <div>
          <h1 style={{ color: '#fff', fontSize: '1.2rem', margin: 0, fontWeight: 'bold', letterSpacing: '0.5px' }}>Fürst Hauser</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Gebäudereinigung</p>
        </div>

        <div style={{ padding: '12px', backgroundColor: '#1e293b', borderRadius: '6px', fontSize: '0.85rem' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{t.userLabel}:</div>
          <div style={{ color: '#fff', fontWeight: 'bold', marginTop: '2px' }}>{username}</div>
          <div style={{ display: 'inline-block', marginTop: '6px', padding: '2px 6px', backgroundColor: '#334155', borderRadius: '4px', fontSize: '0.7rem', color: '#38bdf8', textTransform: 'uppercase' }}>{userRole}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {userRole !== 'admin' && (
            <button onClick={() => { setActiveTab('entry'); setIsSidebarOpen(false); }} style={{ width: '100%', textAlign: isRTL ? 'right' : 'left', padding: '12px', borderRadius: '6px', border: 'none', background: activeTab === 'entry' ? '#1e293b' : 'transparent', color: activeTab === 'entry' ? '#fff' : '#94a3b8', fontSize: '0.95rem', cursor: 'pointer', fontWeight: activeTab === 'entry' ? 'bold' : 'normal' }}>
              📝 {t.navEntry}
            </button>
          )}
          <button onClick={() => { setActiveTab('records'); setIsSidebarOpen(false); }} style={{ width: '100%', textAlign: isRTL ? 'right' : 'left', padding: '12px', borderRadius: '6px', border: 'none', background: activeTab === 'records' ? '#1e293b' : 'transparent', color: activeTab === 'records' ? '#fff' : '#94a3b8', fontSize: '0.95rem', cursor: 'pointer', fontWeight: activeTab === 'records' ? 'bold' : 'normal' }}>
            📋 {t.navRecords}
          </button>
          <button onClick={() => { setActiveTab('monthly'); setIsSidebarOpen(false); }} style={{ width: '100%', textAlign: isRTL ? 'right' : 'left', padding: '12px', borderRadius: '6px', border: 'none', background: activeTab === 'monthly' ? '#1e293b' : 'transparent', color: activeTab === 'monthly' ? '#fff' : '#94a3b8', fontSize: '0.95rem', cursor: 'pointer', fontWeight: activeTab === 'monthly' ? 'bold' : 'normal' }}>
            📊 {t.navMonthly}
          </button>
          {userRole === 'admin' && (
            <button onClick={() => { setActiveTab('users'); setIsSidebarOpen(false); }} style={{ width: '100%', textAlign: isRTL ? 'right' : 'left', padding: '12px', borderRadius: '6px', border: 'none', background: activeTab === 'users' ? '#1e293b' : 'transparent', color: activeTab === 'users' ? '#fff' : '#94a3b8', fontSize: '0.95rem', cursor: 'pointer', fontWeight: activeTab === 'users' ? 'bold' : 'normal' }}>
              👥 {t.navUsers}
            </button>
          )}
          <button onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }} style={{ width: '100%', textAlign: isRTL ? 'right' : 'left', padding: '12px', borderRadius: '6px', border: 'none', background: activeTab === 'settings' ? '#1e293b' : 'transparent', color: activeTab === 'settings' ? '#fff' : '#94a3b8', fontSize: '0.95rem', cursor: 'pointer', fontWeight: activeTab === 'settings' ? 'bold' : 'normal' }}>
            ⚙️ {t.navSettings}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '15px', borderTop: '1px solid #1e293b' }}>
          <button onClick={onBackToPortal} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: 'transparent', color: '#94a3b8', fontSize: '0.85rem', cursor: 'pointer' }}>
            {t.backBtn}
          </button>
          <button onClick={onLogout} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: 'none', background: '#b91c1c', color: '#fff', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}>
            🚪 {t.logoutBtn}
          </button>
        </div>
      </nav>

      {/* CORE WORKSPACE WINDOW */}
      <div style={{ flex: 1, minWidth: 0, maxWidth: '100vw', display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', textAlign: isRTL ? 'right' : 'left' }} dir={isRTL ? 'rtl' : 'ltr'}>
        
        {/* RESPONSIVE MOBILE BAR TRIGGER NAVIGATION HEADER */}
        <header className="mobile-trigger-header-btn" style={{ display: 'none', padding: '12px 16px', backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={() => setIsSidebarOpen(true)} style={{ padding: '8px 12px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}>
              ☰ Menu
            </button>
            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.95rem' }}>Fürst Hauser</span>
          </div>
        </header>

        {/* CONTAINER SCROLL SCENARIO ELEMENT VIEWPORT */}
        <main style={{ flex: 1, padding: '16px', overflowY: 'auto', overflowX: 'hidden', width: '100%' }}>

          {/* VIEWPORT 1: CLIENT DATA ERFASSUNG */}
          {activeTab === 'entry' && userRole !== 'admin' && (
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#0f172a' }}>{t.headerData}</h2>
                <span style={{ fontSize: '0.85rem', color: '#64748b', padding: '4px 8px', backgroundColor: '#e2e8f0', borderRadius: '4px', fontWeight: 'bold' }}>ID: {businessId}</span>
              </div>

              {showSuccess && (
                <div style={{ padding: '16px', backgroundColor: '#bbf7d0', color: '#15803d', borderRadius: '6px', marginBottom: '20px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  ✓ {t.successMessage}
                </div>
              )}

              <form onSubmit={handleSubmitLog} style={{ display: 'grid', gap: '20px' }}>
                
                {/* Meta block grid card */}
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#334155' }}>{t.labelCustomer} *</label>
                    <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}>
                      <option value="">{t.selectCustomerPlaceholder}</option>
                      {customerListMatrix.map((cust, i) => <option key={i} value={cust}>{cust}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#334155' }}>{t.labelDate}</label>
                    <input type="date" value={workDate} onChange={(e) => setWorkDate(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#334155' }}>{t.labelStart}</label>
                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#334155' }}>{t.labelEnd}</label>
                    <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} />
                  </div>
                </div>

                {/* Operations checklists blocks */}
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '8px' }}>{t.sectionTasks}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {tasksList.map(item => (
<label key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', padding: '6px', borderRadius: '4px' }}>
                        <input type="checkbox" checked={item.checked} onChange={() => toggleTaskCheckboxElement(item.id)} style={{ marginTop: '4px', width: '18px', height: '18px' }} />
                        <span style={{ fontSize: '0.95rem', color: '#334155', lineHeight: '1.4' }}>
                          {language === 'en' ? item.labelEn : item.labelDe}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Materials management layout panels matrix container */}
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '8px' }}>{t.sectionMaterials}</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRTL ? 'right' : 'left', minWidth: '500px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '0.85rem' }}>
                        <th style={{ padding: '10px 6px' }}>{t.matNameHeader}</th>
                        <th style={{ padding: '10px 6px' }}>{t.matSpecHeader}</th>
                        <th style={{ padding: '10px 6px', width: '100px' }}>{t.matOrderedHeader}</th>
                        <th style={{ padding: '10px 6px', width: '100px' }}>{t.matReturnedHeader}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materialsRows.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem', color: '#334155' }}>
                          <td style={{ padding: '10px 6px', fontWeight: 'bold' }}>{row.name}</td>
                          <td style={{ padding: '10px 6px', color: '#64748b', fontSize: '0.8rem' }}>{row.specification}</td>
                          <td style={{ padding: '10px 6px' }}>
                            <input type="number" min="0" value={row.ordered || ''} placeholder="0" onChange={(e) => handleMaterialCountMutation(idx, 'ordered', e.target.value)} style={{ width: '70px', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', textAlign: 'center' }} />
                          </td>
                          <td style={{ padding: '10px 6px' }}>
                            <input type="number" min="0" value={row.returned || ''} placeholder="0" onChange={(e) => handleMaterialCountMutation(idx, 'returned', e.target.value)} style={{ width: '70px', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', textAlign: 'center' }} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Additional remarks and notes panel logs */}
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>{t.labelNotes}</label>
                  <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="..." style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontFamily: 'sans-serif', boxSizing: 'border-box' }} />
                </div>

                <button type="submit" style={{ width: '100%', padding: '16px', borderRadius: '8px', border: 'none', backgroundColor: '#0284c7', color: '#fff', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(2,132,199,0.15)' }}>
                  💾 {t.submitBtn}
                </button>

              </form>
            </div>
          )}

          {/* VIEWPORT 2: DATA LOG PREVIEWS */}
          {activeTab === 'records' && (
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
              <h2 style={{ marginBottom: '20px', color: '#0f172a' }}>{t.headerRecords}</h2>

              {/* Administrative analytical filtering systems row */}
              {userRole === 'admin' && (
                <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <select value={filterEmployee} onChange={(e) => setFilterEmployee(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                      <option value="">👤 {t.filterAllEmployees}</option>
                      {distinctiveEmployeeStrings.map((emp, i) => <option key={i} value={emp}>{emp}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <select value={filterCustomer} onChange={(e) => setFilterCustomer(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                      <option value="">🏢 {t.filterAllCustomers}</option>
                      {customerListMatrix.map((cust, i) => <option key={i} value={cust}>{cust}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {loadingRecords ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '1.1rem' }}>Loading rows from database...</div>
              ) : viewableRecords.length === 0 ? (
                <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '8px', textAlign: 'center', color: '#64748b', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  {t.noRecords}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {viewableRecords.map((rec) => {
			const hoursVal = calculateHoursMetricDifference(rec.startTime, rec.endTime);
                    return (
                      <div key={rec.id} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '4px solid #0284c7' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '12px' }}>
                          <div>
                            <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#1e293b' }}>{rec.customer}</span>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>{t.columnEmployee}: <strong>{rec.employee}</strong> | ID: {rec.id}</div>
                          </div>
                          <div style={{ textAlign: isRTL ? 'left' : 'right' }}>
                            <span style={{ padding: '4px 8px', backgroundColor: '#f1f5f9', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', color: '#334155' }}>📅 {rec.date}</span>
				<div style={{ marginTop: '6px', fontSize: '0.9rem', fontWeight: 'bold', color: '#0369a1' }}>🕒 {rec.startTime} - {rec.endTime} ({hoursVal}h)</div>
                          </div>
                        </div>

                        {rec.tasks && rec.tasks.length > 0 && (
                          <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px', textTransform: 'uppercase' }}>{t.columnTasks}:</div>
                            <ul style={{ margin: 0, paddingLeft: isRTL ? '0' : '20px', paddingRight: isRTL ? '20px' : '0', fontSize: '0.9rem', color: '#334155' }}>
                              {rec.tasks.map((tsk, i) => <li key={i} style={{ marginBottom: '2px' }}>{tsk}</li>)}
                            </ul>
                          </div>
                        )}

                        {rec.materials && rec.materials.length > 0 && (
                          <div style={{ marginBottom: '12px', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>{t.columnMaterials}:</div>
                            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                              {rec.materials.map((mat, i) => (
                                <div key={i} style={{ backgroundColor: '#fff', padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                                  <strong>{mat.name}</strong>: {t.matOrderedHeader} ({mat.ordered}) | {t.matReturnedHeader} ({mat.returned})
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {rec.notes && (
				<div style={{ fontSize: '0.9rem', color: '#475569', fontStyle: 'italic', backgroundColor: '#fffbf2', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #f59e0b' }}>
                            <strong>{t.columnNotes}:</strong> {rec.notes}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* VIEWPORT 3: MONTHLY ACCUMULATED RECORDS */}
          {activeTab === 'monthly' && (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ marginBottom: '20px', color: '#0f172a' }}>{t.headerMonthly}</h2>
              
              <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', color: '#475569', marginBottom: '10px' }}>{t.totalHours}</div>
                <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#0284c7' }}>{calculateTotalFilteredHours()} <span style={{ fontSize: '1.5rem', color: '#64748b' }}>Std</span></div>
                
                {userRole === 'admin' && (filterEmployee || filterCustomer) && (
                  <div style={{ marginTop: '15px', fontSize: '0.9rem', color: '#64748b', backgroundColor: '#f1f5f9', padding: '8px', borderRadius: '4px', display: 'inline-block' }}>
                    Filtered Parameters active metrics summary logic channels.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEWPORT 4: MANAGE USER ACCOUNTS */}
          {activeTab === 'users' && userRole === 'admin' && (
            <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              
              <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#0f172a' }}>{t.headerUsers}</h3>
                <form onSubmit={handleCreateUserAccount} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#334155' }}>{t.placeholderUsername}</label>
                    <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#334155' }}>{t.placeholderPassword}</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#334155' }}>{t.labelRole}</label>
                    <select value={newRole} onChange={(e) => setNewRole(e.target.value as any)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                      <option value="employee">Employee / Reinigungskraft</option>
                      <option value="admin">Administrator / Manager</option>
                      <option value="customer">Client Viewer</option>
                    </select>
                  </div>
                  <button type="submit" style={{ padding: '12px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}>
                    {t.btnCreateUser}
                  </button>
                </form>
              </div>

              <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#0f172a' }}>{t.navUsers} Log</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {systemUsers.map(u => (
                    <div key={u.id} style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{u.username}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ID: {u.id} | No: {u.businessId}</div>
                      </div>
                      <span style={{ padding: '2px 6px', backgroundColor: '#e2e8f0', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', color: '#334155' }}>{u.role}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* VIEWPORT 5: SETTINGS AND LOCALIZATION */}
          {activeTab === 'settings' && (
            <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', maxWidth: '500px' }}>
              <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#0f172a' }}>{t.headerSettings}</h2>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#334155' }}>{t.langLabel}</label>

		<select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 'bold', color: '#1e293b' }}>
                <option value="de">Deutsch (Deutschland)</option>
                <option value="at">Deutsch (Österreich)</option>
                <option value="en">English</option>
                <option value="es">Español (España)</option>
                <option value="es_mx">Español (México)</option>
                <option value="fr">Français</option>
                <option value="it">Italiano</option>
                <option value="uk">Українська</option>
                <option value="hi">हिन्दी (India)</option>
              </select>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}
