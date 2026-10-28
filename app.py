from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import date, datetime, time, timedelta
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

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

def _json_body():
    body = request.get_json(silent=True)
    if not isinstance(body, dict):
        return None
    return body


def _parse_value(value, value_type):
    if value_type is date:
        return date.fromisoformat(value)
    if value_type is time:
        return time.fromisoformat(value)
    if value_type is datetime:
        return datetime.fromisoformat(value)
    return value


def _cita_json(cita):
    cliente = cita.cliente
    servicio = cita.servicio
    return {
        "id": cita.id_cita,
        "fecha": cita.fecha.isoformat(),
        "time": cita.hora_inicio.strftime("%I:%M %p") if cita.hora_inicio else None,
        "horaInicio": cita.hora_inicio.isoformat() if cita.hora_inicio else None,
        "horaFin": cita.hora_fin.isoformat() if cita.hora_fin else None,
        "title": servicio.nombre if servicio else "Procedimiento general",
        "duration": f"{servicio.duracion_min} min" if servicio else None,
        "client": f"{cliente.nombres} {cliente.apellidos}" if cliente else "Cliente",
        "clienteId": cliente.id_cliente if cliente else None,
        "cliente": _cliente_json(cliente) if cliente else None,
        "cabina": cita.cabina.nombre if cita.cabina else None,
        "status": cita.estado,
        "visits": f"{len(cliente.citas)} visitas" if cliente else None,
        "procedimientos": [_procedimiento_json(item) for item in cita.procedimientos],
    }


def _cliente_json(cliente):
    return {
        "id": cliente.id_cliente,
        "nombre": f"{cliente.nombres} {cliente.apellidos}",
        "nombres": cliente.nombres,
        "apellidos": cliente.apellidos,
        "cedula": cliente.cedula,
        "telefono": cliente.telefono,
        "correo": cliente.correo,
        "fechaNacimiento": cliente.fecha_nacimiento.isoformat() if cliente.fecha_nacimiento else None,
        "alergiasNotasMedicas": cliente.alergias_notas_medicas,
    }


def _horario_json(horario):
    if horario.es_descanso:
        turno = horario.turno or "Día de descanso"
    else:
        entrada = horario.hora_entrada.strftime("%H:%M")
        salida = horario.hora_salida.strftime("%H:%M")
        turno = f"{horario.turno + ' ' if horario.turno else ''}{entrada} -> {salida}"
    return {
        "id": horario.id_horario,
        "fecha": horario.fecha.isoformat(),
        "day": horario.dia_semana[:3] if horario.dia_semana else "",
        "date": horario.fecha.strftime("%d"),
        "shift": turno,
        "active": not horario.es_descanso,
        "rest": horario.es_descanso,
        "horaEntrada": horario.hora_entrada.isoformat(),
        "horaSalida": horario.hora_salida.isoformat(),
        "turno": horario.turno,
        "idAuxiliar": horario.id_auxiliar,
    }


def _update_record(record, body, fields):
    if not body:
        raise ValueError("Indica al menos un campo para actualizar.")
    unknown_fields = body.keys() - fields.keys()
    if unknown_fields:
        raise ValueError(f"Campos no permitidos: {', '.join(sorted(unknown_fields))}.")
    for field, (column, value_type) in fields.items():
        if field not in body:
            continue
        value = body[field]
        if value_type is bool:
            if not isinstance(value, bool):
                raise ValueError(f"'{field}' debe ser booleano.")
        elif value_type is int and isinstance(value, bool):
            raise ValueError(f"'{field}' debe ser un entero.")
        elif value is not None and value_type in (date, time, datetime):
            value = _parse_value(value, value_type)
        elif value is not None and not isinstance(value, value_type):
            raise ValueError(f"'{field}' tiene un tipo inválido.")
        setattr(record, column, value)


def _save_changes():
    try:
        db.session.commit()
        return None
    except IntegrityError:
        db.session.rollback()
        app.logger.exception("La actualización entra en conflicto con los datos existentes.")
        return jsonify({"error": "La actualización entra en conflicto con los datos existentes."}), 409
    except SQLAlchemyError:
        db.session.rollback()
        app.logger.exception("No se pudieron guardar los cambios en la base de datos.")
        return jsonify({"error": "No se pudieron guardar los cambios."}), 500


@app.errorhandler(SQLAlchemyError)
def handle_database_error(error):
    db.session.rollback()
    app.logger.exception("Error consultando la base de datos: %s", error)
    return jsonify({"error": "No fue posible completar la operación en la base de datos."}), 500


