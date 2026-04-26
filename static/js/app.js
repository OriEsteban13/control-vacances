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
    lang: localStorage.getItem('lang') || 'es',
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
                </div>
            </div>
            <nav class="sidebar-nav">
                <div class="nav-section-title">${State.lang === 'en' ? 'Main' : 'Principal'}</div>
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
                ${isManager ? `
                <div class="nav-section-title">${State.lang === 'en' ? 'Management' : 'Gestión'}</div>
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
                <div class="nav-section-title">${State.lang === 'en' ? 'Administration' : 'Administración'}</div>
                <div class="nav-item" data-page="employees">
                    <span class="nav-icon">⚙️</span>
                    <span>${t('employees')}</span>
                </div>
                <div class="nav-item" data-page="holidays">
                    <span class="nav-icon">🎉</span>
                    <span>${t('holidays')}</span>
                </div>
                <div class="nav-item" data-page="departments">
                    <span class="nav-icon">🏢</span>
                    <span>${t('departments')}</span>
                </div>
                ` : ''}
                <div class="nav-section-title">${State.lang === 'en' ? 'Account' : 'Cuenta'}</div>
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
            case 'delegations':
                await loadDelegations(main);
                break;
            case 'settings':
                await loadSettings(main);
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
    State.stats = stats;
    State.vacations = vacations;

    const u = State.user;
    const isManager = u.role === 'admin' || u.role === 'manager';
    const allocDays = u.allocated_days || u.total_days;
    const pct = allocDays > 0 ? (u.days_used / allocDays) * 100 : 0;

    container.innerHTML = `
    <div class="page-enter">
        <div class="page-header">
            <h1>¡Hola, ${esc(u.first_name)}! 👋</h1>
            <p>Resumen de vacaciones para ${stats.year}</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card accent">
                <div class="stat-icon">📊</div>
                <div class="stat-value">${u.days_remaining}</div>
                <div class="stat-label">Días Disponibles</div>
                <div class="progress-bar">
                    <div class="progress-fill ${pct > 80 ? 'high' : pct > 50 ? 'medium' : ''}"
                         style="width: ${pct}%"></div>
                </div>
            </div>
            <div class="stat-card success">
                <div class="stat-icon">✅</div>
                <div class="stat-value">${u.days_used}</div>
                <div class="stat-label">Días Usados</div>
            </div>
            <div class="stat-card warning">
                <div class="stat-icon">⏳</div>
                <div class="stat-value">${u.days_pending}</div>
                <div class="stat-label">Días Pendientes</div>
            </div>
            <div class="stat-card info">
                <div class="stat-icon">📅</div>
                <div class="stat-value">${allocDays}</div>
                <div class="stat-label">Total Asignado</div>
            </div>
        </div>

        ${isManager ? `
        <div class="stats-grid">
            <div class="stat-card accent">
                <div class="stat-icon">📝</div>
                <div class="stat-value">${stats.total_requests}</div>
                <div class="stat-label">Total Solicitudes</div>
            </div>
            <div class="stat-card warning">
                <div class="stat-icon">🔔</div>
                <div class="stat-value">${stats.pending_requests}</div>
                <div class="stat-label">Pendientes</div>
            </div>
            <div class="stat-card success">
                <div class="stat-icon">✅</div>
                <div class="stat-value">${stats.approved_requests}</div>
                <div class="stat-label">Aprobadas</div>
            </div>
            <div class="stat-card danger">
                <div class="stat-icon">❌</div>
                <div class="stat-value">${stats.rejected_requests}</div>
                <div class="stat-label">Rechazadas</div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg);">
            <div class="panel">
                <div class="panel-header">
                    <h2>🏖️ Ausentes Hoy</h2>
                    <span style="font-size:0.8rem;color:var(--text-muted);">${absToday.length} persona(s)</span>
                </div>
                <div class="panel-body">
                    ${absToday.length === 0
                        ? '<p style="color:var(--text-muted);font-size:0.85rem;">Nadie está de vacaciones hoy.</p>'
                        : absToday.map(v => `
                            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
                                ${renderAvatarEl(v.employee_avatar_color, v.employee_initials, v.employee_avatar_image, 32)}
                                <div>
                                    <div style="font-weight:600;font-size:0.85rem;">${esc(v.employee_name)}</div>
                                    <div style="font-size:0.75rem;color:var(--text-muted);">hasta ${formatDate(v.end_date)}</div>
                                </div>
                            </div>`).join('')
                    }
                </div>
            </div>
            <div class="panel">
                <div class="panel-header">
                    <h2>📅 Próximas Ausencias</h2>
                    <span style="font-size:0.8rem;color:var(--text-muted);">Próximos 7 días</span>
                </div>
                <div class="panel-body">
                    ${absUpcoming.length === 0
                        ? '<p style="color:var(--text-muted);font-size:0.85rem;">Sin ausencias previstas esta semana.</p>'
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
        ` : ''}

        <div style="display: grid; grid-template-columns: ${isManager ? '1fr 1fr' : '1fr'}; gap: var(--space-lg);">
            <div class="panel">
                <div class="panel-header">
                    <h2>📈 Vacaciones por Mes</h2>
                </div>
                <div class="panel-body">
                    <div class="bar-chart" id="monthlyChart">
                        ${renderMonthlyChart(stats.monthly)}
                    </div>
                </div>
            </div>

            ${isManager ? `
            <div class="panel">
                <div class="panel-header">
                    <h2>🏢 Por Departamento</h2>
                </div>
                <div class="panel-body">
                    ${renderDepartmentStats(stats.departments)}
                </div>
            </div>
            ` : ''}
        </div>

        <div class="panel">
            <div class="panel-header">
                <h2>📋 Últimas Solicitudes</h2>
            </div>
            <div class="panel-body no-padding">
                ${renderVacationTable(vacations.slice(0, 5), false)}
            </div>
        </div>
    </div>`;

    animateBars();
}

