import React, { useState } from 'react';
import { 
  Building2, Calendar, Clock, ClipboardList, 
  FileText, Package, Plus, Minus, LogOut, ArrowLeft, X, Globe, Settings
} from 'lucide-react';

// --- Types & Interfaces ---
interface Material {
  id: string;
  nameKey: string;
  size: string;
  count: number;
}

// --- Multi-language Translation Dictionary ---
const translations: Record<string, Record<string, string>> = {
  de: {
    brand: "Fürst Hauser Gebäudereinigung",
    workArea: "Arbeitsbereich",
    navData: "Datenerfassung",
    navDaily: "Tagesübersicht",
    navMonthly: "Monatsübersicht",
    navSettings: "Einstellungen",
    btnBack: "Zurück zur Übersicht",
    btnLogout: "Abmelden",
    title: "Arbeitszeit & Material erfassen",
    userLabel: "Benutzer",
    empLabel: "Mitarbeiter",
    labelCustomer: "Kunde / Objekt",
    labelDate: "Datum",
    labelBegin: "Beginn",
    labelEnd: "Ende",
    labelActivities: "Durchgeführte Tätigkeiten",
    btnChooseAct: "-- Tätigkeit auswählen --",
    btnAddAct: "Tätigkeit hinzufügen",
    labelNotes: "Sonstiges / Notizen",
    placeholderNotes: "Geben Sie hier zusätzliche Details ein...",
    matTitle: "Materialverbrauch",
    btnSubmit: "Eintrag absenden",
    langSelect: "Sprachauswahl",
    "Large garbage bags": "Große Müllsäcke",
    "Medium garbage bag": "Mittlere Müllsäcke",
    "Small garbage bags": "Kleine Müllsäcke",
    "Microfiber mop": "Mikrofasermopp",
    "Cotton mop": "Baumwollmopp",
    "red microfiber cloth": "Rotes Mikrofasertuch"
  },
  en: {
    brand: "Fürst Hauser building cleaning",
    workArea: "work area",
    navData: "Data collection",
    navDaily: "Daily overview",
    navMonthly: "Monthly overview",
    navSettings: "Settings",
    btnBack: "Back to overview",
    btnLogout: "Log out",
    title: "Record working time & materials",
    userLabel: "User",
    empLabel: "employee",
    labelCustomer: "Customer / Property",
    labelDate: "Date",
    labelBegin: "Beginn",
    labelEnd: "End",
    labelActivities: "Activities performed",
    btnChooseAct: "-- Choose activity --",
    btnAddAct: "Add activity",
    labelNotes: "Other / Notes",
    placeholderNotes: "Write any additional details here...",
    matTitle: "Material consumption",
    btnSubmit: "Submit entry",
    langSelect: "Language Selection",
    "Large garbage bags": "Large garbage bags",
    "Medium garbage bag": "Medium garbage bag",
    "Small garbage bags": "Small garbage bags",
    "Microfiber mop": "Microfiber mop",
    "Cotton mop": "Cotton mop",
    "red microfiber cloth": "red microfiber cloth"
  }
};

