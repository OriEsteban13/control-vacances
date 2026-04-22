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
import json
import os
import io
import csv
from flask import Response

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'vacation-control-secret-key-2026')

# Secure cookie settings for HTTPS (Render production)
if os.environ.get('RENDER'):
    app.config['SESSION_COOKIE_SECURE'] = True
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['REMEMBER_COOKIE_SECURE'] = True
    app.config['REMEMBER_COOKIE_HTTPONLY'] = True
    app.config['REMEMBER_COOKIE_SAMESITE'] = 'Lax'

if os.environ.get('RENDER'):
    _db_dir = '/tmp'
else:
    _db_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'instance')
os.makedirs(_db_dir, exist_ok=True)
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{_db_dir}/vacations.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login_page'

# ─────────────────────────────────────────────
# Models
# ─────────────────────────────────────────────

class Department(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description
        }

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    department = db.Column(db.String(100), nullable=False, default='General')
    role = db.Column(db.String(20), nullable=False, default='employee')  # employee, manager, admin
    total_days = db.Column(db.Integer, nullable=False, default=22)
    avatar_color = db.Column(db.String(7), default='#6C5CE7')
    avatar_image = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

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
        approved = VacationRequest.query.filter_by(
            user_id=self.id, status='approved'
        ).all()
        total = 0
        for v in approved:
            if v.start_date.year == year or v.end_date.year == year:
                total += v.business_days
        return total

    def days_pending(self, year=None):
        if year is None:
            year = date.today().year
        pending = VacationRequest.query.filter_by(
            user_id=self.id, status='pending'
        ).all()
        total = 0
        for v in pending:
            if v.start_date.year == year or v.end_date.year == year:
                total += v.business_days
        return total

    def days_remaining(self, year=None):
        return self.total_days - self.days_used(year)

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
            'days_used': self.days_used(),
            'days_pending': self.days_pending(),
            'days_remaining': self.days_remaining(),
            'avatar_color': self.avatar_color,
            'avatar_image': self.avatar_image
        }


class VacationRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    vacation_type = db.Column(db.String(50), nullable=False, default='vacaciones')
    reason = db.Column(db.Text, default='')
    status = db.Column(db.String(20), nullable=False, default='pending')  # pending, approved, rejected
    reviewed_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    review_comment = db.Column(db.Text, default='')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    reviewed_at = db.Column(db.DateTime, nullable=True)

    reviewer = db.relationship('User', foreign_keys=[reviewed_by])

    @property
    def business_days(self):
        """Calculate business days between start and end date"""
        days = 0
        current = self.start_date
        while current <= self.end_date:
            if current.weekday() < 5:  # Monday to Friday
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
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'reviewed_at': self.reviewed_at.isoformat() if self.reviewed_at else None
        }


class PublicHoliday(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    name = db.Column(db.String(200), nullable=False)
    year = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date.isoformat(),
            'name': self.name,
            'year': self.year
        }


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
            'created_at': self.created_at.isoformat()
        }


class CompanySettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(100), default='VacationControl')
    logo_data = db.Column(db.Text, nullable=True)


@login_manager.user_loader
def load_user(user_id):
    try:
        return db.session.get(User, int(user_id))
    except Exception:
        return None


# ─────────────────────────────────────────────
# Routes - Pages
# ─────────────────────────────────────────────

@app.route('/health')
def health():
    return jsonify({'status': 'ok'})

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


# ─────────────────────────────────────────────
# API Routes - Auth
# ─────────────────────────────────────────────

@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json(silent=True) or {}
    login_identifier = data.get('username')
    user = User.query.filter(
        db.or_(User.username == login_identifier, User.email == login_identifier)
    ).first()
    
    if user and user.check_password(data.get('password')):
        login_user(user, remember=True)
        return jsonify({'success': True, 'user': user.to_dict()})
        
    return jsonify({'success': False, 'error': 'Usuario o contraseña incorrectos'}), 401

@app.route('/api/logout', methods=['POST'])
@login_required
def api_logout():
    logout_user()
    return jsonify({'success': True})

@app.route('/api/me')
def api_me():
    if current_user.is_authenticated:
        return jsonify({'authenticated': True, 'user': current_user.to_dict()})
    return jsonify({'authenticated': False})


# ─────────────────────────────────────────────
# API Routes - Vacations
# ─────────────────────────────────────────────

