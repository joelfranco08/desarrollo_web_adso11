from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Habilita la comunicación con React (puerto 5173)

# Configuración de la conexión a MySQL (XAMPP)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/meyer_spa_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# =============================================================================
# 1. MODELOS DE BASE DE DATOS
# =============================================================================

class Cliente(db.Model):
    __tablename__ = 'cliente'
    id_cliente = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombres = db.Column(db.String(100), nullable=False)
    apellidos = db.Column(db.String(100), nullable=False)
    cedula = db.Column(db.String(20), unique=True, nullable=False)
    telefono = db.Column(db.String(20))
    correo = db.Column(db.String(120), unique=True, nullable=False)
    fecha_nacimiento = db.Column(db.Date)
    foto_url = db.Column(db.String(255))
    password_hash = db.Column(db.String(255), nullable=False)
    alergias_notas_medicas = db.Column(db.Text)

    citas = db.relationship('Cita', backref='cliente', lazy=True)
    notificaciones = db.relationship('Notificacion', backref='cliente', lazy=True)

class Auxiliar(db.Model):
    __tablename__ = 'auxiliar'
    id_auxiliar = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombres = db.Column(db.String(100), nullable=False)
    apellidos = db.Column(db.String(100), nullable=False)
    correo = db.Column(db.String(120), unique=True, nullable=False)
    telefono = db.Column(db.String(20))
    password_hash = db.Column(db.String(255), nullable=False)
    cargo = db.Column(db.String(50), nullable=False)
    foto_url = db.Column(db.String(255))

    citas = db.relationship('Cita', backref='auxiliar', lazy=True)
    horarios = db.relationship('Horario', backref='auxiliar', lazy=True)

class Servicio(db.Model):
    __tablename__ = 'servicio'
    id_servicio = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.Text)
    duracion_min = db.Column(db.Integer, nullable=False)
    precio = db.Column(db.Numeric(10, 2), nullable=False)

    citas = db.relationship('Cita', backref='servicio', lazy=True)

class Cabina(db.Model):
    __tablename__ = 'cabina'
    id_cabina = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(50), nullable=False)
    activa = db.Column(db.Boolean, default=True)

    citas = db.relationship('Cita', backref='cabina', lazy=True)

class Producto(db.Model):
    __tablename__ = 'producto'
    id_producto = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(100), nullable=False)
    marca = db.Column(db.String(100))
    stock_actual = db.Column(db.Integer, default=0)

class Promocion(db.Model):
    __tablename__ = 'promocion'
    id_promocion = db.Column(db.Integer, primary_key=True, autoincrement=True)
    titulo = db.Column(db.String(150), nullable=False)
    descripcion = db.Column(db.Text)
    descuento_porcentaje = db.Column(db.Numeric(5, 2))
    precio_paquete = db.Column(db.Numeric(10, 2))
    vigente_desde = db.Column(db.Date)
    vigente_hasta = db.Column(db.Date)
    activa = db.Column(db.Boolean, default=True)
    banner_url = db.Column(db.String(255))