@app.route('/api/auxiliar/dashboard-summary', methods=['GET'])
def dashboard_summary():
    hoy = date.today()
    citas_hoy = Cita.query.filter(Cita.fecha == hoy)
    procedimientos_hoy = Procedimiento.query.join(Cita).filter(Cita.fecha == hoy)
    dias = ("lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo")
    meses = (
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
    )
    return jsonify({
        "citasAgendadas": citas_hoy.count(),
        "enProceso": procedimientos_hoy.filter(Procedimiento.estado.ilike("en proceso")).count(),
        "finalizados": procedimientos_hoy.filter(Procedimiento.estado.ilike("finalizado")).count(),
        "fechaActual": (
            f"{dias[hoy.weekday()]}, {hoy.day} de "
            f"{meses[hoy.month - 1]} de {hoy.year}"
        ),
        "sede": "Barranquilla • Sede Principal"
    })

@app.route('/api/auxiliar/citas', methods=['GET'])
def get_citas_auxiliar():
    query = Cita.query
    fecha = request.args.get("fecha")
    id_auxiliar_raw = request.args.get("id_auxiliar")
    id_cliente_raw = request.args.get("id_cliente")
    try:
        id_auxiliar = int(id_auxiliar_raw) if id_auxiliar_raw else None
        id_cliente = int(id_cliente_raw) if id_cliente_raw else None
        if (id_auxiliar is not None and id_auxiliar <= 0) or (id_cliente is not None and id_cliente <= 0):
            raise ValueError
    except ValueError:
        return jsonify({"error": "'id_auxiliar' y 'id_cliente' deben ser enteros positivos."}), 400
    if fecha:
        try:
            query = query.filter(Cita.fecha == date.fromisoformat(fecha))
        except ValueError:
            return jsonify({"error": "'fecha' debe tener formato YYYY-MM-DD."}), 400
    if id_auxiliar:
        query = query.filter_by(id_auxiliar=id_auxiliar)
    if id_cliente:
        query = query.filter_by(id_cliente=id_cliente)
    citas = query.order_by(Cita.fecha, Cita.hora_inicio).all()
    return jsonify([_cita_json(cita) for cita in citas])


@app.route('/api/auxiliar/citas/<int:cita_id>', methods=['GET', 'PATCH', 'PUT'])
def cita_detalle(cita_id):
    cita = db.session.get(Cita, cita_id)
    if not cita:
        return jsonify({"error": "Cita no encontrada."}), 404
    if request.method == "GET":
        return jsonify(_cita_json(cita))

    body = _json_body()
    if body is None:
        return jsonify({"error": "Se requiere un objeto JSON."}), 400
    fields = {
        "fecha": ("fecha", date),
        "hora_inicio": ("hora_inicio", time),
        "hora_fin": ("hora_fin", time),
        "estado": ("estado", str),
        "id_auxiliar": ("id_auxiliar", int),
        "id_servicio": ("id_servicio", int),
        "id_cabina": ("id_cabina", int),
    }
    try:
        _update_record(cita, body, fields)
        for field in ("fecha", "hora_inicio", "hora_fin", "estado", "id_auxiliar", "id_servicio"):
            if field in body and body[field] is None:
                raise ValueError(f"'{field}' no puede ser nulo.")
        if "estado" in body and not cita.estado.strip():
            raise ValueError("'estado' no puede estar vacío.")
        if "id_auxiliar" in body and not db.session.get(Auxiliar, cita.id_auxiliar):
            raise ValueError("El auxiliar indicado no existe.")
        if "id_servicio" in body and not db.session.get(Servicio, cita.id_servicio):
            raise ValueError("El servicio indicado no existe.")
        if "id_cabina" in body and cita.id_cabina is not None and not db.session.get(Cabina, cita.id_cabina):
            raise ValueError("La cabina indicada no existe.")
        if cita.hora_inicio and cita.hora_fin and cita.hora_fin <= cita.hora_inicio:
            raise ValueError("'hora_fin' debe ser posterior a 'hora_inicio'.")
    except (TypeError, ValueError) as error:
        db.session.rollback()
        return jsonify({"error": str(error)}), 400
    result = _save_changes()
    if result:
        return result
    return jsonify(_cita_json(cita))


@app.route('/api/clientes', methods=['GET'])
def get_clientes():
    clientes = Cliente.query.order_by(Cliente.apellidos, Cliente.nombres).all()
    return jsonify([_cliente_json(cliente) for cliente in clientes])


