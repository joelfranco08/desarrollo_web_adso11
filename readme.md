# Sistema de Gestión de Eventos 🎉

Proyecto desarrollado en Flask para la gestión de eventos con autenticación, control de roles y manejo de inscripciones.

---

# 📌 Características

✅ Registro de usuarios  
✅ Inicio y cierre de sesión  
✅ Roles:
- Organizador
- Asistente

✅ Crear eventos  
✅ Editar eventos  
✅ Eliminar eventos  
✅ Inscribirse a eventos  
✅ Cancelar inscripción  
✅ Perfil de usuario  
✅ Editar biografía  
✅ Filtro dinámico por categorías  
✅ Manejo de errores 401 y 403  
✅ Contraseñas cifradas  

---

# 🛠 Tecnologías Utilizadas

- Python
- Flask
- Flask-Login
- Flask-SQLAlchemy
- MySQL
- PyMySQL
- HTML
- Jinja2
- XAMPP

---

# 📂 Estructura del Proyecto

```text
Proyecto_creacion_de_eventos/
│
├── app/
│   ├── auth/
│   │   ├── __init__.py
│   │   └── routes.py
│   │
│   ├── templates/
│   │   ├── base.html
│   │   ├── login.html
│   │   ├── registro.html
│   │   ├── index.html
│   │   ├── crear_evento.html
│   │   ├── editar_evento.html
│   │   ├── perfil.html
│   │   ├── 401.html
│   │   └── 403.html
│   │
│   ├── __init__.py
│   ├── models.py
│   ├── routes.py
│   └── decoradores.py
│
├── config.py
├── run.py
└── requirements.txt
```

---

# ⚙️ Instalación

## 1️⃣ Clonar proyecto

```bash
git clone URL_DEL_PROYECTO
```

## 2️⃣ Instalar dependencias

```bash
pip install -r requirements.txt
```

## 3️⃣ Crear base de datos

Crear en phpMyAdmin:

```text
eventos_db
```

## 4️⃣ Configurar XAMPP

Iniciar:
- Apache
- MySQL

## 5️⃣ Ejecutar proyecto

```bash
python run.py
```

---

# 🔑 Roles del Sistema

## 👨‍💼 Organizador

Puede:
- Crear eventos
- Editar eventos
- Eliminar eventos

## 👤 Asistente

Puede:
- Ver eventos
- Inscribirse
- Cancelar inscripción

---

# 🔐 Seguridad

- Contraseñas cifradas con Werkzeug
- Protección de rutas con Flask-Login
- Control de permisos mediante roles
- Manejo de errores HTTP

---

# 🚫 Manejo de Errores

## Error 401
Usuario no autenticado.

## Error 403
Usuario sin permisos.

---

# 👨‍💻 Autor

Andres Hernandez
Joel Franco

Proyecto académico desarrollado con Flask y MySQL.