export default function Dashboard() {
  // --- Sidebar & UI States ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [language, setLanguage] = useState<string>('de');
  const [activeTab, setActiveTab] = useState<'data' | 'settings'>('data');

  // --- Get current translation definitions ---
  const t = translations[language] || translations.de;

  // --- Form States ---
  const [customer, setCustomer] = useState('Edeka Pocking');
  const [date, setDate] = useState('2026-06-24');
  const [beginTime, setBeginTime] = useState('07:00');
  const [endTime, setEndTime] = useState('16:00');
  const [notes, setNotes] = useState('');

  // --- Materials State ---
  const [materials, setMaterials] = useState<Material[]>([
    { id: '1', nameKey: 'Large garbage bags', size: '120 L', count: 0 },
    { id: '2', nameKey: 'Medium garbage bag', size: '60 L', count: 0 },
    { id: '3', nameKey: 'Small garbage bags', size: '28 L', count: 0 },
    { id: '4', nameKey: 'Microfiber mop', size: '50 cm', count: 0 },
    { id: '5', nameKey: 'Cotton mop', size: '50 cm', count: 0 },
    { id: '6', nameKey: 'red microfiber cloth', size: '40 x 40 cm', count: 0 },
  ]);

  const handleMaterialChange = (id: string, increment: boolean) => {
    setMaterials(prev => prev.map(item => {
      if (item.id === id) {
        const newCount = increment ? item.count + 1 : Math.max(0, item.count - 1);
        return { ...item, count: newCount };
      }
      return item;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting entry data...');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-800">
      
      {/* ================= SIDEBAR ================= */}
      <aside className={`bg-[#111c2a] text-slate-300 w-64 flex flex-col justify-between transition-all duration-300 ${isSidebarOpen ? 'block' : 'hidden'}`}>
        <div>
          <div className="p-4 flex items-start justify-between border-b border-slate-800">
            <div>
              <h1 className="text-sky-400 font-bold text-lg leading-tight">{t.brand}</h1>
              <span className="text-xs text-slate-500 block mt-0.5">{t.workArea}</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="p-4 space-y-2">
            <button 
              onClick={() => setActiveTab('data')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md font-medium text-sm transition-colors ${activeTab === 'data' ? 'bg-slate-800/60 text-sky-400' : 'hover:bg-slate-800/40 hover:text-white'}`}
            >
              <ClipboardList size={16} /> {t.navData}
            </button>
            <a href="#" className="flex items-center gap-3 hover:bg-slate-800/40 hover:text-white px-3 py-2.5 rounded-md font-medium text-sm transition-colors">
              <Calendar size={16} /> {t.navDaily}
            </a>
            <a href="#" className="flex items-center gap-3 hover:bg-slate-800/40 hover:text-white px-3 py-2.5 rounded-md font-medium text-sm transition-colors">
              <ClipboardList size={16} /> {t.navMonthly}
            </a>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md font-medium text-sm transition-colors ${activeTab === 'settings' ? 'bg-slate-800/60 text-sky-400' : 'hover:bg-slate-800/40 hover:text-white'}`}
            >
              <Settings size={16} /> {t.navSettings}
            </button>
          </nav>
        </div>

        <div className="p-4 space-y-2 border-t border-slate-800">
          <button className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm py-2 px-4 rounded-md transition-colors">
            <ArrowLeft size={14} /> {t.btnBack}
          </button>
          <button className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 px-4 rounded-md transition-colors">
            <LogOut size={14} /> {t.btnLogout}
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          {!isSidebarOpen && (
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="bg-white p-2 rounded-md shadow-sm hover:bg-slate-50 font-medium text-sm text-slate-600"
            >
              Menu ➔
            </button>
          )}
          <h2 className="text-2xl font-bold text-slate-800">{t.title}</h2>
          <div className="text-sm font-medium text-slate-600">
            {t.userLabel} : <span className="font-bold text-slate-800">admin</span> <span className="text-emerald-500 text-xs bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 ml-1">({t.empLabel})</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          
          {activeTab === 'settings' ? (
            /* Settings Tab View */
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-4 border-b pb-3">
                <Globe className="text-sky-500" size={20} />
                <h3 className="text-lg font-bold text-slate-800">{t.langSelect}</h3>
              </div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Choose Application Language</label>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full md:w-64 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
              >
                <option value="de">Deutsch (German)</option>
                <option value="en">English</option>
              </select>
            </div>
          ) : (
            /* Main Form View with Fixed Stacked Layout Layout */
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 space-y-6">
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{t.labelCustomer}</label>
                <select 
                  value={customer} 
                  onChange={(e) => setCustomer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none"
                >
                  <option value="Edeka Pocking">Edeka Pocking</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{t.labelDate}</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t.labelBegin}</label>
                  <input 
                    type="time" 
                    value={beginTime}
                    onChange={(e) => setBeginTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t.labelEnd}</label>
                  <input 
                    type="time" 
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{t.labelActivities}</label>
                <select className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm mb-2">
                  <option>{t.btnChooseAct}</option>
                </select>
                <button type="button" className="inline-flex items-center gap-1.5 bg-slate-200 text-slate-700 text-xs font-semibold py-1.5 px-3 rounded">
                  <Plus size={14} /> {t.btnAddAct}
                </button>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{t.labelNotes}</label>
                <textarea 
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm"
                  placeholder={t.placeholderNotes}
                />
              </div>

              <hr className="border-slate-200 my-6" />

              {/* ================= STACKED PLACEMENT: MATERIALS UNDERNEATH NOTES ================= */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Package className="text-amber-600" size={20} />
                  <h3 className="text-lg font-bold text-slate-800">{t.matTitle}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {materials.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                      <div>
                        <span className="block font-bold text-sm text-slate-700 leading-tight">
                          {t[item.nameKey] || item.nameKey}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{item.size}</span>
                      </div>
                      
                      <div className="flex items-center gap-2.5">
                        <button 
                          type="button"
                          onClick={() => handleMaterialChange(item.id, false)}
                          className="p-1 rounded border border-slate-300 hover:bg-slate-100 text-slate-500"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center font-bold text-sm text-slate-800">{item.count}</span>
                        <button 
                          type="button"
                          onClick={() => handleMaterialChange(item.id, true)}
                          className="p-1 rounded border border-slate-300 hover:bg-slate-100 text-slate-500"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  🚀 {t.btnSubmit}
                </button>
              </div>

            </form>
          )}
        </div>
      </main>
    </div>
  );
}