@app.route('/api/vacations', methods=['GET'])
@login_required
def get_vacations():
    year = request.args.get('year', date.today().year, type=int)
    
    if current_user.role in ['admin', 'manager']:
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
    writer.writerow(['ID', 'Empleado', 'Departamento', 'Fecha Inicio', 'Fecha Fin', 'Tipo', 'Dias Laborables', 'Estado', 'Motivo'])
    
    for v in vacations:
        writer.writerow([
            v.id,
            v.employee.full_name if v.employee else 'Desconocido',
            v.employee.department if v.employee else '',
            v.start_date.isoformat(),
            v.end_date.isoformat(),
            v.vacation_type,
            v.business_days,
            v.status,
            v.reason
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
        reason=data.get('reason', '')
    )

    # Check if user has enough days
    if vacation.business_days > current_user.days_remaining():
        return jsonify({
            'success': False,
            'error': f'No tienes suficientes días disponibles. Disponibles: {current_user.days_remaining()}, Solicitados: {vacation.business_days}'
        }), 400

    # Check for overlapping requests
    overlapping = VacationRequest.query.filter(
        VacationRequest.user_id == current_user.id,
        VacationRequest.status != 'rejected',
        VacationRequest.start_date <= end,
        VacationRequest.end_date >= start
    ).first()

    if overlapping:
        return jsonify({'success': False, 'error': 'Ya tienes una solicitud en esas fechas'}), 400

    db.session.add(vacation)
    db.session.commit()

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

    db.session.delete(vacation)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/api/vacations/<int:vacation_id>/review', methods=['POST'])
@login_required
def review_vacation(vacation_id):
    if current_user.role not in ['admin', 'manager']:
        return jsonify({'success': False, 'error': 'No autorizado'}), 403

    data = request.get_json()
    vacation = db.session.get(VacationRequest, vacation_id)
    if not vacation:
        return jsonify({'success': False, 'error': 'Solicitud no encontrada'}), 404

    action = data.get('action')
    if action not in ['approve', 'reject']:
        return jsonify({'success': False, 'error': 'Acción inválida'}), 400

    vacation.status = 'approved' if action == 'approve' else 'rejected'
    vacation.reviewed_by = current_user.id
    vacation.review_comment = data.get('comment', '')
    vacation.reviewed_at = datetime.utcnow()

    db.session.commit()
    return jsonify({'success': True, 'vacation': vacation.to_dict()})


# ─────────────────────────────────────────────
# API Routes - Users (Admin)
# ─────────────────────────────────────────────

@app.route('/api/users', methods=['GET'])
@login_required
def get_users():
    if current_user.role not in ['admin', 'manager']:
        return jsonify([current_user.to_dict()])
    users = User.query.order_by(User.department, User.first_name).all()
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

    colors = ['#6C5CE7', '#00B894', '#E17055', '#0984E3', '#D63031',
              '#FDCB6E', '#E84393', '#00CEC9', '#2D3436', '#A29BFE']
    import random
    
    user = User(
        username=data['username'],
        email=data['email'],
        first_name=data['first_name'],
        last_name=data['last_name'],
        department=data.get('department', 'General'),
        role=data.get('role', 'employee'),
        total_days=data.get('total_days', 22),
        avatar_color=random.choice(colors)
    )
    user.set_password(data.get('password', 'password123'))

    db.session.add(user)
    db.session.commit()
    return jsonify({'success': True, 'user': user.to_dict()})

@app.route('/api/users/<int:user_id>', methods=['PUT'])
@login_required
def update_user(user_id):
    if current_user.role != 'admin' and current_user.id != user_id:
        return jsonify({'success': False, 'error': 'No autorizado'}), 403

    user = db.session.get(User, user_id)
    if not user:
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
    if 'password' in data and data['password']:
        user.set_password(data['password'])

    db.session.commit()
    return jsonify({'success': True, 'user': user.to_dict()})

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
@login_required
def delete_user(user_id):
    if current_user.role != 'admin':
        return jsonify({'success': False, 'error': 'No autorizado'}), 403

    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'success': False, 'error': 'Usuario no encontrado'}), 404

    if user.id == current_user.id:
        return jsonify({'success': False, 'error': 'No puedes eliminarte a ti mismo'}), 400

    VacationRequest.query.filter_by(user_id=user.id).delete()
    db.session.delete(user)
    db.session.commit()
    return jsonify({'success': True})


# ─────────────────────────────────────────────
# API Routes - Calendar & Stats
# ─────────────────────────────────────────────

@app.route('/api/calendar', methods=['GET'])
@login_required
def get_calendar():
    year = request.args.get('year', date.today().year, type=int)
    month = request.args.get('month', date.today().month, type=int)

    start = date(year, month, 1)
    if month == 12:
        end = date(year + 1, 1, 1) - timedelta(days=1)
    else:
        end = date(year, month + 1, 1) - timedelta(days=1)

    user_id_filter = request.args.get('user_id', type=int)

    query = VacationRequest.query.filter(
        VacationRequest.status.in_(['approved', 'pending']),
        VacationRequest.start_date <= end,
        VacationRequest.end_date >= start
    )

    if user_id_filter:
        query = query.filter(VacationRequest.user_id == user_id_filter)

    vacations = query.all()

    holidays = PublicHoliday.query.filter(
        PublicHoliday.date >= start,
        PublicHoliday.date <= end
    ).all()

    return jsonify({
        'vacations': [v.to_dict() for v in vacations],
        'holidays': [h.to_dict() for h in holidays]
    })

