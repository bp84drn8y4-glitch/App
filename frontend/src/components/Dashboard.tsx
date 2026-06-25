import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initializing the Supabase Client directly with your project credentials
const supabaseUrl = 'https://hichuaezkyuvdaovyrlh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpY2h1YWV6a3l1dmRhb3Z5cmxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1OTQ4MjQsImV4cCI6MjA5NzE3MDgyNH0.u5HKNlUESD9mKMszhVOH2NChBNEiB-rPV0tGkFn-wt0';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    dashboardTitle: 'Arbeitsbereich', backBtn: '← Zurück zur Übersicht', logoutBtn: 'Abmelden', userLabel: 'Nutzer', navEntry: 'Datenerfassung', navRecords: 'Tagesübersicht', navMonthly: 'Monatsübersicht', navUsers: 'Mitarbeiter verwalten', navSettings: 'Einstellungen', headerData: 'Arbeitszeit & Material erfassen', headerRecords: 'Meine erfassten Tagesberichte', headerMonthly: 'Monatliche Arbeitsstunden', headerUsers: 'Neuen Mitarbeiter anlegen', headerSettings: 'Systemeinstellungen', labelCustomer: 'Kunde / Objekt', labelDate: 'Datum', labelStart: 'Beginn', labelEnd: 'Ende', labelTasks: 'Ausgeführte Tätigkeiten', labelNotes: 'Sonstiges / Notizen', btnAddTask: '+ Tätigkeit hinzufügen', btnSubmit: 'Eintrag Abschicken', matTitle: 'Materialverbrauch', matName: 'Materialbezeichnung', matOrdered: 'Mitgenommen', matReturned: 'Retoure', successMsg: 'Arbeitszeit erfolgreich und unveränderlich übermittelt!', adminNotice: 'Als Admin können Sie Einträge bearbeiten oder löschen.', thEmployee: 'Mitarbeiter', thHours: 'Stunden', langLabel: 'Sprachauswahl', noRecords: 'Keine Einträge für diesen Zeitraum vorhanden.', noTrackingRequired: 'Für diesen Unternehmensbereich ist keine separate Material- oder Aufgabenliste erforderlich. Bitte erfassen Sie Ihre Arbeitszeiten und Notizen unten.', lblNewUser: 'Benutzername', lblNewPass: 'Passwort', lblNewBiz: 'Zugeordnetes Unternehmen', btnCreateUser: 'Profil Erstellen', userCreatedMsg: 'Mitarbeiter-Profil erfolgreich angelegt!', thRole: 'Rolle', thBiz: 'Unternehmen', existingUsersTitle: 'Bestehende Profile im System', selectTaskPlaceholder: '-- Tätigkeit wählen --', closeMenu: '✕ Menü schließen',
    biz_fuerst_hauser_customers: ['Edeka Pocking', 'Gewerbepark Pleiskirchen', 'Rathaus Altötting', 'Klinikum Burghausen'],
    biz_fuerst_hauser_tasks: ['Außenreinigung Schaufenster und Eingangstüren', 'Innenreinigung Schaufenster und Eingangstüren', 'Beidseitige Reinigung von Glasflächen im Verkaufsbereich', 'Beidseitige Reinigung von Glasflächen im Mitarbeiterbereich', 'Zusätzliche Innenreinigung von Schaufenstern zu Dekorationsterminen mit zusätzlicher Anfahrt', 'Zusätzliche Innenreinigung von Schaufenstern zu Dekorationsterminen in Verbindung mit regelmäßiger Glasreinigung ohne zusätzliche Anfahrt', 'Reinigung von Spiegeln', 'Sonderleistungen und Sonstiges'],
    biz_fuerst_hauser_materials: [{n:'Müllbeutel Groß',s:'120 L'},{n:'Müllbeutel Medium',s:'60 L'},{n:'Müllbeutel Klein',s:'28 L'},{n:'Wischmopp Mikrofaser',s:'50 cm'},{n:'Wischmopp Baumwolle',s:'50 cm'},{n:'Mikrofaser Lappen rot',s:'40 x 40 cm'},{n:'Mikrofaser Lappen blau',s:'40 x 40 cm'},{n:'Mikrofaser Lappen grün',s:'40 x 40 cm'},{n:'Mikrofaser Lappen gelb',s:'40 x 40 cm'},{n:'Geschirrtücher',s:'70 x 50 cm'},{n:'Sanitärreiniger Milizid',s:'Sprühflasche'},{n:'Bodenreiniger Torrun',s:'Konzentrat'},{n:'Oberflächenreiniger',s:'Gebrauchsfertig'},{n:'Toilettenpapier',s:'Lagenware'},{n:'Falthandtücher',s:'Papier'},{n:'Handseife',s:'10 L Kanister'}],
    biz_bullauge_customers: ['Münchner Str. Filiale', 'Hauptbahnhof Express', 'Uni-Viertel Salon'],
    biz_bullauge_tasks: ['Maschinenreinigung', 'Kassenabrechnung', 'Flusensiebe leeren', 'Boden wischen & desinfizieren', 'Wäschepflege & Bügeln'],
    biz_bullauge_materials: [{n:'Handfolien',s:'Standard'},{n:'Bügelstärke',s:'Sprühflasche'},{n:'Chlor',s:'Bleichmittel'},{n:'Waschpulver',s:'20 kg'},{n:'Weichspüler',s:'20 L'},{n:'Sonstiges',s:'Verbrauchsmaterial'}]
  },
  en: {
    dashboardTitle: 'Workspace', backBtn: '← Back to Portal', logoutBtn: 'Logout', userLabel: 'User', navEntry: 'Data Entry', navRecords: 'Daily Log', navMonthly: 'Monthly Hours', navUsers: 'Manage Staff', navSettings: 'Settings', headerData: 'Log Hours & Materials', headerRecords: 'My Daily Records', headerMonthly: 'Monthly Worked Hours', headerUsers: 'Create New Employee Profile', headerSettings: 'System Settings', labelCustomer: 'Customer / Property', labelDate: 'Date', labelStart: 'Start Time', labelEnd: 'End Time', labelTasks: 'Executed Tasks', labelNotes: 'Miscellaneous / Notes', btnAddTask: '+ Add Task Line', btnSubmit: 'Submit Entry', matTitle: 'Material Tracking', matName: 'Material Name', matOrdered: 'Taken Out', matReturned: 'Returned', successMsg: 'Data logged successfully! Record is now locked.', adminNotice: 'Admin Mode: Editing and deletion rights granted.', thEmployee: 'Employee', thHours: 'Hours', langLabel: 'Select Language', noRecords: 'No tracking records found for this scope.', noTrackingRequired: 'No dedicated material or task lists are required for this business unit. Please log your working hours and notes below.', lblNewUser: 'Username', lblNewPass: 'Password', lblNewBiz: 'Assigned Business Unit', btnCreateUser: 'Create Profile', userCreatedMsg: 'Employee profile created successfully!', thRole: 'Role', thBiz: 'Business Scope', existingUsersTitle: 'Active System User Profiles', selectTaskPlaceholder: '-- Select Task --', closeMenu: '✕ Close Menu',
    biz_fuerst_hauser_customers: ['Edeka Pocking Branch', 'Pleiskirchen Business Park', 'Altötting Town Hall', 'Burghausen Clinic'],
    biz_fuerst_hauser_tasks: ['Exterior window & entrance door cleaning', 'Interior window & entrance door cleaning', 'Double-sided glass surface cleaning in sales area', 'Double-sided glass surface cleaning in staff area', 'Additional interior window cleaning for decoration dates with extra transit', 'Additional interior window cleaning for decoration dates combined with standard scheduling', 'Mirror surface cleaning', 'Special operational requests / Miscellaneous'],
    biz_fuerst_hauser_materials: [{n:'Trash Bag Large',s:'120 L'},{n:'Trash Bag Medium',s:'60 L'},{n:'Trash Bag Small',s:'28 L'},{n:'Microfiber Mop Head',s:'50 cm'},{n:'Cotton Mop Head',s:'50 cm'},{n:'Microfiber Cloth Red',s:'40 x 40 cm'},{n:'Microfiber Cloth Blue',s:'40 x 40 cm'},{n:'Microfiber Cloth Green',s:'40 x 40 cm'},{n:'Microfiber Cloth Yellow',s:'40 x 40 cm'},{n:'Kitchen Towels',s:'70 x 50 cm'},{n:'Sanitary Cleaner Milizid',s:'Spray Bottle'},{n:'Floor Cleaner Torrun',s:'Concentrate'},{n:'Surface Cleaner',s:'Ready-to-use'},{n:'Toilet Paper Rolls',s:'Layered'},{n:'Folded Paper Hand Towels',s:'Paper'},{n:'Liquid Hand Soap',s:'10 L Canister'}],
    biz_bullauge_customers: ['Münchner Str. Station', 'Central Station Express', 'University District Salon'],
    biz_bullauge_tasks: ['Washing machine clean', 'Register cash reconciliation', 'Empty lint traps', 'Floor mopping & disinfection', 'Laundry care & garment ironing'],
    biz_bullauge_materials: [{n:'Plastic Wrap Handrolls',s:'Standard'},{n:'Spray Starch',s:'Spray Bottle'},{n:'Chlorine Bleach',s:'Bleaching Agent'},{n:'Detergent Powder',s:'20 kg'},{n:'Fabric Softener',s:'20 L'},{n:'Miscellaneous Items',s:'Consumable Material'}]
  }
};

