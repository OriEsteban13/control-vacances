/**
 * VacationControl — Frontend Application
 * Single Page Application for vacation management
 */

// ─────────────────────────────────────────────
// State
// ─────────────────────────────────────────────

const State = {
    user: null,
    companySettings: null,
    currentPage: 'dashboard',
    vacations: [],
    users: [],
    holidays: [],
    departments: [],
    lateArrivals: [],
    lateRanking: [],
    stats: null,
    calendarYear: new Date().getFullYear(),
    calendarMonth: new Date().getMonth() + 1,
    calendarViewType: 'monthly',
    calendarUserId: null,
    filterStatus: 'all',
    selectedEmployeeId: null,
    sickLeaves: [],
    clients: [],
    events: [],
    eventsYear: new Date().getFullYear(),
    eventsCalMonth: new Date().getMonth() + 1,
    eventsCalView: 'monthly',
    eventsFilterClient: null,
    eventsFilterTypology: null,
    eventsFilterUser: null,
    eventsFilterStatus: null,
    selectedClientId: null,
    teamView: 'cards',
    clientsListView: 'cards',
    lang: localStorage.getItem('lang') || 'es',
    theme: localStorage.getItem('theme') || 'dark',
};

// ─────────────────────────────────────────────
// i18n
// ─────────────────────────────────────────────

const _tr = {
    es: {
        dashboard: 'Dashboard', calendar: 'Calendario', my_vacations: 'Mis Vacaciones',
        requests: 'Solicitudes', team: 'Equipo', late_arrivals: 'Control Retrasos',
        delegations: 'Delegaciones', employees: 'Empleados', holidays: 'Festivos',
        departments: 'Departamentos', settings: 'Configuración',
        pending: 'Pendiente', approved: 'Aprobada', rejected: 'Rechazada',
        cancel_requested: 'Cancelación Pendiente', cancelled: 'Cancelada',
        admin: 'Administrador', manager: 'Manager', employee: 'Empleado',
        available_days: 'Días Disponibles', used_days: 'Días Usados',
        pending_days: 'Días Pendientes', total_assigned: 'Total Asignado',
        new_request: '+ Nueva Solicitud', save: 'Guardar', cancel: 'Cancelar',
        profile_photo: 'Foto de Perfil', personal_info: 'Información Personal',
        change_password: 'Cambiar Contraseña', language: 'Idioma',
        first_name: 'Nombre', last_name: 'Apellido', email: 'Email',
        current_password: 'Contraseña actual', new_password: 'Nueva contraseña (mín. 8 car.)',
        confirm_password: 'Confirmar contraseña',
        hello: '¡Hola', manage_profile: 'Gestiona tu perfil y preferencias',
        click_photo: 'Haz clic en la foto para cambiarla',
        passwords_no_match: 'Las contraseñas no coinciden', min_8: 'Mínimo 8 caracteres',
        profile_updated: 'Perfil actualizado', password_updated: 'Contraseña actualizada',
        name_required: 'El nombre es obligatorio', save_changes: 'Guardar Cambios',
        lang_changed: 'Idioma cambiado a Castellano',
        extra_days: 'Días Extras', extra_days_balance: 'Días Extras Disponibles',
        guide: 'Guía',
        nav_events: 'Eventos', nav_events_dashboard: 'Dashboard Eventos', nav_events_calendar: 'Calendario Eventos', nav_clients: 'Clientes',
        summary_for: 'Resumen de vacaciones para', sick_days_label: 'Días de Baja', total_requests_label: 'Total Solicitudes',
        absent_today: 'Ausentes Hoy', persons_label: 'persona(s)', nobody_vacation: 'Nadie está de vacaciones hoy.',
        until_date: 'hasta', on_sick_leave: 'De Baja', nobody_sick: 'Nadie está de baja actualmente.',
        upcoming_absences: 'Próximas Ausencias', next_7_days: 'Próximos 7 días', no_absences_week: 'Sin ausencias previstas esta semana.',
        vacations_by_month: 'Vacaciones por Mes', by_department: 'Por Departamento', no_dept_data: 'Sin datos de departamentos',
        last_requests: 'Últimas Solicitudes', no_requests_empty: 'Sin solicitudes', no_vacations_msg: 'No hay solicitudes de vacaciones',
        since_date: 'desde', my_vacations_subtitle: 'Gestiona tus solicitudes de vacaciones', my_requests: 'Mis Solicitudes',
        first_request_hint: 'Crea tu primera solicitud de vacaciones',
        extra_days_note: 'días extras generados', extra_days_auto: 'Se usarán automáticamente cuando hayas agotado los días normales.',
        withdraw: 'Retirar', request_cancellation: 'Solicitar cancelación', cancel_in_review: 'Cancelación en revisión',
        th_employee: 'Empleado', th_dates: 'Fechas', th_type: 'Tipo', th_days: 'Días', th_status: 'Estado', th_actions: 'Acciones', th_reason: 'Motivo',
        requests_title: 'Solicitudes de Vacaciones', requests_subtitle: 'Revisa y gestiona las solicitudes del equipo',
        bulk_approve_btn: 'Aprobar seleccionadas', export_csv: 'Exportar CSV',
        filter_all: 'Todas', filter_pending_label: 'Pendientes', filter_approved_label: 'Aprobadas', filter_rejected_label: 'Rechazadas', filter_cancellations: 'Cancelaciones',
        team_subtitle: 'Estado de vacaciones de tu equipo', used_label: 'Usados', available_label: 'Disponibles', pending_label: 'Pendientes',
        employees_title: 'Gestión de Empleados', employees_subtitle: 'Administra empleados y asignación de días',
        new_employee: 'Nuevo Empleado', company_identity: 'Identidad de Empresa', company_name_label: 'Nombre de la empresa',
        th_email: 'Email', th_department: 'Departamento', th_role: 'Rol', th_total_days: 'Días Totales',
        holidays_title: 'Festivos', holidays_subtitle: 'Gestiona los días festivos oficiales', new_holiday: '+ Nuevo Festivo',
        no_holidays: 'Sin festivos', no_holidays_hint: 'Añade los días festivos del año',
        depts_title: 'Configuración de Departamentos', depts_subtitle: 'Gestiona las áreas de la empresa y sus reglas de vacaciones',
        new_department: 'Nuevo Departamento', th_name: 'Nombre', th_description: 'Descripción',
        th_max_sim: 'Máx. Simultáneos', th_min_adv: 'Antelación mín.', th_max_cons: 'Máx. consecutivos',
        days_suffix: 'días', rules_btn: 'Reglas',
        late_title: 'Control de Retrasos', late_subtitle: 'Registro de entradas fuera de horario',
        extra_days_title: 'Días Extras', extra_days_subtitle: 'Gestión de días adicionales por trabajo en fines de semana',
        req_history: 'Historial de Solicitudes', personal_cal: 'Calendario Personal',
        select_employee: 'Selecciona un empleado', employee_not_found: 'Empleado no encontrado',
        save: 'Guardar', create: 'Crear', edit: 'Editar', delete: 'Eliminar',
        yes_delete: 'Sí, eliminar', no_cancel: 'No, cancelar',
        carryover_days: 'Días Arrastrados', carryover_from: 'Del año anterior',
        carryover_breakdown: 'días del año + {c} arrastrados del año anterior = {t} disponibles',
        close_year_title: 'Cierre de Año', close_year_subtitle: 'Calcula y traslada los días no usados al año siguiente',
        year_to_close: 'Año a cerrar', preview_btn: 'Vista previa', execute_close: 'Ejecutar Cierre',
        close_year_done: 'Cierre ejecutado correctamente para', close_year_confirm: '¿Ejecutar el cierre del año {y}? Los días no usados se trasladarán al año {n}.',
        th_allocation: 'Asignación', th_carryover: 'Arrastre', th_remaining: 'Restantes',
        edit_carryover: 'Editar arrastre',
    },
    en: {
        dashboard: 'Dashboard', calendar: 'Calendar', my_vacations: 'My Vacations',
        requests: 'Requests', team: 'Team', late_arrivals: 'Late Arrivals',
        delegations: 'Delegations', employees: 'Employees', holidays: 'Public Holidays',
        departments: 'Departments', settings: 'Settings',
        pending: 'Pending', approved: 'Approved', rejected: 'Rejected',
        cancel_requested: 'Cancellation Pending', cancelled: 'Cancelled',
        admin: 'Administrator', manager: 'Manager', employee: 'Employee',
        available_days: 'Available Days', used_days: 'Days Used',
        pending_days: 'Pending Days', total_assigned: 'Total Assigned',
        new_request: '+ New Request', save: 'Save', cancel: 'Cancel',
        profile_photo: 'Profile Photo', personal_info: 'Personal Information',
        change_password: 'Change Password', language: 'Language',
        first_name: 'First Name', last_name: 'Last Name', email: 'Email',
        current_password: 'Current password', new_password: 'New password (min. 8 char.)',
        confirm_password: 'Confirm password',
        hello: 'Hello', manage_profile: 'Manage your profile and preferences',
        click_photo: 'Click on the photo to change it',
        passwords_no_match: 'Passwords do not match', min_8: 'Minimum 8 characters',
        profile_updated: 'Profile updated', password_updated: 'Password updated',
        name_required: 'Name is required', save_changes: 'Save Changes',
        lang_changed: 'Language changed to English',
        extra_days: 'Extra Days', extra_days_balance: 'Extra Days Available',
        guide: 'Guide',
        nav_events: 'Events', nav_events_dashboard: 'Events Dashboard', nav_events_calendar: 'Events Calendar', nav_clients: 'Clients',
        summary_for: 'Vacation summary for', sick_days_label: 'Sick Days', total_requests_label: 'Total Requests',
        absent_today: 'Absent Today', persons_label: 'person(s)', nobody_vacation: 'Nobody is on vacation today.',
        until_date: 'until', on_sick_leave: 'On Sick Leave', nobody_sick: 'Nobody is currently on sick leave.',
        upcoming_absences: 'Upcoming Absences', next_7_days: 'Next 7 days', no_absences_week: 'No absences planned this week.',
        vacations_by_month: 'Vacations by Month', by_department: 'By Department', no_dept_data: 'No department data',
        last_requests: 'Latest Requests', no_requests_empty: 'No requests', no_vacations_msg: 'No vacation requests',
        since_date: 'since', my_vacations_subtitle: 'Manage your vacation requests', my_requests: 'My Requests',
        first_request_hint: 'Create your first vacation request',
        extra_days_note: 'generated extra days', extra_days_auto: 'They will be used automatically once normal days are exhausted.',
        withdraw: 'Withdraw', request_cancellation: 'Request cancellation', cancel_in_review: 'Cancellation under review',
        th_employee: 'Employee', th_dates: 'Dates', th_type: 'Type', th_days: 'Days', th_status: 'Status', th_actions: 'Actions', th_reason: 'Reason',
        requests_title: 'Vacation Requests', requests_subtitle: 'Review and manage team requests',
        bulk_approve_btn: 'Approve selected', export_csv: 'Export CSV',
        filter_all: 'All', filter_pending_label: 'Pending', filter_approved_label: 'Approved', filter_rejected_label: 'Rejected', filter_cancellations: 'Cancellations',
        team_subtitle: "Your team's vacation status", used_label: 'Used', available_label: 'Available', pending_label: 'Pending',
        employees_title: 'Employee Management', employees_subtitle: 'Manage employees and day allocation',
        new_employee: 'New Employee', company_identity: 'Company Identity', company_name_label: 'Company name',
        th_email: 'Email', th_department: 'Department', th_role: 'Role', th_total_days: 'Total Days',
        holidays_title: 'Public Holidays', holidays_subtitle: 'Manage official public holidays', new_holiday: '+ New Holiday',
        no_holidays: 'No holidays', no_holidays_hint: 'Add the holidays for the year',
        depts_title: 'Department Settings', depts_subtitle: 'Manage company areas and their vacation rules',
        new_department: 'New Department', th_name: 'Name', th_description: 'Description',
        th_max_sim: 'Max. Simultaneous', th_min_adv: 'Min. advance', th_max_cons: 'Max. consecutive',
        days_suffix: 'days', rules_btn: 'Rules',
        late_title: 'Late Arrivals Log', late_subtitle: 'Record of late check-ins',
        extra_days_title: 'Extra Days', extra_days_subtitle: 'Manage additional days for weekend work',
        req_history: 'Request History', personal_cal: 'Personal Calendar',
        select_employee: 'Select an employee', employee_not_found: 'Employee not found',
        save: 'Save', create: 'Create', edit: 'Edit', delete: 'Delete',
        yes_delete: 'Yes, delete', no_cancel: 'No, cancel',
        carryover_days: 'Carried-Over Days', carryover_from: 'From previous year',
        carryover_breakdown: 'days this year + {c} carried over = {t} available',
        close_year_title: 'Year Close', close_year_subtitle: 'Calculate and carry unused days to the next year',
        year_to_close: 'Year to close', preview_btn: 'Preview', execute_close: 'Execute Close',
        close_year_done: 'Year close executed for', close_year_confirm: 'Execute year close for {y}? Unused days will be carried to {n}.',
        th_allocation: 'Allocation', th_carryover: 'Carryover', th_remaining: 'Remaining',
        edit_carryover: 'Edit carryover',
    },
    ca: {
        dashboard: 'Tauler', calendar: 'Calendari', my_vacations: 'Les meves vacances',
        requests: 'Sol·licituds', team: 'Equip', late_arrivals: 'Control Retards',
        delegations: 'Delegacions', employees: 'Empleats', holidays: 'Festius',
        departments: 'Departaments', settings: 'Configuració',
        pending: 'Pendent', approved: 'Aprovada', rejected: 'Rebutjada',
        cancel_requested: "Cancel·lació pendent", cancelled: 'Cancel·lada',
        admin: 'Administrador', manager: 'Manager', employee: 'Empleat',
        available_days: 'Dies Disponibles', used_days: 'Dies Usats',
        pending_days: 'Dies Pendents', total_assigned: 'Total Assignat',
        new_request: '+ Nova Sol·licitud', save: 'Desar', cancel: 'Cancel·lar',
        profile_photo: 'Foto de Perfil', personal_info: 'Informació Personal',
        change_password: 'Canviar Contrasenya', language: 'Idioma',
        first_name: 'Nom', last_name: 'Cognoms', email: 'Correu electrònic',
        current_password: 'Contrasenya actual', new_password: 'Nova contrasenya (mín. 8 car.)',
        confirm_password: 'Confirmar contrasenya',
        hello: 'Hola', manage_profile: 'Gestiona el teu perfil i preferències',
        click_photo: 'Fes clic a la foto per canviar-la',
        passwords_no_match: 'Les contrasenyes no coincideixen', min_8: 'Mínim 8 caràcters',
        profile_updated: 'Perfil actualitzat', password_updated: 'Contrasenya actualitzada',
        name_required: 'El nom és obligatori', save_changes: 'Desar Canvis',
        lang_changed: "Idioma canviat a Català",
        extra_days: 'Dies Extres', extra_days_balance: 'Dies Extres Disponibles',
        guide: 'Guia',
        nav_events: 'Esdeveniments', nav_events_dashboard: 'Tauler Esdeveniments', nav_events_calendar: 'Calendari Esdeveniments', nav_clients: 'Clients',
        summary_for: 'Resum de vacances per a', sick_days_label: 'Dies de Baixa', total_requests_label: 'Total Sol·licituds',
        absent_today: 'Absents Avui', persons_label: 'persona/es', nobody_vacation: 'Ningú és de vacances avui.',
        until_date: 'fins', on_sick_leave: 'De Baixa', nobody_sick: 'Ningú és de baixa.',
        upcoming_absences: 'Pròximes Absències', next_7_days: 'Pròxims 7 dies', no_absences_week: 'Sense absències previstes aquesta setmana.',
        vacations_by_month: 'Vacances per Mes', by_department: 'Per Departament', no_dept_data: 'Sense dades de departaments',
        last_requests: 'Últimes Sol·licituds', no_requests_empty: 'Sense sol·licituds', no_vacations_msg: 'No hi ha sol·licituds de vacances',
        since_date: 'des de', my_vacations_subtitle: 'Gestiona les teves sol·licituds de vacances', my_requests: 'Les meves sol·licituds',
        first_request_hint: 'Crea la teva primera sol·licitud de vacances',
        extra_days_note: 'dies extres generats', extra_days_auto: "S'usaran automàticament quan hagis esgotat els dies normals.",
        withdraw: 'Retirar', request_cancellation: "Sol·licitar cancel·lació", cancel_in_review: "Cancel·lació en revisió",
        th_employee: 'Empleat', th_dates: 'Dates', th_type: 'Tipus', th_days: 'Dies', th_status: 'Estat', th_actions: 'Accions', th_reason: 'Motiu',
        requests_title: "Sol·licituds de Vacances", requests_subtitle: "Revisa i gestiona les sol·licituds de l'equip",
        bulk_approve_btn: 'Aprovar seleccionades', export_csv: 'Exportar CSV',
        filter_all: 'Totes', filter_pending_label: 'Pendents', filter_approved_label: 'Aprovades', filter_rejected_label: 'Rebutjades', filter_cancellations: "Cancel·lacions",
        team_subtitle: "Estat de vacances de l'equip", used_label: 'Usats', available_label: 'Disponibles', pending_label: 'Pendents',
        employees_title: "Gestió d'Empleats", employees_subtitle: 'Administra empleats i assignació de dies',
        new_employee: 'Nou Empleat', company_identity: "Identitat d'Empresa", company_name_label: "Nom de l'empresa",
        th_email: 'Email', th_department: 'Departament', th_role: 'Rol', th_total_days: 'Dies Totals',
        holidays_title: 'Festius', holidays_subtitle: 'Gestiona els dies festius oficials', new_holiday: '+ Nou Festiu',
        no_holidays: 'Sense festius', no_holidays_hint: "Afegeix els dies festius de l'any",
        depts_title: 'Configuració de Departaments', depts_subtitle: "Gestiona les àrees de l'empresa i les seves regles de vacances",
        new_department: 'Nou Departament', th_name: 'Nom', th_description: 'Descripció',
        th_max_sim: 'Màx. Simultanis', th_min_adv: 'Antelació mín.', th_max_cons: 'Màx. consecutius',
        days_suffix: 'dies', rules_btn: 'Regles',
        late_title: 'Control de Retards', late_subtitle: 'Registre d\'entrades fora d\'horari',
        extra_days_title: 'Dies Extres', extra_days_subtitle: 'Gestió de dies addicionals per treball en caps de setmana',
        req_history: "Historial de Sol·licituds", personal_cal: 'Calendari Personal',
        select_employee: "Selecciona un empleat", employee_not_found: "Empleat no trobat",
        save: 'Desar', create: 'Crear', edit: 'Editar', delete: 'Eliminar',
        yes_delete: 'Sí, eliminar', no_cancel: 'No, cancel·lar',
        carryover_days: 'Dies Arrossegats', carryover_from: "De l'any anterior",
        carryover_breakdown: "dies de l'any + {c} arrossegats de l'any anterior = {t} disponibles",
        close_year_title: "Tancament d'Any", close_year_subtitle: "Calcula i trasllada els dies no usats a l'any següent",
        year_to_close: "Any a tancar", preview_btn: 'Vista prèvia', execute_close: 'Executar Tancament',
        close_year_done: "Tancament executat correctament per a", close_year_confirm: "Executar el tancament de l'any {y}? Els dies no usats es traslladaran a l'any {n}.",
        th_allocation: 'Assignació', th_carryover: 'Arrossegament', th_remaining: 'Restants',
        edit_carryover: "Editar arrossegament",
    },
};

function t(key) {
    return _tr[State.lang]?.[key] ?? _tr.es[key] ?? key;
}

let _pendingAvatarImage = undefined;
let _csrfToken = null;

// ─────────────────────────────────────────────
// Security helpers
// ─────────────────────────────────────────────

/** HTML-escape a value to prevent XSS when inserting into innerHTML */
function esc(val) {
    const d = document.createElement('div');
    d.textContent = val == null ? '' : String(val);
    return d.innerHTML;
}

/** Sanitize with DOMPurify if available, fallback to esc() */
function safe(val) {
    if (typeof DOMPurify !== 'undefined') return DOMPurify.sanitize(val == null ? '' : String(val));
    return esc(val);
}

// ─────────────────────────────────────────────
// API
// ─────────────────────────────────────────────

async function api(url, options = {}) {
    let res;
    const headers = {
        'Content-Type': 'application/json',
        ...(_csrfToken ? { 'X-CSRF-Token': _csrfToken } : {}),
        ...options.headers,
    };
    try {
        res = await fetch(url, { headers, ...options });
    } catch (e) {
        throw new Error('No se puede conectar al servidor. Comprueba tu conexión.');
    }
    let data;
    try {
        data = await res.json();
    } catch (e) {
        if (res.status === 502 || res.status === 503 || res.status === 504) {
            throw new Error('El servicio está iniciando, por favor espera unos segundos e inténtalo de nuevo.');
        }
        throw new Error(`Error del servidor (${res.status})`);
    }
    if (!res.ok && !data.success) {
        throw new Error(data.error || 'Error del servidor');
    }
    return data;
}

// ─────────────────────────────────────────────
// Image Helpers
// ─────────────────────────────────────────────

async function resizeImage(file, maxPx = 256) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let w = img.width, h = img.height;
                if (w > maxPx || h > maxPx) {
                    if (w > h) { h = Math.round(h * maxPx / w); w = maxPx; }
                    else { w = Math.round(w * maxPx / h); h = maxPx; }
                }
                canvas.width = w; canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                resolve(canvas.toDataURL('image/jpeg', 0.82));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

function renderAvatarEl(color, initials, avatarImage, size = 36) {
    const sizeStyle = `width:${size}px;height:${size}px;`;
    if (avatarImage) {
        return `<img src="${avatarImage}" class="user-avatar" style="${sizeStyle}object-fit:cover;padding:0;" alt="">`;
    }
    const fs = size <= 32 ? '0.7rem' : size <= 48 ? '0.85rem' : '1.1rem';
    return `<div class="user-avatar" style="background:${color};${sizeStyle}font-size:${fs};">${initials}</div>`;
}

// ─────────────────────────────────────────────
// Toast Notifications
// ─────────────────────────────────────────────

function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type] || ''}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ─────────────────────────────────────────────
// Logo & Avatar Upload
// ─────────────────────────────────────────────

window.handleLogoUpload = async function(input) {
    const file = input.files[0];
    if (!file) return;
    try {
        const logoData = await resizeImage(file, 200);
        const result = await api('/api/settings', {
            method: 'POST',
            body: JSON.stringify({ logo_data: logoData })
        });
        State.companySettings = { ...State.companySettings, logo_data: result.logo_data };
        showToast('Logo actualizado', 'success');
        renderApp();
        renderPage();
    } catch (err) {
        showToast(err.message, 'error');
    }
};

window.saveCompanyName = async function() {
    const input = document.getElementById('_companyNameInput');
    const name = input?.value?.trim();
    if (!name) { showToast('Escribe un nombre', 'error'); return; }
    try {
        const result = await api('/api/settings', {
            method: 'POST',
            body: JSON.stringify({ company_name: name })
        });
        State.companySettings = { ...State.companySettings, company_name: result.company_name };
        showToast('Nombre de empresa guardado', 'success');
        renderApp();
        renderPage();
    } catch (err) {
        showToast(err.message, 'error');
    }
};

window.uploadProfileAvatar = async function(input, userId) {
    const file = input.files[0];
    if (!file) return;
    try {
        const imgData = await resizeImage(file, 256);
        await api(`/api/users/${userId}/avatar`, {
            method: 'POST',
            body: JSON.stringify({ avatar_image: imgData })
        });
        if (State.user.id === userId) {
            const me = await api('/api/me');
            if (me.authenticated) State.user = me.user;
        }
        showToast('Foto actualizada', 'success');
        renderPage();
    } catch (err) {
        showToast(err.message, 'error');
    }
};

window.previewAvatarChange = async function(input) {
    const file = input.files[0];
    if (!file) return;
    const data = await resizeImage(file, 256);
    _pendingAvatarImage = data;
    const preview = document.getElementById('_avatarPreview');
    if (preview) preview.innerHTML = `<img src="${data}" class="user-avatar" style="width:64px;height:64px;object-fit:cover;padding:0;" alt="">`;
};

window.clearAvatarChange = function() {
    _pendingAvatarImage = null;
    const preview = document.getElementById('_avatarPreview');
    if (preview) preview.innerHTML = '<div class="user-avatar" style="width:64px;height:64px;font-size:1.3rem;background:#b2bec3;color:#636e72;">✕</div>';
};

// ─────────────────────────────────────────────
// Router
// ─────────────────────────────────────────────

function navigateTo(page) {
    State.currentPage = page;
    renderApp();

    // Update active nav
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const activeNav = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (activeNav) activeNav.classList.add('active');
}

// ─────────────────────────────────────────────
// Render Functions
// ─────────────────────────────────────────────

function renderApp() {
    const app = document.getElementById('app');
    if (!State.user) {
        app.innerHTML = renderLogin();
        bindLoginEvents();
    } else if (State.user.must_change_password) {
        app.innerHTML = renderForceChangePassword();
        bindForceChangeEvents();
    } else {
        app.innerHTML = renderLayout();
        bindSidebarEvents();
        renderPage();
    }
}

// ─── Login ─────────────────────────────

function renderLogin() {
    const logo = State.companySettings?.logo_data;
    const name = esc(State.companySettings?.company_name || 'VacationControl');
    return `
    <div class="login-container">
        <div class="login-card">
            <div class="login-logo">
                ${logo ? `<img src="${logo}" class="login-logo-img" alt="Logo">` : '<div class="logo-icon">🌴</div>'}
                <h1>${name}</h1>
                <p>Gestión inteligente de vacaciones</p>
            </div>
            <div class="login-error" id="loginError"></div>
            <div id="loginView">
                <form id="loginForm">
                    <div class="form-group">
                        <label for="username">Usuario o email</label>
                        <input type="text" id="username" class="form-input" placeholder="Tu usuario o email" autocomplete="username" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Contraseña</label>
                        <input type="password" id="password" class="form-input" placeholder="Tu contraseña" autocomplete="current-password" required>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full" id="loginBtn">Iniciar Sesión</button>
                </form>
                <p style="margin-top:12px;text-align:center;">
                    <button class="btn-link" onclick="showForgotPassword()">¿Olvidaste tu contraseña?</button>
                </p>
            </div>
            <div id="forgotView" style="display:none;">
                <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:12px;">
                    Escribe tu email y te enviaremos un enlace para restablecer tu contraseña.
                </p>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="forgotEmail" class="form-input" placeholder="tu@empresa.com">
                </div>
                <button class="btn btn-primary btn-full" id="forgotBtn" onclick="submitForgotPassword()">Enviar enlace</button>
                <p style="margin-top:12px;text-align:center;">
                    <button class="btn-link" onclick="showLoginForm()">← Volver al inicio de sesión</button>
                </p>
            </div>
            <p style="margin-top: 14px; font-size: 0.78rem; color: var(--text-dim); text-align: center;">
                Si el servidor acaba de despertar, el primer inicio de sesión puede tardar unos segundos.
            </p>
            <p style="margin-top:8px;font-size:0.72rem;color:var(--text-dim);text-align:center;">
                <a href="/privacy" target="_blank" style="color:var(--text-dim);">Privacidad</a> ·
                <a href="/legal" target="_blank" style="color:var(--text-dim);">Aviso legal</a>
            </p>
        </div>
    </div>`;
}

function renderForceChangePassword() {
    const name = esc(State.companySettings?.company_name || 'VacationControl');
    const logo = State.companySettings?.logo_data;
    return `
    <div class="login-container">
        <div class="login-card">
            <div class="login-logo">
                ${logo ? `<img src="${logo}" class="login-logo-img" alt="Logo">` : '<div class="logo-icon">🌴</div>'}
                <h1>${name}</h1>
                <p>Debes cambiar tu contraseña antes de continuar</p>
            </div>
            <div class="login-error" id="cpError"></div>
            <div class="form-group">
                <label>Contraseña actual</label>
                <input type="password" id="cpCurrent" class="form-input" placeholder="Contraseña temporal recibida">
            </div>
            <div class="form-group">
                <label>Nueva contraseña (mín. 8 caracteres)</label>
                <input type="password" id="cpNew" class="form-input" placeholder="Nueva contraseña">
            </div>
            <div class="form-group">
                <label>Confirmar nueva contraseña</label>
                <input type="password" id="cpConfirm" class="form-input" placeholder="Repite la nueva contraseña">
            </div>
            <button class="btn btn-primary btn-full" id="cpBtn" onclick="submitForceChange()">Cambiar contraseña</button>
        </div>
    </div>`;
}

function bindLoginEvents() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorEl = document.getElementById('loginError');
        const btn = document.getElementById('loginBtn');

        btn.textContent = 'Entrando...';
        btn.disabled = true;

        try {
            const data = await api('/api/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });
            _csrfToken = data.csrf_token;
            State.user = data.user;
            renderApp();
            if (!State.user.must_change_password) {
                showToast(`¡Bienvenido, ${esc(State.user.first_name)}!`, 'success');
            }
        } catch (err) {
            errorEl.textContent = err.message;
            errorEl.classList.add('visible');
            btn.textContent = 'Iniciar Sesión';
            btn.disabled = false;
        }
    });
}

function bindForceChangeEvents() { /* events bound inline via onclick */ }

window.showForgotPassword = function() {
    document.getElementById('loginView').style.display = 'none';
    document.getElementById('forgotView').style.display = '';
    document.getElementById('loginError').classList.remove('visible');
};

window.showLoginForm = function() {
    document.getElementById('forgotView').style.display = 'none';
    document.getElementById('loginView').style.display = '';
    document.getElementById('loginError').classList.remove('visible');
};

