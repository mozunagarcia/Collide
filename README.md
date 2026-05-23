# Collide

Group matching platform for UC Riverside students. Students register with their UCR email and a course-specific sign-up code, build a profile with their major, skills, and working style, and swipe through other enrolled students in the same class. Mutual right-swipes create a match, opening a chat thread and eventually a Group Space. A post-project reputation system lets students rate past collaborators.

## Demo Video

[![Watch the demo]([https://img.youtube.com/vi/VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=VIDEO_ID](https://youtu.be/R5SqMZJTD9I?si=g28Zy8kMJDpAdAdk))

## Stack

- **Frontend:** React (Vite) + Plain CSS + React Router
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas (Mongoose)
- **Real-time:** Socket.io
- **Auth:** JWT (bcryptjs password hashing)
- **File Storage:** Multer + Cloudinary (in progress)

## Project Structure

```
Collide/
├── client/               # React frontend
│   └── src/
│       ├── components/   # Auth, swipe, chat, profile, group, admin components
│       ├── pages/        # Login, Register, Swipe, Chat, Profile, Matches, GroupSpace, Admin
│       ├── hooks/        # useSwipe, useAuth, useChat
│       ├── context/      # AuthContext
│       └── utils/        # api.js (Axios), socket.js (Socket.io client)
└── server/               # Node/Express backend
    └── src/
        ├── controllers/  # auth, users, matches, groups, swipe, courses, ratings, admin
        ├── routes/       # API route definitions
        ├── models/       # Mongoose schemas
        ├── middleware/   # JWT auth middleware
        ├── utils/        # Token helpers
        └── config/       # MongoDB + Cloudinary config
```

## What Is Currently Working

### Backend
- `POST /api/auth/register` — UCR email validation, sign-up code verification, bcrypt password hashing, JWT issuance
- `POST /api/auth/login` — password comparison, JWT issuance
- All Mongoose models defined: **User, Course, Match, Group, Rating**
- JWT `protect` middleware implemented

### Frontend
- Login and Register pages with full form validation (UCR email enforcement, password strength indicator, sign-up code field)
- Swipe card UI with Pass/Match buttons and `useSwipe` hook managing card state
- Chat UI with message bubbles, sidebar navigation, and input field (mock data)
- Profile page with avatar, major, year, bio, skill tags, and match percentage badge (mock data)

## What Is In Progress

- Profile creation/editing form (all fields)
- Socket.io real-time chat (server + client)
- Remaining API endpoints: course enrollment, swipe recording, mutual match detection, swipe queue
- Axios API client + AuthContext to connect React to the backend
- Server deployment (Railway/Render)

## Running Locally

### Backend
```bash
cd server
npm install
cp .env.example .env
# fill in MONGO_URI, JWT_SECRET, CLIENT_URL, PORT
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Team

| Name | Role |
|---|---|
| Mari Ozuna Garcia | Backend — Mongoose schemas, auth endpoints, JWT |
| Courtney Songco | Frontend — React pages, swipe UI, chat UI, auth forms |
| Abby Allers | Server — Express setup, Socket.io, deployment, API wiring |
