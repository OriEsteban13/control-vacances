"""
Vacation Control - Backend Application
Flask API for managing employee vacations
"""

from flask import Flask, render_template, request, jsonify, redirect, url_for, session, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, date, timedelta
from dateutil import parser as date_parser
from functools import wraps
import json
import os
import io
import csv
import secrets
import hashlib
from flask import Response
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_talisman import Talisman
from flask_mail import Mail, Message

app = Flask(__name__)

# ─── Secret key — REQUIRED, no hardcoded fallback ─────────────────────────────
_secret_key = os.environ.get('SECRET_KEY')
if not _secret_key:
    raise RuntimeError(
        "SECRET_KEY environment variable is not set. "
        "Generate one: python -c \"import secrets; print(secrets.token_hex(32))\""
    )
app.config['SECRET_KEY'] = _secret_key

# ─── Session cookies ───────────────────────────────────────────────────────────
if os.environ.get('RENDER'):
    app.config['SESSION_COOKIE_SECURE'] = True
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['REMEMBER_COOKIE_SECURE'] = True
    app.config['REMEMBER_COOKIE_HTTPONLY'] = True
    app.config['REMEMBER_COOKIE_SAMESITE'] = 'Lax'

# ─── Database ──────────────────────────────────────────────────────────────────
_database_url = os.environ.get('DATABASE_URL')
if _database_url:
    if _database_url.startswith('postgres://'):
        _database_url = _database_url.replace('postgres://', 'postgresql://', 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = _database_url
    _db_dir = None
else:
    _db_dir = '/tmp' if os.environ.get('RENDER') else os.path.join(
        os.path.dirname(os.path.abspath(__file__)), 'instance'
    )
    os.makedirs(_db_dir, exist_ok=True)
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{_db_dir}/vacations.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# ─── Email ─────────────────────────────────────────────────────────────────────
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER', 'noreply@vacationcontrol.com')

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login_page'
mail = Mail(app)

# ─── Rate limiter ──────────────────────────────────────────────────────────────
limiter = Limiter(
    key_func=get_remote_address,
    app=app,
    default_limits=[],
    storage_uri="memory://"
)

# ─── Security headers (HTTPS / Render only) ───────────────────────────────────
if os.environ.get('RENDER'):
    _csp = {
        'default-src': "'self'",
        'script-src': ["'self'", "'unsafe-inline'"],
        'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        'font-src': ["'self'", "https://fonts.gstatic.com"],
        'img-src': ["'self'", "data:"],
        'connect-src': "'self'",
    }
    Talisman(
        app,
        force_https=True,
        strict_transport_security=True,
        strict_transport_security_max_age=31536000,
        content_security_policy=_csp,
        referrer_policy='strict-origin-when-cross-origin',
        x_content_type_options=True,
        x_xss_protection=False,
    )


# ─────────────────────────────────────────────
# Models
# ─────────────────────────────────────────────

class Department(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'description': self.description}


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    department = db.Column(db.String(100), nullable=False, default='General')
    role = db.Column(db.String(20), nullable=False, default='employee')
    total_days = db.Column(db.Integer, nullable=False, default=22)
    avatar_color = db.Column(db.String(7), default='#6C5CE7')
    avatar_image = db.Column(db.Text, nullable=True)
    must_change_password = db.Column(db.Boolean, default=False)
    is_deleted = db.Column(db.Boolean, default=False)
    deleted_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    hire_date = db.Column(db.Date, nullable=True)

    vacations = db.relationship('VacationRequest', backref='employee', lazy=True,
                                foreign_keys='VacationRequest.user_id')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password, method='pbkdf2:sha256')

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def initials(self):
        return f"{self.first_name[0]}{self.last_name[0]}".upper()

    def days_used(self, year=None):
        if year is None:
            year = date.today().year
        approved = VacationRequest.query.filter(
            VacationRequest.user_id == self.id,
            VacationRequest.status == 'approved',
            db.extract('year', VacationRequest.start_date) == year
        ).all()
        return sum(v.business_days for v in approved)

    def days_pending(self, year=None):
        if year is None:
            year = date.today().year
        pending = VacationRequest.query.filter(
            VacationRequest.user_id == self.id,
            VacationRequest.status == 'pending',
            db.extract('year', VacationRequest.start_date) == year
        ).all()
        return sum(v.business_days for v in pending)

    def get_allocation(self, year=None):
        if year is None:
            year = date.today().year
        balance = VacationBalance.query.filter_by(
            user_id=self.id, year=year, vacation_type='vacaciones'
        ).first()
        if balance:
            carried = 0
            if balance.carried_over:
                if not balance.carryover_expiry or balance.carryover_expiry >= date.today():
                    carried = balance.carried_over
            return balance.total_days + carried
        if self.hire_date:
            return calculate_prorated_days(self.total_days, self.hire_date, year)
        return self.total_days

    def days_remaining(self, year=None):
        return self.get_allocation(year) - self.days_used(year)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': self.full_name,
            'initials': self.initials,
            'department': self.department,
            'role': self.role,
            'total_days': self.total_days,
            'allocated_days': self.get_allocation(),
            'days_used': self.days_used(),
            'days_pending': self.days_pending(),
            'days_remaining': self.days_remaining(),
            'avatar_color': self.avatar_color,
            'avatar_image': self.avatar_image,
            'must_change_password': self.must_change_password,
            'hire_date': self.hire_date.isoformat() if self.hire_date else None,
        }


class VacationRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    vacation_type = db.Column(db.String(50), nullable=False, default='vacaciones')
    reason = db.Column(db.Text, default='')
    status = db.Column(db.String(20), nullable=False, default='pending')
    reviewed_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    review_comment = db.Column(db.Text, default='')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    reviewed_at = db.Column(db.DateTime, nullable=True)
    cancel_reason = db.Column(db.Text, default='')
    cancellation_requested_at = db.Column(db.DateTime, nullable=True)

    reviewer = db.relationship('User', foreign_keys=[reviewed_by])

    @property
    def business_days(self):
        holiday_dates = {h.date for h in PublicHoliday.query.filter(
            PublicHoliday.date >= self.start_date,
            PublicHoliday.date <= self.end_date,
        ).all()}
        days = 0
        current = self.start_date
        while current <= self.end_date:
            if current.weekday() < 5 and current not in holiday_dates:
                days += 1
            current += timedelta(days=1)
        return days

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'employee_name': self.employee.full_name if self.employee else 'Unknown',
            'employee_initials': self.employee.initials if self.employee else '??',
            'employee_department': self.employee.department if self.employee else '',
            'employee_avatar_color': self.employee.avatar_color if self.employee else '#666',
            'employee_avatar_image': self.employee.avatar_image if self.employee else None,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat(),
            'vacation_type': self.vacation_type,
            'reason': self.reason,
            'status': self.status,
            'business_days': self.business_days,
            'reviewed_by': self.reviewed_by,
            'reviewer_name': self.reviewer.full_name if self.reviewer else None,
            'review_comment': self.review_comment,
            'cancel_reason': self.cancel_reason,
            'cancellation_requested_at': self.cancellation_requested_at.isoformat() if self.cancellation_requested_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'reviewed_at': self.reviewed_at.isoformat() if self.reviewed_at else None,
        }


