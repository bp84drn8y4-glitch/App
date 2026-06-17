import React, { useState, useEffect } from 'react';

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

// Global Translations Dictionary
const translations: Record<string, Record<string, string>> = {
  de: {
    dashboardTitle: 'Arbeitsbereich',
    backBtn: '← Zurück zur Übersicht',
    logoutBtn: 'Abmelden',
    userLabel: 'Nutzer',
    navEntry: 'Datenerfassung',
    navRecords: 'Tagesübersicht',
    navMonthly: 'Monatsübersicht',
    navSettings: 'Einstellungen',
    headerData: 'Arbeitszeit & Material erfassen',
    headerRecords: 'Meine erfassten Tagesberichte',
    headerMonthly: 'Monatliche Arbeitsstunden',
    headerSettings: 'Systemeinstellungen',
    labelCustomer: 'Kunde / Objekt',
    labelDate: 'Datum',
    labelStart: 'Beginn',
    labelEnd: 'Ende',
    labelTasks: 'Ausgeführte Tätigkeiten',
    labelNotes: 'Sonstiges / Notizen',
    btnAddTask: '+ Tätigkeit hinzufügen',
    btnSubmit: 'Eintrag Abschicken',
    matTitle: 'Materialverbrauch',
    matName: 'Materialbezeichnung',
    matOrdered: 'Mitgenommen',
    matReturned: 'Retoure',
    successMsg: 'Arbeitszeit erfolgreich und unveränderlich übermittelt!',
    adminNotice: 'Als Admin können Sie Einträge bearbeiten oder löschen.',
    thEmployee: 'Mitarbeiter',
    thHours: 'Stunden',
    langLabel: 'Sprachauswahl (Language)',
    noRecords: 'Keine Einträge für diesen Zeitraum vorhanden.'
  },
  en: {
    dashboardTitle: 'Workspace',
    backBtn: '← Back to Portal',
    logoutBtn: 'Logout',
    userLabel: 'User',
    navEntry: 'Data Entry',
    navRecords: 'Daily Log',
    navMonthly: 'Monthly Hours',
    navSettings: 'Settings',
    headerData: 'Log Hours & Materials',
    headerRecords: 'My Daily Records',
    headerMonthly: 'Monthly Worked Hours',
    headerSettings: 'System Settings',
    labelCustomer: 'Customer / Object',
    labelDate: 'Date',
    labelStart: 'Start Time',
    labelEnd: 'End Time',
    labelTasks: 'Executed Tasks',
    labelNotes: 'Miscellaneous / Notes',
    btnAddTask: '+ Add Task Line',
    btnSubmit: 'Submit Entry',
    matTitle: 'Material Tracking',
    matName: 'Material Name',
    matOrdered: 'Taken Out',
    matReturned: 'Returned',
    successMsg: 'Data logged successfully! Record is now locked.',
    adminNotice: 'Admin Mode: Editing and deletion rights granted.',
    thEmployee: 'Employee',
    thHours: 'Hours',
    langLabel: 'Select Language',
    noRecords: 'No tracking records found for this scope.'
  }
};