window.submitForgotPassword = async function() {
    const email = document.getElementById('forgotEmail').value.trim();
    const btn = document.getElementById('forgotBtn');
    const errorEl = document.getElementById('loginError');
    if (!email) { errorEl.textContent = 'Escribe tu email'; errorEl.classList.add('visible'); return; }
    btn.textContent = 'Enviando...'; btn.disabled = true;
    try {
        const res = await api('/api/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
        errorEl.classList.remove('visible');
        showToast(res.message, 'success');
        showLoginForm();
    } catch (err) {
        errorEl.textContent = err.message; errorEl.classList.add('visible');
    } finally {
        btn.textContent = 'Enviar enlace'; btn.disabled = false;
    }
};

window.submitForceChange = async function() {
    const current = document.getElementById('cpCurrent').value;
    const newPw = document.getElementById('cpNew').value;
    const confirm = document.getElementById('cpConfirm').value;
    const errorEl = document.getElementById('cpError');
    const btn = document.getElementById('cpBtn');

    if (newPw !== confirm) {
        errorEl.textContent = 'Las contraseñas no coinciden'; errorEl.classList.add('visible'); return;
    }
    if (newPw.length < 8) {
        errorEl.textContent = 'La contraseña debe tener al menos 8 caracteres'; errorEl.classList.add('visible'); return;
    }
    btn.textContent = 'Guardando...'; btn.disabled = true;
    try {
        const data = await api('/api/change-password', {
            method: 'POST',
            body: JSON.stringify({ current_password: current, new_password: newPw })
        });
        State.user = data.user;
        showToast('Contraseña actualizada. ¡Bienvenido!', 'success');
        renderApp();
    } catch (err) {
        errorEl.textContent = err.message; errorEl.classList.add('visible');
        btn.textContent = 'Cambiar contraseña'; btn.disabled = false;
    }
};

// ─── Layout ────────────────────────────

function renderLayout() {
    const u = State.user;
    const isAdmin = u.role === 'admin';
    const isManager = u.role === 'admin' || u.role === 'manager';
    const logo = State.companySettings?.logo_data;
    const companyName = State.companySettings?.company_name || 'VacationCtrl';

    return `
    <div class="app-layout">
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <div class="sidebar-brand">
                    ${logo ? `<img src="${logo}" class="sidebar-logo-img" alt="Logo">` : '<div class="brand-icon">🌴</div>'}
                    <h2>${companyName}</h2>
                    ${isAdmin ? `
                    <button class="logo-upload-btn" onclick="event.stopPropagation();document.getElementById('_logoFileHidden').click()" title="Cambiar logo de empresa">✏️</button>
                    <input type="file" id="_logoFileHidden" accept="image/*" style="display:none" onchange="handleLogoUpload(this)">
                    ` : ''}
                    <button onclick="setTheme(State.theme==='dark'?'light':'dark')" title="${State.theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}"
                        style="margin-left:auto;background:none;border:none;cursor:pointer;font-size:1.1rem;padding:4px;border-radius:6px;line-height:1;opacity:0.7;transition:opacity 0.15s;"
                        onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">
                        ${State.theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                </div>
            </div>
            <nav class="sidebar-nav">
                <div class="nav-section-title">${t('my_vacations')}</div>
                <div class="nav-item active" data-page="dashboard">
                    <span class="nav-icon">📊</span>
                    <span>${t('dashboard')}</span>
                </div>
                <div class="nav-item" data-page="calendar">
                    <span class="nav-icon">📅</span>
                    <span>${t('calendar')}</span>
                </div>
                <div class="nav-item" data-page="my-vacations">
                    <span class="nav-icon">🏖️</span>
                    <span>${t('my_vacations')}</span>
                </div>

                <div class="nav-section-title">${t('nav_events')}</div>
                <div class="nav-item" data-page="events">
                    <span class="nav-icon">🎯</span>
                    <span>${t('nav_events_dashboard')}</span>
                </div>
                <div class="nav-item" data-page="events-calendar">
                    <span class="nav-icon">📆</span>
                    <span>${t('nav_events_calendar')}</span>
                </div>
                <div class="nav-item" data-page="clients-config">
                    <span class="nav-icon">🏢</span>
                    <span>${t('nav_clients')}</span>
                </div>

                ${isManager ? `
                <div class="nav-section-title">${State.lang === 'en' ? 'Management' : State.lang === 'ca' ? 'Gestió' : 'Gestión'}</div>
                <div class="nav-item" data-page="requests">
                    <span class="nav-icon">📋</span>
                    <span>${t('requests')}</span>
                    <span class="nav-badge" id="pendingBadge" style="display:none">0</span>
                </div>
                <div class="nav-item" data-page="team">
                    <span class="nav-icon">👥</span>
                    <span>${t('team')}</span>
                </div>
                <div class="nav-item" data-page="late-arrivals">
                    <span class="nav-icon">⏰</span>
                    <span>${t('late_arrivals')}</span>
                </div>
                <div class="nav-item" data-page="delegations">
                    <span class="nav-icon">🔁</span>
                    <span>${t('delegations')}</span>
                </div>
                ` : ''}
                ${isAdmin ? `
                <div class="nav-section-title">${State.lang === 'en' ? 'Administration' : State.lang === 'ca' ? 'Administració' : 'Administración'}</div>
                <div class="nav-item" data-page="employees">
                    <span class="nav-icon">⚙️</span>
                    <span>${t('employees')}</span>
                </div>
                <div class="nav-item" data-page="sick-leaves">
                    <span class="nav-icon">🏥</span>
                    <span>${State.lang === 'en' ? 'Sick Leaves' : State.lang === 'ca' ? 'Baixes' : 'Bajas'}</span>
                </div>
                <div class="nav-item" data-page="holidays">
                    <span class="nav-icon">🎉</span>
                    <span>${t('holidays')}</span>
                </div>
                <div class="nav-item" data-page="departments">
                    <span class="nav-icon">🏢</span>
                    <span>${t('departments')}</span>
                </div>
                <div class="nav-item" data-page="extra-days">
                    <span class="nav-icon">⭐</span>
                    <span>${t('extra_days')}</span>
                </div>
                ` : ''}
                <div class="nav-section-title">${State.lang === 'en' ? 'Account' : State.lang === 'ca' ? 'Compte' : 'Cuenta'}</div>
                <div class="nav-item" data-page="guide">
                    <span class="nav-icon">📖</span>
                    <span>${t('guide')}</span>
                </div>
                <div class="nav-item" data-page="settings">
                    <span class="nav-icon">⚙️</span>
                    <span>${t('settings')}</span>
                </div>
            </nav>
            <div class="sidebar-footer">
                <div class="user-card">
                    ${renderAvatarEl(u.avatar_color, u.initials, u.avatar_image, 36)}
                    <div class="user-info">
                        <div class="name">${esc(u.full_name)}</div>
                        <div class="role">${translateRole(u.role)}</div>
                    </div>
                    <button class="logout-btn" id="logoutBtn" title="Cerrar sesión">🚪</button>
                </div>
            </div>
        </aside>
        <main class="main-content" id="mainContent">
            <div class="loading-spinner"><div class="spinner"></div></div>
        </main>
    </div>`;
}

function bindSidebarEvents() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            if (page) navigateTo(page);
        });
    });

    document.getElementById('logoutBtn')?.addEventListener('click', async () => {
        await api('/api/logout', { method: 'POST' });
        State.user = null;
        State.vacations = [];
        State.users = [];
        renderApp();
        showToast('Sesión cerrada', 'info');
    });
}

// ─── Page Router ───────────────────────

async function renderPage() {
    const main = document.getElementById('mainContent');
    if (!main) return;

    main.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';

    try {
        switch (State.currentPage) {
            case 'dashboard':
                await loadDashboard(main);
                break;
            case 'calendar':
                await loadCalendar(main);
                break;
            case 'my-vacations':
                await loadMyVacations(main);
                break;
            case 'requests':
                await loadRequests(main);
                break;
            case 'team':
                await loadTeam(main);
                break;
            case 'employees':
                await loadEmployees(main);
                break;
            case 'holidays':
                await loadHolidays(main);
                break;
            case 'departments':
                await loadDepartments(main);
                break;
            case 'employee-details':
                await loadEmployeeDetails(main, State.selectedEmployeeId);
                break;
            case 'late-arrivals':
                await loadLateArrivals(main);
                break;
            case 'sick-leaves':
                await loadSickLeaves(main);
                break;
            case 'events':
                await loadEvents(main);
                break;
            case 'events-calendar':
                await loadEventsCalendar(main);
                break;
            case 'clients-config':
                await loadClientsConfig(main);
                break;
            case 'extra-days':
                await loadExtraDays(main);
                break;
            case 'delegations':
                await loadDelegations(main);
                break;
            case 'settings':
                await loadSettings(main);
                break;
            case 'guide':
                await loadGuide(main);
                break;
            default:
                await loadDashboard(main);
        }
    } catch (err) {
        main.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><h3>Error</h3><p>${err.message}</p></div>`;
    }

    // Update pending badge
    updatePendingBadge();
}

async function updatePendingBadge() {
    try {
        const vacations = await api('/api/vacations');
        const count = vacations.filter(v => v.status === 'pending' || v.status === 'cancel_requested').length;
        const badge = document.getElementById('pendingBadge');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline' : 'none';
        }
    } catch (e) { /* ignore */ }
}

// ─────────────────────────────────────────────
// Dashboard Page
// ─────────────────────────────────────────────

async function loadDashboard(container) {
    const [stats, vacations, absToday, absUpcoming] = await Promise.all([
        api('/api/stats'),
        api('/api/vacations'),
        api('/api/absences/today'),
        api('/api/absences/upcoming?days=7'),
    ]);
    // Separate sick leaves from vacation absences for today
    const sickToday = absToday.filter(a => a.absence_type === 'sick_leave');
    const vacToday = absToday.filter(a => a.absence_type !== 'sick_leave');
    State.stats = stats;
    State.vacations = vacations;

    const u = State.user;
    const isManager = u.role === 'admin' || u.role === 'manager';
    const allocDays = u.allocated_days || u.total_days;
    const pct = allocDays > 0 ? (u.days_used / allocDays) * 100 : 0;

    container.innerHTML = `
    <div class="page-enter">
        <div class="page-header">
            <h1>${t('hello')}, ${esc(u.first_name)}! 👋</h1>
            <p>${t('summary_for')} ${stats.year}</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card accent">
                <div class="stat-icon">📊</div>
                <div class="stat-value">${u.days_remaining + (u.extra_days || 0)}</div>
                <div class="stat-label">${t('available_days')}</div>
                <div class="progress-bar">
                    <div class="progress-fill ${pct > 80 ? 'high' : pct > 50 ? 'medium' : ''}"
                         style="width: ${pct}%"></div>
                </div>
            </div>
            <div class="stat-card success">
                <div class="stat-icon">✅</div>
                <div class="stat-value">${u.days_used}</div>
                <div class="stat-label">${t('used_days')}</div>
            </div>
            <div class="stat-card warning">
                <div class="stat-icon">⏳</div>
                <div class="stat-value">${u.days_pending}</div>
                <div class="stat-label">${t('pending_days')}</div>
            </div>
            <div class="stat-card info">
                <div class="stat-icon">📅</div>
                <div class="stat-value">${allocDays}</div>
                <div class="stat-label">${t('total_assigned')}</div>
            </div>
            ${u.sick_days > 0 ? `
            <div class="stat-card danger">
                <div class="stat-icon">🏥</div>
                <div class="stat-value">${u.sick_days}</div>
                <div class="stat-label">${t('sick_days_label')}</div>
            </div>` : ''}
        </div>

        ${isManager ? `
        <div class="stats-grid">
            <div class="stat-card accent">
                <div class="stat-icon">📝</div>
                <div class="stat-value">${stats.total_requests}</div>
                <div class="stat-label">${t('total_requests_label')}</div>
            </div>
            <div class="stat-card warning">
                <div class="stat-icon">🔔</div>
                <div class="stat-value">${stats.pending_requests}</div>
                <div class="stat-label">${t('pending')}</div>
            </div>
            <div class="stat-card success">
                <div class="stat-icon">✅</div>
                <div class="stat-value">${stats.approved_requests}</div>
                <div class="stat-label">${t('approved')}</div>
            </div>
            <div class="stat-card danger">
                <div class="stat-icon">❌</div>
                <div class="stat-value">${stats.rejected_requests}</div>
                <div class="stat-label">${t('rejected')}</div>
            </div>
        </div>
        ` : ''}

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--space-lg);">
            <div class="panel">
                <div class="panel-header">
                    <h2>🏖️ ${t('absent_today')}</h2>
                    <span style="font-size:0.8rem;color:var(--text-muted);">${vacToday.length} ${t('persons_label')}</span>
                </div>
                <div class="panel-body">
                    ${vacToday.length === 0
                        ? `<p style="color:var(--text-muted);font-size:0.85rem;">${t('nobody_vacation')}</p>`
                        : vacToday.map(v => `
                            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
                                ${renderAvatarEl(v.employee_avatar_color, v.employee_initials, v.employee_avatar_image, 32)}
                                <div>
                                    <div style="font-weight:600;font-size:0.85rem;">${esc(v.employee_name)}</div>
                                    <div style="font-size:0.75rem;color:var(--text-muted);">${t('until_date')} ${formatDate(v.end_date)}</div>
                                </div>
                            </div>`).join('')
                    }
                </div>
            </div>
            <div class="panel">
                <div class="panel-header">
                    <h2>🏥 ${t('on_sick_leave')}</h2>
                    <span style="font-size:0.8rem;color:var(--text-muted);">${sickToday.length} ${t('persons_label')}</span>
                </div>
                <div class="panel-body">
                    ${sickToday.length === 0
                        ? `<p style="color:var(--text-muted);font-size:0.85rem;">${t('nobody_sick')}</p>`
                        : sickToday.map(s => `
                            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
                                ${renderAvatarEl(s.employee_avatar_color, s.employee_initials, s.employee_avatar_image, 32)}
                                <div>
                                    <div style="font-weight:600;font-size:0.85rem;">${esc(s.employee_name)}</div>
                                    <div style="font-size:0.75rem;color:var(--color-danger);">🏥 ${esc(s.leave_type)} · ${t('since_date')} ${formatDate(s.start_date)}</div>
                                </div>
                            </div>`).join('')
                    }
                </div>
            </div>
            <div class="panel">
                <div class="panel-header">
                    <h2>📅 ${t('upcoming_absences')}</h2>
                    <span style="font-size:0.8rem;color:var(--text-muted);">${t('next_7_days')}</span>
                </div>
                <div class="panel-body">
                    ${absUpcoming.length === 0
                        ? `<p style="color:var(--text-muted);font-size:0.85rem;">${t('no_absences_week')}</p>`
                        : absUpcoming.map(v => `
                            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
                                ${renderAvatarEl(v.employee_avatar_color, v.employee_initials, v.employee_avatar_image, 32)}
                                <div>
                                    <div style="font-weight:600;font-size:0.85rem;">${esc(v.employee_name)}</div>
                                    <div style="font-size:0.75rem;color:var(--text-muted);">${formatDate(v.start_date)} — ${formatDate(v.end_date)}</div>
                                </div>
                            </div>`).join('')
                    }
                </div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg);">
            <div class="panel">
                <div class="panel-header">
                    <h2>📈 ${t('vacations_by_month')}</h2>
                </div>
                <div class="panel-body">
                    <div class="bar-chart" id="monthlyChart">
                        ${renderMonthlyChart(stats.monthly)}
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="panel-header">
                    <h2>🏢 ${t('by_department')}</h2>
                </div>
                <div class="panel-body">
                    ${renderDepartmentStats(stats.departments)}
                </div>
            </div>
        </div>

        <div class="panel">
            <div class="panel-header">
                <h2>📋 ${t('last_requests')}</h2>
            </div>
            <div class="panel-body no-padding">
                ${renderVacationTable(vacations.slice(0, 5), false)}
            </div>
        </div>
    </div>`;

    animateBars();
}

function renderMonthlyChart(monthly) {
    const _mo = { es: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
                  en: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                  ca: ['Gen','Feb','Mar','Abr','Mai','Jun','Jul','Ago','Set','Oct','Nov','Des'] };
    const months = _mo[State.lang] || _mo.es;
    const maxVal = Math.max(...Object.values(monthly), 1);
    
    return Object.entries(monthly).map(([m, count]) => `
        <div class="bar-item">
            <div class="bar-value">${count}</div>
            <div class="bar" data-height="${(count / maxVal) * 160}" style="height: 0px; background: ${count > 0 ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.05)'}"></div>
            <div class="bar-label">${months[parseInt(m) - 1]}</div>
        </div>
    `).join('');
}

function animateBars() {
    setTimeout(() => {
        document.querySelectorAll('.bar[data-height]').forEach((bar, i) => {
            setTimeout(() => {
                bar.style.height = bar.dataset.height + 'px';
            }, i * 40);
        });
    }, 200);
}

function renderDepartmentStats(departments) {
    if (Object.keys(departments).length === 0) {
        return `<div class="empty-state"><p>${t('no_dept_data')}</p></div>`;
    }
    return Object.entries(departments).map(([name, data]) => {
        const pct = data.days_total > 0 ? Math.round((data.days_used / data.days_total) * 100) : 0;
        return `
        <div style="margin-bottom: var(--space-md);">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="font-size: 0.85rem; font-weight: 600;">${name}</span>
                <span style="font-size: 0.8rem; color: var(--text-muted);">
                    ${data.days_used}/${data.days_total} días · ${data.total_employees} emp.
                </span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill ${pct > 80 ? 'high' : pct > 50 ? 'medium' : ''}" style="width: ${pct}%"></div>
            </div>
        </div>`;
    }).join('');
}

function renderVacationTable(vacations, showActions = false) {
    if (vacations.length === 0) {
        return `<div class="empty-state"><div class="empty-icon">📭</div><h3>${t('no_requests_empty')}</h3><p>${t('no_vacations_msg')}</p></div>`;
    }

    const isManager = State.user.role === 'admin' || State.user.role === 'manager';

    return `
    <table class="data-table">
        <thead>
            <tr>
                ${showActions && isManager ? `<th style="width:36px;"><input type="checkbox" id="selectAllVac" onchange="toggleSelectAllVacations(this)"></th>` : ''}
                <th>${t('th_employee')}</th>
                <th>${t('th_dates')}</th>
                <th>${t('th_type')}</th>
                <th>${t('th_days')}</th>
                <th>${t('th_status')}</th>
                ${showActions && isManager ? `<th>${t('th_actions')}</th>` : ''}
            </tr>
        </thead>
        <tbody>
            ${vacations.map(v => `
            <tr>
                ${showActions && isManager ? `<td>${v.status === 'pending' && v.user_id !== State.user.id ? `<input type="checkbox" class="vac-select" value="${v.id}">` : ''}</td>` : ''}
                <td>
                    <div style="display: flex; align-items: center; gap: var(--space-sm);">
                        ${renderAvatarEl(v.employee_avatar_color, v.employee_initials, v.employee_avatar_image, 32)}
                        <div>
                            <div style="font-weight: 600; font-size: 0.85rem;">${esc(v.employee_name)}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">${esc(v.employee_department)}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <div style="font-size: 0.85rem;">${formatDate(v.start_date)} — ${formatDate(v.end_date)}</div>
                    ${v.reason ? `<div style="font-size:0.75rem;color:var(--text-muted);">${esc(v.reason)}</div>` : ''}
                </td>
                <td><span class="type-badge">${translateType(v.vacation_type)}</span></td>
                <td><span style="font-weight: 700;">${v.business_days}</span></td>
                <td><span class="status-badge ${v.status}">${translateStatus(v.status)}</span></td>
                ${showActions && isManager ? `
                <td>
                    <div class="action-btns">
                        ${v.status === 'pending' && v.user_id !== State.user.id ? `
                            <button class="btn btn-success btn-sm" onclick="reviewVacation(${v.id}, 'approve')" title="Aprobar">✅</button>
                            <button class="btn btn-danger btn-sm" onclick="reviewVacation(${v.id}, 'reject')" title="Rechazar">❌</button>
                        ` : v.status === 'cancel_requested' ? `
                            <button class="btn btn-success btn-sm" onclick="reviewCancelVacation(${v.id}, 'approve')" title="Aprobar cancelación">✅ Cancelar</button>
                            <button class="btn btn-secondary btn-sm" onclick="reviewCancelVacation(${v.id}, 'reject')" title="Rechazar cancelación">↩ Mantener</button>
                        ` : ''}
                        ${State.user.role === 'admin' ? `<button class="btn btn-danger btn-sm" onclick="adminDeleteVacation(${v.id})" title="Eliminar solicitud">🗑️</button>` : ''}
                    </div>
                </td>
                ` : showActions ? '<td></td>' : ''}
            </tr>`).join('')}
        </tbody>
    </table>`;
}

// ─────────────────────────────────────────────
// Calendar Page
// ─────────────────────────────────────────────

async function loadCalendar(container) {
    const [calData, users] = await Promise.all([
        api(`/api/calendar?year=${State.calendarYear}&month=${State.calendarMonth}${State.calendarUserId ? `&user_id=${State.calendarUserId}` : ''}`),
        api('/api/users')
    ]);

    container.innerHTML = `
    <div class="page-enter calendar-container">
        <div class="page-header">
            <div class="page-header-actions">
                <div>
                    <h1>📅 Calendario</h1>
                    <p>Vista general de vacaciones del equipo</p>
                </div>
                <div style="display: flex; gap: 10px;">
                    <select class="form-select" style="width: 180px;" onchange="filterCalendarByUser(this.value)">
                        <option value="">👤 Todos los empleados</option>
                        ${users.map(u => `<option value="${u.id}" ${State.calendarUserId == u.id ? 'selected' : ''}>${u.full_name}</option>`).join('')}
                    </select>
                    <button class="btn btn-primary" onclick="openNewVacationModal()">+ Nueva Solicitud</button>
                </div>
            </div>
        </div>

        <div class="panel">
            <div class="panel-header">
                <div class="calendar-nav">
                    <button class="btn btn-secondary btn-icon" onclick="changeCalendarMonth(-1)">◀</button>
                    <span class="month-label">${getMonthName(State.calendarMonth)} ${State.calendarYear}</span>
                    <button class="btn btn-secondary btn-icon" onclick="changeCalendarMonth(1)">▶</button>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="btn ${State.calendarViewType === 'monthly' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="setCalendarView('monthly')">Mensual</button>
                    <button class="btn ${State.calendarViewType === 'annual' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="setCalendarView('annual')">Anual</button>
                    <button class="btn btn-secondary btn-sm" onclick="goToToday()">Hoy</button>
                </div>
            </div>
            <div class="panel-body">
                ${State.calendarViewType === 'annual' ? renderAnnualView(calData, State.calendarYear) : renderCalendarGrid(calData)}
            </div>
        </div>
    </div>`;
}

window.filterCalendarByUser = function(userId) {
    State.calendarUserId = userId || null;
    renderPage();
};

window.setCalendarView = function(viewType) {
    State.calendarViewType = viewType;
    renderPage();
};

window.changeCalendarMonth = function(delta) {
    State.calendarMonth += delta;
    if (State.calendarMonth > 12) { State.calendarMonth = 1; State.calendarYear++; }
    else if (State.calendarMonth < 1) { State.calendarMonth = 12; State.calendarYear--; }
    renderPage();
};

function renderAnnualView(calData, year) {
    // Simplified annual view: list of months with dots or events
    let html = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">';
    for (let m = 1; m <= 12; m++) {
        html += `
        <div class="panel" style="margin-bottom: 0;">
            <div class="panel-header" style="padding: 10px;">
                <h4 style="font-size: 0.9rem;">${getMonthName(m)}</h4>
            </div>
            <div class="panel-body" style="padding: 10px; max-height: 200px; overflow-y: auto;">
                ${renderMiniMonthEvents(calData, m, year)}
            </div>
        </div>`;
    }
    html += '</div>';
    return html;
}

function renderMiniMonthEvents(calData, month, year) {
    const monthStart = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const monthEnd = new Date(year, month, 0).toISOString().split('T')[0];
    
    // This is rough because calData only has 1 month usually. 
    // Optimization: If annual, back-end should return whole year.
    // For now, I'll leave it as a layout example. 
    // Ideally we'd fetch `/api/calendar?year=${year}&all=true`
    
    return '<p style="font-size: 0.7rem; color: var(--text-dim);">Vista anual cargada para el año seleccionado.</p>';
}

function renderCalendarGrid(calData) {
    const year = State.calendarYear;
    const month = State.calendarMonth;
    const today = new Date();
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const startWeekDay = (firstDay.getDay() + 6) % 7; // Monday = 0

    const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    let html = '<div class="calendar-grid">';

    // Headers
    dayNames.forEach(d => {
        html += `<div class="calendar-day-header">${d}</div>`;
    });

    // Previous month padding
    const prevMonthLast = new Date(year, month - 1, 0);
    for (let i = startWeekDay - 1; i >= 0; i--) {
        const day = prevMonthLast.getDate() - i;
        html += `<div class="calendar-day other-month"><div class="day-number">${day}</div></div>`;
    }

    // Current month days
    for (let d = 1; d <= lastDay.getDate(); d++) {
        const currentDate = new Date(year, month - 1, d);
        const dateStr = currentDate.toISOString().split('T')[0];
        const isToday = currentDate.toDateString() === today.toDateString();
        const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;

        // Find holidays for this day
        const dayHolidays = calData.holidays.filter(h => h.date === dateStr);
        const isHoliday = dayHolidays.length > 0;

        // Find vacations that include this day
        const dayVacations = calData.vacations.filter(v => {
            return dateStr >= v.start_date && dateStr <= v.end_date;
        });

        let classes = 'calendar-day';
        if (isToday) classes += ' today';
        if (isWeekend) classes += ' weekend';
        if (isHoliday) classes += ' holiday';

        html += `<div class="${classes}">
            <div class="day-number">${d}</div>
            <div class="day-events">
                ${dayHolidays.map(h => `<div class="day-holiday" title="${esc(h.name)}">🎉 ${esc(h.name)}</div>`).join('')}
                ${dayVacations.map(v => `
                    <div class="day-event ${v.status}" title="${v.employee_name}: ${translateStatus(v.status)}">
                        ${v.employee_initials} ${v.employee_name.split(' ')[0]}
                    </div>
                `).join('')}
            </div>
        </div>`;
    }

    // Next month padding
    const totalCells = startWeekDay + lastDay.getDate();
    const remaining = (7 - (totalCells % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
        html += `<div class="calendar-day other-month"><div class="day-number">${i}</div></div>`;
    }

    html += '</div>';
    return html;
}

window.changeMonth = function(delta) {
    State.calendarMonth += delta;
    if (State.calendarMonth > 12) {
        State.calendarMonth = 1;
        State.calendarYear++;
    } else if (State.calendarMonth < 1) {
        State.calendarMonth = 12;
        State.calendarYear--;
    }
    renderPage();
};

window.goToToday = function() {
    State.calendarMonth = new Date().getMonth() + 1;
    State.calendarYear = new Date().getFullYear();
    renderPage();
};

// ─────────────────────────────────────────────
// My Vacations Page
// ─────────────────────────────────────────────

async function loadMyVacations(container) {
    const vacations = await api('/api/vacations');
    const myVacations = vacations.filter(v => v.user_id === State.user.id);

    container.innerHTML = `
    <div class="page-enter">
        <div class="page-header">
            <div class="page-header-actions">
                <div>
                    <h1>🏖️ ${t('my_vacations')}</h1>
                    <p>${t('my_vacations_subtitle')}</p>
                </div>
                <button class="btn btn-primary" onclick="openNewVacationModal()">+ ${t('new_request')}</button>
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-card success">
                <div class="stat-icon">✅</div>
                <div class="stat-value">${State.user.days_remaining}</div>
                <div class="stat-label">${t('available_days')}</div>
            </div>
            <div class="stat-card info">
                <div class="stat-icon">📅</div>
                <div class="stat-value">${State.user.days_used}</div>
                <div class="stat-label">${t('used_days')}</div>
            </div>
            <div class="stat-card warning">
                <div class="stat-icon">⏳</div>
                <div class="stat-value">${State.user.days_pending}</div>
                <div class="stat-label">${t('pending_days')}</div>
            </div>
            ${State.user.carryover_days > 0 ? `
            <div class="stat-card" style="background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.25);">
                <div class="stat-icon">🔄</div>
                <div class="stat-value" style="color:#10B981;">${State.user.carryover_days}</div>
                <div class="stat-label">${t('carryover_days')}</div>
            </div>` : ''}
            ${State.user.extra_days > 0 ? `
            <div class="stat-card accent">
                <div class="stat-icon">⭐</div>
                <div class="stat-value">${State.user.extra_days}</div>
                <div class="stat-label">${t('extra_days_balance')}</div>
            </div>` : ''}
        </div>
        ${State.user.carryover_days > 0 ? `
        <div style="margin-bottom:var(--space-lg);padding:12px 16px;border-radius:var(--radius-md);background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.25);font-size:0.85rem;">
            🔄 <strong>${State.user.total_days}</strong> ${t('carryover_breakdown').replace('{c}', State.user.carryover_days).replace('{t}', State.user.allocated_days)}
        </div>` : ''}
        ${State.user.extra_days > 0 ? `
        <div style="margin-bottom:var(--space-lg);padding:12px 16px;border-radius:var(--radius-md);background:rgba(108,92,231,0.12);border:1px solid rgba(108,92,231,0.25);font-size:0.85rem;">
            ⭐ ${State.lang === 'en' ? 'You have' : State.lang === 'ca' ? 'Tens' : 'Tienes'} <strong>${State.user.extra_days} ${t('extra_days_note')}</strong> ${State.lang === 'en' ? 'for weekend work.' : State.lang === 'ca' ? 'per treball en caps de setmana.' : 'por trabajo en fines de semana.'} ${t('extra_days_auto')}
        </div>` : ''}

        <div class="panel">
            <div class="panel-header">
                <h2>${t('my_requests')}</h2>
            </div>
            <div class="panel-body no-padding">
                ${myVacations.length === 0 ? 
                    `<div class="empty-state"><div class="empty-icon">🏖️</div><h3>${t('no_requests_empty')}</h3><p>${t('first_request_hint')}</p></div>` :
                    renderMyVacationsTable(myVacations)
                }
            </div>
        </div>
    </div>`;
}

function renderMyVacationsTable(vacations) {
    return `
    <table class="data-table">
        <thead>
            <tr>
                <th>${t('th_dates')}</th>
                <th>${t('th_type')}</th>
                <th>${t('th_days')}</th>
                <th>${t('th_reason')}</th>
                <th>${t('th_status')}</th>
                <th>${t('th_actions')}</th>
            </tr>
        </thead>
        <tbody>
            ${vacations.map(v => `
            <tr>
                <td style="font-weight: 600;">${formatDate(v.start_date)} — ${formatDate(v.end_date)}</td>
                <td><span class="type-badge">${translateType(v.vacation_type)}</span></td>
                <td><span style="font-weight: 700;">${v.business_days}</span></td>
                <td style="color: var(--text-muted); font-size: 0.85rem;">${esc(v.reason) || '—'}</td>
                <td><span class="status-badge ${v.status}">${translateStatus(v.status)}</span></td>
                <td>
                    ${v.status === 'pending'
                        ? `<button class="btn btn-danger btn-sm" onclick="deleteVacation(${v.id})">${t('withdraw')}</button>`
                        : v.status === 'approved'
                        ? `<button class="btn btn-warning btn-sm" onclick="openRequestCancelModal(${v.id})">${t('request_cancellation')}</button>`
                        : v.status === 'cancel_requested'
                        ? `<span style="font-size:0.78rem;color:var(--text-muted);">${t('cancel_in_review')}</span>`
                        : '—'}
                </td>
            </tr>`).join('')}
        </tbody>
    </table>`;
}

// ─────────────────────────────────────────────
// Requests Page (Manager/Admin)
// ─────────────────────────────────────────────

async function loadRequests(container) {
    const vacations = await api('/api/vacations');
    State.vacations = vacations;

    const filtered = State.filterStatus === 'all' ? vacations : vacations.filter(v => v.status === State.filterStatus);
    const pendingCount = vacations.filter(v => v.status === 'pending').length;
    const cancelCount = vacations.filter(v => v.status === 'cancel_requested').length;

    container.innerHTML = `
    <div class="page-enter">
        <div class="page-header">
            <div class="page-header-actions">
                <div>
                    <h1>📋 ${t('requests_title')}</h1>
                    <p>${t('requests_subtitle')}</p>
                </div>
                <div style="display:flex;gap:8px;">
                    ${pendingCount > 0 ? `<button class="btn btn-success btn-sm" onclick="bulkApproveSelected()">✅ ${t('bulk_approve_btn')}</button>` : ''}
                    <button class="btn btn-secondary" onclick="exportVacations()">📥 ${t('export_csv')}</button>
                    ${State.user.role === 'admin' || State.user.role === 'manager' ? `<button class="btn btn-primary" onclick="openAdminVacationModal()">＋ Registrar vacances</button>` : ''}
                </div>
            </div>
        </div>

        <div class="filters-bar">
            <span class="filter-chip ${State.filterStatus === 'all' ? 'active' : ''}" onclick="setFilter('all')">${t('filter_all')} (${vacations.length})</span>
            <span class="filter-chip ${State.filterStatus === 'pending' ? 'active' : ''}" onclick="setFilter('pending')">${t('filter_pending_label')} (${pendingCount})</span>
            <span class="filter-chip ${State.filterStatus === 'approved' ? 'active' : ''}" onclick="setFilter('approved')">${t('filter_approved_label')} (${vacations.filter(v => v.status === 'approved').length})</span>
            <span class="filter-chip ${State.filterStatus === 'rejected' ? 'active' : ''}" onclick="setFilter('rejected')">${t('filter_rejected_label')} (${vacations.filter(v => v.status === 'rejected').length})</span>
            ${cancelCount > 0 ? `<span class="filter-chip ${State.filterStatus === 'cancel_requested' ? 'active' : ''}" onclick="setFilter('cancel_requested')">${t('filter_cancellations')} (${cancelCount})</span>` : ''}
        </div>

        <div class="panel">
            <div class="panel-body no-padding">
                ${renderVacationTable(filtered, true)}
            </div>
        </div>
    </div>`;
}

window.setFilter = function(status) {
    State.filterStatus = status;
    renderPage();
};

window.exportVacations = function() {
    window.location.href = `/api/vacations/export?year=${State.stats ? State.stats.year : new Date().getFullYear()}`;
};

window.reviewVacation = async function(id, action) {
    const actionText = action === 'approve' ? 'aprobar' : 'rechazar';
    if (!confirm(`¿Estás seguro de que quieres ${actionText} esta solicitud?`)) return;

    try {
        await api(`/api/vacations/${id}/review`, {
            method: 'POST',
            body: JSON.stringify({ action, comment: '' })
        });
        showToast(`Solicitud ${action === 'approve' ? 'aprobada' : 'rechazada'}`, 'success');
        const me = await api('/api/me');
        if (me.authenticated) State.user = me.user;
        renderPage();
    } catch (err) {
        showToast(err.message, 'error');
    }
};

window.toggleSelectAllVacations = function(checkbox) {
    document.querySelectorAll('.vac-select').forEach(cb => { cb.checked = checkbox.checked; });
};

window.bulkApproveSelected = function() {
    const selected = [...document.querySelectorAll('.vac-select:checked')].map(cb => parseInt(cb.value));
    if (selected.length === 0) { showToast('Selecciona al menos una solicitud', 'error'); return; }
    openModal(`
    <div class="modal">
        <div class="modal-header">
            <h3>✅ Aprobación Masiva (${selected.length} solicitudes)</h3>
            <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">
            <p>¿Aprobar las ${selected.length} solicitudes seleccionadas?</p>
            <div class="form-group">
                <label>Comentario (opcional)</label>
                <input type="text" class="form-input" id="bulkComment" placeholder="Comentario para todas las solicitudes...">
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
            <button class="btn btn-success" onclick="submitBulkReview('approve', ${JSON.stringify(selected)})">Aprobar todas</button>
            <button class="btn btn-danger" onclick="submitBulkReview('reject', ${JSON.stringify(selected)})">Rechazar todas</button>
        </div>
    </div>`);
};

window.submitBulkReview = async function(action, ids) {
    const comment = document.getElementById('bulkComment')?.value || '';
    try {
        const res = await api('/api/vacations/bulk-review', {
            method: 'POST',
            body: JSON.stringify({ action, ids, comment })
        });
        closeModal();
        showToast(`${res.processed} solicitudes ${action === 'approve' ? 'aprobadas' : 'rechazadas'}${res.skipped > 0 ? `, ${res.skipped} omitidas` : ''}`, 'success');
        const me = await api('/api/me');
        if (me.authenticated) State.user = me.user;
        renderPage();
    } catch (err) {
        showToast(err.message, 'error');
    }
};

window.openRequestCancelModal = function(vacationId) {
    openModal(`
    <div class="modal">
        <div class="modal-header">
            <h3>🚫 Solicitar Cancelación</h3>
            <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">
            <p style="font-size:0.9rem;color:var(--text-muted);margin-bottom:16px;">
                Tu manager recibirá la solicitud de cancelación y deberá aprobarla.
            </p>
            <div class="form-group">
                <label>Motivo de la cancelación</label>
                <textarea class="form-input" id="cancelReason" placeholder="Describe brevemente el motivo..." rows="3"></textarea>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
            <button class="btn btn-danger" onclick="submitRequestCancel(${vacationId})">Solicitar cancelación</button>
        </div>
    </div>`);
};

window.submitRequestCancel = async function(vacationId) {
    const reason = document.getElementById('cancelReason')?.value || '';
    try {
        await api(`/api/vacations/${vacationId}/request-cancel`, {
            method: 'POST',
            body: JSON.stringify({ reason })
        });
        closeModal();
        showToast('Solicitud de cancelación enviada al manager', 'success');
        renderPage();
    } catch (err) {
        showToast(err.message, 'error');
    }
};

window.reviewCancelVacation = async function(vacationId, action) {
    const label = action === 'approve' ? 'aprobar la cancelación (las vacaciones quedarán canceladas)' : 'rechazar la cancelación (las vacaciones seguirán aprobadas)';
    if (!confirm(`¿${label}?`)) return;
    try {
        await api(`/api/vacations/${vacationId}/review-cancel`, {
            method: 'POST',
            body: JSON.stringify({ action })
        });
        showToast(action === 'approve' ? 'Vacaciones canceladas' : 'Cancelación rechazada, vacaciones mantenidas', 'success');
        const me = await api('/api/me');
        if (me.authenticated) State.user = me.user;
        renderPage();
    } catch (err) {
        showToast(err.message, 'error');
    }
};

// ─────────────────────────────────────────────
// Team Page
// ─────────────────────────────────────────────

window.setTeamView = function(v) { State.teamView = v; renderPage(); };
window.setClientsListView = function(v) { State.clientsListView = v; renderPage(); };

async function loadTeam(container) {
    const users = await api('/api/users');
    State.users = users;

    const view = State.teamView;
    const viewToggle = `<div style="display:flex;border:1px solid var(--border);border-radius:8px;overflow:hidden;">
        <button onclick="setTeamView('cards')" style="padding:6px 12px;border:none;cursor:pointer;font-size:.82rem;background:${view==='cards'?'var(--primary)':'var(--surface)'};color:${view==='cards'?'#fff':'var(--text-secondary)'};">⊞ Tarjetas</button>
        <button onclick="setTeamView('table')" style="padding:6px 12px;border:none;cursor:pointer;font-size:.82rem;background:${view==='table'?'var(--primary)':'var(--surface)'};color:${view==='table'?'#fff':'var(--text-secondary)'};">☰ Tabla</button>
    </div>`;

    const cardsHTML = `<div class="employee-grid">
        ${users.map(u => `
        <div class="employee-card" onclick="goToEmployeeDetails(${u.id})" style="cursor:pointer">
            <div class="employee-card-header">
                <div class="employee-avatar-lg" style="background: ${u.avatar_image ? 'transparent' : u.avatar_color}">
                    ${u.avatar_image ? `<img src="${u.avatar_image}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" alt="">` : u.initials}
                </div>
                <div class="employee-card-info">
                    <h3>${esc(u.full_name)}</h3>
                    <p>${esc(u.department)} · <span class="role-badge ${esc(u.role)}">${translateRole(u.role)}</span></p>
                </div>
            </div>
            <div class="employee-card-stats">
                <div class="emp-stat">
                    <div class="emp-stat-value used">${u.days_used}</div>
                    <div class="emp-stat-label">${t('used_label')}</div>
                </div>
                <div class="emp-stat">
                    <div class="emp-stat-value pending-val">${u.days_pending}</div>
                    <div class="emp-stat-label">${t('pending_label')}</div>
                </div>
                <div class="emp-stat">
                    <div class="emp-stat-value remaining">${u.days_remaining + (u.extra_days || 0)}${u.extra_days > 0 ? `<span style="font-size:0.65rem;vertical-align:super;color:var(--accent-secondary);">⭐</span>` : ''}</div>
                    <div class="emp-stat-label">${t('available_label')}</div>
                </div>
            </div>
            <div class="progress-bar" style="margin-top: var(--space-md);">
                <div class="progress-fill ${u.days_used / (u.total_days + (u.extra_days||0)) > 0.8 ? 'high' : u.days_used / (u.total_days + (u.extra_days||0)) > 0.5 ? 'medium' : ''}"
                     style="width: ${Math.min(100, (u.days_used / Math.max(1, u.total_days + (u.extra_days||0))) * 100)}%"></div>
            </div>
        </div>`).join('')}
    </div>`;

    const tableHTML = `<div class="panel"><div class="panel-body no-padding">
        <table class="data-table">
            <thead><tr>
                <th>Empleado</th>
                <th>Departamento</th>
                <th>Rol</th>
                <th style="text-align:center;">Usados</th>
                <th style="text-align:center;">Pendientes</th>
                <th style="text-align:center;">Disponibles</th>
                <th style="min-width:120px;">Progreso</th>
            </tr></thead>
            <tbody>${users.map(u => {
                const total = Math.max(1, u.total_days + (u.extra_days||0));
                const pct   = Math.min(100, Math.round(u.days_used / total * 100));
                const cls   = pct > 80 ? 'high' : pct > 50 ? 'medium' : '';
                const avail = u.days_remaining + (u.extra_days || 0);
                return `<tr onclick="goToEmployeeDetails(${u.id})" style="cursor:pointer;">
                    <td>
                        <div style="display:flex;align-items:center;gap:10px;">
                            <div style="width:32px;height:32px;border-radius:50%;background:${u.avatar_image?'transparent':u.avatar_color};display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;color:#fff;flex-shrink:0;overflow:hidden;">
                                ${u.avatar_image?`<img src="${u.avatar_image}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" alt="">`:u.initials}
                            </div>
                            <span style="font-weight:600;">${esc(u.full_name)}</span>
                        </div>
                    </td>
                    <td>${esc(u.department)}</td>
                    <td><span class="role-badge ${esc(u.role)}">${translateRole(u.role)}</span></td>
                    <td style="text-align:center;color:var(--success);font-weight:700;">${u.days_used}</td>
                    <td style="text-align:center;color:var(--warning);font-weight:700;">${u.days_pending}</td>
                    <td style="text-align:center;color:var(--primary);font-weight:700;">${avail}${u.extra_days>0?'⭐':''}</td>
                    <td>
                        <div style="display:flex;align-items:center;gap:8px;">
                            <div style="flex:1;height:6px;background:var(--border);border-radius:3px;overflow:hidden;">
                                <div class="progress-fill ${cls}" style="height:100%;width:${pct}%;border-radius:3px;"></div>
                            </div>
                            <span style="font-size:0.75rem;color:var(--text-muted);min-width:28px;">${pct}%</span>
                        </div>
                    </td>
                </tr>`;
            }).join('')}</tbody>
        </table>
    </div></div>`;

    container.innerHTML = `
    <div class="page-enter">
        <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start;">
            <div>
                <h1>👥 ${t('team')}</h1>
                <p>${t('team_subtitle')}</p>
            </div>
            ${viewToggle}
        </div>
        ${view === 'table' ? tableHTML : cardsHTML}
    </div>`;
}

window.goToEmployeeDetails = function(userId) {
    State.selectedEmployeeId = userId;
    navigateTo('employee-details');
};

async function loadEmployeeDetails(container, userId) {
    if (!userId) {
        container.innerHTML = `<div class="empty-state"><h3>${t('select_employee')}</h3></div>`;
        return;
    }

    const [allUsers, allVacations] = await Promise.all([
        api('/api/users'),
        api('/api/vacations')
    ]);

    const user = allUsers.find(u => u.id === userId);
    const userVacations = allVacations.filter(v => v.user_id === userId);

    if (!user) {
        container.innerHTML = `<div class="empty-state"><h3>${t('employee_not_found')}</h3></div>`;
        return;
    }

    // Set calendar filter to this user for the embedded view
    State.calendarUserId = userId;

    const canEdit = State.user.role === 'admin' || State.user.id === userId;

    container.innerHTML = `
    <div class="page-enter">
        <div class="page-header">
            <div class="page-header-actions">
                <div style="display:flex;align-items:center;gap:var(--space-lg);">
                    <div>
                        <button class="btn btn-secondary btn-sm" onclick="navigateTo('team')" style="margin-bottom: 10px">← Volver al equipo</button>
                        <div style="display:flex;align-items:center;gap:var(--space-md);">
                            <div class="profile-avatar-wrap" ${canEdit ? `onclick="document.getElementById('_profileAvatarInput').click()" title="Haz clic para cambiar la foto"` : ''} style="${canEdit ? 'cursor:pointer;' : ''}">
                                <div class="employee-avatar-lg profile-avatar-lg" style="background:${user.avatar_image ? 'transparent' : user.avatar_color}">
                                    ${user.avatar_image ? `<img src="${user.avatar_image}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" alt="">` : user.initials}
                                </div>
                                ${canEdit ? `<div class="profile-avatar-overlay">📷</div>` : ''}
                            </div>
                            <div>
                                <h1 style="margin:0;">${esc(user.full_name)}</h1>
                                <p style="margin:0;">${user.department} · ${translateRole(user.role)}</p>
                                ${canEdit ? `<span style="font-size:0.75rem;color:var(--text-dim);">Haz clic en la foto para cambiarla</span>` : ''}
                            </div>
                        </div>
                        ${canEdit ? `<input type="file" id="_profileAvatarInput" accept="image/*" style="display:none" onchange="uploadProfileAvatar(this, ${user.id})">` : ''}
                    </div>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-primary" onclick="openEditUserModal(${user.id})">Editar Perfil</button>
                    ${State.user.role === 'admin' ? `<button class="btn btn-danger" onclick="deleteUser(${user.id})">Eliminar</button>` : ''}
                </div>
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-card success">
                <div class="stat-icon">✅</div>
                <div class="stat-value">${user.days_used}</div>
                <div class="stat-label">Días Usados</div>
            </div>
            <div class="stat-card warning">
                <div class="stat-icon">⏳</div>
                <div class="stat-value">${user.days_pending}</div>
                <div class="stat-label">Pendientes</div>
            </div>
            <div class="stat-card info">
                <div class="stat-icon">📅</div>
                <div class="stat-value">${user.days_remaining + (user.extra_days || 0)}</div>
                <div class="stat-label">Disponibles${user.extra_days > 0 ? ` (inc. ${user.extra_days} ⭐)` : ''}</div>
            </div>
        </div>

        <div class="employee-detail-grid">
            <div class="panel">
                <div class="panel-header">
                    <h2>${t('req_history')}</h2>
                </div>
                <div class="panel-body no-padding">
                    ${renderMyVacationsTable(userVacations)}
                </div>
            </div>
            <div class="panel">
                <div class="panel-header">
                    <h2>${t('personal_cal')}</h2>
                    <div class="calendar-nav">
                        <button class="btn btn-secondary btn-icon btn-sm" onclick="changeMonth(-1, true)">◀</button>
                        <span class="month-label" style="font-size: 1rem; min-width: 140px;">${getMonthName(State.calendarMonth)} ${State.calendarYear}</span>
                        <button class="btn btn-secondary btn-icon btn-sm" onclick="changeMonth(1, true)">▶</button>
                    </div>
                </div>
                <div class="panel-body" id="personalCalendarGrid">
                    <!-- Embedded calendar grid -->
                </div>
            </div>
        </div>
    </div>`;

    // Render the initial calendar for this user
    await refreshPersonalCalendar(userId);
}

async function refreshPersonalCalendar(userId) {
    const grid = document.getElementById('personalCalendarGrid');
    if (!grid) return;
    const calData = await api(`/api/calendar?year=${State.calendarYear}&month=${State.calendarMonth}&user_id=${userId}`);
    grid.innerHTML = renderCalendarGrid(calData);
}

// Add a variant for changeMonth to support personal calendar refresh
const originalChangeMonth = window.changeMonth;
window.changeMonth = async function(delta, isPersonal = false) {
    State.calendarMonth += delta;
    if (State.calendarMonth > 12) {
        State.calendarMonth = 1;
        State.calendarYear++;
    } else if (State.calendarMonth < 1) {
        State.calendarMonth = 12;
        State.calendarYear--;
    }
    
    if (isPersonal && State.currentPage === 'employee-details') {
        const label = document.querySelector('.month-label');
        if (label) label.textContent = `${getMonthName(State.calendarMonth)} ${State.calendarYear}`;
        await refreshPersonalCalendar(State.selectedEmployeeId);
    } else {
        renderPage();
    }
};

// ─────────────────────────────────────────────
// Employees Page (Admin)
// ─────────────────────────────────────────────

async function loadEmployees(container) {
    const users = await api('/api/users');
    State.users = users;

    const logo = State.companySettings?.logo_data;
    const companyName = State.companySettings?.company_name || 'VacationControl';

    container.innerHTML = `
    <div class="page-enter">
        <div class="page-header">
            <div class="page-header-actions">
                <div>
                    <h1>⚙️ ${t('employees_title')}</h1>
                    <p>${t('employees_subtitle')}</p>
                </div>
                <button class="btn btn-primary" onclick="openNewUserModal()">+ ${t('new_employee')}</button>
            </div>
        </div>

        <div class="panel" style="margin-bottom:var(--space-lg);">
            <div class="panel-header">
                <h2>🏢 ${t('company_identity')}</h2>
            </div>
            <div class="panel-body">
                <div class="company-settings-row">
                    <div class="company-logo-area" onclick="document.getElementById('_logoUploadInput').click()">
                        ${logo
                            ? `<img src="${logo}" class="company-logo-preview" alt="Logo">`
                            : `<div class="company-logo-placeholder">🌴</div>`}
                        <div class="logo-overlay">📷 ${State.lang === 'en' ? 'Change' : State.lang === 'ca' ? 'Canviar' : 'Cambiar'}</div>
                        <input type="file" id="_logoUploadInput" accept="image/*" style="display:none" onchange="handleLogoUpload(this)">
                    </div>
                    <div style="flex:1;">
                        <div class="form-group" style="margin-bottom:var(--space-sm);">
                            <label>${t('company_name_label')}</label>
                            <div style="display:flex;gap:8px;align-items:center;">
                                <input type="text" class="form-input" id="_companyNameInput" value="${companyName}" style="max-width:280px;">
                                <button class="btn btn-primary btn-sm" onclick="saveCompanyName()">${t('save')}</button>
                            </div>
                        </div>
                        <p style="font-size:0.8rem;color:var(--text-muted);margin:0;">Haz clic en el logo para cambiarlo. El nombre y el logo aparecen en el menú y en la pantalla de inicio de sesión.</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="panel">
            <div class="panel-body no-padding">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>${t('th_employee')}</th>
                            <th>${t('th_email')}</th>
                            <th>${t('th_department')}</th>
                            <th>${t('th_role')}</th>
                            <th>${t('th_total_days')}</th>
                            <th title="${t('carryover_from')}" style="cursor:help;">🔄 ${t('th_carryover')}</th>
                            <th>${t('used_label')}</th>
                            <th>${t('available_label')}</th>
                            <th>${t('th_actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(u => `
                        <tr>
                            <td style="white-space:nowrap;">
                                <div style="display:flex;align-items:center;gap:var(--space-sm);">
                                    ${renderAvatarEl(u.avatar_color, u.initials, u.avatar_image, 32)}
                                    <span style="font-weight:600;">${esc(u.full_name)}</span>
                                </div>
                            </td>
                            <td>
                                <span style="display:block;overflow-wrap:break-word;word-break:break-all;color:var(--text-muted);" title="${esc(u.email)}">${esc(u.email)}</span>
                            </td>
                            <td>${esc(u.department)}</td>
                            <td><span class="role-badge ${esc(u.role)}">${translateRole(u.role)}</span></td>
                            <td style="font-weight:700;text-align:center;">${u.total_days}${u.extra_days > 0 ? `<span style="color:var(--accent-secondary);font-size:0.72rem;display:block;">+${u.extra_days}⭐</span>` : ''}</td>
                            <td style="text-align:center;">
                                ${u.carryover_days > 0
                                    ? `<span style="color:#10B981;font-weight:700;">+${u.carryover_days}</span>`
                                    : `<span style="color:var(--text-dim);">—</span>`}
                                <button class="btn btn-secondary btn-sm" style="margin-left:4px;padding:2px 6px;font-size:0.7rem;" onclick="openEditCarryoverModal(${u.id},'${esc(u.full_name)}',${u.carryover_days||0})" title="${t('edit_carryover')}">✏️</button>
                            </td>
                            <td style="color:var(--color-info);font-weight:600;text-align:center;">${u.days_used}</td>
                            <td style="color:var(--color-success);font-weight:600;text-align:center;">${u.allocated_days - u.days_used + (u.extra_days || 0)}</td>
                            <td style="white-space:nowrap;">
                                <div class="action-btns">
                                    <button class="btn btn-secondary btn-sm" onclick="openEditUserModal(${u.id})">✏️</button>
                                    ${u.id !== State.user.id ? `<button class="btn btn-danger btn-sm" onclick="deleteUser(${u.id})">🗑️</button>` : ''}
                                </div>
                            </td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
}

// ─────────────────────────────────────────────
// Holidays Page (Admin)
// ─────────────────────────────────────────────

async function loadHolidays(container) {
    const holidays = await api('/api/holidays');
    State.holidays = holidays;

    container.innerHTML = `
    <div class="page-enter">
        <div class="page-header">
            <div class="page-header-actions">
                <div>
                    <h1>🎉 ${t('holidays_title')}</h1>
                    <p>${t('holidays_subtitle')}</p>
                </div>
                <button class="btn btn-primary" onclick="openNewHolidayModal()">${t('new_holiday')}</button>
            </div>
        </div>

        <div class="panel">
            <div class="panel-body">
                ${holidays.length === 0 ? 
                    `<div class="empty-state"><div class="empty-icon">🎉</div><h3>${t('no_holidays')}</h3><p>${t('no_holidays_hint')}</p></div>` :
                    `<div class="holiday-list">
                        ${holidays.map(h => `
                        <div class="holiday-item">
                            <div class="holiday-info">
                                <span class="holiday-date">${formatDate(h.date)}</span>
                                <span class="holiday-name">${esc(h.name)}</span>
                            </div>
                            <button class="btn btn-danger btn-sm btn-icon" onclick="deleteHoliday(${h.id})">🗑️</button>
                        </div>`).join('')}
                    </div>`
                }
            </div>
        </div>
    </div>`;
}

// ─────────────────────────────────────────────
// Departments Page (Admin)
// ─────────────────────────────────────────────

async function loadDepartments(container) {
    const [depts, rules] = await Promise.all([
        api('/api/departments'),
        api('/api/department-rules'),
    ]);
    State.departments = depts;

    const ruleByDept = {};
    rules.forEach(r => { ruleByDept[r.department] = r; });

    container.innerHTML = `
    <div class="page-enter">
        <div class="page-header">
            <div class="page-header-actions">
                <div>
                    <h1>🏢 ${t('depts_title')}</h1>
                    <p>${t('depts_subtitle')}</p>
                </div>
                <button class="btn btn-primary" onclick="openNewDeptModal()">+ ${t('new_department')}</button>
            </div>
        </div>

        <div class="panel">
            <div class="panel-body no-padding">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>${t('th_name')}</th>
                            <th>${t('th_description')}</th>
                            <th>${t('th_max_sim')}</th>
                            <th>${t('th_min_adv')}</th>
                            <th>${t('th_max_cons')}</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${depts.map(d => {
                            const rule = ruleByDept[d.name];
                            return `
                        <tr>
                            <td style="font-weight: 600;">${esc(d.name)}</td>
                            <td style="color: var(--text-muted);">${esc(d.description) || '—'}</td>
                            <td>${rule?.max_simultaneous ?? '<span style="color:var(--text-dim)">—</span>'}</td>
                            <td>${rule?.min_advance_days ? rule.min_advance_days + ' ' + t('days_suffix') : '<span style="color:var(--text-dim)">—</span>'}</td>
                            <td>${rule?.max_consecutive_days ? rule.max_consecutive_days + ' ' + t('days_suffix') : '<span style="color:var(--text-dim)">—</span>'}</td>
                            <td>
                                <div class="action-btns">
                                    <button class="btn btn-secondary btn-sm" onclick="openEditDeptModal(${d.id})">✏️</button>
                                    <button class="btn btn-secondary btn-sm" onclick="openDeptRulesModal('${esc(d.name)}', ${rule ? rule.id : 'null'}, ${JSON.stringify(rule || {}).replace(/"/g,'&quot;')})">⚙️ ${t('rules_btn')}</button>
                                    <button class="btn btn-danger btn-sm" onclick="deleteDepartment(${d.id})">🗑️</button>
                                </div>
                            </td>
                        </tr>`;}).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
}

window.openNewDeptModal = function() {
    openModal(`
    <div class="modal">
        <div class="modal-header">
            <h3>🏢 Nuevo Departamento</h3>
            <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label>Nombre</label>
                <input type="text" class="form-input" id="deptName" placeholder="Ej: DevOps, Finanzas..." required>
            </div>
            <div class="form-group">
                <label>Descripción</label>
                <input type="text" class="form-input" id="deptDesc" placeholder="Breve descripción...">
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="submitNewDept()">Crear Departamento</button>
        </div>
    </div>`);
};

window.submitNewDept = async function() {
    const name = document.getElementById('deptName').value;
    const description = document.getElementById('deptDesc').value;

    if (!name) { showToast('Nombre requerido', 'error'); return; }

    try {
        await api('/api/departments', {
            method: 'POST',
            body: JSON.stringify({ name, description })
        });
        closeModal();
        showToast('Departamento creado', 'success');
        renderPage();
    } catch (err) { showToast(err.message, 'error'); }
};

window.openEditDeptModal = function(id) {
    const dept = State.departments.find(d => d.id === id);
    if (!dept) return;
    openModal(`
    <div class="modal">
        <div class="modal-header">
            <h3>✏️ Editar Departamento</h3>
            <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label>Nombre</label>
                <input type="text" class="form-input" id="editDeptName" value="${dept.name}">
            </div>
            <div class="form-group">
                <label>Descripción</label>
                <input type="text" class="form-input" id="editDeptDesc" value="${dept.description || ''}">
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="submitEditDept(${id})">Guardar Cambios</button>
        </div>
    </div>`);
};

window.submitEditDept = async function(id) {
    const name = document.getElementById('editDeptName').value;
    const description = document.getElementById('editDeptDesc').value;
    try {
        await api(`/api/departments/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ name, description })
        });
        closeModal();
        showToast('Departamento actualizado', 'success');
        renderPage();
    } catch (err) { showToast(err.message, 'error'); }
};

