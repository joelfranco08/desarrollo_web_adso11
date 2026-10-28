# 💆‍♀️ MEYER SPA - Panel Auxiliar (Full Stack)

Sistema web integral para la gestión de citas, auxiliares y seguimiento de clientes en **Meyer Spa**. Desarrollado con una arquitectura desacoplada utilizando **React + Vite** en el Frontend y **Flask + SQLAlchemy + MySQL (XAMPP)** en el Backend.

---

## 📋 Prerrequisitos de Software

Antes de iniciar la instalación, asegúrate de contar con los siguientes programas instalados en tu sistema:

* **[Node.js](https://nodejs.org/)** (v18.0.0 o superior) + **npm**
* **[Python](https://www.python.org/)** (v3.10 o superior)
* **[XAMPP Control Panel](https://www.apachefriends.org/es/index.html)** (con el servicio MySQL activo)
* **[Git](https://git-scm.com/)**

---

## 🛠️ Guía de Instalación Rápida

### 1. Clonar el Repositorio

```bash
git clone https://github.com/joelfranco08/desarrollo_web_adso11.git
cd desarrollo_web_adso11
```

---

### 2. Configuración de la Base de Datos (MySQL / XAMPP)

1. Abre **XAMPP Control Panel** y haz clic en **Start** en el módulo **MySQL** (verificar que esté corriendo en el puerto `3306`).
2. Ingresa a phpMyAdmin desde tu navegador: `http://localhost/phpmyadmin/`.
3. Crea una base de datos con el nombre:
   ```text
   meyer_spa_db
   ```
   *(Cotejamiento recomendado: `utf8mb4_general_ci`)*.

---

### 3. Configuración del Backend (Flask)

Desde la **raíz del proyecto** (`desarrollo_web_adso11`), ejecuta los siguientes comandos en tu terminal:

```bash
# 1. Crear entorno virtual de Python (Opcional pero recomendado)
python -m venv venv

# 2. Activar entorno virtual
# En Windows (PowerShell):
.\venv\Scripts\Activate
# En Linux/Mac:
source venv/bin/activate

# 3. Instalar librerías requeridas
pip install flask flask-sqlalchemy flask-cors pymysql
```

---

### 4. Configuración del Frontend (React + Vite)

Abre una **nueva terminal**, navega a la carpeta del frontend e instala las dependencias de Node:

```bash
# Entrar a la carpeta frontend
cd frontend

# Instalar módulos de React, TailwindCSS, Lucide-react y Axios
npm install
```

---

## 🚀 Ejecución del Sistema

Para correr la aplicación de forma local, necesitarás tener ambas terminales ejecutándose al mismo tiempo:

### Terminal 1: Backend (Flask)
```bash
# En la raíz del proyecto
python app.py
```
* **URL Backend:** `http://localhost:5000/api` (o `http://localhost:5001/api` según tu puerto configurado).

### Terminal 2: Frontend (React)
```bash
# Dentro de la carpeta /frontend
npm run dev
```
* **URL Frontend:** `http://localhost:5173/`

---

## 🔌 API del panel auxiliar

El backend expone respuestas JSON bajo `/api`. Las rutas de listado consultan los
registros de MySQL; las rutas por identificador aceptan `GET`, `PATCH` y `PUT`
para consultar o actualizar campos permitidos. Las actualizaciones reciben un
objeto JSON y devuelven el registro actualizado; los errores se devuelven como
`{"error": "..."}` con su código HTTP.

| Recurso | Rutas |
| --- | --- |
| Resumen y agenda | `GET /api/auxiliar/dashboard-summary`, `GET /api/auxiliar/citas?fecha=YYYY-MM-DD`, `GET/PATCH /api/auxiliar/citas/<id>` |
| Clientes | `GET /api/clientes`, `GET/PATCH /api/clientes/<id>` |
| Procedimientos | `GET /api/procedimientos`, `GET/PATCH /api/procedimientos/<id>` |
| Horarios | `GET /api/auxiliar/horario`, `GET /api/horarios`, `GET/PATCH /api/horarios/<id>` |

La agenda admite los filtros opcionales `fecha`, `id_auxiliar` e `id_cliente`.
La vista de horario presenta la semana actual y permite filtrar por `id_auxiliar`.
Las rutas de actualización también aceptan `PUT`.

---

## 📂 Estructura del Proyecto

```text
desarrollo_web_adso11/
├── app.py                   # Servidor Flask, ORM y endpoints REST
├── .gitignore               # Archivos excluidos de Git
├── README.md                # Documentación del proyecto
└── frontend/                # Aplicación React
    ├── src/
    │   ├── components/      # Componentes UI (Dashboard, Agenda, Horarios)
    │   ├── services/        # Cliente Axios para la API (`api.js`)
    │   ├── App.jsx          # Layout maestro y enrutamiento simple
    │   └── main.jsx         # Punto de entrada de React
    ├── index.html           # Plantilla HTML con tipografías
    ├── package.json         # Dependencias frontend
    └── tailwind.config.js   # Tokens de diseño (Colores meyer.*)
```

---

## 🎨 Design System & Tokens Visuales

* **Fondo Principal:** `#FDFBF7` (Blanco Cálido / Warm Cream)
* **Color Acento / Marca:** `#C5A059` (Dorado Elegante)
* **Texto Primario / Botones:** `#2E2A27` (Marrón Expreso)
* **Tipografías:** `Playfair Display` (Titulares/Serif) y `Plus Jakarta Sans` (Interfaz/Sans-serif)

---

## 🌿 Portal de cliente (prototipo Figma)

Se integró el prototipo **Meyer Spa Web App** como portal de cliente, manteniendo el panel auxiliar existente.

- Panel auxiliar: `http://localhost:5173/`
- Portal de cliente: `http://localhost:5173/cliente`

El portal de cliente incluye navegación por Inicio, Mi horario, Promociones, Procedimientos, Comunidad, Perfil y Notificaciones. Por ahora conserva los datos de demostración definidos en el prototipo de Figma; todavía no está conectado a los endpoints de Flask/MySQL. La integración de datos reales se puede hacer después, reutilizando `frontend/src/services/api.js`.

Para iniciar el frontend:

```bash
cd frontend
npm install
npm run dev
```

## Autenticación y privilegios (RBAC)

El backend crea las tablas `rbac_rol`, `rbac_permiso`, `rbac_rol_permiso` y `rbac_usuario` al iniciar `python app.py`, y carga los roles/permisos iniciales. La cuenta administradora se crea desde el primer acceso del frontend: completa el formulario de configuración inicial con nombre, correo y una contraseña de al menos 12 caracteres. Después de esa primera cuenta, el endpoint de configuración inicial queda bloqueado.

### Ejecutar en desarrollo

1. Inicia MySQL y crea la base de datos `meyer_spa_db`.
2. Configura `SQLALCHEMY_DATABASE_URI` en `app.py` si tus credenciales de MySQL no son `root` sin contraseña en `localhost`.
3. Instala las dependencias del backend: `pip install -r requirements.txt`.
4. Inicia el backend desde la raíz: `python app.py` (puerto 5001).
5. En otra terminal: `cd frontend`, `npm install`, `npm run dev` (Vite normalmente en puerto 5173).
6. Abre el frontend y crea el administrador inicial.

### API de acceso

- `GET /api/auth/bootstrap-status`: indica si falta configurar el primer administrador.
- `POST /api/auth/bootstrap`: crea la primera cuenta administradora (solo se permite cuando no existen usuarios).
- `POST /api/auth/login`: recibe `{ "correo": "...", "password": "..." }` y devuelve token firmado.
- `GET /api/auth/me`: devuelve el usuario autenticado.
- `GET/POST /api/roles`, `PATCH/PUT/DELETE /api/roles/<id>`: consulta y administra roles.
- `GET /api/permisos`: catálogo de permisos.
- `GET/POST /api/auth/users`: consulta usuarios y crea usuarios con rol.

Las peticiones protegidas requieren `Authorization: Bearer <token>`. Los tokens expiran a las 8 horas. En producción, define una variable de entorno `MEYER_SECRET_KEY` con un secreto aleatorio fuerte, configura las credenciales de MySQL por variables de entorno y desactiva el modo debug. No publiques el secreto ni credenciales reales en GitHub.

**Nota:** esta integración protege las APIs actuales por permisos de módulo y ofrece endpoints de administración de usuarios/roles. La creación de usuarios está disponible vía API; una pantalla de gestión de usuarios y el enlace de cada rol a las tablas antiguas `cliente`/`auxiliar` pueden desarrollarse como siguiente iteración.


## Usuarios y campos personalizados

- Inicia sesión con una cuenta que tenga `roles.gestionar` para crear usuarios y asignarles un rol. Cada usuario utiliza el mismo formulario de inicio de sesión con su correo y contraseña.
- En `Campos personalizados`, elige Usuarios, Citas o Procedimientos para definir campos de texto, número, fecha, lista desplegable, casilla, correo o teléfono. Las definiciones se guardan en la tabla `campo_personalizado` de MySQL.
- Los nuevos campos quedan configurados en la base de datos; la incorporación de sus valores a cada formulario y registro requiere conectar el esquema de captura de datos del módulo correspondiente antes de usarlo en producción.
- La creación automática de tablas funciona con `db.create_all()` al iniciar Flask; si ejecutas una instancia desplegada con un esquema ya administrado, aplica las migraciones en ese entorno.
