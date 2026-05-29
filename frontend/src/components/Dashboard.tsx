import React, { useState, useEffect } from 'react';
import { LogOut, UserPlus, FileSpreadsheet, Clock, Package } from 'lucide-react';

interface DashboardProps {
  user: { id: number; username: string; role: string };
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const isAdmin = user.role === 'employer';

  // Data lists & loading states (Datenlisten & Ladezustände)
  const [entries, setEntries] = useState<any[]>([]);
  const [emplList, setEmplList] = useState<any[]>([]);

  // Time-tracker form inputs (Arbeitszeit-Formulareingaben)
  const [businessType, setBusinessType] = useState('Gebäudereinigung');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [task, setTask] = useState('');
  const [customer, setCustomer] = useState('');
  const [sonstigesDesc, setSonstigesDesc] = useState('');

  // Material Tracker state mappings (Material-Verwaltungsstatus)
  const [materialQuantities, setMaterialQuantities] = useState<Record<string, { ordered: number; returned: number }>>({});

  // Employee provisioning profile state inputs (Mitarbeiter-Registrierungseingaben)
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('employee');
  const [adminMsg, setAdminMsg] = useState('');
  const [adminErr, setAdminErr] = useState('');

  // 1. Master List for Fürst Hauser Gebaudereinigung [Cleaning Service]
  const gebaudereinigungMaterials = [
    { id: 'muellbeutel_120', name: 'Müllbeutel Groß [Large trash] 120 L' },
    { id: 'muellbeutel_60', name: 'Müllbeutel Medium [Medium trash] 60 L' },
    { id: 'muellbeutel_28', name: 'Müllbeutel Klein [Small trash] 28 L' },
    { id: 'wischmopp_mikro', name: 'Wischmopp Mikrofaser [Microfiber mop] 50 cm' },
    { id: 'wischmopp_baumwolle', name: 'Wischmopp Baumwolle [Cotton mop] 50 cm' },
    { id: 'boden_mikro', name: 'Bodenreinigung Wischmopp Mikrofaser [Floor Microfiber mop] 50 cm' },
    { id: 'boden_baumwolle', name: 'Bodenreinigung Wischmopp Baumwolle [Floor Cotton mop] 50 cm' },
    { id: 'lappen_rot', name: 'Mikrofaser Lappen rot [Red microfiber cloth] 40 x 40 cm' },
    { id: 'lappen_blau', name: 'Mikrofaser Lappen blau [Blue microfiber cloth] 40 x 40 cm' },
    { id: 'lappen_gruen', name: 'Mikrofaser Lappen grün [Green microfiber cloth] 40 x 40 cm' },
    { id: 'lappen_gelb', name: 'Mikrofaser Lappen gelb [Yellow microfiber cloth] 40 x 40 cm' },
    { id: 'geschirrtuecher', name: 'Geschirrtücher [Kitchen / Dish towels] 70 x 50 cm' },
    { id: 'sanitaer_milizid', name: 'Sprühflasche Sanitärreiniger Milizid [Bathroom cleaner spray]' },
    { id: 'boden_torrun', name: 'Bodenreiniger Torrun Konzentrat [Floor cleaner concentrate]' },
    { id: 'oberflaeche', name: 'Oberflächenreiniger [Surface cleaner]' },
    { id: 'toilettenpapier', name: 'Toilettenpapier [Toilet paper]' },
    { id: 'falthandtuecher', name: 'Falthandtücher [Folded hand towels]' },
    { id: 'handseife_10l', name: 'Handseife [Hand soap] 10 Liter' },
    { id: 'gebaude_sonstiges', name: 'Sonstiges [Miscellaneous / Other]' }
  ];

  // 2. Master List for Bullauge Waschsalon [Laundromat]
  const waschsalonMaterials = [
    { id: 'haende_folien', name: 'Handfolien / Plastikhandschuhe [Plastic gloves / Hand films]' },
    { id: 'buegelstaerke', name: 'Bügelstärke [Ironing starch / Spray starch]' },
    { id: 'chlor', name: 'Chlor [Chlorine / Bleach]' },
    { id: 'waschpulver_20kg', name: 'Waschpulver [Washing powder] — 20 kg' },
    { id: 'weichspueler_20l', name: 'Weichspüler [Fabric softener] — 20 Lit.' },
    { id: 'wasch_sonstiges', name: 'Sonstiges [Miscellaneous / Other]' }
  ];