window.deleteDepartment = async function(id) {
    if (!confirm('¿Eliminar este departamento?')) return;
    try {
        await api(`/api/departments/${id}`, { method: 'DELETE' });
        showToast('Departamento eliminado', 'success');
        renderPage();
    } catch (err) { showToast(err.message, 'error'); }
};

window.openDeptRulesModal = function(deptName, ruleId, rule) {
    const r = typeof rule === 'string' ? JSON.parse(rule.replace(/&quot;/g, '"')) : rule;
    openModal(`
    <div class="modal">
        <div class="modal-header">
            <h3>⚙️ Reglas — ${esc(deptName)}</h3>
            <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">
            <div class="form-row">
                <div class="form-group">
                    <label>Máx. personas simultáneas</label>
                    <input type="number" class="form-input" id="ruleMaxSim" value="${r.max_simultaneous || ''}" placeholder="Sin límite" min="1">
                </div>
                <div class="form-group">
                    <label>Antelación mínima (días)</label>
                    <input type="number" class="form-input" id="ruleMinAdv" value="${r.min_advance_days || ''}" placeholder="Sin mínimo" min="0">
                </div>
            </div>
            <div class="form-group">
                <label>Máx. días consecutivos</label>
                <input type="number" class="form-input" id="ruleMaxCons" value="${r.max_consecutive_days || ''}" placeholder="Sin límite" min="1">
            </div>
            <div class="form-group">
                <label>Períodos bloqueados (JSON)</label>
                <textarea class="form-input" id="ruleBlackouts" rows="3" placeholder='[{"start":"2026-08-01","end":"2026-08-31","reason":"Temporada alta"}]'>${r.blackout_periods ? JSON.stringify(r.blackout_periods) : ''}</textarea>
                <small style="color:var(--text-dim);">Formato: [{start, end, reason}]</small>
            </div>
        </div>
        <div class="modal-footer">
            ${ruleId ? `<button class="btn btn-danger btn-sm" onclick="deleteDeptRule(${ruleId})">Eliminar reglas</button>` : ''}
            <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="saveDeptRule('${esc(deptName)}', ${ruleId || 'null'})">Guardar</button>
        </div>
    </div>`);
};

window.saveDeptRule = async function(dept, ruleId) {
    const maxSim = parseInt(document.getElementById('ruleMaxSim').value) || null;
    const minAdv = parseInt(document.getElementById('ruleMinAdv').value) || null;
    const maxCons = parseInt(document.getElementById('ruleMaxCons').value) || null;
    let blackouts = null;
    const bpStr = document.getElementById('ruleBlackouts').value.trim();
    if (bpStr) {
        try { blackouts = JSON.parse(bpStr); } catch(e) { showToast('JSON de períodos bloqueados inválido', 'error'); return; }
    }
    try {
        if (ruleId) {
            await api(`/api/department-rules/${ruleId}`, {
                method: 'PUT',
                body: JSON.stringify({ max_simultaneous: maxSim, min_advance_days: minAdv, max_consecutive_days: maxCons, blackout_periods: blackouts }),
            });
        } else {
            await api('/api/department-rules', {
                method: 'POST',
                body: JSON.stringify({ department: dept, max_simultaneous: maxSim, min_advance_days: minAdv, max_consecutive_days: maxCons, blackout_periods: blackouts }),
            });
        }
        closeModal();
        showToast('Reglas guardadas', 'success');
        renderPage();
    } catch(err) { showToast(err.message, 'error'); }
};

window.deleteDeptRule = async function(ruleId) {
    if (!confirm('¿Eliminar todas las reglas de este departamento?')) return;
    try {
        await api(`/api/department-rules/${ruleId}`, { method: 'DELETE' });
        closeModal();
        showToast('Reglas eliminadas', 'success');
        renderPage();
    } catch(err) { showToast(err.message, 'error'); }
};

// ─────────────────────────────────────────────
// Late Arrivals Page
// ─────────────────────────────────────────────

