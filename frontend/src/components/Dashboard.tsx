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

const translations: Record<string, Record<string, string>> = {
  de: {
    dashboardTitle: 'Arbeitsbereich', backBtn: '← Zurück zur Übersicht', logoutBtn: 'Abmelden', userLabel: 'Nutzer', navEntry: 'Datenerfassung', navRecords: 'Tagesübersicht', navMonthly: 'Monatsübersicht', navUsers: 'Mitarbeiter verwalten', navSettings: 'Einstellungen', headerData: 'Arbeitszeit & Material erfassen', headerRecords: 'Meine erfassten Tagesberichte', headerMonthly: 'Monatliche Arbeitsstunden', headerUsers: 'Neuen Mitarbeiter anlegen', headerSettings: 'Systemeinstellungen', labelCustomer: 'Kunde / Objekt', labelDate: 'Datum', labelStart: 'Beginn', labelEnd: 'Ende', labelTasks: 'Ausgeführte Tätigkeiten', labelNotes: 'Sonstiges / Notizen', btnAddTask: '+ Tätigkeit hinzufügen', btnSubmit: 'Eintrag Abschicken', matTitle: 'Materialverbrauch', matName: 'Materialbezeichnung', matOrdered: 'Mitgenommen', matReturned: 'Retoure', successMsg: 'Arbeitszeit erfolgreich und unveränderlich übermittelt!', adminNotice: 'Als Admin können Sie Einträge bearbeiten oder löschen.', thEmployee: 'Mitarbeiter', thHours: 'Stunden', langLabel: 'Sprachauswahl', noRecords: 'Keine Einträge für diesen Zeitraum vorhanden.', noTrackingRequired: 'Für diesen Unternehmensbereich ist keine separate Material- oder Aufgabenliste erforderlich. Bitte erfassen Sie Ihre Arbeitszeiten und Notizen unten.', lblNewUser: 'Benutzername', lblNewPass: 'Passwort', lblNewBiz: 'Zugeordnetes Unternehmen', btnCreateUser: 'Profil Erstellen', userCreatedMsg: 'Mitarbeiter-Profil erfolgreich angelegt!', thRole: 'Rolle', thBiz: 'Unternehmen', existingUsersTitle: 'Bestehende Profile im System', selectTaskPlaceholder: '-- Tätigkeit wählen --'
  },
  at: {
    dashboardTitle: 'Arbeitsbereich', backBtn: '← Zurück zur Übersicht', logoutBtn: 'Abmelden', userLabel: 'Nutzer', navEntry: 'Datenerfassung', navRecords: 'Tagesübersicht', navMonthly: 'Monatsübersicht', navUsers: 'Mitarbeiter verwalten', navSettings: 'Einstellungen', headerData: 'Arbeitszeit & Material erfassen', headerRecords: 'Meine erfassten Tagesberichte', headerMonthly: 'Monatliche Arbeitsstunden', headerUsers: 'Neuen Mitarbeiter anlegen', headerSettings: 'Systemeinstellungen', labelCustomer: 'Kunde / Objekt', labelDate: 'Datum', labelStart: 'Beginn', labelEnd: 'Ende', labelTasks: 'Ausgeführte Tätigkeiten', labelNotes: 'Sonstiges / Notizen', btnAddTask: '+ Tätigkeit hinzufügen', btnSubmit: 'Eintrag Abschicken', matTitle: 'Materialverbrauch', matName: 'Materialbezeichnung', matOrdered: 'Mitgenommen', matReturned: 'Retoure', successMsg: 'Arbeitszeit erfolgreich und unveränderlich übermittelt!', adminNotice: 'Als Admin können Sie Einträge bearbeiten oder löschen.', thEmployee: 'Mitarbeiter', thHours: 'Stunden', langLabel: 'Sprachauswahl', noRecords: 'Keine Einträge für diesen Zeitraum vorhanden.', noTrackingRequired: 'Für diesen Unternehmensbereich ist keine separate Material- oder Aufgabenliste erforderlich. Bitte erfassen Sie Ihre Arbeitszeiten und Notizen unten.', lblNewUser: 'Benutzername', lblNewPass: 'Passwort', lblNewBiz: 'Zugeordnetes Unternehmen', btnCreateUser: 'Profil Erstellen', userCreatedMsg: 'Mitarbeiter-Profil erfolgreich angelegt!', thRole: 'Rolle', thBiz: 'Unternehmen', existingUsersTitle: 'Bestehende Profile im System', selectTaskPlaceholder: '-- Tätigkeit wählen --'
  },
  en: {
    dashboardTitle: 'Workspace', backBtn: '← Back to Portal', logoutBtn: 'Logout', userLabel: 'User', navEntry: 'Data Entry', navRecords: 'Daily Log', navMonthly: 'Monthly Hours', navUsers: 'Manage Staff', navSettings: 'Settings', headerData: 'Log Hours & Materials', headerRecords: 'My Daily Records', headerMonthly: 'Monthly Worked Hours', headerUsers: 'Create New Employee Profile', headerSettings: 'System Settings', labelCustomer: 'Customer / Object', labelDate: 'Date', labelStart: 'Start Time', labelEnd: 'End Time', labelTasks: 'Executed Tasks', labelNotes: 'Miscellaneous / Notes', btnAddTask: '+ Add Task Line', btnSubmit: 'Submit Entry', matTitle: 'Material Tracking', matName: 'Material Name', matOrdered: 'Taken Out', matReturned: 'Returned', successMsg: 'Data logged successfully! Record is now locked.', adminNotice: 'Admin Mode: Editing and deletion rights granted.', thEmployee: 'Employee', thHours: 'Hours', langLabel: 'Select Language', noRecords: 'No tracking records found for this scope.', noTrackingRequired: 'No dedicated material or task lists are required for this business unit. Please log your working hours and notes below.', lblNewUser: 'Username', lblNewPass: 'Password', lblNewBiz: 'Assigned Business Unit', btnCreateUser: 'Create Profile', userCreatedMsg: 'Employee profile created successfully!', thRole: 'Role', thBiz: 'Business Scope', existingUsersTitle: 'Active System User Profiles', selectTaskPlaceholder: '-- Select Task --'
  },
  it: {
    dashboardTitle: 'Area di lavoro', backBtn: '← Torna al portale', logoutBtn: 'Disconnetti', userLabel: 'Utente', navEntry: 'Inserimento Dati', navRecords: 'Registro Giornaliero', navMonthly: 'Ore Mensili', navUsers: 'Gestisci Staff', navSettings: 'Impostazioni', headerData: 'Registra Ore e Materiali', headerRecords: 'I Miei Registri Giornalieri', headerMonthly: 'Ore Lavorate Mensili', headerUsers: 'Crea Nuovo Profilo Dipendente', headerSettings: 'Impostazioni di Sistema', labelCustomer: 'Cliente / Oggetto', labelDate: 'Data', labelStart: 'Ora Inizio', labelEnd: 'Ora Fine', labelTasks: 'Attività Eseguite', labelNotes: 'Note / Varie', btnAddTask: '+ Aggiungi Riga Attività', btnSubmit: 'Invia Registrazione', matTitle: 'Tracciamento Materiali', matName: 'Nome Materiale', matOrdered: 'Prelevato', matReturned: 'Reso', successMsg: 'Dati registrati con successo! Il record è bloccato.', adminNotice: 'Modalità Admin: Diritti di modifica e cancellazione concessi.', thEmployee: 'Dipendente', thHours: 'Ore', langLabel: 'Seleziona Lingua', noRecords: 'Nessun record trovato per questo ambito.', noTrackingRequired: 'Non sono richieste liste materiali o attività per questa unità aziendale. Registra le tue ore e note qui sotto.', lblNewUser: 'Nome utente', lblNewPass: 'Password', lblNewBiz: 'Unità Aziendale Assegnata', btnCreateUser: 'Crea Profilo', userCreatedMsg: 'Profilo dipendente creato con successo!', thRole: 'Ruolo', thBiz: 'Ambito Aziendale', existingUsersTitle: 'Profili Utente Attivi', selectTaskPlaceholder: '-- Seleziona Attività --'
  },
  fr: {
    dashboardTitle: 'Espace de travail', backBtn: '← Retour au portail', logoutBtn: 'Déconnexion', userLabel: 'Utilisateur', navEntry: 'Saisie de Données', navRecords: 'Journal Journalier', navMonthly: 'Heures Mensuelles', navUsers: 'Gérer le Personnel', navSettings: 'Paramètres', headerData: 'Saisir Heures & Matériaux', headerRecords: 'Mes Rapports Journaliers', headerMonthly: 'Heures Travaillées Mensuelles', headerUsers: 'Créer un Profil Profil Employé', headerSettings: 'Paramètres Système', labelCustomer: 'Client / Objet', labelDate: 'Date', labelStart: 'Heure de Début', labelEnd: 'Heure de Fin', labelTasks: 'Tâches Exécutées', labelNotes: 'Notes / Divers', btnAddTask: '+ Ajouter une Ligne de Tâche', btnSubmit: 'Soumettre l\'Entrée', matTitle: 'Suivi des Matériaux', matName: 'Nom du Matériau', matOrdered: 'Emporté', matReturned: 'Retourné', successMsg: 'Données enregistrées avec succès ! Le rapport est verrouillé.', adminNotice: 'Mode Admin : Droits de modification et de suppression accordés.', thEmployee: 'Employé', thHours: 'Heures', langLabel: 'Choisir la Langue', noRecords: 'Aucun enregistrement trouvé pour cette période.', noTrackingRequired: 'Aucune liste de matériel ou de tâches dédiée n\'est requise pour cette unité. Veuillez saisir vos heures et notes ci-dessous.', lblNewUser: 'Nom d\'utilisateur', lblNewPass: 'Mot de passe', lblNewBiz: 'Unité Commerciale Assignée', btnCreateUser: 'Créer le Profil', userCreatedMsg: 'Profil employé créé avec succès !', thRole: 'Rôle', thBiz: 'Secteur d\'Activité', existingUsersTitle: 'Profils Utilisateurs Actifs', selectTaskPlaceholder: '-- Choisir une Tâche --'
  },
  es: {
    dashboardTitle: 'Espacio de Trabajo', backBtn: '← Volver al Portal', logoutBtn: 'Cerrar Sesión', userLabel: 'Usuario', navEntry: 'Registro de Datos', navRecords: 'Registro Diario', navMonthly: 'Horas Mensuales', navUsers: 'Gestionar Personal', navSettings: 'Ajustes', headerData: 'Registrar Horas y Materiales', headerRecords: 'Mis Registros Diarios', headerMonthly: 'Horas Trabajadas Mensuales', headerUsers: 'Crear Perfil de Empleado', headerSettings: 'Ajustes del Sistema', labelCustomer: 'Cliente / Objeto', labelDate: 'Fecha', labelStart: 'Hora de Inicio', labelEnd: 'Hora de Finalización', labelTasks: 'Tareas Ejecutadas', labelNotes: 'Notas / Varios', btnAddTask: '+ Añadir Línea de Tarea', btnSubmit: 'Enviar Registro', matTitle: 'Control de Materiales', matName: 'Nombre del Material', matOrdered: 'Retirado', matReturned: 'Devuelto', successMsg: '¡Datos registrados con éxito! El registro está bloqueado.', adminNotice: 'Modo Administrador: Derechos de edición y eliminación concedidos.', thEmployee: 'Empleado', thHours: 'Horas', langLabel: 'Seleccionar Idioma', noRecords: 'No se encontraron registros para este ámbito.', noTrackingRequired: 'No se requieren listas específicas de materiales o tareas para esta unidad de negocio. Registre sus horas de trabajo y notas abajo.', lblNewUser: 'Nombre de usuario', lblNewPass: 'Contraseña', lblNewBiz: 'Unidad de Negocio Asignada', btnCreateUser: 'Crear Perfil', userCreatedMsg: '¡Perfil de empleado creado con éxito!', thRole: 'Rol', thBiz: 'Ámbito Comercial', existingUsersTitle: 'Perfiles de Usuario Activos', selectTaskPlaceholder: '-- Seleccionar Tarea --'
  },
  es_mx: {
    dashboardTitle: 'Espacio de Trabajo', backBtn: '← Volver al Portal', logoutBtn: 'Cerrar Sesión', userLabel: 'Usuario', navEntry: 'Registro de Datos', navRecords: 'Bitácora Diaria', navMonthly: 'Horas del Mes', navUsers: 'Administrar Personal', navSettings: 'Configuración', headerData: 'Registrar Horas y Materiales', headerRecords: 'Mis Bitácoras Diarias', headerMonthly: 'Horas Trabajadas en el Mes', headerUsers: 'Crear Perfil de Empleado', headerSettings: 'Configuración del Sistema', labelCustomer: 'Cliente / Objeto', labelDate: 'Fecha', labelStart: 'Hora de Entrada', labelEnd: 'Hora de Salida', labelTasks: 'Tareas Realizadas', labelNotes: 'Notas / Varios', btnAddTask: '+ Agregar Línea de Tarea', btnSubmit: 'Enviar Reporte', matTitle: 'Control de Materiales', matName: 'Nombre del Material', matOrdered: 'Surtido', matReturned: 'Devolución', successMsg: '¡Reporte guardado con éxito! El registro está bloqueado.', adminNotice: 'Modo Administrador: Permisos de edición y eliminación activados.', thEmployee: 'Empleado', thHours: 'Horas', langLabel: 'Seleccionar Idioma', noRecords: 'No hay registros en este periodo.', noTrackingRequired: 'No se requieren listas de materiales o tareas para esta área. Favor de registrar sus horas y notas abajo.', lblNewUser: 'Usuario', lblNewPass: 'Contraseña', lblNewBiz: 'Unidad de Negocio Asignada', btnCreateUser: 'Crear Perfil', userCreatedMsg: '¡Perfil de empleado creado con éxito!', thRole: 'Rol', thBiz: 'Área del Negocio', existingUsersTitle: 'Usuarios Activos del Sistema', selectTaskPlaceholder: '-- Seleccionar Tarea --'
  },
  uk: {
    dashboardTitle: 'Робочий простір', backBtn: '← Назад до порталу', logoutBtn: 'Вийти', userLabel: 'Користувач', navEntry: 'Введення даних', navRecords: 'Журнал за день', navMonthly: 'Години за місяць', navUsers: 'Управління персоналом', navSettings: 'Налаштування', headerData: 'Облік часу та матеріалів', headerRecords: 'Мої звіти за день', headerMonthly: 'Відпрацьовані години за місяць', headerUsers: 'Створити профіль співробітника', headerSettings: 'Налаштування системи', labelCustomer: 'Клієнт / Об\'єкт', labelDate: 'Дата', labelStart: 'Час початку', labelEnd: 'Час завершення', labelTasks: 'Виконані роботи', labelNotes: 'Примітки / Різне', btnAddTask: '+ Додати рядок роботи', btnSubmit: 'Надіслати запис', matTitle: 'Облік матеріалів', matName: 'Назва матеріалу', matOrdered: 'Взято', matReturned: 'Повернуто', successMsg: 'Дані успішно збережено! Запис заблоковано.', adminNotice: 'Режим адміна: Надано права на редагування та видалення.', thEmployee: 'Співробітник', thHours: 'Годин', langLabel: 'Вибір мови', noRecords: 'Записів для цього періоду не знайдено.', noTrackingRequired: 'Для цього підрозділу окремий облік матеріалів чи завдань не потрібен. Будь ласка, введіть робочий час та примітки нижче.', lblNewUser: 'Ім\'я користувача', lblNewPass: 'Пароль', lblNewBiz: 'Призначений підрозділ', btnCreateUser: 'Створити профіль', userCreatedMsg: 'Профіль співробітника успішно створено!', thRole: 'Роль', thBiz: 'Сфера бізнесу', existingUsersTitle: 'Активні профілі користувачів', selectTaskPlaceholder: '-- Оберіть завдання --'
  },
  hi: {
    dashboardTitle: 'कार्यक्षेत्र', backBtn: '← पोर्टल पर वापस जाएं', logoutBtn: 'लॉगआउट', userLabel: 'उपयोगकर्ता', navEntry: 'डेटा प्रविष्टि', navRecords: 'दैनिक लॉग', navMonthly: 'मासिक घंटे', navUsers: 'कर्मचारी प्रबंधन', navSettings: 'सेटिंग्स', headerData: 'समय और सामग्री दर्ज करें', headerRecords: 'मेरे दैनिक रिकॉर्ड', headerMonthly: 'मासिक कार्य के घंटे', headerUsers: 'नया कर्मचारी प्रोफाइल बनाएं', headerSettings: 'सिस्टम सेटिंग्स', labelCustomer: 'ग्राहक / ऑब्जेक्ट', labelDate: 'तारीख', labelStart: 'शुरू होने का समय', labelEnd: 'समाप्ति का समय', labelTasks: 'किए गए कार्य', labelNotes: 'विविध / नोट्स', btnAddTask: '+ कार्य पंक्ति जोड़ें', btnSubmit: 'रिकॉर्ड जमा करें', matTitle: 'सामग्री ट्रैकिंग', matName: 'सामग्री का नाम', matOrdered: 'लिया गया', matReturned: 'वापस किया', successMsg: 'डेटा सफलतापूर्वक दर्ज किया गया! रिकॉर्ड लॉक है।', adminNotice: 'एडमिन मोड: संपादन और हटाने के अधिकार दिए गए हैं।', thEmployee: 'कर्मचारी', thHours: 'घंटे', langLabel: 'भाषा चुनें', noRecords: 'इस कार्यक्षेत्र के लिए कोई रिकॉर्ड नहीं मिला।', noTrackingRequired: 'इस व्यावसायिक इकाई के लिए किसी समर्पित सामग्री या कार्य सूची की आवश्यकता नहीं है। कृपया नीचे अपने कार्य के घंटे और नोट्स दर्ज करें।', lblNewUser: 'यूज़रनेम', lblNewPass: 'पासवर्ड', lblNewBiz: 'सौंपी गई व्यावसायिक इकाई', btnCreateUser: 'प्रोफाइल बनाएं', userCreatedMsg: 'कर्मचारी प्रोफाइल सफलतापूर्वक बनाई गई!', thRole: 'भूमिका', thBiz: 'व्यवसाय का दायरा', existingUsersTitle: 'सक्रिय सिस्टम उपयोगकर्ता प्रोफाइल', selectTaskPlaceholder: '-- कार्य चुनें --'
  },
  ar: {
    dashboardTitle: 'مساحة العمل', backBtn: '← العودة إلى البوابة', logoutBtn: 'تسجيل الخروج', userLabel: 'المستخدم', navEntry: 'إدخال البيانات', navRecords: 'السجل اليومي', navMonthly: 'الساعات الشهرية', navUsers: 'إدارة الموظفين', navSettings: 'الإعدادات', headerData: 'تسجيل الساعات والمواد', headerRecords: 'سجلاتي اليومية', headerMonthly: 'ساعات العمل الشهرية', headerUsers: 'إنشاء ملف موظف جديد', headerSettings: 'إعدادات النظام', labelCustomer: 'العميل / الموقع', labelDate: 'التاريخ', labelStart: 'وقت البدء', labelEnd: 'وقت الانتهاء', labelTasks: 'المهام المنفذة', labelNotes: 'ملاحظات / متنوع', btnAddTask: '+ إضافة سطر مهام', btnSubmit: 'إرسال السجل', matTitle: 'تتبع المواد', matName: 'اسم المادة', matOrdered: 'المأخوذ', matReturned: 'المرتجع', successMsg: 'تم تسجيل البيانات بنجاح! السجل مقفل الآن.', adminNotice: 'وضع المسؤول: تم منح صلاحيات التعديل والحذف.', thEmployee: 'الموظف', thHours: 'الساعات', langLabel: 'اختر اللغة', noRecords: 'لم يتم العثور على سجلات لهذه الفترة.', noTrackingRequired: 'لا توجد قوائم مهام أو مواد مخصصة مطلوبة لوحدة العمل هذه. يرجى تسجيل ساعات عملك وملاحظاتك أدناه.', lblNewUser: 'اسم المستخدم', lblNewPass: 'كلمة المرور', lblNewBiz: 'وحدة العمل المعينة', btnCreateUser: 'إنشاء الملف الشخصي', userCreatedMsg: 'تم إنشاء ملف الموظف بنجاح!', thRole: 'الدور', thBiz: 'نطاق العمل', existingUsersTitle: 'ملفات المستخدمين النشطة في النظام', selectTaskPlaceholder: '-- اختر المهمة --'
  },
  ru: {
    dashboardTitle: 'Рабочая область', backBtn: '← Назад в портал', logoutBtn: 'Выйти', userLabel: 'Пользователь', navEntry: 'Ввод данных', navRecords: 'Дневной журнал', navMonthly: 'Часы за месяц', navUsers: 'Управление персоналом', navSettings: 'Настройки', headerData: 'Учет времени и материалов', headerRecords: 'Мои дневные отчеты', headerMonthly: 'Отработанные часы за месяц', headerUsers: 'Создать профиль сотрудника', headerSettings: 'Системные настройки', labelCustomer: 'Клиент / Объект', labelDate: 'Дата', labelStart: 'Время начала', labelEnd: 'Время окончания', labelTasks: 'Выполненные работы', labelNotes: 'Примечания / Разное', btnAddTask: '+ Добавить строку работы', btnSubmit: 'Отправить запись', matTitle: 'Учет материалов', matName: 'Название материала', matOrdered: 'Взято', matReturned: 'Возвращено', successMsg: 'Данные успешно сохранены! Запись заблокирована.', adminNotice: 'Режим админа: Предоставлены права на редактирование и удаление.', thEmployee: 'Сотрудник', thHours: 'Часы', langLabel: 'Выбор языка', noRecords: 'Записей для этого периода не найдено.', noTrackingRequired: 'Для этого подразделения отдельный учет материалов или задач не требуется. Пожалуйста, введите рабочее время и примечания ниже.', lblNewUser: 'Имя пользователя', lblNewPass: 'Пароль', lblNewBiz: 'Назначенное подразделение', btnCreateUser: 'Создать профиль', userCreatedMsg: 'Профиль сотрудника успешно создан!', thRole: 'Роль', thBiz: 'Сфера бизнеса', existingUsersTitle: 'Активные профили пользователей', selectTaskPlaceholder: '-- Выберите задачу --'
  }
};