// BUSINESS CONFIGURATION DATA MODELS
const BUSINESS_DATA: Record<string, { tasks: string[]; materials: { name: string; spec: string }[]; customers: string[] }> = {
  fuerst_hauser: {
    customers: ['Edeka Pocking', 'Gewerbepark Pleiskirchen', 'Rathaus Altötting', 'Klinikum Burghausen'],
    tasks: [
      'Außenreinigung Schaufenster und Eingangstüren',
      'Innenreinigung Schaufenster und Eingangstüren',
      'Beidseitige Reinigung von Glasflächen im Verkaufsbereich',
      'Beidseitige Reinigung von Glasflächen im Mitarbeiterbereich',
      'Zusätzliche Innenreinigung von Schaufenstern zu Dekorationsterminen mit zusätzlicher Anfahrt',
      'Zusätzliche Innenreinigung von Schaufenstern zu Dekorationsterminen in Verbindung mit regelmäßiger Glasreinigung ohne zusätzliche Anfahrt',
      'Reinigung von Spiegeln',
      'Sonderleistungen und Sonstiges'
    ],
    materials: [
      { name: 'Müllbeutel Groß', spec: '120 L' },
      { name: 'Müllbeutel Medium', spec: '60 L' },
      { name: 'Müllbeutel Klein', spec: '28 L' },
      { name: 'Wischmopp Mikrofaser', spec: '50 cm' },
      { name: 'Wischmopp Baumwolle', spec: '50 cm' },
      { name: 'Mikrofaser Lappen rot', spec: '40 x 40 cm' },
      { name: 'Mikrofaser Lappen blau', spec: '40 x 40 cm' },
      { name: 'Mikrofaser Lappen grün', spec: '40 x 40 cm' },
      { name: 'Mikrofaser Lappen gelb', spec: '40 x 40 cm' },
      { name: 'Geschirrtücher', spec: '70 x 50 cm' },
      { name: 'Sanitärreiniger Milizid', spec: 'Sprühflasche' },
      { name: 'Bodenreiniger Torrun', spec: 'Konzentrat' },
      { name: 'Oberflächenreiniger', spec: 'Gebrauchsfertig' },
      { name: 'Toilettenpapier', spec: 'Lagenware' },
      { name: 'Falthandtücher', spec: 'Papier' },
      { name: 'Handseife', spec: '10 Liter Kanister' }
    ]
  },
  bullauge: {
    customers: ['Münchner Str. Filiale', 'Hauptbahnhof Express', 'Uni-Viertel Salon'],
    tasks: ['Maschinenreinigung', 'Kassenabrechnung', 'Flusensiebe leeren', 'Boden wischen & desinfizieren'],
    materials: [
      { name: 'Waschmittel Pro', spec: 'Flüssig' },
      { name: 'Weichspüler Eco', spec: 'Kanister' },
      { name: 'Desinfektionsspray', spec: '500 ml' },
      { name: 'Müllbeutel Stark', spec: '60 L' }
    ]
  },
  hauser_mittel: {
    customers: ['Logistikzentrum West', 'Produktionshalle 1', 'Abfüllstation Nord'],
    tasks: ['Produktverpackung', 'Qualitätskontrolle Flaschen', 'Lagerverwaltung', 'Paletten-Stauung'],
    materials: [
      { name: 'Rollenetiketten', spec: 'Standard' },
      { name: 'Abfüllbehälter', spec: '1 L Leerflasche' },
      { name: 'Kartonagen Groß', spec: 'Wellpappe' }
    ]
  },
  signature_vista: {
    customers: ['Penthouse Suite A', 'Konferenzbereich 1-4', 'Lounge Bereich'],
    tasks: ['Gästebetreuung Vorbereitung', 'Objektverwaltung Premium', 'Rezeptionsdienst Übergabe'],
    materials: [
      { name: 'Schlüsselkarten', spec: 'RFID' },
      { name: 'Imageprospekte', spec: 'Hochglanz' },
      { name: 'Büromaterial Set', spec: 'Premium' }
    ]
  }
};