class PublicHoliday(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    name = db.Column(db.String(200), nullable=False)
    year = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {'id': self.id, 'date': self.date.isoformat(), 'name': self.name, 'year': self.year}


class LateArrival(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    minutes_late = db.Column(db.Integer, default=0)
    reason = db.Column(db.String(255), default='')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    employee = db.relationship('User', backref='late_arrivals')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'employee_name': self.employee.full_name if self.employee else 'Unknown',
            'employee_avatar': self.employee.avatar_color if self.employee else '#666',
            'employee_avatar_image': self.employee.avatar_image if self.employee else None,
            'employee_initials': self.employee.initials if self.employee else '??',
            'date': self.date.isoformat(),
            'minutes_late': self.minutes_late,
            'reason': self.reason,
            'created_at': self.created_at.isoformat(),
        }


class CompanySettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(100), default='VacationControl')
    logo_data = db.Column(db.Text, nullable=True)


class PasswordResetToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    token_hash = db.Column(db.String(64), unique=True, nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    used = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User')


class AuditLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    actor_id = db.Column(db.Integer, nullable=True)
    actor_username = db.Column(db.String(80), nullable=True)
    action = db.Column(db.String(100), nullable=False)
    target_type = db.Column(db.String(50), nullable=True)
    target_id = db.Column(db.Integer, nullable=True)
    details = db.Column(db.Text, nullable=True)
    ip_address = db.Column(db.String(45), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'actor_id': self.actor_id,
            'actor_username': self.actor_username,
            'action': self.action,
            'target_type': self.target_type,
            'target_id': self.target_id,
            'details': self.details,
            'ip_address': self.ip_address,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class VacationBalance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    vacation_type = db.Column(db.String(50), nullable=False, default='vacaciones')
    total_days = db.Column(db.Integer, nullable=False, default=0)
    carried_over = db.Column(db.Integer, nullable=False, default=0)
    carryover_expiry = db.Column(db.Date, nullable=True)

    user = db.relationship('User')
    __table_args__ = (db.UniqueConstraint('user_id', 'year', 'vacation_type', name='uq_balance'),)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'year': self.year,
            'vacation_type': self.vacation_type,
            'total_days': self.total_days,
            'carried_over': self.carried_over,
            'carryover_expiry': self.carryover_expiry.isoformat() if self.carryover_expiry else None,
        }


class DepartmentRule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    department = db.Column(db.String(100), unique=True, nullable=False)
    max_simultaneous = db.Column(db.Integer, nullable=True)
    min_advance_days = db.Column(db.Integer, nullable=True)
    max_consecutive_days = db.Column(db.Integer, nullable=True)
    blackout_periods = db.Column(db.Text, nullable=True)  # JSON: [{start, end, reason}]

    def to_dict(self):
        return {
            'id': self.id,
            'department': self.department,
            'max_simultaneous': self.max_simultaneous,
            'min_advance_days': self.min_advance_days,
            'max_consecutive_days': self.max_consecutive_days,
            'blackout_periods': json.loads(self.blackout_periods) if self.blackout_periods else [],
        }


class ManagerDelegation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    delegator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    delegate_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    delegator = db.relationship('User', foreign_keys=[delegator_id])
    delegate = db.relationship('User', foreign_keys=[delegate_id])

    def to_dict(self):
        return {
            'id': self.id,
            'delegator_id': self.delegator_id,
            'delegator_name': self.delegator.full_name if self.delegator else None,
            'delegate_id': self.delegate_id,
            'delegate_name': self.delegate.full_name if self.delegate else None,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat(),
            'active': self.active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


@login_manager.user_loader
def load_user(user_id):
    try:
        u = db.session.get(User, int(user_id))
        return u if (u and not u.is_deleted) else None
    except Exception:
        return None


# ─────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────

def get_client_ip():
    return request.headers.get('X-Forwarded-For', request.remote_addr or '').split(',')[0].strip()


def log_audit(action, target_type=None, target_id=None, details=None):
    try:
        entry = AuditLog(
            actor_id=current_user.id if current_user.is_authenticated else None,
            actor_username=current_user.username if current_user.is_authenticated else None,
            action=action,
            target_type=target_type,
            target_id=target_id,
            details=details,
            ip_address=get_client_ip(),
        )
        db.session.add(entry)
        db.session.commit()
    except Exception:
        pass


def send_email(to, subject, body):
    if not app.config.get('MAIL_USERNAME'):
        print(f"[EMAIL — no SMTP configured] To: {to}\nSubject: {subject}\n{body}")
        return True
    try:
        msg = Message(subject=subject, recipients=[to], body=body)
        mail.send(msg)
        return True
    except Exception as e:
        print(f"[EMAIL ERROR] {e}")
        return False


def _generate_csrf():
    token = secrets.token_hex(32)
    session['csrf_token'] = token
    return token


def fmt_date(d):
    return d.strftime('%d/%m/%Y') if d else ''


def calculate_prorated_days(total_days, hire_date, year):
    if not hire_date or hire_date.year < year:
        return total_days
    if hire_date.year > year:
        return 0
    year_end = date(year, 12, 31)
    total_days_in_year = (date(year, 12, 31) - date(year, 1, 1)).days + 1
    days_in_year = (year_end - hire_date).days + 1
    return round(total_days * days_in_year / total_days_in_year)


def can_approve_for(user):
    """Check if user has approval authority (own role or via active delegation)."""
    if user.role in ['admin', 'manager']:
        return True
    today = date.today()
    delegation = ManagerDelegation.query.filter(
        ManagerDelegation.delegate_id == user.id,
        ManagerDelegation.active == True,
        ManagerDelegation.start_date <= today,
        ManagerDelegation.end_date >= today,
    ).first()
    return delegation is not None


def notify_vacation_created(vacation):
    employee = db.session.get(User, vacation.user_id)
    if not employee:
        return
    send_email(
        employee.email,
        f"Solicitud de vacaciones recibida — {fmt_date(vacation.start_date)}",
        f"Hola {employee.first_name},\n\n"
        f"Tu solicitud de {vacation.business_days} días hábiles "
        f"({fmt_date(vacation.start_date)} — {fmt_date(vacation.end_date)}) "
        f"ha sido enviada y está pendiente de aprobación.\n\n— VacationControl",
    )
    managers = User.query.filter(
        User.role.in_(['admin', 'manager']),
        User.is_deleted == False,
        User.id != employee.id,
    ).all()
    for mgr in managers:
        send_email(
            mgr.email,
            f"Nueva solicitud de vacaciones — {employee.full_name}",
            f"Hola {mgr.first_name},\n\n"
            f"{employee.full_name} ha solicitado {vacation.business_days} días hábiles "
            f"({fmt_date(vacation.start_date)} — {fmt_date(vacation.end_date)}).\n\n"
            f"Accede a la aplicación para revisarla.\n\n— VacationControl",
        )


def notify_vacation_reviewed(vacation, action):
    employee = db.session.get(User, vacation.user_id)
    if not employee:
        return
    label = 'aprobada' if action == 'approve' else 'rechazada'
    send_email(
        employee.email,
        f"Tu solicitud de vacaciones ha sido {label}",
        f"Hola {employee.first_name},\n\n"
        f"Tu solicitud del {fmt_date(vacation.start_date)} al {fmt_date(vacation.end_date)} "
        f"({vacation.business_days} días hábiles) ha sido {label}.\n\n"
        + (f"Comentario: {vacation.review_comment}\n\n" if vacation.review_comment else "")
        + "— VacationControl",
    )


def notify_cancel_requested(vacation):
    employee = db.session.get(User, vacation.user_id)
    managers = User.query.filter(
        User.role.in_(['admin', 'manager']),
        User.is_deleted == False,
    ).all()
    for mgr in managers:
        send_email(
            mgr.email,
            f"Solicitud de cancelación — {employee.full_name if employee else ''}",
            f"Hola {mgr.first_name},\n\n"
            f"{employee.full_name if employee else 'Un empleado'} ha solicitado cancelar sus vacaciones "
            f"del {fmt_date(vacation.start_date)} al {fmt_date(vacation.end_date)}.\n\n"
            + (f"Motivo: {vacation.cancel_reason}\n\n" if vacation.cancel_reason else "")
            + "Accede a la aplicación para aprobar o rechazar la cancelación.\n\n— VacationControl",
        )


def notify_cancel_reviewed(vacation, approved):
    employee = db.session.get(User, vacation.user_id)
    if not employee:
        return
    label = 'aprobada' if approved else 'rechazada'
    send_email(
        employee.email,
        f"Tu solicitud de cancelación ha sido {label}",
        f"Hola {employee.first_name},\n\n"
        f"Tu solicitud de cancelación de vacaciones "
        f"({fmt_date(vacation.start_date)} — {fmt_date(vacation.end_date)}) "
        f"ha sido {label}.\n\n— VacationControl",
    )


# ─── CSRF validation on all state-changing requests ───────────────────────────
_CSRF_EXEMPT = {'/api/login', '/api/forgot-password', '/api/reset-password', '/health'}

@app.before_request
def _check_csrf():
    if request.method not in ('POST', 'PUT', 'DELETE', 'PATCH'):
        return
    if request.path in _CSRF_EXEMPT:
        return
    if not current_user.is_authenticated:
        return
    client_token = request.headers.get('X-CSRF-Token', '')
    stored = session.get('csrf_token', '')
    if not stored or not secrets.compare_digest(client_token, stored):
        return jsonify({'success': False, 'error': 'Token CSRF inválido. Recarga la página.'}), 403


# ─────────────────────────────────────────────
# Routes — Pages
# ─────────────────────────────────────────────

@app.route('/health')
def health():
    return jsonify({'status': 'ok'})

@app.route('/robots.txt')
def robots_txt():
    return ("User-agent: *\nDisallow: /\n", 200, {'Content-Type': 'text/plain'})

@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login_page'))

@app.route('/login')
def login_page():
    return render_template('index.html')

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('index.html')

@app.route('/reset-password')
def reset_password_page():
    return render_template('index.html')

@app.route('/privacy')
def privacy():
    return render_template('privacy.html')

@app.route('/legal')
def legal():
    return render_template('legal.html')


# ─────────────────────────────────────────────
# API Routes — Auth
# ─────────────────────────────────────────────

@app.route('/api/login', methods=['POST'])
@limiter.limit("5 per 15 minutes")
def api_login():
    data = request.get_json(silent=True) or {}
    login_identifier = data.get('username', '').strip()
    user = User.query.filter(
        db.or_(User.username == login_identifier, User.email == login_identifier),
        User.is_deleted == False
    ).first()

    if user and user.check_password(data.get('password', '')):
        login_user(user, remember=True)
        csrf_token = _generate_csrf()
        log_audit('login', 'user', user.id)
        return jsonify({'success': True, 'user': user.to_dict(), 'csrf_token': csrf_token})

    log_audit('login_failed', 'user', None, f"identifier={login_identifier}")
    return jsonify({'success': False, 'error': 'Usuario o contraseña incorrectos'}), 401


@app.route('/api/logout', methods=['POST'])
@login_required
def api_logout():
    log_audit('logout', 'user', current_user.id)
    logout_user()
    session.clear()
    return jsonify({'success': True})


@app.route('/api/me')
def api_me():
    if current_user.is_authenticated:
        csrf_token = session.get('csrf_token') or _generate_csrf()
        return jsonify({'authenticated': True, 'user': current_user.to_dict(), 'csrf_token': csrf_token})
    return jsonify({'authenticated': False})


@app.route('/api/forgot-password', methods=['POST'])
@limiter.limit("3 per hour")
def forgot_password():
    data = request.get_json(silent=True) or {}
    email = data.get('email', '').strip().lower()
    user = User.query.filter(
        db.func.lower(User.email) == email,
        User.is_deleted == False
    ).first()
    if user:
        # Invalidate previous tokens
        PasswordResetToken.query.filter_by(user_id=user.id, used=False).update({'used': True})
        db.session.flush()
        raw_token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
        reset_record = PasswordResetToken(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=datetime.utcnow() + timedelta(hours=1),
        )
        db.session.add(reset_record)
        db.session.commit()
        base = request.host_url.rstrip('/')
        reset_url = f"{base}/reset-password?token={raw_token}"
        send_email(
            user.email,
            "Recuperación de contraseña — VacationControl",
            f"Hola {user.first_name},\n\n"
            f"Has solicitado restablecer tu contraseña.\n\n"
            f"Haz clic en este enlace (válido 1 hora):\n{reset_url}\n\n"
            f"Si no has solicitado esto, ignora este correo.\n\n"
            f"— VacationControl",
        )
    # Always return success to prevent user enumeration
    return jsonify({'success': True, 'message': 'Si el email existe recibirás un enlace de recuperación en breve.'})


@app.route('/api/reset-password', methods=['POST'])
@limiter.limit("5 per hour")
def reset_password():
    data = request.get_json(silent=True) or {}
    raw_token = data.get('token', '')
    new_password = data.get('password', '')

    if len(new_password) < 8:
        return jsonify({'success': False, 'error': 'La contraseña debe tener al menos 8 caracteres'}), 400

    token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
    record = PasswordResetToken.query.filter_by(token_hash=token_hash, used=False).first()

    if not record or record.expires_at < datetime.utcnow():
        return jsonify({'success': False, 'error': 'Enlace inválido o caducado'}), 400

    record.used = True
    record.user.set_password(new_password)
    record.user.must_change_password = False
    db.session.commit()
    log_audit('reset_password', 'user', record.user_id)
    return jsonify({'success': True})


@app.route('/api/change-password', methods=['POST'])
@login_required
def change_password():
    data = request.get_json(silent=True) or {}
    if not current_user.check_password(data.get('current_password', '')):
        return jsonify({'success': False, 'error': 'Contraseña actual incorrecta'}), 400
    new_password = data.get('new_password', '')
    if len(new_password) < 8:
        return jsonify({'success': False, 'error': 'La nueva contraseña debe tener al menos 8 caracteres'}), 400
    current_user.set_password(new_password)
    current_user.must_change_password = False
    db.session.commit()
    log_audit('change_password', 'user', current_user.id)
    return jsonify({'success': True, 'user': current_user.to_dict()})


# ─────────────────────────────────────────────
# API Routes — Vacations
# ─────────────────────────────────────────────

@app.route('/api/vacations', methods=['GET'])
@login_required
def get_vacations():
    year = request.args.get('year', date.today().year, type=int)
    if can_approve_for(current_user):
        vacations = VacationRequest.query.filter(
            db.extract('year', VacationRequest.start_date) == year
        ).order_by(VacationRequest.created_at.desc()).all()
    else:
        vacations = VacationRequest.query.filter_by(user_id=current_user.id).filter(
            db.extract('year', VacationRequest.start_date) == year
        ).order_by(VacationRequest.created_at.desc()).all()
    return jsonify([v.to_dict() for v in vacations])


@app.route('/api/vacations/export', methods=['GET'])
@login_required
def export_vacations():
    year = request.args.get('year', date.today().year, type=int)
    if current_user.role in ['admin', 'manager']:
        vacations = VacationRequest.query.filter(
            db.extract('year', VacationRequest.start_date) == year
        ).order_by(VacationRequest.created_at.desc()).all()
    else:
        vacations = VacationRequest.query.filter_by(user_id=current_user.id).filter(
            db.extract('year', VacationRequest.start_date) == year
        ).order_by(VacationRequest.created_at.desc()).all()

    si_output = io.StringIO()
    writer = csv.writer(si_output)
    writer.writerow(['ID', 'Empleado', 'Departamento', 'Fecha Inicio', 'Fecha Fin',
                     'Tipo', 'Dias Laborables', 'Estado', 'Motivo'])
    for v in vacations:
        writer.writerow([
            v.id,
            v.employee.full_name if v.employee else 'Desconocido',
            v.employee.department if v.employee else '',
            v.start_date.isoformat(), v.end_date.isoformat(),
            v.vacation_type, v.business_days, v.status, v.reason,
        ])
    output = make_response(si_output.getvalue())
    output.headers["Content-Disposition"] = f"attachment; filename=vacaciones_{year}.csv"
    output.headers["Content-type"] = "text/csv"
    return output


@app.route('/api/vacations', methods=['POST'])
@login_required
def create_vacation():
    data = request.get_json()
    try:
        start = date_parser.parse(data['start_date']).date()
        end = date_parser.parse(data['end_date']).date()
    except (KeyError, ValueError):
        return jsonify({'success': False, 'error': 'Fechas inválidas'}), 400

    if start > end:
        return jsonify({'success': False, 'error': 'La fecha de inicio debe ser anterior a la de fin'}), 400
    if start < date.today():
        return jsonify({'success': False, 'error': 'No se pueden solicitar vacaciones en fechas pasadas'}), 400

    vacation = VacationRequest(
        user_id=current_user.id,
        start_date=start,
        end_date=end,
        vacation_type=data.get('vacation_type', 'vacaciones'),
        reason=data.get('reason', ''),
    )

    if vacation.business_days > current_user.days_remaining():
        return jsonify({'success': False, 'error': (
            f'No tienes suficientes días disponibles. '
            f'Disponibles: {current_user.days_remaining()}, Solicitados: {vacation.business_days}'
        )}), 400

    overlapping = VacationRequest.query.filter(
        VacationRequest.user_id == current_user.id,
        VacationRequest.status.in_(['pending', 'approved', 'cancel_requested']),
        VacationRequest.start_date <= end,
        VacationRequest.end_date >= start,
    ).first()
    if overlapping:
        return jsonify({'success': False, 'error': 'Ya tienes una solicitud en esas fechas'}), 400

    # Department rule validations
    dept_rule = DepartmentRule.query.filter_by(department=current_user.department).first()
    if dept_rule:
        if dept_rule.min_advance_days:
            min_start = date.today() + timedelta(days=dept_rule.min_advance_days)
            if start < min_start:
                return jsonify({'success': False, 'error': (
                    f'Tu departamento requiere solicitar vacaciones con al menos '
                    f'{dept_rule.min_advance_days} días de antelación'
                )}), 400
        if dept_rule.max_consecutive_days and vacation.business_days > dept_rule.max_consecutive_days:
            return jsonify({'success': False, 'error': (
                f'Tu departamento permite un máximo de {dept_rule.max_consecutive_days} '
                f'días hábiles consecutivos'
            )}), 400
        if dept_rule.blackout_periods:
            try:
                blackouts = json.loads(dept_rule.blackout_periods)
                for bp in blackouts:
                    bp_start = date_parser.parse(bp['start']).date()
                    bp_end = date_parser.parse(bp['end']).date()
                    if start <= bp_end and end >= bp_start:
                        reason_txt = f" ({bp['reason']})" if bp.get('reason') else ''
                        return jsonify({'success': False, 'error': (
                            f'Período bloqueado en tu departamento: '
                            f'{fmt_date(bp_start)} — {fmt_date(bp_end)}{reason_txt}'
                        )}), 400
            except (json.JSONDecodeError, KeyError):
                pass
        if dept_rule.max_simultaneous:
            overlap_count = db.session.query(db.func.count(VacationRequest.id)).join(
                User, User.id == VacationRequest.user_id
            ).filter(
                User.department == current_user.department,
                VacationRequest.user_id != current_user.id,
                VacationRequest.status.in_(['approved', 'pending']),
                VacationRequest.start_date <= end,
                VacationRequest.end_date >= start,
            ).scalar() or 0
            if overlap_count >= dept_rule.max_simultaneous:
                return jsonify({'success': False, 'error': (
                    f'Ya hay {overlap_count} persona(s) de tu departamento ausentes en esas fechas. '
                    f'Máximo simultáneo: {dept_rule.max_simultaneous}'
                )}), 400

    db.session.add(vacation)
    db.session.commit()
    log_audit('create_vacation', 'vacation', vacation.id, f"{start} - {end}")
    try:
        notify_vacation_created(vacation)
    except Exception:
        pass
    return jsonify({'success': True, 'vacation': vacation.to_dict()})


@app.route('/api/vacations/<int:vacation_id>', methods=['DELETE'])
@login_required
def delete_vacation(vacation_id):
    vacation = db.session.get(VacationRequest, vacation_id)
    if not vacation:
        return jsonify({'success': False, 'error': 'Solicitud no encontrada'}), 404
    if vacation.user_id != current_user.id and current_user.role not in ['admin', 'manager']:
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    if vacation.status == 'approved' and current_user.role == 'employee':
        return jsonify({'success': False, 'error': 'No puedes cancelar vacaciones ya aprobadas'}), 400

    log_audit('delete_vacation', 'vacation', vacation_id)
    db.session.delete(vacation)
    db.session.commit()
    return jsonify({'success': True})


@app.route('/api/vacations/<int:vacation_id>/review', methods=['POST'])
@login_required
def review_vacation(vacation_id):
    if not can_approve_for(current_user):
        return jsonify({'success': False, 'error': 'No autorizado'}), 403

    data = request.get_json()
    vacation = db.session.get(VacationRequest, vacation_id)
    if not vacation:
        return jsonify({'success': False, 'error': 'Solicitud no encontrada'}), 404

    if vacation.user_id == current_user.id:
        return jsonify({'success': False, 'error': 'No puedes aprobar o rechazar tu propia solicitud'}), 403

    action = data.get('action')
    if action not in ['approve', 'reject']:
        return jsonify({'success': False, 'error': 'Acción inválida'}), 400
    if vacation.status not in ['pending']:
        return jsonify({'success': False, 'error': f'Esta solicitud ya está en estado: {vacation.status}'}), 400

    vacation.status = 'approved' if action == 'approve' else 'rejected'
    vacation.reviewed_by = current_user.id
    vacation.review_comment = data.get('comment', '')
    vacation.reviewed_at = datetime.utcnow()
    db.session.commit()
    log_audit(f'vacation_{action}d', 'vacation', vacation_id)
    try:
        notify_vacation_reviewed(vacation, action)
    except Exception:
        pass
    return jsonify({'success': True, 'vacation': vacation.to_dict()})


@app.route('/api/vacations/<int:vacation_id>/request-cancel', methods=['POST'])
@login_required
def request_cancel_vacation(vacation_id):
    vacation = db.session.get(VacationRequest, vacation_id)
    if not vacation:
        return jsonify({'success': False, 'error': 'Solicitud no encontrada'}), 404
    if vacation.user_id != current_user.id and current_user.role not in ['admin', 'manager']:
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    if vacation.status != 'approved':
        return jsonify({'success': False, 'error': 'Solo se pueden cancelar vacaciones aprobadas'}), 400

    data = request.get_json() or {}
    vacation.status = 'cancel_requested'
    vacation.cancel_reason = data.get('reason', '')
    vacation.cancellation_requested_at = datetime.utcnow()
    db.session.commit()
    log_audit('cancel_requested', 'vacation', vacation_id)
    try:
        notify_cancel_requested(vacation)
    except Exception:
        pass
    return jsonify({'success': True, 'vacation': vacation.to_dict()})


@app.route('/api/vacations/<int:vacation_id>/review-cancel', methods=['POST'])
@login_required
def review_cancel_vacation(vacation_id):
    if not can_approve_for(current_user):
        return jsonify({'success': False, 'error': 'No autorizado'}), 403

    vacation = db.session.get(VacationRequest, vacation_id)
    if not vacation:
        return jsonify({'success': False, 'error': 'Solicitud no encontrada'}), 404
    if vacation.status != 'cancel_requested':
        return jsonify({'success': False, 'error': 'Esta solicitud no está pendiente de cancelación'}), 400

    data = request.get_json() or {}
    action = data.get('action')
    if action not in ['approve', 'reject']:
        return jsonify({'success': False, 'error': 'Acción inválida'}), 400

    approved = action == 'approve'
    vacation.status = 'cancelled' if approved else 'approved'
    vacation.reviewed_by = current_user.id
    vacation.reviewed_at = datetime.utcnow()
    db.session.commit()
    log_audit(f'cancel_{"approved" if approved else "rejected"}', 'vacation', vacation_id)
    try:
        notify_cancel_reviewed(vacation, approved)
    except Exception:
        pass
    return jsonify({'success': True, 'vacation': vacation.to_dict()})


@app.route('/api/vacations/bulk-review', methods=['POST'])
@login_required
def bulk_review_vacations():
    if not can_approve_for(current_user):
        return jsonify({'success': False, 'error': 'No autorizado'}), 403

    data = request.get_json() or {}
    action = data.get('action')
    ids = data.get('ids', [])
    if action not in ['approve', 'reject']:
        return jsonify({'success': False, 'error': 'Acción inválida'}), 400
    if not ids:
        return jsonify({'success': False, 'error': 'No se han seleccionado solicitudes'}), 400

    results = {'processed': 0, 'skipped': 0}
    for vid in ids:
        vacation = db.session.get(VacationRequest, int(vid))
        if not vacation or vacation.status != 'pending' or vacation.user_id == current_user.id:
            results['skipped'] += 1
            continue
        vacation.status = 'approved' if action == 'approve' else 'rejected'
        vacation.reviewed_by = current_user.id
        vacation.review_comment = data.get('comment', '')
        vacation.reviewed_at = datetime.utcnow()
        results['processed'] += 1
        try:
            notify_vacation_reviewed(vacation, action)
        except Exception:
            pass
    db.session.commit()
    log_audit(f'bulk_{action}', 'vacation', None, f"ids={ids}")
    return jsonify({'success': True, **results})


# ─────────────────────────────────────────────
# API Routes — Users (Admin)
# ─────────────────────────────────────────────

@app.route('/api/users', methods=['GET'])
@login_required
def get_users():
    if current_user.role not in ['admin', 'manager']:
        return jsonify([current_user.to_dict()])
    users = User.query.filter_by(is_deleted=False).order_by(User.department, User.first_name).all()
    return jsonify([u.to_dict() for u in users])


@app.route('/api/users', methods=['POST'])
@login_required
def create_user():
    if current_user.role != 'admin':
        return jsonify({'success': False, 'error': 'No autorizado'}), 403

    data = request.get_json()

    if User.query.filter_by(username=data['username']).first():
        return jsonify({'success': False, 'error': 'El nombre de usuario ya existe'}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'success': False, 'error': 'El email ya existe'}), 400

    import random
    colors = ['#6C5CE7', '#00B894', '#E17055', '#0984E3', '#D63031',
              '#FDCB6E', '#E84393', '#00CEC9', '#2D3436', '#A29BFE']

    user = User(
        username=data['username'],
        email=data['email'],
        first_name=data['first_name'],
        last_name=data['last_name'],
        department=data.get('department', 'General'),
        role=data.get('role', 'employee'),
        total_days=data.get('total_days', 22),
        avatar_color=random.choice(colors),
        must_change_password=True,
    )
    # Generate a secure random temporary password
    temp_password = secrets.token_urlsafe(10)
    user.set_password(temp_password)

    db.session.add(user)
    db.session.commit()

    base = request.host_url.rstrip('/')
    send_email(
        user.email,
        "Bienvenido a VacationControl — Credenciales de acceso",
        f"Hola {user.first_name},\n\n"
        f"Tu cuenta ha sido creada.\n\n"
        f"  Usuario: {user.username}\n"
        f"  Contraseña temporal: {temp_password}\n\n"
        f"Deberás cambiar tu contraseña en el primer inicio de sesión.\n\n"
        f"Accede en: {base}\n\n"
        f"— VacationControl",
    )
    log_audit('create_user', 'user', user.id, f"username={user.username}")
    return jsonify({'success': True, 'user': user.to_dict(), 'temp_password': temp_password})


@app.route('/api/users/<int:user_id>', methods=['PUT'])
@login_required
def update_user(user_id):
    if current_user.role != 'admin' and current_user.id != user_id:
        return jsonify({'success': False, 'error': 'No autorizado'}), 403

    user = db.session.get(User, user_id)
    if not user or user.is_deleted:
        return jsonify({'success': False, 'error': 'Usuario no encontrado'}), 404

    data = request.get_json()
    if 'first_name' in data:
        user.first_name = data['first_name']
    if 'last_name' in data:
        user.last_name = data['last_name']
    if 'department' in data:
        user.department = data['department']
    if 'email' in data:
        user.email = data['email']
    if current_user.role == 'admin':
        if 'role' in data:
            user.role = data['role']
        if 'total_days' in data:
            user.total_days = data['total_days']
        if 'hire_date' in data:
            try:
                user.hire_date = date_parser.parse(data['hire_date']).date() if data['hire_date'] else None
            except (ValueError, TypeError):
                pass
    if 'password' in data and data['password']:
        if len(data['password']) < 8:
            return jsonify({'success': False, 'error': 'La contraseña debe tener al menos 8 caracteres'}), 400
        user.set_password(data['password'])
        user.must_change_password = False

    db.session.commit()
    log_audit('update_user', 'user', user_id)
    return jsonify({'success': True, 'user': user.to_dict()})


@app.route('/api/users/<int:user_id>', methods=['DELETE'])
@login_required
def delete_user(user_id):
    if current_user.role != 'admin':
        return jsonify({'success': False, 'error': 'No autorizado'}), 403

    user = db.session.get(User, user_id)
    if not user or user.is_deleted:
        return jsonify({'success': False, 'error': 'Usuario no encontrado'}), 404
    if user.id == current_user.id:
        return jsonify({'success': False, 'error': 'No puedes eliminarte a ti mismo'}), 400

    log_audit('delete_user', 'user', user.id, f"username={user.username}")

    # GDPR soft-delete: anonymise personal data, keep vacation records
    user.is_deleted = True
    user.deleted_at = datetime.utcnow()
    user.first_name = 'Empleado'
    user.last_name = 'Eliminado'
    user.email = f'deleted_{user.id}@deleted.local'
    user.username = f'deleted_{user.id}'
    user.avatar_image = None
    db.session.commit()
    return jsonify({'success': True})


@app.route('/api/users/<int:user_id>/avatar', methods=['POST'])
@login_required
def update_user_avatar(user_id):
    if current_user.role != 'admin' and current_user.id != user_id:
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    user = db.session.get(User, user_id)
    if not user or user.is_deleted:
        return jsonify({'success': False, 'error': 'Usuario no encontrado'}), 404
    data = request.get_json()
    user.avatar_image = data.get('avatar_image')
    db.session.commit()
    return jsonify({'success': True, 'user': user.to_dict()})


# ─────────────────────────────────────────────
# API Routes — Calendar & Stats
# ─────────────────────────────────────────────

@app.route('/api/calendar', methods=['GET'])
@login_required
def get_calendar():
    year = request.args.get('year', date.today().year, type=int)
    month = request.args.get('month', date.today().month, type=int)

    start = date(year, month, 1)
    end = date(year + 1, 1, 1) - timedelta(days=1) if month == 12 else date(year, month + 1, 1) - timedelta(days=1)

    user_id_filter = request.args.get('user_id', type=int)
    query = VacationRequest.query.filter(
        VacationRequest.status.in_(['approved', 'pending']),
        VacationRequest.start_date <= end,
        VacationRequest.end_date >= start,
    )
    if user_id_filter:
        query = query.filter(VacationRequest.user_id == user_id_filter)

    vacations = query.all()
    holidays = PublicHoliday.query.filter(
        PublicHoliday.date >= start, PublicHoliday.date <= end
    ).all()

    return jsonify({'vacations': [v.to_dict() for v in vacations], 'holidays': [h.to_dict() for h in holidays]})


@app.route('/api/stats', methods=['GET'])
@login_required
def get_stats():
    year = request.args.get('year', date.today().year, type=int)

    total_requests = VacationRequest.query.filter(
        db.extract('year', VacationRequest.start_date) == year
    ).count()
    pending_requests = VacationRequest.query.filter(
        VacationRequest.status == 'pending',
        db.extract('year', VacationRequest.start_date) == year,
    ).count()
    approved_requests = VacationRequest.query.filter(
        VacationRequest.status == 'approved',
        db.extract('year', VacationRequest.start_date) == year,
    ).count()
    rejected_requests = VacationRequest.query.filter(
        VacationRequest.status == 'rejected',
        db.extract('year', VacationRequest.start_date) == year,
    ).count()

    departments = {}
    users = User.query.filter_by(is_deleted=False).all()
    for u in users:
        dept = u.department
        if dept not in departments:
            departments[dept] = {'total_employees': 0, 'days_used': 0, 'days_total': 0}
        departments[dept]['total_employees'] += 1
        departments[dept]['days_used'] += u.days_used(year)
        departments[dept]['days_total'] += u.total_days

    monthly = {}
    for m in range(1, 13):
        m_start = date(year, m, 1)
        m_end = date(year + 1, 1, 1) - timedelta(days=1) if m == 12 else date(year, m + 1, 1) - timedelta(days=1)
        count = VacationRequest.query.filter(
            VacationRequest.status == 'approved',
            VacationRequest.start_date <= m_end,
            VacationRequest.end_date >= m_start,
        ).count()
        monthly[m] = count

    return jsonify({
        'total_requests': total_requests,
        'pending_requests': pending_requests,
        'approved_requests': approved_requests,
        'rejected_requests': rejected_requests,
        'departments': departments,
        'monthly': monthly,
        'year': year,
    })


# ─────────────────────────────────────────────
# API Routes — Departments
# ─────────────────────────────────────────────

@app.route('/api/departments', methods=['GET'])
@login_required
def get_departments():
    depts = Department.query.order_by(Department.name).all()
    return jsonify([d.to_dict() for d in depts])


@app.route('/api/departments', methods=['POST'])
@login_required
def create_department():
    if current_user.role != 'admin':
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    data = request.get_json()
    if not data.get('name'):
        return jsonify({'success': False, 'error': 'Nombre requerido'}), 400
    if Department.query.filter_by(name=data['name']).first():
        return jsonify({'success': False, 'error': 'El departamento ya existe'}), 400
    dept = Department(name=data['name'], description=data.get('description', ''))
    db.session.add(dept)
    db.session.commit()
    log_audit('create_department', 'department', dept.id, f"name={dept.name}")
    return jsonify({'success': True, 'department': dept.to_dict()})


@app.route('/api/departments/<int:dept_id>', methods=['PUT'])
@login_required
def update_department(dept_id):
    if current_user.role != 'admin':
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    dept = db.session.get(Department, dept_id)
    if not dept:
        return jsonify({'success': False, 'error': 'Departamento no encontrado'}), 404
    data = request.get_json()
    if 'name' in data:
        dept.name = data['name']
    if 'description' in data:
        dept.description = data['description']
    db.session.commit()
    return jsonify({'success': True, 'department': dept.to_dict()})


@app.route('/api/departments/<int:dept_id>', methods=['DELETE'])
@login_required
def delete_department(dept_id):
    if current_user.role != 'admin':
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    dept = db.session.get(Department, dept_id)
    if not dept:
        return jsonify({'success': False, 'error': 'Departamento no encontrado'}), 404
    db.session.delete(dept)
    db.session.commit()
    return jsonify({'success': True})


@app.route('/api/department-rules', methods=['GET'])
@login_required
def get_dept_rules():
    rules = DepartmentRule.query.order_by(DepartmentRule.department).all()
    return jsonify([r.to_dict() for r in rules])


@app.route('/api/department-rules', methods=['POST'])
@login_required
def create_dept_rule():
    if current_user.role != 'admin':
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    data = request.get_json() or {}
    dept = data.get('department', '').strip()
    if not dept:
        return jsonify({'success': False, 'error': 'Departamento requerido'}), 400
    existing = DepartmentRule.query.filter_by(department=dept).first()
    if existing:
        return jsonify({'success': False, 'error': 'Ya existe una regla para ese departamento'}), 400
    bp = data.get('blackout_periods')
    rule = DepartmentRule(
        department=dept,
        max_simultaneous=data.get('max_simultaneous') or None,
        min_advance_days=data.get('min_advance_days') or None,
        max_consecutive_days=data.get('max_consecutive_days') or None,
        blackout_periods=json.dumps(bp) if bp else None,
    )
    db.session.add(rule)
    db.session.commit()
    log_audit('create_dept_rule', 'dept_rule', rule.id, f"dept={dept}")
    return jsonify({'success': True, 'rule': rule.to_dict()})


@app.route('/api/department-rules/<int:rule_id>', methods=['PUT'])
@login_required
def update_dept_rule(rule_id):
    if current_user.role != 'admin':
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    rule = db.session.get(DepartmentRule, rule_id)
    if not rule:
        return jsonify({'success': False, 'error': 'Regla no encontrada'}), 404
    data = request.get_json() or {}
    if 'max_simultaneous' in data:
        rule.max_simultaneous = data['max_simultaneous'] or None
    if 'min_advance_days' in data:
        rule.min_advance_days = data['min_advance_days'] or None
    if 'max_consecutive_days' in data:
        rule.max_consecutive_days = data['max_consecutive_days'] or None
    if 'blackout_periods' in data:
        rule.blackout_periods = json.dumps(data['blackout_periods']) if data['blackout_periods'] else None
    db.session.commit()
    return jsonify({'success': True, 'rule': rule.to_dict()})


@app.route('/api/department-rules/<int:rule_id>', methods=['DELETE'])
@login_required
def delete_dept_rule(rule_id):
    if current_user.role != 'admin':
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    rule = db.session.get(DepartmentRule, rule_id)
    if not rule:
        return jsonify({'success': False, 'error': 'Regla no encontrada'}), 404
    db.session.delete(rule)
    db.session.commit()
    return jsonify({'success': True})


@app.route('/api/holidays', methods=['GET'])
@login_required
def get_holidays():
    year = request.args.get('year', date.today().year, type=int)
    holidays = PublicHoliday.query.filter_by(year=year).order_by(PublicHoliday.date).all()
    return jsonify([h.to_dict() for h in holidays])


@app.route('/api/holidays', methods=['POST'])
@login_required
def add_holiday():
    if current_user.role != 'admin':
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    data = request.get_json()
    try:
        holiday_date = date_parser.parse(data['date']).date()
    except (KeyError, ValueError):
        return jsonify({'success': False, 'error': 'Fecha inválida'}), 400
    holiday = PublicHoliday(date=holiday_date, name=data['name'], year=holiday_date.year)
    db.session.add(holiday)
    db.session.commit()
    return jsonify({'success': True, 'holiday': holiday.to_dict()})


@app.route('/api/holidays/<int:holiday_id>', methods=['DELETE'])
@login_required
def delete_holiday(holiday_id):
    if current_user.role != 'admin':
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    holiday = db.session.get(PublicHoliday, holiday_id)
    if not holiday:
        return jsonify({'success': False, 'error': 'Festivo no encontrado'}), 404
    db.session.delete(holiday)
    db.session.commit()
    return jsonify({'success': True})


# ─────────────────────────────────────────────
# API Routes — Late Arrivals
# ─────────────────────────────────────────────

@app.route('/api/late-arrivals', methods=['GET'])
@login_required
def get_late_arrivals():
    user_id = request.args.get('user_id', type=int)
    if user_id:
        late_arrivals = LateArrival.query.filter_by(user_id=user_id).order_by(LateArrival.date.desc()).all()
    elif current_user.role in ['admin', 'manager']:
        late_arrivals = LateArrival.query.order_by(LateArrival.date.desc()).all()
    else:
        late_arrivals = LateArrival.query.filter_by(user_id=current_user.id).order_by(LateArrival.date.desc()).all()
    return jsonify([l.to_dict() for l in late_arrivals])


@app.route('/api/late-arrivals', methods=['POST'])
@login_required
def create_late_arrival():
    if current_user.role not in ['admin', 'manager']:
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    data = request.get_json()
    try:
        arrival_date = date_parser.parse(data['date']).date()
    except (KeyError, ValueError):
        return jsonify({'success': False, 'error': 'Fecha inválida'}), 400
    late = LateArrival(
        user_id=data['user_id'],
        date=arrival_date,
        minutes_late=data.get('minutes_late', 0),
        reason=data.get('reason', ''),
    )
    db.session.add(late)
    db.session.commit()
    log_audit('create_late_arrival', 'late_arrival', late.id, f"user_id={data['user_id']}")
    return jsonify({'success': True, 'late_arrival': late.to_dict()})


@app.route('/api/late-arrivals/<int:late_id>', methods=['DELETE'])
@login_required
def delete_late_arrival(late_id):
    if current_user.role not in ['admin', 'manager']:
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    late = db.session.get(LateArrival, late_id)
    if not late:
        return jsonify({'success': False, 'error': 'Registro no encontrado'}), 404
    log_audit('delete_late_arrival', 'late_arrival', late_id)
    db.session.delete(late)
    db.session.commit()
    return jsonify({'success': True})


@app.route('/api/late-arrivals/ranking', methods=['GET'])
@login_required
def get_late_ranking():
    if current_user.role not in ['admin', 'manager']:
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    ranking = db.session.query(
        User.id, User.first_name, User.last_name, User.avatar_color, User.avatar_image,
        db.func.count(LateArrival.id).label('total_late'),
        db.func.sum(LateArrival.minutes_late).label('total_minutes'),
    ).join(LateArrival, User.id == LateArrival.user_id).filter(
        User.is_deleted == False
    ).group_by(User.id).order_by(db.text('total_late DESC')).all()

    return jsonify([{
        'id': r[0],
        'full_name': f"{r[1]} {r[2]}",
        'avatar_color': r[3],
        'avatar_image': r[4],
        'total_late': r[5],
        'total_minutes': int(r[6] or 0),
        'initials': f"{r[1][0]}{r[2][0]}".upper(),
    } for r in ranking])


# ─────────────────────────────────────────────
# API Routes — Company Settings & Avatars
# ─────────────────────────────────────────────

@app.route('/api/settings', methods=['GET'])
def get_settings():
    settings = CompanySettings.query.first()
    if not settings:
        return jsonify({'company_name': 'VacationControl', 'logo_data': None})
    return jsonify({'company_name': settings.company_name, 'logo_data': settings.logo_data})


@app.route('/api/settings', methods=['POST'])
@login_required
def update_settings():
    if current_user.role != 'admin':
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    data = request.get_json()
    settings = CompanySettings.query.first()
    if not settings:
        settings = CompanySettings()
        db.session.add(settings)
    if 'company_name' in data:
        settings.company_name = data['company_name']
    if 'logo_data' in data:
        settings.logo_data = data['logo_data']
    db.session.commit()
    log_audit('update_settings', 'settings', settings.id)
    return jsonify({'success': True, 'company_name': settings.company_name, 'logo_data': settings.logo_data})


# ─────────────────────────────────────────────
# API Routes — Vacation Balances
# ─────────────────────────────────────────────

@app.route('/api/balances', methods=['GET'])
@login_required
def get_balances():
    user_id = request.args.get('user_id', type=int) or current_user.id
    if user_id != current_user.id and current_user.role != 'admin':
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    year = request.args.get('year', date.today().year, type=int)
    balances = VacationBalance.query.filter_by(user_id=user_id, year=year).all()
    return jsonify([b.to_dict() for b in balances])


@app.route('/api/balances', methods=['POST'])
@login_required
def upsert_balance():
    if current_user.role != 'admin':
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    data = request.get_json() or {}
    user_id = data.get('user_id')
    year = data.get('year', date.today().year)
    vtype = data.get('vacation_type', 'vacaciones')
    if not user_id:
        return jsonify({'success': False, 'error': 'user_id requerido'}), 400
    balance = VacationBalance.query.filter_by(user_id=user_id, year=year, vacation_type=vtype).first()
    if not balance:
        balance = VacationBalance(user_id=user_id, year=year, vacation_type=vtype)
        db.session.add(balance)
    balance.total_days = data.get('total_days', balance.total_days)
    balance.carried_over = data.get('carried_over', balance.carried_over)
    if 'carryover_expiry' in data and data['carryover_expiry']:
        try:
            balance.carryover_expiry = date_parser.parse(data['carryover_expiry']).date()
        except (ValueError, TypeError):
            pass
    else:
        balance.carryover_expiry = None
    db.session.commit()
    log_audit('upsert_balance', 'balance', balance.id, f"user={user_id} year={year} type={vtype}")
    return jsonify({'success': True, 'balance': balance.to_dict()})


@app.route('/api/balances/<int:balance_id>', methods=['DELETE'])
@login_required
def delete_balance(balance_id):
    if current_user.role != 'admin':
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    balance = db.session.get(VacationBalance, balance_id)
    if not balance:
        return jsonify({'success': False, 'error': 'Balance no encontrado'}), 404
    db.session.delete(balance)
    db.session.commit()
    return jsonify({'success': True})


# ─────────────────────────────────────────────
# API Routes — Delegations
# ─────────────────────────────────────────────

@app.route('/api/delegations', methods=['GET'])
@login_required
def get_delegations():
    if current_user.role in ['admin', 'manager']:
        delegations = ManagerDelegation.query.filter_by(active=True).all()
    else:
        delegations = ManagerDelegation.query.filter(
            db.or_(
                ManagerDelegation.delegator_id == current_user.id,
                ManagerDelegation.delegate_id == current_user.id,
            ),
            ManagerDelegation.active == True,
        ).all()
    return jsonify([d.to_dict() for d in delegations])


@app.route('/api/delegations', methods=['POST'])
@login_required
def create_delegation():
    if current_user.role not in ['admin', 'manager']:
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    data = request.get_json() or {}
    try:
        start = date_parser.parse(data['start_date']).date()
        end = date_parser.parse(data['end_date']).date()
    except (KeyError, ValueError):
        return jsonify({'success': False, 'error': 'Fechas inválidas'}), 400
    delegate_id = data.get('delegate_id')
    if not delegate_id:
        return jsonify({'success': False, 'error': 'delegate_id requerido'}), 400
    delegator_id = data.get('delegator_id', current_user.id)
    if delegator_id != current_user.id and current_user.role != 'admin':
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    delegation = ManagerDelegation(
        delegator_id=delegator_id,
        delegate_id=delegate_id,
        start_date=start,
        end_date=end,
    )
    db.session.add(delegation)
    db.session.commit()
    log_audit('create_delegation', 'delegation', delegation.id)
    return jsonify({'success': True, 'delegation': delegation.to_dict()})


@app.route('/api/delegations/<int:deleg_id>', methods=['DELETE'])
@login_required
def delete_delegation(deleg_id):
    delegation = db.session.get(ManagerDelegation, deleg_id)
    if not delegation:
        return jsonify({'success': False, 'error': 'Delegación no encontrada'}), 404
    if delegation.delegator_id != current_user.id and current_user.role != 'admin':
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    delegation.active = False
    db.session.commit()
    return jsonify({'success': True})


# ─────────────────────────────────────────────
# API Routes — Absences & Reminders
# ─────────────────────────────────────────────

@app.route('/api/absences/today', methods=['GET'])
@login_required
def absences_today():
    today = date.today()
    vacations = VacationRequest.query.join(
        User, User.id == VacationRequest.user_id
    ).filter(
        VacationRequest.status == 'approved',
        VacationRequest.start_date <= today,
        VacationRequest.end_date >= today,
        User.is_deleted == False,
    ).all()
    return jsonify([v.to_dict() for v in vacations])


@app.route('/api/absences/upcoming', methods=['GET'])
@login_required
def absences_upcoming():
    today = date.today()
    days_ahead = request.args.get('days', 7, type=int)
    until = today + timedelta(days=days_ahead)
    vacations = VacationRequest.query.join(
        User, User.id == VacationRequest.user_id
    ).filter(
        VacationRequest.status == 'approved',
        VacationRequest.start_date > today,
        VacationRequest.start_date <= until,
        User.is_deleted == False,
    ).order_by(VacationRequest.start_date).all()
    return jsonify([v.to_dict() for v in vacations])


@app.route('/api/admin/send-reminders', methods=['GET'])
def send_reminders():
    cron_key = os.environ.get('CRON_KEY')
    if cron_key and request.args.get('key') != cron_key:
        return jsonify({'success': False, 'error': 'Unauthorized'}), 403
    elif not cron_key:
        if not current_user.is_authenticated or current_user.role != 'admin':
            return jsonify({'success': False, 'error': 'No autorizado'}), 403
    tomorrow = date.today() + timedelta(days=1)
    vacations = VacationRequest.query.filter(
        VacationRequest.status == 'approved',
        VacationRequest.start_date == tomorrow,
    ).all()
    sent = 0
    for v in vacations:
        employee = db.session.get(User, v.user_id)
        if employee and not employee.is_deleted:
            send_email(
                employee.email,
                "Recordatorio: tus vacaciones empiezan mañana",
                f"Hola {employee.first_name},\n\n"
                f"Tus vacaciones del {fmt_date(v.start_date)} al {fmt_date(v.end_date)} "
                f"({v.business_days} días hábiles) empiezan mañana.\n\n¡Que las disfrutes!\n\n— VacationControl",
            )
            sent += 1
    return jsonify({'success': True, 'reminders_sent': sent, 'date': tomorrow.isoformat()})


# ─────────────────────────────────────────────
# API Routes — Audit Log & Backup
# ─────────────────────────────────────────────

@app.route('/api/admin/audit-log', methods=['GET'])
@login_required
def get_audit_log():
    if current_user.role != 'admin':
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    limit = min(request.args.get('limit', 200, type=int), 1000)
    logs = AuditLog.query.order_by(AuditLog.created_at.desc()).limit(limit).all()
    return jsonify([l.to_dict() for l in logs])


@app.route('/api/admin/backup', methods=['GET'])
@login_required
def export_backup():
    """JSON export of all data for manual backups."""
    if current_user.role != 'admin':
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    backup = {
        'exported_at': datetime.utcnow().isoformat(),
        'users': [u.to_dict() for u in User.query.filter_by(is_deleted=False).all()],
        'vacations': [v.to_dict() for v in VacationRequest.query.all()],
        'holidays': [h.to_dict() for h in PublicHoliday.query.all()],
        'departments': [d.to_dict() for d in Department.query.all()],
        'settings': get_settings().get_json(),
    }
    log_audit('backup_export', 'system')
    response = make_response(json.dumps(backup, ensure_ascii=False, indent=2))
    response.headers['Content-Disposition'] = (
        f'attachment; filename=backup_{date.today().isoformat()}.json'
    )
    response.headers['Content-Type'] = 'application/json'
    return response


# ─────────────────────────────────────────────
# Initialize DB
# ─────────────────────────────────────────────

def init_db():
    with app.app_context():
        import traceback
        try:
            db.create_all()
            db_uri = app.config['SQLALCHEMY_DATABASE_URI']
            print(f"[init_db] DB: {db_uri[:40]}...")

            admin_password = os.environ.get('ADMIN_PASSWORD', 'admin')
            admin = User.query.filter_by(username='admin').first()
            if admin is None:
                admin = User(
                    username='admin',
                    email='admin@empresa.com',
                    first_name='Admin',
                    last_name='Admin',
                    department='Direccion',
                    role='admin',
                    total_days=25,
                    avatar_color='#6C5CE7',
                    must_change_password=False,
                )
                db.session.add(admin)
            admin.set_password(admin_password)
            db.session.commit()
            print(f"[init_db] ✅ Admin listo — usuario: admin  contrasena: {admin_password}")

            if CompanySettings.query.count() == 0:
                db.session.add(CompanySettings())
                db.session.commit()

            if PublicHoliday.query.count() == 0:
                year = date.today().year
                holidays = [
                    PublicHoliday(date=date(year, 1, 1), name='Año Nuevo', year=year),
                    PublicHoliday(date=date(year, 1, 6), name='Día de Reyes', year=year),
                    PublicHoliday(date=date(year, 5, 1), name='Día del Trabajo', year=year),
                    PublicHoliday(date=date(year, 8, 15), name='Asunción de la Virgen', year=year),
                    PublicHoliday(date=date(year, 10, 12), name='Fiesta Nacional de España', year=year),
                    PublicHoliday(date=date(year, 11, 1), name='Día de Todos los Santos', year=year),
                    PublicHoliday(date=date(year, 12, 6), name='Día de la Constitución', year=year),
                    PublicHoliday(date=date(year, 12, 8), name='Inmaculada Concepción', year=year),
                    PublicHoliday(date=date(year, 12, 25), name='Navidad', year=year),
                ]
                db.session.add_all(holidays)
                db.session.commit()
                print("[init_db] ✅ Festivos creados")
        except Exception as e:
            print(f"[init_db] ERROR: {e}")
            print(traceback.format_exc())
            db.session.rollback()


init_db()

if __name__ == '__main__':
    app.run(debug=True, port=5010)
