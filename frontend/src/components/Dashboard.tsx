import React, { useState, useEffect } from 'react';

interface DashboardProps {
  userRole: 'admin' | 'employee' | 'customer';
  username: string;
  onLogout: () => void;
}

type LanguageType = 'de' | 'en' | 'es' | 'fr' | 'it' | 'pt' | 'nl' | 'pl' | 'tr' | 'si' | 'uk';

interface MaterialRowState {
  name: string;
  ordered: number;
  returned: number;
}

const WASCHSALON_TASKS = [
  'Wäsche waschen (Wash laundry)',
  'Wäsche trocknen (Dry laundry)',
  'Bügeln & Heißmangling (Ironing & Mangling)',
  'Maschinenreinigung (Machine maintenance)'
];

const GEBAEUDEREINIGUNG_TASKS = [
  'Außenreinigung Schaufenster und Eingangstüren (Exterior cleaning of shop windows and entrance doors)',
  'Innenreinigung Schaufenster und Eingangstüren (Interior cleaning of shop windows and entrance doors)',
  'Beidseitige Reinigung von Glasflächen im Verkaufsbereich (Two-sided cleaning of glass surfaces in the sales area)',
  'Beidseitige Reinigung von Glasflächen im Mitarbeiterbereich (Two-sided cleaning of glass surfaces in the employee area)',
  'Zusätzliche Innenreinigung von Schaufenstern zu Dekorationsterminen mit zusätzlicher Anfahrt (Additional interior cleaning of shop windows for decoration appointments with an additional journey)',
  'Zusätzliche Innenreinigung von Schaufenstern zu Dekorationsterminen in Verbindung mit regelmäßiger Glasreinigung ohne zusätzliche Anfahrt (Additional interior cleaning of shop windows for decoration appointments in connection with regular glass cleaning without an additional journey)',
  'Reinigung von Spiegeln (Cleaning of mirrors)'
];

const WASCHSALON_MATERIALS = [
  'Handfolien (Plastic stretch wrap / gloves)',
  'Bügelstärke (Ironing starch / spray starch)',
  'Chlor (Chlorine / Bleach)',
  'Waschpulver (Washing powder) 20 kg',
  'Weichspüler (Fabric softener) 20 L'
];

const GEBAEUDEREINIGUNG_MATERIALS = [
  'Müllbeutel Groß (Large trash bags) 120 L',
  'Müllbeutel Medium (Medium trash bags) 60 L',
  'Müllbeutel Klein (Small trash bags) 28 L',
  'Wischmopp Mikrofaser (Microfiber mop) 50 cm',
  'Wischmopp Baumwolle (Cotton mop) 50 cm',
  'Mikrofaser Lappen rot (Red microfiber cloths) 40 x 40 cm',
  'Mikrofaser Lappen blau (Blue microfiber cloths) 40 x 40 cm',
  'Mikrofaser Lappen grün (Green microfiber cloths) 40 x 40 cm',
  'Mikrofaser Lappen gelb (Yellow microfiber cloths) 40 x 40 cm',
  'Geschirrtücher (Kitchen / Dish towels) 70 x 50 cm',
  'Sprühflasche Sanitärreiniger Milizid (Spray bottle Bathroom cleaner)',
  'Bodenreiniger Torrun Konzentrat (Floor cleaner concentrate)',
  'Oberflächenreiniger (Surface cleaner)',
  'Toilettenpapier (Toilet paper)',
  'Falthandtücher (Folded hand towels)',
  'Handseife (Hand soap) 10 Liter'
];

