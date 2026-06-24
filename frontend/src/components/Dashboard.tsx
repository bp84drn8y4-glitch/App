import React, { useState } from 'react';
import { 
  Building2, Calendar, Clock, ClipboardList, 
  FileText, Package, Plus, Minus, LogOut, ArrowLeft, X 
} from 'lucide-react';

// --- Types & Interfaces ---
interface Material {
  id: string;
  name: string;
  size: string;
  count: number;
}

export default function Dashboard() {
  // --- Sidebar State ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // --- Form States ---
  const [customer, setCustomer] = useState('Edeka Pocking');
  const [date, setDate] = useState('2026-06-24');
  const [beginTime, setBeginTime] = useState('07:00');
  const [endTime, setEndTime] = useState('16:00');
  const [activities, setActivities] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  // --- Materials State ---
  const [materials, setMaterials] = useState<Material[]>([
    { id: '1', name: 'Large garbage bags', size: '120 L', count: 0 },
    { id: '2', name: 'Medium garbage bag', size: '60 L', count: 0 },
    { id: '3', name: 'Small garbage bags', size: '28 L', count: 0 },
    { id: '4', name: 'Microfiber mop', size: '50 cm', count: 0 },
    { id: '5', name: 'Cotton mop', size: '50 cm', count: 0 },
    { id: '6', name: 'red microfiber cloth', size: '40 x 40 cm', count: 0 },
  ]);

  // --- Handlers ---
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
    const formData = {
      customer,
      date,
      beginTime,
      endTime,
      activities,
      notes,
      materials: materials.filter(m => m.count > 0)
    };
    console.log('Submitting Entry:', formData);
    // Trigger your Supabase push or API call here
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-800">
      
      {/* ================= SIDEBAR ================= */}
      <aside className={`bg-[#111c2a] text-slate-300 w-64 flex flex-col justify-between transition-all duration-300 ${isSidebarOpen ? 'block' : 'hidden'}`}>
        <div>
          {/* Header Area with working Layout & Close Button */}
          <div className="p-4 flex items-start justify-between border-b border-slate-800">
            <div>
              <h1 className="text-sky-400 font-bold text-lg leading-tight">Fürst Hauser building cleaning</h1>
              <span className="text-xs text-slate-500 block mt-0.5">work area</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2">
            <a href="#" className="flex items-center gap-3 bg-slate-800/60 text-sky-400 px-3 py-2.5 rounded-md font-medium text-sm">
              <ClipboardList size={16} /> Data collection
            </a>
            <a href="#" className="flex items-center gap-3 hover:bg-slate-800/40 hover:text-white px-3 py-2.5 rounded-md font-medium text-sm transition-colors">
              <Calendar size={16} /> Daily overview
            </a>
            <a href="#" className="flex items-center gap-3 hover:bg-slate-800/40 hover:text-white px-3 py-2.5 rounded-md font-medium text-sm transition-colors">
              <ClipboardList size={16} /> Monthly overview
            </a>
            <a href="#" className="flex items-center gap-3 hover:bg-slate-800/40 hover:text-white px-3 py-2.5 rounded-md font-medium text-sm transition-colors">
              <FileText size={16} /> Settings
            </a>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 space-y-2 border-t border-slate-800">
          <button className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm py-2 px-4 rounded-md transition-colors">
            <ArrowLeft size={14} /> Back to overview
          </button>
          <button className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 px-4 rounded-md transition-colors">
            <LogOut size={14} /> Log out
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* Top Navbar Header */}
        <div className="flex justify-between items-center mb-8">
          {!isSidebarOpen && (
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="bg-white p-2 rounded-md shadow-sm hover:bg-slate-50 font-medium text-sm text-slate-600"
            >
              ➔ Open Menu
            </button>
          )}
          <h2 className="text-2xl font-bold text-slate-800">Record working time & materials</h2>
          <div className="text-sm font-medium text-slate-600">
            User : <span className="font-bold text-slate-800">admin</span> <span className="text-emerald-500 text-xs bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 ml-1">(employee)</span>
          </div>
        </div>

        {/* 
          LAYOUT FIX: Removed 'grid-cols-3' or multi-column layout classes. 
          Using a centered single-column layout stack ('max-w-4xl flex flex-col gap-6') 
        */}
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 space-y-6">
            
            {/* 1. Customer / Property */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Customer / Property</label>
              <select 
                value={customer} 
                onChange={(e) => setCustomer(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-sky-500"
              >
                <option value="Edeka Pocking">Edeka Pocking</option>
                <option value="Building Alpha">Building Alpha</option>
              </select>
            </div>

            {/* 2. Date Selector */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Date</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* 3. Begin & End Times */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Beginn</label>
                <input 
                  type="time" 
                  value={beginTime}
                  onChange={(e) => setBeginTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">End</label>
                <input 
                  type="time" 
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* 4. Activities Block */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Activities performed</label>
              <select className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-sky-500 mb-2">
                <option>-- Choose activity --</option>
                <option>Floor Cleaning</option>
                <option>Window Washing</option>
              </select>
              <button type="button" className="inline-flex items-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold py-1.5 px-3 rounded transition-colors">
                <Plus size={14} /> Add activity
              </button>
            </div>

            {/* 5. Other / Notes Field */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Other / Notes</label>
              <textarea 
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-sky-500"
                placeholder="Write any additional details here..."
              />
            </div>

            {/* Divider Rule separating core Form data from Material Tracking */}
            <hr className="border-slate-200 my-6" />

            {/* ================= FIXED PLACEMENT: MATERIAL CONSUMPTION ================= */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package className="text-amber-600" size={20} />
                <h3 className="text-lg font-bold text-slate-800">Material consumption</h3>
              </div>

              {/* Responsive Grid layout for rendering materials beneath the notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                {materials.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                    <div>
                      <span className="block font-bold text-sm text-slate-700 leading-tight">{item.name}</span>
                      <span className="text-xs text-slate-400 font-medium">{item.size}</span>
                    </div>
                    
                    {/* Counter Group */}
                    <div className="flex items-center gap-2.5">
                      <button 
                        type="button"
                        onClick={() => handleMaterialChange(item.id, false)}
                        className="p-1 rounded border border-slate-300 hover:bg-slate-100 text-slate-500 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center font-bold text-sm text-slate-800">{item.count}</span>
                      <button 
                        type="button"
                        onClick={() => handleMaterialChange(item.id, true)}
                        className="p-1 rounded border border-slate-300 hover:bg-slate-100 text-slate-500 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Form Action Button (Always remains at the absolute bottom) */}
            <div className="pt-2">
              <button 
                type="submit" 
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                🚀 Submit entry
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}
