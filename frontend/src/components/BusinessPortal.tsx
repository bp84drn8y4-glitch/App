import React from 'react';
import fuerstHauserLogo from '../assets/logos/fuerst_hauser.jpg';
import hauserMittelLogo from '../assets/logos/hauser_mittel.jpg';
import bullaugeLogo from '../assets/logos/bullauge.jpg';
import signatureVistaLogo from '../assets/logos/signature_vista.jpg';

interface Business {
  id: string;
  name: string;
  logo: string;
}

const businesses: Business[] = [
  { id: 'fuerst_hauser', name: 'Fürst Hauser Gebäudeservice', logo: fuerstHauserLogo },
  { id: 'hauser_mittel', name: 'Hauser Reinigungsmittel', logo: hauserMittelLogo },
  { id: 'bullauge', name: 'Bullauge Waschsalon', logo: bullaugeLogo },
  { id: 'signature_vista', name: 'Signature Vista', logo: signatureVistaLogo },
];

interface PortalProps {
  onSelectBusiness: (businessId: string) => void;
  onLogout: () => void;
}

export const BusinessPortal: React.FC<PortalProps> = ({ onSelectBusiness, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-6 relative">
      {/* Logout button if they want to leave the portal */}
      <button 
        onClick={onLogout}
        className="absolute top-6 right-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Abmelden (Logout)
      </button>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Unternehmensbereich wählen</h1>
        <p className="text-gray-500">Wählen Sie einen Bereich, um die Arbeitszeiten zu verwalten</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl w-full">
        {businesses.map((biz) => (
          <button
            key={biz.id}
            onClick={() => onSelectBusiness(biz.id)}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-200 border border-gray-200 group bg-cover"
          >
            <div className="h-40 w-full flex items-center justify-center mb-4 p-4 bg-gray-50 rounded-xl overflow-hidden">
              <img 
                src={biz.logo} 
                alt={biz.name} 
                className="max-h-full max-w-full object-contain group-hover:scale-102 transition-transform duration-200"
              />
            </div>
            <span className="text-xl font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
              {biz.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};