export function Dashboard({ userRole, username, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<string>(
    userRole === 'admin' ? 'add-users' : userRole === 'customer' ? 'client-view' : 'add-record'
  );
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<LanguageType>('de');

  // --- FORM STATES ---
  const [business, setBusiness] = useState('Fürst Hauser Gebäudereinigung');
  const [customer, setCustomer] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('12:30');
  const [endTime, setEndTime] = useState('12:30');
  const [miscellaneous, setMiscellaneous] = useState('');
  const [showMaterialList, setShowMaterialList] = useState(true);
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  // --- DYNAMIC TASK LABELS ---
  const [tasks, setTasks] = useState<string[]>(['']);
  const availableTasks = business === 'Bullaude Waschsalon' ? WASCHSALON_TASKS : GEBAEUDEREINIGUNG_TASKS;

  const [materialRows, setMaterialRows] = useState<MaterialRowState[]>([]);

  useEffect(() => {
    const targetSource = business === 'Bullaude Waschsalon' ? WASCHSALON_MATERIALS : GEBAEUDEREINIGUNG_MATERIALS;
    const initialRows = targetSource.map(name => ({ name, ordered: 0, returned: 0 }));
    setMaterialRows(initialRows);
  }, [business]);

  useEffect(() => {
    setTasks(['']);
  }, [business]);

  const handleCounterChange = (index: number, field: 'ordered' | 'returned', delta: number) => {
    setMaterialRows(prev => prev.map((row, i) => {
      if (i !== index) return row;
      const val = Math.max(0, row[field] + delta);
      return { ...row, [field]: val };
    }));
  };

  const handleTaskChange = (index: number, value: string) => {
    const updated = [...tasks];
    updated[index] = value;
    setTasks(updated);
  };

  // --- MULTI-LANGUAGE TRANSLATION CORE ---
  const t = {
    panelTitle: { de: 'Zeiterfassung Panel', en: 'Time Tracker Panel', es: 'Gestor de Tiempo', fr: 'Gestionnaire de Pointage', it: 'Gestore del Tempo', pt: 'Gestor de Tempo', nl: 'Tijdregistratie Panel', pl: 'Menedżer Rejestracji Czasu', tr: 'Zaman Takip Paneli', si: 'කාල සටහන් කළමනාකරු', uk: 'Менеджер Обліку Часу' },
    logout: { de: 'Abmelden', en: 'Logout', es: 'Cerrar Sesión', fr: 'Déconnexion', it: 'Disconnetti', pt: 'Sair', nl: 'Ausloggen', pl: 'Wyloguj', tr: 'Çıkış Yap', si: 'පිටවීම', uk: 'Вийти' },
    successMsg: { de: 'Erfolgreich gespeichert!', en: 'Logged successfully!', es: '¡Guardado con éxito!', fr: 'Enregistré avec succès !', it: 'Salvato con successo!', pt: 'Salvo com sucesso!', nl: 'Succesvol opgeslagen!', pl: 'Zapisano pomyślnie!', tr: 'Başarıyla kaydedildi!', si: 'සාර්ථකව සුරකින ලදි!', uk: 'Успішно збережено!' },
    errorMsg: { de: 'Fehler beim Absenden.', en: 'Failed to save.', es: 'Error al guardar.', fr: 'Échec de l\'enregistrement.', it: 'Errore während il salvataggio.', pt: 'Errore ao salvar.', nl: 'Opslaan mislukt.', pl: 'Błąd zapisu.', tr: 'Kaydedilirken hata oluştu.', si: 'සුරැකීම අසාර්ථකයි.', uk: 'Помилка збереження.' },
    
    // Menu names matching with standardized graphic symbols
    addRecord: { de: '📝 Add New Entry', en: '📝 Add New Entry', es: '📝 Añadir Registro', fr: '📝 Ajouter une Entrée', it: '📝 Aggiungi Registro', pt: '📝 Adicionar Registro', nl: '📝 Invoeren', pl: '📝 Dodaj wpis', tr: '📝 Kayıt Ekle', si: '📝 නව සටහනක්', uk: '📝 Додати Запис' },
    monthlyHours: { de: '📅 Monthly Working Hours', en: '📅 Monthly Working Hours', es: '📅 Horas Mensuales', fr: '📅 Heures Mensuelles', it: '📅 Ore Mensili', pt: '📅 Horas Mensais', nl: '📅 Maandelijkse Uren', pl: '📅 Godziny miesięczne', tr: '📅 Aylık Çalışma Saatleri', si: '📅 මාසික පැය ගණන', uk: '📅 Щомісячні Години' },
    trackingLogs: { de: '🔍 Tracking Logs', en: '🔍 Tracking Logs', es: '🔍 Monitoreo', fr: '🔍 Suivi', it: '🔍 Monitoraggio', pt: '🔍 Registros', nl: '🔍 Logboeken', pl: '🔍 Monitorowanie', tr: '🔍 Takip Kayıtları', si: '🔍 නිරීක්ෂණ සටහන්', uk: '🔍 Журнал Моніторингу' },
    historyLogs: { de: '⏳ Verlauf Historie', en: '⏳ History Logs', es: '⏳ Historial', fr: '⏳ Historique', it: '⏳ Cronologia', pt: '⏳ Histórico', nl: '⏳ Historie', pl: '⏳ Historia', tr: '⏳ Geçmiş Kayıtlar', si: '⏳ ඉතිහාස සටහන්', uk: '⏳ Історія Записів' },
    projectOverview: { de: '📊 Projektübersicht', en: '📊 Project Overview', es: '📊 Vista del Proyecto', fr: '📊 Aperçu du Projet', it: '📊 Panoramica Progetto', pt: '📊 Visão do Projeto', nl: '📊 Projectoverzicht', pl: '📊 Przegląd projektu', tr: '📊 Proje Özeti', si: '📊 ව්‍යාපෘති දළ විශ්ලේෂණය', uk: '📊 Огляд Проєкту' },
    settings: { de: '⚙️ Settings', en: '⚙️ Settings', es: '⚙️ Configuración', fr: '⚙️ Paramètres', it: '⚙️ Impostazioni', pt: '⚙️ Configurações', nl: '⚙️ Instellingen', pl: '⚙️ Ustawienia', tr: '⚙️ Ayarlar', si: '⚙️ සැකසුම්', uk: '⚙️ Налаштування' },
    regUserTitle: { de: '👤 Register New User', en: '👤 Register New User', es: '👤 Registrar Usuario', fr: '👤 Créer Utilisateur', it: '👤 Registra Utente', pt: '👤 Registrar Usuário', nl: '👤 Gebruiker Registreren', pl: '👤 Zarejestruj użytkownika', tr: '👤 Yeni Kullanıcı Kaydet', si: '👤 නව පරිශїලකයෙකු ලියාපදිංචි කිරීම', uk: '👤 Реєстрація Нового Користувача' },
    
    formTitle: { de: 'Material & Zeiterfassung (Material & Time Tracking Input)', en: 'Material & Time Tracking Input', es: 'Registro de Materiales y Tiempo', fr: 'Saisie de Matériel & Temps', it: 'Inserimento Materiale e Tempo', pt: 'Registro de Material e Tempo', nl: 'Materiaal & Tijdregistratie Invoer', pl: 'Wprowadzanie materiałów i czasu', tr: 'Malzeme ve Zaman Kayıt Girişi', si: 'ද්‍රව්‍ය සහ කාල සටහන් ඇතුලත් කිරීම', uk: 'Введення Матеріалів та Обліку Часу' },
    bizName: { de: 'Unternehmen (Business):', en: 'Business / Company:', es: 'Empresa:', fr: 'Entreprise:', it: 'Azienda:', pt: 'Empresa:', nl: 'Bedrijf:', pl: 'Firma:', tr: 'İşyeri / Firma:', si: 'ආයතනය / සමාගම:', uk: 'Підприємство / Фірма:' },
    custLabel: { de: 'Kunde (Customer):', en: 'Customer:', es: 'Cliente:', fr: 'Client:', it: 'Cliente:', pt: 'Cliente:', nl: 'Klant:', pl: 'Klient:', tr: 'Müşteri:', si: 'පාරිභෝගිකයා:', uk: 'Клієнт:' },
    custPlaceholder: { de: '-- Kunde auswählen (Select Customer) --', en: '-- Select Customer --', es: '-- Seleccionar Cliente --', fr: '-- Choisir le Client --', it: '-- Seleziona Cliente --', pt: '-- Selecionar Cliente --', nl: '-- Selecteer Klant --', pl: '-- Wybierz klienta --', tr: '-- Müşteri Seçin --', si: '-- පාරිභෝගිකයා තෝරන්න --', uk: '-- Виберіть Клієнта --' },
    empName: { de: 'Mitarbeiter (Employee):', en: 'Employee Name:', es: 'Empleado:', fr: 'Employé:', it: 'Dipendente:', pt: 'Empregado:', nl: 'Werknemer Name:', pl: 'Pracownik:', tr: 'Personel Adı:', si: 'සේවකයාගේ නම:', uk: 'Ім\'я Співробітника:' },
    dateLabel: { de: 'Datum (Date):', en: 'Date:', es: 'Fecha:', fr: 'Date:', it: 'Data:', pt: 'Data:', nl: 'Datum:', pl: 'Data:', tr: 'Tarih:', si: 'දිනය:', uk: 'Дата:' },
    startLabel: { de: 'Arbeitsbeginn (Start Time):', en: 'Start Time:', es: 'Hora de Inicio:', fr: 'Heure de Début:', it: 'Ora Inizio:', pt: 'Hora de Início:', nl: 'Starttijd:', pl: 'Czas rozpoczęcia:', tr: 'Başlangıç Saati:', si: 'ආරම්භක වේලාව:', uk: 'Час Початку:' },
    endLabel: { de: 'Arbeitsende (End Time):', en: 'End Time:', es: 'Hora de Fin:', fr: 'Heure de Fin:', it: 'Ora Fine:', pt: 'Hora de Fim:', nl: 'Eindtijd:', pl: 'Czas zakończenia:', tr: 'Bitiş Saati:', si: 'අවසාan වේලාව:', uk: 'Час Завершення:' },
    materialToggle: { de: 'Materialliste anzeigen / ausblenden (Show/Hide Material List)', en: 'Show/Hide Material List', es: 'Mostrar/Ocultar Lista de Materiales', fr: 'Afficher/Masquer la liste des matériaux', it: 'Mostra/Nascondi Lista Materiali', pt: 'Mostrar/Ocultar Lista de Materiais', nl: 'Materiaalverstrekking tonen/verbergen', pl: 'Pokaż/Ukryj listę materiałów', tr: 'Malzeme Listesini Göster/Gizle', si: 'ද්‍රව්‍ය ලැයිස්තුව පෙන්වන්න / සඟවන්න', uk: 'Показати/Приховати Список Матеріалів' },
    matHeader: { de: 'Material / Artikelbezeichnung [Specification]', en: 'Material / Specification', es: 'Material / Especificación', fr: 'Matériel / Spécification', it: 'Materiale / Specifica', pt: 'Material / Especificação', nl: 'Materiaal / Artikelomschrijving', pl: 'Materiał / Specyfikacja', tr: 'Malzeme / Ürün Tanımı', si: 'ද්‍රව්‍ය / විස්තරය', uk: 'Матеріал / Опис' },
    orderedHeader: { de: 'Bestellung (Ordered Amount)', en: 'Ordered Amount', es: 'Cantidad Pedida', fr: 'Quantité Commandée', it: 'Quantità Ordinata', pt: 'Quantidade Pedida', nl: 'Bestelling Amount', pl: 'Zamówione', tr: 'Sipariş Edilen Miktar', si: 'ඇණවුම් කල ප්‍රමාණය', uk: 'Замовлену Кількість' },
    returnedHeader: { de: 'Rücknahme (Returned Amount)', en: 'Returned Amount', es: 'Cantidad Devuelta', fr: 'Quantité Retournée', it: 'Quantità Restituita', pt: 'Quantidade Devolvida', nl: 'Retour Amount', pl: 'Zwrócone', tr: 'İade Edilen Miktar', si: 'ප්‍රතිලාභ ප්‍රමාණය', uk: 'Повернуту Кількість' },
    miscLabel: { de: 'Sonstiges (Miscellaneous)', en: 'Miscellaneous Notes', es: 'Notas Adicionales', fr: 'Remarques', it: 'Note varie', pt: 'Notas', nl: 'Opmerkingen', pl: 'Uwagi', tr: 'Notlar / Açıklama', si: 'වෙනත් සටහන්', uk: 'Примітки / Різне' },
    miscPlaceholder: { de: 'Kurze Beschreibung hier eingeben...', en: 'Enter brief description here...', es: 'Ingrese una descripción aquí...', fr: 'Entrez une brève description...', it: 'Inserisci descrizione qui...', pt: 'Insira uma breve descrição...', nl: 'Voer hier een opmerking in...', pl: 'Wpisz krótki opis...', tr: 'Buraya kısa bir açıklama girin...', si: 'කෙටි විස්තරයක් ඇතුලත් කරන්න...', uk: 'Введіть тут короткий опис...' },
    btnSubmit: { de: 'Eintrag absenden', en: 'Submit Log Entry', es: 'Enviar', fr: 'Soumettre', it: 'Invia', pt: 'Enviar', nl: 'Verzenden', pl: 'Wyślij wpis', tr: 'Kaydı Gönder', si: 'සටහන ඉදිරිපත් කරන්න', uk: 'Надіслати Запис' },
    tasksLabel: { de: 'Aufgaben / Tätigkeiten (Select One or More Tasks):', en: 'Tasks Performed:', es: 'Tareas', fr: 'Tâches', it: 'Attività svolte', pt: 'Tarefas', nl: 'Uitgevoerde taken', pl: 'Wykonane zadania', tr: 'Yapılan Görevler', si: 'සිදුකළ කාර්යයන්', uk: 'Виконані Завдання' },
    btnAddTask: { de: '+ Aufgabe hinzufügen', en: '+ Add Task', es: '+ Añadir Tarea', fr: '+ Tâche', it: '+ Attività', pt: '+ Tarefa', nl: '+ Taak', pl: '+ Dodaj zadanie', tr: '+ Görev Ekle', si: '+ කාර්යයක් එක් කරන්න', uk: '+ Додати Завдання' },
    selectPlaceholder: { de: '-- Aufgaben auswählen --', en: '-- Please select --', es: '-- Seleccione --', fr: '-- Choisir --', it: '-- Seleziona --', pt: '-- Selecione --', nl: '-- Selecteer --', pl: '-- Wybierz --', tr: '-- Lütfen seçin --', si: '-- කරුණාකර තෝරන්න --', uk: '-- Виберіть зі списку --' },
    regUserText: { de: 'Create operational accounts for employees or clients.', en: 'Create operational accounts for employees or clients.', es: 'Cree cuentas para empleados.', fr: 'Créez des comptesable.', it: 'Crea account per dipendenti.', pt: 'Criar contas para funcionários.', nl: 'Maak accounts aan.', pl: 'Utwórz konta dla pracowników.', tr: 'Personel veya müşteriler için hesap oluşturun.', si: 'සේවකයින් හෝ පාරිභෝගිකයින් සඳහා ගිණුම් සාදන්න.', uk: 'Створюйте облікові записи для працівників або клієнтів.' },
    globalLogsText: { de: 'Displaying real-time entry submittals across all system workers.', en: 'Displaying real-time entry submittals across all system workers.', es: 'Entradas en tempo real.', fr: 'Entrées en temps réel.', it: 'Voci in tempo reale.', pt: 'Registros em tempo real.', nl: 'Live urenoverzicht.', pl: 'Wpisy pracowników live.', tr: 'Sistemdeki tüm personellerin canlı kayıtlarını gösterir.', si: 'පද්ධතියේ සියලුම සේවකයින්ගේ සජීවී සටහන් පෙන්වයි.', uk: 'Показує поточні записи всіх працівників у системи в реальному часі.' },
    historyText: { de: 'Ihre eigenen vergangenen Einträge im Überblick.', en: 'Review your past submission logs in chronological order.', es: 'Registros anteriores.', fr: 'Entrées passées.', it: 'Record passati.', pt: 'Registros anteriores.', nl: 'Bekijk uw eerdere invoer.', pl: 'Przegląd Twoich vanished wpisów.', tr: 'Geçmiş kayıtlarınızı kronolojik olarak inceleyin.', si: 'ඔබගේ පෙර ඉදිරිපත් කිරීම් සමාලෝචනය කරන්න.', uk: 'Огляд ваших власних записів у системі.' },
    custPortalText: { de: 'Eingeloggte Kunden können hier den Fortschritt gebuchter Leistungen einsehen.', en: 'Review assigned job progress and time allocations recorded for your accounts.', es: 'Progreso del trabalho.', fr: 'Avancement des travaux.', it: 'Progresso del lavoro.', pt: 'Progresso do trabalho.', nl: 'Bekijk voortgang.', pl: 'Sprawdź postęp prac.', tr: 'Giriş yapan müşteriler burdan hizmet ilerlemelerini görebilir.', si: 'ලියාපදිංචි සේවාදායකයින්ට මෙතැනින් කාර්යයන්හි ප්‍රගතිය බැලිය හැක.', uk: 'Авторизовані клієнти можуть бачити тут прогрес виконання замовлених послуг.' },
    monthlyHoursText: { de: 'Zusammenfassung der kalkulierten Monatsstunden.', en: 'Aggregated monthly hour metrics and performance summaries.', es: 'Métricas de horas mensuales.', fr: 'Heures mensuelles.', it: 'Ore mensili calcolate.', pt: 'Métricas de horas mensais.', nl: 'Maandelijkse urenstatistieken.', pl: 'Podsumowanie przepracowanych godzin.', tr: 'Hesaplanan aylık çalışma saatlerinin özeti.', si: 'මාසික වැඩ කරන පැය ගණන සාරාංශය.', uk: 'Підсумковий огляд розрахованих годин за поточний місяць.' },
    appSettings: { de: 'Systemeinstellungen', en: 'Application Settings', es: 'Configuración', fr: 'Paramètres', it: 'Impostazioni', pt: 'Configurações', nl: 'Instellingen', pl: 'Ustawienia systemu', tr: 'Sistem Ayarları', si: 'පද්ධති සැකසුම්', uk: 'Налаштування Системи' },
    personalize: { de: 'Passen Sie Ihr Dashboard an.', en: 'Personalize your system panel layout preferences.', es: 'Personalice su panel.', fr: 'Personnalisez votre tableau.', it: 'Personalizza il pannello.', pt: 'Personalize seu painel.', nl: 'Personaliseer uw dashboard.', pl: 'Dostosuj swój panel.', tr: 'Panel tercihlerinizi kişiselleştirin.', si: 'ඔබගේ උපකරණ පුවරුව වෙනස් කරගන්න.', uk: 'Налаштуйте інтерфейс вашої панелі керування.' },
    appearance: { de: 'Erscheinungsbild', en: 'Appearance', es: 'Apariencia', fr: 'Apparence', it: 'Aspetto', pt: 'Aparência', nl: 'Weergave', pl: 'Wygląd', tr: 'Görünüm', si: 'පෙනුම', uk: 'Зовнішній Вигляд' },
    themeToggleDesc: { de: 'Wechseln Sie das Designthema.', en: 'Toggle workspace theme background.', es: 'Cambiar tema.', fr: 'Changer le thème.', it: 'Cambia tema.', pt: 'Mudar tema.', nl: 'Wissel designthema.', pl: 'Przełącz motyw.', tr: 'Açık/Koyu tema geçişi yapın.', si: 'තේමාව වෙනස් කරන්න.', uk: 'Зміна колірної теми інтерфейсу.' },
    languageLabel: { de: 'Sprache', en: 'Language', es: 'Idioma', fr: 'Langue', it: 'Lingua', pt: 'Idioma', nl: 'Taal', pl: 'Język', tr: 'Dil', si: 'භාෂාව', uk: 'Мова' },
    languageDesc: { de: 'Wählen Sie die Systemsprache.', en: 'Select preferred application language.', es: 'Seleccione el idioma.', fr: 'Sélectionnez la langue.', it: 'Seleziona la lingua.', pt: 'Selecione o idioma.', nl: 'Selecteer applicatietaal.', pl: 'Wybierz język systemu.', tr: 'Sistem dilini seçin.', si: 'පද්ධති භාෂාව තෝරන්න.', uk: 'Виберіть основну мову системи.' }
  };

  const adminTabs = [
    { id: 'add-users', name: t.regUserTitle[language] },
    { id: 'monthly-hours', name: t.monthlyHours[language] },
    { id: 'tracking', name: t.trackingLogs[language] },
    { id: 'settings', name: t.settings[language] }
  ];

  const employeeTabs = [
    { id: 'add-record', name: t.addRecord[language] },
    { id: 'monthly-hours', name: t.monthlyHours[language] },
    { id: 'history', name: t.historyLogs[language] },
    { id: 'settings', name: t.settings[language] }
  ];

  const customerTabs = [
    { id: 'client-view', name: t.projectOverview[language] },
    { id: 'settings', name: t.settings[language] }
  ];

  const currentTabs = userRole === 'admin' ? adminTabs : userRole === 'customer' ? customerTabs : employeeTabs;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ type: null, message: '' });

    const payload = {
      employeeName: username,
      business,
      customer,
      date,
      startTime,
      endTime,
      tasks: tasks.filter(t => t.trim() !== ''),
      materialsList: materialRows.map(m => `${m.name}: Ordered=${m.ordered}, Returned=${m.returned}`),
      miscellaneous
    };

    try {
	const response = await fetch('https://tracker-backend-yki1.onrender.com/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(t.errorMsg[language]);

      setFormStatus({ type: 'success', message: t.successMsg[language] });
      setCustomer('');
      setStartTime('12:30');
      setEndTime('12:30');
      setMiscellaneous('');
      setTasks(['']);
      setMaterialRows(prev => prev.map(m => ({ ...m, ordered: 0, returned: 0 })));
    } catch (err: any) {
      setFormStatus({ type: 'error', message: err.message || 'Error' });
    }
  };

  // --- STYLING REGIME ---
  const styles = {
    wrapper: { minHeight: '100vh', backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc', color: isDarkMode ? '#1e293b' : '#1e293b', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', display: 'flex', flexDirection: 'column' as const, transition: 'all 0.2s' },
    header: { backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`, padding: '14px 24px', zIndex: 10 },
    headerContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    logo: { fontSize: '18px', fontWeight: '700', color: '#2563eb', margin: 0 },
    rightHeader: { display: 'flex', alignItems: 'center', gap: '12px' },
    badge: { fontSize: '11px', fontWeight: '700', color: '#1e40af', backgroundColor: '#dbeafe', padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase' as const },
    logoutBtn: { fontSize: '12px', fontWeight: '600', color: '#ef4444', backgroundColor: 'transparent', border: '1px solid #fee2e2', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer' },
    layoutBody: { display: 'flex', flex: 1, minHeight: 'calc(100vh - 53px)' },
    sidebar: { width: '240px', backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', borderRight: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`, padding: '20px 12px', display: 'flex', flexDirection: 'column' as const, gap: '6px', boxSizing: 'border-box' as const },
    sidebarButton: (isActive: boolean) => ({ width: '100%', textAlign: 'left' as const, padding: '12px 16px', fontSize: '14px', fontWeight: '600', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: isActive ? '#2563eb' : 'transparent', color: isActive ? '#ffffff' : (isDarkMode ? '#94a3b8' : '#475569'), transition: 'all 0.15s ease' }),
    mainWorkspace: { flex: 1, padding: '32px', overflowY: 'auto' as const, boxSizing: 'border-box' as const },
    card: { backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.02)', border: `1px solid ${isDarkMode ? '#334155' : '#f1f5f9'}`, maxWidth: '1000px', margin: '0 auto' },
    title: { fontSize: '22px', fontWeight: '700', margin: '0 0 24px 0', color: isDarkMode ? '#f8fafc' : '#1e293b', borderBottom: `2px solid ${isDarkMode ? '#334155' : '#f1f5f9'}`, paddingBottom: '12px' },
    formGrid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
    fieldGroup: { display: 'flex', flexDirection: 'column' as const, gap: '6px', marginBottom: '14px' },
    label: { fontSize: '13px', fontWeight: '700', color: isDarkMode ? '#cbd5e1' : '#1e293b' },
    input: { padding: '10px 12px', borderRadius: '8px', fontSize: '14px', outline: 'none', border: `1px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`, backgroundColor: isDarkMode ? '#334155' : '#ffffff', color: isDarkMode ? '#ffffff' : '#1e293b', width: '100%', boxSizing: 'border-box' as const },
    select: { padding: '10px 12px', borderRadius: '8px', fontSize: '14px', outline: 'none', border: `1px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`, backgroundColor: isDarkMode ? '#334155' : '#ffffff', color: isDarkMode ? '#ffffff' : '#1e293b', cursor: 'pointer', width: '100%', boxSizing: 'border-box' as const },
    
    accordionToggle: { display: 'flex', width: '100%', padding: '12px 16px', backgroundColor: isDarkMode ? '#334155' : '#f1f5f9', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', color: isDarkMode ? '#f8fafc' : '#1e293b', gap: '8px', alignItems: 'center', marginBottom: '12px' },
    table: { width: '100%', borderCollapse: 'collapse' as const, margin: '12px 0 20px 0', fontSize: '13px' },
    th: { textAlign: 'left' as const, padding: '10px 8px', color: isDarkMode ? '#94a3b8' : '#475569', borderBottom: `1px solid ${isDarkMode ? '#475569' : '#e2e8f0'}`, fontSize: '12px', fontWeight: '700' },
    td: { padding: '12px 8px', borderBottom: `1px solid ${isDarkMode ? '#334155' : '#f1f5f9'}`, color: isDarkMode ? '#cbd5e1' : '#1e293b' },
    counterContainer: { display: 'flex', alignItems: 'center', gap: '8px' },
    counterBtn: { width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#f1f5f9', color: '#1e293b', fontWeight: 'bold' as const, cursor: 'pointer', padding: 0 },
    counterVal: { minWidth: '16px', textAlign: 'center' as const, fontWeight: '700', color: '#2563eb' },
    
    miscBox: { backgroundColor: isDarkMode ? '#334155' : '#fffbeb', border: `1px solid ${isDarkMode ? '#475569' : '#fef3c7'}`, padding: '16px', borderRadius: '8px', display: 'flex', flexDirection: 'column' as const, gap: '6px' },
    submitBtn: { width: '100%', padding: '14px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '16px', transition: 'background-color 0.2s' },
    actionBtn: { padding: '6px 12px', fontSize: '12px', fontWeight: '600', color: '#2563eb', backgroundColor: '#eff6ff', border: 'none', borderRadius: '6px', cursor: 'pointer', alignSelf: 'flex-start' },
    alert: (type: 'success' | 'error') => ({ padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px', fontWeight: '500', backgroundColor: type === 'success' ? '#f0fdf4' : '#fdf2f2', color: type === 'success' ? '#15803d' : '#b91c1c', border: `1px solid ${type === 'success' ? '#bbf7d0' : '#fde2e2'}` }),
    settingRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: `1px solid ${isDarkMode ? '#334155' : '#f1f5f9'}` },
    toggleBtn: { padding: '8px 16px', fontSize: '13px', fontWeight: '600', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: isDarkMode ? '#f59e0b' : '#1e293b', color: isDarkMode ? '#1e293b' : '#ffffff' }
  };

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.logo}>{t.panelTitle[language]}</h1>
          <div style={styles.rightHeader}>
            <span style={styles.badge}>{userRole}: {username}</span>
            <button style={styles.logoutBtn} onClick={onLogout}>{t.logout[language]}</button>
          </div>
        </div>
      </header>

      <div style={styles.layoutBody}>
        <aside style={styles.sidebar}>
          {currentTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={styles.sidebarButton(activeTab === tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </aside>

        <main style={styles.mainWorkspace}>
          <div style={styles.card}>

            {userRole === 'employee' && activeTab === 'add-record' && (
              <div>
                {/* Visual form sub-header clean text logic */}
                <h2 style={styles.title}>Material & Zeiterfassung (Material & Time Tracking Input)</h2>
                {formStatus.type && <div style={styles.alert(formStatus.type)}>{formStatus.message}</div>}

                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>{t.bizName[language]}</label>
                    <select style={styles.select} value={business} onChange={(e) => setBusiness(e.target.value)}>
                      <option value="Fürst Hauser Gebäudereinigung">Fürst Hauser Gebäudereinigung</option>
                      <option value="Bullaude Waschsalon">Bullaude Waschsalon</option>
                    </select>
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>{t.custLabel[language]}</label>
                    <select style={styles.select} value={customer} onChange={(e) => setCustomer(e.target.value)}>
                      <option value="">{t.custPlaceholder[language]}</option>
                      <option value="Kunde A">Kunde A</option>
                      <option value="Kunde B">Kunde B</option>
                      <option value="Kunde C">Kunde C</option>
                    </select>
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>{t.empName[language]}</label>
                    <select style={styles.select} disabled>
                      <option>{username}</option>
                    </select>
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>{t.dateLabel[language]}</label>
                    <input type="date" style={styles.input} value={date} onChange={(e) => setDate(e.target.value)} required />
                  </div>

                  <div style={styles.formGrid2}>
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>{t.startLabel[language]}</label>
                      <input type="time" style={styles.input} value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                    </div>
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>{t.endLabel[language]}</label>
                      <input type="time" style={styles.input} value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                    </div>
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>{t.tasksLabel[language]}</label>
                    {tasks.map((task, idx) => (
                      <select 
                        key={idx} 
                        style={{ ...styles.select, marginBottom: '8px' }} 
                        value={task} 
                        onChange={(e) => handleTaskChange(idx, e.target.value)}
                        required={idx === 0}
                      >
                        <option value="">{t.selectPlaceholder[language]}</option>
                        {availableTasks.map((taskOption, oIdx) => (
                          <option key={oIdx} value={taskOption}>{taskOption}</option>
                        ))}
                      </select>
                    ))}
                    <button type="button" onClick={() => setTasks([...tasks, ''])} style={styles.actionBtn}>{t.btnAddTask[language]}</button>
                  </div>

                  <div style={{ marginTop: '10px' }}>
                    <button 
                      type="button" 
                      style={styles.accordionToggle} 
                      onClick={() => setShowMaterialList(!showMaterialList)}
                    >
                      {showMaterialList ? '▼' : '▶'} {t.materialToggle[language]}
                    </button>

                    {showMaterialList && (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={styles.table}>
                          <thead>
                            <tr>
                              <th style={styles.th}>{t.matHeader[language]}</th>
                              <th style={{ ...styles.th, textAlign: 'center' }}>{t.orderedHeader[language]}</th>
                              <th style={{ ...styles.th, textAlign: 'center' }}>{t.returnedHeader[language]}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {materialRows.map((row, idx) => (
                              <tr key={idx}>
                                <td style={styles.td}>{row.name}</td>
                                
                                <td style={styles.td}>
                                  <div style={{ ...styles.counterContainer, justifyContent: 'center' }}>
                                    <button type="button" style={styles.counterBtn} onClick={() => handleCounterChange(idx, 'ordered', -1)}>-</button>
                                    <span style={styles.counterVal}>{row.ordered}</span>
                                    <button type="button" style={styles.counterBtn} onClick={() => handleCounterChange(idx, 'ordered', 1)}>+</button>
                                  </div>
                                </td>

                                <td style={styles.td}>
                                  <div style={{ ...styles.counterContainer, justifyContent: 'center' }}>
                                    <button type="button" style={styles.counterBtn} onClick={() => handleCounterChange(idx, 'returned', -1)}>-</button>
                                    <span style={{ ...styles.counterVal, color: '#16a34a' }}>{row.returned}</span>
                                    <button type="button" style={styles.counterBtn} onClick={() => handleCounterChange(idx, 'returned', 1)}>+</button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <div style={styles.miscBox}>
                    <label style={{ ...styles.label, color: '#b45309' }}>{t.miscLabel[language]}</label>
                    <input 
                      type="text" 
                      style={styles.input} 
                      placeholder={t.miscPlaceholder[language]} 
                      value={miscellaneous} 
                      onChange={(e) => setMiscellaneous(e.target.value)} 
                    />
                  </div>

                  <button type="submit" style={styles.submitBtn}>{t.btnSubmit[language]}</button>
                </form>
              </div>
            )}

            {/* ADMIN DASHBOARD PANELS */}
            {userRole === 'admin' && activeTab === 'add-users' && (
              <div>
                <h2 style={styles.title}>Register New User</h2>
                <p style={{ fontSize: '14px', color: '#64748b' }}>{t.regUserText[language]}</p>
              </div>
            )}

            {userRole === 'admin' && activeTab === 'tracking' && (
              <div>
                <h2 style={styles.title}>Tracking Logs</h2>
                <p style={{ fontSize: '14px', color: '#64748b' }}>{t.globalLogsText[language]}</p>
              </div>
            )}

            {/* ADDITIONAL SUB-PANELS */}
            {userRole === 'employee' && activeTab === 'history' && (
              <div>
                <h2 style={styles.title}>Verlauf Historie</h2>
                <p style={{ fontSize: '14px', color: '#64748b' }}>{t.historyText[language]}</p>
              </div>
            )}

            {userRole === 'customer' && activeTab === 'client-view' && (
              <div>
                <h2 style={styles.title}>Projektübersicht</h2>
                <p style={{ fontSize: '14px', color: '#64748b' }}>{t.custPortalText[language]}</p>
              </div>
            )}

            {activeTab === 'monthly-hours' && (
              <div>
                <h2 style={styles.title}>Monthly Working Hours</h2>
                <p style={{ fontSize: '14px', color: '#64748b' }}>{t.monthlyHoursText[language]}</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 style={styles.title}>Systemeinstellungen</h2>
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>{t.personalize[language]}</p>
                
                <div style={styles.settingRow}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>Erscheinungsbild</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{t.themeToggleDesc[language]}</div>
                  </div>
                  <button style={styles.toggleBtn} onClick={() => setIsDarkMode(!isDarkMode)}>
                    {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                  </button>
                </div>

                <div style={{ ...styles.settingRow, borderBottom: 'none' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>Sprache</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{t.languageDesc[language]}</div>
                  </div>
                  <select 
                    style={{ ...styles.select, width: '200px' }} 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value as LanguageType)}
                  >
                    <option value="de">Deutsch (DE)</option>
                    <option value="en">English (EN)</option>
                    <option value="es">Español (ES)</option>
                    <option value="fr">Français (FR)</option>
                    <option value="it">Italiano (IT)</option>
                    <option value="pt">Português (PT)</option>
                    <option value="nl">Nederlands (NL)</option>
                    <option value="pl">Polski (PL)</option>
                    <option value="tr">Türkçe (TR)</option>
                    <option value="si">සිංහල (SI)</option>
                    <option value="uk">Українська (UK)</option>
                  </select>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