const BUSINESS_DATA: Record<string, { label: string; tasks: string[]; materials: { name: string; spec: string }[]; customers: string[]; requiresDetailedTracking: boolean }> = {
  fuerst_hauser: {
    label: 'Fürst Hauser Gebäudereinigung',
    requiresDetailedTracking: true,
    customers: ['Edeka Pocking', 'Gewerbepark Pleiskirchen', 'Rathaus Altötting', 'Klinikum Burghausen'],
    tasks: [
      'Außenreinigung Schaufenster und Eingangstüren',
      'Innenreinigung Schaufenster und Eingangstüren',
      'Beidseitige Reinigung von Glasflächen im Verkaufsbereich',
      'Beidseitige Reinigung von Glasflächen im Mitarbeiterbereich',
      'Zusätzliche Innenreinigung von Schaufenstern zu Dekorationsterminen mit zusätzlicher Anfahrt',
      'Zusätzliche Innenreinigung von Schaufenstern zu Dekorationsterminen in Verbindung with regelmäßiger Glasreinigung ohne zusätzliche Anfahrt',
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
    label: 'Bullauge Waschsalon',
    requiresDetailedTracking: true,
    customers: ['Münchner Str. Filiale', 'Hauptbahnhof Express', 'Uni-Viertel Salon'],
    tasks: ['Maschinenreinigung', 'Kassenabrechnung', 'Flusensiebe leeren', 'Boden wischen & desinfizieren', 'Wäschepflege & Bügeln'],
    materials: [
      { name: 'Handfolien', spec: 'Standard' },
      { name: 'Bügelstärke', spec: 'Sprühflasche' },
      { name: 'Chlor', spec: 'Bleichmittel' },
      { name: 'Waschpulver', spec: '20 kg' },
      { name: 'Weichspüler', spec: '20 L' },
      { name: 'Sonstiges', spec: 'Verbrauchsmaterial' }
    ]
  },
  hauser_mittel: {
    label: 'Hauser Reinigungsmittel',
    requiresDetailedTracking: false,
    customers: [],
    tasks: [],
    materials: []
  },
  signature_vista: {
    label: 'Signature Vista',
    requiresDetailedTracking: false,
    customers: [],
    tasks: [],
    materials: []
  }
};

export function Dashboard({ userRole, username, businessId, onLogout, onBackToPortal }: DashboardProps) {
  const scopeConfig = BUSINESS_DATA[businessId] || BUSINESS_DATA.fuerst_hauser;

  const [activeTab, setActiveTab] = useState<'entry' | 'records' | 'monthly' | 'users' | 'settings'>('entry');
  const [language, setLanguage] = useState<string>('de');
  const t = translations[language] || translations.de;

  // Track Layout Direction for Arabic Support
  const isRTL = language === 'ar';

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

  // Sync Material and Customer rows when changing businesses
  useEffect(() => {
    if (scopeConfig.requiresDetailedTracking) {
      const rows = scopeConfig.materials.map(m => ({
        name: m.name,
        specification: m.spec,
        ordered: 0,
        returned: 0
      }));
      setMaterialRows(rows);
      setCustomer(scopeConfig.customers[0] || '');
      setSelectedTasks(['']);
    } else {
      setMaterialRows([]);
      setCustomer('');
      setSelectedTasks([]);
    }
  }, [businessId, scopeConfig]);

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
      const resetRows = scopeConfig.materials.map(m => ({ name: m.name, specification: m.spec, ordered: 0, returned: 0 }));
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

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f1f5f9', overflow: 'hidden', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
      
      {/* SIDEBAR NAVIGATION MENU */}
      <div style={{ width: '260px', backgroundColor: '#1e293b', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px 0', textAlign: isRTL ? 'right' : 'left' }}>
        <div>
          <div style={{ padding: '0 20px 20px 20px', borderBottom: '1px solid #334155', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#38bdf8' }}>{scopeConfig.label}</h3>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '5px' }}>{t.dashboardTitle}</div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 10px' }}>
            <button onClick={() => setActiveTab('entry')} style={{ width: '100%', padding: '12px 15px', textAlign: isRTL ? 'right' : 'left', backgroundColor: activeTab === 'entry' ? '#334155' : 'transparent', color: activeTab === 'entry' ? '#38bdf8' : '#cbd5e1', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              📝 {t.navEntry}
            </button>
            <button onClick={() => setActiveTab('records')} style={{ width: '100%', padding: '12px 15px', textAlign: isRTL ? 'right' : 'left', backgroundColor: activeTab === 'records' ? '#334155' : 'transparent', color: activeTab === 'records' ? '#38bdf8' : '#cbd5e1', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              📅 {t.navRecords}
            </button>
            <button onClick={() => setActiveTab('monthly')} style={{ width: '100%', padding: '12px 15px', textAlign: isRTL ? 'right' : 'left', backgroundColor: activeTab === 'monthly' ? '#334155' : 'transparent', color: activeTab === 'monthly' ? '#38bdf8' : '#cbd5e1', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              📊 {t.navMonthly}
            </button>
            
            {userRole === 'admin' && (
              <button onClick={() => setActiveTab('users')} style={{ width: '100%', padding: '12px 15px', textAlign: isRTL ? 'right' : 'left', backgroundColor: activeTab === 'users' ? '#334155' : 'transparent', color: activeTab === 'users' ? '#38bdf8' : '#cbd5e1', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                👥 {t.navUsers}
              </button>
            )}

            <button onClick={() => setActiveTab('settings')} style={{ width: '100%', padding: '12px 15px', textAlign: isRTL ? 'right' : 'left', backgroundColor: activeTab === 'settings' ? '#334155' : 'transparent', color: activeTab === 'settings' ? '#38bdf8' : '#cbd5e1', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
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
        
        <header style={{ height: '60px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: isRTL ? 'flex-start' : 'flex-end', padding: '0 30px' }}>
          <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
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
              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: scopeConfig.requiresDetailedTracking ? '1fr 1fr' : '1fr', gap: '30px', alignItems: 'start' }}>
                
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
                        {scopeConfig.customers.map((c, i) => <option key={i} value={c}>{c}</option>)}
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
                  )}

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#334155' }}>{t.labelNotes}</label>
                    <textarea value={miscellaneous} onChange={(e) => setMiscellaneous(e.target.value)} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 4px rgba(16,185,129,0.2)' }}>
                    🚀 {t.btnSubmit}
                  </button>
                </div>

                {/* MATERIAL CONSUMPTION ROW MODULE */}
                {scopeConfig.requiresDetailedTracking && (
                  <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', maxHeight: '78vh', overflowY: 'auto' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#0f172a', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>📦 {t.matTitle}</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: isRTL ? 'right' : 'left' }}>
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
                )}
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