export function Dashboard({ userRole, username, businessId, onLogout, onBackToPortal }: DashboardProps) {
  // Config Scope Resolution
  const scopeConfig = BUSINESS_DATA[businessId] || BUSINESS_DATA.fuerst_hauser;

  // Active Menu Navigation View State
  const [activeTab, setActiveTab] = useState<'entry' | 'records' | 'monthly' | 'settings'>('entry');
  const [language, setLanguage] = useState<'de' | 'en'>('de');
  const t = translations[language];

  // Form Inputs State
  const [customer, setCustomer] = useState(scopeConfig.customers[0] || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('16:00');
  const [selectedTasks, setSelectedTasks] = useState<string[]>(['']);
  const [miscellaneous, setMiscellaneous] = useState('');
  const [formStatus, setFormStatus] = useState<string | null>(null);

  // Dynamic Material Counter Array Rows State
  const [materialRows, setMaterialRows] = useState<MaterialRowState[]>([]);

  // Persistent Mock Database Context Arrays
  const [allRecords, setAllRecords] = useState<SubmittedRecord[]>([
    {
      id: 'mock-1',
      employee: 'Samadhi',
      date: '2026-06-15',
      customer: scopeConfig.customers[0] || 'Objekt A',
      startTime: '08:00',
      endTime: '12:00',
      tasks: [scopeConfig.tasks[0]],
      materials: [{ name: scopeConfig.materials[0]?.name || 'Müllbeutel', ordered: 5, returned: 2 }],
      notes: 'Routinekontrolle durchgeführt.'
    }
  ]);

  // Sync Material rows when changing businesses
  useEffect(() => {
    const rows = scopeConfig.materials.map(m => ({
      name: m.name,
      specification: m.spec,
      ordered: 0,
      returned: 0
    }));
    setMaterialRows(rows);
    setCustomer(scopeConfig.customers[0] || '');
  }, [businessId]);

  // Form Submission Logic
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const currentEntry: SubmittedRecord = {
      id: `record-${Date.now()}`,
      employee: username || 'Mitarbeiter',
      date,
      customer,
      startTime,
      endTime,
      tasks: selectedTasks.filter(tk => tk !== ''),
      materials: materialRows
        .filter(r => r.ordered > 0 || r.returned > 0)
        .map(r => ({ name: r.name, ordered: r.ordered, returned: r.returned })),
      notes: miscellaneous
    };

    setAllRecords(prev => [currentEntry, ...prev]);
    setFormStatus(t.successMsg);

    // Reset workflow inputs
    setSelectedTasks(['']);
    setMiscellaneous('');
    const resetRows = scopeConfig.materials.map(m => ({ name: m.name, specification: m.spec, ordered: 0, returned: 0 }));
    setMaterialRows(resetRows);

    setTimeout(() => setFormStatus(null), 5000);
  };

  // Safe Math Up/Down Counter Modification Handles
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

  // Calculate decimal hours difference
  const calculateHours = (start: string, end: string) => {
    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);
    const deltaMin = (eH * 60 + eM) - (sH * 60 + sM);
    return deltaMin > 0 ? (deltaMin / 60).toFixed(2) : '0.00';
  };

  // Filter visibility scopes based on permission parameters
  const filteredRecords = allRecords.filter(rec => {
    if (userRole === 'admin') return true; // Admin views global state
    return rec.employee.toLowerCase() === username.toLowerCase(); // Employees isolated
  });

  const businessLabel = 
    businessId === 'fuerst_hauser' ? 'Fürst Hauser Gebäudereinigung' :
    businessId === 'bullauge' ? 'Bullauge Waschsalon' :
    businessId === 'hauser_mittel' ? 'Hauser Reinigungsmittel' : 'Signature Vista';

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
      
      {/* SIDEBAR SIDE NAVIGATION MENU PANEL */}
      <div style={{ width: '260px', backgroundColor: '#1e293b', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px 0' }}>
        <div>
          <div style={{ padding: '0 20px 20px 20px', borderBottom: '1px solid #334155', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#38bdf8' }}>{businessLabel}</h3>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '5px' }}>{t.dashboardTitle}</div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 10px' }}>
            <button onClick={() => setActiveTab('entry')} style={{ width: '100%', padding: '12px 15px', textAlign: 'left', backgroundColor: activeTab === 'entry' ? '#334155' : 'transparent', color: activeTab === 'entry' ? '#38bdf8' : '#cbd5e1', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              📝 {t.navEntry}
            </button>
            <button onClick={() => setActiveTab('records')} style={{ width: '100%', padding: '12px 15px', textAlign: 'left', backgroundColor: activeTab === 'records' ? '#334155' : 'transparent', color: activeTab === 'records' ? '#38bdf8' : '#cbd5e1', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              📅 {t.navRecords}
            </button>
            <button onClick={() => setActiveTab('monthly')} style={{ width: '100%', padding: '12px 15px', textAlign: 'left', backgroundColor: activeTab === 'monthly' ? '#334155' : 'transparent', color: activeTab === 'monthly' ? '#38bdf8' : '#cbd5e1', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              📊 {t.navMonthly}
            </button>
            <button onClick={() => setActiveTab('settings')} style={{ width: '100%', padding: '12px 15px', textAlign: 'left', backgroundColor: activeTab === 'settings' ? '#334155' : 'transparent', color: activeTab === 'settings' ? '#38bdf8' : '#cbd5e1', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
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

      {/* CORE WORKSPACE APPLICATION WINDOW VIEWPORTS */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* UPPER CONTEXT COMPONENT META BAR */}
        <header style={{ height: '60px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 30px' }}>
          <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
            {t.userLabel}: <strong style={{ color: '#0f172a' }}>{username}</strong> (<span style={{ color: userRole === 'admin' ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>{userRole}</span>)
          </span>
        </header>

        {/* WORKSPACE APP PANELS SCROLL CONTAINER */}
        <main style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
          
          {formStatus && (
            <div style={{ padding: '15px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '6px', marginBottom: '20px', fontWeight: 'bold' }}>
              ✓ {formStatus}
            </div>
          )}

          {/* VIEWPORT 1: DATA LOG ENTRY FORMS */}
          {activeTab === 'entry' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#0f172a' }}>{t.headerData}</h2>
              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>
                
                <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#334155' }}>{t.labelCustomer}</label>
                    <select value={customer} onChange={(e) => setCustomer(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                      {scopeConfig.customers.map((c, i) => <option key={i} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#334155' }}>{t.labelDate}</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#334155' }}>{t.labelStart}</label>
                      <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#334155' }}>{t.labelEnd}</label>
                      <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>{t.labelTasks}</label>
                    {selectedTasks.map((tRow, index) => (
                      <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <select value={tRow} onChange={(e) => handleTaskRowChange(index, e.target.value)} required style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                          <option value="">-- Tätigkeit wählen --</option>
                          {scopeConfig.tasks.map((taskLabel, idx) => (
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

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#334155' }}>{t.labelNotes}</label>
                    <textarea value={miscellaneous} onChange={(e) => setMiscellaneous(e.target.value)} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 4px rgba(16,185,129,0.2)' }}>
                    🚀 {t.btnSubmit}
                  </button>
                </div>

                {/* MATERIAL CONSUMPTIONS UP/DOWN COMPONENT MATRIX */}
                <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', maxHeight: '78vh', overflowY: 'auto' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#0f172a', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>📦 {t.matTitle}</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
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
                          {/* Sprintf Counters using arrow handles */}
                          <td style={{ padding: '12px 6px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                              <button type="button" onClick={() => adjustMaterial(idx, 'ordered', -1)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                              <span style={{ minWidth: '20px', fontWeight: 'bold', color: '#0f172a' }}>{row.ordered}</span>
                              <button type="button" onClick={() => adjustMaterial(idx, 'ordered', 1)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                            </div>
                          </td>
                          <td style={{ padding: '12px 6px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
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
              </form>
            </div>
          )}

          {/* VIEWPORT 2: DAILY ACCUMULATED RECORDS TAB */}
          {activeTab === 'records' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#0f172a' }}>{t.headerRecords}</h2>
              {userRole === 'admin' && (
                <div style={{ padding: '10px 15px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  🛡️ {t.adminNotice}
                </div>
              )}
              {filteredRecords.length === 0 ? (
                <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', textAlign: 'center', color: '#64748b' }}>{t.noRecords}</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {filteredRecords.map((rec) => (
                    <div key={rec.id} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '4px solid #3b82f6' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '15px' }}>
                        <div>
                          <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>{rec.customer}</strong>
                          <span style={{ marginLeft: '15px', color: '#64748b', fontSize: '0.9rem' }}>📅 {rec.date}</span>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#334155' }}>
                          ⏱ <strong>{rec.startTime} - {rec.endTime}</strong> ({calculateHours(rec.startTime, rec.endTime)} Std)
                          {userRole === 'admin' && (
                            <button onClick={() => setAllRecords(prev => prev.filter(r => r.id !== rec.id))} style={{ marginLeft: '15px', padding: '4px 8px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>
                              Löschen
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', fontWeight: 'bold' }}>Mitarbeiter:</span>
                        <span style={{ fontSize: '0.95rem', color: '#1e293b' }}>{rec.employee}</span>
                      </div>

                      <div style={{ marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', fontWeight: 'bold' }}>{t.labelTasks}:</span>
                        <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px', fontSize: '0.95rem', color: '#1e293b' }}>
                          {rec.tasks.map((tsk, i) => <li key={i}>{tsk}</li>)}
                        </ul>
                      </div>

                      {rec.materials.length > 0 && (
                        <div>
                          <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', fontWeight: 'bold' }}>Verbrauchtes Material:</span>
                          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '5px' }}>
                            {rec.materials.map((mat, i) => (
                              <span key={i} style={{ backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '4px', fontSize: '0.85rem', color: '#334155' }}>
                                📦 <strong>{mat.name}</strong> (Mitgenommen: {mat.ordered} | Retoure: {mat.returned})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {rec.notes && (
                        <div style={{ marginTop: '10px', fontStyle: 'italic', color: '#475569', fontSize: '0.9rem', backgroundColor: '#f8fafc', padding: '8px', borderRadius: '4px' }}>
                          Note: {rec.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEWPORT 3: MONTHLY CONSOLIDATED HOURS TOTALS TAB */}
          {activeTab === 'monthly' && (
            <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#0f172a' }}>{t.headerMonthly}</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '12px' }}>{t.thEmployee}</th>
                    <th style={{ padding: '12px' }}>{t.thHours} insgesamt</th>
                  </tr>
                </thead>
                <tbody>
                  {userRole === 'admin' ? (
                    // Admin dynamically aggregates hours across all tracking entities
                    Object.entries(
                      allRecords.reduce((acc, r) => {
                        const hrs = parseFloat(calculateHours(r.startTime, r.endTime));
                        acc[r.employee] = (acc[r.employee] || 0) + hrs;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([emp, hrs], i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px', fontWeight: 'bold', color: '#334155' }}>{emp}</td>
                        <td style={{ padding: '12px', color: '#10b981', fontWeight: 'bold' }}>{hrs.toFixed(2)} Std</td>
                      </tr>
                    ))
                  ) : (
                    // Regular isolation tracking block for current employee
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold', color: '#334155' }}>{username}</td>
                      <td style={{ padding: '12px', color: '#10b981', fontWeight: 'bold' }}>
                        {filteredRecords.reduce((sum, r) => sum + parseFloat(calculateHours(r.startTime, r.endTime)), 0).toFixed(2)} Std
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* VIEWPORT 4: DYNAMIC LOCALIZATION LANGUAGES CONTROLS */}
          {activeTab === 'settings' && (
            <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', maxWidth: '500px' }}>
              <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#0f172a' }}>{t.headerSettings}</h2>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#334155' }}>{t.langLabel}</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value as 'de' | 'en')} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 'bold', color: '#1e293b' }}>
                <option value="de">Deutsch (German)</option>
                <option value="en">English</option>
              </select>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
