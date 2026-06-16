import React, { useState, useEffect } from 'react';

// Define the component properties interface
interface DashboardProps {
  userRole: 'employee' | 'admin' | 'customer';
  username: string;
  businessId: string;
  onLogout: () => void;
  onBackToPortal: () => void;
}

interface MaterialRowState {
  name: string;
  ordered: number;
  returned: number;
}

// FALLBACK SOURCE DATA LISTS
const WASCHSALON_TASKS = ['Maschinenreinigung', 'Kassenabrechnung', 'Flusensiebe leeren', 'Boden wischen'];
const GEBAEUDEREINIGUNG_TASKS = ['Büroreinigung', 'Unterhaltsreinigung', 'Fenster putzen', 'Mülleimer leeren'];

const WASCHSALON_MATERIALS = ['Waschmittel pro', 'Weichspüler eco', 'Desinfektionsspray', 'Müllbeutel 60L'];
const GEBAEUDEREINIGUNG_MATERIALS = ['Allzweckreiniger', 'Glasreiniger', 'Mikrofasertücher', 'Sanitärreiniger'];

export function Dashboard({ userRole, username, businessId, onLogout, onBackToPortal }: DashboardProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'de' | 'en'>('de');

  // --- FORM STATES ---
  // Derive display context dynamically from businessId to eliminate double-selection inputs
  const business = 
    businessId === 'bullauge' ? 'Bullauge Waschsalon' : 
    businessId === 'fuerst_hauser' ? 'Fürst Hauser Gebäudereinigung' :
    businessId === 'hauser_mittel' ? 'Hauser Reinigungsmittel' : 
    'Signature Vista';

  const [customer, setCustomer] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('12:30');
  const [endTime, setEndTime] = useState('12:30');
  const [miscellaneous, setMiscellaneous] = useState('');
  const [showMaterialList, setShowMaterialList] = useState(true);
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  // --- DYNAMIC TASK LABELS ---
  const [tasks, setTasks] = useState<string[]>(['']);

  const availableTasks = 
    businessId === 'bullauge' ? WASCHSALON_TASKS : 
    businessId === 'fuerst_hauser' ? GEBAEUDEREINIGUNG_TASKS :
    businessId === 'hauser_mittel' ? ['Produktverpackung', 'Qualitätskontrolle', 'Lagerverwaltung'] : 
    ['Gästebetreuung', 'Objektverwaltung', 'Rezeptionsdienst'];

  const [materialRows, setMaterialRows] = useState<MaterialRowState[]>([]);

  // UNIFIED LIFECYCLE EFFECT
  useEffect(() => {
    // 1. Safely reset task forms when routing between sectors
    setTasks(['']);

    // 2. Select matching material lists layout defensively
    const targetSource = 
      businessId === 'bullauge' ? WASCHSALON_MATERIALS : 
      businessId === 'fuerst_hauser' ? GEBAEUDEREINIGUNG_MATERIALS :
      businessId === 'hauser_mittel' ? ['Etiketten', 'Abfüllbehälter (1L)', 'Kartonagen'] : 
      ['Schlüsselkarten', 'Prospekte', 'Büromaterial'];

    const initialRows = (targetSource || []).map(name => ({ name, ordered: 0, returned: 0 }));
    setMaterialRows(initialRows);
  }, [businessId]);

  // UI Event Actions
  const handleCounterChange = (index: number, field: 'ordered' | 'returned', delta: number) => {
    setMaterialRows(prev => prev.map((row, i) => {
      if (i !== index) return row;
      const val = Math.max(0, row[field] + delta);
      return { ...row, [field]: val };
    }));
  };

  const handleTaskChange = (index: number, value: string) => {
    setTasks(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const addTaskField = () => setTasks(prev => [...prev, '']);
  const removeTaskField = (index: number) => setTasks(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ type: 'success', message: 'Arbeitszeit erfolgreich übermittelt!' });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: isDarkMode ? '#1a1a1a' : '#f8fafc', color: isDarkMode ? '#f3f4f6' : '#1f2937', minHeight: '100vh' }}>
      
      {/* Top Navigation Headers Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>
        <div>
          <button onClick={onBackToPortal} style={{ padding: '8px 12px', marginRight: '15px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            ← Zurück zur Übersicht
          </button>
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{business} Workspace</span>
        </div>
        <div>
          <span style={{ marginRight: '15px' }}>Nutzer: <strong>{username}</strong> ({userRole})</span>
          <button onClick={onLogout} style={{ padding: '8px 12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Abmelden
          </button>
        </div>
      </div>

      {formStatus.type && (
        <div style={{ padding: '15px', marginBottom: '20px', borderRadius: '4px', backgroundColor: formStatus.type === 'success' ? '#d1fae5' : '#fee2e2', color: formStatus.type === 'success' ? '#065f46' : '#991b1b' }}>
          {formStatus.message}
        </div>
      )}

      {/* Main Operational Workspace Input Grid */}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Left Column Controls */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', color: '#1f2937' }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Zeiterfassung</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Kunde / Objekt</label>
            <input type="text" value={customer} onChange={(e) => setCustomer(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Datum</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Beginn</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Ende</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
          </div>

          {/* Dynamic Task Form Row Inputs */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Ausgeführte Tätigkeiten</label>
            {(tasks || []).map((task, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                <select value={task} onChange={(e) => handleTaskChange(index, e.target.value)} required style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="">-- Tätigkeit wählen --</option>
                  {(availableTasks || []).map((option, oIdx) => (
                    <option key={oIdx} value={option}>{option}</option>
                  ))}
                </select>
                {tasks.length > 1 && (
                  <button type="button" onClick={() => removeTaskField(index)} style={{ padding: '8px', backgroundColor: '#f3f4f6', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>Entfernen</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addTaskField} style={{ marginTop: '5px', padding: '6px 12px', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              + Tätigkeit hinzufügen
            </button>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Sonstiges / Notizen</label>
            <textarea value={miscellaneous} onChange={(e) => setMiscellaneous(e.target.value)} rows={3} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
            Eintrag Abschicken
          </button>
        </div>

        {/* Right Column Material Logs Counter Table */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', color: '#1f2937' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>Materialverbrauch</h3>
            <button type="button" onClick={() => setShowMaterialList(!showMaterialList)} style={{ padding: '4px 8px', fontSize: '0.85rem', cursor: 'pointer' }}>
              {showMaterialList ? 'Ausblenden' : 'Einblenden'}
            </button>
          </div>

          {showMaterialList && (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '8px' }}>Materialbezeichnung</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>Entnommen</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>Retoure</th>
                </tr>
              </thead>
              <tbody>
                {(materialRows || []).map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '8px' }}>{row?.name || 'Unbekanntes Material'}</td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>
                      <button type="button" onClick={() => handleCounterChange(idx, 'ordered', -1)} style={{ padding: '2px 8px', marginRight: '5px' }}>-</button>
                      <span style={{ display: 'inline-block', width: '25px', fontWeight: 'bold' }}>{row.ordered}</span>
                      <button type="button" onClick={() => handleCounterChange(idx, 'ordered', 1)} style={{ padding: '2px 8px', marginLeft: '5px' }}>+</button>
                    </td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>
                      <button type="button" onClick={() => handleCounterChange(idx, 'returned', -1)} style={{ padding: '2px 8px', marginRight: '5px' }}>-</button>
                      <span style={{ display: 'inline-block', width: '25px', fontWeight: 'bold' }}>{row.returned}</span>
                      <button type="button" onClick={() => handleCounterChange(idx, 'returned', 1)} style={{ padding: '2px 8px', marginLeft: '5px' }}>+</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </form>
    </div>
  );
}
