export type Lang = 'es' | 'en' | 'it' | 'pt';

export interface LangOption {
  code: Lang;
  label: string;
  flag: string;
}

export const LANGS: LangOption[] = [
  { code: 'es', label: 'Español', flag: 'ES' },
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'it', label: 'Italiano', flag: 'IT' },
  { code: 'pt', label: 'Português', flag: 'PT' },
];

export type TranslationKey =
  | 'app.tagline'
  | 'login.welcome'
  | 'login.subtitle'
  | 'login.email'
  | 'login.emailPlaceholder'
  | 'login.sendCode'
  | 'login.codeTitle'
  | 'login.codeSubtitle'
  | 'login.codeHint'
  | 'login.verify'
  | 'login.resend'
  | 'login.back'
  | 'login.demoHint'
  | 'login.invalid'
  | 'login.emailInvalid'
  | 'nav.home'
  | 'nav.appointments'
  | 'nav.schedule'
  | 'nav.patients'
  | 'nav.settings'
  | 'nav.section.clinica'
  | 'nav.section.general'
  | 'topbar.search'
  | 'topbar.logout'
  | 'home.greeting'
  | 'home.subtitle'
  | 'home.stat.patients'
  | 'home.stat.today'
  | 'home.stat.pending'
  | 'home.stat.week'
  | 'home.upcoming'
  | 'home.recent'
  | 'home.viewAll'
  | 'appointments.title'
  | 'appointments.subtitle'
  | 'schedule.title'
  | 'schedule.subtitle'
  | 'placeholder.soon'
  | 'placeholder.desc'
  | 'patients.title'
  | 'patients.count.one'
  | 'patients.count.other'
  | 'patients.new'
  | 'patients.search'
  | 'patients.col.patient'
  | 'patients.col.age'
  | 'patients.col.lastVisit'
  | 'patients.col.appointments'
  | 'patients.col.status'
  | 'patients.col.actions'
  | 'patients.years'
  | 'patients.empty'
  | 'detail.back'
  | 'detail.edit'
  | 'detail.save'
  | 'detail.cancel'
  | 'detail.saved'
  | 'detail.name'
  | 'detail.age'
  | 'detail.tab.history'
  | 'detail.tab.data'
  | 'detail.info'
  | 'detail.id'
  | 'detail.email'
  | 'detail.phone'
  | 'detail.since'
  | 'detail.totalAppointments'
  | 'detail.with'
  | 'detail.ageInvalid'
  | 'status.completed'
  | 'status.pending'
  | 'status.cancelled'
  | 'status.active'
  | 'patients.view.table'
  | 'patients.view.cards'
  | 'login.asideQuote'
  | 'theme.toggle'
  | 'settings.title'
  | 'settings.subtitle'
  | 'newPatient.title'
  | 'newPatient.name'
  | 'newPatient.namePlaceholder'
  | 'newPatient.age'
  | 'newPatient.email'
  | 'newPatient.emailPlaceholder'
  | 'newPatient.phone'
  | 'newPatient.phonePlaceholder'
  | 'newPatient.submit'
  | 'newPatient.created'
  | 'newPatient.nameRequired'
  | 'newPatient.ageInvalid'
  | 'newPatient.emailInvalid'
  | 'newPatient.phoneRequired'
  | 'schedule.week'
  | 'schedule.day'
  | 'schedule.agenda'
  | 'schedule.today'
  | 'schedule.new'
  | 'schedule.duration'
  | 'schedule.conflict'
  | 'schedule.noAppointments'
  | 'schedule.rescheduled'
  | 'schedule.created'
  | 'schedule.cancelled'
  | 'schedule.cancelAppt'
  | 'schedule.patient'
  | 'schedule.doctor'
  | 'schedule.type'
  | 'schedule.date'
  | 'schedule.time'
  | 'schedule.notes'
  | 'schedule.selectPatient'
  | 'status.scheduled'
  | 'status.no-show';

type Translations = Record<TranslationKey, string>;

