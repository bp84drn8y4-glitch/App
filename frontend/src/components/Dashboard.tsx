import React, { useState } from 'react';

interface DashboardProps {
  userRole: 'employee' | 'admin' | 'customer';
  username: string;
  businessId: string;
  onLogout: () => void;
  onBackToPortal: () => void;
}

export function Dashboard({ userRole, username, onLogout, onBackToPortal }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'entry' | 'daily' | 'monthly' | 'settings'>('entry');
  
  const [customer, setCustomer] = useState('Edeka Pocking');
  const [date, setDate] = useState('2026-06-24');
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('16:00');
  const [notes, setNotes] = useState('');

  const [materials, setMaterials] = useState([
    { id: '1', name: 'Große Müllsäcke 120 L', count: 0 },
    { id: '2', name: 'Mittlere Müllsäcke 60 L', count: 0 },
    { id: '3', name: 'Kleine Müllsäcke 28 L', count: 0 },
    { id: '4', name: 'Mikrofasermopp 50 cm', count: 0 },
    { id: '5', name: 'Baumwollmopp 50 cm', count: 0 },
    { id: '6', name: 'Rotes Mikrofasertuch 40 x 40 cm', count: 0 },
  ]);

  const handleCountChange = (id: string, increment: boolean) => {
    setMaterials(materials.map(m => {
      if (m.id === id) {
        const newCount = increment ? m.count + 1 : m.count - 1;
        return { ...m, count: Math.max(0, newCount) };
      }
      return m;
    }));
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-4">
        <div>
          <div className="mb-6 pb-4 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white">Fürst Hauser</h2>
            <h3 className="text-lg font-semibold text-sky-400">Gebäudereinigung</h3>
            <span className="text-xs text-slate-500 block mt-1">Arbeitsbereich</span>
          </div>

          <nav className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('entry')}
              className={`w-full text-left p-3 rounded-lg font-medium transition ${activeTab === 'entry' ? 'bg-slate-800 text-sky-400' : 'hover:bg-slate-800'}`}
            >
              📄 Datenerfassung
            </button>
            <button 
              onClick={() => setActiveTab('daily')}
              className={`w-full text-left p-3 rounded-lg font-medium transition ${activeTab === 'daily' ? 'bg-slate-800 text-sky-400' : 'hover:bg-slate-800'}`}
            >
              📅 Tagesübersicht
            </button>
            <button 
              onClick={() => setActiveTab('monthly')}
              className={`w-full text-left p-3 rounded-lg font-medium transition ${activeTab === 'monthly' ? 'bg-slate-800 text-sky-400' : 'hover:bg-slate-800'}`}
            >
              📊 Monatsübersicht
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left p-3 rounded-lg font-medium transition ${activeTab === 'settings' ? 'bg-slate-800 text-sky-400' : 'hover:bg-slate-800'}`}
            >
              ⚙️ Einstellungen
            </button>
          </nav>
        </div>

        <div className="flex flex-col gap-2 pt-4 border-t border-slate-800">
          <button onClick={onBackToPortal} className="w-full p-2 bg-slate-800 text-white rounded-md text-sm hover:bg-slate-700 transition">
            ← Zurück zur Übersicht
          </button>
          <button onClick={onLogout} className="w-full p-2 bg-red-600 text-white font-semibold rounded-md text-sm hover:bg-red-700 transition">
            Abmelden
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Arbeitszeit & Material erfassen</h1>
            <div className="text-sm text-slate-600">
              Benutzer: <span className="font-semibold text-slate-900">{username}</span> ({userRole})
            </div>
          </div>

          {activeTab === 'entry' && (
            <div className="flex flex-col gap-6">
              
              {/* Form Input Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Kunde / Objekt</label>
                  <select value={customer} onChange={(e) => setCustomer(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg bg-white">
                    <option value="Edeka Pocking">Edeka Pocking</option>
                    <option value="Aldi Pfarrkirchen">Aldi Pfarrkirchen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Datum</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Beginn</label>
                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Ende</label>
                    <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Sonstiges / Notizen</label>
                  <textarea 
                    rows={3} 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                    placeholder="Geben Sie hier zusätzliche Details ein..." 
                    className="w-full p-2 border border-slate-300 rounded-lg resize-none"
                  />
                </div>
              </div>

              {/* Material Consumption Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Materialverbrauch</h3>
                <div className="flex flex-col gap-3">
                  {materials.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <span className="font-medium text-slate-800">{item.name}</span>
                      <div className="flex items-center gap-3">
                        <button 
                          type="button" 
                          onClick={() => handleCountChange(item.id, false)}
                          className="w-8 h-8 flex items-center justify-center border border-slate-300 bg-white rounded-md font-bold hover:bg-slate-100 transition"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold text-slate-900">{item.count}</span>
                        <button 
                          type="button" 
                          onClick={() => handleCountChange(item.id, true)}
                          className="w-8 h-8 flex items-center justify-center border border-slate-300 bg-white rounded-md font-bold hover:bg-slate-100 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Action */}
              <button className="w-full p-4 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700 transition">
                Eintrag absenden
              </button>

            </div>
          )}

          {activeTab === 'daily' && <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">Tagesübersicht Inhalte</div>}
          {activeTab === 'monthly' && <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">Monatsübersicht Inhalte</div>}
          {activeTab === 'settings' && <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">Einstellungen Inhalte</div>}

        </div>
      </main>
    </div>
  );
}