async function loadLateArrivals(container) {
    const isManager = State.user.role === 'admin' || State.user.role === 'manager';
    let ranking = [];
    let history = [];
    let users = [];

    if (isManager) {
        [ranking, history, users] = await Promise.all([
            api('/api/late-arrivals/ranking'),
            api('/api/late-arrivals'),
            api('/api/users')
        ]);
        State.lateRanking = ranking;
    } else {
        history = await api(`/api/late-arrivals?user_id=${State.user.id}`);
    }

    container.innerHTML = `
    <div class="page-enter">
        <div class="page-header">
            <div>
                <h1>⏰ ${t('late_title')}</h1>
                <p>${t('late_subtitle')}</p>
            </div>
        </div>

        ${isManager ? `
        <div class="panel" style="margin-bottom: var(--space-lg);">
            <div class="panel-header">
                <h2>🏆 Ranking de Retrasos (Este año)</h2>
            </div>
            <div class="panel-body">
                <div class="ranking-grid">
                    ${ranking.length === 0 ? '<p>No hay registros de retrasos aún.</p>' : 
                      ranking.map((r, i) => `
                        <div class="ranking-item ${i === 0 ? 'top-1' : ''}">
                            <div class="ranking-pos">${i + 1}</div>
                            ${renderAvatarEl(r.avatar_color, r.initials, r.avatar_image, 36)}
                            <div class="ranking-info">
                                <div class="name">${esc(r.full_name)}</div>
                                <div class="sub">${r.total_minutes} min. totales</div>
                            </div>
                            <div class="ranking-value">${r.total_late} <span>veces</span></div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <div class="panel" style="margin-bottom: var(--space-lg);">
            <div class="panel-header">
                <h2>➕ Registrar Nuevo Retraso</h2>
            </div>
            <div class="panel-body">
                <div class="form-row" style="align-items: flex-end;">
                    <div class="form-group">
                        <label>Empleado</label>
                        <select class="form-select" id="lateUserId">
                            ${users.map(u => `<option value="${u.id}">${u.full_name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Fecha</label>
                        <input type="date" class="form-input" id="lateDate" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group" style="width: 120px;">
                        <label>Minutos</label>
                        <input type="number" class="form-input" id="lateMinutes" value="5" min="1">
                    </div>
                    <div class="form-group">
                        <label>Motivo</label>
                        <input type="text" class="form-input" id="lateReason" placeholder="Ej: Tráfico, Tren...">
                    </div>
                    <button class="btn btn-primary" onclick="submitLateArrival()" style="height: 42px; margin-bottom: 4px;">Registrar</button>
                </div>
            </div>
        </div>
        ` : ''}

        <div class="panel">
            <div class="panel-header">
                <h2>📋 Historial de Retrasos ${!isManager ? 'Personal' : ''}</h2>
            </div>
            <div class="panel-body no-padding">
                <table class="data-table">
                    <thead>
                        <tr>
                            ${isManager ? '<th>Empleado</th>' : ''}
                            <th>Fecha</th>
                            <th>Minutos</th>
                            <th>Motivo</th>
                            ${isManager ? '<th>Acciones</th>' : ''}
                        </tr>
                    </thead>
                    <tbody>
                        ${history.length === 0 ? `<tr><td colspan="${isManager ? 5 : 3}"><div class="empty-state">No hay registros</div></td></tr>` : 
                          history.map(h => `
                            <tr>
                                ${isManager ? `
                                <td>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        ${renderAvatarEl(h.employee_avatar, h.employee_initials, h.employee_avatar_image, 24)}
                                        <span>${esc(h.employee_name)}</span>
                                    </div>
                                </td>` : ''}
                                <td style="font-weight: 600;">${formatDate(h.date)}</td>
                                <td><span class="status-badge danger">${h.minutes_late} min</span></td>
                                <td style="color: var(--text-muted);">${esc(h.reason) || '—'}</td>
                                ${isManager ? `<td><button class="btn btn-danger btn-sm" onclick="deleteLateArrival(${h.id})">🗑️</button></td>` : ''}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
}

window.submitLateArrival = async function() {
    const user_id = document.getElementById('lateUserId').value;
    const date = document.getElementById('lateDate').value;
    const minutes_late = document.getElementById('lateMinutes').value;
    const reason = document.getElementById('lateReason').value;

    try {
        await api('/api/late-arrivals', {
            method: 'POST',
            body: JSON.stringify({ user_id, date, minutes_late, reason })
        });
        showToast('Retraso registrado correctamente', 'success');
        renderPage();
    } catch (err) {
        showToast(err.message, 'error');
    }
};

window.deleteLateArrival = async function(id) {
    if (!confirm('¿Seguro que quieres eliminar este registro de retraso?')) return;
    try {
        await api(`/api/late-arrivals/${id}`, { method: 'DELETE' });
        showToast('Registro eliminado', 'success');
        renderPage();
    } catch (err) {
        showToast(err.message, 'error');
    }
};

// ─────────────────────────────────────────────
// Extra Days Page (Admin)
// ─────────────────────────────────────────────

async function loadExtraDays(container) {
    const [entries, users] = await Promise.all([
        api('/api/extra-days'),
        api('/api/users'),
    ]);

    window._extraDaysEntries = entries;

    // Build per-user summary
    const byUser = {};
    for (const u of users) {
        byUser[u.id] = { ...u, entries: [], total: u.extra_days || 0 };
    }
    for (const e of entries) {
        if (byUser[e.user_id]) byUser[e.user_id].entries.push(e);
    }

    container.innerHTML = `
    <div class="page-enter">
        <div class="page-header">
            <div class="page-header-actions">
                <div>
                    <h1>⭐ ${t('extra_days')}</h1>
                    <p>${t('extra_days_subtitle')}</p>
                </div>
                <button class="btn btn-primary" onclick="openAddExtraDaysModal()">＋ ${State.lang === 'en' ? 'Add extra days' : State.lang === 'ca' ? 'Afegir dies extres' : 'Añadir días extras'}</button>
            </div>
        </div>

        <!-- Summary by employee -->
        <div class="panel" style="margin-bottom:var(--space-lg);">
            <div class="panel-header"><h2>👤 ${State.lang === 'en' ? 'Balance by employee' : State.lang === 'ca' ? 'Saldo per empleat' : 'Balance por empleado'}</h2></div>
            <div class="panel-body no-padding">
                <table class="data-table">
                    <thead><tr>
                        <th>${t('th_employee')}</th>
                        <th>${t('th_department')}</th>
                        <th style="text-align:center;">${State.lang === 'en' ? 'Normal days avail.' : State.lang === 'ca' ? 'Dies normals disp.' : 'Días normales disp.'}</th>
                        <th style="text-align:center;">${State.lang === 'en' ? 'Generated extra days' : State.lang === 'ca' ? 'Dies extres generats' : 'Días extras generados'}</th>
                        <th style="text-align:center;">${State.lang === 'en' ? 'Total available' : State.lang === 'ca' ? 'Total disponible' : 'Total disponible'}</th>
                        <th></th>
                    </tr></thead>
                    <tbody>
                        ${users.map(u => {
                            const extraTotal = u.extra_days || 0;
                            const normalRem = u.days_remaining;
                            const totalAvail = normalRem + extraTotal;
                            return `<tr>
                                <td>
                                    <div style="display:flex;align-items:center;gap:8px;">
                                        ${renderAvatarEl(u.avatar_color, u.initials, u.avatar_image, 32)}
                                        <span style="font-weight:600;">${esc(u.full_name)}</span>
                                    </div>
                                </td>
                                <td style="color:var(--text-muted);">${esc(u.department)}</td>
                                <td style="text-align:center;font-weight:600;color:${normalRem > 0 ? 'var(--color-success)' : 'var(--color-danger)'};">${normalRem}</td>
                                <td style="text-align:center;">
                                    <span style="font-weight:700;color:var(--accent-secondary);font-size:1.1rem;">${extraTotal}</span>
                                    ${extraTotal > 0 ? `<span style="font-size:0.72rem;color:var(--text-muted);display:block;">⭐ extras</span>` : ''}
                                </td>
                                <td style="text-align:center;font-weight:700;font-size:1.05rem;color:${totalAvail > 0 ? 'var(--color-success)' : 'var(--color-danger)'};">${totalAvail}</td>
                                <td style="text-align:right;">
                                    <button class="btn btn-secondary btn-sm" onclick="openAddExtraDaysModal(${u.id})">＋ ${State.lang === 'en' ? 'Add' : State.lang === 'ca' ? 'Afegir' : 'Añadir'}</button>
                                </td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Full history -->
        <div class="panel">
            <div class="panel-header">
                <h2>📋 ${State.lang === 'en' ? 'Extra days history' : State.lang === 'ca' ? 'Historial de dies extres' : 'Historial de días extras'}</h2>
                <span style="font-size:0.8rem;color:var(--text-muted);">${entries.length} ${State.lang === 'en' ? 'record(s)' : State.lang === 'ca' ? 'registre(s)' : 'registro(s)'}</span>
            </div>
            <div class="panel-body no-padding">
            ${entries.length === 0
                ? `<div class="empty-state" style="padding:32px;"><div class="empty-icon">⭐</div><h3>${State.lang === 'en' ? 'No extra days recorded' : State.lang === 'ca' ? 'Sense dies extres registrats' : 'Sin días extras registrados'}</h3></div>`
                : `<table class="data-table">
                    <thead><tr>
                        <th>${t('th_employee')}</th>
                        <th>${t('th_days')}</th>
                        <th>${State.lang === 'en' ? 'Description / Reason' : State.lang === 'ca' ? 'Descripció / Motiu' : 'Descripción / Motivo'}</th>
                        <th>${State.lang === 'en' ? 'Work date' : State.lang === 'ca' ? 'Data treballada' : 'Fecha trabajada'}</th>
                        <th>${State.lang === 'en' ? 'Recorded by' : State.lang === 'ca' ? 'Registrat per' : 'Registrado por'}</th>
                        <th>${State.lang === 'en' ? 'Record date' : State.lang === 'ca' ? 'Data registre' : 'Fecha registro'}</th>
                        <th></th>
                    </tr></thead>
                    <tbody>
                        ${entries.map(e => `<tr>
                            <td>
                                <div style="display:flex;align-items:center;gap:8px;">
                                    ${renderAvatarEl(e.employee_avatar_color, e.employee_initials, e.employee_avatar_image, 28)}
                                    <span style="font-weight:600;">${esc(e.employee_name)}</span>
                                </div>
                            </td>
                            <td><span style="font-weight:700;font-size:1.1rem;color:var(--accent-secondary);">+${e.days}</span></td>
                            <td>${esc(e.reason)}</td>
                            <td>${e.work_date ? formatDate(e.work_date) : '<span style="color:var(--text-muted);">—</span>'}</td>
                            <td style="color:var(--text-muted);font-size:0.82rem;">${esc(e.created_by_name || '—')}</td>
                            <td style="color:var(--text-muted);font-size:0.82rem;">${e.created_at ? formatDate(e.created_at.split('T')[0]) : '—'}</td>
                            <td style="white-space:nowrap;">
                                <button class="btn btn-secondary btn-sm" onclick="openEditExtraDaysModal(${e.id})" title="Editar">✏️</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteExtraDaysEntry(${e.id})" title="Eliminar" style="margin-left:4px;">🗑️</button>
                            </td>
                        </tr>`).join('')}
                    </tbody>
                </table>`}
            </div>
        </div>
    </div>`;
}

window.openAddExtraDaysModal = async function(preselectedUserId = null) {
    const users = await api('/api/users');
    openModal(`
    <div class="modal" style="max-width:500px;">
        <div class="modal-header">
            <h3>⭐ Añadir Días Extras</h3>
            <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label>Empleado *</label>
                <select class="form-select" id="edUser">
                    <option value="">— Seleccionar empleado —</option>
                    ${users.map(u => `<option value="${u.id}" ${preselectedUserId === u.id ? 'selected' : ''}>${esc(u.full_name)} (${esc(u.department)})</option>`).join('')}
                </select>
            </div>
            <div class="form-row">
                <div class="form-group" style="flex:1;">
                    <label>Días a añadir *</label>
                    <input type="number" class="form-input" id="edDays" value="1" min="1" max="30">
                </div>
                <div class="form-group" style="flex:2;">
                    <label>Fecha trabajada</label>
                    <input type="date" class="form-input" id="edWorkDate">
                </div>
            </div>
            <div class="form-group">
                <label>Descripción / Motivo *</label>
                <input type="text" class="form-input" id="edReason" placeholder="Ej: Trabajo fin de semana — montaje BigSound 3-4 mayo 2026">
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="submitAddExtraDays()">Añadir días</button>
        </div>
    </div>`);
};

window.submitAddExtraDays = async function() {
    const user_id = parseInt(document.getElementById('edUser').value);
    const days = parseInt(document.getElementById('edDays').value);
    const work_date = document.getElementById('edWorkDate').value || null;
    const reason = document.getElementById('edReason').value.trim();
    if (!user_id) { showToast('Selecciona un empleado', 'error'); return; }
    if (!days || days < 1) { showToast('Los días deben ser al menos 1', 'error'); return; }
    if (!reason) { showToast('La descripción es obligatoria', 'error'); return; }
    try {
        await api('/api/extra-days', { method: 'POST', body: JSON.stringify({ user_id, days, reason, work_date }) });
        closeModal();
        showToast(`+${days} días extras añadidos`, 'success');
        renderPage();
    } catch (err) { showToast(err.message, 'error'); }
};

window.deleteExtraDaysEntry = async function(id) {
    if (!confirm('¿Eliminar este registro de días extras? Los días se descontarán del balance del empleado.')) return;
    try {
        await api(`/api/extra-days/${id}`, { method: 'DELETE' });
        showToast('Registro eliminado', 'success');
        renderPage();
    } catch (err) { showToast(err.message, 'error'); }
};

window.openEditExtraDaysModal = function(id) {
    const entries = (State._extraDaysEntries || []);
    // Fetch fresh from DOM since we may not have State cache — build from current rendered data
    const allEntries = window._extraDaysEntries || [];
    const e = allEntries.find(x => x.id === id);
    if (!e) { showToast('No s\'ha trobat el registre', 'error'); return; }
    openModal(`
    <div class="modal" style="max-width:500px;">
        <div class="modal-header">
            <h3>✏️ Editar Dies Extres</h3>
            <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">
            <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:var(--space-md);">Empleat: <strong>${esc(e.employee_name)}</strong></p>
            <div class="form-row">
                <div class="form-group" style="flex:1;">
                    <label>Dies *</label>
                    <input type="number" class="form-input" id="eedDays" value="${e.days}" min="1" max="30">
                </div>
                <div class="form-group" style="flex:2;">
                    <label>Data treballada</label>
                    <input type="date" class="form-input" id="eedWorkDate" value="${e.work_date || ''}">
                </div>
            </div>
            <div class="form-group">
                <label>Descripció / Motiu *</label>
                <input type="text" class="form-input" id="eedReason" value="${esc(e.reason)}">
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Cancel·lar</button>
            <button class="btn btn-primary" onclick="submitEditExtraDays(${id})">Desar canvis</button>
        </div>
    </div>`);
};

window.submitEditExtraDays = async function(id) {
    const days = parseInt(document.getElementById('eedDays').value);
    const work_date = document.getElementById('eedWorkDate').value || null;
    const reason = document.getElementById('eedReason').value.trim();
    if (!days || days < 1) { showToast('Els dies han de ser com a mínim 1', 'error'); return; }
    if (!reason) { showToast('La descripció és obligatòria', 'error'); return; }
    try {
        await api(`/api/extra-days/${id}`, { method: 'PUT', body: JSON.stringify({ days, reason, work_date }) });
        closeModal();
        showToast('Dies extres actualitzats', 'success');
        renderPage();
    } catch (err) { showToast(err.message, 'error'); }
};

window.openAdminVacationModal = async function(preselectedUserId = null) {
    const users = await api('/api/users');
    const today = new Date().toISOString().split('T')[0];
    openModal(`
    <div class="modal" style="max-width:520px;">
        <div class="modal-header">
            <h3>📅 Registrar vacances d'empleat</h3>
            <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">
            <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:var(--space-md);">Les vacances es crearan com a aprovades i es descomptaran dels dies disponibles de l'empleat.</p>
            <div class="form-group">
                <label>Empleat *</label>
                <select class="form-select" id="avUser">
                    <option value="">— Seleccionar empleat —</option>
                    ${users.map(u => `<option value="${u.id}" ${preselectedUserId === u.id ? 'selected' : ''}>${esc(u.full_name)} (${esc(u.department)})</option>`).join('')}
                </select>
            </div>
            <div class="form-row">
                <div class="form-group" style="flex:1;">
                    <label>Data inici *</label>
                    <input type="date" class="form-input" id="avStart">
                </div>
                <div class="form-group" style="flex:1;">
                    <label>Data fi *</label>
                    <input type="date" class="form-input" id="avEnd">
                </div>
            </div>
            <div class="form-group">
                <label>Tipus</label>
                <select class="form-select" id="avType">
                    <option value="vacaciones">Vacances</option>
                    <option value="personal">Dies personals</option>
                    <option value="otros">Altres</option>
                </select>
            </div>
            <div class="form-group">
                <label>Motiu / Nota</label>
                <input type="text" class="form-input" id="avReason" placeholder="Opcional — registrat per l'admin">
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Cancel·lar</button>
            <button class="btn btn-primary" onclick="submitAdminVacation()">Registrar i aprovar</button>
        </div>
    </div>`);
};

window.submitAdminVacation = async function() {
    const user_id = parseInt(document.getElementById('avUser').value);
    const start_date = document.getElementById('avStart').value;
    const end_date = document.getElementById('avEnd').value;
    const vacation_type = document.getElementById('avType').value;
    const reason = document.getElementById('avReason').value.trim();
    if (!user_id) { showToast('Selecciona un empleat', 'error'); return; }
    if (!start_date || !end_date) { showToast('Les dates són obligatòries', 'error'); return; }
    if (start_date > end_date) { showToast('La data d\'inici ha de ser anterior a la de fi', 'error'); return; }
    try {
        await api('/api/admin/vacations', { method: 'POST', body: JSON.stringify({ user_id, start_date, end_date, vacation_type, reason }) });
        closeModal();
        showToast('Vacances registrades i aprovades correctament', 'success');
        renderPage();
    } catch (err) { showToast(err.message, 'error'); }
};

// ─────────────────────────────────────────────
// Delegations Page
// ─────────────────────────────────────────────

async function loadDelegations(container) {
    const [delegations, users] = await Promise.all([
        api('/api/delegations'),
        api('/api/users'),
    ]);
    const today = new Date().toISOString().split('T')[0];

    container.innerHTML = `
    <div class="page-enter">
        <div class="page-header">
            <div class="page-header-actions">
                <div>
                    <h1>🔁 Delegaciones de Aprobación</h1>
                    <p>Delega tu autoridad de aprobación en otro manager durante un período</p>
                </div>
                <button class="btn btn-primary" onclick="openNewDelegationModal()">+ Nueva Delegación</button>
            </div>
        </div>

        <div class="panel">
            <div class="panel-body no-padding">
                ${delegations.length === 0
                    ? '<div class="empty-state"><div class="empty-icon">🔁</div><h3>Sin delegaciones activas</h3><p>No hay delegaciones configuradas.</p></div>'
                    : `<table class="data-table">
                        <thead><tr>
                            <th>Delegante</th>
                            <th>Delegado en</th>
                            <th>Desde</th>
                            <th>Hasta</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr></thead>
                        <tbody>
                        ${delegations.map(d => {
                            const isActive = d.start_date <= today && d.end_date >= today;
                            return `<tr>
                                <td style="font-weight:600;">${esc(d.delegator_name)}</td>
                                <td>${esc(d.delegate_name)}</td>
                                <td>${formatDate(d.start_date)}</td>
                                <td>${formatDate(d.end_date)}</td>
                                <td><span class="status-badge ${isActive ? 'approved' : 'rejected'}">${isActive ? 'Activa' : 'Inactiva'}</span></td>
                                <td><button class="btn btn-danger btn-sm" onclick="deleteDelegation(${d.id})">🗑️</button></td>
                            </tr>`;
                        }).join('')}
                        </tbody>
                    </table>`
                }
            </div>
        </div>
    </div>`;
}

window.openNewDelegationModal = async function() {
    const users = await api('/api/users');
    const managers = users.filter(u => u.role === 'admin' || u.role === 'manager');
    const today = new Date().toISOString().split('T')[0];
    openModal(`
    <div class="modal">
        <div class="modal-header">
            <h3>🔁 Nueva Delegación</h3>
            <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label>Delegar en</label>
                <select class="form-select" id="delegateUserId">
                    ${users.filter(u => u.id !== State.user.id).map(u => `<option value="${u.id}">${esc(u.full_name)} (${translateRole(u.role)})</option>`).join('')}
                </select>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Fecha inicio</label>
                    <input type="date" class="form-input" id="delegStart" value="${today}" min="${today}" required>
                </div>
                <div class="form-group">
                    <label>Fecha fin</label>
                    <input type="date" class="form-input" id="delegEnd" value="${today}" min="${today}" required>
                </div>
            </div>
            <p style="font-size:0.8rem;color:var(--text-muted);">Durante este período, el usuario seleccionado podrá aprobar y rechazar solicitudes en tu nombre.</p>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="submitNewDelegation()">Crear Delegación</button>
        </div>
    </div>`);
};

window.submitNewDelegation = async function() {
    const delegate_id = document.getElementById('delegateUserId').value;
    const start_date = document.getElementById('delegStart').value;
    const end_date = document.getElementById('delegEnd').value;
    if (!start_date || !end_date) { showToast('Selecciona las fechas', 'error'); return; }
    try {
        await api('/api/delegations', {
            method: 'POST',
            body: JSON.stringify({ delegate_id, start_date, end_date }),
        });
        closeModal();
        showToast('Delegación creada', 'success');
        renderPage();
    } catch(err) { showToast(err.message, 'error'); }
};

window.deleteDelegation = async function(id) {
    if (!confirm('¿Desactivar esta delegación?')) return;
    try {
        await api(`/api/delegations/${id}`, { method: 'DELETE' });
        showToast('Delegación desactivada', 'success');
        renderPage();
    } catch(err) { showToast(err.message, 'error'); }
};

// ─────────────────────────────────────────────
// Modals
// ─────────────────────────────────────────────

function openModal(content) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = content;
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    document.body.appendChild(overlay);
}

function closeModal() {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) overlay.remove();
}

window.closeModal = closeModal;

function calcBusinessDays(startStr, endStr) {
    if (!startStr || !endStr) return 0;
    const holidays = (State.holidays || []).map(h => h.date);
    let days = 0;
    let current = new Date(startStr + 'T00:00:00');
    const end = new Date(endStr + 'T00:00:00');
    while (current <= end) {
        const dow = current.getDay();
        const ds = current.toISOString().split('T')[0];
        if (dow !== 0 && dow !== 6 && !holidays.includes(ds)) days++;
        current.setDate(current.getDate() + 1);
    }
    return days;
}

function updateVacDayCounter() {
    const start = document.getElementById('vacStartDate')?.value;
    const end = document.getElementById('vacEndDate')?.value;
    const counter = document.getElementById('vacDayCounter');
    if (!counter) return;
    if (!start || !end || end < start) { counter.innerHTML = ''; return; }
    const days = calcBusinessDays(start, end);
    const normalRem = State.user.days_remaining;
    const extraDays = State.user.extra_days || 0;
    const totalAvail = normalRem + extraDays;
    const after = totalAvail - days;
    const color = after < 0 ? 'var(--color-danger)' : after <= 2 ? 'var(--color-warning)' : 'var(--color-success)';
    const extraNote = extraDays > 0 && days > normalRem
        ? ` <span style="color:var(--accent-secondary);">(usará ${Math.min(extraDays, days - Math.max(0, normalRem))} ⭐ extras)</span>`
        : '';
    counter.innerHTML = `<span style="background:rgba(255,255,255,0.06);border-radius:8px;padding:8px 12px;display:block;font-size:0.85rem;">
        <strong>${days}</strong> día(s) hábil(es) · Disponibles: <strong>${normalRem}</strong> normal${extraDays > 0 ? ` + <strong>${extraDays}</strong> ⭐ extra` : ''} · Quedarían: <strong style="color:${color}">${after}</strong>${extraNote}
    </span>`;
}

window.openNewVacationModal = async function() {
    if (!State.holidays || State.holidays.length === 0) {
        try { State.holidays = await api(`/api/holidays?year=${new Date().getFullYear()}`); } catch(e) {}
    }
    openModal(`
    <div class="modal">
        <div class="modal-header">
            <h3>🏖️ Nueva Solicitud de Vacaciones</h3>
            <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">
            <form id="newVacationForm">
                <div class="form-row">
                    <div class="form-group">
                        <label>Fecha Inicio</label>
                        <input type="date" class="form-input" id="vacStartDate" required oninput="updateVacDayCounter()">
                    </div>
                    <div class="form-group">
                        <label>Fecha Fin</label>
                        <input type="date" class="form-input" id="vacEndDate" required oninput="updateVacDayCounter()">
                    </div>
                </div>
                <div id="vacDayCounter" style="margin-bottom:12px;"></div>
                <div class="form-group">
                    <label>Tipo</label>
                    <select class="form-select" id="vacType">
                        <option value="vacaciones">🏖️ Vacaciones</option>
                        <option value="asuntos_propios">📌 Asuntos Propios</option>
                        <option value="baja_medica">🏥 Baja Médica</option>
                        <option value="permiso">📋 Permiso</option>
                        <option value="otro">📝 Otro</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Motivo (opcional)</label>
                    <textarea class="form-input" id="vacReason" placeholder="Describe brevemente el motivo..."></textarea>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="submitNewVacation()">Enviar Solicitud</button>
        </div>
    </div>`);

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('vacStartDate').min = today;
    document.getElementById('vacEndDate').min = today;

    document.getElementById('vacStartDate').addEventListener('change', (e) => {
        document.getElementById('vacEndDate').min = e.target.value;
        if (document.getElementById('vacEndDate').value < e.target.value) {
            document.getElementById('vacEndDate').value = e.target.value;
        }
        updateVacDayCounter();
    });
    document.getElementById('vacEndDate').addEventListener('change', updateVacDayCounter);
};

window.submitNewVacation = async function() {
    const startDate = document.getElementById('vacStartDate').value;
    const endDate = document.getElementById('vacEndDate').value;
    const type = document.getElementById('vacType').value;
    const reason = document.getElementById('vacReason').value;

    if (!startDate || !endDate) {
        showToast('Selecciona las fechas', 'error');
        return;
    }

    try {
        await api('/api/vacations', {
            method: 'POST',
            body: JSON.stringify({
                start_date: startDate,
                end_date: endDate,
                vacation_type: type,
                reason: reason
            })
        });
        closeModal();
        showToast('Solicitud creada correctamente', 'success');
        // Refresh user data
        const me = await api('/api/me');
        if (me.authenticated) State.user = me.user;
        renderPage();
    } catch (err) {
        showToast(err.message, 'error');
    }
};

window.deleteVacation = async function(id) {
    if (!confirm('¿Cancelar esta solicitud de vacaciones?')) return;
    try {
        await api(`/api/vacations/${id}`, { method: 'DELETE' });
        showToast('Solicitud cancelada', 'success');
        const me = await api('/api/me');
        if (me.authenticated) State.user = me.user;
        renderPage();
    } catch (err) {
        showToast(err.message, 'error');
    }
};

window.adminDeleteVacation = async function(id) {
    if (!confirm('¿Eliminar esta solicitud permanentemente? Esta acción no se puede deshacer.')) return;
    try {
        await api(`/api/vacations/${id}`, { method: 'DELETE' });
        showToast('Solicitud eliminada', 'success');
        renderPage();
    } catch (err) {
        showToast(err.message, 'error');
    }
};

window.openNewUserModal = async function() {
    const depts = await api('/api/departments');
    openModal(`
    <div class="modal">
        <div class="modal-header">
            <h3>👤 Nuevo Empleado</h3>
            <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">
            <div class="form-row">
                <div class="form-group">
                    <label>Nombre</label>
                    <input type="text" class="form-input" id="userFirstName" placeholder="Nombre" required>
                </div>
                <div class="form-group">
                    <label>Apellido</label>
                    <input type="text" class="form-input" id="userLastName" placeholder="Apellido" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Usuario</label>
                    <input type="text" class="form-input" id="userUsername" placeholder="nombre.usuario" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" class="form-input" id="userEmail" placeholder="email@empresa.com" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Departamento</label>
                    <select class="form-select" id="userDepartment">
                        ${depts.map(d => `<option value="${d.name}">${d.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Rol</label>
                    <select class="form-select" id="userRole">
                        <option value="employee">Empleado</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Días Totales</label>
                <input type="number" class="form-input" id="userTotalDays" value="22" min="0" max="50" style="max-width:160px;">
            </div>
            <p style="font-size:0.8rem;color:var(--text-muted);margin-top:4px;">Se generará una contraseña temporal automáticamente. La verás al crear el empleado.</p>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="submitNewUser()">Crear Empleado</button>
        </div>
    </div>`);
};

window.submitNewUser = async function() {
    const data = {
        first_name: document.getElementById('userFirstName').value,
        last_name: document.getElementById('userLastName').value,
        username: document.getElementById('userUsername').value,
        email: document.getElementById('userEmail').value,
        department: document.getElementById('userDepartment').value,
        role: document.getElementById('userRole').value,
        total_days: parseInt(document.getElementById('userTotalDays').value)
    };

    if (!data.first_name || !data.last_name || !data.username || !data.email) {
        showToast('Rellena todos los campos obligatorios', 'error');
        return;
    }

    try {
        const res = await api('/api/users', { method: 'POST', body: JSON.stringify(data) });
        closeModal();
        renderPage();
        // Show temp password — SMTP may not be configured so admin must relay it manually
        openModal(`
        <div class="modal">
            <div class="modal-header">
                <h3>✅ Empleado creado</h3>
                <button class="modal-close" onclick="closeModal()">✕</button>
            </div>
            <div class="modal-body">
                <p style="margin-bottom:12px;">El empleado <strong>${esc(data.first_name)} ${esc(data.last_name)}</strong> ha sido creado correctamente.</p>
                ${res.temp_password ? `
                <div style="background:rgba(108,92,231,0.12);border:1px solid rgba(108,92,231,0.3);border-radius:10px;padding:16px;margin-bottom:12px;">
                    <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:6px;">Contraseña temporal (cópiala y compártela con el empleado):</p>
                    <div style="display:flex;align-items:center;gap:10px;">
                        <code style="font-size:1.1rem;font-weight:700;letter-spacing:2px;color:var(--accent);flex:1;">${esc(res.temp_password)}</code>
                        <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText('${esc(res.temp_password)}');showToast('Copiado','success')">📋 Copiar</button>
                    </div>
                </div>
                <p style="font-size:0.8rem;color:var(--text-muted);">⚠️ El empleado deberá cambiar esta contraseña en su primer inicio de sesión. Si el email SMTP está configurado, también recibirá las credenciales por correo.</p>
                ` : ''}
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="closeModal()">Entendido</button>
            </div>
        </div>`);
    } catch (err) {
        showToast(err.message, 'error');
    }
};

window.openEditUserModal = async function(userId) {
    const [user, depts] = await Promise.all([
        api('/api/users').then(users => users.find(u => u.id === userId)),
        api('/api/departments')
    ]);
    if (!user) return;

    _pendingAvatarImage = undefined;

    openModal(`
    <div class="modal">
        <div class="modal-header">
            <h3>✏️ Editar Empleado</h3>
            <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label>Foto de perfil</label>
                <div class="avatar-upload-area">
                    <div id="_avatarPreview">${renderAvatarEl(user.avatar_color, user.initials, user.avatar_image, 64)}</div>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                        <input type="file" id="_avatarFileInput" accept="image/*" style="display:none" onchange="previewAvatarChange(this)">
                        <button class="btn btn-secondary btn-sm" onclick="document.getElementById('_avatarFileInput').click()">📷 Cambiar foto</button>
                        ${user.avatar_image ? `<button class="btn btn-danger btn-sm" onclick="clearAvatarChange()">🗑️ Quitar foto</button>` : ''}
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Nombre</label>
                    <input type="text" class="form-input" id="editFirstName" value="${user.first_name}">
                </div>
                <div class="form-group">
                    <label>Apellido</label>
                    <input type="text" class="form-input" id="editLastName" value="${user.last_name}">
                </div>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" class="form-input" id="editEmail" value="${user.email}">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Departamento</label>
                    <select class="form-select" id="editDepartment">
                        ${depts.map(d => `<option value="${d.name}" ${d.name === user.department ? 'selected' : ''}>${d.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Rol</label>
                    <select class="form-select" id="editRole">
                        <option value="employee" ${user.role === 'employee' ? 'selected' : ''}>Empleado</option>
                        <option value="manager" ${user.role === 'manager' ? 'selected' : ''}>Manager</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Nueva Contraseña (dejar vacío para no cambiar)</label>
                    <input type="password" class="form-input" id="editPassword" placeholder="Nueva contraseña">
                </div>
                <div class="form-group">
                    <label>Días Totales</label>
                    <input type="number" class="form-input" id="editTotalDays" value="${user.total_days}" min="0" max="50">
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="submitEditUser(${userId})">Guardar Cambios</button>
        </div>
    </div>`);
};

window.submitEditUser = async function(userId) {
    const data = {
        first_name: document.getElementById('editFirstName').value,
        last_name: document.getElementById('editLastName').value,
        email: document.getElementById('editEmail').value,
        department: document.getElementById('editDepartment').value,
        role: document.getElementById('editRole').value,
        password: document.getElementById('editPassword').value,
        total_days: parseInt(document.getElementById('editTotalDays').value)
    };

    try {
        await api(`/api/users/${userId}`, { method: 'PUT', body: JSON.stringify(data) });

        if (_pendingAvatarImage !== undefined) {
            await api(`/api/users/${userId}/avatar`, {
                method: 'POST',
                body: JSON.stringify({ avatar_image: _pendingAvatarImage })
            });
            if (State.user.id === userId) {
                const me = await api('/api/me');
                if (me.authenticated) State.user = me.user;
                renderApp();
            }
        }

        closeModal();
        showToast('Empleado actualizado', 'success');
        renderPage();
    } catch (err) {
        showToast(err.message, 'error');
    }
};

window.deleteUser = async function(userId) {
    const user = State.users.find(u => u.id === userId);
    if (!confirm(`¿Eliminar al empleado ${user?.full_name}? Se borrarán todas sus solicitudes.`)) return;

    try {
        await api(`/api/users/${userId}`, { method: 'DELETE' });
        showToast('Empleado eliminado', 'success');
        renderPage();
    } catch (err) {
        showToast(err.message, 'error');
    }
};

window.openEditCarryoverModal = function(userId, userName, currentCarryover) {
    const year = new Date().getFullYear();
    openModal(`
    <div class="modal" style="max-width:400px;">
        <div class="modal-header">
            <h3>🔄 ${t('edit_carryover')}</h3>
            <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">
            <p style="font-size:0.88rem;color:var(--text-muted);margin-bottom:16px;">${esc(userName)} · ${t('carryover_from')} (${year})</p>
            <div class="form-group">
                <label>${t('carryover_days')} ${year}</label>
                <input type="number" class="form-input" id="carryoverInput" value="${currentCarryover}" min="0" max="365">
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button>
            <button class="btn btn-primary" onclick="saveCarryover(${userId},${year})">💾 ${t('save_changes')}</button>
        </div>
    </div>`);
};

window.saveCarryover = async function(userId, year) {
    const days = parseInt(document.getElementById('carryoverInput').value) || 0;
    const user = (State.users || []).find(u => u.id === userId);
    const totalDays = user ? user.total_days : 21;
    try {
        await api('/api/balances', {
            method: 'POST',
            body: JSON.stringify({ user_id: userId, year, vacation_type: 'vacaciones', carried_over: days, total_days: totalDays })
        });
        closeModal();
        showToast(t('carryover_days') + ' ' + t('profile_updated').toLowerCase(), 'success');
        renderPage();
    } catch(err) { showToast(err.message, 'error'); }
};

window.openNewHolidayModal = function() {
    openModal(`
    <div class="modal">
        <div class="modal-header">
            <h3>🎉 Nuevo Festivo</h3>
            <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label>Fecha</label>
                <input type="date" class="form-input" id="holidayDate" required>
            </div>
            <div class="form-group">
                <label>Nombre del Festivo</label>
                <input type="text" class="form-input" id="holidayName" placeholder="Ej: Día de la Constitución" required>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="submitNewHoliday()">Añadir Festivo</button>
        </div>
    </div>`);
};

window.submitNewHoliday = async function() {
    const date = document.getElementById('holidayDate').value;
    const name = document.getElementById('holidayName').value;

    if (!date || !name) {
        showToast('Rellena todos los campos', 'error');
        return;
    }

    try {
        await api('/api/holidays', {
            method: 'POST',
            body: JSON.stringify({ date, name })
        });
        closeModal();
        showToast('Festivo añadido', 'success');
        renderPage();
    } catch (err) {
        showToast(err.message, 'error');
    }
};

window.deleteHoliday = async function(id) {
    if (!confirm('¿Eliminar este festivo?')) return;

    try {
        await api(`/api/holidays/${id}`, { method: 'DELETE' });
        showToast('Festivo eliminado', 'success');
        renderPage();
    } catch (err) {
        showToast(err.message, 'error');
    }
};

// ─────────────────────────────────────────────
// Settings Page
// ─────────────────────────────────────────────

async function loadSettings(container) {
    const u = State.user;
    container.innerHTML = `
    <div class="page-enter">
        <div class="page-header">
            <h1>⚙️ ${t('settings')}</h1>
            <p>${t('manage_profile')}</p>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);">

            <div class="panel">
                <div class="panel-header"><h2>📷 ${t('profile_photo')}</h2></div>
                <div class="panel-body">
                    <div style="display:flex;align-items:center;gap:20px;">
                        <div class="profile-avatar-wrap" onclick="document.getElementById('_settingsAvatarInput').click()" style="cursor:pointer;" title="${t('click_photo')}">
                            <div class="employee-avatar-lg profile-avatar-lg" style="background:${u.avatar_image ? 'transparent' : u.avatar_color}">
                                ${u.avatar_image ? `<img src="${u.avatar_image}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" alt="">` : u.initials}
                            </div>
                            <div class="profile-avatar-overlay">📷</div>
                        </div>
                        <div>
                            <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:10px;">${t('click_photo')}</p>
                            <input type="file" id="_settingsAvatarInput" accept="image/*" style="display:none" onchange="settingsUploadAvatar(this)">
                            <button class="btn btn-secondary btn-sm" onclick="document.getElementById('_settingsAvatarInput').click()">📷 ${State.lang === 'en' ? 'Change photo' : 'Cambiar foto'}</button>
                            ${u.avatar_image ? `<button class="btn btn-danger btn-sm" style="margin-left:8px;" onclick="settingsRemoveAvatar()">🗑️ ${State.lang === 'en' ? 'Remove' : 'Quitar'}</button>` : ''}
                        </div>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="panel-header"><h2>🌐 ${t('language')}</h2></div>
                <div class="panel-body">
                    <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:16px;">${State.lang === 'en' ? 'Choose the interface language.' : State.lang === 'ca' ? "Tria l'idioma de la interfície." : 'Elige el idioma de la interfaz.'}</p>
                    <div style="display:flex;gap:12px;flex-wrap:wrap;">
                        <button class="btn ${State.lang === 'es' ? 'btn-primary' : 'btn-secondary'}" style="flex:1;min-width:120px;" onclick="setLanguage('es')">🇪🇸 Castellano</button>
                        <button class="btn ${State.lang === 'ca' ? 'btn-primary' : 'btn-secondary'}" style="flex:1;min-width:120px;" onclick="setLanguage('ca')">🏴 Català</button>
                        <button class="btn ${State.lang === 'en' ? 'btn-primary' : 'btn-secondary'}" style="flex:1;min-width:120px;" onclick="setLanguage('en')">🇬🇧 English</button>
                    </div>
                </div>
            </div>

        </div>

        <div class="panel" style="margin-top:var(--space-lg);">
            <div class="panel-header"><h2>👤 ${t('personal_info')}</h2></div>
            <div class="panel-body">
                <div class="login-error" id="settingsInfoError"></div>
                <div class="form-row">
                    <div class="form-group">
                        <label>${t('first_name')}</label>
                        <input type="text" class="form-input" id="settingsFirstName" value="${esc(u.first_name)}">
                    </div>
                    <div class="form-group">
                        <label>${t('last_name')}</label>
                        <input type="text" class="form-input" id="settingsLastName" value="${esc(u.last_name)}">
                    </div>
                </div>
                <div class="form-group">
                    <label>${t('email')}</label>
                    <input type="email" class="form-input" id="settingsEmail" value="${esc(u.email)}">
                </div>
                <button class="btn btn-primary" onclick="saveProfileSettings()">${t('save_changes')}</button>
            </div>
        </div>

        <div class="panel" style="margin-top:var(--space-lg);">
            <div class="panel-header"><h2>🔒 ${t('change_password')}</h2></div>
            <div class="panel-body">
                <div class="login-error" id="settingsPwError"></div>
                <div class="form-group">
                    <label>${t('current_password')}</label>
                    <input type="password" class="form-input" id="settingsCurrent" placeholder="••••••••">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>${t('new_password')}</label>
                        <input type="password" class="form-input" id="settingsNew" placeholder="••••••••">
                    </div>
                    <div class="form-group">
                        <label>${t('confirm_password')}</label>
                        <input type="password" class="form-input" id="settingsConfirm" placeholder="••••••••">
                    </div>
                </div>
                <button class="btn btn-primary" onclick="savePasswordSettings()">${t('change_password')}</button>
            </div>
        </div>

        ${u.role === 'admin' ? `
        <div class="panel" style="margin-top:var(--space-lg);">
            <div class="panel-header">
                <h2>📅 ${t('close_year_title')}</h2>
            </div>
            <div class="panel-body">
                <p style="font-size:0.88rem;color:var(--text-muted);margin-bottom:16px;">${t('close_year_subtitle')}</p>
                <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
                    <div>
                        <label style="font-size:0.82rem;color:var(--text-muted);display:block;margin-bottom:4px;">${t('year_to_close')}</label>
                        <select class="form-select" id="closeYearSelect" style="width:110px;">
                            ${[new Date().getFullYear()-1, new Date().getFullYear(), new Date().getFullYear()+1]
                                .map(y=>`<option value="${y}" ${y===new Date().getFullYear()-1?'selected':''}>${y}</option>`).join('')}
                        </select>
                    </div>
                    <button class="btn btn-secondary" style="margin-top:18px;" onclick="closeYearPreview()">🔍 ${t('preview_btn')}</button>
                </div>
                <div id="closeYearResults" style="margin-top:16px;"></div>
            </div>
        </div>` : ''}
    </div>`;
}

window.settingsUploadAvatar = async function(input) {
    const file = input.files[0];
    if (!file) return;
    try {
        const imgData = await resizeImage(file, 256);
        await api(`/api/users/${State.user.id}/avatar`, { method: 'POST', body: JSON.stringify({ avatar_image: imgData }) });
        const me = await api('/api/me');
        if (me.authenticated) State.user = me.user;
        showToast(State.lang === 'en' ? 'Photo updated' : 'Foto actualizada', 'success');
        renderApp();
        navigateTo('settings');
    } catch(err) { showToast(err.message, 'error'); }
};

window.settingsRemoveAvatar = async function() {
    try {
        await api(`/api/users/${State.user.id}/avatar`, { method: 'POST', body: JSON.stringify({ avatar_image: null }) });
        const me = await api('/api/me');
        if (me.authenticated) State.user = me.user;
        showToast(State.lang === 'en' ? 'Photo removed' : 'Foto eliminada', 'success');
        renderApp();
        navigateTo('settings');
    } catch(err) { showToast(err.message, 'error'); }
};

window.saveProfileSettings = async function() {
    const first_name = document.getElementById('settingsFirstName').value.trim();
    const last_name = document.getElementById('settingsLastName').value.trim();
    const email = document.getElementById('settingsEmail').value.trim();
    const errorEl = document.getElementById('settingsInfoError');
    if (!first_name || !last_name) {
        errorEl.textContent = t('name_required'); errorEl.classList.add('visible'); return;
    }
    try {
        const res = await api(`/api/users/${State.user.id}`, {
            method: 'PUT',
            body: JSON.stringify({ first_name, last_name, email })
        });
        State.user = res.user;
        showToast(t('profile_updated'), 'success');
        errorEl.classList.remove('visible');
        renderApp();
        navigateTo('settings');
    } catch(err) { errorEl.textContent = err.message; errorEl.classList.add('visible'); }
};

window.savePasswordSettings = async function() {
    const current = document.getElementById('settingsCurrent').value;
    const newPw = document.getElementById('settingsNew').value;
    const confirm = document.getElementById('settingsConfirm').value;
    const errorEl = document.getElementById('settingsPwError');
    if (newPw !== confirm) { errorEl.textContent = t('passwords_no_match'); errorEl.classList.add('visible'); return; }
    if (newPw.length < 8) { errorEl.textContent = t('min_8'); errorEl.classList.add('visible'); return; }
    try {
        await api('/api/change-password', { method: 'POST', body: JSON.stringify({ current_password: current, new_password: newPw }) });
        errorEl.classList.remove('visible');
        showToast(t('password_updated'), 'success');
        ['settingsCurrent','settingsNew','settingsConfirm'].forEach(id => document.getElementById(id).value = '');
    } catch(err) { errorEl.textContent = err.message; errorEl.classList.add('visible'); }
};

window.setLanguage = function(lang) {
    State.lang = lang;
    localStorage.setItem('lang', lang);
    showToast(t('lang_changed'), 'success');
    renderApp();
    navigateTo('settings');
};

window.closeYearPreview = async function() {
    const sel = document.getElementById('closeYearSelect');
    if (!sel) return;
    const year = parseInt(sel.value);
    const resultsDiv = document.getElementById('closeYearResults');
    resultsDiv.innerHTML = `<div style="color:var(--text-muted);font-size:0.85rem;">Cargando...</div>`;
    try {
        const res = await api(`/api/close-year?year=${year}`);
        window._closeYearData = res.results;
        window._closeYearMeta = { year, nextYear: res.next_year };
        const totalCarryover = res.results.reduce((s, r) => s + r.carryover, 0);
        resultsDiv.innerHTML = `
        <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:8px;">
            ${t('year_to_close')}: <strong>${year}</strong> → arrastre a <strong>${res.next_year}</strong>
            · Total a trasladar: <strong id="closeYearTotal" style="color:#10B981;">${totalCarryover}</strong> días
        </div>
        <div style="padding:10px 14px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.3);border-radius:var(--radius-sm);font-size:0.82rem;color:var(--color-warning);margin-bottom:12px;">
            ✏️ <strong>Edita los días usados</strong> si el sistema no tiene las solicitudes históricas de ${year}. Los días arrastrados se recalculan automáticamente.
        </div>
        <div style="overflow-x:auto;margin-bottom:12px;">
        <table class="data-table" style="font-size:0.82rem;">
            <thead><tr>
                <th>${t('th_employee')}</th>
                <th>${t('th_department')}</th>
                <th style="text-align:center;">${t('th_allocation')}</th>
                <th style="text-align:center;">✏️ ${t('used_label')} ${year}</th>
                <th style="text-align:center;">${t('th_remaining')}</th>
                <th style="text-align:center;color:#10B981;">🔄 ${t('th_carryover')} → ${res.next_year}</th>
            </tr></thead>
            <tbody>
                ${res.results.map(r => `<tr id="close_row_${r.user_id}">
                    <td style="font-weight:600;">${esc(r.user_name)}</td>
                    <td style="color:var(--text-muted);">${esc(r.department)}</td>
                    <td style="text-align:center;">${r.allocation}</td>
                    <td style="text-align:center;">
                        <input type="number" id="close_used_${r.user_id}"
                            value="${r.days_used}" min="0" max="${r.allocation}"
                            oninput="updateCloseYearRow(${r.user_id},${r.allocation})"
                            style="width:64px;text-align:center;padding:4px 6px;border:1px solid var(--border-color);border-radius:var(--radius-sm);background:var(--bg-glass);color:var(--text-primary);font-size:0.82rem;">
                    </td>
                    <td id="close_rem_${r.user_id}" style="text-align:center;${r.remaining < 0 ? 'color:var(--color-danger);' : ''}">${r.remaining}</td>
                    <td id="close_carry_${r.user_id}" style="text-align:center;font-weight:700;color:${r.carryover > 0 ? '#10B981' : 'var(--text-dim)'};">${r.carryover > 0 ? '+' + r.carryover : '—'}</td>
                </tr>`).join('')}
            </tbody>
        </table>
        </div>
        <button class="btn btn-primary" onclick="executeCloseYear()">
            📅 ${t('execute_close')} ${year} → ${res.next_year}
        </button>`;
    } catch(err) { resultsDiv.innerHTML = `<div style="color:var(--color-danger);">${err.message}</div>`; }
};

window.updateCloseYearRow = function(userId, allocation) {
    const input = document.getElementById(`close_used_${userId}`);
    const used = Math.max(0, parseInt(input.value) || 0);
    const remaining = allocation - used;
    const carryover = Math.max(0, remaining);
    const remEl = document.getElementById(`close_rem_${userId}`);
    const carryEl = document.getElementById(`close_carry_${userId}`);
    remEl.textContent = remaining;
    remEl.style.color = remaining < 0 ? 'var(--color-danger)' : '';
    carryEl.textContent = carryover > 0 ? `+${carryover}` : '—';
    carryEl.style.color = carryover > 0 ? '#10B981' : 'var(--text-dim)';
    // Update grand total
    const data = window._closeYearData || [];
    let total = 0;
    for (const r of data) {
        const inp = document.getElementById(`close_used_${r.user_id}`);
        if (inp) total += Math.max(0, r.allocation - Math.max(0, parseInt(inp.value) || 0));
    }
    const totalEl = document.getElementById('closeYearTotal');
    if (totalEl) totalEl.textContent = total;
};

window.executeCloseYear = async function() {
    const meta = window._closeYearMeta;
    const data = window._closeYearData || [];
    if (!meta) return;
    const { year, nextYear } = meta;
    const msg = t('close_year_confirm').replace('{y}', year).replace('{n}', nextYear);
    if (!confirm(msg)) return;
    // Collect overrides from editable inputs
    const overrides = {};
    for (const r of data) {
        const inp = document.getElementById(`close_used_${r.user_id}`);
        if (inp) overrides[String(r.user_id)] = Math.max(0, parseInt(inp.value) || 0);
    }
    const resultsDiv = document.getElementById('closeYearResults');
    try {
        const res = await api('/api/close-year', { method: 'POST', body: JSON.stringify({ year, overrides }) });
        const totalCarried = res.results.reduce((s, r) => s + r.carryover, 0);
        showToast(`${t('close_year_done')} ${year}`, 'success');
        resultsDiv.innerHTML = `
        <div style="padding:14px 16px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:var(--radius-sm);color:#10B981;font-size:0.88rem;">
            ✅ ${t('close_year_done')} ${year}. <strong>${totalCarried} días</strong> arrastrados ya disponibles en ${nextYear}.
        </div>
        <div style="overflow-x:auto;margin-top:12px;">
        <table class="data-table" style="font-size:0.82rem;">
            <thead><tr>
                <th>${t('th_employee')}</th>
                <th style="text-align:center;">${t('th_allocation')}</th>
                <th style="text-align:center;">${t('used_label')}</th>
                <th style="text-align:center;color:#10B981;">🔄 Arrastrado a ${nextYear}</th>
            </tr></thead>
            <tbody>
                ${res.results.map(r => `<tr>
                    <td style="font-weight:600;">${esc(r.user_name)}</td>
                    <td style="text-align:center;">${r.allocation}</td>
                    <td style="text-align:center;">${r.days_used}</td>
                    <td style="text-align:center;font-weight:700;color:${r.carryover > 0 ? '#10B981' : 'var(--text-dim)'};">${r.carryover > 0 ? '+' + r.carryover : '—'}</td>
                </tr>`).join('')}
            </tbody>
        </table>
        </div>`;
    } catch(err) { showToast(err.message, 'error'); }
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function translateStatus(status) {
    const keys = { pending: 'pending', approved: 'approved', rejected: 'rejected', cancel_requested: 'cancel_requested', cancelled: 'cancelled' };
    return keys[status] ? t(keys[status]) : status;
}

function translateType(type) {
    const es = { vacaciones: '🏖️ Vacaciones', asuntos_propios: '📌 Asuntos Propios', baja_medica: '🏥 Baja Médica', permiso: '📋 Permiso', otro: '📝 Otro' };
    const en = { vacaciones: '🏖️ Vacations', asuntos_propios: '📌 Personal Day', baja_medica: '🏥 Sick Leave', permiso: '📋 Permission', otro: '📝 Other' };
    const ca = { vacaciones: '🏖️ Vacances', asuntos_propios: '📌 Assumptes propis', baja_medica: '🏥 Baixa mèdica', permiso: '📋 Permís', otro: '📝 Altre' };
    return (State.lang === 'en' ? en : State.lang === 'ca' ? ca : es)[type] || type;
}

function translateRole(role) {
    const keys = { admin: 'admin', manager: 'manager', employee: 'employee' };
    return keys[role] ? t(keys[role]) : role;
}

function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    const locale = State.lang === 'en' ? 'en-GB' : State.lang === 'ca' ? 'ca-ES' : 'es-ES';
    return d.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
}

function getMonthName(month) {
    const es = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const ca = ['', 'Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny',
                'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];
    const en = ['', 'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
    const months = State.lang === 'ca' ? ca : State.lang === 'en' ? en : es;
    return months[month];
}

// ─────────────────────────────────────────────
// Events — helpers
// ─────────────────────────────────────────────

const EVENT_TYPOLOGIES = ['Deportivo', 'Musical', 'Cultural', 'Corporativo', 'Tecnología', 'Moda', 'Gastronomía', 'Otro'];

const TYPOLOGY_COLORS = {
    'Deportivo': '#0984e3', 'Musical': '#6C5CE7', 'Cultural': '#00b894',
    'Corporativo': '#636e72', 'Tecnología': '#00cec9', 'Moda': '#e84393',
    'Gastronomía': '#e17055', 'Otro': '#b2bec3',
};

function typologyBadge(typ) {
    const col = TYPOLOGY_COLORS[typ] || '#b2bec3';
    return `<span style="background:${col}22;color:${col};border:1px solid ${col}44;border-radius:6px;padding:2px 8px;font-size:0.75rem;font-weight:600;">${typ || 'Otro'}</span>`;
}

function eventStatusBadge(ev) {
    if (ev.status === 'done') return `<span style="background:rgba(16,185,129,0.12);color:#10B981;border:1px solid rgba(16,185,129,0.3);border-radius:6px;padding:2px 8px;font-size:0.75rem;font-weight:600;">✅ Realizado</span>`;
    const today = new Date().toISOString().split('T')[0];
    if (ev.end_date < today) return `<span style="background:var(--color-success-bg);color:var(--color-success);border:1px solid var(--color-success-border);border-radius:6px;padding:2px 8px;font-size:0.75rem;font-weight:600;">⏹ Pasado</span>`;
    if (ev.start_date <= today) return `<span style="background:var(--color-warning-bg);color:var(--color-warning);border:1px solid var(--color-warning-border);border-radius:6px;padding:2px 8px;font-size:0.75rem;font-weight:600;">🔴 En curso</span>`;
    return `<span style="background:var(--color-info-bg);color:var(--color-info);border:1px solid var(--color-info-border);border-radius:6px;padding:2px 8px;font-size:0.75rem;font-weight:600;">📅 Próximo</span>`;
}

// ─────────────────────────────────────────────
// Events — filter helpers
// ─────────────────────────────────────────────

function eventsFilterBar(clients, users, showEmployee = true) {
    const typOpts = ['', ...EVENT_TYPOLOGIES].map(t =>
        `<option value="${t}" ${State.eventsFilterTypology === t ? 'selected' : ''}>${t || 'Todas las tipologías'}</option>`
    ).join('');
    const clientOpts = [{ id: '', name: 'Todos los clientes' }, ...clients].map(c =>
        `<option value="${c.id}" ${String(State.eventsFilterClient) === String(c.id) ? 'selected' : ''}>${esc(c.name)}</option>`
    ).join('');
    const userOpts = showEmployee
        ? [{ id: '', full_name: 'Todos los empleados' }, ...users].map(u =>
            `<option value="${u.id}" ${String(State.eventsFilterUser) === String(u.id) ? 'selected' : ''}>${esc(u.full_name)}</option>`
          ).join('')
        : '';
    const statusChips = [
        { val: null,     label: 'Todos' },
        { val: 'active', label: '🔵 Activos' },
        { val: 'done',   label: '✅ Realizados' },
    ].map(s => {
        const active = State.eventsFilterStatus === s.val;
        return `<button onclick="setEventsFilter('status','${s.val}')" style="padding:4px 12px;border-radius:20px;border:1px solid ${active ? 'var(--accent-primary)' : 'var(--border-color)'};background:${active ? 'var(--accent-primary)' : 'transparent'};color:${active ? '#fff' : 'var(--text-secondary)'};font-size:0.78rem;font-weight:600;cursor:pointer;white-space:nowrap;">${s.label}</button>`;
    }).join('');
    return `
    <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:var(--space-lg);padding:var(--space-md);background:var(--bg-glass);border-radius:var(--radius-md);border:1px solid var(--border-color);">
        <span style="font-size:0.8rem;color:var(--text-muted);font-weight:600;">FILTROS:</span>
        <select class="form-select" style="width:200px;" onchange="setEventsFilter('client', this.value)">${clientOpts}</select>
        <select class="form-select" style="width:190px;" onchange="setEventsFilter('typology', this.value)">${typOpts}</select>
        ${showEmployee ? `<select class="form-select" style="width:200px;" onchange="setEventsFilter('user', this.value)">${userOpts}</select>` : ''}
        <div style="display:flex;gap:6px;align-items:center;">${statusChips}</div>
        ${(State.eventsFilterClient || State.eventsFilterTypology || State.eventsFilterUser || State.eventsFilterStatus)
            ? `<button class="btn btn-secondary btn-sm" onclick="clearEventsFilters()">✕ Limpiar filtros</button>` : ''}
    </div>`;
}

window.setEventsFilter = function(type, value) {
    const v = value === '' || value === 'null' ? null : (isNaN(value) ? value : parseInt(value));
    if (type === 'client')   State.eventsFilterClient   = v;
    if (type === 'typology') State.eventsFilterTypology = typeof v === 'string' && v !== 'null' ? v : null;
    if (type === 'user')     State.eventsFilterUser     = v;
    if (type === 'status')   State.eventsFilterStatus   = (value === 'null' || value === '') ? null : value;
    renderPage();
};

window.clearEventsFilters = function() {
    State.eventsFilterClient = null;
    State.eventsFilterTypology = null;
    State.eventsFilterUser = null;
    State.eventsFilterStatus = null;
    renderPage();
};

function applyEventsFilters(events) {
    return events.filter(e => {
        if (State.eventsFilterClient && e.client_id !== State.eventsFilterClient) return false;
        if (State.eventsFilterTypology && e.client_typology !== State.eventsFilterTypology) return false;
        if (State.eventsFilterUser && !e.assignments.some(a => a.user_id === State.eventsFilterUser)) return false;
        if (State.eventsFilterStatus && (e.status || 'active') !== State.eventsFilterStatus) return false;
        return true;
    });
}

// ─────────────────────────────────────────────
// Events Dashboard Page
// ─────────────────────────────────────────────

async function loadEvents(container) {
    const isAdmin = State.user.role === 'admin';
    const canEdit = true; // all roles can create/edit events and clients
    const year = State.eventsYear;

    const [stats, events, clients, users] = await Promise.all([
        api(`/api/events/stats?year=${year}`),
        api(`/api/events?year=${year}`),
        api('/api/clients'),
        api('/api/users'),
    ]);
    State.events = events;
    State.clients = clients;
    window._eventClients = clients;
    window._eventUsers = users;

    // If filtering by employee → show employee detail view
    if (State.eventsFilterUser) {
        const emp = users.find(u => u.id === State.eventsFilterUser);
        if (emp) {
            await renderEmployeeEventDetail(container, emp, events, clients, users, canEdit, year);
            return;
        }
    }

    const filtered = applyEventsFilters(events);
    const today = new Date().toISOString().split('T')[0];
    const upcoming = filtered.filter(e => e.end_date >= today).sort((a, b) => a.start_date.localeCompare(b.start_date));
    const past = filtered.filter(e => e.end_date < today);

    // Recompute stats from filtered events
    const byClientFiltered = {};
    const byEmployeeFiltered = {};
    for (const e of filtered) {
        const cn = e.client_name || 'Sin cliente';
        if (!byClientFiltered[cn]) byClientFiltered[cn] = { count: 0, upcoming: 0, color: e.client_color || '#6C5CE7', typology: e.client_typology || 'Otro' };
        byClientFiltered[cn].count++;
        if (e.end_date >= today) byClientFiltered[cn].upcoming++;
        for (const a of e.assignments) {
            const en = a.employee_name;
            if (!byEmployeeFiltered[en]) byEmployeeFiltered[en] = { count: 0, upcoming: 0, color: a.employee_avatar_color, initials: a.employee_initials, avatar: a.employee_avatar_image };
            byEmployeeFiltered[en].count++;
            if (e.end_date >= today) byEmployeeFiltered[en].upcoming++;
        }
    }

    // Completion stats (from ALL filtered events regardless of date)
    const doneEvents = filtered.filter(e => (e.status || 'active') === 'done');
    const activeEvents = filtered.filter(e => (e.status || 'active') !== 'done');
    const doneCount = doneEvents.length;
    const totalCount = filtered.length;
    const donePct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

    container.innerHTML = `
    <div class="page-enter">
        <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start;">
            <div>
                <h1>🎯 Dashboard Eventos</h1>
                <p>Visión global de todos los eventos y asignaciones de equipo</p>
            </div>
            <div style="display:flex;gap:8px;align-items:center;">
                <select class="form-select" style="width:110px;" onchange="changeEventsYear(this.value)">
                    ${[year-1, year, year+1].map(y => `<option value="${y}" ${y===year?'selected':''}>${y}</option>`).join('')}
                </select>
                <button class="btn btn-secondary" onclick="exportEventsDashboardCSV()">⬇ CSV</button>
                <button class="btn btn-secondary" onclick="exportEventsPDF()">⬇ PDF</button>
                ${canEdit ? `<button class="btn btn-primary" onclick="openCreateEventModal()">＋ Nuevo Evento</button>` : ''}
            </div>
        </div>

        ${eventsFilterBar(clients, users, true)}

        <!-- Stats -->
        <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);">
            <div class="stat-card accent"><div class="stat-icon">📅</div><div class="stat-value">${upcoming.length}</div><div class="stat-label">Próximos Eventos</div></div>
            <div class="stat-card info"><div class="stat-icon">🗂️</div><div class="stat-value">${filtered.length}</div><div class="stat-label">Total ${year}</div></div>
            <div class="stat-card success"><div class="stat-icon">🏢</div><div class="stat-value">${Object.keys(byClientFiltered).length}</div><div class="stat-label">Clientes</div></div>
            <div class="stat-card warning"><div class="stat-icon">👤</div><div class="stat-value">${filtered.reduce((s,e)=>s+e.assignments.length*e.duration_days,0)}</div><div class="stat-label">Días-Persona</div></div>
        </div>

        <!-- Completion progress panel -->
        <div class="panel" style="margin-bottom:var(--space-lg);">
            <div class="panel-header">
                <h2>📊 Estado de Realización</h2>
                <div style="display:flex;gap:8px;">
                    <span style="font-size:0.8rem;padding:3px 10px;border-radius:12px;background:rgba(16,185,129,0.12);color:#10B981;font-weight:600;">✅ ${doneCount} realizados</span>
                    <span style="font-size:0.8rem;padding:3px 10px;border-radius:12px;background:rgba(99,102,241,0.1);color:var(--accent-primary);font-weight:600;">🔵 ${activeEvents.length} activos</span>
                </div>
            </div>
            <div class="panel-body">
                <div style="display:grid;grid-template-columns:1fr auto;align-items:center;gap:var(--space-lg);">
                    <div>
                        <div style="display:flex;justify-content:space-between;font-size:0.82rem;color:var(--text-muted);margin-bottom:6px;">
                            <span>Progreso de realización ${year}</span>
                            <span style="font-weight:700;color:${donePct >= 80 ? '#10B981' : donePct >= 50 ? 'var(--color-warning)' : 'var(--text-secondary)'};">${donePct}%</span>
                        </div>
                        <div style="height:14px;background:var(--bg-glass);border-radius:7px;overflow:hidden;border:1px solid var(--border-color);">
                            <div style="height:100%;width:${donePct}%;background:linear-gradient(90deg,#10B981,#34D399);border-radius:7px;transition:width 0.4s ease;"></div>
                        </div>
                        <div style="display:flex;gap:16px;margin-top:10px;flex-wrap:wrap;">
                            ${doneEvents.slice(0,5).map(e => `
                                <div style="display:flex;align-items:center;gap:5px;font-size:0.78rem;color:var(--text-muted);">
                                    <span style="color:#10B981;">✅</span>
                                    <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:140px;" title="${esc(e.name)}">${esc(e.name)}</span>
                                </div>`).join('')}
                            ${doneCount > 5 ? `<div style="font-size:0.78rem;color:var(--text-muted);">+${doneCount - 5} más</div>` : ''}
                        </div>
                    </div>
                    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;">
                        <svg width="90" height="90" viewBox="0 0 90 90">
                            <circle cx="45" cy="45" r="38" fill="none" stroke="var(--border-color)" stroke-width="10"/>
                            <circle cx="45" cy="45" r="38" fill="none" stroke="#10B981" stroke-width="10"
                                stroke-dasharray="${2 * Math.PI * 38}" stroke-dashoffset="${2 * Math.PI * 38 * (1 - donePct / 100)}"
                                stroke-linecap="round" transform="rotate(-90 45 45)" style="transition:stroke-dashoffset 0.4s;"/>
                            <text x="45" y="49" text-anchor="middle" font-size="17" font-weight="700" fill="var(--text-primary)">${donePct}%</text>
                        </svg>
                        <div style="font-size:0.72rem;color:var(--text-muted);text-align:center;">${doneCount}/${totalCount}<br>realizados</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Próximos eventos -->
        <div class="panel" style="margin-bottom:var(--space-lg);">
            <div class="panel-header">
                <h2>📅 Próximos Eventos</h2>
                <span style="font-size:0.8rem;color:var(--text-muted);">${upcoming.length} evento(s)</span>
            </div>
            <div class="panel-body no-padding">
                ${upcoming.length === 0
                    ? `<div class="empty-state" style="padding:32px;"><p>No hay próximos eventos${State.eventsFilterClient||State.eventsFilterTypology ? ' con los filtros aplicados' : ' para '+year}.</p></div>`
                    : `<table class="data-table">
                        <thead><tr>
                            <th>Evento</th><th>Cliente</th><th>Tipología</th>
                            <th>Fechas</th><th>Días</th><th>Equipo asignado</th><th>Estado</th>
                            ${canEdit ? '<th></th>' : ''}
                        </tr></thead>
                        <tbody>${upcoming.map(e => renderEventRow(e, canEdit)).join('')}</tbody>
                    </table>`
                }
            </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg);">
            <div class="panel">
                <div class="panel-header"><h2>🏢 Por Cliente</h2></div>
                <div class="panel-body">
                    ${Object.keys(byClientFiltered).length === 0
                        ? '<p style="color:var(--text-muted);">Sin datos.</p>'
                        : Object.entries(byClientFiltered).sort((a,b)=>b[1].count-a[1].count).map(([name,d]) => `
                        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
                            <div style="width:10px;height:10px;border-radius:50%;background:${d.color};flex-shrink:0;"></div>
                            <div style="flex:1;min-width:0;">
                                <div style="font-weight:600;font-size:0.85rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${esc(name)}">${esc(name)}</div>
                                <div style="margin-top:2px;">${typologyBadge(d.typology)}</div>
                            </div>
                            <div style="text-align:right;">
                                <div style="font-weight:700;">${d.count}</div>
                                <div style="font-size:0.72rem;color:var(--color-info);">${d.upcoming} próx.</div>
                            </div>
                        </div>`).join('')
                    }
                </div>
            </div>
            <div class="panel">
                <div class="panel-header"><h2>👤 Por Empleado</h2><span style="font-size:0.75rem;color:var(--text-muted);">Clic para ver detalle</span></div>
                <div class="panel-body">
                    ${Object.keys(byEmployeeFiltered).length === 0
                        ? '<p style="color:var(--text-muted);">Sin asignaciones.</p>'
                        : Object.entries(byEmployeeFiltered).sort((a,b)=>b[1].upcoming-a[1].upcoming||b[1].count-a[1].count).map(([name,d]) => {
                            const u = users.find(u => u.full_name === name);
                            return `<div onclick="${u ? `setEventsFilter('user',${u.id})` : ''}" style="display:flex;align-items:center;gap:10px;margin-bottom:12px;cursor:${u?'pointer':'default'};padding:6px 8px;border-radius:var(--radius-sm);transition:background 0.15s;" onmouseover="this.style.background='var(--bg-glass-hover)'" onmouseout="this.style.background=''">
                                ${renderAvatarEl(d.color, d.initials, d.avatar, 32)}
                                <div style="flex:1;min-width:0;">
                                    <div style="font-weight:600;font-size:0.85rem;">${esc(name)}</div>
                                    <div style="font-size:0.75rem;color:var(--text-muted);">${d.upcoming} próximos · ${d.count} total</div>
                                </div>
                                <div style="display:flex;align-items:center;gap:6px;">
                                    <div style="font-weight:700;font-size:1rem;color:var(--accent-secondary);">${d.upcoming}</div>
                                    ${u ? '<span style="font-size:0.7rem;color:var(--text-dim);">→</span>' : ''}
                                </div>
                            </div>`;
                        }).join('')
                    }
                </div>
            </div>
        </div>

        ${past.length > 0 ? `
        <div class="panel">
            <div class="panel-header"><h2>🗂️ Historial ${year}</h2><span style="font-size:0.8rem;color:var(--text-muted);">${past.length} finalizado(s)</span></div>
            <div class="panel-body no-padding">
                <table class="data-table">
                    <thead><tr><th>Evento</th><th>Cliente</th><th>Fechas</th><th>Días</th><th>Equipo</th><th>Estado</th>${canEdit?'<th></th>':''}</tr></thead>
                    <tbody>${past.slice().reverse().map(e => renderEventRow(e, canEdit)).join('')}</tbody>
                </table>
            </div>
        </div>` : ''}
    </div>`;
}

// ─────────────────────────────────────────────
// Employee Events Detail View
// ─────────────────────────────────────────────

async function renderEmployeeEventDetail(container, emp, allEvents, clients, users, isAdmin, year) {
    const today = new Date().toISOString().split('T')[0];
    const empEvents = allEvents
        .filter(e => e.assignments.some(a => a.user_id === emp.id))
        .sort((a, b) => a.start_date.localeCompare(b.start_date));

    const upcoming = empEvents.filter(e => e.end_date >= today);
    const past = empEvents.filter(e => e.end_date < today);
    const totalDays = empEvents.reduce((s, e) => s + e.duration_days, 0);

    // Group events by month for timeline
    const byMonth = {};
    empEvents.forEach(e => {
        const key = e.start_date.slice(0, 7);
        if (!byMonth[key]) byMonth[key] = [];
        byMonth[key].push(e);
    });

    container.innerHTML = `
    <div class="page-enter">
        <div class="page-header">
            <div class="page-header-actions">
                <div style="display:flex;align-items:center;gap:var(--space-lg);">
                    <div>
                        <button class="btn btn-secondary btn-sm" onclick="clearEventsFilters()" style="margin-bottom:10px;">← Volver al Dashboard</button>
                        <div style="display:flex;align-items:center;gap:var(--space-md);">
                            <div class="employee-avatar-lg" style="background:${emp.avatar_image ? 'transparent' : emp.avatar_color};width:72px;height:72px;font-size:1.4rem;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                ${emp.avatar_image ? `<img src="${emp.avatar_image}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="">` : emp.initials}
                            </div>
                            <div>
                                <h1 style="margin:0;">${esc(emp.full_name)}</h1>
                                <p style="margin:0;">${esc(emp.department)} · ${translateRole(emp.role)}</p>
                                <p style="margin:4px 0 0;font-size:0.8rem;color:var(--text-muted);">Detalle de eventos asignados ${year}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Stats -->
        <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);">
            <div class="stat-card accent"><div class="stat-icon">📅</div><div class="stat-value">${upcoming.length}</div><div class="stat-label">Próximos Eventos</div></div>
            <div class="stat-card info"><div class="stat-icon">🗂️</div><div class="stat-value">${empEvents.length}</div><div class="stat-label">Total ${year}</div></div>
            <div class="stat-card warning"><div class="stat-icon">📆</div><div class="stat-value">${totalDays}</div><div class="stat-label">Días en Eventos</div></div>
            <div class="stat-card success"><div class="stat-icon">🏢</div><div class="stat-value">${new Set(empEvents.map(e=>e.client_id).filter(Boolean)).size}</div><div class="stat-label">Clientes Distintos</div></div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);">
            <!-- Upcoming table -->
            <div class="panel">
                <div class="panel-header">
                    <h2>📅 Próximos Eventos</h2>
                    <span style="font-size:0.8rem;color:var(--text-muted);">${upcoming.length} evento(s)</span>
                </div>
                <div class="panel-body no-padding">
                    ${upcoming.length === 0
                        ? '<div style="padding:24px;text-align:center;color:var(--text-muted);">Sin próximos eventos.</div>'
                        : `<table class="data-table">
                            <thead><tr><th>Evento</th><th>Cliente</th><th>Fechas</th><th>Días</th></tr></thead>
                            <tbody>${upcoming.map(e => `<tr>
                                <td>
                                    <div style="font-weight:600;font-size:0.85rem;">${esc(e.name)}</div>
                                    ${e.location ? `<div style="font-size:0.72rem;color:var(--text-muted);">📍 ${esc(e.location)}</div>` : ''}
                                </td>
                                <td>
                                    ${e.client_name ? `<span style="display:inline-flex;align-items:center;gap:5px;"><span style="width:8px;height:8px;border-radius:50%;background:${e.client_color || '#6C5CE7'};"></span>${esc(e.client_name)}</span>` : '—'}
                                    ${e.client_typology ? `<div style="margin-top:2px;">${typologyBadge(e.client_typology)}</div>` : ''}
                                </td>
                                <td style="white-space:nowrap;font-size:0.82rem;">
                                    ${formatDate(e.start_date)}
                                    ${e.start_date !== e.end_date ? `<div style="color:var(--text-muted);">→ ${formatDate(e.end_date)}</div>` : ''}
                                </td>
                                <td style="text-align:center;">${e.duration_days}</td>
                            </tr>`).join('')}
                            </tbody>
                        </table>`
                    }
                </div>
            </div>

            <!-- Timeline by month -->
            <div class="panel">
                <div class="panel-header"><h2>📆 Timeline ${year}</h2></div>
                <div class="panel-body" style="max-height:500px;overflow-y:auto;">
                    ${Object.keys(byMonth).length === 0
                        ? '<p style="color:var(--text-muted);">Sin eventos este año.</p>'
                        : Object.entries(byMonth).sort().map(([ym, evList]) => {
                            const [y2, m2] = ym.split('-');
                            const months = ['', ...Array.from({length:12},(_,i)=>getMonthName(i+1))];
                            return `<div style="margin-bottom:var(--space-lg);">
                                <div style="font-weight:700;font-size:0.8rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid var(--border-color);">${months[parseInt(m2)]} ${y2}</div>
                                ${evList.map(e => {
                                    const evToday = e.start_date <= today && e.end_date >= today;
                                    const isPast = e.end_date < today;
                                    return `<div style="display:flex;gap:10px;margin-bottom:8px;padding:8px;border-radius:var(--radius-sm);background:${evToday ? 'rgba(245,158,11,0.08)' : 'var(--bg-glass)'};">
                                        <div style="width:4px;border-radius:2px;background:${e.client_color || '#6C5CE7'};flex-shrink:0;"></div>
                                        <div style="flex:1;min-width:0;">
                                            <div style="font-weight:600;font-size:0.83rem;${isPast?'opacity:0.6;':''}">${esc(e.name)}</div>
                                            <div style="font-size:0.75rem;color:var(--text-muted);">${formatDate(e.start_date)}${e.start_date!==e.end_date?` → ${formatDate(e.end_date)}`:''} · ${e.duration_days}d</div>
                                            ${e.client_name ? `<div style="font-size:0.72rem;margin-top:2px;">${typologyBadge(e.client_typology||'Otro')} ${esc(e.client_name)}</div>` : ''}
                                        </div>
                                        <div>${eventStatusBadge(e)}</div>
                                    </div>`;
                                }).join('')}
                            </div>`;
                        }).join('')
                    }
                </div>
            </div>
        </div>

        ${past.length > 0 ? `
        <div class="panel" style="margin-top:var(--space-lg);">
            <div class="panel-header"><h2>🗂️ Historial Finalizado</h2><span style="font-size:0.8rem;color:var(--text-muted);">${past.length} evento(s)</span></div>
            <div class="panel-body no-padding">
                <table class="data-table">
                    <thead><tr><th>Evento</th><th>Cliente</th><th>Fechas</th><th>Días</th><th>Estado</th></tr></thead>
                    <tbody>${past.slice().reverse().map(e => `<tr>
                        <td><strong>${esc(e.name)}</strong>${e.location?`<div style="font-size:0.72rem;color:var(--text-muted);">📍 ${esc(e.location)}</div>`:''}</td>
                        <td>${e.client_name?`<span style="display:inline-flex;align-items:center;gap:5px;"><span style="width:8px;height:8px;border-radius:50%;background:${e.client_color};"></span>${esc(e.client_name)}</span>`:'—'}</td>
                        <td style="white-space:nowrap;font-size:0.82rem;">${formatDate(e.start_date)}${e.start_date!==e.end_date?`<div style="color:var(--text-muted);">→ ${formatDate(e.end_date)}</div>`:''}</td>
                        <td style="text-align:center;">${e.duration_days}</td>
                        <td>${eventStatusBadge(e)}</td>
                    </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>` : ''}
    </div>`;
}

function renderEventRow(e, isAdmin) {
    const isDone = (e.status || 'active') === 'done';
    const canToggle = ['admin', 'manager'].includes(State.user.role);
    const mutedStyle = isDone ? 'opacity:0.55;' : '';
    const team = e.assignments.map(a =>
        `<span title="${esc(a.employee_name)}" style="display:inline-block;margin-right:2px;">${renderAvatarEl(a.employee_avatar_color, a.employee_initials, a.employee_avatar_image, 24)}</span>`
    ).join('');
    const clientDot = e.client_color
        ? `<span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${e.client_color};margin-right:5px;"></span>`
        : '';
    const toggleBtn = canToggle
        ? `<button class="btn btn-sm" title="${isDone ? 'Marcar como activo' : 'Marcar como realizado'}"
            onclick="toggleEventStatus(${e.id},'${e.status || 'active'}')"
            style="margin-left:4px;background:${isDone ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.1)'};border:1px solid ${isDone ? 'rgba(16,185,129,0.4)' : 'rgba(99,102,241,0.3)'};color:${isDone ? '#10B981' : 'var(--accent-primary)'};">
            ${isDone ? '↩' : '✅'}
           </button>` : '';
    return `<tr style="${mutedStyle}${isDone ? 'background:rgba(0,0,0,0.03);' : ''}">
        <td><strong>${esc(e.name)}</strong>${e.location ? `<div style="font-size:0.75rem;color:var(--text-muted);">📍 ${esc(e.location)}</div>` : ''}</td>
        <td>${clientDot}${esc(e.client_name || '—')}</td>
        <td>${e.client_typology ? typologyBadge(e.client_typology) : '—'}</td>
        <td style="white-space:nowrap;">${formatDate(e.start_date)}${e.start_date !== e.end_date ? `<br><span style="color:var(--text-muted);font-size:0.75rem;">→ ${formatDate(e.end_date)}</span>` : ''}</td>
        <td style="text-align:center;">${e.duration_days}</td>
        <td>${team || '<span style="color:var(--text-muted);font-size:0.8rem;">Sin asignar</span>'}</td>
        <td>${eventStatusBadge(e)}</td>
        ${isAdmin ? `<td style="white-space:nowrap;">
            <button class="btn btn-secondary btn-sm" onclick="openEditEventModal(${e.id})" title="Editar">✏️</button>
            <button class="btn btn-secondary btn-sm" onclick="openDuplicateEventModal(${e.id})" title="Duplicar" style="margin-left:4px;">📋</button>
            ${toggleBtn}
            <button class="btn btn-danger btn-sm" onclick="deleteEvent(${e.id})" title="Eliminar" style="margin-left:4px;">🗑️</button>
        </td>` : (canToggle ? `<td>${toggleBtn}</td>` : '')}
    </tr>`;
}

window.changeEventsYear = function(y) {
    State.eventsYear = parseInt(y);
    renderPage();
};

window.toggleEventStatus = async function(eventId, currentStatus) {
    const newStatus = currentStatus === 'done' ? 'active' : 'done';
    const res = await api(`/api/events/${eventId}/status`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) });
    if (res.success) {
        const idx = State.events.findIndex(e => e.id === eventId);
        if (idx !== -1) State.events[idx] = res.event;
        renderPage();
    }
};

function eventFormHTML(clients, users, ev) {
    const userChecks = users.map(u => {
        const checked = ev && ev.assignments.some(a => a.user_id === u.id) ? 'checked' : '';
        return `<label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer;">
            <input type="checkbox" class="evt-user-check" value="${u.id}" ${checked}>
            ${renderAvatarEl(u.avatar_color, u.initials, u.avatar_image, 24)}
            <span style="font-size:0.85rem;">${esc(u.full_name)}</span>
        </label>`;
    }).join('');

    return `
        <div class="form-row">
            <div class="form-group" style="flex:2;">
                <label>Nombre del evento *</label>
                <input type="text" class="form-input" id="evtName" value="${ev ? esc(ev.name) : ''}" placeholder="Ej: BigSound Barakaldo 2026">
            </div>
            <div class="form-group" style="flex:1;">
                <label>Cliente</label>
                <select class="form-select" id="evtClient">
                    <option value="">— Sin cliente —</option>
                    ${clients.map(c => `<option value="${c.id}" ${ev && ev.client_id === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}
                </select>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Fecha inicio *</label>
                <input type="date" class="form-input" id="evtStart" value="${ev ? ev.start_date : ''}">
            </div>
            <div class="form-group">
                <label>Fecha fin *</label>
                <input type="date" class="form-input" id="evtEnd" value="${ev ? ev.end_date : ''}">
            </div>
            <div class="form-group" style="flex:2;">
                <label>Ubicación</label>
                <input type="text" class="form-input" id="evtLocation" value="${ev ? esc(ev.location) : ''}" placeholder="Ciudad, recinto...">
            </div>
        </div>
        <div class="form-group">
            <label>Notas</label>
            <textarea class="form-input" id="evtNotes" rows="2" placeholder="Información adicional...">${ev ? esc(ev.notes) : ''}</textarea>
        </div>
        <div class="form-group">
            <label>Equipo asignado</label>
            <div style="max-height:180px;overflow-y:auto;border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:8px 12px;">
                ${userChecks}
            </div>
        </div>`;
}

window.openCreateEventModal = function() {
    const clients = window._eventClients || [];
    const users = window._eventUsers || [];
    openModal(`
    <div class="modal" style="max-width:640px;">
        <div class="modal-header">
            <h3>🎯 Nuevo Evento</h3>
            <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">${eventFormHTML(clients, users, null)}</div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="submitCreateEvent()">Crear Evento</button>
        </div>
    </div>`);
};

window.submitCreateEvent = async function() {
    const name = document.getElementById('evtName').value.trim();
    const client_id = parseInt(document.getElementById('evtClient').value) || null;
    const start_date = document.getElementById('evtStart').value;
    const end_date = document.getElementById('evtEnd').value;
    const location = document.getElementById('evtLocation').value;
    const notes = document.getElementById('evtNotes').value;
    const user_ids = [...document.querySelectorAll('.evt-user-check:checked')].map(c => parseInt(c.value));

    if (!name) { showToast('El nombre es obligatorio', 'error'); return; }
    if (!start_date || !end_date) { showToast('Las fechas son obligatorias', 'error'); return; }
    try {
        await api('/api/events', { method: 'POST', body: JSON.stringify({ name, client_id, start_date, end_date, location, notes, user_ids }) });
        closeModal();
        showToast('Evento creado', 'success');
        renderPage();
    } catch (err) { showToast(err.message, 'error'); }
};

window.openEditEventModal = function(id) {
    const ev = State.events.find(e => e.id === id);
    if (!ev) return;
    const clients = window._eventClients || [];
    const users = window._eventUsers || [];
    openModal(`
    <div class="modal" style="max-width:640px;">
        <div class="modal-header">
            <h3>✏️ Editar Evento — ${esc(ev.name)}</h3>
            <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">${eventFormHTML(clients, users, ev)}</div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="submitEditEvent(${id})">Guardar Cambios</button>
        </div>
    </div>`);
};

window.submitEditEvent = async function(id) {
    const name = document.getElementById('evtName').value.trim();
    const client_id = parseInt(document.getElementById('evtClient').value) || null;
    const start_date = document.getElementById('evtStart').value;
    const end_date = document.getElementById('evtEnd').value;
    const location = document.getElementById('evtLocation').value;
    const notes = document.getElementById('evtNotes').value;
    const user_ids = [...document.querySelectorAll('.evt-user-check:checked')].map(c => parseInt(c.value));

    if (!name || !start_date || !end_date) { showToast('Rellena los campos obligatorios', 'error'); return; }
    try {
        await api(`/api/events/${id}`, { method: 'PUT', body: JSON.stringify({ name, client_id, start_date, end_date, location, notes, user_ids }) });
        closeModal();
        showToast('Evento actualizado', 'success');
        renderPage();
    } catch (err) { showToast(err.message, 'error'); }
};

window.openDuplicateEventModal = function(id) {
    const ev = State.events.find(e => e.id === id);
    if (!ev) return;
    const clients = window._eventClients || [];
    const users = window._eventUsers || [];
    // Pre-fill with original data but suggest a copy name
    const copyName = `${ev.name} (copia)`;
    const evCopy = { ...ev, name: copyName };
    openModal(`
    <div class="modal" style="max-width:640px;">
        <div class="modal-header">
            <h3>📋 Duplicar Evento — ${esc(ev.name)}</h3>
            <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">
            <div style="padding:8px 12px;margin-bottom:12px;background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);border-radius:var(--radius-sm);font-size:0.82rem;color:var(--text-muted);">
                📋 Modifica el nombre, fechas y equipo del nuevo evento. Se creará como una copia independiente.
            </div>
            ${eventFormHTML(clients, users, evCopy)}
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="submitDuplicateEvent()">📋 Crear Evento</button>
        </div>
    </div>`);
};

window.submitDuplicateEvent = async function() {
    const name = document.getElementById('evtName').value.trim();
    const client_id = parseInt(document.getElementById('evtClient').value) || null;
    const start_date = document.getElementById('evtStart').value;
    const end_date = document.getElementById('evtEnd').value;
    const location = document.getElementById('evtLocation').value;
    const notes = document.getElementById('evtNotes').value;
    const user_ids = [...document.querySelectorAll('.evt-user-check:checked')].map(c => parseInt(c.value));
    if (!name || !start_date || !end_date) { showToast('Rellena los campos obligatorios', 'error'); return; }
    try {
        await api('/api/events', { method: 'POST', body: JSON.stringify({ name, client_id, start_date, end_date, location, notes, user_ids }) });
        closeModal();
        showToast('Evento duplicado correctamente', 'success');
        renderPage();
    } catch (err) { showToast(err.message, 'error'); }
};

window.deleteEvent = async function(id) {
    if (!confirm('¿Eliminar este evento?')) return;
    try {
        await api(`/api/events/${id}`, { method: 'DELETE' });
        showToast('Evento eliminado', 'success');
        renderPage();
    } catch (err) { showToast(err.message, 'error'); }
};

// ─────────────────────────────────────────────
// Events Calendar Page
// ─────────────────────────────────────────────

async function loadEventsCalendar(container) {
    const isAdmin = State.user.role === 'admin';
    const canEdit = true;
    const calYear = State.eventsYear;
    const month   = State.eventsCalMonth;

    const [allEvents, clients, allUsers] = await Promise.all([
        api(`/api/events?year=${calYear}`),
        api('/api/clients'),
        api('/api/users'),
    ]);
    State.events  = allEvents;
    State.clients = clients;
    window._eventClients = clients;
    window._eventUsers   = allUsers;

    const filtered = applyEventsFilters(allEvents);

    const MONTHS    = Array.from({length:12},(_,i)=>getMonthName(i+1));
    const today     = new Date();
    const todayStr  = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

    const firstDay      = new Date(calYear, month - 1, 1);
    const lastDay       = new Date(calYear, month, 0);
    const startWeekday  = (firstDay.getDay() + 6) % 7;  // Mon = 0
    const totalDays     = lastDay.getDate();
    const totalWeeks    = Math.ceil((startWeekday + totalDays) / 7);
    const monthStartStr = `${calYear}-${String(month).padStart(2,'0')}-01`;
    const monthEndStr   = `${calYear}-${String(month).padStart(2,'0')}-${String(totalDays).padStart(2,'0')}`;
    const monthEvents   = filtered.filter(e => e.start_date <= monthEndStr && e.end_date >= monthStartStr);

    function parseLocalDate(s) {
        const [y, m, d] = s.split('-').map(Number);
        return new Date(y, m - 1, d);
    }
    function daysBetween(a, b) {
        return Math.round((parseLocalDate(b) - parseLocalDate(a)) / 86400000);
    }
    function toDateStr(dt) {
        return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
    }

    const gridStart  = new Date(calYear, month - 1, 1 - startWeekday);
    const BAR_H      = 22;
    const BAR_GAP    = 4;
    const DAY_H      = 30;
    const PAD_TOP    = 4;
    const PAD_BOTTOM = 8;

    let weeksHTML = '';

    for (let w = 0; w < totalWeeks; w++) {
        const weekDays = Array.from({ length: 7 }, (_, d) => {
            const dt = new Date(gridStart);
            dt.setDate(gridStart.getDate() + w * 7 + d);
            return dt;
        });
        const weekStartStr = toDateStr(weekDays[0]);
        const weekEndStr   = toDateStr(weekDays[6]);

        // Events overlapping this week — longer/earlier first for better row packing
        const weekEvts = monthEvents
            .filter(e => e.start_date <= weekEndStr && e.end_date >= weekStartStr)
            .sort((a, b) => {
                const sc = a.start_date.localeCompare(b.start_date);
                return sc !== 0 ? sc : b.end_date.localeCompare(a.end_date);
            });

        // Greedy row assignment: no two bars share a column in the same row
        const rowEndCol = [];
        const bars = weekEvts.map(e => {
            const sc = Math.max(0, daysBetween(weekStartStr, e.start_date));
            const ec = Math.min(6, daysBetween(weekStartStr, e.end_date));
            let row = 0;
            while (rowEndCol[row] !== undefined && rowEndCol[row] >= sc) row++;
            rowEndCol[row] = ec;
            return {
                e, sc, ec, row,
                isStart: e.start_date >= weekStartStr,
                isEnd:   e.end_date   <= weekEndStr,
                color:   e.client_color || '#6C5CE7',
            };
        });

        const numRows = bars.length > 0 ? Math.max(...bars.map(b => b.row)) + 1 : 0;
        const weekH   = DAY_H + PAD_TOP + numRows * (BAR_H + BAR_GAP) + PAD_BOTTOM;

        const dayNums = weekDays.map(dt => {
            const dStr    = toDateStr(dt);
            const inMonth = dt.getMonth() === month - 1 && dt.getFullYear() === calYear;
            const isToday = dStr === todayStr;
            const cls     = `evt-day-num${inMonth ? '' : ' out-month'}`;
            return isToday
                ? `<div class="${cls}"><span class="evt-today-dot">${dt.getDate()}</span></div>`
                : `<div class="${cls}">${dt.getDate()}</div>`;
        }).join('');

        const barEls = bars.map(({ e, sc, ec, row, isStart, isEnd, color }) => {
            const left  = (sc / 7 * 100).toFixed(3);
            const width = ((ec - sc + 1) / 7 * 100).toFixed(3);
            const top   = DAY_H + PAD_TOP + row * (BAR_H + BAR_GAP);
            const br    = `${isStart?'5px':'2px'} ${isEnd?'5px':'2px'} ${isEnd?'5px':'2px'} ${isStart?'5px':'2px'}`;
            const bleft = !isStart ? 'border-left:2px dashed rgba(255,255,255,0.4);' : '';
            const bright= !isEnd   ? 'border-right:2px dashed rgba(255,255,255,0.4);' : '';
            const names = (e.assignments||[]).map(a=>a.employee_name||'').filter(Boolean);
            const tip   = `${e.name}${e.location?' · '+e.location:''}${names.length?' · '+names.join(', '):''}${(e.status||'active')==='done'?' ✅ Realizado':''}`;
            const label = names.length ? `${e.name} · ${names.join(', ')}` : e.name;
            const doneStyle = (e.status||'active')==='done' ? 'opacity:0.5;filter:grayscale(0.4);' : '';
            const doneLabel = (e.status||'active')==='done' ? '✅ ' : '';
            return `<div class="evt-bar" onclick="openEventDetailModal(${e.id})" style="left:${left}%;width:${width}%;top:${top}px;height:${BAR_H}px;background:${color};border-radius:${br};${bleft}${bright};cursor:pointer;${doneStyle}" title="${esc(tip)}">${isStart?`<span class="evt-bar-label">${doneLabel}${esc(label)}</span>`:''}</div>`;
        }).join('');

        weeksHTML += `<div class="evt-cal-week" style="height:${weekH}px;"><div class="evt-day-nums">${dayNums}</div>${barEls}</div>`;
    }

    const view = State.eventsCalView || 'monthly';
    const viewLabels = { monthly: State.lang === 'en' ? 'Monthly' : State.lang === 'ca' ? 'Mensual' : 'Mensual',
                         quarterly: State.lang === 'en' ? 'Quarterly' : State.lang === 'ca' ? 'Trimestral' : 'Trimestral',
                         annual: State.lang === 'en' ? 'Annual' : State.lang === 'ca' ? 'Anual' : 'Anual' };
    const navPrev = State.lang === 'en' ? '← Prev' : '← Anterior';
    const navNext = State.lang === 'en' ? 'Next →' : State.lang === 'ca' ? 'Seg →' : 'Siguiente →';
    const legendLabel = State.lang === 'en' ? 'Legend' : State.lang === 'ca' ? 'Llegenda' : 'Leyenda';

    let mainContent = '';
    let periodLabel = '';

    if (view === 'annual') {
        periodLabel = `${calYear}`;
        mainContent = renderEventsAnnualView(calYear, filtered, MONTHS);
    } else if (view === 'quarterly') {
        const qStart = Math.floor((month - 1) / 3) * 3 + 1;
        periodLabel = `Q${Math.ceil(month/3)} ${calYear}: ${MONTHS[qStart-1]} – ${MONTHS[qStart+1]}`;
        mainContent = [qStart, qStart+1, qStart+2].map(m => {
            const mEvents = filtered.filter(e => {
                const ms = `${calYear}-${String(m).padStart(2,'0')}-01`;
                const ld = new Date(calYear, m, 0).getDate();
                const me = `${calYear}-${String(m).padStart(2,'0')}-${String(ld).padStart(2,'0')}`;
                return e.start_date <= me && e.end_date >= ms;
            });
            return `<div style="flex:1;min-width:0;">
                <div style="font-weight:700;text-align:center;padding:8px 0;font-size:.9rem;">${MONTHS[m-1]}</div>
                ${renderEventsMonthGrid(calYear, m, mEvents, todayStr, true, null, true)}
            </div>`;
        }).join('');
        mainContent = `<div style="display:flex;gap:12px;overflow-x:auto;">${mainContent}</div>`;
    } else {
        periodLabel = `${MONTHS[month-1]} ${calYear} · ${monthEvents.length} evento${monthEvents.length !== 1 ? 's' : ''}`;
        mainContent = renderEventsMonthGrid(calYear, month, monthEvents, todayStr, false, weeksHTML);
    }

    container.innerHTML = `
    <div class="page-enter">
        <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start;">
            <div>
                <h1>📆 ${State.lang === 'en' ? 'Events Calendar' : State.lang === 'ca' ? 'Calendari Esdeveniments' : 'Calendario de Eventos'}</h1>
                <p>${periodLabel}</p>
            </div>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
                <div style="display:flex;border:1px solid var(--border);border-radius:8px;overflow:hidden;">
                    ${['monthly','quarterly','annual'].map(v=>`<button onclick="setEventsCalView('${v}')" style="padding:6px 14px;border:none;cursor:pointer;font-size:.82rem;font-weight:600;background:${view===v?'var(--primary)':'var(--surface)'};color:${view===v?'#fff':'var(--text-secondary)'};">${viewLabels[v]}</button>`).join('')}
                </div>
                <button class="btn btn-secondary" onclick="exportEventsCalendarCSV()">⬇ CSV</button>
                <button class="btn btn-secondary" onclick="exportEventsPDF()">⬇ PDF</button>
                ${canEdit ? `<button class="btn btn-primary" onclick="openCreateEventModal()">＋ Nuevo Evento</button>` : ''}
            </div>
        </div>

        ${eventsFilterBar(clients, allUsers)}

        <div class="panel">
            ${view !== 'annual' ? `
            <div class="panel-header" style="display:flex;justify-content:space-between;align-items:center;">
                <button class="btn btn-secondary btn-sm" onclick="changeEventsCalMonth(${view==='quarterly'?-3:-1})">${navPrev}</button>
                <h2 style="margin:0;font-size:1rem;">${MONTHS[month-1]} ${calYear}</h2>
                <button class="btn btn-secondary btn-sm" onclick="changeEventsCalMonth(${view==='quarterly'?3:1})">${navNext}</button>
            </div>` : ''}
            <div class="panel-body no-padding" style="padding:0 8px 8px;">
                ${mainContent}
            </div>
        </div>

        ${clients.length > 0 ? `
        <div class="panel">
            <div class="panel-header"><h2>${legendLabel}</h2></div>
            <div class="panel-body" style="display:flex;flex-wrap:wrap;gap:14px;">
                ${clients.map(c=>`
                    <div style="display:flex;align-items:center;gap:8px;">
                        <div style="width:18px;height:10px;border-radius:3px;background:${c.color};"></div>
                        <span style="font-size:0.83rem;font-weight:500;">${esc(c.name)}</span>
                        ${typologyBadge(c.typology)}
                    </div>`).join('')}
            </div>
        </div>` : ''}
    </div>`;
}

window.changeEventsCalMonth = function(delta) {
    State.eventsCalMonth += delta;
    if (State.eventsCalMonth > 12) { State.eventsCalMonth = 1;  State.eventsYear++; }
    if (State.eventsCalMonth < 1)  { State.eventsCalMonth = 12; State.eventsYear--; }
    renderPage();
};

window.setEventsCalView = function(view) {
    State.eventsCalView = view;
    if (view === 'annual') {
        // For annual view, load all events for the year
        api(`/api/events?year=${State.eventsYear}`).then(events => {
            State.events = events;
            renderPage();
        });
    } else {
        renderPage();
    }
};

function renderEventsMonthGrid(calYear, month, monthEvents, todayStr, compact, prebuiltWeeksHTML, showLabel) {
    const BAR_H = compact ? (showLabel ? 18 : 16) : 22;
    const BAR_GAP = compact ? 2 : 4;
    const DAY_H = compact ? 22 : 30;
    const PAD_TOP = 4;
    const PAD_BOTTOM = compact ? 4 : 8;

    if (prebuiltWeeksHTML) {
        const dayNames = State.lang === 'en'
            ? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
            : State.lang === 'ca'
            ? ['Dl','Dt','Dc','Dj','Dv','Ds','Dg']
            : ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
        return `<div class="evt-cal-wrapper">
            <div class="evt-cal-header">${dayNames.map(d=>`<div class="evt-cal-head-cell">${d}</div>`).join('')}</div>
            ${prebuiltWeeksHTML}
        </div>`;
    }

    // Compact month grid (for quarterly/annual)
    const firstDay = new Date(calYear, month - 1, 1);
    const lastDay = new Date(calYear, month, 0);
    const startWeekday = (firstDay.getDay() + 6) % 7;
    const totalDays = lastDay.getDate();
    const totalWeeks = Math.ceil((startWeekday + totalDays) / 7);
    const gridStart = new Date(calYear, month - 1, 1 - startWeekday);

    function parseLocalDate(s) { const [y,m,d]=s.split('-').map(Number); return new Date(y,m-1,d); }
    function daysBetween(a,b) { return Math.round((parseLocalDate(b)-parseLocalDate(a))/86400000); }
    function toDateStr(dt) { return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`; }

    let weeksHTML = '';
    for (let w = 0; w < totalWeeks; w++) {
        const weekDays = Array.from({length:7}, (_,d) => {
            const dt = new Date(gridStart); dt.setDate(gridStart.getDate() + w*7+d); return dt;
        });
        const weekStartStr = toDateStr(weekDays[0]);
        const weekEndStr = toDateStr(weekDays[6]);
        const weekEvts = monthEvents
            .filter(e => e.start_date <= weekEndStr && e.end_date >= weekStartStr)
            .sort((a,b) => { const sc=a.start_date.localeCompare(b.start_date); return sc!==0?sc:b.end_date.localeCompare(a.end_date); });
        const rowEndCol = [];
        const bars = weekEvts.map(e => {
            const sc=Math.max(0,daysBetween(weekStartStr,e.start_date));
            const ec=Math.min(6,daysBetween(weekStartStr,e.end_date));
            let row=0; while(rowEndCol[row]!==undefined&&rowEndCol[row]>=sc) row++;
            rowEndCol[row]=ec;
            return {e,sc,ec,row,isStart:e.start_date>=weekStartStr,isEnd:e.end_date<=weekEndStr,color:e.client_color||'#6C5CE7'};
        });
        const numRows = bars.length>0?Math.max(...bars.map(b=>b.row))+1:0;
        const weekH = DAY_H+PAD_TOP+numRows*(BAR_H+BAR_GAP)+PAD_BOTTOM;
        const dayNums = weekDays.map(dt => {
            const dStr=toDateStr(dt);
            const inMonth=dt.getMonth()===month-1&&dt.getFullYear()===calYear;
            const isToday=dStr===todayStr;
            const cls=`evt-day-num${inMonth?'':' out-month'}${compact?' compact-day':''}`;
            return isToday?`<div class="${cls}"><span class="evt-today-dot">${dt.getDate()}</span></div>`:`<div class="${cls}">${dt.getDate()}</div>`;
        }).join('');
        const barEls = bars.map(({e,sc,ec,row,isStart,isEnd,color})=>{
            const left=(sc/7*100).toFixed(3);
            const width=((ec-sc+1)/7*100).toFixed(3);
            const top=DAY_H+PAD_TOP+row*(BAR_H+BAR_GAP);
            const br=`${isStart?'4px':'2px'} ${isEnd?'4px':'2px'} ${isEnd?'4px':'2px'} ${isStart?'4px':'2px'}`;
            const bleft=!isStart?'border-left:2px dashed rgba(255,255,255,0.4);':'';
            const bright=!isEnd?'border-right:2px dashed rgba(255,255,255,0.4);':'';
            const doneStyle2 = (e.status||'active')==='done' ? 'opacity:0.5;filter:grayscale(0.4);' : '';
            const displayName = compact ? (e.client_name || e.name) : e.name;
            const donePrefix = (e.status||'active')==='done' ? '✅ ' : '';
            const labelStr = `${donePrefix}${esc(displayName)}`;
            const showBarLabel = isStart && (!compact || showLabel);
            const labelFontSize = compact ? '.6rem' : '.7rem';
            return `<div class="evt-bar" onclick="openEventDetailModal(${e.id})" style="left:${left}%;width:${width}%;top:${top}px;height:${BAR_H}px;background:${color};border-radius:${br};${bleft}${bright};cursor:pointer;${doneStyle2};overflow:hidden;" title="${esc(e.name)}${e.client_name?' · '+esc(e.client_name):''}${(e.status||'active')==='done'?' ✅':''}">${showBarLabel?`<span class="evt-bar-label" style="font-size:${labelFontSize};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:${BAR_H}px;">${labelStr}</span>`:''}</div>`;
        }).join('');
        weeksHTML += `<div class="evt-cal-week" style="height:${weekH}px;"><div class="evt-day-nums">${dayNums}</div>${barEls}</div>`;
    }
    const dayNames = State.lang === 'en' ? ['M','T','W','T','F','S','S'] : State.lang === 'ca' ? ['Dl','Dt','Dc','Dj','Dv','Ds','Dg'] : ['L','M','X','J','V','S','D'];
    return `<div class="evt-cal-wrapper" style="${compact?'font-size:.78rem;':''}">
        <div class="evt-cal-header">${dayNames.map(d=>`<div class="evt-cal-head-cell">${d}</div>`).join('')}</div>
        ${weeksHTML}
    </div>`;
}

function renderEventsAnnualView(calYear, filtered, MONTHS) {
    const todayStr = new Date().toISOString().split('T')[0];
    return `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:8px;">
        ${Array.from({length:12},(_,i)=>{
            const m = i+1;
            const ms=`${calYear}-${String(m).padStart(2,'0')}-01`;
            const ld=new Date(calYear,m,0).getDate();
            const me=`${calYear}-${String(m).padStart(2,'0')}-${String(ld).padStart(2,'0')}`;
            const mEvts=filtered.filter(e=>e.start_date<=me&&e.end_date>=ms);
            return `<div style="background:var(--bg-glass);border:1px solid var(--border);border-radius:10px;overflow:hidden;">
                <div style="font-weight:700;text-align:center;padding:8px 0 4px;font-size:.9rem;color:var(--text-primary);">${MONTHS[i]}</div>
                ${renderEventsMonthGrid(calYear, m, mEvts, todayStr, true, null, true)}
            </div>`;
        }).join('')}
    </div>`;
}

window.openEventDetailModal = async function(eventId) {
    // Find event from current state or fetch
    let ev = (State.events||[]).find(e=>e.id===eventId);
    if (!ev) {
        try { const data = await api(`/api/events?year=${State.eventsYear}`); ev = data.find(e=>e.id===eventId); } catch(e){ return; }
    }
    if (!ev) return;
    const canEdit = true;
    const canToggle = ['admin', 'manager'].includes(State.user.role);
    const isDone = (ev.status || 'active') === 'done';
    const fmt = s => s ? formatDate(s) : '—';
    const team = (ev.assignments||[]).map(a=>`
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            ${renderAvatarEl(a.employee_avatar_color, a.employee_initials, a.employee_avatar_image, 28)}
            <span style="font-size:.85rem;">${esc(a.employee_name||'')}</span>
        </div>`).join('') || `<span style="color:var(--text-muted);font-size:.85rem;">${State.lang==='en'?'No team assigned':State.lang==='ca'?"Sense equip assignat":'Sin equipo asignado'}</span>`;
    const dLabel = State.lang==='en'?'Days':State.lang==='ca'?'Dies':'Días';
    const teLabel = State.lang==='en'?'Team':State.lang==='ca'?'Equip':'Equipo';
    const editLabel = State.lang==='en'?'Edit event':State.lang==='ca'?"Editar event":'Editar evento';
    const toggleLabel = isDone
        ? (State.lang==='en'?'Mark as active':State.lang==='ca'?'Marcar com actiu':'Marcar como activo')
        : (State.lang==='en'?'Mark as done':State.lang==='ca'?'Marcar com realitzat':'Marcar como realizado');
    openModal(`
    <div class="modal" style="max-width:480px;">
        <div class="modal-header" style="border-left:4px solid ${ev.client_color||'#6C5CE7'};padding-left:12px;">
            <div>
                <h3 style="margin:0;${isDone?'opacity:0.7;':''}">${isDone?'✅ ':''}${esc(ev.name)}</h3>
                ${ev.client_name?`<div style="font-size:.82rem;color:var(--text-muted);margin-top:2px;">${esc(ev.client_name)} ${typologyBadge(ev.client_typology||'')}</div>`:''}
                <div style="margin-top:6px;">${eventStatusBadge(ev)}</div>
            </div>
            <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body" style="display:flex;flex-direction:column;gap:14px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                <div style="background:var(--bg-glass);border-radius:8px;padding:12px;">
                    <div style="font-size:.75rem;color:var(--text-muted);margin-bottom:2px;">📅 ${State.lang==='en'?'Dates':State.lang==='ca'?'Dates':'Fechas'}</div>
                    <div style="font-weight:600;font-size:.88rem;">${fmt(ev.start_date)}</div>
                    <div style="font-size:.8rem;color:var(--text-muted);">→ ${fmt(ev.end_date)}</div>
                </div>
                <div style="background:var(--bg-glass);border-radius:8px;padding:12px;">
                    <div style="font-size:.75rem;color:var(--text-muted);margin-bottom:2px;">📊 ${dLabel}</div>
                    <div style="font-weight:700;font-size:1.4rem;color:var(--primary);">${ev.duration_days||'—'}</div>
                </div>
            </div>
            ${ev.location?`<div style="font-size:.85rem;">📍 ${esc(ev.location)}</div>`:''}
            ${ev.notes?`<div style="font-size:.85rem;color:var(--text-muted);border-left:3px solid var(--border);padding-left:10px;">${esc(ev.notes)}</div>`:''}
            <div>
                <div style="font-size:.75rem;color:var(--text-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em;">👥 ${teLabel}</div>
                ${team}
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button>
            ${canToggle ? `<button class="btn btn-sm" onclick="closeModal();toggleEventStatus(${ev.id},'${ev.status||'active'}')"
                style="background:${isDone?'rgba(99,102,241,0.1)':'rgba(16,185,129,0.12)'};border:1px solid ${isDone?'rgba(99,102,241,0.3)':'rgba(16,185,129,0.3)'};color:${isDone?'var(--accent-primary)':'#10B981'};">
                ${isDone ? '↩' : '✅'} ${toggleLabel}
            </button>` : ''}
            ${canEdit ? `<button class="btn btn-primary" onclick="closeModal();openEditEventModal(${ev.id})">✏️ ${editLabel}</button>` : ''}
        </div>
    </div>`);
};

// ─────────────────────────────────────────────
// Clients Config Page
// ─────────────────────────────────────────────

async function loadClientsConfig(container) {
    const isAdmin = State.user.role === 'admin';
    const canEdit = true;
    const [clients, allEvents, allUsers] = await Promise.all([
        api('/api/clients'),
        api(`/api/events?year=${State.eventsYear}`),
        api('/api/users'),
    ]);
    State.clients   = clients;
    State.events    = allEvents;
    State.users     = allUsers;
    window._eventClients = clients;
    window._eventUsers   = allUsers;

    // ── Client Detail View ──
    if (State.selectedClientId) {
        const client = clients.find(c => c.id === State.selectedClientId);
        if (!client) { State.selectedClientId = null; renderPage(); return; }
        const clientEvents = allEvents
            .filter(e => e.client_id === client.id)
            .sort((a,b) => a.start_date.localeCompare(b.start_date));
        const todayStr = new Date().toISOString().split('T')[0];
        const past     = clientEvents.filter(e => e.end_date < todayStr);
        const upcoming = clientEvents.filter(e => e.end_date >= todayStr);
        const total    = clientEvents.length;
        const donePct  = total > 0 ? Math.round(past.length / total * 100) : 0;
        const pendPct  = 100 - donePct;

        // Collect all unique employees across events
        const empMap = {};
        for (const e of clientEvents) {
            for (const a of (e.assignments||[])) {
                if (!empMap[a.user_id]) empMap[a.user_id] = { name: a.employee_name, initials: a.employee_initials, color: a.employee_avatar_color, avatar: a.employee_avatar_image, count: 0, days: 0 };
                empMap[a.user_id].count++;
                empMap[a.user_id].days += e.duration_days;
            }
        }
        const employees = Object.values(empMap).sort((a,b) => b.days - a.days);

        container.innerHTML = `
        <div class="page-enter">
            <button class="btn btn-secondary btn-sm" style="margin-bottom:var(--space-lg);" onclick="State.selectedClientId=null;renderPage();">← Volver a Clientes</button>

            <!-- Client header -->
            <div style="display:flex;align-items:center;gap:16px;margin-bottom:var(--space-xl);">
                <div style="width:56px;height:56px;border-radius:var(--radius-md);background:${client.color};display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;overflow:hidden;">
                    ${client.logo_data
                        ? `<img src="${client.logo_data}" style="width:100%;height:100%;object-fit:contain;" alt="${esc(client.name)}">`
                        : '🏢'}
                </div>
                <div style="flex:1;">
                    <h1 style="margin:0;">${esc(client.name)}</h1>
                    <div style="display:flex;align-items:center;gap:10px;margin-top:4px;">
                        ${typologyBadge(client.typology)}
                        ${client.notes ? `<span style="font-size:0.82rem;color:var(--text-muted);">${esc(client.notes)}</span>` : ''}
                    </div>
                </div>
                ${canEdit ? `<div style="display:flex;gap:6px;">
                    <button class="btn btn-secondary btn-sm" onclick="openEditClientModal(${client.id})">✏️ ${State.lang==='en'?'Edit':State.lang==='ca'?'Editar':'Editar'}</button>
                    <button class="btn btn-primary" onclick="openCreateEventModal()">＋ ${State.lang==='en'?'New Event':State.lang==='ca'?'Nou Esdeveniment':'Nuevo Evento'}</button>
                </div>` : ''}
            </div>

            <!-- Stats -->
            <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:var(--space-xl);">
                <div class="stat-card info"><div class="stat-icon">📅</div><div class="stat-value">${total}</div><div class="stat-label">Total Eventos</div></div>
                <div class="stat-card success"><div class="stat-icon">✅</div><div class="stat-value">${past.length}</div><div class="stat-label">Realizados</div></div>
                <div class="stat-card warning"><div class="stat-icon">⏳</div><div class="stat-value">${upcoming.length}</div><div class="stat-label">Próximos</div></div>
                <div class="stat-card"><div class="stat-icon">👥</div><div class="stat-value">${employees.length}</div><div class="stat-label">Empleados</div></div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg);">
                <!-- Progress chart -->
                <div class="panel">
                    <div class="panel-header"><h2>Progreso de Eventos</h2></div>
                    <div class="panel-body" style="display:flex;align-items:center;gap:24px;">
                        <div style="position:relative;width:100px;height:100px;flex-shrink:0;">
                            <svg viewBox="0 0 36 36" style="transform:rotate(-90deg);width:100px;height:100px;">
                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--border-color)" stroke-width="3.5"/>
                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="${client.color}" stroke-width="3.5"
                                    stroke-dasharray="${donePct} ${100-donePct}" stroke-linecap="round"/>
                            </svg>
                            <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                                <span style="font-size:1.2rem;font-weight:800;">${donePct}%</span>
                                <span style="font-size:0.6rem;color:var(--text-muted);">hecho</span>
                            </div>
                        </div>
                        <div style="flex:1;">
                            <div style="margin-bottom:10px;">
                                <div style="display:flex;justify-content:space-between;font-size:0.82rem;margin-bottom:4px;">
                                    <span>Realizados</span><span style="font-weight:700;color:${client.color};">${past.length}</span>
                                </div>
                                <div style="height:8px;background:var(--border-color);border-radius:4px;overflow:hidden;">
                                    <div style="height:100%;width:${donePct}%;background:${client.color};border-radius:4px;transition:width 0.5s;"></div>
                                </div>
                            </div>
                            <div>
                                <div style="display:flex;justify-content:space-between;font-size:0.82rem;margin-bottom:4px;">
                                    <span>Próximos</span><span style="font-weight:700;color:var(--text-muted);">${upcoming.length}</span>
                                </div>
                                <div style="height:8px;background:var(--border-color);border-radius:4px;overflow:hidden;">
                                    <div style="height:100%;width:${pendPct}%;background:var(--text-muted);opacity:0.4;border-radius:4px;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Employees -->
                <div class="panel">
                    <div class="panel-header"><h2>Equipo asignado</h2></div>
                    <div class="panel-body" style="max-height:220px;overflow-y:auto;">
                        ${employees.length === 0 ? '<p style="color:var(--text-muted);font-size:0.85rem;">Sin empleados asignados</p>' :
                          employees.map(emp => `
                          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
                              ${renderAvatarEl(emp.color, emp.initials, emp.avatar, 32)}
                              <div style="flex:1;"><div style="font-size:0.85rem;font-weight:600;">${esc(emp.name)}</div>
                              <div style="font-size:0.75rem;color:var(--text-muted);">${emp.count} evento(s) · ${emp.days} día(s)</div></div>
                          </div>`).join('')}
                    </div>
                </div>
            </div>

            <!-- Upcoming events -->
            ${upcoming.length > 0 ? `
            <div class="panel" style="margin-bottom:var(--space-lg);">
                <div class="panel-header" style="justify-content:space-between;">
                    <h2>⏳ Próximos eventos</h2>
                    <button class="btn btn-secondary btn-sm" onclick="exportClientEventsCSV(${client.id})">⬇ Exportar CSV</button>
                </div>
                <div class="panel-body no-padding"><table class="data-table">
                    <thead><tr><th>Evento</th><th>Inicio</th><th>Fin</th><th>Días</th><th>Responsable(s)</th>${isAdmin ? '<th></th>' : ''}</tr></thead>
                    <tbody>${upcoming.map(e => `
                        <tr>
                            <td style="font-weight:600;">${esc(e.name)}${e.location ? `<div style="font-size:0.75rem;color:var(--text-muted);">📍 ${esc(e.location)}</div>` : ''}</td>
                            <td>${formatDate(e.start_date)}</td><td>${formatDate(e.end_date)}</td>
                            <td>${e.duration_days}</td>
                            <td>${(e.assignments||[]).map(a=>`<span title="${esc(a.employee_name)}">${renderAvatarEl(a.employee_avatar_color,a.employee_initials,a.employee_avatar_image,22)}</span>`).join(' ')} ${(e.assignments||[]).map(a=>esc(a.employee_name)).join(', ')}</td>
                            ${isAdmin ? `<td style="white-space:nowrap;">
                                <button class="btn btn-secondary btn-sm" onclick="openEditEventModal(${e.id})" title="Editar">✏️</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteEvent(${e.id})" title="Eliminar" style="margin-left:4px;">🗑️</button>
                            </td>` : ''}
                        </tr>`).join('')}
                    </tbody>
                </table></div>
            </div>` : ''}

            <!-- Past events -->
            <div class="panel">
                <div class="panel-header" style="justify-content:space-between;">
                    <h2>✅ Historial de eventos</h2>
                    ${past.length > 0 ? `<button class="btn btn-secondary btn-sm" onclick="exportClientEventsCSV(${client.id})">⬇ Exportar CSV</button>` : ''}
                </div>
                <div class="panel-body no-padding">
                ${past.length === 0 ? '<div style="padding:var(--space-lg);text-align:center;color:var(--text-muted);">Sin eventos realizados aún</div>' :
                `<table class="data-table">
                    <thead><tr><th>Evento</th><th>Inicio</th><th>Fin</th><th>Días</th><th>Responsable(s)</th>${isAdmin ? '<th></th>' : ''}</tr></thead>
                    <tbody>${past.map(e => `
                        <tr style="opacity:0.7;">
                            <td style="font-weight:600;">${esc(e.name)}${e.location ? `<div style="font-size:0.75rem;color:var(--text-muted);">📍 ${esc(e.location)}</div>` : ''}</td>
                            <td>${formatDate(e.start_date)}</td><td>${formatDate(e.end_date)}</td>
                            <td>${e.duration_days}</td>
                            <td>${(e.assignments||[]).map(a=>esc(a.employee_name)).join(', ')}</td>
                            ${isAdmin ? `<td style="white-space:nowrap;">
                                <button class="btn btn-secondary btn-sm" onclick="openEditEventModal(${e.id})" title="Editar">✏️</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteEvent(${e.id})" title="Eliminar" style="margin-left:4px;">🗑️</button>
                            </td>` : ''}
                        </tr>`).join('')}
                    </tbody>
                </table>`}
                </div>
            </div>
        </div>`;
        return;
    }

    // ── Client List View ──
    const byTypology = {};
    for (const c of clients) {
        if (!byTypology[c.typology]) byTypology[c.typology] = [];
        byTypology[c.typology].push(c);
    }

    const clView = State.clientsListView;
    const clViewToggle = `<div style="display:flex;border:1px solid var(--border);border-radius:8px;overflow:hidden;">
        <button onclick="setClientsListView('cards')" style="padding:6px 12px;border:none;cursor:pointer;font-size:.82rem;background:${clView==='cards'?'var(--primary)':'var(--surface)'};color:${clView==='cards'?'#fff':'var(--text-secondary)'};">⊞ Tarjetas</button>
        <button onclick="setClientsListView('table')" style="padding:6px 12px;border:none;cursor:pointer;font-size:.82rem;background:${clView==='table'?'var(--primary)':'var(--surface)'};color:${clView==='table'?'#fff':'var(--text-secondary)'};">☰ Tabla</button>
    </div>`;

    const clientCardsHTML = Object.entries(byTypology).sort().map(([typ, list]) => `
        <div class="panel" style="margin-bottom:var(--space-lg);">
            <div class="panel-header">
                <h2>${typologyBadge(typ)} ${typ}</h2>
                <span style="font-size:0.8rem;color:var(--text-muted);">${list.length} cliente(s)</span>
            </div>
            <div class="panel-body" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--space-md);">
                ${list.map(c => `
                <div class="panel" style="margin:0;border-top:4px solid ${c.color};padding:0;cursor:pointer;transition:box-shadow 0.15s;" onclick="openClientDetail(${c.id})" onmouseover="this.style.boxShadow='0 4px 20px rgba(0,0,0,0.18)'" onmouseout="this.style.boxShadow=''">
                    <div style="padding:var(--space-md);">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">
                            <div style="display:flex;align-items:center;gap:10px;min-width:0;">
                                <div style="width:38px;height:38px;border-radius:8px;background:${c.color};flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.1rem;overflow:hidden;">
                                    ${c.logo_data ? `<img src="${c.logo_data}" style="width:100%;height:100%;object-fit:contain;" alt="">` : '🏢'}
                                </div>
                                <div style="min-width:0;">
                                    <div style="font-weight:700;font-size:0.95rem;margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(c.name)}</div>
                                    <div style="font-size:0.78rem;color:var(--text-muted);">${c.total_events} evento(s) · ${c.upcoming_events} próximos</div>
                                </div>
                            </div>
                            <div style="display:flex;gap:4px;flex-shrink:0;" onclick="event.stopPropagation()">
                                ${canEdit ? `<button class="btn btn-secondary btn-sm" onclick="openEditClientModal(${c.id})" title="Editar">✏️</button>` : ''}
                                ${isAdmin ? `<button class="btn btn-danger btn-sm" onclick="deleteClient(${c.id})" title="Eliminar">🗑️</button>` : ''}
                            </div>
                        </div>
                        ${c.notes ? `<div style="font-size:0.78rem;color:var(--text-muted);margin-top:8px;">${esc(c.notes)}</div>` : ''}
                        <div style="margin-top:8px;display:flex;align-items:center;gap:6px;">
                            <div style="width:14px;height:14px;border-radius:3px;background:${c.color};border:1px solid rgba(255,255,255,0.15);"></div>
                            <span style="font-size:0.75rem;color:var(--text-muted);">${c.color}</span>
                            <span style="margin-left:auto;font-size:0.72rem;color:var(--accent-secondary);">Ver detalle →</span>
                        </div>
                    </div>
                </div>`).join('')}
            </div>
        </div>`).join('');

    const clientTableHTML = `<div class="panel"><div class="panel-body no-padding">
        <table class="data-table">
            <thead><tr>
                <th>Cliente</th>
                <th>Tipología</th>
                <th style="text-align:center;">Total eventos</th>
                <th style="text-align:center;">Próximos</th>
                <th>Notas</th>
                <th></th>
            </tr></thead>
            <tbody>${clients.sort((a,b)=>a.name.localeCompare(b.name)).map(c => `
            <tr onclick="openClientDetail(${c.id})" style="cursor:pointer;">
                <td>
                    <div style="display:flex;align-items:center;gap:10px;">
                        <div style="width:32px;height:32px;border-radius:6px;background:${c.color};flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1rem;overflow:hidden;border-left:3px solid ${c.color};">
                            ${c.logo_data?`<img src="${c.logo_data}" style="width:100%;height:100%;object-fit:contain;" alt="">`:'🏢'}
                        </div>
                        <span style="font-weight:600;">${esc(c.name)}</span>
                    </div>
                </td>
                <td>${typologyBadge(c.typology)}</td>
                <td style="text-align:center;font-weight:700;">${c.total_events}</td>
                <td style="text-align:center;font-weight:700;color:var(--primary);">${c.upcoming_events}</td>
                <td style="font-size:0.82rem;color:var(--text-muted);">${c.notes ? esc(c.notes) : '—'}</td>
                <td style="white-space:nowrap;" onclick="event.stopPropagation()">
                    ${canEdit ? `<button class="btn btn-secondary btn-sm" onclick="openEditClientModal(${c.id})" title="Editar">✏️</button>` : ''}
                    ${isAdmin ? `<button class="btn btn-danger btn-sm" onclick="deleteClient(${c.id})" title="Eliminar" style="margin-left:4px;">🗑️</button>` : ''}
                </td>
            </tr>`).join('')}
            </tbody>
        </table>
    </div></div>`;

    container.innerHTML = `
    <div class="page-enter">
        <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start;">
            <div>
                <h1>🏢 Clientes</h1>
                <p>Configuración y tipología de clientes / propiedades</p>
            </div>
            <div style="display:flex;gap:8px;align-items:center;">
                ${clViewToggle}
                ${canEdit ? `<button class="btn btn-primary" onclick="openCreateClientModal()">＋ ${State.lang==='en'?'New Client':State.lang==='ca'?'Nou Client':'Nuevo Cliente'}</button>` : ''}
            </div>
        </div>

        <!-- Stats quick -->
        <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:var(--space-lg);">
            ${EVENT_TYPOLOGIES.map(typ => {
                const count = clients.filter(c => c.typology === typ).length;
                return count > 0 ? `<div class="stat-card info" style="border-top:3px solid ${TYPOLOGY_COLORS[typ]};">
                    <div class="stat-value">${count}</div>
                    <div class="stat-label">${typ}</div>
                </div>` : '';
            }).join('')}
        </div>

        ${clients.length === 0 ? `<div class="empty-state"><div class="empty-icon">🏢</div><h3>No hay clientes configurados</h3><p>Crea el primer cliente para empezar a gestionar eventos.</p></div>` : (clView === 'table' ? clientTableHTML : clientCardsHTML)}
    </div>`;
}

function clientFormHTML(c) {
    const typOpts = EVENT_TYPOLOGIES.map(t =>
        `<option value="${t}" ${c && c.typology === t ? 'selected' : ''}>${t}</option>`
    ).join('');
    window._clientLogoData = c ? (c.logo_data || null) : null;
    const logoPreview = c && c.logo_data
        ? `<img src="${c.logo_data}" style="width:72px;height:72px;object-fit:contain;border-radius:8px;">`
        : `<div style="width:72px;height:72px;border-radius:8px;background:${c ? c.color : '#6C5CE7'};display:flex;align-items:center;justify-content:center;font-size:1.8rem;">🏢</div>`;
    return `
        <div class="form-group">
            <label>Nombre del cliente *</label>
            <input type="text" class="form-input" id="clName" value="${c ? esc(c.name) : ''}" placeholder="Nombre de la propiedad / cliente">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Tipología</label>
                <select class="form-select" id="clTypology">${typOpts}</select>
            </div>
            <div class="form-group" style="width:120px;">
                <label>Color</label>
                <input type="color" class="form-input" id="clColor" value="${c ? c.color : '#6C5CE7'}" style="padding:4px;height:42px;cursor:pointer;">
            </div>
        </div>
        <div class="form-group">
            <label>Logo del cliente</label>
            <div style="display:flex;align-items:center;gap:14px;">
                <div id="clLogoPreview" style="cursor:pointer;position:relative;" onclick="document.getElementById('clLogoInput').click()" title="Haz clic para cambiar el logo">
                    ${logoPreview}
                    <div style="position:absolute;inset:0;border-radius:8px;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;font-size:0.7rem;color:#fff;opacity:0;transition:opacity 0.15s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0">📷 Cambiar</div>
                </div>
                <div>
                    <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('clLogoInput').click()">📷 Subir imagen</button>
                    ${c && c.logo_data ? `<button type="button" class="btn btn-danger btn-sm" style="margin-left:6px;" onclick="window._clientLogoData=null;document.getElementById('clLogoPreview').innerHTML='<div style=\\'width:72px;height:72px;border-radius:8px;background:#6C5CE7;display:flex;align-items:center;justify-content:center;font-size:1.8rem;\\'>🏢</div>';">🗑️ Quitar</button>` : ''}
                    <p style="font-size:0.75rem;color:var(--text-muted);margin:6px 0 0;">JPG, PNG o SVG · máx. 2 MB</p>
                </div>
                <input type="file" id="clLogoInput" accept="image/*" style="display:none" onchange="handleClientLogoChange(this)">
            </div>
        </div>
        <div class="form-group">
            <label>Notas</label>
            <input type="text" class="form-input" id="clNotes" value="${c ? esc(c.notes) : ''}" placeholder="Información adicional...">
        </div>`;
}

window.handleClientLogoChange = async function(input) {
    if (!input.files || !input.files[0]) return;
    try {
        const data = await resizeImage(input.files[0], 300);
        window._clientLogoData = data;
        document.getElementById('clLogoPreview').innerHTML =
            `<img src="${data}" style="width:72px;height:72px;object-fit:contain;border-radius:8px;">`;
    } catch (e) { showToast('Error al procesar la imagen', 'error'); }
};

window.openCreateClientModal = function() {
    openModal(`
    <div class="modal">
        <div class="modal-header">
            <h3>🏢 Nuevo Cliente</h3>
            <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">${clientFormHTML(null)}</div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="submitCreateClient()">Crear</button>
        </div>
    </div>`);
};

window.submitCreateClient = async function() {
    const name = document.getElementById('clName').value.trim();
    const typology = document.getElementById('clTypology').value;
    const color = document.getElementById('clColor').value;
    const notes = document.getElementById('clNotes').value;
    const logo_data = window._clientLogoData || null;
    if (!name) { showToast('El nombre es obligatorio', 'error'); return; }
    try {
        await api('/api/clients', { method: 'POST', body: JSON.stringify({ name, typology, color, notes, logo_data }) });
        closeModal();
        showToast('Cliente creado', 'success');
        renderPage();
    } catch (err) { showToast(err.message, 'error'); }
};

window.openEditClientModal = function(id) {
    const c = State.clients.find(x => x.id === id);
    if (!c) return;
    openModal(`
    <div class="modal">
        <div class="modal-header">
            <h3>✏️ Editar — ${esc(c.name)}</h3>
            <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">${clientFormHTML(c)}</div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="submitEditClient(${id})">Guardar</button>
        </div>
    </div>`);
};

window.submitEditClient = async function(id) {
    const name = document.getElementById('clName').value.trim();
    const typology = document.getElementById('clTypology').value;
    const color = document.getElementById('clColor').value;
    const notes = document.getElementById('clNotes').value;
    const logo_data = window._clientLogoData !== undefined ? window._clientLogoData : null;
    if (!name) { showToast('El nombre es obligatorio', 'error'); return; }
    try {
        await api(`/api/clients/${id}`, { method: 'PUT', body: JSON.stringify({ name, typology, color, notes, logo_data }) });
        closeModal();
        showToast('Cliente actualizado', 'success');
        renderPage();
    } catch (err) { showToast(err.message, 'error'); }
};

window.deleteClient = async function(id) {
    if (!confirm('¿Eliminar este cliente? Los eventos asociados quedarán sin cliente asignado.')) return;
    try {
        await api(`/api/clients/${id}`, { method: 'DELETE' });
        showToast('Cliente eliminado', 'success');
        renderPage();
    } catch (err) { showToast(err.message, 'error'); }
};

window.openClientDetail = function(id) {
    State.selectedClientId = id;
    renderPage();
};

window.exportClientEventsCSV = function(clientId) {
    const client  = State.clients.find(c => c.id === clientId);
    const events  = (State.events || []).filter(e => e.client_id === clientId)
                      .sort((a,b) => a.start_date.localeCompare(b.start_date));
    const rows    = [['Evento','Cliente','Tipología','Inicio','Fin','Días','Ubicación','Responsables']];
    for (const e of events) {
        rows.push([
            e.name,
            client ? client.name : '',
            e.client_typology || '',
            e.start_date, e.end_date,
            e.duration_days,
            e.location || '',
            (e.assignments||[]).map(a=>a.employee_name).join(' | '),
        ]);
    }
    downloadCSV(rows, `eventos_${(client?.name||'cliente').replace(/\s+/g,'_')}.csv`);
};

function downloadCSV(rows, filename) {
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const a   = document.createElement('a');
    a.href    = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' }));
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
}

window.exportEventsDashboardCSV = function() {
    const events = applyEventsFilters(State.events || []);
    const today  = new Date().toISOString().split('T')[0];
    const rows   = [['Evento','Cliente','Tipología','Estado','Inicio','Fin','Días','Ubicación','Responsables']];
    for (const e of events.sort((a,b) => a.start_date.localeCompare(b.start_date))) {
        rows.push([
            e.name,
            e.client_name || '',
            e.client_typology || '',
            e.end_date < today ? 'Realizado' : 'Próximo',
            e.start_date, e.end_date,
            e.duration_days,
            e.location || '',
            (e.assignments||[]).map(a=>a.employee_name).join(' | '),
        ]);
    }
    downloadCSV(rows, `dashboard_eventos_${State.eventsYear}.csv`);
};

window.exportEventsPDF = function() {
    window.print();
};

window.exportEventsCalendarCSV = function() {
    const month   = State.eventsCalMonth;
    const calYear = State.eventsYear;
    const pad     = n => String(n).padStart(2,'0');
    const monthStart = `${calYear}-${pad(month)}-01`;
    const lastDay    = new Date(calYear, month, 0).getDate();
    const monthEnd   = `${calYear}-${pad(month)}-${pad(lastDay)}`;
    const events  = applyEventsFilters(State.events || [])
                      .filter(e => e.start_date <= monthEnd && e.end_date >= monthStart)
                      .sort((a,b) => a.start_date.localeCompare(b.start_date));
    const MONTHS  = Array.from({length:12},(_,i)=>getMonthName(i+1));
    const rows    = [['Evento','Cliente','Tipología','Inicio','Fin','Días','Ubicación','Responsables']];
    for (const e of events) {
        rows.push([
            e.name, e.client_name || '', e.client_typology || '',
            e.start_date, e.end_date, e.duration_days,
            e.location || '',
            (e.assignments||[]).map(a=>a.employee_name).join(' | '),
        ]);
    }
    downloadCSV(rows, `calendario_eventos_${MONTHS[month-1]}_${calYear}.csv`);
};

// ─────────────────────────────────────────────
// Sick Leaves Page
// ─────────────────────────────────────────────

const SICK_LEAVE_TYPES = {
    'IT': '🤒 IT — Incapacidad Temporal',
    'AT': '⚠️ AT — Accidente de Trabajo',
    'Maternidad': '🤱 Maternidad',
    'Paternidad': '👶 Paternidad',
    'Otro': '📋 Otro',
};

function sickLeaveTypeLabel(type) {
    return SICK_LEAVE_TYPES[type] || type;
}

async function loadSickLeaves(container) {
    const isAdmin = State.user.role === 'admin';
    const isManager = State.user.role === 'admin' || State.user.role === 'manager';

    let leaves = [];
    let users = [];

    if (isManager) {
        [leaves, users] = await Promise.all([
            api('/api/sick-leaves'),
            api('/api/users'),
        ]);
    } else {
        leaves = await api(`/api/sick-leaves?user_id=${State.user.id}`);
    }

    State.sickLeaves = leaves;

    // Count currently active (open) sick leaves
    const today = new Date().toISOString().split('T')[0];
    const activeLeaves = leaves.filter(l => l.start_date <= today && (!l.end_date || l.end_date >= today));

    container.innerHTML = `
    <div class="page-enter">
        <div class="page-header">
            <div>
                <h1>🏥 Gestión de Bajas</h1>
                <p>Control de bajas médicas y ausencias por enfermedad</p>
            </div>
        </div>

        <div class="stats-grid" style="grid-template-columns: repeat(3, 1fr);">
            <div class="stat-card danger">
                <div class="stat-icon">🏥</div>
                <div class="stat-value">${activeLeaves.length}</div>
                <div class="stat-label">Bajas Activas Ahora</div>
            </div>
            <div class="stat-card warning">
                <div class="stat-icon">📋</div>
                <div class="stat-value">${leaves.length}</div>
                <div class="stat-label">Total Registradas</div>
            </div>
            <div class="stat-card info">
                <div class="stat-icon">📅</div>
                <div class="stat-value">${leaves.reduce((s, l) => s + l.calendar_days, 0)}</div>
                <div class="stat-label">Días Totales de Baja</div>
            </div>
        </div>

        ${isAdmin ? `
        <div class="panel" style="margin-bottom: var(--space-lg);">
            <div class="panel-header">
                <h2>➕ Registrar Nueva Baja</h2>
            </div>
            <div class="panel-body">
                <div class="form-row" style="align-items: flex-end; flex-wrap: wrap;">
                    <div class="form-group">
                        <label>Empleado</label>
                        <select class="form-select" id="slUserId">
                            ${users.map(u => `<option value="${u.id}">${esc(u.full_name)}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Tipo de baja</label>
                        <select class="form-select" id="slType">
                            ${Object.entries(SICK_LEAVE_TYPES).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Fecha inicio</label>
                        <input type="date" class="form-input" id="slStart" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group">
                        <label>Fecha fin <span style="color:var(--text-muted);font-size:0.8rem;">(opcional)</span></label>
                        <input type="date" class="form-input" id="slEnd">
                    </div>
                    <div class="form-group" style="flex:2;">
                        <label>Notas</label>
                        <input type="text" class="form-input" id="slNotes" placeholder="Observaciones internas...">
                    </div>
                    <button class="btn btn-primary" onclick="submitSickLeave()" style="height:42px;margin-bottom:4px;">Registrar Baja</button>
                </div>
            </div>
        </div>
        ` : ''}

        <div class="panel">
            <div class="panel-header">
                <h2>📋 Historial de Bajas</h2>
            </div>
            <div class="panel-body no-padding">
                <table class="data-table">
                    <thead>
                        <tr>
                            ${isManager ? '<th>Empleado</th>' : ''}
                            <th>Tipo</th>
                            <th>Fecha Inicio</th>
                            <th>Fecha Fin</th>
                            <th>Días</th>
                            <th>Estado</th>
                            <th>Notas</th>
                            ${isAdmin ? '<th>Acciones</th>' : ''}
                        </tr>
                    </thead>
                    <tbody>
                        ${leaves.length === 0
                            ? `<tr><td colspan="${isAdmin ? 8 : isManager ? 7 : 6}" style="text-align:center;color:var(--text-muted);padding:24px;">No hay bajas registradas.</td></tr>`
                            : leaves.map(l => {
                                const isActive = l.start_date <= today && (!l.end_date || l.end_date >= today);
                                return `<tr>
                                    ${isManager ? `<td>
                                        <div style="display:flex;align-items:center;gap:8px;">
                                            ${renderAvatarEl(l.employee_avatar_color, l.employee_initials, l.employee_avatar_image, 28)}
                                            <span>${esc(l.employee_name)}</span>
                                        </div>
                                    </td>` : ''}
                                    <td>${sickLeaveTypeLabel(l.leave_type)}</td>
                                    <td>${formatDate(l.start_date)}</td>
                                    <td>${l.end_date ? formatDate(l.end_date) : '<span style="color:var(--color-danger);">En curso</span>'}</td>
                                    <td>${l.calendar_days}</td>
                                    <td>
                                        ${isActive
                                            ? '<span class="status-badge status-pending" style="background:var(--color-danger-bg);color:var(--color-danger);border-color:var(--color-danger-border);">🔴 Activa</span>'
                                            : '<span class="status-badge status-approved">✅ Finalizada</span>'}
                                    </td>
                                    <td style="color:var(--text-muted);font-size:0.82rem;">${esc(l.notes || '—')}</td>
                                    ${isAdmin ? `<td>
                                        <button class="btn btn-secondary btn-sm" onclick="editSickLeave(${l.id})">✏️</button>
                                        <button class="btn btn-danger btn-sm" onclick="deleteSickLeave(${l.id})" style="margin-left:4px;">🗑️</button>
                                    </td>` : ''}
                                </tr>`;
                            }).join('')
                        }
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
}

window.submitSickLeave = async function() {
    const user_id = parseInt(document.getElementById('slUserId').value);
    const leave_type = document.getElementById('slType').value;
    const start_date = document.getElementById('slStart').value;
    const end_date = document.getElementById('slEnd').value || null;
    const notes = document.getElementById('slNotes').value;

    if (!start_date) { showToast('Indica la fecha de inicio', 'error'); return; }
    try {
        await api('/api/sick-leaves', {
            method: 'POST',
            body: JSON.stringify({ user_id, leave_type, start_date, end_date, notes }),
        });
        showToast('Baja registrada correctamente', 'success');
        renderPage();
    } catch (err) { showToast(err.message, 'error'); }
};

window.editSickLeave = async function(id) {
    const leave = State.sickLeaves.find(l => l.id === id);
    if (!leave) return;
    openModal(`
    <div class="modal">
        <div class="modal-header">
            <h3>✏️ Editar Baja — ${esc(leave.employee_name)}</h3>
            <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">
            <div class="form-row">
                <div class="form-group">
                    <label>Tipo de baja</label>
                    <select class="form-select" id="editSlType">
                        ${Object.entries(SICK_LEAVE_TYPES).map(([k, v]) => `<option value="${k}" ${k === leave.leave_type ? 'selected' : ''}>${v}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Fecha inicio</label>
                    <input type="date" class="form-input" id="editSlStart" value="${leave.start_date}">
                </div>
                <div class="form-group">
                    <label>Fecha fin <span style="color:var(--text-muted);font-size:0.8rem;">(vacío = en curso)</span></label>
                    <input type="date" class="form-input" id="editSlEnd" value="${leave.end_date || ''}">
                </div>
            </div>
            <div class="form-group">
                <label>Notas</label>
                <input type="text" class="form-input" id="editSlNotes" value="${esc(leave.notes || '')}">
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="submitEditSickLeave(${id})">Guardar Cambios</button>
        </div>
    </div>`);
};

window.submitEditSickLeave = async function(id) {
    const leave_type = document.getElementById('editSlType').value;
    const start_date = document.getElementById('editSlStart').value;
    const end_date = document.getElementById('editSlEnd').value || null;
    const notes = document.getElementById('editSlNotes').value;
    try {
        await api(`/api/sick-leaves/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ leave_type, start_date, end_date, notes }),
        });
        closeModal();
        showToast('Baja actualizada', 'success');
        renderPage();
    } catch (err) { showToast(err.message, 'error'); }
};