export const translations: Record<Lang, Translations> = {
  es: {
    'app.tagline': 'Plataforma clínica',
    'login.welcome': 'Bienvenido de nuevo',
    'login.subtitle': 'Introduce tu correo y te enviaremos un código de acceso.',
    'login.email': 'Correo electrónico',
    'login.emailPlaceholder': 'nombre@clinica.com',
    'login.sendCode': 'Enviar código',
    'login.codeTitle': 'Revisa tu correo',
    'login.codeSubtitle': 'Hemos enviado un código de 6 dígitos a',
    'login.codeHint': 'El código caduca en 10 minutos.',
    'login.verify': 'Verificar y entrar',
    'login.resend': 'Reenviar código',
    'login.back': 'Usar otro correo',
    'login.demoHint': 'Demo: el código es',
    'login.invalid': 'Código incorrecto. Inténtalo de nuevo.',
    'login.emailInvalid': 'Introduce un correo válido.',
    'nav.home': 'Inicio',
    'nav.appointments': 'Consultas',
    'nav.schedule': 'Agenda',
    'nav.patients': 'Pacientes',
    'nav.settings': 'Ajustes',
    'nav.section.clinica': 'Clínica',
    'nav.section.general': 'General',
    'topbar.search': 'Buscar pacientes, consultas…',
    'topbar.logout': 'Cerrar sesión',
    'home.greeting': 'Buenos días',
    'home.subtitle': 'Esto es lo que ocurre hoy en tu clínica.',
    'home.stat.patients': 'Pacientes activos',
    'home.stat.today': 'Consultas hoy',
    'home.stat.pending': 'Pendientes',
    'home.stat.week': 'Esta semana',
    'home.upcoming': 'Próximas consultas',
    'home.recent': 'Pacientes recientes',
    'home.viewAll': 'Ver todos',
    'appointments.title': 'Consultas',
    'appointments.subtitle': 'Gestiona las consultas de la clínica.',
    'schedule.title': 'Agenda',
    'schedule.subtitle': 'Tu calendario de citas.',
    'placeholder.soon': 'Módulo en construcción',
    'placeholder.desc':
      'Esta sección forma parte del sistema pero queda fuera del alcance de esta prueba. La navegación y el diseño ya están listos.',
    'patients.title': 'Pacientes',
    'patients.count.one': 'paciente',
    'patients.count.other': 'pacientes',
    'patients.new': 'Nuevo paciente',
    'patients.search': 'Buscar por nombre o ID…',
    'patients.col.patient': 'Paciente',
    'patients.col.age': 'Edad',
    'patients.col.lastVisit': 'Última visita',
    'patients.col.appointments': 'Consultas',
    'patients.col.status': 'Estado',
    'patients.col.actions': 'Acciones',
    'patients.years': 'años',
    'patients.empty': 'No se encontraron pacientes.',
    'patients.view.table': 'Tabla',
    'patients.view.cards': 'Tarjetas',
    'login.asideQuote':
      'Gestiona pacientes, consultas y agenda en un único espacio claro y seguro.',
    'detail.back': 'Pacientes',
    'detail.edit': 'Editar',
    'detail.save': 'Guardar cambios',
    'detail.cancel': 'Cancelar',
    'detail.saved': 'Cambios guardados correctamente.',
    'detail.name': 'Nombre completo',
    'detail.age': 'Edad',
    'detail.tab.history': 'Histórico de consultas',
    'detail.tab.data': 'Datos',
    'detail.info': 'Información',
    'detail.id': 'Identificador',
    'detail.email': 'Correo',
    'detail.phone': 'Teléfono',
    'detail.since': 'Paciente desde',
    'detail.totalAppointments': 'consultas en total',
    'detail.with': 'con',
    'detail.ageInvalid': 'Edad no válida',
    'status.completed': 'Completada',
    'status.pending': 'Pendiente',
    'status.cancelled': 'Cancelada',
    'status.active': 'Activo',
    'theme.toggle': 'Cambiar tema',
    'settings.title': 'Ajustes',
    'settings.subtitle': 'Configuración de la plataforma.',
    'newPatient.title': 'Nuevo paciente',
    'newPatient.name': 'Nombre completo',
    'newPatient.namePlaceholder': 'Ej. Ana García López',
    'newPatient.age': 'Edad',
    'newPatient.email': 'Correo electrónico',
    'newPatient.emailPlaceholder': 'nombre@ejemplo.com',
    'newPatient.phone': 'Teléfono',
    'newPatient.phonePlaceholder': '+34 600 000 000',
    'newPatient.submit': 'Crear paciente',
    'newPatient.created': 'Paciente creado correctamente.',
    'newPatient.nameRequired': 'El nombre es obligatorio.',
    'newPatient.ageInvalid': 'Edad no válida (0–130).',
    'newPatient.emailInvalid': 'Introduce un correo válido.',
    'newPatient.phoneRequired': 'El teléfono es obligatorio.',
    'schedule.week': 'Semana',
    'schedule.day': 'Día',
    'schedule.agenda': 'Lista',
    'schedule.today': 'Hoy',
    'schedule.new': 'Nueva cita',
    'schedule.duration': 'Duración',
    'schedule.conflict': 'Conflicto de horario con otro médico',
    'schedule.noAppointments': 'Sin citas esta semana',
    'schedule.rescheduled': 'Cita reprogramada',
    'schedule.created': 'Cita creada correctamente',
    'schedule.cancelled': 'Cita cancelada',
    'schedule.cancelAppt': 'Cancelar cita',
    'schedule.patient': 'Paciente',
    'schedule.doctor': 'Médico',
    'schedule.type': 'Tipo',
    'schedule.date': 'Fecha',
    'schedule.time': 'Hora',
    'schedule.notes': 'Notas',
    'schedule.selectPatient': 'Seleccionar paciente…',
    'status.scheduled': 'Programada',
    'status.no-show': 'No presentado',
  },
  en: {
    'app.tagline': 'Clinical platform',
    'login.welcome': 'Welcome back',
    'login.subtitle': "Enter your email and we'll send you an access code.",
    'login.email': 'Email address',
    'login.emailPlaceholder': 'name@clinic.com',
    'login.sendCode': 'Send code',
    'login.codeTitle': 'Check your email',
    'login.codeSubtitle': 'We sent a 6-digit code to',
    'login.codeHint': 'The code expires in 10 minutes.',
    'login.verify': 'Verify and sign in',
    'login.resend': 'Resend code',
    'login.back': 'Use another email',
    'login.demoHint': 'Demo: the code is',
    'login.invalid': 'Incorrect code. Please try again.',
    'login.emailInvalid': 'Enter a valid email address.',
    'nav.home': 'Home',
    'nav.appointments': 'Consultations',
    'nav.schedule': 'Schedule',
    'nav.patients': 'Patients',
    'nav.settings': 'Settings',
    'nav.section.clinica': 'Clinic',
    'nav.section.general': 'General',
    'topbar.search': 'Search patients, consultations…',
    'topbar.logout': 'Sign out',
    'home.greeting': 'Good morning',
    'home.subtitle': "Here's what's happening at your clinic today.",
    'home.stat.patients': 'Active patients',
    'home.stat.today': 'Consultations today',
    'home.stat.pending': 'Pending',
    'home.stat.week': 'This week',
    'home.upcoming': 'Upcoming consultations',
    'home.recent': 'Recent patients',
    'home.viewAll': 'View all',
    'appointments.title': 'Consultations',
    'appointments.subtitle': "Manage the clinic's consultations.",
    'schedule.title': 'Schedule',
    'schedule.subtitle': 'Your appointment calendar.',
    'placeholder.soon': 'Module under construction',
    'placeholder.desc':
      'This section is part of the system but is out of scope for this test. Navigation and design are already in place.',
    'patients.title': 'Patients',
    'patients.count.one': 'patient',
    'patients.count.other': 'patients',
    'patients.new': 'New patient',
    'patients.search': 'Search by name or ID…',
    'patients.col.patient': 'Patient',
    'patients.col.age': 'Age',
    'patients.col.lastVisit': 'Last visit',
    'patients.col.appointments': 'Consultations',
    'patients.col.status': 'Status',
    'patients.col.actions': 'Actions',
    'patients.years': 'yrs',
    'patients.empty': 'No patients found.',
    'patients.view.table': 'Table',
    'patients.view.cards': 'Cards',
    'login.asideQuote': 'Manage patients, consultations and scheduling in one clear, secure space.',
    'detail.back': 'Patients',
    'detail.edit': 'Edit',
    'detail.save': 'Save changes',
    'detail.cancel': 'Cancel',
    'detail.saved': 'Changes saved successfully.',
    'detail.name': 'Full name',
    'detail.age': 'Age',
    'detail.tab.history': 'Consultation history',
    'detail.tab.data': 'Data',
    'detail.info': 'Information',
    'detail.id': 'Identifier',
    'detail.email': 'Email',
    'detail.phone': 'Phone',
    'detail.since': 'Patient since',
    'detail.totalAppointments': 'consultations in total',
    'detail.with': 'with',
    'detail.ageInvalid': 'Invalid age',
    'status.completed': 'Completed',
    'status.pending': 'Pending',
    'status.cancelled': 'Cancelled',
    'status.active': 'Active',
    'theme.toggle': 'Toggle theme',
    'settings.title': 'Settings',
    'settings.subtitle': 'Platform configuration.',
    'newPatient.title': 'New patient',
    'newPatient.name': 'Full name',
    'newPatient.namePlaceholder': 'E.g. Jane Smith',
    'newPatient.age': 'Age',
    'newPatient.email': 'Email address',
    'newPatient.emailPlaceholder': 'name@example.com',
    'newPatient.phone': 'Phone',
    'newPatient.phonePlaceholder': '+1 555 000 0000',
    'newPatient.submit': 'Create patient',
    'newPatient.created': 'Patient created successfully.',
    'newPatient.nameRequired': 'Name is required.',
    'newPatient.ageInvalid': 'Invalid age (0–130).',
    'newPatient.emailInvalid': 'Enter a valid email address.',
    'newPatient.phoneRequired': 'Phone is required.',
    'schedule.week': 'Week',
    'schedule.day': 'Day',
    'schedule.agenda': 'Agenda',
    'schedule.today': 'Today',
    'schedule.new': 'New appointment',
    'schedule.duration': 'Duration',
    'schedule.conflict': 'Schedule conflict with another doctor',
    'schedule.noAppointments': 'No appointments this week',
    'schedule.rescheduled': 'Appointment rescheduled',
    'schedule.created': 'Appointment created',
    'schedule.cancelled': 'Appointment cancelled',
    'schedule.cancelAppt': 'Cancel appointment',
    'schedule.patient': 'Patient',
    'schedule.doctor': 'Doctor',
    'schedule.type': 'Type',
    'schedule.date': 'Date',
    'schedule.time': 'Time',
    'schedule.notes': 'Notes',
    'schedule.selectPatient': 'Select patient…',
    'status.scheduled': 'Scheduled',
    'status.no-show': 'No-show',
  },
  it: {
    'app.tagline': 'Piattaforma clinica',
    'login.welcome': 'Bentornato',
    'login.subtitle': 'Inserisci la tua email e ti invieremo un codice di accesso.',
    'login.email': 'Indirizzo email',
    'login.emailPlaceholder': 'nome@clinica.com',
    'login.sendCode': 'Invia codice',
    'login.codeTitle': 'Controlla la tua email',
    'login.codeSubtitle': 'Abbiamo inviato un codice di 6 cifre a',
    'login.codeHint': 'Il codice scade tra 10 minuti.',
    'login.verify': 'Verifica ed entra',
    'login.resend': 'Invia di nuovo',
    'login.back': "Usa un'altra email",
    'login.demoHint': 'Demo: il codice è',
    'login.invalid': 'Codice errato. Riprova.',
    'login.emailInvalid': "Inserisci un'email valida.",
    'nav.home': 'Home',
    'nav.appointments': 'Consulti',
    'nav.schedule': 'Agenda',
    'nav.patients': 'Pazienti',
    'nav.settings': 'Impostazioni',
    'nav.section.clinica': 'Clinica',
    'nav.section.general': 'Generale',
    'topbar.search': 'Cerca pazienti, consulti…',
    'topbar.logout': 'Esci',
    'home.greeting': 'Buongiorno',
    'home.subtitle': 'Ecco cosa succede oggi nella tua clinica.',
    'home.stat.patients': 'Pazienti attivi',
    'home.stat.today': 'Consulti oggi',
    'home.stat.pending': 'In sospeso',
    'home.stat.week': 'Questa settimana',
    'home.upcoming': 'Prossimi consulti',
    'home.recent': 'Pazienti recenti',
    'home.viewAll': 'Vedi tutti',
    'appointments.title': 'Consulti',
    'appointments.subtitle': 'Gestisci i consulti della clinica.',
    'schedule.title': 'Agenda',
    'schedule.subtitle': 'Il tuo calendario di appuntamenti.',
    'placeholder.soon': 'Modulo in costruzione',
    'placeholder.desc':
      "Questa sezione fa parte del sistema ma è fuori dall'ambito di questo test.",
    'patients.title': 'Pazienti',
    'patients.count.one': 'paziente',
    'patients.count.other': 'pazienti',
    'patients.new': 'Nuovo paziente',
    'patients.search': 'Cerca per nome o ID…',
    'patients.col.patient': 'Paziente',
    'patients.col.age': 'Età',
    'patients.col.lastVisit': 'Ultima visita',
    'patients.col.appointments': 'Consulti',
    'patients.col.status': 'Stato',
    'patients.col.actions': 'Azioni',
    'patients.years': 'anni',
    'patients.empty': 'Nessun paziente trovato.',
    'patients.view.table': 'Tabella',
    'patients.view.cards': 'Schede',
    'login.asideQuote': 'Gestisci pazienti, consulti e agenda in un unico spazio chiaro e sicuro.',
    'detail.back': 'Pazienti',
    'detail.edit': 'Modifica',
    'detail.save': 'Salva modifiche',
    'detail.cancel': 'Annulla',
    'detail.saved': 'Modifiche salvate correttamente.',
    'detail.name': 'Nome completo',
    'detail.age': 'Età',
    'detail.tab.history': 'Storico dei consulti',
    'detail.tab.data': 'Dati',
    'detail.info': 'Informazioni',
    'detail.id': 'Identificatore',
    'detail.email': 'Email',
    'detail.phone': 'Telefono',
    'detail.since': 'Paziente dal',
    'detail.totalAppointments': 'consulti in totale',
    'detail.with': 'con',
    'detail.ageInvalid': 'Età non valida',
    'status.completed': 'Completato',
    'status.pending': 'In sospeso',
    'status.cancelled': 'Annullato',
    'status.active': 'Attivo',
    'theme.toggle': 'Cambia tema',
    'settings.title': 'Impostazioni',
    'settings.subtitle': 'Configurazione della piattaforma.',
    'newPatient.title': 'Nuovo paziente',
    'newPatient.name': 'Nome completo',
    'newPatient.namePlaceholder': 'Es. Maria Rossi',
    'newPatient.age': 'Età',
    'newPatient.email': 'Indirizzo email',
    'newPatient.emailPlaceholder': 'nome@esempio.com',
    'newPatient.phone': 'Telefono',
    'newPatient.phonePlaceholder': '+39 333 000 0000',
    'newPatient.submit': 'Crea paziente',
    'newPatient.created': 'Paziente creato correttamente.',
    'newPatient.nameRequired': 'Il nome è obbligatorio.',
    'newPatient.ageInvalid': 'Età non valida (0–130).',
    'newPatient.emailInvalid': "Inserisci un'email valida.",
    'newPatient.phoneRequired': 'Il telefono è obbligatorio.',
    'schedule.week': 'Settimana',
    'schedule.day': 'Giorno',
    'schedule.agenda': 'Lista',
    'schedule.today': 'Oggi',
    'schedule.new': 'Nuovo appuntamento',
    'schedule.duration': 'Durata',
    'schedule.conflict': 'Conflitto di orario con un altro medico',
    'schedule.noAppointments': 'Nessun appuntamento questa settimana',
    'schedule.rescheduled': 'Appuntamento riprogrammato',
    'schedule.created': 'Appuntamento creato',
    'schedule.cancelled': 'Appuntamento annullato',
    'schedule.cancelAppt': 'Annulla appuntamento',
    'schedule.patient': 'Paziente',
    'schedule.doctor': 'Medico',
    'schedule.type': 'Tipo',
    'schedule.date': 'Data',
    'schedule.time': 'Ora',
    'schedule.notes': 'Note',
    'schedule.selectPatient': 'Seleziona paziente…',
    'status.scheduled': 'Programmato',
    'status.no-show': 'Non presentato',
  },
  pt: {
    'app.tagline': 'Plataforma clínica',
    'login.welcome': 'Bem-vindo de volta',
    'login.subtitle': 'Introduza o seu email e enviaremos um código de acesso.',
    'login.email': 'Endereço de email',
    'login.emailPlaceholder': 'nome@clinica.com',
    'login.sendCode': 'Enviar código',
    'login.codeTitle': 'Verifique o seu email',
    'login.codeSubtitle': 'Enviámos um código de 6 dígitos para',
    'login.codeHint': 'O código expira em 10 minutos.',
    'login.verify': 'Verificar e entrar',
    'login.resend': 'Reenviar código',
    'login.back': 'Usar outro email',
    'login.demoHint': 'Demo: o código é',
    'login.invalid': 'Código incorreto. Tente novamente.',
    'login.emailInvalid': 'Introduza um email válido.',
    'nav.home': 'Início',
    'nav.appointments': 'Consultas',
    'nav.schedule': 'Agenda',
    'nav.patients': 'Pacientes',
    'nav.settings': 'Definições',
    'nav.section.clinica': 'Clínica',
    'nav.section.general': 'Geral',
    'topbar.search': 'Procurar pacientes, consultas…',
    'topbar.logout': 'Terminar sessão',
    'home.greeting': 'Bom dia',
    'home.subtitle': 'Eis o que está a acontecer hoje na sua clínica.',
    'home.stat.patients': 'Pacientes ativos',
    'home.stat.today': 'Consultas hoje',
    'home.stat.pending': 'Pendentes',
    'home.stat.week': 'Esta semana',
    'home.upcoming': 'Próximas consultas',
    'home.recent': 'Pacientes recentes',
    'home.viewAll': 'Ver todos',
    'appointments.title': 'Consultas',
    'appointments.subtitle': 'Faça a gestão das consultas da clínica.',
    'schedule.title': 'Agenda',
    'schedule.subtitle': 'O seu calendário de marcações.',
    'placeholder.soon': 'Módulo em construção',
    'placeholder.desc': 'Esta secção faz parte do sistema mas está fora do âmbito deste teste.',
    'patients.title': 'Pacientes',
    'patients.count.one': 'paciente',
    'patients.count.other': 'pacientes',
    'patients.new': 'Novo paciente',
    'patients.search': 'Procurar por nome ou ID…',
    'patients.col.patient': 'Paciente',
    'patients.col.age': 'Idade',
    'patients.col.lastVisit': 'Última visita',
    'patients.col.appointments': 'Consultas',
    'patients.col.status': 'Estado',
    'patients.col.actions': 'Ações',
    'patients.years': 'anos',
    'patients.empty': 'Nenhum paciente encontrado.',
    'patients.view.table': 'Tabela',
    'patients.view.cards': 'Cartões',
    'login.asideQuote':
      'Faça a gestão de pacientes, consultas e agenda num único espaço claro e seguro.',
    'detail.back': 'Pacientes',
    'detail.edit': 'Editar',
    'detail.save': 'Guardar alterações',
    'detail.cancel': 'Cancelar',
    'detail.saved': 'Alterações guardadas com sucesso.',
    'detail.name': 'Nome completo',
    'detail.age': 'Idade',
    'detail.tab.history': 'Histórico de consultas',
    'detail.tab.data': 'Dados',
    'detail.info': 'Informação',
    'detail.id': 'Identificador',
    'detail.email': 'Email',
    'detail.phone': 'Telefone',
    'detail.since': 'Paciente desde',
    'detail.totalAppointments': 'consultas no total',
    'detail.with': 'com',
    'detail.ageInvalid': 'Idade inválida',
    'status.completed': 'Concluída',
    'status.pending': 'Pendente',
    'status.cancelled': 'Cancelada',
    'status.active': 'Ativo',
    'theme.toggle': 'Mudar tema',
    'settings.title': 'Definições',
    'settings.subtitle': 'Configuração da plataforma.',
    'newPatient.title': 'Novo paciente',
    'newPatient.name': 'Nome completo',
    'newPatient.namePlaceholder': 'Ex. Maria Santos',
    'newPatient.age': 'Idade',
    'newPatient.email': 'Endereço de email',
    'newPatient.emailPlaceholder': 'nome@exemplo.com',
    'newPatient.phone': 'Telefone',
    'newPatient.phonePlaceholder': '+351 900 000 000',
    'newPatient.submit': 'Criar paciente',
    'newPatient.created': 'Paciente criado com sucesso.',
    'newPatient.nameRequired': 'O nome é obrigatório.',
    'newPatient.ageInvalid': 'Idade inválida (0–130).',
    'newPatient.emailInvalid': 'Introduza um email válido.',
    'newPatient.phoneRequired': 'O telefone é obrigatório.',
    'schedule.week': 'Semana',
    'schedule.day': 'Dia',
    'schedule.agenda': 'Lista',
    'schedule.today': 'Hoje',
    'schedule.new': 'Nova consulta',
    'schedule.duration': 'Duração',
    'schedule.conflict': 'Conflito de horário com outro médico',
    'schedule.noAppointments': 'Sem consultas esta semana',
    'schedule.rescheduled': 'Consulta reagendada',
    'schedule.created': 'Consulta criada',
    'schedule.cancelled': 'Consulta cancelada',
    'schedule.cancelAppt': 'Cancelar consulta',
    'schedule.patient': 'Paciente',
    'schedule.doctor': 'Médico',
    'schedule.type': 'Tipo',
    'schedule.date': 'Data',
    'schedule.time': 'Hora',
    'schedule.notes': 'Notas',
    'schedule.selectPatient': 'Selecionar paciente…',
    'status.scheduled': 'Agendada',
    'status.no-show': 'Não compareceu',
  },
};

