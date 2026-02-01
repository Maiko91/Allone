# Allone - Top 10 Product Finder

Una aplicación full-stack premium para gestionar y mostrar el Top 10 de productos recomendados, con integración de Amazon Scraping y Google Auth.

## 🚀 Tecnologías

- **Frontend**: React 19, TypeScript, Material UI 6.
- **Backend**: Node.js, Express, Prisma ORM.
- **Base de Datos**: PostgreSQL (Neon.tech).
- **Autenticación**: Google OAuth 2.0.

## 📁 Estructura del Proyecto

- `/client`: Aplicación frontend (Vite + React).
- `/server`: API REST (Node.js + Prisma).

## 🛠️ Instalación Local

1. Clonar el repositorio.
2. Instalar dependencias en ambas carpetas:
   - `cd client && npm install`
   - `cd server && pnpm install`
3. Configurar los archivos `.env` (ver `env.example.md`).
4. Iniciar el proyecto:
   - Backend: `cd server && pnpm run dev`
   - Frontend: `cd client && npm run dev`

## 🌍 Despliegue (Production)

### Frontend (Vercel)
- Conecta la carpeta `/client` a un nuevo proyecto en Vercel.
- Configura las variables `VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID` y `VITE_ADMIN_EMAIL`.

### Backend (Render / Railway)
- Conecta la carpeta `/server` a un nuevo Web Service.
- Comando de instalación: `pnpm install`
- Comando de inicio: `pnpm run generate && pnpm run start` (asegúrate de compilar con `tsc` primero o usar `ts-node`).
- Configura las variables `DATABASE_URL` y `PORT`.

## 🔒 Seguridad
Los archivos `.env` están ignorados por Git. Asegúrate de configurar las variables de entorno manualmente en tus plataformas de despliegue.