class Horario(db.Model):
    __tablename__ = 'horario'
    id_horario = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_auxiliar = db.Column(db.Integer, db.ForeignKey('auxiliar.id_auxiliar'), nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    dia_semana = db.Column(db.String(20))
    hora_entrada = db.Column(db.Time, nullable=False)
    hora_salida = db.Column(db.Time, nullable=False)
    turno = db.Column(db.String(50))
    es_descanso = db.Column(db.Boolean, default=False)

class Cita(db.Model):
    __tablename__ = 'cita'
    id_cita = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_cliente = db.Column(db.Integer, db.ForeignKey('cliente.id_cliente'), nullable=False)
    id_auxiliar = db.Column(db.Integer, db.ForeignKey('auxiliar.id_auxiliar'), nullable=False)
    id_servicio = db.Column(db.Integer, db.ForeignKey('servicio.id_servicio'), nullable=False)
    id_cabina = db.Column(db.Integer, db.ForeignKey('cabina.id_cabina'), nullable=True)
    
    fecha = db.Column(db.Date, nullable=False)
    hora_inicio = db.Column(db.Time, nullable=False)
    hora_fin = db.Column(db.Time, nullable=False)
    estado = db.Column(db.String(30), default='Programada')
    calificacion = db.Column(db.Integer, nullable=True)

    procedimientos = db.relationship('Procedimiento', backref='cita', lazy=True)

class Procedimiento(db.Model):
    __tablename__ = 'procedimiento'
    id_procedimiento = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_cita = db.Column(db.Integer, db.ForeignKey('cita.id_cita'), nullable=False)
    descripcion = db.Column(db.Text)
    observaciones = db.Column(db.Text)
    inicio_real = db.Column(db.DateTime)
    fin_real = db.Column(db.DateTime)
    estado = db.Column(db.String(30), default='En proceso')
    codigo_auditoria = db.Column(db.String(100))

    firmas = db.relationship('Firma', backref='procedimiento', lazy=True)

class Firma(db.Model):
    __tablename__ = 'firma'
    id_firma = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_procedimiento = db.Column(db.Integer, db.ForeignKey('procedimiento.id_procedimiento'), nullable=False)
    tipo_firmante = db.Column(db.String(30), nullable=False)
    trazo_svg = db.Column(db.Text, nullable=False)
    fecha_firma = db.Column(db.DateTime, default=datetime.utcnow)

class Notificacion(db.Model):
    __tablename__ = 'notificacion'
    id_notificacion = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_cliente = db.Column(db.Integer, db.ForeignKey('cliente.id_cliente'), nullable=False)
    titulo = db.Column(db.String(100), nullable=False)
    mensaje = db.Column(db.Text, nullable=False)
    leida = db.Column(db.Boolean, default=False)
    fecha = db.Column(db.DateTime, default=datetime.utcnow)


# =============================================================================
# 2. ENDPOINTS API REST
# =============================================================================

@app.route('/api/auxiliar/dashboard-summary', methods=['GET'])
def dashboard_summary():
    return jsonify({
        "citasAgendadas": 5,
        "enProceso": 2,
        "finalizados": 1,
        "fechaActual": "Miércoles, 23 de Septiembre de 2026",
        "sede": "Barranquilla • Sede Principal"
    })

@app.route('/api/auxiliar/citas', methods=['GET'])
def get_citas_auxiliar():
    try:
        citas = Cita.query.all()
        resultado = []
        for c in citas:
            resultado.append({
                "id": c.id_cita,
                "time": c.hora_inicio.strftime("%I:%M %p") if c.hora_inicio else "09:00 AM",
                "title": c.servicio.nombre if c.servicio else "Procedimiento general",
                "client": f"{c.cliente.nombres} {c.cliente.apellidos}" if c.cliente else "Cliente",
                "duration": f"{c.servicio.duracion_min} min" if c.servicio else "60 min",
                "cabina": c.cabina.nombre if c.cabina else "Cabina 1",
                "status": c.estado,
                "statusStyle": "bg-[#E8F5E9] text-[#2E7D32]" if c.estado == 'Finalizado' else "bg-[#E3F2FD] text-[#1565C0]",
                "rating": "5.0",
                "visits": "8 visitas previas"
            })
        return jsonify(resultado)
    except Exception:
        return jsonify([])

@app.route('/api/auxiliar/horario', methods=['GET'])
def get_horario_auxiliar():
    return jsonify({
        "resumen": {
            "diasLaborales": "6",
            "horasTotales": "44",
            "diaDescanso": "Dom"
        },
        "dias": [
            {"day": "Lun", "date": "21", "shift": "Turno mañana 07:00 -> 15:00 - Cabina 1 & 2", "active": True},
            {"day": "Mar", "date": "22", "shift": "Turno tarde 13:00 -> 21:00 - Cabina 3", "active": True},
            {"day": "Mié", "date": "23", "shift": "Turno mañana 07:00 -> 15:00 - Cabina 1", "active": True, "highlight": True},
            {"day": "Jue", "date": "24", "shift": "Turno mañana 07:00 -> 15:00 - Cabina 2", "active": True},
            {"day": "Vie", "date": "25", "shift": "Turno tarde 13:00 -> 21:00 - Cabina 1 & 3", "active": True},
            {"day": "Sáb", "date": "26", "shift": "Turno especial 08:00 -> 16:00 - Cabina 2", "active": True},
            {"day": "Dom", "date": "27", "shift": "Día de descanso", "rest": True}
        ]
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5001)  # <--- Cambiamos al puerto 5001