const BUSINESS_DATA: Record<string, { label: string; requiresDetailedTracking: boolean }> = {
  fuerst_hauser: { label: 'Fürst Hauser Gebäudereinigung', requiresDetailedTracking: true },
  bullauge: { label: 'Bullauge Waschsalon', requiresDetailedTracking: true },
  hauser_mittel: { label: 'Hauser Reinigungsmittel', requiresDetailedTracking: false },
  signature_vista: { label: 'Signature Vista', requiresDetailedTracking: false }
};

export function Dashboard({ userRole, username, businessId, onLogout, onBackToPortal }: DashboardProps) {
  const scopeConfig = BUSINESS_DATA[businessId] || BUSINESS_DATA.fuerst_hauser;

  const [activeTab, setActiveTab] = useState<'entry' | 'records' | 'monthly' | 'users' | 'settings'>('entry');
  const [language, setLanguage] = useState<string>('de');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  
  const t = translations[language] || translations.de;
  const isRTL = language === 'ar';

  const currentCustomers: string[] = t[`biz_${businessId}_customers`] || t.biz_fuerst_hauser_customers || [];
  const currentTasks: string[] = t[`biz_${businessId}_tasks`] || t.biz_fuerst_hauser_tasks || [];
  const rawMaterials: any[] = t[`biz_${businessId}_materials`] || t.biz_fuerst_hauser_materials || [];

  // Form Inputs State
  const [customer, setCustomer] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('16:00');
  const [selectedTasks, setSelectedTasks] = useState<string[]>(['']);
  const [miscellaneous, setMiscellaneous] = useState('');
  const [formStatus, setFormStatus] = useState<string | null>(null);

  // New Profile Form State (Admin Only)
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newBusinessScope, setNewBusinessScope] = useState('fuerst_hauser');
  const [userSuccessStatus, setUserSuccessStatus] = useState<string | null>(null);

  // Dynamic Material Counter Rows State
  const [materialRows, setMaterialRows] = useState<MaterialRowState[]>([]);

  // Persistent Real Database Records Hook
  const [allRecords, setAllRecords] = useState<SubmittedRecord[]>([]);
  const [systemUsers, setSystemUsers] = useState<UserProfile[]>([
    { id: '1', username: 'admin', role: 'admin', businessId: 'fuerst_hauser' }
  ]);

  // EFFECT 1: Fetch live entries from Supabase upon initialization
  useEffect(() => {
    const fetchDatabaseRecords = async () => {
      try {
        let query = supabase.from('tracking_records').select('*').order('date', { ascending: false });
        
        // Filter out records so non-admins only see their own logged updates
        if (userRole !== 'admin') {
          query = query.ilike('employee', username);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Database connection error fetching data rows:', error);
          return;
        }

        if (data) {
          // Map database row parameters (snake_case) to typescript local template properties (camelCase)
          const mappedRecords: SubmittedRecord[] = data.map((row: any) => ({
            id: row.id?.toString() || `rec-${Math.random()}`,
            employee: row.employee || '',
            date: row.date || '',
            customer: row.customer || '',
            startTime: row.start_time || '',
            endTime: row.end_time || '',
            tasks: Array.isArray(row.tasks) ? row.tasks : [],
            materials: Array.isArray(row.materials) ? row.materials : [],
            notes: row.notes || ''
          }));
          setAllRecords(mappedRecords);
        }
      } catch (err) {
        console.error('Unhandled dashboard sync error:', err);
      }
    };

    fetchDatabaseRecords();
  }, [username, userRole, businessId, activeTab]);

  // Sync material item default counters context configuration variations
  useEffect(() => {
    if (scopeConfig.requiresDetailedTracking) {
      const rows = rawMaterials.map(m => ({
        name: m.n,
        specification: m.s,
        ordered: 0,
        returned: 0
      }));
      setMaterialRows(rows);
      setCustomer(currentCustomers[0] || '');
      setSelectedTasks(['']);
    } else {
      setMaterialRows([]);
      setCustomer('');
      setSelectedTasks([]);
    }
  }, [businessId, language]); 

  // SUBMIT HANDLER: Writes cleanly directly to your tracking_records table
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const recordPayload = {
      employee: username || 'Mitarbeiter',
      date,
      customer: scopeConfig.requiresDetailedTracking ? customer : 'Standardbetrieb',
      start_time: startTime,
      end_time: endTime,
      tasks: scopeConfig.requiresDetailedTracking ? selectedTasks.filter(tk => tk !== '') : ['Allgemeine Betriebstätigkeiten'],
      materials: scopeConfig.requiresDetailedTracking 
        ? materialRows.filter(r => r.ordered > 0 || r.returned > 0).map(r => ({ name: r.name, ordered: r.ordered, returned: r.returned }))
        : [],
      notes: miscellaneous
    };

    try {
      const { data, error } = await supabase
        .from('tracking_records')
        .insert([recordPayload])
        .select();

      if (error) {
        console.error('Supabase write request error structure:', error);
        alert(`Fehler beim Speichern: ${error.message}`);
        return;
      }

      setFormStatus(t.successMsg);
      setMiscellaneous('');

      if (scopeConfig.requiresDetailedTracking) {
        setSelectedTasks(['']);
        const resetRows = rawMaterials.map(m => ({ name: m.n, specification: m.s, ordered: 0, returned: 0 }));
        setMaterialRows(resetRows);
      }

      // Force-refresh tab list locally immediately on successful creation loop completion
      if (data && data[0]) {
        const freshRow: SubmittedRecord = {
          id: data[0].id?.toString(),
          employee: data[0].employee,
          date: data[0].date,
          customer: data[0].customer,
          startTime: data[0].start_time,
          endTime: data[0].end_time,
          tasks: data[0].tasks,
          materials: data[0].materials,
          notes: data[0].notes
        };
        setAllRecords(prev => [freshRow, ...prev]);
      }

      setTimeout(() => setFormStatus(null), 5000);
    } catch (err) {
      console.error('Network failure writing tracking row payload:', err);
    }
  };

  // ADMIN ACTION: Handles entry row deletion inside database sequence
  const handleDeleteRecord = async (idToDelete: string) => {
    if (!window.confirm('Eintrag wirklich unwiderruflich löschen?')) return;

    try {
      const { error } = await supabase
        .from('tracking_records')
        .delete()
        .eq('id', idToDelete);

      if (error) {
        console.error('Error executing delete operation parameters:', error);
        alert(`Löschfehler: ${error.message}`);
      } else {
        setAllRecords(prev => prev.filter(r => r.id !== idToDelete));
      }
    } catch (err) {
      console.error('Exception on query removal loop:', err);
    }
  };

    const handleCreateUser = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!newUsername.trim() || !newPassword.trim()) {
    alert("Bitte füllen Sie alle Felder aus.");
    return;
  }

  try {
    // 1. Insert directly into your Supabase 'users' table
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          username: newUsername,
          password: newPassword,
          role: 'employee',
          businessId: newBusinessScope // Links the profile to the assigned company dropdown value
        }
      ])
      .select();

    if (error) {
      alert(`Fehler beim Speichern in der Datenbank: ${error.message}`);
      return;
    }

    // 2. If successful, push it to local state so the table updates instantly on screen
    if (data && data.length > 0) {
      setSystemUsers([...systemUsers, data[0]]);
      setUserSuccessStatus(t.userCreatedMsg);
      
      // Clear input fields
      setNewUsername('');
      setNewPassword('');
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
};


  const adjustMaterial = (idx: number, type: 'ordered' | 'returned', step: number) => {
    setMaterialRows(prev => prev.map((row, i) => {
      if (i !== idx) return row;
      const val = Math.max(0, row[type] + step);
      return { ...row, [type]: val };
    }));
  };

  const handleTaskRowChange = (idx: number, val: string) => {
    setSelectedTasks(prev => {
      const arr = [...prev];
      arr[idx] = val;
      return arr;
    });
  };

  const calculateHours = (start: string, end: string) => {
    if (!start || !end) return '0.00';
    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);
    const deltaMin = (eH * 60 + eM) - (sH * 60 + sM);
    return deltaMin > 0 ? (deltaMin / 60).toFixed(2) : '0.00';
  };

  const handleNavClick = (tab: 'entry' | 'records' | 'monthly' | 'users' | 'settings') => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

