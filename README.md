# 🧰 SGAFH — Sistema de Gestión para AFH Metalmecánicos S.A.S

### 🏗 Proyecto Académico – Universidad del Valle  
**Curso:** Introducción a la Gestión de Proyectos de Software  
**Facultad de Ingeniería – Escuela de Ingeniería de Sistemas y Computación**  
**Programa:** Ingeniería de Sistemas  
**Fecha:** 2025  

---

## 👥 Integrantes del equipo

| Nombre | Código |
|--------|--------|
| **Néstor David Heredia Gutiérrez** | 2058558 |
| **Óscar David Cuaical** | 2270657 |
| **Sebastián Marulanda Cárdenas** | 2410241 |
| **Sebastián Saldaña** | 2410214 |

**Docente:** Beatriz Eugenia Grass Ramírez  

---

## 📖 Descripción del Proyecto

El **Sistema de Gestión AFH (SGAFH)** es una aplicación web desarrollada para la empresa **AFH Metalmecánicos S.A.S**, con el propósito de **optimizar la gestión administrativa** de herramientas, suministros, cotizaciones y usuarios.

Esta solución busca digitalizar los procesos internos, reducir errores humanos, aumentar la trazabilidad de la información y mejorar la eficiencia operativa.

---

## 🧩 Arquitectura del Sistema

El proyecto está compuesto por dos aplicaciones principales:

- **Backend:** `BackEnd_AFH-main` → Node.js + Express + MongoDB  
- **Frontend:** `FrontEnd_AFH-main` → Angular  

---

## ⚙️ Requisitos previos

- Node.js >= 16  
- npm (incluido con Node.js)  
- MongoDB local (o Atlas)  
- Angular CLI (si vas a usar `ng serve`)  
- MongoDB Compass (opcional para visualizar datos)

---

## 🗄️ 1. Configurar y levantar MongoDB

Si usas MongoDB local en Windows:

```bash
net start MongoDB
```

O manualmente:
```bash
mongod
```

Conexión recomendada:
mongodb://127.0.0.1:27017
La base de datos utilizada se crea automáticamente al insertar datos:
SGAFH_BD

## 🖥️ 2. Backend — (BackEnd_AFH-main)

2.1 Instalar dependencias
```bash
cd BackEnd_AFH-main
npm install
```
2.2 Configurar variables de entorno
Copia el archivo .env.example a .env y edita las variables según tu entorno local o Atlas.
Ejemplo:
```bash
DB_URI='mongodb://127.0.0.1:27017/SGAFH_BD'
PORT=2009
TOKEN_KEY='/3sT3b4nD3v_2023*/'
TOKEN_EXPIRATION='7d'

EMAIL='sistemas@afhmetalmecanico.com'
PASSWORD='G3stion@M'
```

2.3 Generar hash para contraseñas
```bash
node generarHash.js
```
Esto imprimirá en consola el hash que debes usar en el documento de usuario dentro de MongoDB.

2.4 Iniciar el servidor
```bash
npm start
```
o
```bash
npm run dev
```

Salida esperada:
Servidor corriendo en puerto 2009
Conectado a MongoDB

## 💻 3. Frontend — (FrontEnd_AFH-main)

3.1 Instalar dependencias
```bash
cd FrontEnd_AFH-main
npm install
```

3.2 Iniciar Angular
```bash
ng serve
```
Por defecto estará disponible en:
👉 http://localhost:4200

Asegúrate de que las peticiones en environment.ts apunten a:
http://localhost:2009

## 🔑 4. Usuario de prueba

Inserta en la colección users del MongoDB:

```bash
{
  "name": "Admin",
  "lastName": "Test",
  "email": "admin@afhmetalmecanico.com",
  "password": "$2b$12$g8KM8bTVmLEfxBZhHKt9Kuw2S5c.7V3Vrnv8z6yhaYrqfZP4lxoiC",
  "numberPhone": "3110000000",
  "verifyCode": "",
  "role": "admin",
  "image": "",
  "area": "sistemas"
}
Email: admin@afhmetalmecanico.com
Contraseña: admin123
```

## 🚀 5. Ejecución completa

Inicia MongoDB localmente.

Ejecuta el backend (npm run dev o node app.js).

Abre el frontend (ng serve).

Accede a http://localhost:4200 e inicia sesión con el usuario de prueba.

## 📊 6. Metodología de trabajo (Scrum)

El proyecto se desarrolló bajo la metodología ágil Scrum, dividiéndose en Sprints de 15 días con planificación, revisión y retrospectiva.

🔹 Herramientas utilizadas
- Jira — Gestión del backlog y seguimiento de tareas
- Figma — Diseño UI/UX de interfaces
- GitHub — Control de versiones y colaboración
- Node.js / Express / MongoDB — Backend
- Angular — Frontend


## 🧩 7. Módulos principales del sistema

- 🔐 Autenticación de usuarios (JWT + bcrypt)
- 👥 Gestión de usuarios y roles
- 🧰 Gestión de herramientas y suministros
- 📄 Gestión de cotizaciones
- ⚙️ Configuración y seguridad del sistema