@app.route('/api/stats', methods=['GET'])
@login_required
def get_stats():
    year = request.args.get('year', date.today().year, type=int)

    total_requests = VacationRequest.query.filter(
        db.extract('year', VacationRequest.start_date) == year
    ).count()

    pending_requests = VacationRequest.query.filter(
        VacationRequest.status == 'pending',
        db.extract('year', VacationRequest.start_date) == year
    ).count()

    approved_requests = VacationRequest.query.filter(
        VacationRequest.status == 'approved',
        db.extract('year', VacationRequest.start_date) == year
    ).count()

    rejected_requests = VacationRequest.query.filter(
        VacationRequest.status == 'rejected',
        db.extract('year', VacationRequest.start_date) == year
    ).count()

    # Department breakdown
    departments = {}
    users = User.query.all()
    for u in users:
        dept = u.department
        if dept not in departments:
            departments[dept] = {'total_employees': 0, 'days_used': 0, 'days_total': 0}
        departments[dept]['total_employees'] += 1
        departments[dept]['days_used'] += u.days_used(year)
        departments[dept]['days_total'] += u.total_days

    # Monthly breakdown
    monthly = {}
    for m in range(1, 13):
        month_start = date(year, m, 1)
        if m == 12:
            month_end = date(year + 1, 1, 1) - timedelta(days=1)
        else:
            month_end = date(year, m + 1, 1) - timedelta(days=1)

        count = VacationRequest.query.filter(
            VacationRequest.status == 'approved',
            VacationRequest.start_date <= month_end,
            VacationRequest.end_date >= month_start
        ).count()
        monthly[m] = count

    return jsonify({
        'total_requests': total_requests,
        'pending_requests': pending_requests,
        'approved_requests': approved_requests,
        'rejected_requests': rejected_requests,
        'departments': departments,
        'monthly': monthly,
        'year': year
    })

# ─────────────────────────────────────────────
# API Routes - Departments
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

    holiday = PublicHoliday(
        date=holiday_date,
        name=data['name'],
        year=holiday_date.year
    )
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
# API Routes - Late Arrivals
# ─────────────────────────────────────────────

@app.route('/api/late-arrivals', methods=['GET'])
@login_required
def get_late_arrivals():
    user_id = request.args.get('user_id', type=int)
    if user_id:
        late_arrivals = LateArrival.query.filter_by(user_id=user_id).order_by(LateArrival.date.desc()).all()
    else:
        # Managers and Admins can see all
        if current_user.role in ['admin', 'manager']:
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
        reason=data.get('reason', '')
    )
    db.session.add(late)
    db.session.commit()
    return jsonify({'success': True, 'late_arrival': late.to_dict()})

@app.route('/api/late-arrivals/<int:late_id>', methods=['DELETE'])
@login_required
def delete_late_arrival(late_id):
    if current_user.role not in ['admin', 'manager']:
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    late = db.session.get(LateArrival, late_id)
    if not late:
        return jsonify({'success': False, 'error': 'Registro no encontrado'}), 404
    db.session.delete(late)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/api/late-arrivals/ranking', methods=['GET'])
@login_required
def get_late_ranking():
    # Only admins and managers can see ranking
    if current_user.role not in ['admin', 'manager']:
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
        
    ranking = db.session.query(
        User.id, User.first_name, User.last_name, User.avatar_color, User.avatar_image,
        db.func.count(LateArrival.id).label('total_late'),
        db.func.sum(LateArrival.minutes_late).label('total_minutes')
    ).join(LateArrival, User.id == LateArrival.user_id).group_by(User.id).order_by(db.text('total_late DESC')).all()

    return jsonify([{
        'id': r[0],
        'full_name': f"{r[1]} {r[2]}",
        'avatar_color': r[3],
        'avatar_image': r[4],
        'total_late': r[5],
        'total_minutes': int(r[6] or 0),
        'initials': f"{r[1][0]}{r[2][0]}".upper()
    } for r in ranking])


# ─────────────────────────────────────────────
# API Routes - Company Settings & Avatars
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
    return jsonify({'success': True, 'company_name': settings.company_name, 'logo_data': settings.logo_data})

@app.route('/api/users/<int:user_id>/avatar', methods=['POST'])
@login_required
def update_user_avatar(user_id):
    if current_user.role != 'admin' and current_user.id != user_id:
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'success': False, 'error': 'Usuario no encontrado'}), 404
    data = request.get_json()
    user.avatar_image = data.get('avatar_image')
    db.session.commit()
    return jsonify({'success': True, 'user': user.to_dict()})


# ─────────────────────────────────────────────
# Initialize DB with demo data
# ─────────────────────────────────────────────

def init_db():
    with app.app_context():
        import traceback
        try:
            db.create_all()
            print(f"[init_db] DB path: {_db_dir}/vacations.db")

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
                    avatar_color='#6C5CE7'
                )
                db.session.add(admin)

            # Always sync password to current ADMIN_PASSWORD env var
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


# Initialize DB on startup
init_db()

if __name__ == '__main__':
    app.run(debug=True, port=5010)