@app.route('/api/clientes/<int:cliente_id>', methods=['GET', 'PATCH', 'PUT'])
def cliente_detalle(cliente_id):
    cliente = db.session.get(Cliente, cliente_id)
    if not cliente:
        return jsonify({"error": "Cliente no encontrado."}), 404
    if request.method == "GET":
        return jsonify(_cliente_json(cliente))
    body = _json_body()
    if body is None:
        return jsonify({"error": "Se requiere un objeto JSON."}), 400
    fields = {
        "nombres": ("nombres", str),
        "apellidos": ("apellidos", str),
        "cedula": ("cedula", str),
        "telefono": ("telefono", str),
        "correo": ("correo", str),
        "fecha_nacimiento": ("fecha_nacimiento", date),
        "alergias_notas_medicas": ("alergias_notas_medicas", str),
    }
    try:
        _update_record(cliente, body, fields)
        for field in ("nombres", "apellidos", "cedula", "correo"):
            if field in body and body[field] is None:
                raise ValueError(f"'{field}' no puede ser nulo.")
        if (
            not cliente.nombres.strip()
            or not cliente.apellidos.strip()
            or not cliente.cedula.strip()
            or not cliente.correo.strip()
        ):
            raise ValueError("Nombres, apellidos, cédula y correo son obligatorios.")
    except (TypeError, ValueError) as error:
        db.session.rollback()
        return jsonify({"error": str(error)}), 400
    result = _save_changes()
    if result:
        return result
    return jsonify(_cliente_json(cliente))


@app.route('/api/procedimientos', methods=['GET'])
def get_procedimientos():
    procedimientos = Procedimiento.query.order_by(Procedimiento.id_procedimiento).all()
    return jsonify([_procedimiento_json(procedimiento) for procedimiento in procedimientos])


def _procedimiento_json(procedimiento):
    return {
        "id": procedimiento.id_procedimiento,
        "idCita": procedimiento.id_cita,
        "descripcion": procedimiento.descripcion,
        "observaciones": procedimiento.observaciones,
        "inicioReal": procedimiento.inicio_real.isoformat() if procedimiento.inicio_real else None,
        "finReal": procedimiento.fin_real.isoformat() if procedimiento.fin_real else None,
        "estado": procedimiento.estado,
    }


@app.route('/api/procedimientos/<int:procedimiento_id>', methods=['GET', 'PATCH', 'PUT'])
def procedimiento_detalle(procedimiento_id):
    procedimiento = db.session.get(Procedimiento, procedimiento_id)
    if not procedimiento:
        return jsonify({"error": "Procedimiento no encontrado."}), 404
    if request.method == "GET":
        return jsonify(_procedimiento_json(procedimiento))
    body = _json_body()
    if body is None:
        return jsonify({"error": "Se requiere un objeto JSON."}), 400
    fields = {
        "descripcion": ("descripcion", str),
        "observaciones": ("observaciones", str),
        "inicio_real": ("inicio_real", datetime),
        "fin_real": ("fin_real", datetime),
        "estado": ("estado", str),
    }
    try:
        _update_record(procedimiento, body, fields)
        if "estado" in body and not procedimiento.estado:
            raise ValueError("'estado' no puede estar vacío.")
        if procedimiento.estado and procedimiento.estado.casefold() == "en proceso" and not procedimiento.inicio_real:
            procedimiento.inicio_real = datetime.now()
        if procedimiento.estado and procedimiento.estado.casefold() == "finalizado" and not procedimiento.fin_real:
            procedimiento.fin_real = datetime.now()
        if procedimiento.inicio_real and procedimiento.fin_real and procedimiento.fin_real < procedimiento.inicio_real:
            raise ValueError("'fin_real' no puede ser anterior a 'inicio_real'.")
    except (TypeError, ValueError) as error:
        db.session.rollback()
        return jsonify({"error": str(error)}), 400
    result = _save_changes()
    if result:
        return result
    return jsonify(_procedimiento_json(procedimiento))


@app.route('/api/horarios', methods=['GET'])
def get_horarios():
    query = Horario.query
    id_auxiliar_raw = request.args.get("id_auxiliar")
    try:
        id_auxiliar = int(id_auxiliar_raw) if id_auxiliar_raw else None
        if id_auxiliar is not None and id_auxiliar <= 0:
            raise ValueError
    except ValueError:
        return jsonify({"error": "'id_auxiliar' debe ser un entero positivo."}), 400
    if id_auxiliar:
        query = query.filter_by(id_auxiliar=id_auxiliar)
    return jsonify([_horario_json(horario) for horario in query.order_by(Horario.fecha).all()])