window.deleteSickLeave = async function(id) {
    if (!confirm('¿Eliminar este registro de baja?')) return;
    try {
        await api(`/api/sick-leaves/${id}`, { method: 'DELETE' });
        showToast('Baja eliminada', 'success');
        renderPage();
    } catch (err) { showToast(err.message, 'error'); }
};

// ─────────────────────────────────────────────
// Init
// ─────────────────────────────────────────────

window.setTheme = function(theme) {
    State.theme = theme;
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
};

async function init() {
    // Apply saved theme immediately
    document.documentElement.setAttribute('data-theme', State.theme);

    try {
        const [meData, settings] = await Promise.all([
            api('/api/me'),
            api('/api/settings')
        ]);
        if (meData.authenticated) {
            State.user = meData.user;
            _csrfToken = meData.csrf_token;
        }
        State.companySettings = settings;
    } catch (e) {
        // Not authenticated or settings unavailable
    }

    // Handle /reset-password?token=... deep link
    const params = new URLSearchParams(window.location.search);
    const resetToken = params.get('token');
    if (resetToken && window.location.pathname === '/reset-password') {
        renderResetPasswordPage(resetToken);
        return;
    }

    renderApp();
    if (State.user && !State.user.must_change_password) {
        renderPage();
    }
}

function renderResetPasswordPage(token) {
    const app = document.getElementById('app');
    const logo = State.companySettings?.logo_data;
    const name = esc(State.companySettings?.company_name || 'VacationControl');
    app.innerHTML = `
    <div class="login-container">
        <div class="login-card">
            <div class="login-logo">
                ${logo ? `<img src="${logo}" class="login-logo-img" alt="Logo">` : '<div class="logo-icon">🌴</div>'}
                <h1>${name}</h1>
                <p>Establece tu nueva contraseña</p>
            </div>
            <div class="login-error" id="rpError"></div>
            <div class="form-group">
                <label>Nueva contraseña (mín. 8 caracteres)</label>
                <input type="password" id="rpNew" class="form-input" placeholder="Nueva contraseña">
            </div>
            <div class="form-group">
                <label>Confirmar contraseña</label>
                <input type="password" id="rpConfirm" class="form-input" placeholder="Repite la contraseña">
            </div>
            <button class="btn btn-primary btn-full" id="rpBtn" onclick="submitResetPassword('${esc(token)}')">Guardar contraseña</button>
        </div>
    </div>`;
}

