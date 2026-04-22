/**
 * VacationControl — Frontend Application
 * Single Page Application for vacation management
 */

// ─────────────────────────────────────────────
// State
// ─────────────────────────────────────────────

const State = {
    user: null,
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
    calendarViewType: 'monthly', // monthly, quarterly, annual
    calendarUserId: null,
    filterStatus: 'all',
    selectedEmployeeId: null,
};

// ─────────────────────────────────────────────
// API
// ─────────────────────────────────────────────

async function api(url, options = {}) {
    let res;
    try {
        res = await fetch(url, {
            headers: { 'Content-Type': 'application/json', ...options.headers },
            ...options,
        });
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
    } else {
        app.innerHTML = renderLayout();
        bindSidebarEvents();
        renderPage();
    }
}

// ─── Login ─────────────────────────────

function renderLogin() {
    return `
    <div class="login-container">
        <div class="login-card">
            <div class="login-logo">
                <div class="logo-icon">🌴</div>
                <h1>VacationControl</h1>
                <p>Gestión inteligente de vacaciones</p>
            </div>
            <div class="login-error" id="loginError"></div>
            <form id="loginForm">
                <div class="form-group">
                    <label for="username">Usuario o email</label>
                    <input type="text" id="username" class="form-input" placeholder="Tu usuario o email" autocomplete="username" required>
                </div>
                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <input type="password" id="password" class="form-input" placeholder="Tu contraseña" autocomplete="current-password" required>
                </div>
                <button type="submit" class="btn btn-primary btn-full" id="loginBtn">
                    Iniciar Sesión
                </button>
            </form>
            <p style="margin-top: 16px; font-size: 0.78rem; color: var(--text-dim); text-align: center;">
                Si el servidor acaba de despertar, el primer inicio de sesión puede tardar unos segundos.
            </p>
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
            State.user = data.user;
            renderApp();
            showToast(`¡Bienvenido, ${State.user.first_name}!`, 'success');
        } catch (err) {
            errorEl.textContent = err.message;
            errorEl.classList.add('visible');
            btn.textContent = 'Iniciar Sesión';
            btn.disabled = false;
        }
    });
}

// ─── Layout ────────────────────────────

function renderLayout() {
    const u = State.user;
    const isAdmin = u.role === 'admin';
    const isManager = u.role === 'admin' || u.role === 'manager';

    return `
    <div class="app-layout">
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <div class="sidebar-brand">
                    <div class="brand-icon">🌴</div>
                    <h2>VacationCtrl</h2>
                </div>
            </div>
            <nav class="sidebar-nav">
                <div class="nav-section-title">Principal</div>
                <div class="nav-item active" data-page="dashboard">
                    <span class="nav-icon">📊</span>
                    <span>Dashboard</span>
                </div>
                <div class="nav-item" data-page="calendar">
                    <span class="nav-icon">📅</span>
                    <span>Calendario</span>
                </div>
                <div class="nav-item" data-page="my-vacations">
                    <span class="nav-icon">🏖️</span>
                    <span>Mis Vacaciones</span>
                </div>
                ${isManager ? `
                <div class="nav-section-title">Gestión</div>
                <div class="nav-item" data-page="requests">
                    <span class="nav-icon">📋</span>
                    <span>Solicitudes</span>
                    <span class="nav-badge" id="pendingBadge" style="display:none">0</span>
                </div>
                <div class="nav-item" data-page="team">
                    <span class="nav-icon">👥</span>
                    <span>Equipo</span>
                </div>
                <div class="nav-item" data-page="late-arrivals">
                    <span class="nav-icon">⏰</span>
                    <span>Control Retrasos</span>
                </div>
                ` : ''}
                ${isAdmin ? `
                <div class="nav-section-title">Administración</div>
                <div class="nav-item" data-page="employees">
                    <span class="nav-icon">⚙️</span>
                    <span>Empleados</span>
                </div>
                <div class="nav-item" data-page="holidays">
                    <span class="nav-icon">🎉</span>
                    <span>Festivos</span>
                </div>
                <div class="nav-item" data-page="departments">
                    <span class="nav-icon">🏢</span>
                    <span>Departamentos</span>
                </div>
                ` : ''}
            </nav>
            <div class="sidebar-footer">
                <div class="user-card">
                    <div class="user-avatar" style="background:${u.avatar_color}">${u.initials}</div>
                    <div class="user-info">
                        <div class="name">${u.full_name}</div>
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
        const pending = vacations.filter(v => v.status === 'pending').length;
        const badge = document.getElementById('pendingBadge');
        if (badge) {
            badge.textContent = pending;
            badge.style.display = pending > 0 ? 'inline' : 'none';
        }
    } catch (e) { /* ignore */ }
}

