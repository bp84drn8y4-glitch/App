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
    biz_fuerst_customers: ['Edeka Pocking', 'Gewerbepark Pleiskirchen', 'Rathaus Altötting', 'Klinikum Burghausen'],
    biz_fuerst_tasks: ['Außenreinigung Schaufenster und Eingangstüren', 'Innenreinigung Schaufenster und Eingangstüren', 'Beidseitige Reinigung von Glasflächen im Verkaufsbereich', 'Beidseitige Reinigung von Glasflächen im Mitarbeiterbereich', 'Zusätzliche Innenreinigung von Schaufenstern zu Dekorationsterminen mit zusätzlicher Anfahrt', 'Zusätzliche Innenreinigung von Schaufenstern zu Dekorationsterminen in Verbindung mit regelmäßiger Glasreinigung ohne zusätzliche Anfahrt', 'Reinigung von Spiegeln', 'Sonderleistungen und Sonstiges'],
    biz_fuerst_materials: [{n:'Müllbeutel Groß',s:'120 L'},{n:'Müllbeutel Medium',s:'60 L'},{n:'Müllbeutel Klein',s:'28 L'},{n:'Wischmopp Mikrofaser',s:'50 cm'},{n:'Wischmopp Baumwolle',s:'50 cm'},{n:'Mikrofaser Lappen rot',s:'40 x 40 cm'},{n:'Mikrofaser Lappen blau',s:'40 x 40 cm'},{n:'Mikrofaser Lappen grün',s:'40 x 40 cm'},{n:'Mikrofaser Lappen gelb',s:'40 x 40 cm'},{n:'Geschirrtücher',s:'70 x 50 cm'},{n:'Sanitärreiniger Milizid',s:'Sprühflasche'},{n:'Bodenreiniger Torrun',s:'Konzentrat'},{n:'Oberflächenreiniger',s:'Gebrauchsfertig'},{n:'Toilettenpapier',s:'Lagenware'},{n:'Falthandtücher',s:'Papier'},{n:'Handseife',s:'10 L Kanister'}],
    biz_bullauge_customers: ['Münchner Str. Filiale', 'Hauptbahnhof Express', 'Uni-Viertel Salon'],
    biz_bullauge_tasks: ['Maschinenreinigung', 'Kassenabrechnung', 'Flusensiebe leeren', 'Boden wischen & desinfizieren', 'Wäschepflege & Bügeln'],
    biz_bullauge_materials: [{n:'Handfolien',s:'Standard'},{n:'Bügelstärke',s:'Sprühflasche'},{n:'Chlor',s:'Bleichmittel'},{n:'Waschpulver',s:'20 kg'},{n:'Weichspüler',s:'20 L'},{n:'Sonstiges',s:'Verbrauchsmaterial'}]
  },
  at: {
    dashboardTitle: 'Arbeitsbereich', backBtn: '← Zurück zur Übersicht', logoutBtn: 'Abmelden', userLabel: 'Nutzer', navEntry: 'Datenerfassung', navRecords: 'Tagesübersicht', navMonthly: 'Monatsübersicht', navUsers: 'Mitarbeiter verwalten', navSettings: 'Einstellungen', headerData: 'Arbeitszeit & Material erfassen', headerRecords: 'Meine erfassten Tagesberichte', headerMonthly: 'Monatliche Arbeitsstunden', headerUsers: 'Neuen Mitarbeiter anlegen', headerSettings: 'Systemeinstellungen', labelCustomer: 'Kunde / Objekt', labelDate: 'Datum', labelStart: 'Beginn', labelEnd: 'Ende', labelTasks: 'Ausgeführte Tätigkeiten', labelNotes: 'Sonstiges / Notizen', btnAddTask: '+ Tätigkeit hinzufügen', btnSubmit: 'Eintrag Abschicken', matTitle: 'Materialverbrauch', matName: 'Materialbezeichnung', matOrdered: 'Mitgenommen', matReturned: 'Retoure', successMsg: 'Arbeitszeit erfolgreich und unveränderlich übermittelt!', adminNotice: 'Als Admin können Sie Einträge bearbeiten oder löschen.', thEmployee: 'Mitarbeiter', thHours: 'Stunden', langLabel: 'Sprachauswahl', noRecords: 'Keine Einträge für diesen Zeitraum vorhanden.', noTrackingRequired: 'Für diesen Unternehmensbereich ist keine separate Material- oder Aufgabenliste erforderlich. Bitte erfassen Sie Ihre Arbeitszeiten und Notizen unten.', lblNewUser: 'Benutzername', lblNewPass: 'Passwort', lblNewBiz: 'Zugeordnetes Unternehmen', btnCreateUser: 'Profil Erstellen', userCreatedMsg: 'Mitarbeiter-Profil erfolgreich angelegt!', thRole: 'Rolle', thBiz: 'Unternehmen', existingUsersTitle: 'Bestehende Profile im System', selectTaskPlaceholder: '-- Tätigkeit wählen --', closeMenu: '✕ Menü schließen',
    biz_fuerst_customers: ['Edeka Pocking', 'Gewerbepark Pleiskirchen', 'Rathaus Altötting', 'Klinikum Burghausen'],
    biz_fuerst_tasks: ['Außenreinigung Schaufenster und Eingangstüren', 'Innenreinigung Schaufenster und Eingangstüren', 'Beidseitige Reinigung von Glasflächen im Verkaufsbereich', 'Beidseitige Reinigung von Glasflächen im Mitarbeiterbereich', 'Zusätzliche Innenreinigung von Schaufenstern zu Dekorationsterminen mit zusätzlicher Anfahrt', 'Zusätzliche Innenreinigung von Schaufenstern zu Dekorationsterminen in Verbindung mit regelmäßiger Glasreinigung ohne zusätzliche Anfahrt', 'Reinigung von Spiegeln', 'Sonderleistungen und Sonstiges'],
    biz_fuerst_materials: [{n:'Müllbeutel Groß',s:'120 L'},{n:'Müllbeutel Medium',s:'60 L'},{n:'Müllbeutel Klein',s:'28 L'},{n:'Wischmopp Mikrofaser',s:'50 cm'},{n:'Wischmopp Baumwolle',s:'50 cm'},{n:'Mikrofaser Lappen rot',s:'40 x 40 cm'},{n:'Mikrofaser Lappen blau',s:'40 x 40 cm'},{n:'Mikrofaser Lappen grün',s:'40 x 40 cm'},{n:'Mikrofaser Lappen gelb',s:'40 x 40 cm'},{n:'Geschirrtücher',s:'70 x 50 cm'},{n:'Sanitärreiniger Milizid',s:'Sprühflasche'},{n:'Bodenreiniger Torrun',s:'Konzentrat'},{n:'Oberflächenreiniger',s:'Gebrauchsfertig'},{n:'Toilettenpapier',s:'Lagenware'},{n:'Falthandtücher',s:'Papier'},{n:'Handseife',s:'10 L Kanister'}],
    biz_bullauge_customers: ['Münchner Str. Filiale', 'Hauptbahnhof Express', 'Uni-Viertel Salon'],
    biz_bullauge_tasks: ['Maschinenreinigung', 'Kassenabrechnung', 'Flusensiebe leeren', 'Boden wischen & desinfizieren', 'Wäschepflege & Bügeln'],
    biz_bullauge_materials: [{n:'Handfolien',s:'Standard'},{n:'Bügelstärke',s:'Sprühflasche'},{n:'Chlor',s:'Bleichmittel'},{n:'Waschpulver',s:'20 kg'},{n:'Weichspüler',s:'20 L'},{n:'Sonstiges',s:'Verbrauchsmaterial'}]
  },
  en: {
    dashboardTitle: 'Workspace', backBtn: '← Back to Portal', logoutBtn: 'Logout', userLabel: 'User', navEntry: 'Data Entry', navRecords: 'Daily Log', navMonthly: 'Monthly Hours', navUsers: 'Manage Staff', navSettings: 'Settings', headerData: 'Log Hours & Materials', headerRecords: 'My Daily Records', headerMonthly: 'Monthly Worked Hours', headerUsers: 'Create New Employee Profile', headerSettings: 'System Settings', labelCustomer: 'Customer / Property', labelDate: 'Date', labelStart: 'Start Time', labelEnd: 'End Time', labelTasks: 'Executed Tasks', labelNotes: 'Miscellaneous / Notes', btnAddTask: '+ Add Task Line', btnSubmit: 'Submit Entry', matTitle: 'Material Tracking', matName: 'Material Name', matOrdered: 'Taken Out', matReturned: 'Returned', successMsg: 'Data logged successfully! Record is now locked.', adminNotice: 'Admin Mode: Editing and deletion rights granted.', thEmployee: 'Employee', thHours: 'Hours', langLabel: 'Select Language', noRecords: 'No tracking records found for this scope.', noTrackingRequired: 'No dedicated material or task lists are required for this business unit. Please log your working hours and notes below.', lblNewUser: 'Username', lblNewPass: 'Password', lblNewBiz: 'Assigned Business Unit', btnCreateUser: 'Create Profile', userCreatedMsg: 'Employee profile created successfully!', thRole: 'Role', thBiz: 'Business Scope', existingUsersTitle: 'Active System User Profiles', selectTaskPlaceholder: '-- Select Task --', closeMenu: '✕ Close Menu',
    biz_fuerst_customers: ['Edeka Pocking Branch', 'Pleiskirchen Business Park', 'Altötting Town Hall', 'Burghausen Clinic'],
    biz_fuerst_tasks: ['Exterior window & entrance door cleaning', 'Interior window & entrance door cleaning', 'Double-sided glass surface cleaning in sales area', 'Double-sided glass surface cleaning in staff area', 'Additional interior window cleaning for decoration dates with extra transit', 'Additional interior window cleaning for decoration dates combined with standard scheduling', 'Mirror surface cleaning', 'Special operational requests / Miscellaneous'],
    biz_fuerst_materials: [{n:'Trash Bag Large',s:'120 L'},{n:'Trash Bag Medium',s:'60 L'},{n:'Trash Bag Small',s:'28 L'},{n:'Microfiber Mop Head',s:'50 cm'},{n:'Cotton Mop Head',s:'50 cm'},{n:'Microfiber Cloth Red',s:'40 x 40 cm'},{n:'Microfiber Cloth Blue',s:'40 x 40 cm'},{n:'Microfiber Cloth Green',s:'40 x 40 cm'},{n:'Microfiber Cloth Yellow',s:'40 x 40 cm'},{n:'Kitchen Towels',s:'70 x 50 cm'},{n:'Sanitary Cleaner Milizid',s:'Spray Bottle'},{n:'Floor Cleaner Torrun',s:'Concentrate'},{n:'Surface Cleaner',s:'Ready-to-use'},{n:'Toilet Paper Rolls',s:'Layered'},{n:'Folded Paper Hand Towels',s:'Paper'},{n:'Liquid Hand Soap',s:'10 L Canister'}],
    biz_bullauge_customers: ['Münchner Str. Station', 'Central Station Express', 'University District Salon'],
    biz_bullauge_tasks: ['Washing machine deep clean', 'Register cash reconciliation', 'Empty lint lint traps', 'Floor mopping & disinfection', 'Laundry care & garment ironing'],
    biz_bullauge_materials: [{n:'Plastic Wrap Handrolls',s:'Standard'},{n:'Spray Starch',s:'Spray Bottle'},{n:'Chlorine Bleach',s:'Bleaching Agent'},{n:'Detergent Powder',s:'20 kg'},{n:'Fabric Softener',s:'20 L'},{n:'Miscellaneous Items',s:'Consumable Material'}]
  },
  it: {
    dashboardTitle: 'Area di lavoro', backBtn: '← Torna al portale', logoutBtn: 'Disconnetti', userLabel: 'Utente', navEntry: 'Inserimento Dati', navRecords: 'Registro Giornaliero', navMonthly: 'Ore Mensili', navUsers: 'Gestisci Staff', navSettings: 'Impostazioni', headerData: 'Registra Ore e Materiali', headerRecords: 'I Miei Registri Giornalieri', headerMonthly: 'Ore Lavorate Mensili', headerUsers: 'Crea Nuovo Profilo Dipendente', headerSettings: 'Impostazioni di Sistema', labelCustomer: 'Cliente / Oggetto', labelDate: 'Data', labelStart: 'Ora Inizio', labelEnd: 'Ora Fine', labelTasks: 'Attività Eseguite', labelNotes: 'Note / Varie', btnAddTask: '+ Aggiungi Riga Attività', btnSubmit: 'Invia Registrazione', matTitle: 'Tracciamento Materiali', matName: 'Nome Materiale', matOrdered: 'Prelevato', matReturned: 'Reso', successMsg: 'Dati registrati con successo! Il record è bloccato.', adminNotice: 'Modalità Admin: Diritti di modifica e cancellazione concessi.', thEmployee: 'Dipendente', thHours: 'Ore', langLabel: 'Seleziona Lingua', noRecords: 'Nessun record trovato per questo ambito.', noTrackingRequired: 'Non sono richieste liste materiali o attività per questa unità aziendale. Registra le tue ore e note qui sotto.', lblNewUser: 'Nome utente', lblNewPass: 'Password', lblNewBiz: 'Unità Aziendale Assegnata', btnCreateUser: 'Crea Profilo', userCreatedMsg: 'Profilo dipendente creato con successo!', thRole: 'Ruolo', thBiz: 'Ambito Aziendale', existingUsersTitle: 'Profili Utente Attivi', selectTaskPlaceholder: '-- Seleziona Attività --', closeMenu: '✕ Chiudi menu',
    biz_fuerst_customers: ['Edeka Pocking Filiale', 'Gewerbepark Pleiskirchen', 'Municipio Altötting', 'Clinica Burghausen'],
    biz_fuerst_tasks: ['Pulizia esterna vetrine e porte d\'ingresso', 'Pulizia interna vetrine e porte d\'ingresso', 'Pulizia bifacciale vetrate nella zona vendita', 'Pulizia bifacciale vetrate nella zona dipendenti', 'Pulizia interna vetrine straordinaria per decorazioni con viaggio extra', 'Pulizia interna vetrine per decorazioni abbinata alla pulizia regolare', 'Pulizia di specchi', 'Servizi speciali e vari'],
    biz_fuerst_materials: [{n:'Sacchi spazzatura grandi',s:'120 L'},{n:'Sacchi spazzatura medi',s:'60 L'},{n:'Sacchi spazzatura piccoli',s:'28 L'},{n:'Mocio in microfibra',s:'50 cm'},{n:'Mocio in cotone',s:'50 cm'},{n:'Panno in microfibra rosso',s:'40 x 40 cm'},{n:'Panno in microfibra blu',s:'40 x 40 cm'},{n:'Panno in microfibra verde',s:'40 x 40 cm'},{n:'Panno in microfibra giallo',s:'40 x 40 cm'},{n:'Asciugamani da cucina',s:'70 x 50 cm'},{n:'Detergente sanitario Milizid',s:'Flacone spray'},{n:'Detergente pavimenti Torrun',s:'Concentrato'},{n:'Detergente per superfici',s:'Pronto all\'uso'},{n:'Carta igienica',s:'A strati'},{n:'Asciugamani di carta piegati',s:'Carta'},{n:'Sapone per le mani',s:'Tanica da 10 litri'}],
    biz_bullauge_customers: ['Filiale Münchner Str.', 'Espresso Stazione Centrale', 'Salone del quartiere universitario'],
    biz_bullauge_tasks: ['Pulizia profonda lavatrici', 'Riconciliazione cassa', 'Svuotamento filtri lanugine', 'Lavaggio e disinfezione pavimenti', 'Cura della lavanderia e stiratura'],
    biz_bullauge_materials: [{n:'Pellicola trasparente rotoli',s:'Standard'},{n:'Appretto spray',s:'Flacone spray'},{n:'Cloro candeggina',s:'Agente sbiancante'},{n:'Detersivo in polvere',s:'20 kg'},{n:'Ammorbendente',s:'20 L'},{n:'Materiali di consumo vari',s:'Consumo'}]
  },
  fr: {
    dashboardTitle: 'Espace de travail', backBtn: '← Retour au portail', logoutBtn: 'Déconnexion', userLabel: 'Utilisateur', navEntry: 'Saisie de Données', navRecords: 'Journal Journalier', navMonthly: 'Heures Mensuelles', navUsers: 'Gérer le Personnel', navSettings: 'Paramètres', headerData: 'Saisir Heures & Matériaux', headerRecords: 'Mes Rapports Journaliers', headerMonthly: 'Heures Travaillées Mensuelles', headerUsers: 'Créer un Profil Employé', headerSettings: 'Paramètres Système', labelCustomer: 'Client / Objet', labelDate: 'Date', labelStart: 'Heure de Début', labelEnd: 'Heure de Fin', labelTasks: 'Tâches Exécutées', labelNotes: 'Notes / Divers', btnAddTask: '+ Ajouter une Ligne de Tâche', btnSubmit: 'Soumettre l\'Entrée', matTitle: 'Suivi des Matériaux', matName: 'Nom du Matériau', matOrdered: 'Emporté', matReturned: 'Retourné', successMsg: 'Données enregistrées avec succès ! Le rapport est verrouillé.', adminNotice: 'Mode Admin : Droits de modification et de suppression accordés.', thEmployee: 'Employé', thHours: 'Heures', langLabel: 'Choisir la Langue', noRecords: 'Aucun enregistrement trouvé pour cette période.', noTrackingRequired: 'Aucune liste de matériel ou de tâches dédiée n\'est requise pour cette unité. Veuillez saisir vos heures et notes ci-dessous.', lblNewUser: 'Nom d\'utilisateur', lblNewPass: 'Mot de passe', lblNewBiz: 'Unité Commerciale Assignée', btnCreateUser: 'Créer le Profil', userCreatedMsg: 'Profil employé créé avec succès !', thRole: 'Rôle', thBiz: 'Secteur d\'Activité', existingUsersTitle: 'Profils Utilisateurs Actifs', selectTaskPlaceholder: '-- Choisir une Tâche --', closeMenu: '✕ Fermer le menu',
    biz_fuerst_customers: ['Edeka Pocking Filiale', 'Zone commerciale Pleiskirchen', 'Mairie d\'Altötting', 'Clinique de Burghausen'],
    biz_fuerst_tasks: ['Nettoyage extérieur des vitrines et portes d\'entrée', 'Nettoyage intérieur des vitrines et portes d\'entrée', 'Nettoyage double face des surfaces vitrées - zone de vente', 'Nettoyage double face des surfaces vitrées - zone du personnel', 'Nettoyage intérieur des vitrines pour les dates de décoration avec déplacement', 'Nettoyage intérieur des vitrines pour la décoration combiné avec le nettoyage régulier', 'Nettoyage des miroirs', 'Prestations spéciales et divers'],
    biz_fuerst_materials: [{n:'Sacs poubelle grands',s:'120 L'},{n:'Sacs poubelle moyens',s:'60 L'},{n:'Sacs poubelle petits',s:'28 L'},{n:'Frange microfibre',s:'50 cm'},{n:'Frange coton',s:'50 cm'},{n:'Chiffon microfibre rouge',s:'40 x 40 cm'},{n:'Chiffon microfibre bleu',s:'40 x 40 cm'},{n:'Chiffon microfibre vert',s:'40 x 40 cm'},{n:'Chiffon microfibre jaune',s:'40 x 40 cm'},{n:'Torchons à vaisselle',s:'70 x 50 cm'},{n:'Nettoyant sanitaire Milizid',s:'Flacon spray'},{n:'Nettoyant pour sols Torrun',s:'Concentrate'},{n:'Nettoyant pour surfaces',s:'Prêt à l\'emploi'},{n:'Papier toilette',s:'En couches'},{n:'Essuie-mains en papier pliés',s:'Papier'},{n:'Savon pour les mains',s:'Bidon de 10 litres'}],
    biz_bullauge_customers: ['Filiale Münchner Str.', 'Gare centrale Express', 'Salon du quartier universitaire'],
    biz_bullauge_tasks: ['Nettoyage en profondeur des machines', 'Clôture de caisse', 'Vidage des filtres à peluches', 'Lavage et désinfection des sols', 'Entretien du linge et repassage'],
    biz_bullauge_materials: [{n:'Film étirable manuel rotatifs',s:'Standard'},{n:'Amidon en spray',s:'Flacon spray'},{n:'Chlore javellisant',s:'Agent de blanchiment'},{n:'Lessive en poudre',s:'20 kg'},{n:'Adoucissant text.',s:'20 L'},{n:'Consommables divers',s:'Consommation'}]
  },
  es: {
    dashboardTitle: 'Espacio de Trabajo', backBtn: '← Volver al Portal', logoutBtn: 'Cerrar Sesión', userLabel: 'Usuario', navEntry: 'Registro de Datos', navRecords: 'Registro Diario', navMonthly: 'Horas Mensuales', navUsers: 'Gestionar Personal', navSettings: 'Ajustes', headerData: 'Registrar Horas y Materiales', headerRecords: 'Mis Registros Diarios', headerMonthly: 'Horas Trabajadas Mensuales', headerUsers: 'Crear Perfil de Empleado', headerSettings: 'Ajustes del Sistema', labelCustomer: 'Cliente / Objeto', labelDate: 'Fecha', labelStart: 'Hora de Inicio', labelEnd: 'Hora de Finalización', labelTasks: 'Tareas Ejecutadas', labelNotes: 'Notas / Varios', btnAddTask: '+ Añadir Línea de Tarea', btnSubmit: 'Enviar Registro', matTitle: 'Control de Materiales', matName: 'Nombre del Material', matOrdered: 'Retirado', matReturned: 'Devuelto', successMsg: '¡Datos registrados con éxito! El registro está bloqueado.', adminNotice: 'Modo Administrador: Derechos de edición y eliminación concedidos.', thEmployee: 'Empleado', thHours: 'Horas', langLabel: 'Seleccionar Idioma', noRecords: 'No se encontraron registros para este ámbito.', noTrackingRequired: 'No se requieren listas específicas de materiales o tareas para esta unidad de negocio. Registre sus horas de trabajo y notas abajo.', lblNewUser: 'Nombre de usuario', lblNewPass: 'Contraseña', lblNewBiz: 'Unidad de Negocio Asignada', btnCreateUser: 'Crear Perfil', userCreatedMsg: '¡Perfil de empleado creado con éxito!', thRole: 'Rol', thBiz: 'Ámbito Comercial', existingUsersTitle: 'Perfiles de Usuario Activos', selectTaskPlaceholder: '-- Seleccionar Tarea --', closeMenu: '✕ Cerrar menú',
    biz_fuerst_customers: ['Sucursal Edeka Pocking', 'Parque empresarial Pleiskirchen', 'Ayuntamiento de Altötting', 'Clínica de Burghausen'],
    biz_fuerst_tasks: ['Limpieza exterior de escaparates y puertas de entrada', 'Limpieza interior de escaparates y puertas de entrada', 'Limpieza de cristales a dos caras en zona de ventas', 'Limpieza de cristales a dos caras en zona de empleados', 'Limpieza interior extra de escaparates por decoración con viaje adicional', 'Limpieza interior de escaparates por decoración junto con limpieza regular', 'Limpieza de espejos', 'Servicios especiales y varios'],
    biz_fuerst_materials: [{n:'Bolsas de basura grandes',s:'120 L'},{n:'Bolsas de basura medianas',s:'60 L'},{n:'Bolsas de basura pequeñas',s:'28 L'},{n:'Fregona de microfibra',s:'50 cm'},{n:'Fregona de algodón',s:'50 cm'},{n:'Paño de microfibra rojo',s:'40 x 40 cm'},{n:'Paño de microfibra azul',s:'40 x 40 cm'},{n:'Paño de microfibra verde',s:'40 x 40 cm'},{n:'Paño de microfibra amarillo',s:'40 x 40 cm'},{n:'Paños de cocina',s:'70 x 50 cm'},{n:'Limpiador sanitario Milizid',s:'Botella de spray'},{n:'Limpiador de suelos Torrun',s:'Concentrado'},{n:'Limpiador de superficies',s:'Listo para usar'},{n:'Papel higiénico',s:'Por capas'},{n:'Toallas de papel plegadas',s:'Papel'},{n:'Jabón de manos',s:'Garrafa de 10 litros'}],
    biz_bullauge_customers: ['Sucursal Münchner Str.', 'Estación Central Express', 'Salón del centro comercial'],
    biz_bullauge_tasks: ['Limpieza profunda de lavadoras', 'Conciliación de caja de efectivo', 'Vaciado de filtros de pelusa', 'Fregado y desinfección de suelos', 'Cuidado de lavandería y planchado'],
    biz_bullauge_materials: [{n:'Film transparente manual',s:'Estándar'},{n:'Almidón en aerosol',s:'Botella de spray'},{n:'Cloro blanqueador',s:'Agente blanqueador'},{n:'Detergente en polvo',s:'20 kg'},{n:'Suavizante',s:'20 L'},{n:'Materiales de consumo varios',s:'Consumo'}]
  },
  es_mx: {
    dashboardTitle: 'Espacio de Trabajo', backBtn: '← Volver al Portal', logoutBtn: 'Cerrar Sesión', userLabel: 'Usuario', navEntry: 'Registro de Datos', navRecords: 'Bitácora Diaria', navMonthly: 'Horas del Mes', navUsers: 'Administrar Personal', navSettings: 'Configuración', headerData: 'Registrar Horas y Materiales', headerRecords: 'Mis Bitácoras Diarias', headerMonthly: 'Horas Trabajadas en el Mes', headerUsers: 'Crear Perfil de Empleado', headerSettings: 'Configuración del Sistema', labelCustomer: 'Cliente / Objeto', labelDate: 'Fecha', labelStart: 'Hora de Entrada', labelEnd: 'Hora de Salida', labelTasks: 'Tareas Realizadas', labelNotes: 'Notas / Varios', btnAddTask: '+ Agregar Línea de Tarea', btnSubmit: 'Enviar Reporte', matTitle: 'Control de Materiales', matName: 'Nombre del Material', matOrdered: 'Surtido', matReturned: 'Devolución', successMsg: '¡Reporte guardado con éxito! El registro está bloqueado.', adminNotice: 'Modo Administrador: Permisos de edición y eliminación activados.', thEmployee: 'Empleado', thHours: 'Horas', langLabel: 'Seleccionar Idioma', noRecords: 'No hay registros en este periodo.', noTrackingRequired: 'No se requieren listas de materiales o tareas para esta área. Favor de registrar sus horas y notas abajo.', lblNewUser: 'Usuario', lblNewPass: 'Contraseña', lblNewBiz: 'Unidad de Negocio Asignada', btnCreateUser: 'Crear Perfil', userCreatedMsg: '¡Perfil de empleado creado con éxito!', thRole: 'Rol', thBiz: 'Área del Negocio', existingUsersTitle: 'Usuarios Activos del Sistema', selectTaskPlaceholder: '-- Seleccionar Tarea --', closeMenu: '✕ Cerrar menú',
    biz_fuerst_customers: ['Tienda Edeka Pocking', 'Parque industrial Pleiskirchen', 'Palacio Municipal Altötting', 'Clínica de Burghausen'],
    biz_fuerst_tasks: ['Limpieza exterior de aparadores y puertas de acceso', 'Limpieza interior de aparadores y puertas de acceso', 'Limpieza de cristales por ambos lados en piso de venta', 'Limpieza de cristales por ambos lados en área de personal', 'Limpieza interior extra de aparadores por montaje de exhibición con traslado', 'Limpieza interior de aparadores por montaje junto con limpieza programada', 'Limpieza de espejos', 'Servicios especiales y varios'],
    biz_fuerst_materials: [{n:'Bolsas de basura grandes',s:'120 L'},{n:'Bolsas de basura medianas',s:'60 L'},{n:'Bolsas de basura chicas',s:'28 L'},{n:'Mopa de microfibra',s:'50 cm'},{n:'Mopa de algodón',s:'50 cm'},{n:'Trapo de microfibra rojo',s:'40 x 40 cm'},{n:'Trapo de microfibra azul',s:'40 x 40 cm'},{n:'Trapo de microfibra verde',s:'40 x 40 cm'},{n:'Trapo de microfibra amarillo',s:'40 x 40 cm'},{n:'Toallas para trastes',s:'70 x 50 cm'},{n:'Limpiador de baños Milizid',s:'Atomizador'},{n:'Limpiador para pisos Torrun',s:'Concentrado'},{n:'Limpiador de superficies',s:'Listo para usar'},{n:'Papel higiénico rudo',s:'Por capas'},{n:'Toallas de papel interdobladas',s:'Papel'},{n:'Jabón líquido de manos',s:'Porrón de 10 litros'}],
    biz_bullauge_customers: ['Sucursal Münchner Str.', 'Express Estación Central', 'Lavandería Zona Universitaria'],
    biz_bullauge_tasks: ['Lavado profundo de maquinaria', 'Corte de caja matutino/vespertino', 'Limpieza de filtros de pelusa', 'Trapeado y desinfección de pisos', 'Cuidado de prendas y planchado'],
    biz_bullauge_materials: [{n:'Playo manual rollo',s:'Estándar'},{n:'Almidón en aerosol',s:'Atomizador'},{n:'Cloro líquido',s:'Blanqueador'},{n:'Detergente en polvo',s:'20 kg'},{n:'Suavizante de telas',s:'20 L'},{n:'Insumos de consumo varios',s:'Consumo'}]
  },
  uk: {
    dashboardTitle: 'Робочий простір', backBtn: '← Назад до порталу', logoutBtn: 'Вийти', userLabel: 'Користувач', navEntry: 'Введення даних', navRecords: 'Журнал за день', navMonthly: 'Години за місяць', navUsers: 'Управління персоналом', navSettings: 'Налаштування', headerData: 'Облік часу та матеріалів', headerRecords: 'Мої звіти за день', headerMonthly: 'Відпрацьовані години за місяць', headerUsers: 'Створити профіль співробітника', headerSettings: 'Налаштування системи', labelCustomer: 'Клієнт / Об\'єкт', labelDate: 'Дата', labelStart: 'Час початку', labelEnd: 'Час завершення', labelTasks: 'Виконані роботи', labelNotes: 'Примітки / Різне', btnAddTask: '+ Додати рядок роботи', btnSubmit: 'Надіслати запис', matTitle: 'Облік матеріалів', matName: 'Назва матеріалу', matOrdered: 'Взято', matReturned: 'Повернуто', successMsg: 'Дані успішно збережено! Запис заблоковано.', adminNotice: 'Режим адміна: Надано права на редагування та видалення.', thEmployee: 'Співробітник', thHours: 'Годин', langLabel: 'Вибір мови', noRecords: 'Записів для цього періоду не знайдено.', noTrackingRequired: 'Для цього підрозділу окремий облік матеріалів чи завдань не потрібен. Будь ласка, введіть робочий час та примітки нижче.', lblNewUser: 'Ім\'я користувача', lblNewPass: 'Пароль', lblNewBiz: 'Призначений підрозділ', btnCreateUser: 'Створити профіль', userCreatedMsg: 'Профіль співробітника успішно створено!', thRole: 'Роль', thBiz: 'Сфера бізнесу', existingUsersTitle: 'Активні профілі користувачів', selectTaskPlaceholder: '-- Оберіть завдання --', closeMenu: '✕ Закрити меню',
    biz_fuerst_customers: ['Філія Edeka Pocking', 'Бізнес-парк Pleiskirchen', 'Ратуша Altötting', 'Клініка Burghausen'],
    biz_fuerst_tasks: ['Зовнішнє миття вітрин та вхідних дверей', 'Внутрішнє миття вітрин та вхідних дверей', 'Двостороннє очищення скляних поверхонь у торговій зоні', 'Двостороннє очищення скляних поверхонь у зоні для персоналу', 'Додаткове внутрішнє миття вітрин перед оформленням з виїздом', 'Додаткове внутрішнє миття вітрин перед оформленням разом із регулярним прибиранням', 'Очищення дзеркал', 'Спеціальні послуги та інше'],
    biz_fuerst_materials: [{n:'Мішки для сміття великі',s:'120 л'},{n:'Мішки для сміття середні',s:'60 л'},{n:'Мішки для сміття малі',s:'28 л'},{n:'Швабра з мікрофібри',s:'50 см'},{n:'Швабра з бавовни',s:'50 см'},{n:'Серветка з мікрофібри червона',s:'40 х 40 см'},{n:'Серветка з мікрофібри синя',s:'40 х 40 см'},{n:'Серветка з мікрофібри зелена',s:'40 х 40 см'},{n:'Серветка з мікрофібри жовта',s:'40 х 40 см'},{n:'Кухонні рушники',s:'70 х 50 см'},{n:'Засіб для санвузлів Milizid',s:'Розпилювач'},{n:'Засіб für Boden Torrun',s:'Концентрат'},{n:'Засіб для поверхонь',s:'Готовий до використання'},{n:'Туалетний папір',s:'Рулонний'},{n:'Паперові рушники складені',s:'Папір'},{n:'Рідке мило для рук',s:'Каністра 10 л'}],
    biz_bullauge_customers: ['Філія на Münchner Str.', 'Експрес Головний вокзал', 'Салон в університетському кварталі'],
    biz_bullauge_tasks: ['Глубоке очищення пральних машин', 'Зведення каси', 'Очищення фільтрів від ворсу', 'Миття та дезінфекція підлоги', 'Догляд за білизною та прасування'],
    biz_bullauge_materials: [{n:'Стретч-плівка ручна',s:'Standard'},{n:'Крохмаль-спрей',s:'Розпилювач'},{n:'Хлорний відбілювач',s:'Рідина'},{n:'Пральний порошок',s:'20 кг'},{n:'Кондиціонер для білизни',s:'20 л'},{n:'Інші витратні матеріали',s:'Витратні матеріали'}]
  },
  hi: {
    dashboardTitle: 'कार्यक्षेत्र', backBtn: '← पोर्टल पर वापस जाएं', logoutBtn: 'लॉगआउट', userLabel: 'उपयोगकर्ता', navEntry: 'डेटा प्रविष्टि', navRecords: 'दैनिक लॉग', navMonthly: 'मासिक घंटे', navUsers: 'कर्मचारी प्रबंधन', navSettings: 'सेटिंग्स', headerData: 'समय और सामग्री दर्ज करें', headerRecords: 'मेरे दैनिक रिकॉर्ड', headerMonthly: 'मासिक कार्य के घंटे', headerUsers: 'नया कर्मचारी प्रोफाइल बनाएं', headerSettings: 'सिस्टम सेटिंग्स', labelCustomer: 'ग्राहक / ऑब्जेक्ट', labelDate: 'तारीख', labelStart: 'शुरू होने का समय', labelEnd: 'समाप्ति का समय', labelTasks: 'किए गए कार्य', labelNotes: 'विविध / नोट्स', btnAddTask: '+ कार्य पंक्ति जोड़ें', btnSubmit: 'रिकॉर्ड जमा करें', matTitle: 'सामग्री ट्रैकिंग', matName: 'सामग्री का नाम', matOrdered: 'लिया गया', matReturned: 'वापस किया', successMsg: 'डेटा सफलतापूर्वक दर्ज किया गया! रिकॉर्ड लॉक है।', adminNotice: 'एडमिन मोड: संपादन और हटाने के अधिकार दिए गए हैं।', thEmployee: 'कर्मचारी', thHours: 'घंटे', langLabel: 'भाषा चुनें', noRecords: 'इस कार्यक्षेत्र के लिए कोई रिकॉर्ड नहीं मिला।', noTrackingRequired: 'इस व्यावसायिक इकाई के लिए किसी समर्पित सामग्री या कार्य सूची की आवश्यकता नहीं है। कृपया नीचे अपने कार्य के घंटे और नोट्स दर्ज करें।', lblNewUser: 'यूज़रनेम', lblNewPass: 'पासवर्ड', lblNewBiz: 'सौंपी गई व्यावसायिक इकाई', btnCreateUser: 'प्रोफाइल बनाएं', userCreatedMsg: 'कर्मचारी प्रोफाइल सफलतापूर्वक बनाई गई!', thRole: 'भूमिका', thBiz: 'व्यवसाय का दायरा', existingUsersTitle: 'सक्रिय सिस्टम उपयोगकर्ता प्रोफाइल', selectTaskPlaceholder: '-- कार्य चुनें --', closeMenu: '✕ मेनू बंद करें',
    biz_fuerst_customers: ['एडेका पोकिंग शाखा', 'प्लीस्किर्चेन बिजनेस पार्क', 'अल्टोटिंग टाउन हॉल', 'बर्गहाउसेन क्लिनिक'],
    biz_fuerst_tasks: ['दुकान की खिड़कियों और प्रवेश द्वारों की बाहरी सफाई', 'दुकान की खिड़कियों और प्रवेश द्वारों की आंतरिक सफाई', 'बिक्री क्षेत्र में कांच की सतहों की दोनों तरफ से सफाई', 'कर्मचारी क्षेत्र में कांच की सतहों की दोनों तरफ से सफाई', 'अन्तरिक्ष पारगमन यात्रा के साथ सजावट तिथियों के लिए दुकान की खिड़कियों की अतिरिक्त आंतरिक सफाई', 'नियमित शेड्यूलिंग के साथ सजावट तिथियों के लिए अतिरिक्त आंतरिक सफाई', 'दर्पण की सतहों की सफाई', 'विशेष परिचालन अनुरोध / विविध'],
    biz_fuerst_materials: [{n:'कचरा बैग बड़ा',s:'120 लीटर'},{n:'कचरा बैग मध्यम',s:'60 लीटर'},{n:'कचरा बैग छोटा',s:'28 लीटर'},{n:'माइक्रोफाइबर मॉप हेड',s:'50 सेमी'},{n:'कॉटन मॉप हेड',s:'50 सेमी'},{n:'माइक्रोफाइबर कपड़ा लाल',s:'40 x 40 सेमी'},{n:'माइक्रोफाइबर कपड़ा नीला',s:'40 x 40 सेमी'},{n:'माइक्रोफाइबर कपड़ा हरा',s:'40 x 40 सेमी'},{n:'माइक्रोफाइबर कपड़ा पीला',s:'40 x 40 सेमी'},{n:'किचन टॉवल',s:'70 x 50 सेमी'},{n:'सैनिटरी क्लीनर मिलिज़िड',s:'स्प्रे बोतल'},{n:'फ्लोर क्लीनर टोरुन',s:'केंद्रित'},{n:'सतह क्लीनर',s:'उपयोग के लिए तैयार'},{n:'शौचालय के कागज रोल',s:'परतदार'},{n:'मुड़े हुए कागज के हाथ वाले तौलिए',s:'कागज'},{n:'तरल हाथ साबुन',s:'10 लीटर कैनिस्टर'}],
    biz_bullauge_customers: ['मुंचेनर स्ट्र. स्टेशन', 'सेंट्रल स्टेशन एक्सप्रेस', 'विश्वविद्यालय जिला सैलून'],
    biz_bullauge_tasks: ['वाशिंग मशीन की गहरी सफाई', 'रजिस्टर नकद मिलान', 'लिंट ट्रैप खाली करना', 'फर्श पोंछना और कीटाणुशोधन', 'कपड़ों की देखभाल और इस्त्री करना'],
    biz_bullauge_materials: [{n:'प्लास्टिक रैप हैंडरोल',s:'मानक'},{n:'स्प्रे स्टार्च',s:'स्प्रे बोतल'},{n:'क्लोरीन ब्लीच',s:'ब्लीचिंग एजेंट'},{n:'डिटर्जेंट पाउडर',s:'20 किलो'},{n:'फैब्रिक सॉफ़्नर',s:'20 लीटर'},{n:'विविध उपभोग्य सामग्रियां',s:'उपभोग'}]
  },
  ar: {
    dashboardTitle: 'مساحة العمل', backBtn: '← العودة إلى البوابة', logoutBtn: 'تسجيل الخروج', userLabel: 'المستخدم', navEntry: 'إدخال البيانات', navRecords: 'السجل اليومي', navMonthly: 'الساعات الشهرية', navUsers: 'إدارة الموظفين', navSettings: 'الإعدادات', headerData: 'تسجيل الساعات والمواد', headerRecords: 'سجلاتي اليومية', headerMonthly: 'ساعات العمل الشهرية', headerUsers: 'إنشاء ملف موظف جديد', headerSettings: 'إعدادات النظام', labelCustomer: 'العميل / الموقع', labelDate: 'التاريخ', labelStart: 'وقت البدء', labelEnd: 'وقت الانتهاء', labelTasks: 'المهام المنفذة', labelNotes: 'ملاحظات / متنوع', btnAddTask: '+ إضافة سطر مهام', btnSubmit: 'إرسال السجل', matTitle: 'تتبع المواد', matName: 'اسم المادة', matOrdered: 'المأخوذ', matReturned: 'المرتجع', successMsg: 'تم تسجيل البيانات بنجاح! السجل مقفل الآن.', adminNotice: 'وضع المسؤول: تم منح صلاحيات التعديل والحذف.', thEmployee: 'الموظف', thHours: 'الساعات', langLabel: 'اختر اللغة', noRecords: 'لم يتم العثور على سجلات لهذه الفترة.', noTrackingRequired: 'لا توجد قوائم مهام أو مواد مخصصة مطلوبة لوحدة العمل هذه. يرجى تسجيل ساعات عملك وملاحظاتك أدناه.', lblNewUser: 'اسم المستخدم', lblNewPass: 'كلمة المرور', lblNewBiz: 'وحدة العمل المعينة', btnCreateUser: 'إنشاء الملف الشخصي', userCreatedMsg: 'تم إنشاء ملف الموظف بنجاح!', thRole: 'الدور', thBiz: 'نطاق العمل', existingUsersTitle: 'ملفات المستخدمين النشطة في النظام', selectTaskPlaceholder: '-- اختر المهمة --', closeMenu: '✕ إغلاق القائمة',
    biz_fuerst_customers: ['فرع إيديكا بوكينج', 'مجمع بليسكيرشن الصناعي', 'بلدية ألتوتينغ', 'عيادة بورغهاوزن'],
    biz_fuerst_tasks: ['تنظيف خارجي للنوافذ وأبواب المداخل', 'تنظيف داخلي للنوافذ وأبواب المداخل', 'تنظيف الزجاج من الجهتين في صالة العرض', 'تنظيف الزجاج من الجهتين في قسم الموظفين', 'تنظيف داخلي إضافي للنوافذ لمواعيد الديكور مع انتقال خارجي', 'تنظيف داخلي إضافي للنوافذ لمواعيد الديكور مع التنظيف الدوري بالجدول', 'تنظيف المرايا والأسطح العاكسة', 'خدمات تشغيلية خاصة ومتنوعة'],
    biz_fuerst_materials: [{n:'أكياس قمامة كبيرة',s:'120 لتر'},{n:'أكياس قمامة متوسطة',s:'60 لتر'},{n:'أكياس قمامة صغيرة',s:'28 لتر'},{n:'ممسحة أرضيات مايكروفايبر',s:'50 سم'},{n:'ممسحة أرضيات قطن',s:'50 سم'},{n:'خرقة مايكروفايبر حمراء',s:'40 × 40 سم'},{n:'خرقة مايكروفايبر زرقاء',s:'40 × 40 سم'},{n:'خرقة مايكروفايبر خضراء',s:'40 × 40 سم'},{n:'خرقة مايكروفايبر صفراء',s:'40 × 40 سم'},{n:'مناشف مطبخ صحون',s:'70 × 50 سم'},{n:'منظف الحمامات ميليزيد',s:'بخاخ'},{n:'منظف الأرضيات تورون',s:'مركز'},{n:'منظف أسطح عام',s:'جاهز للاستخدام'},{n:'ورق تواليت رول',s:'طبقات'},{n:'مناشف ورقية مطوية للأيدي',s:'ورق'},{n:'صابون سائل للأيدي',s:'جالون 10 لتر'}],
    biz_bullauge_customers: ['فرع شارع ميونخ', 'محطة القطار المركزية إكسبريس', 'صالون الحي الجامعي'],
    biz_bullauge_tasks: ['تنظيف عميق لغسالات الملابس', 'مطابقة عهدة النقدية بالخزينة', 'تفريغ وتطهير فلاتر الوبر', 'مسح وتعقيم الأرضيات', 'العناية بالملابس والكي والمغسلة'],
    biz_bullauge_materials: [{n:'رول تغليف بلاستيك يدوي',s:'قياسي'},{n:'نشا ملابس بخاخ',s:'زجاجة بخاخ'},{n:'مبيض كلورين سائل',s:'مبيض'},{n:'مسحوق غسيل ملابس',s:'20 كجم'},{n:'منعم أقمشة ملابس',s:'20 لتر'},{n:'مواد ومستلزمات استهلاكية عامة',s:'استهلاك'}]
  },
  ru: {
    dashboardTitle: 'Рабочая область', backBtn: '← Назад в портал', logoutBtn: 'Выйти', userLabel: 'Пользователь', navEntry: 'Ввод данных', navRecords: 'Дневной журнал', navMonthly: 'Часы за месяц', navUsers: 'Управление персоналом', navSettings: 'Настройки', headerData: 'Учет времени и материалов', headerRecords: 'Мои дневные отчеты', headerMonthly: 'Отработанные часы за месяц', headerUsers: 'Создать профиль сотрудника', headerSettings: 'Системные настройки', labelCustomer: 'Клиент / Объект', labelDate: 'Дата', labelStart: 'Время начала', labelEnd: 'Время окончания', labelTasks: 'Выполненные работы', labelNotes: 'Примечания / Разное', btnAddTask: '+ Добавить строку работы', btnSubmit: 'Отправить запись', matTitle: 'Учет материалов', matName: 'Название материала', matOrdered: 'Взято', matReturned: 'Возвращено', successMsg: 'Данные успешно сохранены! Запись заблокирована.', adminNotice: 'Режим админа: Предоставлены права на редактирование и удаление.', thEmployee: 'Сотрудник', thHours: 'Часы', langLabel: 'Выбор языка', noRecords: 'Записей для этого периода не найдено.', noTrackingRequired: 'Для этого подразделения отдельный учет материалов или задач не требуется. Пожалуйста, введите рабочее время и примечания ниже.', lblNewUser: 'Имя пользователя', lblNewPass: 'Пароль', lblNewBiz: 'Назначенное подразделение', btnCreateUser: 'Создать профиль', userCreatedMsg: 'Профиль сотрудника успешно создан!', thRole: 'Роль', thBiz: 'Сфера бизнеса', existingUsersTitle: 'Активные профили пользователей', selectTaskPlaceholder: '-- Выберите задачу --', closeMenu: '✕ Закрыть меню',
    biz_fuerst_customers: ['Филиал Edeka Pocking', 'Бизнес-парк Pleiskirchen', 'Ратуша Altötting', 'Клиника Burghausen'],
    biz_fuerst_tasks: ['Наружная мойка витрин и входных дверей', 'Внутренняя мойка витрин и входных дверей', 'Двусторонняя очистка стеклянных поверхностей в торговой зоне', 'Двусторонняя очистка стеклянных поверхностей в зоне для персонала', 'Дополнительная внутренняя мойка витрин перед оформлением с выездом', 'Дополнительная внутренняя мойка витрин перед оформлением вместе с регулярной уборкой', 'Очистка зеркал', 'Специальные услуги и прочее'],
    biz_fuerst_materials: [{n:'Мешки для мусора большие',s:'120 л'},{n:'Мешки для мусора средние',s:'60 л'},{n:'Мешки для мусора малые',s:'28 л'},{n:'Швабра из микрофибры',s:'50 см'},{n:'Швабра из хлопка',s:'50 см'},{n:'Салфетка из микрофибры красная',s:'40 х 40 см'},{n:'Салфетка из микрофибры синяя',s:'40 х 40 см'},{n:'Салфетка из микрофибры зеленая',s:'40 х 40 см'},{n:'Салфетка из микрофибры желтая',s:'40 х 40 см'},{n:'Кухонные полотенца',s:'70 х 50 см'},{n:'Санитарный очиститель Milizid',s:'Распылитель'},{n:'Очиститель пола Torrun',s:'Концентрат'},{n:'Очиститель поверхностей',s:'Готовый к использованию'},{n:'Туалетная бумага',s:'Рулонная'},{n:'Бумажные полотенца сложенные',s:'Бумага'},{n:'Жидкое мыло для рук',s:'Канистра 10 л'}],
    biz_bullauge_customers: ['Филиал на Münchner Str.', 'Экспресс Главный вокзал', 'Салон в университетском квартале'],
    biz_bullauge_tasks: ['Глубокая очистка стиральных машин', 'Сведение кассы', 'Очистка фильтров от ворса', 'Мытье и дезинфекция полов', 'Уход за бельем и глажка'],
    biz_bullauge_materials: [{n:'Стретч-пленка ручная',s:'Стандарт'},{n:'Крахмал-спрей',s:'Распылитель'},{n:'Хлорный отбеливатель',s:'Жидкость'},{n:'Стиральный порошок',s:'20 кг'},{n:'Кондиционер для белья',s:'20 л'},{n:'Прочие расходные материалы',s:'Расходные материалы'} ]
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
  
  // Dynamic calculation fallback hooks
  const t = translations[language] || translations.de;
  const isRTL = language === 'ar';

  // Extract Localized Business Configuration Arrays Dynamically
  const currentCustomers: string[] = t[`biz_${businessId}_customers`] || t.biz_fuerst_customers || [];
  const currentTasks: string[] = t[`biz_${businessId}_tasks`] || t.biz_fuerst_tasks || [];
  const rawMaterials: any[] = t[`biz_${businessId}_materials`] || t.biz_fuerst_materials || [];

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

  // Persistent Mock Database Context Arrays
  const [allRecords, setAllRecords] = useState<SubmittedRecord[]>([]);
  const [systemUsers, setSystemUsers] = useState<UserProfile[]>([
    { id: '1', username: 'admin', role: 'admin', businessId: 'fuerst_hauser' },
    { id: '2', username: 'demo_staff', role: 'employee', businessId: 'bullauge' }
  ]);

  // Sync rows dynamically whenever businessId OR active language configuration context mutates
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const currentEntry: SubmittedRecord = {
      id: `record-${Date.now()}`,
      employee: username || 'Mitarbeiter',
      date,
      customer: scopeConfig.requiresDetailedTracking ? customer : 'Standardbetrieb',
      startTime,
      endTime,
      tasks: scopeConfig.requiresDetailedTracking ? selectedTasks.filter(tk => tk !== '') : ['Allgemeine Betriebstätigkeiten'],
      materials: scopeConfig.requiresDetailedTracking 
        ? materialRows.filter(r => r.ordered > 0 || r.returned > 0).map(r => ({ name: r.name, ordered: r.ordered, returned: r.returned }))
        : [],
      notes: miscellaneous
    };

    setAllRecords(prev => [currentEntry, ...prev]);
    setFormStatus(t.successMsg);

    setMiscellaneous('');
    if (scopeConfig.requiresDetailedTracking) {
      setSelectedTasks(['']);
      const resetRows = rawMaterials.map(m => ({ name: m.n, specification: m.s, ordered: 0, returned: 0 }));
      setMaterialRows(resetRows);
    }

    setTimeout(() => setFormStatus(null), 5000);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) return;

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      username: newUsername,
      role: 'employee',
      businessId: newBusinessScope
    };

    setSystemUsers(prev => [...prev, newUser]);
    setUserSuccessStatus(t.userCreatedMsg);
    
    setNewUsername('');
    setNewPassword('');

    setTimeout(() => setUserSuccessStatus(null), 4000);
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
    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);
    const deltaMin = (eH * 60 + eM) - (sH * 60 + sM);
    return deltaMin > 0 ? (deltaMin / 60).toFixed(2) : '0.00';
  };

  const filteredRecords = allRecords.filter(rec => {
    if (userRole === 'admin') return true;
    return rec.employee.toLowerCase() === username.toLowerCase();
  });

  const handleNavClick = (tab: 'entry' | 'records' | 'monthly' | 'users' | 'settings') => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // Auto-close sidebar panel drawer layout on small mobile action click
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f1f5f9', overflow: 'hidden', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
      
      {/* INJECT DYNAMIC MEDIA QUERY STYLE SPECIFICATIONS DIRECTLY FOR PORTABLE DRAWER SUPPORT */}
      <style>{`
        @media (max-width: 768px) {
          .responsive-sidebar {
            position: fixed !important;
            top: 0;
            bottom: 0;
            left: ${isRTL ? 'auto' : '0'} !important;
            right: ${isRTL ? '0' : 'auto'} !important;
            transform: ${isSidebarOpen ? 'translateX(0)' : isRTL ? 'translateX(100%)' : 'translateX(-100%)'} !important;
            z-index: 9999 !important;
            transition: transform 0.3s ease-in-out !important;
            box-shadow: 4px 0 15px rgba(0,0,0,0.2) !important;
          }
          .sidebar-close-btn {
            display: block !important;
          }
          .mobile-trigger-header-btn {
            display: block !important;
          }
        }
      `}</style>

      {/* SIDEBAR NAVIGATION MENU */}
      <div 
        className="responsive-sidebar"