function renderMonthlyChart(monthly) {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
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
        return '<div class="empty-state"><p>Sin datos de departamentos</p></div>';
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
        return '<div class="empty-state"><div class="empty-icon">📭</div><h3>Sin solicitudes</h3><p>No hay solicitudes de vacaciones</p></div>';
    }

    const isManager = State.user.role === 'admin' || State.user.role === 'manager';

    return `
    <table class="data-table">
        <thead>
            <tr>
                ${showActions && isManager ? '<th style="width:36px;"><input type="checkbox" id="selectAllVac" onchange="toggleSelectAllVacations(this)" title="Seleccionar todas las pendientes"></th>' : ''}
                <th>Empleado</th>
                <th>Fechas</th>
                <th>Tipo</th>
                <th>Días</th>
                <th>Estado</th>
                ${showActions && isManager ? '<th>Acciones</th>' : ''}
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
                        ` : '—'}
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
                    <h1>🏖️ Mis Vacaciones</h1>
                    <p>Gestiona tus solicitudes de vacaciones</p>
                </div>
                <button class="btn btn-primary" onclick="openNewVacationModal()">+ Nueva Solicitud</button>
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-card success">
                <div class="stat-icon">✅</div>
                <div class="stat-value">${State.user.days_remaining}</div>
                <div class="stat-label">Días Disponibles</div>
            </div>
            <div class="stat-card info">
                <div class="stat-icon">📅</div>
                <div class="stat-value">${State.user.days_used}</div>
                <div class="stat-label">Días Usados</div>
            </div>
            <div class="stat-card warning">
                <div class="stat-icon">⏳</div>
                <div class="stat-value">${State.user.days_pending}</div>
                <div class="stat-label">Días Pendientes</div>
            </div>
        </div>

        <div class="panel">
            <div class="panel-header">
                <h2>Mis Solicitudes</h2>
            </div>
            <div class="panel-body no-padding">
                ${myVacations.length === 0 ? 
                    '<div class="empty-state"><div class="empty-icon">🏖️</div><h3>Sin solicitudes</h3><p>Crea tu primera solicitud de vacaciones</p></div>' :
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
                <th>Fechas</th>
                <th>Tipo</th>
                <th>Días</th>
                <th>Motivo</th>
                <th>Estado</th>
                <th>Acciones</th>
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
                        ? `<button class="btn btn-danger btn-sm" onclick="deleteVacation(${v.id})">Retirar</button>`
                        : v.status === 'approved'
                        ? `<button class="btn btn-warning btn-sm" onclick="openRequestCancelModal(${v.id})">Solicitar cancelación</button>`
                        : v.status === 'cancel_requested'
                        ? `<span style="font-size:0.78rem;color:var(--text-muted);">Cancelación en revisión</span>`
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
                    <h1>📋 Solicitudes de Vacaciones</h1>
                    <p>Revisa y gestiona las solicitudes del equipo</p>
                </div>
                <div style="display:flex;gap:8px;">
                    ${pendingCount > 0 ? `<button class="btn btn-success btn-sm" onclick="bulkApproveSelected()">✅ Aprobar seleccionadas</button>` : ''}
                    <button class="btn btn-secondary" onclick="exportVacations()">📥 Exportar CSV</button>
                </div>
            </div>
        </div>

        <div class="filters-bar">
            <span class="filter-chip ${State.filterStatus === 'all' ? 'active' : ''}" onclick="setFilter('all')">Todas (${vacations.length})</span>
            <span class="filter-chip ${State.filterStatus === 'pending' ? 'active' : ''}" onclick="setFilter('pending')">Pendientes (${pendingCount})</span>
            <span class="filter-chip ${State.filterStatus === 'approved' ? 'active' : ''}" onclick="setFilter('approved')">Aprobadas (${vacations.filter(v => v.status === 'approved').length})</span>
            <span class="filter-chip ${State.filterStatus === 'rejected' ? 'active' : ''}" onclick="setFilter('rejected')">Rechazadas (${vacations.filter(v => v.status === 'rejected').length})</span>
            ${cancelCount > 0 ? `<span class="filter-chip ${State.filterStatus === 'cancel_requested' ? 'active' : ''}" onclick="setFilter('cancel_requested')">Cancelaciones (${cancelCount})</span>` : ''}
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

async function loadTeam(container) {
    const users = await api('/api/users');
    State.users = users;

    container.innerHTML = `
    <div class="page-enter">
        <div class="page-header">
            <h1>👥 Equipo</h1>
            <p>Estado de vacaciones de tu equipo</p>
        </div>

        <div class="employee-grid">
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
                        <div class="emp-stat-label">Usados</div>
                    </div>
                    <div class="emp-stat">
                        <div class="emp-stat-value pending-val">${u.days_pending}</div>
                        <div class="emp-stat-label">Pendientes</div>
                    </div>
                    <div class="emp-stat">
                        <div class="emp-stat-value remaining">${u.days_remaining}</div>
                        <div class="emp-stat-label">Disponibles</div>
                    </div>
                </div>
                <div class="progress-bar" style="margin-top: var(--space-md);">
                    <div class="progress-fill ${u.days_used / u.total_days > 0.8 ? 'high' : u.days_used / u.total_days > 0.5 ? 'medium' : ''}" 
                         style="width: ${(u.days_used / u.total_days) * 100}%"></div>
                </div>
            </div>`).join('')}
        </div>
    </div>`;
}

window.goToEmployeeDetails = function(userId) {
    State.selectedEmployeeId = userId;
    navigateTo('employee-details');
};

async function loadEmployeeDetails(container, userId) {
    if (!userId) {
        container.innerHTML = '<div class="empty-state"><h3>Selecciona un empleado</h3></div>';
        return;
    }

    const [allUsers, allVacations] = await Promise.all([
        api('/api/users'),
        api('/api/vacations')
    ]);

    const user = allUsers.find(u => u.id === userId);
    const userVacations = allVacations.filter(v => v.user_id === userId);

    if (!user) {
        container.innerHTML = '<div class="empty-state"><h3>Empleado no encontrado</h3></div>';
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
                <div class="stat-value">${user.days_remaining}</div>
                <div class="stat-label">Disponibles</div>
            </div>
        </div>

        <div class="employee-detail-grid">
            <div class="panel">
                <div class="panel-header">
                    <h2>Historial de Solicitudes</h2>
                </div>
                <div class="panel-body no-padding">
                    ${renderMyVacationsTable(userVacations)}
                </div>
            </div>
            <div class="panel">
                <div class="panel-header">
                    <h2>Calendario Personal</h2>
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
                    <h1>⚙️ Gestión de Empleados</h1>
                    <p>Administra empleados y asignación de días</p>
                </div>
                <button class="btn btn-primary" onclick="openNewUserModal()">+ Nuevo Empleado</button>
            </div>
        </div>

        <div class="panel" style="margin-bottom:var(--space-lg);">
            <div class="panel-header">
                <h2>🏢 Identidad de Empresa</h2>
            </div>
            <div class="panel-body">
                <div class="company-settings-row">
                    <div class="company-logo-area" onclick="document.getElementById('_logoUploadInput').click()" title="Haz clic para cambiar el logo">
                        ${logo
                            ? `<img src="${logo}" class="company-logo-preview" alt="Logo">`
                            : `<div class="company-logo-placeholder">🌴</div>`}
                        <div class="logo-overlay">📷 Cambiar</div>
                        <input type="file" id="_logoUploadInput" accept="image/*" style="display:none" onchange="handleLogoUpload(this)">
                    </div>
                    <div style="flex:1;">
                        <div class="form-group" style="margin-bottom:var(--space-sm);">
                            <label>Nombre de la empresa</label>
                            <div style="display:flex;gap:8px;align-items:center;">
                                <input type="text" class="form-input" id="_companyNameInput" value="${companyName}" style="max-width:280px;">
                                <button class="btn btn-primary btn-sm" onclick="saveCompanyName()">Guardar</button>
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
                            <th>Empleado</th>
                            <th>Email</th>
                            <th>Departamento</th>
                            <th>Rol</th>
                            <th>Días Totales</th>
                            <th>Usados</th>
                            <th>Disponibles</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(u => `
                        <tr>
                            <td>
                                <div style="display: flex; align-items: center; gap: var(--space-sm);">
                                    ${renderAvatarEl(u.avatar_color, u.initials, u.avatar_image, 32)}
                                    <span style="font-weight: 600;">${esc(u.full_name)}</span>
                                </div>
                            </td>
                            <td style="color: var(--text-muted);">${esc(u.email)}</td>
                            <td>${esc(u.department)}</td>
                            <td><span class="role-badge ${esc(u.role)}">${translateRole(u.role)}</span></td>
                            <td style="font-weight: 700;">${u.total_days}</td>
                            <td style="color: var(--color-info); font-weight: 600;">${u.days_used}</td>
                            <td style="color: var(--color-success); font-weight: 600;">${u.days_remaining}</td>
                            <td>
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
                    <h1>🎉 Festivos</h1>
                    <p>Gestiona los días festivos oficiales</p>
                </div>
                <button class="btn btn-primary" onclick="openNewHolidayModal()">+ Nuevo Festivo</button>
            </div>
        </div>

        <div class="panel">
            <div class="panel-body">
                ${holidays.length === 0 ? 
                    '<div class="empty-state"><div class="empty-icon">🎉</div><h3>Sin festivos</h3><p>Añade los días festivos del año</p></div>' :
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
                    <h1>🏢 Configuración de Departamentos</h1>
                    <p>Gestiona las áreas de la empresa y sus reglas de vacaciones</p>
                </div>
                <button class="btn btn-primary" onclick="openNewDeptModal()">+ Nuevo Departamento</button>
            </div>
        </div>

        <div class="panel">
            <div class="panel-body no-padding">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Máx. Simultáneos</th>
                            <th>Antelación mín.</th>
                            <th>Máx. consecutivos</th>
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
                            <td>${rule?.min_advance_days ? rule.min_advance_days + ' días' : '<span style="color:var(--text-dim)">—</span>'}</td>
                            <td>${rule?.max_consecutive_days ? rule.max_consecutive_days + ' días' : '<span style="color:var(--text-dim)">—</span>'}</td>
                            <td>
                                <div class="action-btns">
                                    <button class="btn btn-secondary btn-sm" onclick="openEditDeptModal(${d.id})">✏️</button>
                                    <button class="btn btn-secondary btn-sm" onclick="openDeptRulesModal('${esc(d.name)}', ${rule ? rule.id : 'null'}, ${JSON.stringify(rule || {}).replace(/"/g,'&quot;')})" title="Configurar reglas">⚙️ Reglas</button>
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
                <h1>⏰ Control de Retrasos</h1>
                <p>Monitoreo de puntualidad y ranking de equipo</p>
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
    const remaining = State.user.days_remaining;
    const after = remaining - days;
    const color = after < 0 ? 'var(--color-danger)' : after <= 2 ? 'var(--color-warning)' : 'var(--color-success)';
    counter.innerHTML = `<span style="background:rgba(255,255,255,0.06);border-radius:8px;padding:8px 12px;display:block;font-size:0.85rem;">
        <strong>${days}</strong> día(s) hábil(es) · Disponibles: <strong>${remaining}</strong> · Quedarían: <strong style="color:${color}">${after}</strong>
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
                    <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:16px;">${State.lang === 'en' ? 'Choose the interface language.' : 'Elige el idioma de la interfaz.'}</p>
                    <div style="display:flex;gap:12px;">
                        <button class="btn ${State.lang === 'es' ? 'btn-primary' : 'btn-secondary'}" style="flex:1;" onclick="setLanguage('es')">🇪🇸 Castellano</button>
                        <button class="btn ${State.lang === 'en' ? 'btn-primary' : 'btn-secondary'}" style="flex:1;" onclick="setLanguage('en')">🇬🇧 English</button>
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
    return (State.lang === 'en' ? en : es)[type] || type;
}

function translateRole(role) {
    const keys = { admin: 'admin', manager: 'manager', employee: 'employee' };
    return keys[role] ? t(keys[role]) : role;
}

function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getMonthName(month) {
    const months = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return months[month];
}

// ─────────────────────────────────────────────
// Init
// ─────────────────────────────────────────────

async function init() {
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

document.addEventListener('DOMContentLoaded', init);
