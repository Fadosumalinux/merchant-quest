# ⚔️ Merchant Quest

Juego de comercio, intercambio y subastas con mapa scrollable tipo RPG.

## Concepto

Un mundo abierto donde los usuarios asumen el rol de comerciantes que recorren un mapa amplio descubriendo zonas, comerciando objetos y participando en subastas. Cada transacción se valida con un token único que garantiza la titularidad del traspaso.

## Características

- **Mapa scrollable** con zonas que se desbloquean según el nivel del comerciante
- **Sistema de tokens** que valida cada transacción de objetos
- **Niveles y XP** — cada交易 otorga experiencia
- **Zonas progresivas**: Village Market → Forest → Mountain → Desert → Harbor → Pirate Cove → Royal Capital → Dragon's Lair → Sky Islands → Realm of Legends
- **NPCs**: Mercaderes, herreros, banqueros, dadores de misiones
- **Waypoints**: Puestos de comercio, casas de subasta, portales, tesoros

## Stack

- **Frontend**: React + Vite + TypeScript + React Router
- **Backend**: Node.js + Express + Prisma + SQLite
- **Auth**: JWT + bcrypt
- **Tokens**: SHA-256 hash interno

## Inicio rápido

```bash
# Backend
cd server
cp .env.example .env
npm install
npx prisma db push
npx prisma db seed
npm run dev

# Frontend (otra terminal)
cd client
npm install
npm run dev
```

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/me` | Perfil del usuario |
| GET | `/api/zones` | Listar zonas |
| POST | `/api/zones/travel/:id` | Viajar a zona |
| POST | `/api/trades` | Crear transacción |
| GET | `/api/trades/verify/:hash` | Verificar token |
| GET | `/api/trades/history` | Historial de trades |
| GET | `/api/inventory` | Inventario del usuario |