@app.route('/api/horarios/<int:horario_id>', methods=['GET', 'PATCH', 'PUT'])
def horario_detalle(horario_id):
    horario = db.session.get(Horario, horario_id)
    if not horario:
        return jsonify({"error": "Horario no encontrado."}), 404
    if request.method == "GET":
        return jsonify(_horario_json(horario))
    body = _json_body()
    if body is None:
        return jsonify({"error": "Se requiere un objeto JSON."}), 400
    fields = {
        "fecha": ("fecha", date),
        "dia_semana": ("dia_semana", str),
        "hora_entrada": ("hora_entrada", time),
        "hora_salida": ("hora_salida", time),
        "turno": ("turno", str),
        "es_descanso": ("es_descanso", bool),
        "id_auxiliar": ("id_auxiliar", int),
    }
    try:
        _update_record(horario, body, fields)
        for field in ("fecha", "hora_entrada", "hora_salida", "id_auxiliar"):
            if field in body and body[field] is None:
                raise ValueError(f"'{field}' no puede ser nulo.")
        if "id_auxiliar" in body and not db.session.get(Auxiliar, horario.id_auxiliar):
            raise ValueError("El auxiliar indicado no existe.")
        if not horario.es_descanso and horario.hora_salida <= horario.hora_entrada:
            raise ValueError("'hora_salida' debe ser posterior a 'hora_entrada'.")
    except (TypeError, ValueError) as error:
        db.session.rollback()
        return jsonify({"error": str(error)}), 400
    result = _save_changes()
    if result:
        return result
    return jsonify(_horario_json(horario))

@app.route('/api/auxiliar/horario', methods=['GET'])
def get_horario_auxiliar():
    hoy = date.today()
    inicio_semana = hoy - timedelta(days=hoy.weekday())
    fin_semana = inicio_semana + timedelta(days=6)
    query = Horario.query.filter(Horario.fecha.between(inicio_semana, fin_semana))
    id_auxiliar_raw = request.args.get("id_auxiliar")
    try:
        id_auxiliar = int(id_auxiliar_raw) if id_auxiliar_raw else None
        if id_auxiliar is not None and id_auxiliar <= 0:
            raise ValueError
    except ValueError:
        return jsonify({"error": "'id_auxiliar' debe ser un entero positivo."}), 400
    if id_auxiliar:
        query = query.filter_by(id_auxiliar=id_auxiliar)
    horarios = query.order_by(Horario.fecha).all()
    dias_laborales = [horario for horario in horarios if not horario.es_descanso]
    horas_totales = sum(
        (datetime.combine(horario.fecha, horario.hora_salida) -
         datetime.combine(horario.fecha, horario.hora_entrada)).total_seconds() / 3600
        for horario in dias_laborales
    )
    descanso = next((horario.dia_semana for horario in horarios if horario.es_descanso), None)
    return jsonify({
        "resumen": {
            "diasLaborales": str(len(dias_laborales)),
            "horasTotales": f"{horas_totales:g}",
            "diaDescanso": descanso[:3] if descanso else "—",
        },
        "dias": [_horario_json(horario) for horario in horarios],
    })


# =============================================================================
# CAMPOS PERSONALIZADOS CONFIGURABLES POR MÓDULO
# =============================================================================
class CampoPersonalizado(db.Model):
    __tablename__ = 'campo_personalizado'
    id = db.Column(db.Integer, primary_key=True)
    modulo = db.Column(db.String(30), nullable=False, index=True)  # usuarios, citas, procedimientos
    nombre = db.Column(db.String(80), nullable=False)
    etiqueta = db.Column(db.String(120), nullable=False)
    tipo = db.Column(db.String(20), nullable=False, default='texto')
    opciones = db.Column(db.Text, nullable=False, default='[]')
    obligatorio = db.Column(db.Boolean, nullable=False, default=False)
    activo = db.Column(db.Boolean, nullable=False, default=True)
    creado_en = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

# =============================================================================
# 3. AUTENTICACIÓN Y CONTROL DE ACCESO BASADO EN ROLES (RBAC)
# =============================================================================
import os
from functools import wraps
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from werkzeug.security import generate_password_hash, check_password_hash

rol_permiso = db.Table(
    'rbac_rol_permiso',
    db.Column('rol_id', db.Integer, db.ForeignKey('rbac_rol.id'), primary_key=True),
    db.Column('permiso_id', db.Integer, db.ForeignKey('rbac_permiso.id'), primary_key=True),
)

class Rol(db.Model):
    __tablename__ = 'rbac_rol'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(60), unique=True, nullable=False)
    descripcion = db.Column(db.String(255), default='')
    sistema = db.Column(db.Boolean, default=False, nullable=False)
    permisos = db.relationship('Permiso', secondary=rol_permiso, lazy='selectin')

class Permiso(db.Model):
    __tablename__ = 'rbac_permiso'
    id = db.Column(db.Integer, primary_key=True)
    codigo = db.Column(db.String(100), unique=True, nullable=False)
    modulo = db.Column(db.String(80), nullable=False)
    descripcion = db.Column(db.String(180), nullable=False)