window.submitResetPassword = async function(token) {
    const newPw = document.getElementById('rpNew').value;
    const confirm = document.getElementById('rpConfirm').value;
    const errorEl = document.getElementById('rpError');
    const btn = document.getElementById('rpBtn');
    if (newPw !== confirm) {
        errorEl.textContent = 'Las contraseñas no coinciden'; errorEl.classList.add('visible'); return;
    }
    if (newPw.length < 8) {
        errorEl.textContent = 'Mínimo 8 caracteres'; errorEl.classList.add('visible'); return;
    }
    btn.textContent = 'Guardando...'; btn.disabled = true;
    try {
        await api('/api/reset-password', { method: 'POST', body: JSON.stringify({ token, password: newPw }) });
        showToast('Contraseña actualizada. Inicia sesión.', 'success');
        window.location.href = '/login';
    } catch (err) {
        errorEl.textContent = err.message; errorEl.classList.add('visible');
        btn.textContent = 'Guardar contraseña'; btn.disabled = false;
    }
};

// ── GUÍA ─────────────────────────────────────────────────────────────────────
const _guideContent = {
    es: {
        title: 'Guía de uso', subtitle: 'Todo lo que necesitas saber para usar Control Vacances',
        first_steps: 'Primeros Pasos', go: 'Ir →', pending: 'Pendiente',
        qc: [
            { icon:'🏖️', title:'Solicitar Vacaciones', desc:'Pide tus días libres en pocos clics', page:'my-vacations' },
            { icon:'🏢', title:'Añadir un Cliente', desc:'Da de alta nuevos clientes en el sistema', page:'clients-config' },
            { icon:'🎯', title:'Crear un Evento', desc:'Asocia un evento o proyecto a un cliente', page:'events' },
            { icon:'👥', title:'Gestionar Equipo', desc:'Aprueba solicitudes y consulta el equipo', page:'requests', mgr:true },
        ],
        tabs: { vacaciones:'Vacaciones', eventos:'Eventos & Clientes', admin:'Administración', manager:'Gestión' },
        vid_vac: 'Tutorial: Solicitar vacaciones', vid_evt: 'Tutorial: Crear un evento', vid_adm: 'Tutorial: Gestión de solicitudes',
        vac: [
            { title:'🏖️ Cómo solicitar vacaciones', steps:[
                {t:'Ve a "Mis Vacaciones"', d:'En el menú lateral, haz clic en "Mis Vacaciones".'},
                {t:'Pulsa "+ Nueva Solicitud"', d:'Aparecerá el formulario para elegir fechas.'},
                {t:'Selecciona las fechas', d:'Elige la fecha de inicio y fin. Se calculan automáticamente los días laborables.'},
                {t:'Añade un motivo (opcional)', d:'Puedes añadir una nota o justificación para tu responsable.'},
                {t:'Envía la solicitud', d:'Tu responsable recibirá la solicitud y la aprobará o rechazará.'},
            ]},
            { title:'📅 Cómo consultar el calendario', steps:[
                {t:'Accede al Calendario', d:'Desde el menú lateral, pulsa "Calendario".'},
                {t:'Filtra por equipo o departamento', d:'Usa los filtros superiores para ver solo a ciertos empleados.'},
                {t:'Consulta los festivos', d:'Los festivos oficiales aparecen marcados en rojo en el calendario.'},
                {t:'Navega por meses', d:'Usa las flechas para moverte entre meses y planificar con antelación.'},
            ]},
            { title:'⭐ Cómo usar los Días Extras', steps:[
                {t:'¿Qué son los días extras?', d:'Son días adicionales concedidos por trabajar fines de semana u otros motivos.'},
                {t:'Consulta tu saldo', d:'En el Dashboard verás tu total de días disponibles (normales + extras ⭐).'},
                {t:'Se usan automáticamente', d:'Al solicitar vacaciones, los días extras se consumen una vez agotados los normales.'},
                {t:'Historial en "Días Extras"', d:'Los administradores pueden ver el detalle de cada entrada en administración.'},
            ]},
        ],
        evt: [
            { title:'🏢 Cómo dar de alta un cliente', steps:[
                {t:'Ve a "Clientes"', d:'En la sección Eventos del menú lateral.'},
                {t:'Pulsa "+ Nuevo Cliente"', d:'Se abrirá el formulario de alta de cliente.'},
                {t:'Rellena los datos', d:'Nombre, persona de contacto, email, teléfono y sector.'},
                {t:'Sube el logo (opcional)', d:'Haz clic en el icono de imagen para subir el logotipo del cliente.'},
                {t:'Guarda el cliente', d:'El cliente quedará disponible para asociarle eventos.'},
            ]},
            { title:'🎯 Cómo crear un evento', steps:[
                {t:'Accede a "Dashboard Eventos"', d:'Desde el menú lateral en la sección Eventos.'},
                {t:'Pulsa "+ Nuevo Evento"', d:'Se abrirá el formulario de creación.'},
                {t:'Selecciona el cliente', d:'Elige el cliente al que está asociado el evento.'},
                {t:'Define fechas y descripción', d:'Añade nombre del evento, fechas de inicio y fin, y una descripción.'},
                {t:'Asigna el equipo', d:'Selecciona los empleados que participarán en el evento.'},
                {t:'Guarda el evento', d:'Aparecerá en el Dashboard y en el Calendario de Eventos.'},
            ]},
            { title:'✏️ Cómo editar o eliminar un evento', steps:[
                {t:'Localiza el evento', d:'En el Dashboard Eventos o en el detalle del cliente.'},
                {t:'Pulsa el botón ✏️ (editar)', d:'Se abrirá el formulario con los datos actuales para modificarlos.'},
                {t:'Guarda los cambios', d:'Los cambios se reflejarán inmediatamente en todos los calendarios.'},
                {t:'O pulsa 🗑️ para eliminar', d:'Se pedirá confirmación antes de eliminar el evento definitivamente.'},
            ]},
        ],
        adm: [
            { title:'✅ Cómo gestionar solicitudes', steps:[
                {t:'Ve a "Solicitudes"', d:'En la sección Gestión del menú lateral.'},
                {t:'Revisa las solicitudes pendientes', d:'Las marcadas en amarillo están esperando tu aprobación.'},
                {t:'Aprueba o rechaza', d:'Pulsa ✓ para aprobar o ✗ para rechazar. Puedes añadir un motivo de rechazo.'},
                {t:'Gestiona cancelaciones', d:'Si un empleado pide cancelar una vacación aprobada, recibirás la solicitud aquí.'},
            ]},
            { title:'👤 Cómo dar de alta un empleado', admin:true, steps:[
                {t:'Ve a "Empleados"', d:'En la sección Administración del menú lateral.'},
                {t:'Pulsa "+ Nuevo Empleado"', d:'Se abrirá el formulario de registro.'},
                {t:'Rellena los datos', d:'Nombre, apellido, email, contraseña, rol y departamento.'},
                {t:'Asigna días de vacaciones', d:'Define el total de días anuales asignados al empleado.'},
                {t:'Guarda el empleado', d:'Recibirá un email con sus credenciales de acceso.'},
            ]},
            { title:'⭐ Cómo añadir días extras a un empleado', admin:true, steps:[
                {t:'Ve a "Días Extras"', d:'En la sección Administración del menú lateral.'},
                {t:'Pulsa "+ Añadir Días Extras"', d:'Se abrirá el formulario de asignación.'},
                {t:'Selecciona el empleado', d:'Elige el empleado al que quieres añadir días.'},
                {t:'Indica los días y el motivo', d:'Especifica cuántos días y por qué (ej: trabajo fin de semana).'},
                {t:'Guarda la entrada', d:'Los días se suman al saldo disponible del empleado de inmediato.'},
            ]},
            { title:'🎉 Cómo gestionar festivos', admin:true, steps:[
                {t:'Ve a "Festivos"', d:'En la sección Administración.'},
                {t:'Añade festivos locales', d:'Puedes añadir los festivos de tu comunidad o ciudad.'},
                {t:'Los festivos no cuentan como vacaciones', d:'Al solicitar un período, los festivos se excluyen automáticamente.'},
            ]},
        ],
    },
    en: {
        title: 'User Guide', subtitle: 'Everything you need to know to use Control Vacances',
        first_steps: 'Getting Started', go: 'Go →', pending: 'Pending',
        qc: [
            { icon:'🏖️', title:'Request Vacation', desc:'Request your days off in a few clicks', page:'my-vacations' },
            { icon:'🏢', title:'Add a Client', desc:'Register new clients in the system', page:'clients-config' },
            { icon:'🎯', title:'Create an Event', desc:'Associate an event or project to a client', page:'events' },
            { icon:'👥', title:'Manage Team', desc:'Approve requests and view the team', page:'requests', mgr:true },
        ],
        tabs: { vacaciones:'Vacations', eventos:'Events & Clients', admin:'Administration', manager:'Management' },
        vid_vac: 'Tutorial: Requesting vacation', vid_evt: 'Tutorial: Creating an event', vid_adm: 'Tutorial: Managing requests',
        vac: [
            { title:'🏖️ How to request vacation', steps:[
                {t:'Go to "My Vacations"', d:'In the sidebar, click on "My Vacations".'},
                {t:'Click "+ New Request"', d:'The form to choose dates will appear.'},
                {t:'Select the dates', d:'Choose start and end date. Working days are calculated automatically.'},
                {t:'Add a reason (optional)', d:'You can add a note or justification for your manager.'},
                {t:'Submit the request', d:'Your manager will receive the request and approve or reject it.'},
            ]},
            { title:'📅 How to view the calendar', steps:[
                {t:'Open the Calendar', d:'In the sidebar, click "Calendar".'},
                {t:'Filter by team or department', d:'Use the top filters to show only certain employees.'},
                {t:'Check public holidays', d:'Official holidays appear marked in red on the calendar.'},
                {t:'Browse by month', d:'Use the arrows to navigate between months and plan ahead.'},
            ]},
            { title:'⭐ How to use Extra Days', steps:[
                {t:'What are extra days?', d:'Additional days granted for working weekends or other reasons.'},
                {t:'Check your balance', d:'The Dashboard shows your total available days (normal + extra ⭐).'},
                {t:'Used automatically', d:'When requesting vacation, extra days are consumed once normal days run out.'},
                {t:'History in "Extra Days"', d:'Administrators can view the detail of each entry in the admin section.'},
            ]},
        ],
        evt: [
            { title:'🏢 How to add a client', steps:[
                {t:'Go to "Clients"', d:'In the Events section of the sidebar.'},
                {t:'Click "+ New Client"', d:'The client registration form will open.'},
                {t:'Fill in the details', d:'Name, contact person, email, phone and industry.'},
                {t:'Upload a logo (optional)', d:'Click the image icon to upload the client logo.'},
                {t:'Save the client', d:'The client will be available to associate events.'},
            ]},
            { title:'🎯 How to create an event', steps:[
                {t:'Go to "Events Dashboard"', d:'From the sidebar under Events.'},
                {t:'Click "+ New Event"', d:'The creation form will open.'},
                {t:'Select the client', d:'Choose the client this event belongs to.'},
                {t:'Set dates and description', d:'Add the event name, start/end dates, and a description.'},
                {t:'Assign the team', d:'Select the employees who will participate in the event.'},
                {t:'Save the event', d:'It will appear in the Dashboard and Events Calendar.'},
            ]},
            { title:'✏️ How to edit or delete an event', steps:[
                {t:'Find the event', d:'In the Events Dashboard or in the client detail.'},
                {t:'Click the ✏️ button (edit)', d:'The form will open with the current data to modify.'},
                {t:'Save changes', d:'Changes will be reflected immediately in all calendars.'},
                {t:'Or click 🗑️ to delete', d:'Confirmation will be requested before permanently deleting the event.'},
            ]},
        ],
        adm: [
            { title:'✅ How to manage requests', steps:[
                {t:'Go to "Requests"', d:'In the Management section of the sidebar.'},
                {t:'Review pending requests', d:'Those highlighted in yellow are awaiting your approval.'},
                {t:'Approve or reject', d:'Click ✓ to approve or ✗ to reject. You can add a rejection reason.'},
                {t:'Manage cancellations', d:'If an employee requests cancellation of an approved vacation, you will receive it here.'},
            ]},
            { title:'👤 How to register an employee', admin:true, steps:[
                {t:'Go to "Employees"', d:'In the Administration section of the sidebar.'},
                {t:'Click "+ New Employee"', d:'The registration form will open.'},
                {t:'Fill in the details', d:'First name, last name, email, password, role and department.'},
                {t:'Assign vacation days', d:'Set the total annual days assigned to the employee.'},
                {t:'Save the employee', d:'They will receive an email with their login credentials.'},
            ]},
            { title:'⭐ How to add extra days to an employee', admin:true, steps:[
                {t:'Go to "Extra Days"', d:'In the Administration section of the sidebar.'},
                {t:'Click "+ Add Extra Days"', d:'The assignment form will open.'},
                {t:'Select the employee', d:'Choose the employee to whom you want to add days.'},
                {t:'Enter days and reason', d:'Specify how many days and why (e.g. weekend work).'},
                {t:'Save the entry', d:'The days are added to the employee\'s available balance immediately.'},
            ]},
            { title:'🎉 How to manage public holidays', admin:true, steps:[
                {t:'Go to "Public Holidays"', d:'In the Administration section.'},
                {t:'Add local holidays', d:'You can add holidays for your region or city.'},
                {t:'Holidays don\'t count as vacation', d:'When requesting a period, holidays are automatically excluded from the count.'},
            ]},
        ],
    },
    ca: {
        title: 'Guia d\'ús', subtitle: 'Tot el que necessites saber per usar Control Vacances',
        first_steps: 'Primers Passos', go: 'Anar →', pending: 'Pendent',
        qc: [
            { icon:'🏖️', title:'Sol·licitar Vacances', desc:'Demana els teus dies lliures en pocs clics', page:'my-vacations' },
            { icon:'🏢', title:'Afegir un Client', desc:'Dona d\'alta nous clients al sistema', page:'clients-config' },
            { icon:'🎯', title:'Crear un Esdeveniment', desc:'Associa un esdeveniment o projecte a un client', page:'events' },
            { icon:'👥', title:'Gestionar Equip', desc:'Aprova sol·licituds i consulta l\'equip', page:'requests', mgr:true },
        ],
        tabs: { vacaciones:'Vacances', eventos:'Esdeveniments & Clients', admin:'Administració', manager:'Gestió' },
        vid_vac: 'Tutorial: Sol·licitar vacances', vid_evt: 'Tutorial: Crear un esdeveniment', vid_adm: 'Tutorial: Gestionar sol·licituds',
        vac: [
            { title:'🏖️ Com sol·licitar vacances', steps:[
                {t:'Ves a "Les meves vacances"', d:'Al menú lateral, fes clic a "Les meves vacances".'},
                {t:'Prem "+ Nova sol·licitud"', d:'Apareixerà el formulari per triar dates.'},
                {t:'Selecciona les dates', d:'Tria la data d\'inici i fi. Els dies laborables es calculen automàticament.'},
                {t:'Afegeix un motiu (opcional)', d:'Pots afegir una nota o justificació per al teu responsable.'},
                {t:'Envia la sol·licitud', d:'El teu responsable rebrà la sol·licitud i l\'aprovarà o rebutjarà.'},
            ]},
            { title:'📅 Com consultar el calendari', steps:[
                {t:'Accedeix al Calendari', d:'Des del menú lateral, prem "Calendari".'},
                {t:'Filtra per equip o departament', d:'Usa els filtres superiors per veure només certs empleats.'},
                {t:'Consulta els festius', d:'Els festius oficials apareixen marcats en vermell al calendari.'},
                {t:'Navega per mesos', d:'Usa les fletxes per moure\'t entre mesos i planificar amb antelació.'},
            ]},
            { title:'⭐ Com usar els Dies Extres', steps:[
                {t:'Què són els dies extres?', d:'Són dies addicionals concedits per treballar caps de setmana o altres motius.'},
                {t:'Consulta el teu saldo', d:'Al Dashboard veuràs el teu total de dies disponibles (normals + extres ⭐).'},
                {t:'S\'usen automàticament', d:'En sol·licitar vacances, els dies extres s\'usen un cop esgotats els normals.'},
                {t:'Historial a "Dies Extres"', d:'Els administradors poden veure el detall de cada entrada a administració.'},
            ]},
        ],
        evt: [
            { title:'🏢 Com donar d\'alta un client', steps:[
                {t:'Ves a "Clients"', d:'A la secció Esdeveniments del menú lateral.'},
                {t:'Prem "+ Nou Client"', d:'S\'obrirà el formulari d\'alta de client.'},
                {t:'Emplena les dades', d:'Nom, persona de contacte, email, telèfon i sector.'},
                {t:'Puja el logo (opcional)', d:'Fes clic a la icona d\'imatge per pujar el logotip del client.'},
                {t:'Desa el client', d:'El client estarà disponible per associar-li esdeveniments.'},
            ]},
            { title:'🎯 Com crear un esdeveniment', steps:[
                {t:'Accedeix a "Tauler Esdeveniments"', d:'Des del menú lateral a la secció Esdeveniments.'},
                {t:'Prem "+ Nou Esdeveniment"', d:'S\'obrirà el formulari de creació.'},
                {t:'Selecciona el client', d:'Tria el client al qual pertany l\'esdeveniment.'},
                {t:'Defineix dates i descripció', d:'Afegeix el nom, dates d\'inici i fi, i una descripció.'},
                {t:'Assigna l\'equip', d:'Selecciona els empleats que participaran en l\'esdeveniment.'},
                {t:'Desa l\'esdeveniment', d:'Apareixerà al Tauler i al Calendari d\'Esdeveniments.'},
            ]},
            { title:'✏️ Com editar o eliminar un esdeveniment', steps:[
                {t:'Localitza l\'esdeveniment', d:'Al Tauler Esdeveniments o al detall del client.'},
                {t:'Prem el botó ✏️ (editar)', d:'S\'obrirà el formulari amb les dades actuals per modificar.'},
                {t:'Desa els canvis', d:'Els canvis es reflectiran immediatament a tots els calendaris.'},
                {t:'O prem 🗑️ per eliminar', d:'Es demanarà confirmació abans d\'eliminar l\'esdeveniment.'},
            ]},
        ],
        adm: [
            { title:'✅ Com gestionar sol·licituds', steps:[
                {t:'Ves a "Sol·licituds"', d:'A la secció Gestió del menú lateral.'},
                {t:'Revisa les sol·licituds pendents', d:'Les marcades en groc estan esperant la teva aprovació.'},
                {t:'Aprova o rebutja', d:'Prem ✓ per aprovar o ✗ per rebutjar. Pots afegir un motiu de rebuig.'},
                {t:'Gestiona cancel·lacions', d:'Si un empleat demana cancel·lar unes vacances aprovades, ho rebràs aquí.'},
            ]},
            { title:'👤 Com donar d\'alta un empleat', admin:true, steps:[
                {t:'Ves a "Empleats"', d:'A la secció Administració del menú lateral.'},
                {t:'Prem "+ Nou Empleat"', d:'S\'obrirà el formulari de registre.'},
                {t:'Emplena les dades', d:'Nom, cognoms, email, contrasenya, rol i departament.'},
                {t:'Assigna dies de vacances', d:'Defineix el total de dies anuals assignats a l\'empleat.'},
                {t:'Desa l\'empleat', d:'Rebrà un email amb les seves credencials d\'accés.'},
            ]},
            { title:'⭐ Com afegir dies extres a un empleat', admin:true, steps:[
                {t:'Ves a "Dies Extres"', d:'A la secció Administració del menú lateral.'},
                {t:'Prem "+ Afegir Dies Extres"', d:'S\'obrirà el formulari d\'assignació.'},
                {t:'Selecciona l\'empleat', d:'Tria l\'empleat al qual vols afegir dies.'},
                {t:'Indica els dies i el motiu', d:'Especifica quants dies i per què (ex: treball cap de setmana).'},
                {t:'Desa l\'entrada', d:'Els dies se sumen al saldo disponible de l\'empleat immediatament.'},
            ]},
            { title:'🎉 Com gestionar festius', admin:true, steps:[
                {t:'Ves a "Festius"', d:'A la secció Administració.'},
                {t:'Afegeix festius locals', d:'Pots afegir els festius de la teva comunitat o ciutat.'},
                {t:'Els festius no compten com a vacances', d:'En sol·licitar un període, els festius s\'exclouen automàticament.'},
            ]},
        ],
    },
};