// ─────────────────────────────────────────────
// Dashboard Page
// ─────────────────────────────────────────────

async function loadDashboard(container) {
    const [stats, vacations] = await Promise.all([
        api('/api/stats'),
        api('/api/vacations')
    ]);
    State.stats = stats;
    State.vacations = vacations;

    const u = State.user;
    const isManager = u.role === 'admin' || u.role === 'manager';

    container.innerHTML = `
    <div class="page-enter">
        <div class="page-header">
            <h1>¡Hola, ${u.first_name}! 👋</h1>
            <p>Resumen de vacaciones para ${stats.year}</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card accent">
                <div class="stat-icon">📊</div>
                <div class="stat-value">${u.days_remaining}</div>
                <div class="stat-label">Días Disponibles</div>
                <div class="progress-bar">
                    <div class="progress-fill ${u.days_used / u.total_days > 0.8 ? 'high' : u.days_used / u.total_days > 0.5 ? 'medium' : ''}" 
                         style="width: ${(u.days_used / u.total_days) * 100}%"></div>
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
                <div class="stat-value">${u.total_days}</div>
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
                <td>
                    <div style="display: flex; align-items: center; gap: var(--space-sm);">
                        <div class="user-avatar" style="background:${v.employee_avatar_color}; width:32px; height:32px; font-size:0.7rem;">
                            ${v.employee_initials}
                        </div>
                        <div>
                            <div style="font-weight: 600; font-size: 0.85rem;">${v.employee_name}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">${v.employee_department}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <div style="font-size: 0.85rem;">${formatDate(v.start_date)} — ${formatDate(v.end_date)}</div>
                </td>
                <td><span class="type-badge">${translateType(v.vacation_type)}</span></td>
                <td><span style="font-weight: 700;">${v.business_days}</span></td>
                <td><span class="status-badge ${v.status}">${translateStatus(v.status)}</span></td>
                ${showActions && isManager && v.status === 'pending' ? `
                <td>
                    <div class="action-btns">
                        <button class="btn btn-success btn-sm" onclick="reviewVacation(${v.id}, 'approve')" title="Aprobar">✅</button>
                        <button class="btn btn-danger btn-sm" onclick="reviewVacation(${v.id}, 'reject')" title="Rechazar">❌</button>
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
                ${dayHolidays.map(h => `<div class="day-holiday" title="${h.name}">🎉 ${h.name}</div>`).join('')}
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
                <td style="color: var(--text-muted); font-size: 0.85rem;">${v.reason || '—'}</td>
                <td><span class="status-badge ${v.status}">${translateStatus(v.status)}</span></td>
                <td>
                    ${v.status === 'pending' ? 
                        `<button class="btn btn-danger btn-sm" onclick="deleteVacation(${v.id})">Cancelar</button>` :
                        '—'}
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

    container.innerHTML = `
    <div class="page-enter">
        <div class="page-header">
            <div class="page-header-actions">
                <div>
                    <h1>📋 Solicitudes de Vacaciones</h1>
                    <p>Revisa y gestiona las solicitudes del equipo</p>
                </div>
                <button class="btn btn-secondary" onclick="exportVacations()">📥 Exportar CSV</button>
            </div>
        </div>

        <div class="filters-bar">
            <span class="filter-chip ${State.filterStatus === 'all' ? 'active' : ''}" onclick="setFilter('all')">Todas (${vacations.length})</span>
            <span class="filter-chip ${State.filterStatus === 'pending' ? 'active' : ''}" onclick="setFilter('pending')">Pendientes (${vacations.filter(v => v.status === 'pending').length})</span>
            <span class="filter-chip ${State.filterStatus === 'approved' ? 'active' : ''}" onclick="setFilter('approved')">Aprobadas (${vacations.filter(v => v.status === 'approved').length})</span>
            <span class="filter-chip ${State.filterStatus === 'rejected' ? 'active' : ''}" onclick="setFilter('rejected')">Rechazadas (${vacations.filter(v => v.status === 'rejected').length})</span>
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
        // Refresh user data
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
                    <div class="employee-avatar-lg" style="background: ${u.avatar_color}">${u.initials}</div>
                    <div class="employee-card-info">
                        <h3>${u.full_name}</h3>
                        <p>${u.department} · <span class="role-badge ${u.role}">${translateRole(u.role)}</span></p>
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

    container.innerHTML = `
    <div class="page-enter">
        <div class="page-header">
            <div class="page-header-actions">
                <div>
                    <button class="btn btn-secondary btn-sm" onclick="navigateTo('team')" style="margin-bottom: 10px">← Volver al equipo</button>
                    <h1>👤 Perfil: ${user.full_name}</h1>
                    <p>${user.department} · ${translateRole(user.role)}</p>
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
                                    <div class="user-avatar" style="background:${u.avatar_color}; width:32px; height:32px; font-size:0.7rem;">
                                        ${u.initials}
                                    </div>
                                    <span style="font-weight: 600;">${u.full_name}</span>
                                </div>
                            </td>
                            <td style="color: var(--text-muted);">${u.email}</td>
                            <td>${u.department}</td>
                            <td><span class="role-badge ${u.role}">${translateRole(u.role)}</span></td>
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
                                <span class="holiday-name">${h.name}</span>
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
    const depts = await api('/api/departments');
    State.departments = depts;

    container.innerHTML = `
    <div class="page-enter">
        <div class="page-header">
            <div class="page-header-actions">
                <div>
                    <h1>🏢 Configuración de Departamentos</h1>
                    <p>Gestiona las áreas de la empresa</p>
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
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${depts.map(d => `
                        <tr>
                            <td style="font-weight: 600;">${d.name}</td>
                            <td style="color: var(--text-muted);">${d.description || '—'}</td>
                            <td>
                                <div class="action-btns">
                                    <button class="btn btn-secondary btn-sm" onclick="openEditDeptModal(${d.id})">✏️</button>
                                    <button class="btn btn-danger btn-sm" onclick="deleteDepartment(${d.id})">🗑️</button>
                                </div>
                            </td>
                        </tr>`).join('')}
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
                            <div class="user-avatar" style="background:${r.avatar_color}">${r.initials}</div>
                            <div class="ranking-info">
                                <div class="name">${r.full_name}</div>
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
                                        <div class="user-avatar" style="background:${h.employee_avatar}; width:24px; height:24px; font-size:0.6rem;">${h.employee_initials}</div>
                                        <span>${h.employee_name}</span>
                                    </div>
                                </td>` : ''}
                                <td style="font-weight: 600;">${formatDate(h.date)}</td>
                                <td><span class="status-badge danger">${h.minutes_late} min</span></td>
                                <td style="color: var(--text-muted);">${h.reason || '—'}</td>
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