  // Pick inventory items conditionally based on chosen business category state
  const activeMaterialsList = businessType === 'Waschsalon' ? waschsalonMaterials : gebaudereinigungMaterials;

  // Clear tracked items object when switching operations to avoid cross-pollution errors
  const handleBusinessChange = (type: string) => {
    setBusinessType(type);
    setMaterialQuantities({});
    setSonstigesDesc('');
  };

  const calculateHours = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);
    let diffMins = (eH * 60 + eM) - (sH * 60 + sM);
    if (diffMins < 0) diffMins += 24 * 60;
    return parseFloat((diffMins / 60).toFixed(2));
  };

  const syncDatabase = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/entries?employee=${encodeURIComponent(user.username)}&role=${user.role}`);
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : []);

      if (isAdmin) {
        const uRes = await fetch('http://localhost:5000/api/users');
        const uData = await uRes.json();
        setEmplList(Array.isArray(uData) ? uData : []);
      }
    } catch (err) {
      console.error("Sync error:", err);
    }
  };

  useEffect(() => {
    syncDatabase();
  }, []);

  const handleQtyChange = (itemId: string, field: 'ordered' | 'returned', val: number) => {
    setMaterialQuantities(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: Math.max(0, val)
      }
    }));
  };

  const handleRegisterEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminMsg('');
    setAdminErr('');
    try {
      const res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername, password: newPassword, role: newRole })
      });
      const data = await res.json();
      if (data.success) {
        setAdminMsg(`Mitarbeiter '${newUsername}' erfolgreich registriert! [Employee registered successfully!]`);
        setNewUsername('');
        setNewPassword('');
        syncDatabase();
      } else {
        setAdminErr(data.message || 'Registrierung fehlgeschlagen [Registration failed]');
      }
    } catch (err) {
      setAdminErr('Keine Verbindung zum Server [No connection to server]');
    }
  };

  const handleRecordTime = async (e: React.FormEvent) => {
    e.preventDefault();
    const computedHours = calculateHours(startTime, endTime);
    
    const payload = {
      employee: user.username,
      startTime,
      endTime,
      task,
      customer,
      hours: computedHours,
      businessType,
      sonstigesDesc,
      materials: materialQuantities
    };

    try {
      const res = await fetch('http://localhost:5000/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setStartTime('');
        setEndTime('');
        setTask('');
        setCustomer('');
        setSonstigesDesc('');
        setMaterialQuantities({});
        syncDatabase();
        alert('Eintrag erfolgreich gespeichert! [Record saved successfully!]');
      } else {
        alert('Fehler beim Speichern [Error during save]');
      }
    } catch (err) {
      alert('Keine Verbindung zum Backend! [No connection to backend!]');
    }
  };

  const totalSummedHours = entries.reduce((sum, entry) => sum + (Number(entry.hours) || 0), 0);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1400px', margin: '0 auto', color: '#333' }}>
      
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #333', paddingBottom: '15px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '26px', color: '#111' }}>Time Tracker</h1>
          <p style={{ margin: '5px 0 0 0', fontSize: '15px' }}>
            Angemeldet als [Logged in as]: <strong>{user.username}</strong> ({isAdmin ? 'Arbeitgeber [Employer]' : 'Mitarbeiter [Employee]'})
          </p>
        </div>
        <button onClick={onLogout} style={{ padding: '10px 15px', backgroundColor: '#d9534f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <LogOut size={16} /> Abmelden [Logout]
        </button>
      </div>

      {/* Admin Panel Profile Segment */}
      {isAdmin && (
        <div style={{ background: '#ebf3f9', padding: '15px', borderRadius: '6px', border: '1px solid #bce1f4', marginBottom: '25px' }}>
          <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#31708f' }}>
            <UserPlus size={18} /> Admin-Bereich: Mitarbeiter registrieren [Admin Panel: Register New Employee]
          </h3>
          <form onSubmit={handleRegisterEmployee} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 'bold' }}>Benutzername [Username]</label>
              <input type="text" required value={newUsername} onChange={e => setNewUsername(e.target.value)} style={{ padding: '8px', width: '180px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 'bold' }}>Passwort [Password]</label>
              <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} style={{ padding: '8px', width: '180px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 'bold' }}>Rolle [Role]</label>
              <select value={newRole} onChange={e => setNewRole(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                <option value="employee">Mitarbeiter [Employee]</option>
                <option value="employer">Arbeitgeber [Employer/Admin]</option>
              </select>
            </div>
            <button type="submit" style={{ padding: '9px 15px', backgroundColor: '#31708f', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
              Konto erstellen [Create Account]
            </button>
          </form>
          {adminMsg && <p style={{ color: 'green', fontWeight: 'bold', margin: '10px 0 0 0' }}>{adminMsg}</p>}
          {adminErr && <p style={{ color: 'red', fontWeight: 'bold', margin: '10px 0 0 0' }}>{adminErr}</p>}
        </div>
      )}

      {/* Main Flex Work Grid Layout */}
      <div style={{ display: 'flex', gap: '20px', flexDirection: isAdmin ? 'column' : 'row' }}>
        
        {/* LEFT PROFILE SIDE: The Classic Capture Input Form */}
        {!isAdmin && (
          <div style={{ flex: '1', minWidth: '450px', background: '#fcfcfc', border: '1px solid #ccc', padding: '20px', borderRadius: '6px' }}>
            <h2 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} /> Arbeitszeit erfassen [Log Hours]
            </h2>
            <form onSubmit={handleRecordTime} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Betrieb wählen [Choose Business]</label>
                <select value={businessType} onChange={e => handleBusinessChange(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="Gebäudereinigung">Fürst Hauser Gebäudereinigung [Cleaning Service]</option>
                  <option value="Waschsalon">Waschsalon [Laundromat]</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Startzeit [Start Time]</label>
                  <input type="time" required value={startTime} onChange={e => setStartTime(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Endzeit [End Time]</label>
                  <input type="time" required value={endTime} onChange={e => setEndTime(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Kunde [Customer]</label>
                <input type="text" required value={customer} onChange={e => setCustomer(e.target.value)} placeholder="Name des Kunden..." style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Tätigkeit [Task / Description]</label>
                <textarea required value={task} onChange={e => setTask(e.target.value)} placeholder="Beschreibung der Arbeit..." style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '50px' }} />
              </div>

              {/* Dynamic Material Inventory Input Tracking Module Block */}
              <div style={{ background: '#f0f4f8', padding: '12px', borderRadius: '6px', border: '1px solid #d0dce5', marginTop: '5px' }}>
                <h4 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px', color: '#2c4a6f' }}>
                  <Package size={16} /> Materialverbrauch verwalten ({businessType === 'Waschsalon' ? 'Waschsalon' : 'Gebäudereinigung'}) [Manage Products]
                </h4>
                
                <div style={{ maxHeight: '280px', overflowY: 'auto', paddingRight: '5px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {activeMaterialsList.map((item) => {
                    const currentItem = materialQuantities[item.id] || { ordered: 0, returned: 0 };
                    const isSonstigesRow = item.id === 'gebaude_sonstiges' || item.id === 'wasch_sonstiges';

                    return (
                      <div key={item.id} style={{ paddingBottom: '8px', borderBottom: '1px solid #e0e0e0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '500', color: '#111' }}>{item.name}</span>
                          
                          {/* Inline Description Box for Sonstiges directly on the material row */}
                          {isSonstigesRow && (
                            <div style={{ marginBottom: '4px' }}>
                              <input 
                                type="text" 
                                value={sonstigesDesc} 
                                onChange={e => setSonstigesDesc(e.target.value)} 
                                placeholder="Beschreibung für Sonstiges [Short description for miscellaneous]..." 
                                style={{ width: '100%', padding: '5px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '12px' }} 
                              />
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '15px', marginTop: '2px' }}>
                          <label style={{ fontSize: '11px', color: '#555' }}>
                            Mitgenommen [Took / Outbound]:
                            <input type="number" min="0" value={currentItem.ordered || ''} onChange={e => handleQtyChange(item.id, 'ordered', parseInt(e.target.value) || 0)} style={{ width: '55px', marginLeft: '5px', padding: '3px' }} />
                          </label>
                          <label style={{ fontSize: '11px', color: '#555' }}>
                            Zurückgebracht [Returned / Back]:
                            <input type="number" min="0" value={currentItem.returned || ''} onChange={e => handleQtyChange(item.id, 'returned', parseInt(e.target.value) || 0)} style={{ width: '55px', marginLeft: '5px', padding: '3px' }} />
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#5cb85c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', marginTop: '5px' }}>
                Eintrag speichern [Save Entry Record]
              </button>
            </form>
          </div>
        )}

        {/* RIGHT PROFILE SIDE: Detailed Log Tables Sheet Output */}
        <div style={{ flex: '2', background: '#fff', border: '1px solid #ccc', padding: '20px', borderRadius: '6px' }}>
          <h2 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileSpreadsheet size={20} /> Verlaufseinträge [Log History Tracking Table]
          </h2>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ccc' }}>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Datum [Date]</th>
                  {isAdmin && <th style={{ padding: '8px', border: '1px solid #ddd', color: '#0052cc' }}>Mitarbeiter [Employee]</th>}
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Bereich [Business]</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Kunde [Customer]</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Tätigkeit [Task]</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Dauer [Hours]</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#eef7ee' }}>Mitgenommen [Took Materials]</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#fcf2f2' }}>Zurückgebracht [Returned Materials]</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 8 : 7} style={{ padding: '15px', textAlign: 'center', color: '#888' }}>
                      Keine Einträge vorhanden [No log entries tracked yet]
                    </td>
                  </tr>
                ) : (
                  entries.map((entry: any) => {
                    let parsedMaterials: Record<string, { ordered: number; returned: number }> = {};
                    try {
                      if (typeof entry.materials === 'string') {
                        parsedMaterials = JSON.parse(entry.materials || '{}');
                      } else if (entry.materials) {
                        parsedMaterials = entry.materials;
                      }
                    } catch (e) {
                      parsedMaterials = {};
                    }

                    const tookElements: string[] = [];
                    const returnedElements: string[] = [];

                    Object.entries(parsedMaterials).forEach(([key, values]: [string, any]) => {
                      // Lookup visual labels dynamically from both matching arrays
                      const itemMeta = [...gebaudereinigungMaterials, ...waschsalonMaterials].find(m => m.id === key);
                      const visualName = itemMeta ? itemMeta.name.split('[')[0].trim() : key;

                      if (values?.ordered > 0) {
                        tookElements.push(`${visualName}: ${values.ordered} Stk.`);
                      }
                      if (values?.returned > 0) {
                        returnedElements.push(`${visualName}: ${values.returned} Stk.`);
                      }
                    });

                    return (
                      <tr key={entry.id} style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: '13px' }}>
                          {entry.date ? entry.date.split(' ')[0] : 'Neu [New]'}
                        </td>
                        {isAdmin && (
                          <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: '13px', fontWeight: 'bold', color: '#0052cc' }}>
                            {entry.employee || 'Unbekannt [Unknown]'}
                          </td>
                        )}
                        <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: '13px' }}>
                          {entry.businessType || 'Gebäudereinigung'}
                        </td>
                        <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: '13px' }}>
                          {entry.customer}
                        </td>
                        <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: '13px' }}>
                          {entry.task}
                        </td>
                        <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: '13px', fontWeight: 'bold' }}>
                          {entry.hours} Std.
                        </td>
                        <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: '12px', backgroundColor: '#fafdfa', color: '#275b27' }}>
                          {tookElements.length === 0 ? <span style={{ color: '#aaa' }}>-</span> : tookElements.map((el, idx) => <div key={idx}>• {el}</div>)}
                        </td>
                        <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: '12px', backgroundColor: '#fffdfd', color: '#8c2d2d' }}>
                          {returnedElements.length === 0 ? <span style={{ color: '#aaa' }}>-</span> : returnedElements.map((el, idx) => <div key={idx}>• {el}</div>)}
                          {entry.sonstigesDesc && (
                            <div style={{ fontSize: '11px', color: '#111', fontStyle: 'italic', borderTop: '1px dashed #ccc', marginTop: '4px', paddingTop: '2px', fontWeight: 'bold' }}>
                              Info / Description: {entry.sonstigesDesc}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Sum Summary footer banner info box */}
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#dff0d8', border: '1px solid #d6e9c6', borderRadius: '4px', textAlign: 'right' }}>
            <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#3c763d' }}>
              Gesamtsumme gearbeiteter Stunden [Total Combined Registered Hours]: <span style={{ fontSize: '18px' }}>{totalSummedHours.toFixed(2)}</span> Std. [Hrs]
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