// ==========================================
  // PUSH THIS GROUPS CODE RIGHT HERE (ABOVE THE RETURN)
  // ==========================================
  const getMonthLabel = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  };

  const getMonthlyHoursGrouped = () => {
    const groups: { [key: string]: { employee: string; monat: string; stunden: number } } = {};

    allRecords.forEach((r) => {
      const monatLabel = getMonthLabel(r.date); 
      const employeeKey = r.employee;
      const uniqueGroupKey = `${monatLabel}_${employeeKey}`;
      const hours = parseFloat(calculateHours(r.startTime, r.endTime)) || 0;

      if (!groups[uniqueGroupKey]) {
        groups[uniqueGroupKey] = {
          employee: employeeKey,
          monat: monatLabel,
          stunden: 0
        };
      }
      groups[uniqueGroupKey].stunden += hours;
    });

    return Object.values(groups);
  };

  const groupedMonthlyData = getMonthlyHoursGrouped();
  // ==========================================

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', fontFamily: 'sans-serif', backgroundColor: '#f1f5f9', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .responsive-sidebar {
            position: fixed !important;
            top: 0;
            bottom: 0;
            left: ${isRTL ? 'auto' : '0'} !important;
            right: ${isRTL ? '0' : 'auto'} !important;
            width: 280px !important;
            height: 100dvh !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            transform: ${isSidebarOpen ? 'translateX(0)' : isRTL ? 'translateX(100%)' : 'translateX(-100%)'} !important;
            z-index: 10000 !important;
            transition: transform 0.3s ease-in-out !important;
            box-shadow: 4px 0 15px rgba(0,0,0,0.2) !important;
            background-color: #0f172a !important;
          }

          .sidebar-close-btn {
            display: block !important;
            position: absolute !important;
            top: 16px !important;
            right: ${isRTL ? 'auto' : '16px'} !important;
            left: ${isRTL ? '16px' : 'auto'} !important;
            background: #1e293b !important;
            border: none !important;
            border-radius: 50% !important;
            width: 36px !important;
            height: 36px !important;
            cursor: pointer !important;
            font-size: 16px !important;
            font-weight: bold !important;
            color: #cbd5e1 !important;
            z-index: 10001 !important;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;
          }

          .mobile-trigger-header-btn {
            display: block !important;
          }

          form[onSubmit], .admin-grid-layout {
            display: flex !important;
            flex-direction: column !important;
            gap: 16px !important;
          }
          
          .form-flex-row {
            flex-direction: column !important;
            gap: 16px !important;
          }
          
          input, select, textarea, button {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
        }
        
        @media (min-width: 769px) {
          .responsive-sidebar {
            transform: none !important;
            background-color: #0f172a !important;
          }
          .sidebar-close-btn {
            display: none !important;
          }
          .mobile-trigger-header-btn {
            display: none !important;
          }
          .admin-grid-layout {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 30px !important;
          }
        }
      `}} />

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
      <div 
        className="responsive-sidebar"
        style={{ width: '280px', padding: '20px 0', borderRight: '1px solid #334155', height: '100vh', float: isRTL ? 'right' : 'left', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#0f172a' }}
      >
        <div>
          <div style={{ padding: '0 20px 20px 20px', borderBottom: '1px solid #334155', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}>
            <button className="sidebar-close-btn" onClick={() => setIsSidebarOpen(false)} aria-label="Close menu">✕</button>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#38bdf8' }}>{scopeConfig.label}</h3>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '5px' }}>{t.dashboardTitle}</div>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 10px' }}>
            <button onClick={() => handleNavClick('entry')} style={{ width: '100%', padding: '12px 15px', textAlign: isRTL ? 'right' : 'left', backgroundColor: activeTab === 'entry' ? '#334155' : 'transparent', color: activeTab === 'entry' ? '#38bdf8' : '#cbd5e1', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              📝 {t.navEntry}
            </button>
            <button onClick={() => handleNavClick('records')} style={{ width: '100%', padding: '12px 15px', textAlign: isRTL ? 'right' : 'left', backgroundColor: activeTab === 'records' ? '#334155' : 'transparent', color: activeTab === 'records' ? '#38bdf8' : '#cbd5e1', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              📅 {t.navRecords}
            </button>
            <button onClick={() => handleNavClick('monthly')} style={{ width: '100%', padding: '12px 15px', textAlign: isRTL ? 'right' : 'left', backgroundColor: activeTab === 'monthly' ? '#334155' : 'transparent', color: activeTab === 'monthly' ? '#38bdf8' : '#cbd5e1', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              📊 {t.navMonthly}
            </button>
            {userRole === 'admin' && (
              <button onClick={() => handleNavClick('users')} style={{ width: '100%', padding: '12px 15px', textAlign: isRTL ? 'right' : 'left', backgroundColor: activeTab === 'users' ? '#334155' : 'transparent', color: activeTab === 'users' ? '#38bdf8' : '#cbd5e1', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                👥 {t.navUsers}
              </button>
            )}
            <button onClick={() => handleNavClick('settings')} style={{ width: '100%', padding: '12px 15px', textAlign: isRTL ? 'right' : 'left', backgroundColor: activeTab === 'settings' ? '#334155' : 'transparent', color: activeTab === 'settings' ? '#38bdf8' : '#cbd5e1', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              ⚙️ {t.navSettings}
            </button>
          </nav>
        </div>

        <div style={{ padding: '0 15px' }}>
          <button onClick={onBackToPortal} style={{ width: '100%', padding: '10px', backgroundColor: '#475569', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginBottom: '10px', fontSize: '0.85rem' }}>
            {t.backBtn}
          </button>
          <button onClick={onLogout} style={{ width: '100%', padding: '10px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            {t.logoutBtn}
          </button>
        </div>
      </div>

      {/* CORE WORKSPACE WINDOW */}
      <div style={{ flex: 1, minWidth: 0, maxWidth: '100vw', display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden', textAlign: isRTL ? 'right' : 'left' }} dir={isRTL ? 'rtl' : 'ltr'}>
        <header style={{ height: '60px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px' }}>
          <button className="mobile-trigger-header-btn" onClick={() => setIsSidebarOpen(true)} style={{ padding: '8px 12px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}>☰</button>
          <span style={{ fontSize: '0.9rem', color: '#64748b', marginLeft: isRTL ? 'auto' : '0', marginRight: isRTL ? '0' : 'auto', paddingLeft: isRTL ? '0' : '15px', paddingRight: isRTL ? '15px' : '0' }}>
            {t.userLabel}: <strong style={{ color: '#0f172a' }}>{username}</strong> (<span style={{ color: userRole === 'admin' ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>{userRole}</span>)
          </span>
        </header>

        <main style={{ flex: 1, padding: '16px', overflowY: 'auto', overflowX: 'hidden', width: '100%' }}>
          {formStatus && (
            <div style={{ padding: '15px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '6px', marginBottom: '20px', fontWeight: 'bold' }}>
              ✓ {formStatus}
            </div>
          )}

          {/* VIEWPORT 1: DATA LOG ENTRY FORMS */}
          {activeTab === 'entry' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#0f172a' }}>{t.headerData}</h2>
              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px', alignItems: 'start' }}>
                <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  {!scopeConfig.requiresDetailedTracking && (
                    <div style={{ padding: '12px', backgroundColor: '#eff6ff', color: '#1e40af', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem' }}>
                      ℹ️ {t.noTrackingRequired}
                    </div>
                  )}

                  {scopeConfig.requiresDetailedTracking && (
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#334155' }}>{t.labelCustomer}</label>
                      <select value={customer} onChange={(e) => setCustomer(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                        {currentCustomers.map((c, i) => <option key={i} value={c}>{c}</option>)}
                      </select>
                    </div>
                  )}

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#334155' }}>{t.labelDate}</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div className="form-flex-row" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#334155' }}>{t.labelStart}</label>
                      <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#334155' }}>{t.labelEnd}</label>
                      <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                  </div>

                  {scopeConfig.requiresDetailedTracking && (
                    <div style={{ marginBottom: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>{t.labelTasks}</label>
                      {selectedTasks.map((tRow, index) => (
                        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                          <select value={tRow} onChange={(e) => handleTaskRowChange(index, e.target.value)} required style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                            <option value="">{t.selectTaskPlaceholder}</option>
                            {currentTasks.map((taskLabel, idx) => (
                              <option key={idx} value={taskLabel}>{taskLabel}</option>
                            ))}
                          </select>
                          {selectedTasks.length > 1 && (
                            <button type="button" onClick={() => setSelectedTasks(prev => prev.filter((_, i) => i !== index))} style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>✕</button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={() => setSelectedTasks(prev => [...prev, ''])} style={{ padding: '8px 12px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', color: '#475569' }}>
                        {t.btnAddTask}
                      </button>
                    </div>
                  )}

                  <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#334155' }}>{t.labelNotes}</label>
                    <textarea value={miscellaneous} onChange={(e) => setMiscellaneous(e.target.value)} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>

                  {scopeConfig.requiresDetailedTracking && (
                    <div style={{ marginBottom: '25px', borderTop: '2px solid #f1f5f9', paddingTop: '20px' }}>
                      <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#0f172a' }}>📦 {t.matTitle}</h3>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: isRTL ? 'right' : 'left', minWidth: '300px' }}>
                          <thead>
                            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                              <th style={{ padding: '10px 6px' }}>{t.matName}</th>
                              <th style={{ padding: '10px 6px', textAlign: 'center', width: '100px' }}>{t.matOrdered}</th>
                              <th style={{ padding: '10px 6px', textAlign: 'center', width: '100px' }}>{t.matReturned}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {materialRows.map((row, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '12px 6px' }}>
                                  <div style={{ fontWeight: 'bold', color: '#334155' }}>{row.name}</div>
                                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{row.specification}</div>
                                </td>
                                <td style={{ padding: '12px 6px', textAlign: 'center' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flexDirection: 'row' }}>
                                    <button type="button" onClick={() => adjustMaterial(idx, 'ordered', -1)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                                    <span style={{ minWidth: '20px', fontWeight: 'bold', color: '#0f172a' }}>{row.ordered}</span>
                                    <button type="button" onClick={() => adjustMaterial(idx, 'ordered', 1)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                                  </div>
                                </td>
                                <td style={{ padding: '12px 6px', textAlign: 'center' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flexDirection: 'row' }}>
                                    <button type="button" onClick={() => adjustMaterial(idx, 'returned', -1)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                                    <span style={{ minWidth: '20px', fontWeight: 'bold', color: '#0f172a' }}>{row.returned}</span>
                                    <button type="button" onClick={() => adjustMaterial(idx, 'returned', 1)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 4px rgba(16,185,129,0.2)' }}>
                    🚀 {t.btnSubmit}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* VIEWPORT 2: DAILY LOGS AND RECORDS PANEL */}
          {activeTab === 'records' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#0f172a' }}>{t.headerRecords}</h2>
              {userRole === 'admin' && (
                <div style={{ padding: '10px 15px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  🛡️ {t.adminNotice}
                </div>
              )}
              {allRecords.length === 0 ? (
                <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', textAlign: 'center', color: '#64748b' }}>{t.noRecords}</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {allRecords.map((rec) => (
                    <div key={rec.id} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: isRTL ? 'none' : '4px solid #3b82f6', borderRight: isRTL ? '4px solid #3b82f6' : 'none' }}>
                      <div className="form-flex-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '15px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                        <div>
                          <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>{rec.customer}</strong>
                          <span style={{ marginLeft: isRTL ? '0' : '15px', marginRight: isRTL ? '15px' : '0', color: '#64748b', fontSize: '0.9rem' }}>📅 {rec.date}</span>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#334155' }}>
                          ⏱ <strong>{rec.startTime} - {rec.endTime}</strong> ({calculateHours(rec.startTime, rec.endTime)} {t.thHours})
                          {userRole === 'admin' && (
                            <button onClick={() => handleDeleteRecord(rec.id)} style={{ marginLeft: isRTL ? '0' : '15px', marginRight: isRTL ? '15px' : '0', padding: '4px 8px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>
                              Löschen
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', fontWeight: 'bold' }}>{t.thEmployee}:</span>
                        <span style={{ fontSize: '0.95rem', color: '#1e293b' }}>{rec.employee}</span>
                      </div>

                      {rec.tasks && rec.tasks.length > 0 && (
                        <div style={{ marginBottom: '10px' }}>
                          <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', fontWeight: 'bold' }}>{t.labelTasks}:</span>
                          <ul style={{ margin: '5px 0 0 0', paddingLeft: isRTL ? '0' : '20px', paddingRight: isRTL ? '20px' : '0', fontSize: '0.95rem', color: '#1e293b' }}>
                            {rec.tasks.map((tsk, i) => <li key={i}>{tsk}</li>)}
                          </ul>
                        </div>
                      )}

                      {rec.materials && rec.materials.length > 0 && (
                        <div>
                          <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', fontWeight: 'bold' }}>{t.matTitle}:</span>
                          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '5px' }}>
                            {rec.materials.map((mat, i) => (
                              <span key={i} style={{ backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '4px', fontSize: '0.85rem', color: '#334155' }}>
                                📦 <strong>{mat.name}</strong> ({t.matOrdered}: {mat.ordered} | {t.matReturned}: {mat.returned})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {rec.notes && (
                        <div style={{ marginTop: '10px', fontStyle: 'italic', color: '#475569', fontSize: '0.9rem', backgroundColor: '#f8fafc', padding: '8px', borderRadius: '4px' }}>
                          {t.labelNotes}: {rec.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

	{/* VIEWPORT 3: MONTHLY CONSOLIDATED WORKED HOURS */}
          {activeTab === 'monthly' && (
            <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#0f172a' }}>{t.headerMonthly}</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRTL ? 'right' : 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '12px' }}>Monat</th>
                    <th style={{ padding: '12px' }}>{t.thEmployee}</th>
                    <th style={{ padding: '12px' }}>{t.thHours}</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedMonthlyData.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', color: '#475569' }}>{row.monat}</td>
                      <td style={{ padding: '12px', fontWeight: 'bold', color: '#334155' }}>{row.employee}</td>
                      <td style={{ padding: '12px', color: '#10b981', fontWeight: 'bold' }}>{row.stunden.toFixed(2)} {t.thHours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* VIEWPORT 4: ADMIN ONLY PROFILE ADDITION MODULE */}
          {activeTab === 'users' && userRole === 'admin' && (
            <div className="admin-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>
              <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#0f172a' }}>{t.headerUsers}</h2>
                {userSuccessStatus && (
                  <div style={{ padding: '12px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '6px', marginBottom: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    ✓ {userSuccessStatus}
                  </div>
                )}

                <form onSubmit={handleCreateUser}>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#334155' }}>{t.lblNewUser}</label>
                    <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required placeholder="e.g. m.schmidt" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#334155' }}>{t.lblNewPass}</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="••••••••" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#334155' }}>{t.lblNewBiz}</label>
                    <select value={newBusinessScope} onChange={(e) => setNewBusinessScope(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                      {Object.entries(BUSINESS_DATA).map(([id, cfg]) => (
                        <option key={id} value={id}>{cfg.label}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 4px rgba(59,130,246,0.2)' }}>
                    ➕ {t.btnCreateUser}
                  </button>
                </form>
              </div>

              <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#0f172a', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>👥 {t.existingUsersTitle}</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: isRTL ? 'right' : 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                      <th style={{ padding: '10px 6px' }}>{t.lblNewUser}</th>
                      <th style={{ padding: '10px 6px' }}>{t.thRole}</th>
                      <th style={{ padding: '10px 6px' }}>{t.thBiz}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {systemUsers.map((u) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px 6px', fontWeight: 'bold', color: '#1e293b' }}>{u.username}</td>
                        <td style={{ padding: '10px 6px' }}>
                          <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: u.role === 'admin' ? '#fee2e2' : '#d1fae5', color: u.role === 'admin' ? '#ef4444' : '#065f46' }}>
                            {u.role}
                          </span>
                        </td>
                        <td style={{ padding: '10px 6px', color: '#475569' }}>
                          {BUSINESS_DATA[u.businessId]?.label || u.businessId}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEWPORT 5: SETTINGS AND LOCALIZATION */}
          {activeTab === 'settings' && (
            <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', maxWidth: '500px' }}>
              <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#0f172a' }}>{t.headerSettings}</h2>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#334155' }}>{t.langLabel}</label>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)} 
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  borderRadius: '6px', 
                  border: '1px solid #cbd5e1', 
                  fontSize: '1rem', 
                  fontWeight: 'bold', 
                  color: '#1e293b' 
                }}
              >
                <option value="de">Deutsch (Deutschland)</option>
                <option value="at">Deutsch (Österreich)</option>
                <option value="en">English</option>
                <option value="es">Español (España)</option>
                <option value="es_mx">Español (México)</option>
                <option value="fr">Français</option>
                <option value="it">Italiano</option>
                <option value="uk">Українська</option>
                <option value="hi">हिन्दी (India)</option>
                <option value="ar">العربية</option>
                <option value="ru">Русский</option>
              </select>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
export default Dashboard;