class UsuarioSistema(db.Model):
    __tablename__ = 'rbac_usuario'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    correo = db.Column(db.String(160), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    activo = db.Column(db.Boolean, default=True, nullable=False)
    rol_id = db.Column(db.Integer, db.ForeignKey('rbac_rol.id'), nullable=False)
    rol = db.relationship('Rol', lazy='joined')

PERMISOS_RBAC = [
 ('dashboard.ver','Panel principal','Ver indicadores y resumen'),
 ('agenda.ver','Agenda','Consultar las citas'), ('agenda.gestionar','Agenda','Crear, editar y cancelar citas'),
 ('clientes.ver','Clientes','Consultar fichas de clientes'), ('clientes.gestionar','Clientes','Crear y modificar clientes'),
 ('procedimientos.ver','Procedimientos','Consultar procedimientos'), ('procedimientos.gestionar','Procedimientos','Registrar y actualizar procedimientos'),
 ('horarios.gestionar','Horarios','Administrar horarios y turnos'), ('promociones.gestionar','Promociones','Crear y editar promociones'),
 ('reportes.ver','Reportes','Consultar reportes del negocio'), ('roles.gestionar','Usuarios y roles','Crear roles y asignar permisos'),
 ('configuracion.gestionar','Configuración','Modificar la configuración general'),
]
ROLE_DEFAULTS = {
 'administrador': [p[0] for p in PERMISOS_RBAC],
 'auxiliar': ['dashboard.ver','agenda.ver','agenda.gestionar','clientes.ver','procedimientos.ver','procedimientos.gestionar'],
 'especialista': ['dashboard.ver','agenda.ver','procedimientos.ver','procedimientos.gestionar'],
 'cliente': ['agenda.ver'],
}

def _serializer():
    secret = app.config.get('SECRET_KEY') or os.environ.get('MEYER_SECRET_KEY')
    if not secret:
        # Development fallback only. Configure MEYER_SECRET_KEY in production.
        secret = 'DEV-ONLY-change-this-MEYER_SECRET_KEY-before-deploying'
    return URLSafeTimedSerializer(secret, salt='meyer-spa-auth-v1')

def _usuario_json(usuario):
    return {'id': usuario.id, 'nombre': usuario.nombre, 'correo': usuario.correo,
            'rol': usuario.rol.nombre, 'permisos': [p.codigo for p in usuario.rol.permisos]}

def _current_user():
    token = request.headers.get('Authorization', '').removeprefix('Bearer ').strip()
    if not token:
        return None
    try:
        payload = _serializer().loads(token, max_age=60 * 60 * 8)
    except (BadSignature, SignatureExpired):
        return None
    user = db.session.get(UsuarioSistema, payload.get('uid'))
    return user if user and user.activo else None

def require_permission(permission=None):
    def decorator(fn):
        @wraps(fn)
        def wrapped(*args, **kwargs):
            user = _current_user()
            if not user:
                return jsonify({'error': 'Sesión ausente o vencida. Inicia sesión nuevamente.'}), 401
            if user.rol.nombre == 'administrador':
                return fn(*args, **kwargs)
            if permission and permission not in {p.codigo for p in user.rol.permisos}:
                return jsonify({'error': 'No tienes privilegios para realizar esta operación.'}), 403
            return fn(*args, **kwargs)
        return wrapped
    return decorator

@app.before_request
def _rbac_protect_api():
    if not request.path.startswith('/api/') or request.method == 'OPTIONS':
        return None
    if request.path in ('/api/auth/login', '/api/auth/bootstrap-status', '/api/auth/bootstrap', '/api/auth/me', '/api/clientes/registro'):
        return None
    user = _current_user()
    if not user:
        return jsonify({'error': 'Debes iniciar sesión para acceder a esta API.'}), 401
    if user.rol.nombre == 'administrador':
        return None
    path, method = request.path, request.method
    if path.startswith('/api/roles') or path.startswith('/api/permisos') or path.startswith('/api/auth/users'):
        permission = 'roles.gestionar'
    elif path.startswith('/api/campos-personalizados'):
        permission = 'configuracion.gestionar'
    elif 'dashboard-summary' in path:
        permission = 'dashboard.ver'
    elif '/clientes' in path:
        permission = 'clientes.gestionar' if method in ('POST','PUT','PATCH','DELETE') else 'clientes.ver'
    elif '/procedimientos' in path:
        permission = 'procedimientos.gestionar' if method in ('POST','PUT','PATCH','DELETE') else 'procedimientos.ver'
    elif '/horarios' in path or '/horario' in path:
        permission = 'horarios.gestionar'
    elif '/citas' in path:
        permission = 'agenda.gestionar' if method in ('POST','PUT','PATCH','DELETE') else 'agenda.ver'
    else:
        permission = 'configuracion.gestionar'
    if permission not in {p.codigo for p in user.rol.permisos}:
        return jsonify({'error': f'Permiso requerido: {permission}'}), 403
    return None

@app.route('/api/auth/bootstrap-status', methods=['GET'])
def auth_bootstrap_status():
    return jsonify({'needsSetup': UsuarioSistema.query.count() == 0})

@app.route('/api/auth/bootstrap', methods=['POST'])
def auth_bootstrap():
    if UsuarioSistema.query.count() > 0:
        return jsonify({'error': 'La configuración inicial ya fue completada.'}), 409
    body = _json_body() or {}
    nombre, correo, password = (body.get('nombre','').strip(), body.get('correo','').strip().lower(), body.get('password',''))
    if not nombre or not correo or len(password) < 12:
        return jsonify({'error': 'Indica nombre, correo y una contraseña de al menos 12 caracteres.'}), 400
    _seed_rbac()
    admin = Rol.query.filter_by(nombre='administrador').first()
    user = UsuarioSistema(nombre=nombre, correo=correo, password_hash=generate_password_hash(password), rol=admin)
    db.session.add(user); db.session.commit()
    token = _serializer().dumps({'uid': user.id})
    return jsonify({'token': token, 'usuario': _usuario_json(user)}), 201

@app.route('/api/clientes/registro', methods=['POST'])
def registrar_cliente_portal():
    """Registro público de clientes; no crea cuentas administrativas."""
    body = _json_body() or {}
    nombres = str(body.get('nombres', '')).strip()
    apellidos = str(body.get('apellidos', '')).strip()
    cedula = str(body.get('cedula', '')).strip()
    correo = str(body.get('correo', '')).strip().lower()
    telefono = str(body.get('telefono', '')).strip()
    password = body.get('password', '')
    if not all([nombres, apellidos, cedula, correo, password]):
        return jsonify({'error': 'Completa nombres, apellidos, documento, correo y contraseña.'}), 400
    if len(password) < 8:
        return jsonify({'error': 'La contraseña debe tener al menos 8 caracteres.'}), 400
    if Cliente.query.filter((Cliente.correo == correo) | (Cliente.cedula == cedula)).first():
        return jsonify({'error': 'Ya existe un cliente con ese correo o documento.'}), 409
    if UsuarioSistema.query.filter_by(correo=correo).first():
        return jsonify({'error': 'Ese correo ya tiene una cuenta en Meyer Spa.'}), 409
    _seed_rbac()
    rol_cliente = Rol.query.filter_by(nombre='cliente').first()
    cliente = Cliente(nombres=nombres, apellidos=apellidos, cedula=cedula,
                      correo=correo, telefono=telefono or None,
                      password_hash=generate_password_hash(password))
    cuenta = UsuarioSistema(nombre=f'{nombres} {apellidos}', correo=correo,
                            password_hash=generate_password_hash(password), rol=rol_cliente)
    db.session.add_all([cliente, cuenta])
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'No fue posible crear la cuenta: revisa que el correo y documento no estén registrados.'}), 409
    token = _serializer().dumps({'uid': cuenta.id})
    return jsonify({'mensaje': 'Cuenta de cliente creada.', 'token': token,
                    'usuario': _usuario_json(cuenta),
                    'cliente': {'id_cliente': cliente.id_cliente, 'nombres': cliente.nombres,
                                'apellidos': cliente.apellidos, 'correo': cliente.correo}}), 201


