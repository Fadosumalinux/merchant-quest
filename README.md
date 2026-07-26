# ⚔️ Merchant Quest

Juego de comercio, intercambio y subastas con mapa scrollable tipo RPG.

## Concepto

Un mundo abierto donde los usuarios asumen el rol de comerciantes que recorren un mapa amplio descubriendo zonas, comerciando objetos y participando en subastas. Cada transacción se valida con un token único que garantiza la titularidad del traspaso.

## Características v2.0

- **Mapa scrollable** con 8 zonas progresivas que se desbloquean por nivel
- **Zonas culturales**: Village Market, Romani Caravan, Dragon Bazaar, Medina de Fez, Wall Street Tower, Pirate Cove, Royal Capital, Sky Islands
- **NPCs culturales**: Gitanos, chinos, marroquíes, wallstreet, piratas — cada uno con su personalidad y diálogos
- **Sistema de tokens SHA-256** que valida cada transacción
- **Insignias y logros** con quizzes que enseñan lecciones de comercio
- **Avatares personalizables** por cultura (15 avatares desbloqueables)
- **Reputación y reviews** — califica a otros comerciantes
- **Catálogo diverso de items**: Animales, textiles, joyas, armas, pócimas, instrumentos, artefactos
- **Sistema de niveles** — cada交易 otorga XP

## Stack

- **Frontend**: React + Vite + TypeScript + React Router
- **Backend**: Node.js + Express + Prisma + SQLite
- **Auth**: JWT + bcrypt
- **Tokens**: SHA-256 hash interno

## Inicio rápido

```bash
git clone https://github.com/Fadosumalinux/merchant-quest.git
cd merchant-quest

# Instalar todo
cd server && npm install && cd ../client && npm install

# Configurar base de datos
cd ../server && cp .env.example .env && npx prisma db push && npx prisma db seed

# Arrancar (un solo comando)
cd .. && npm run dev
```

Abre `http://localhost:3001` — ¡listo!

## Arquitectura

Un solo servidor Express en el puerto 3001 sirve:
- **API** (`/api/*`) — Backend con Prisma + SQLite
- **Frontend** (`/`) — React compilado estático

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
| GET | `/api/achievements` | Todas las insignias |
| GET | `/api/achievements/mine` | Mis insignias |
| POST | `/api/achievements/:id/quiz` | Responder quiz de insignia |
| POST | `/api/achievements/:id/earn` | Ganar insignia (NPC) |
| GET | `/api/achievements/stats` | Estadísticas de logros |
| GET | `/api/avatars` | Todos los avatares |
| GET | `/api/avatars/mine` | Mi avatar actual |
| POST | `/api/avatars/equip` | Equipar avatar |
| POST | `/api/reviews` | Calificar comerciante |
| GET | `/api/reviews/user/:id` | Reviews de un usuario |

## Zonas del Mapa

| Zona | Cultura | Nivel | Emoji |
|------|---------|-------|-------|
| Village Market | Universal | 1 | 🌍 |
| Romani Caravan | Gitano | 3 | 💃 |
| Dragon Bazaar | Chino | 5 | 🐉 |
| Medina de Fez | Marroquí | 8 | 🕌 |
| Wall Street Tower | Wall Street | 12 | 📊 |
| Pirate Cove | Fantasía | 15 | 🏴‍☠️ |
| Royal Capital | Universal | 20 | 👸 |
| Sky Islands | Fantasía | 30 | ☁️ |

## Logros Destacados

- 🤝 Primer Intercambio — Completa tu primera trade
- 💃 Iniciado Gitano — Aprende del trueque gitano
- 🐉 Sabiduría del Dragón — Domina el comercio estratégico
- 🕌 Maestro del Regateo — Arte del regateo marroquí
- 📊 101 de Wall Street — Fundamentos del mercado financiero
- 👑 Leyenda Viva — 100 transacciones perfectas
- ❓ Secreto del Mercado — ??? (solo se descubre explorando)
