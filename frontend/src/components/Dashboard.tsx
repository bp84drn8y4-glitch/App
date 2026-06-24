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

// Global localization matrices
const translations: Record<string, any> = {
  de: {
    dashboardTitle: 'Fürst Hauser Gebäudereinigung',
    backBtn: '← Zurück zur Übersicht',
    logoutBtn: 'Abmelden',
    userLabel: 'Nutzer',
    navEntry: 'Datenerfassung',
    navRecords: 'Tagesübersicht',
    navMonthly: 'Monatsübersicht',
    navSettings: 'Einstellungen',
    headerData: 'Arbeitszeit & Material erfassen',
    labelCustomer: 'Kunde / Objekt',
    labelDate: 'Datum',
    labelBegin: 'Beginn (Arbeitszeit)',
    labelEnd: 'Ende (Arbeitszeit)',
    labelNotes: 'Sonstiges / Notizen',
    placeholderNotes: 'Zusätzliche Bemerkungen hier eintragen...',
    matHeader: 'Materialverbrauch',
    matColName: 'Materialname',
    matColSpec: 'Spezifikation / Größe',
    matColOrdered: 'Entnommen / Verbraucht',
    btnSubmit: 'Eintrag absenden',
    headerSettings: 'Systemeinstellungen',
    langLabel: 'Sprachauswahl'
  },
  en: {
    dashboardTitle: 'Fürst Hauser Building Cleaning',
    backBtn: '← Back to Overview',
    logoutBtn: 'Log Out',
    userLabel: 'User',
    navEntry: 'Data Entry',
    navRecords: 'Daily Overview',
    navMonthly: 'Monthly Overview',
    navSettings: 'Settings',
    headerData: 'Record Working Time & Materials',
    labelCustomer: 'Customer / Property',
    labelDate: 'Date',
    labelBegin: 'Start Time',
    labelEnd: 'End Time',
    labelNotes: 'Other / Notes',
    placeholderNotes: 'Enter additional remarks here...',
    matHeader: 'Material Consumption',
    matColName: 'Material Name',
    matColSpec: 'Specification / Size',
    matColOrdered: 'Used / Consumed',
    btnSubmit: 'Submit Entry',
    headerSettings: 'System Settings',
    langLabel: 'Language Selection'
  }
};