@app.route('/api/auth/login', methods=['POST'])
def auth_login():
    body = _json_body() or {}
    correo, password = body.get('correo','').strip().lower(), body.get('password','')
    user = UsuarioSistema.query.filter_by(correo=correo, activo=True).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Correo o contraseña incorrectos.'}), 401
    return jsonify({'token': _serializer().dumps({'uid': user.id}), 'usuario': _usuario_json(user)})

@app.route('/api/auth/me', methods=['GET'])
def auth_me():
    user = _current_user()
    if not user:
        return jsonify({'error': 'Sesión ausente o vencida.'}), 401
    return jsonify(_usuario_json(user))

@app.route('/api/auth/users', methods=['GET','POST'])
def auth_users():
    if request.method == 'GET':
        return jsonify([{'id':u.id,'nombre':u.nombre,'correo':u.correo,'activo':u.activo,'rol':u.rol.nombre} for u in UsuarioSistema.query.order_by(UsuarioSistema.nombre).all()])
    body = _json_body() or {}
    nombre, correo, password, rol_id = body.get('nombre','').strip(), body.get('correo','').strip().lower(), body.get('password',''), body.get('rol_id')
    if not nombre or not correo or len(password) < 12:
        return jsonify({'error':'Nombre, correo y contraseña de al menos 12 caracteres son obligatorios.'}), 400
    rol = db.session.get(Rol, rol_id) if isinstance(rol_id,int) else None
    if not rol: return jsonify({'error':'Rol no válido.'}), 400
    user = UsuarioSistema(nombre=nombre, correo=correo, password_hash=generate_password_hash(password), rol=rol)
    db.session.add(user)
    try: db.session.commit()
    except IntegrityError:
        db.session.rollback(); return jsonify({'error':'Ya existe un usuario con ese correo.'}), 409
    return jsonify({'id':user.id,'nombre':user.nombre,'correo':user.correo,'rol':rol.nombre}), 201