async function loadGuide(container) {
    const isAdmin = State.user?.role === 'admin';
    const isManager = State.user?.role === 'admin' || State.user?.role === 'manager';
    const gc = _guideContent[State.lang] || _guideContent.es;

    const tabs = [
        { id: 'vacaciones', icon: '🏖️', label: gc.tabs.vacaciones },
        { id: 'eventos',    icon: '🎯', label: gc.tabs.eventos },
        ...(isManager ? [{ id: 'admin', icon: '⚙️', label: isAdmin ? gc.tabs.admin : gc.tabs.manager }] : []),
    ];

    container.innerHTML = `
    <div class="page-header">
        <div>
            <h1 class="page-title">📖 ${gc.title}</h1>
            <p class="page-subtitle">${gc.subtitle}</p>
        </div>
    </div>

    <div style="margin-bottom:32px;">
        <h2 style="font-size:1rem;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.06em;margin-bottom:16px;">${gc.first_steps}</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;">
            ${gc.qc.filter(c => !c.mgr || isManager).map(c => quickCard(c.icon, c.title, c.desc, c.page, gc.go)).join('')}
        </div>
    </div>

    <div class="guide-tabs" style="display:flex;gap:8px;margin-bottom:24px;border-bottom:2px solid var(--border);padding-bottom:0;">
        ${tabs.map((tab, i) => `
        <button class="guide-tab-btn ${i === 0 ? 'active' : ''}" data-tab="${tab.id}"
            style="padding:10px 20px;border:none;background:none;cursor:pointer;font-weight:600;font-size:.9rem;
                   color:${i === 0 ? 'var(--primary)' : 'var(--text-secondary)'};
                   border-bottom:3px solid ${i === 0 ? 'var(--primary)' : 'transparent'};
                   margin-bottom:-2px;transition:all .2s;">
            ${tab.icon} ${tab.label}
        </button>`).join('')}
    </div>

    <div id="guideTabContent">
        ${renderGuideTab('vacaciones', isAdmin, isManager, gc)}
    </div>`;

    container.querySelectorAll('.guide-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.guide-tab-btn').forEach(b => {
                b.style.color = 'var(--text-secondary)';
                b.style.borderBottomColor = 'transparent';
                b.classList.remove('active');
            });
            btn.style.color = 'var(--primary)';
            btn.style.borderBottomColor = 'var(--primary)';
            btn.classList.add('active');
            document.getElementById('guideTabContent').innerHTML =
                renderGuideTab(btn.dataset.tab, isAdmin, isManager, gc);
        });
    });
}