style={{ width: '280px', padding: '20px 0', borderRight: '1px solid #334155', height: '100vh', float: isRTL ? 'right' : 'left', flexShrink: 0 }}
      >
        <div>
          <div style={{ padding: '0 20px 20px 20px', borderBottom: '1px solid #334155', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
            {/* CLOSE BUTTON Inside side menu container (Automatically hidden dynamically on Wide Screen Devices) */}
            <button 
              className="sidebar-close-btn"
              onClick={() => setIsSidebarOpen(false)}
              style={{ display: 'none', width: '100%', padding: '8px 12px', backgroundColor: '#334155', color: '#f8fafc', border: '1px solid #475569', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '5px' }}
            >
              {t.closeMenu || '✕ Close'}
            </button>

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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', textAlign: isRTL ? 'right' : 'left' }} dir={isRTL ? 'rtl' : 'ltr'}>
        
        <header style={{ height: '60px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px' }}>
          
          {/* HAMBURGER TRIGGER BUTTON FOR MOBILE USERS (Hidden default on wide viewport desktops) */}
          <button
            className="mobile-trigger-header-btn"
            onClick={() => setIsSidebarOpen(true)}
            style={{ display: 'none', padding: '8px 12px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}
          >
            ☰
          </button>

          <span style={{ fontSize: '0.9rem', color: '#64748b', marginLeft: isRTL ? 'auto' : '0', marginRight: isRTL ? '0' : 'auto', paddingLeft: isRTL ? '0' : '15px', paddingRight: isRTL ? '15px' : '0' }}>
            {t.userLabel}: <strong style={{ color: '#0f172a' }}>{username}</strong> (<span style={{ color: userRole === 'admin' ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>{userRole}</span>)
          </span>
        </header>

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

                  {/* MATERIAL CONSUMPTION MODULE */}
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
              {filteredRecords.length === 0 ? (
                <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', textAlign: 'center', color: '#64748b' }}>{t.noRecords}</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {filteredRecords.map((rec) => (
                    <div key={rec.id} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: isRTL ? 'none' : '4px solid #3b82f6', borderRight: isRTL ? '4px solid #3b82f6' : 'none' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '15px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                        <div>
                          <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>{rec.customer}</strong>
                          <span style={{ marginLeft: isRTL ? '0' : '15px', marginRight: isRTL ? '15px' : '0', color: '#64748b', fontSize: '0.9rem' }}>📅 {rec.date}</span>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#334155' }}>
                          ⏱ <strong>{rec.startTime} - {rec.endTime}</strong> ({calculateHours(rec.startTime, rec.endTime)} {t.thHours})
                          {userRole === 'admin' && (
                            <button onClick={() => setAllRecords(prev => prev.filter(r => r.id !== rec.id))} style={{ marginLeft: isRTL ? '0' : '15px', marginRight: isRTL ? '15px' : '0', padding: '4px 8px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>
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
                    <th style={{ padding: '12px' }}>{t.thEmployee}</th>
                    <th style={{ padding: '12px' }}>{t.thHours}</th>
                  </tr>
                </thead>
                <tbody>
                  {userRole === 'admin' ? (
                    Object.entries(
                      allRecords.reduce((acc, r) => {
                        const hrs = parseFloat(calculateHours(r.startTime, r.endTime));
                        acc[r.employee] = (acc[r.employee] || 0) + hrs;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([emp, hrs], i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px', fontWeight: 'bold', color: '#334155' }}>{emp}</td>
                        <td style={{ padding: '12px', color: '#10b981', fontWeight: 'bold' }}>{hrs.toFixed(2)} {t.thHours}</td>
                      </tr>
                    ))
                  ) : (
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold', color: '#334155' }}>{username}</td>
                      <td style={{ padding: '12px', color: '#10b981', fontWeight: 'bold' }}>
                        {filteredRecords.reduce((sum, r) => sum + parseFloat(calculateHours(r.startTime, r.endTime)), 0).toFixed(2)} {t.thHours}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* VIEWPORT 4: ADMIN ONLY PROFILE ADDITION MODULE */}
          {activeTab === 'users' && userRole === 'admin' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>
              
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