window.openNewVacationModal = function() {
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
                        <input type="date" class="form-input" id="vacStartDate" required>
                    </div>
                    <div class="form-group">
                        <label>Fecha Fin</label>
                        <input type="date" class="form-input" id="vacEndDate" required>
                    </div>
                </div>
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

    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('vacStartDate').min = today;
    document.getElementById('vacEndDate').min = today;

    document.getElementById('vacStartDate').addEventListener('change', (e) => {
        document.getElementById('vacEndDate').min = e.target.value;
        if (document.getElementById('vacEndDate').value < e.target.value) {
            document.getElementById('vacEndDate').value = e.target.value;
        }
    });
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
            <div class="form-row">
                <div class="form-group">
                    <label>Contraseña</label>
                    <input type="password" class="form-input" id="userPassword" placeholder="Contraseña" value="password123">
                </div>
                <div class="form-group">
                    <label>Días Totales</label>
                    <input type="number" class="form-input" id="userTotalDays" value="22" min="0" max="50">
                </div>
            </div>
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
        password: document.getElementById('userPassword').value,
        total_days: parseInt(document.getElementById('userTotalDays').value)
    };

    if (!data.first_name || !data.last_name || !data.username || !data.email) {
        showToast('Rellena todos los campos obligatorios', 'error');
        return;
    }

    try {
        await api('/api/users', { method: 'POST', body: JSON.stringify(data) });
        closeModal();
        showToast('Empleado creado correctamente', 'success');
        renderPage();
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

    openModal(`
    <div class="modal">
        <div class="modal-header">
            <h3>✏️ Editar Empleado</h3>
            <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">
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
// Helpers
// ─────────────────────────────────────────────

function translateStatus(status) {
    const map = { pending: 'Pendiente', approved: 'Aprobada', rejected: 'Rechazada' };
    return map[status] || status;
}

function translateType(type) {
    const map = {
        vacaciones: '🏖️ Vacaciones',
        asuntos_propios: '📌 Asuntos Propios',
        baja_medica: '🏥 Baja Médica',
        permiso: '📋 Permiso',
        otro: '📝 Otro'
    };
    return map[type] || type;
}

function translateRole(role) {
    const map = { admin: 'Administrador', manager: 'Manager', employee: 'Empleado' };
    return map[role] || role;
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
        const data = await api('/api/me');
        if (data.authenticated) {
            State.user = data.user;
        }
    } catch (e) {
        // Not authenticated
    }
    renderApp();
    if (State.user) {
        renderPage();
    }
}

document.addEventListener('DOMContentLoaded', init);