const LOCALE_MAP: Record<Lang, string> = {
  es: 'es-ES',
  en: 'en-US',
  it: 'it-IT',
  pt: 'pt-PT',
};

const DATE_SHORT: Record<Lang, Intl.DateTimeFormat> = {
  es: new Intl.DateTimeFormat(LOCALE_MAP.es, { day: '2-digit', month: 'short', year: 'numeric' }),
  en: new Intl.DateTimeFormat(LOCALE_MAP.en, { day: '2-digit', month: 'short', year: 'numeric' }),
  it: new Intl.DateTimeFormat(LOCALE_MAP.it, { day: '2-digit', month: 'short', year: 'numeric' }),
  pt: new Intl.DateTimeFormat(LOCALE_MAP.pt, { day: '2-digit', month: 'short', year: 'numeric' }),
};

const DATE_LONG: Record<Lang, Intl.DateTimeFormat> = {
  es: new Intl.DateTimeFormat(LOCALE_MAP.es, { day: 'numeric', month: 'long', year: 'numeric' }),
  en: new Intl.DateTimeFormat(LOCALE_MAP.en, { day: 'numeric', month: 'long', year: 'numeric' }),
  it: new Intl.DateTimeFormat(LOCALE_MAP.it, { day: 'numeric', month: 'long', year: 'numeric' }),
  pt: new Intl.DateTimeFormat(LOCALE_MAP.pt, { day: 'numeric', month: 'long', year: 'numeric' }),
};

export function fmtDate(iso: string, lang: Lang): string {
  try {
    return DATE_SHORT[lang].format(new Date(iso));
  } catch {
    return iso;
  }
}

export function fmtDateLong(iso: string, lang: Lang): string {
  try {
    return DATE_LONG[lang].format(new Date(iso));
  } catch {
    return iso;
  }
}
