README — Cómo ejecutar la aplicación (Angular + Node.js + MongoDB)

Resumen rápido: este proyecto tiene dos partes separadas:

BackEnd_AFH-main → Node.js / Express (API + conexión a MongoDB)

FrontEnd_AFH-main → Angular (interfaz)

A continuación tienes los pasos para levantar la aplicación localmente, ejemplos de .env, y credenciales de prueba para entrar al sistema.

Requisitos

Node.js >= 16 (incluye npm)

MongoDB local (o Atlas) — en este README asumo MongoDB local en 127.0.0.1:27017

Angular CLI (solo si quieres usar ng serve): npm install -g @angular/cli

MongoDB Compass (opcional, para ver/editar datos)

1) Configurar y levantar MongoDB (local)

Si tienes MongoDB instalado como servicio en Windows:

net start MongoDB


o abre una terminal y ejecuta:

mongod


Conecta con MongoDB Compass usando la conexión:

mongodb://127.0.0.1:27017


La base de datos usada por la app se llamará SGAFH_BD (se crea automáticamente al insertar datos).

2) Backend — (BackEnd_AFH-main)
2.1 Instalar dependencias

Abre una terminal en la carpeta del backend:

cd BackEnd_AFH-main
npm install

2.2 Configurar variables de entorno

Copia el .env.example a .env (si no existe) y edita las variables:

cp .env.example .env   # (Windows: crea manualmente .env)


Ejemplo de .env (ajusta si usas Atlas):

DB_URI='mongodb://127.0.0.1:27017/SGAFH_BD'
PORT=2009
TOKEN_KEY='/3sT3b4nD3v_2023*/'
TOKEN_EXPIRATION='7d'

EMAIL='sistemas@afhmetalmecanico.com'    # (opcional: para envío de correos)
PASSWORD='G3stion@M'                      # (opcional: contraseña SMTP o similar)


Asegúrate de que DB_URI apunte correctamente a tu MongoDB.

2.3 Generar hash para una contraseña (si necesitas crear/actualizar un usuario)

El proyecto incluye generarHash.js para generar bcrypt hashes. Para usarlo:

node generarHash.js


La salida será algo como:

Hash generado: $2b$12$KO4rsKdAsNW/...


Copia ese hash y pégalo en el campo password del documento del usuario en MongoDB (por ejemplo vía Compass). La contraseña en texto plano será la que esté definida dentro de generarHash.js (si el script toma un texto fijo) — si no estás seguro, abre generarHash.js para ver el const password = '...'.

2.4 Iniciar el servidor

Desde la carpeta BackEnd_AFH-main:

node app.js
# o si hay script en package.json:
npm start
# o para modo desarrollo (si está configurado):
npm run dev


Debes ver en consola algo como:

Servidor corriendo en puerto 2009
Conectado a MongoDB

3) Frontend — (FrontEnd_AFH-main)
3.1 Instalar dependencias

En otra terminal:

cd FrontEnd_AFH-main
npm install

3.2 Iniciar Angular
ng serve


Si no tienes ng disponible:

npm install -g @angular/cli
ng serve


Angular servirá en:

http://localhost:4200

4) URLs importantes

Frontend: http://localhost:4200

Backend API: http://localhost:2009 (puerto según .env)

Asegúrate de que el frontend esté realizando las peticiones al backend en http://localhost:2009 o la ruta que corresponda (revisa environment.ts si es necesario).

5) Credenciales / Usuario de prueba (sugerido)

Si necesitas credenciales rápidas para entrar al sistema, puedes usar una cuenta de prueba que insertes en la colección users (en MongoDB Compass):

Documento de ejemplo (insertar en SGAFH_BD.users → Add Data → Insert Document):

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

Contraseña (texto plano): admin123

Nota: la contraseña de arriba ya está guardada como hash ($2b$12$...). Si prefieres una contraseña personalizada:

Abre generarHash.js y define la contraseña deseada.

Ejecuta node generarHash.js.

Copia el hash generado y reemplaza el campo password del usuario en MongoDB.

6) Solución de problemas comunes

Error: "usuario o contraseña incorrectos"

Asegúrate de que el password en la DB sea el hash correspondiente a la contraseña en texto plano que estás usando.

Si no coinciden, genera un nuevo hash con node generarHash.js y actualiza el documento del usuario.

Revisa en DevTools → Network la respuesta del endpoint /login para ver el token o el error en detalle.

Angular no muestra módulos según role

Verifica que el token JWT incluya el campo role. Puedes decodificar el JWT en jwt.io para revisar el payload.

Comprueba la lógica del menú/guards en el frontend para que permita role: 'admin'.

Backend no se conecta a MongoDB

Verifica que DB_URI en .env esté correcto y que el servicio mongod esté corriendo.

Revisa la consola del backend para ver el mensaje de conexión o el error.
