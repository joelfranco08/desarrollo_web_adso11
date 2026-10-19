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