export function Dashboard({ userRole, username, onLogout, onBackToPortal }: DashboardProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [language, setLanguage] = useState<string>('de');
  const [activeTab, setActiveTab] = useState<'data' | 'settings'>('data');

  const t = translations[language] || translations.de;

  // Form Fields State
  const [customer, setCustomer] = useState('Edeka Pocking');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('16:00');
  const [notes, setNotes] = useState('');

  // Materials State
  const [materials, setMaterials] = useState<MaterialRowState[]>([
    { name: 'Große Müllsäcke', specification: '120 L', ordered: 0, returned: 0 },
    { name: 'Mittlere Müllsäcke', specification: '60 L', ordered: 0, returned: 0 },
    { name: 'Kleine Müllsäcke', specification: '28 L', ordered: 0, returned: 0 },
    { name: 'Mikrofasermopp', specification: '50 cm', ordered: 0, returned: 0 },
    { name: 'Baumwollmopp', specification: '50 cm', ordered: 0, returned: 0 },
    { name: 'Rotes Mikrofasertuch', specification: '40 x 40 cm', ordered: 0, returned: 0 },
  ]);

  const handleMaterialChange = (index: number, val: number) => {
    setMaterials(prev => prev.map((item, i) => i === index ? { ...item, ordered: Math.max(0, val) } : item));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Daten gespeichert!');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: 'sans-serif', margin: 0 }}>
      
      {/* ================= SIDEBAR ================= */}
      {isSidebarOpen && (
        <aside style={{ width: '260px', backgroundColor: '#1e293b', color: '#cbd5e1', display: 'flex', flexDirection: 'col', justifyContent: 'space-between', padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div style={{ display: 'flex', justifyContext: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #334155', paddingBottom: '15px' }}>
              <div>
                <h3 style={{ color: '#38bdf8', margin: 0, fontSize: '1.1rem' }}>{t.dashboardTitle}</h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Arbeitsbereich</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button onClick={() => setActiveTab('data')} style={{ display: 'block', width: '100%', textAlign: 'left', background: activeTab === 'data' ? '#334155' : 'none', border: 'none', color: activeTab === 'data' ? '#38bdf8' : '#cbd5e1', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                📝 {t.navEntry}
              </button>
              <button onClick={() => setActiveTab('settings')} style={{ display: 'block', width: '100%', textAlign: 'left', background: activeTab === 'settings' ? '#334155' : 'none', border: 'none', color: activeTab === 'settings' ? '#38bdf8' : '#cbd5e1', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                ⚙️ {t.navSettings}
              </button>
            </nav>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto', borderTop: '1px solid #334155', paddingTop: '15px' }}>
            <button onClick={onBackToPortal} style={{ width: '100%', padding: '10px', backgroundColor: '#334155', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}>
              {t.backBtn}
            </button>
            <button onClick={onLogout} style={{ width: '100%', padding: '10px', backgroundColor: '#ef4444', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              {t.logoutBtn}
            </button>
          </div>
        </aside>
      )}

      {/* ================= MAIN CONTENT AREA ================= */}
      <main style={{ flex: 1, padding: '40px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          {!isSidebarOpen && (
            <button onClick={() => setIsSidebarOpen(true)} style={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
              ☰ Menü öffnen
            </button>
          )}
          <h1 style={{ margin: 0, color: '#0f172a', fontSize: '1.75rem' }}>
            {activeTab === 'data' ? t.headerData : t.headerSettings}
          </h1>
          <div style={{ fontSize: '0.9rem', color: '#475569' }}>
            {t.userLabel}: <strong style={{ color: '#0f172a' }}>{username}</strong> ({userRole})
          </div>
        </div>

        {/* ================= VIEWPORT STACK ================= */}
        <div style={{ maxWidth: '850px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {activeTab === 'data' && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Core Form Card */}
              <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>{t.labelCustomer}</label>
                  <select value={customer} onChange={(e) => setCustomer(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    <option value="Edeka Pocking">Edeka Pocking</option>
                    <option value="Aldi Pfarrkirchen">Aldi Pfarrkirchen</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>{t.labelDate}</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>{t.labelBegin}</label>
                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>{t.labelEnd}</label>
                    <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>{t.labelNotes}</label>
                  <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t.placeholderNotes} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', resize: 'vertical' }} />
                </div>
              </div>

              {/* FIXED PLACEMENT: Material Card perfectly layout stacked UNDERNEATH the Core Form */}
              <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#0f172a', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>📦 {t.matHeader}</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {materials.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContext: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '12px 20px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <div style={{ flex: 2 }}>
                        <span style={{ display: 'block', fontWeight: 'bold', fontSize: '0.95rem', color: '#1e293b' }}>{item.name}</span>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.specification}</span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button type="button" onClick={() => handleMaterialChange(idx, item.ordered - 1)} style={{ width: '32px', height: '32px', border: '1px solid #cbd5e1', backgroundColor: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                        <span style={{ width: '30px', textAlign: 'center', fontWeight: 'bold', color: '#0f172a' }}>{item.ordered}</span>
                        <button type="button" onClick={() => handleMaterialChange(idx, item.ordered + 1)} style={{ width: '32px', height: '32px', border: '1px solid #cbd5e1', backgroundColor: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button type="submit" style={{ width: '100%', padding: '16px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }}>
                🚀 {t.btnSubmit}
              </button>

            </form>
          )}

          {activeTab === 'settings' && (
            <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#0f172a' }}>{t.headerSettings}</h2>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#334155' }}>{t.langLabel}</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 'bold', color: '#1e293b' }}>
                <option value="de">Deutsch (Deutschland)</option>
                <option value="en">English</option>
              </select>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