@app.route('/api/roles', methods=['GET','POST'])
def rbac_roles():
    if request.method == 'GET':
        return jsonify([{'id':r.id,'nombre':r.nombre,'descripcion':r.descripcion,'sistema':r.sistema,'permisos':[p.codigo for p in r.permisos]} for r in Rol.query.order_by(Rol.id).all()])
    body = _json_body() or {}; nombre = body.get('nombre','').strip(); descripcion = body.get('descripcion','').strip()
    codigos = body.get('permisos', [])
    if not nombre or not isinstance(codigos,list): return jsonify({'error':'Nombre y lista de permisos son obligatorios.'}), 400
    if Rol.query.filter(db.func.lower(Rol.nombre)==nombre.lower()).first(): return jsonify({'error':'Ya existe un rol con ese nombre.'}), 409
    permisos = Permiso.query.filter(Permiso.codigo.in_(codigos)).all() if codigos else []
    if len(permisos) != len(set(codigos)): return jsonify({'error':'La lista contiene permisos desconocidos.'}), 400
    rol = Rol(nombre=nombre, descripcion=descripcion, sistema=False, permisos=permisos)
    db.session.add(rol); db.session.commit()
    return jsonify({'id':rol.id,'nombre':rol.nombre,'descripcion':rol.descripcion,'sistema':rol.sistema,'permisos':[p.codigo for p in rol.permisos]}), 201

@app.route('/api/roles/<int:rol_id>', methods=['PUT','PATCH','DELETE'])
def rbac_rol_detalle(rol_id):
    rol = db.session.get(Rol, rol_id)
    if not rol: return jsonify({'error':'Rol no encontrado.'}), 404
    if request.method == 'DELETE':
        if rol.sistema: return jsonify({'error':'Los roles del sistema no se pueden eliminar.'}), 400
        if UsuarioSistema.query.filter_by(rol_id=rol.id).first(): return jsonify({'error':'Reasigna los usuarios antes de eliminar este rol.'}), 409
        db.session.delete(rol); db.session.commit(); return jsonify({'ok':True})
    body = _json_body() or {}
    if rol.nombre == 'administrador' and 'permisos' in body:
        return jsonify({'error':'El rol administrador conserva todos los permisos.'}), 400
    if 'nombre' in body:
        nombre = body['nombre'].strip()
        other = Rol.query.filter(db.func.lower(Rol.nombre)==nombre.lower(), Rol.id != rol.id).first()
        if not nombre or other: return jsonify({'error':'Nombre vacío o ya utilizado.'}), 409
        rol.nombre = nombre
    if 'descripcion' in body: rol.descripcion = body['descripcion'].strip()
    if 'permisos' in body:
        codigos = body['permisos']
        if not isinstance(codigos,list): return jsonify({'error':'Permisos debe ser una lista.'}), 400
        permisos = Permiso.query.filter(Permiso.codigo.in_(codigos)).all() if codigos else []
        if len(permisos) != len(set(codigos)): return jsonify({'error':'Hay permisos desconocidos.'}), 400
        rol.permisos = permisos
    db.session.commit()
    return jsonify({'id':rol.id,'nombre':rol.nombre,'descripcion':rol.descripcion,'sistema':rol.sistema,'permisos':[p.codigo for p in rol.permisos]})

@app.route('/api/permisos', methods=['GET'])
def rbac_permisos():
    return jsonify([{'codigo':p.codigo,'modulo':p.modulo,'descripcion':p.descripcion} for p in Permiso.query.order_by(Permiso.modulo,Permiso.codigo).all()])