function quickCard(icon, title, desc, page, goLabel) {
    return `<div onclick="navigateTo('${page}')"
        style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;
               cursor:pointer;transition:all .2s;display:flex;flex-direction:column;gap:8px;"
        onmouseover="this.style.boxShadow='0 4px 16px rgba(0,0,0,.1)';this.style.borderColor='var(--primary)'"
        onmouseout="this.style.boxShadow='none';this.style.borderColor='var(--border)'">
        <div style="font-size:2rem;">${icon}</div>
        <div style="font-weight:700;font-size:.95rem;color:var(--text-primary);">${title}</div>
        <div style="font-size:.82rem;color:var(--text-secondary);">${desc}</div>
        <div style="font-size:.8rem;color:var(--primary);font-weight:600;margin-top:4px;">${goLabel}</div>
    </div>`;
}

function guideSection(title, steps) {
    return `
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:24px;">
        <h3 style="font-size:1rem;font-weight:700;margin:0 0 18px;color:var(--text-primary);">${title}</h3>
        <ol style="margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:14px;">
            ${steps.map((s, i) => `
            <li style="display:flex;gap:14px;align-items:flex-start;">
                <span style="flex-shrink:0;width:28px;height:28px;border-radius:50%;background:var(--primary);
                             color:#fff;font-weight:700;font-size:.85rem;display:flex;align-items:center;
                             justify-content:center;">${i + 1}</span>
                <div>
                    <div style="font-weight:600;font-size:.9rem;color:var(--text-primary);">${s.t}</div>
                    <div style="font-size:.83rem;color:var(--text-secondary);margin-top:2px;">${s.d}</div>
                </div>
            </li>`).join('')}
        </ol>
    </div>`;
}

function videoCard(label, pendingLabel) {
    return `
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:24px;
                display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;min-height:180px;">
        <div style="width:56px;height:56px;background:var(--bg);border-radius:50%;display:flex;align-items:center;
                    justify-content:center;font-size:1.6rem;">▶️</div>
        <div style="font-weight:600;font-size:.9rem;color:var(--text-primary);text-align:center;">${label}</div>
        <span style="background:var(--warning-light,#FFF3CD);color:#856404;font-size:.75rem;
                     font-weight:600;padding:3px 10px;border-radius:20px;">${pendingLabel}</span>
    </div>`;
}

function renderGuideTab(tabId, isAdmin, isManager, gc) {
    if (tabId === 'vacaciones') {
        return `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px;">
            ${gc.vac.map(s => guideSection(s.title, s.steps)).join('')}
            ${videoCard(gc.vid_vac, gc.pending)}
        </div>`;
    }
    if (tabId === 'eventos') {
        return `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px;">
            ${gc.evt.map(s => guideSection(s.title, s.steps)).join('')}
            ${videoCard(gc.vid_evt, gc.pending)}
        </div>`;
    }
    if (tabId === 'admin') {
        return `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px;">
            ${gc.adm.filter(s => !s.admin || isAdmin).map(s => guideSection(s.title, s.steps)).join('')}
            ${videoCard(gc.vid_adm, gc.pending)}
        </div>`;
    }
    return '';
}

document.addEventListener('DOMContentLoaded', init);
