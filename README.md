# Collide

Group matching platform for UC Riverside students.

## Stack
- Frontend: React (Vite) + Plain CSS
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Real-time: Socket.io
- Auth: JWT
- File Storage: Cloudinary

## Structure
```
Collide/
├── client/   # React frontend (Person A)
└── server/   # Node/Express backend (Person B + C)
```

## Getting Started

### Backend
```bash
cd server
npm install
cp .env.example .env
# fill in your .env values
npm run dev
```

### Frontend
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

- Frontend runs on: http://localhost:5173
- Backend runs on: http://localhost:5000

## Branch Convention
```
main        — stable, working code only
dev         — merge here first before main
feat/A-...  — Person A (Frontend)
feat/B-...  — Person B (Backend)
feat/C-...  — Person C (Server/Bridge)
```