def _seed_rbac():
    for codigo, modulo, descripcion in PERMISOS_RBAC:
        if not Permiso.query.filter_by(codigo=codigo).first():
            db.session.add(Permiso(codigo=codigo, modulo=modulo, descripcion=descripcion))
    db.session.flush()
    for nombre, codigos in ROLE_DEFAULTS.items():
        rol = Rol.query.filter_by(nombre=nombre).first()
        if not rol:
            rol = Rol(nombre=nombre, descripcion={'administrador':'Control total del sistema','auxiliar':'Atención y operación diaria','especialista':'Atención de procedimientos y turnos','cliente':'Acceso a sus citas y perfil'}[nombre], sistema=True)
            db.session.add(rol); db.session.flush()
        if not rol.permisos:
            rol.permisos = Permiso.query.filter(Permiso.codigo.in_(codigos)).all()
    db.session.commit()

# Ensure RBAC tables/seed exist when starting the API. Admin is created via one-time bootstrap.
_original_create_all = db.create_all
def _initialize_rbac():
    db.create_all()
    _seed_rbac()

@app.route('/api/campos-personalizados', methods=['GET', 'POST'])
@require_permission('configuracion.gestionar')
def campos_personalizados():
    modulos_validos = {'usuarios', 'citas', 'procedimientos'}
    if request.method == 'GET':
        modulo = request.args.get('modulo')
        query = CampoPersonalizado.query
        if modulo:
            if modulo not in modulos_validos:
                return jsonify({'error': 'Módulo no válido.'}), 400
            query = query.filter_by(modulo=modulo)
        return jsonify([{
            'id': c.id, 'modulo': c.modulo, 'nombre': c.nombre,
            'etiqueta': c.etiqueta, 'tipo': c.tipo,
            'opciones': __import__('json').loads(c.opciones or '[]'),
            'obligatorio': c.obligatorio, 'activo': c.activo
        } for c in query.order_by(CampoPersonalizado.id).all()])
    body = _json_body() or {}
    modulo, nombre = body.get('modulo', ''), body.get('nombre', '').strip()
    etiqueta, tipo = body.get('etiqueta', '').strip(), body.get('tipo', 'texto')
    tipos_validos = {'texto', 'numero', 'fecha', 'lista', 'casilla', 'correo', 'telefono'}
    opciones = body.get('opciones', [])
    if modulo not in modulos_validos or not nombre or not etiqueta or tipo not in tipos_validos:
        return jsonify({'error': 'Completa módulo, nombre, etiqueta y un tipo válido.'}), 400
    if not isinstance(opciones, list) or any(not isinstance(x, str) for x in opciones):
        return jsonify({'error': 'Las opciones deben ser una lista de textos.'}), 400
    if tipo == 'lista' and not opciones:
        return jsonify({'error': 'Añade al menos una opción para la lista desplegable.'}), 400
    if CampoPersonalizado.query.filter_by(modulo=modulo, nombre=nombre).first():
        return jsonify({'error': 'Ya existe un campo con ese nombre en este módulo.'}), 409
    campo = CampoPersonalizado(modulo=modulo, nombre=nombre, etiqueta=etiqueta, tipo=tipo,
        opciones=__import__('json').dumps(opciones, ensure_ascii=False),
        obligatorio=bool(body.get('obligatorio', False)), activo=True)
    db.session.add(campo); db.session.commit()
    return jsonify({'id': campo.id, 'modulo': campo.modulo, 'nombre': campo.nombre,
        'etiqueta': campo.etiqueta, 'tipo': campo.tipo, 'opciones': opciones,
        'obligatorio': campo.obligatorio, 'activo': campo.activo}), 201

@app.route('/api/campos-personalizados/<int:campo_id>', methods=['PATCH', 'DELETE'])
@require_permission('configuracion.gestionar')
def campo_personalizado_detalle(campo_id):
    campo = db.session.get(CampoPersonalizado, campo_id)
    if not campo:
        return jsonify({'error': 'Campo no encontrado.'}), 404
    if request.method == 'DELETE':
        db.session.delete(campo); db.session.commit()
        return jsonify({'ok': True})
    body = _json_body() or {}
    if 'etiqueta' in body:
        etiqueta = str(body['etiqueta']).strip()
        if not etiqueta: return jsonify({'error': 'La etiqueta no puede estar vacía.'}), 400
        campo.etiqueta = etiqueta
    if 'obligatorio' in body: campo.obligatorio = bool(body['obligatorio'])
    if 'activo' in body: campo.activo = bool(body['activo'])
    db.session.commit()
    return jsonify({'id': campo.id, 'modulo': campo.modulo, 'nombre': campo.nombre,
        'etiqueta': campo.etiqueta, 'tipo': campo.tipo,
        'opciones': __import__('json').loads(campo.opciones or '[]'),
        'obligatorio': campo.obligatorio, 'activo': campo.activo})

if __name__ == '__main__':
    with app.app_context():
        _initialize_rbac()
    app.run(debug=True, port=5001)
