# Yabar Backend — Panel Admin de Productos

API en Spring Boot + PostgreSQL con seguridad JWT, para administrar el catálogo
de productos de Yabar (crear, editar, eliminar) sin tocar código.

## Seguridad implementada

- Contraseñas de usuarios guardadas con hash **BCrypt** (nunca en texto plano).
- Autenticación por **JWT** (token expira a las 8 horas).
- Rutas de escritura (`POST`, `PUT`, `DELETE` de productos) requieren token válido.
- Rutas de lectura de productos son públicas (para que la landing las muestre).
- **CORS** restringido solo al dominio de tu landing (nadie más puede llamar a la API desde otro sitio).
- Ninguna credencial está escrita en el código — todas vienen de variables de entorno.

## Variables de entorno necesarias

Estas se configuran en Railway (o el hosting que uses), **nunca** en el código:

| Variable | Ejemplo | Descripción |
|---|---|---|
| `DATABASE_URL` | `jdbc:postgresql://...` | La da Railway automáticamente al crear la base de datos |
| `DATABASE_USERNAME` | `postgres` | La da Railway |
| `DATABASE_PASSWORD` | `xxxxx` | La da Railway |
| `JWT_SECRET` | cadena larga y aleatoria (mín. 32 caracteres) | Firma los tokens. Generar una nueva, no usar ejemplos |
| `FRONTEND_ORIGIN` | `https://yabar-web.vercel.app` | Tu URL real de Vercel, sin `/` al final |
| `ADMIN_USERNAME` | el que tú elijas | Usuario para entrar al panel admin |
| `ADMIN_PASSWORD` | una contraseña fuerte | Se guarda con hash automáticamente al arrancar |
| `PORT` | `8080` | Railway la asigna sola normalmente |

## Pasos para desplegar en Railway

1. Crea cuenta en railway.app (puedes usar GitHub para loguearte)
2. "New Project" → "Deploy from GitHub repo" → selecciona el repo de este backend
3. Railway detecta que es Java/Maven y lo construye solo
4. Click en "New" → "Database" → "Add PostgreSQL" (dentro del mismo proyecto)
5. Railway conecta la base de datos sola y genera `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` — cópialas a las variables de tu servicio backend si no se linkean automáticamente
6. En el servicio del backend, ve a "Variables" y agrega manualmente: `JWT_SECRET`, `FRONTEND_ORIGIN`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`
7. Railway te da una URL pública tipo `yabar-backend-production.up.railway.app`
8. Copia esa URL y reemplázala en:
   - `admin.html` → variable `API_URL`
   - `script.js` (de la landing) → variable `API_URL`

## Después del primer deploy

- Entra a `tudominio.vercel.app/admin.html`
- Inicia sesión con el `ADMIN_USERNAME` / `ADMIN_PASSWORD` que configuraste
- Agrega tus 20 productos reales
- Se reflejan automáticamente en la landing pública
