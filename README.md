# Collide

Group matching platform for UC Riverside students. Students register with their UCR email and a course-specific sign-up code, build a profile with their major, skills, and working style, and swipe through other enrolled students in the same class. Mutual right-swipes create a match, opening a real-time chat thread and a Group Space. Admins manage courses and view platform analytics.

## Live App

https://humorous-transformation-production.up.railway.app

## Demo Video

https://www.youtube.com/watch?v=R5SqMZJTD9I

## Stack

- **Frontend:** React (Vite) + Plain CSS + React Router
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas (Mongoose)
- **Real-time:** Socket.io (JWT-authenticated)
- **Auth:** JWT (bcryptjs password hashing) + Google OAuth 2.0 (Passport.js)
- **File Storage:** Multer + Cloudinary

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
        ├── models/       # Mongoose schemas (User, Course, Match, Group, Message, Swipe)
        ├── middleware/   # JWT auth (protect, isAdmin), Multer upload
        ├── utils/        # Token helpers
        └── config/       # MongoDB, Cloudinary, and Passport (Google OAuth) config
```

## API Endpoints

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | UCR email validation, sign-up code check, bcrypt hash, JWT |
| POST | `/api/auth/login` | Password comparison, JWT issuance |
| GET | `/api/auth/google` | Initiate Google OAuth 2.0 login flow |
| GET | `/api/auth/google/callback` | Google OAuth callback; issues JWT and redirects to `/auth/callback` |

### Users
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/users/me` | Get current user's profile |
| PATCH | `/api/users/me` | Update profile (name, major, year, bio, skillTags, workingStyle, groupSizePreference) |
| GET | `/api/users/connections` | Get all matched connections |
| POST | `/api/users/photo` | Upload profile photo (Cloudinary) |

### Courses
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/courses/enroll` | Enroll in a course using a sign-up code |
| GET | `/api/courses/mine` | List courses the current user is enrolled in |

### Swipe
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/swipe/candidates` | Get swipeable users (excludes already-swiped) |
| POST | `/api/swipe` | Record a like/pass; auto-creates a Match on mutual like |

### Matches
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/matches` | Get all active matches for current user |

### Groups
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/groups` | Create a group (must be enrolled in the course) |
| GET | `/api/groups/mine` | List groups the current user belongs to |
| GET | `/api/groups/:id` | Get a single group (members only) |
| PATCH | `/api/groups/:id` | Update group details (creator only) |
| POST | `/api/groups/:id/join` | Join a group by ID (must share the course) |
| POST | `/api/groups/:id/leave` | Leave a group |

### Admin (requires `isAdmin` flag)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/admin/bootstrap` | Elevate a user to admin via `BOOTSTRAP_SECRET` |
| POST | `/api/admin/courses` | Create a course with an auto-generated sign-up code |
| GET | `/api/admin/courses` | List all courses |
| DELETE | `/api/admin/courses/:id` | Delete a course and unenroll all users |
| GET | `/api/admin/users` | List all users (no passwords) |
| GET | `/api/admin/analytics` | Match rate, group size distribution, major breakdown |

## Real-time Chat (Socket.io)

All socket connections are authenticated via JWT on the handshake. Events:

| Event (client → server) | Description |
|--------------------------|-------------|
| `join_match` | Join a match room; server emits `message_history` |
| `leave_match` | Leave a match room |
| `send_message` | Send a message; server broadcasts `receive_message` to the room |

Messages are persisted to MongoDB (`Message` collection) and replayed on reconnect.

## What Is Currently Working

### Backend
- Full auth flow: register (UCR email + sign-up code), login, Google OAuth 2.0, JWT-protected routes
- Profile editing: major, year, bio, skill tags, working style, group size preference
- Profile photo upload via Multer + Cloudinary
- Swipe queue (excludes already-swiped users), swipe recording, automatic mutual-match detection
- Group lifecycle: create, join (by ID), view, edit (creator), leave
- Course enrollment via sign-up code
- Real-time chat: Socket.io rooms per match, persistent message history
- Admin role: `isAdmin` middleware, bootstrap endpoint, course management, user list, analytics
- Mongoose models: User, Course, Match, Group, Message, Swipe

### Frontend
- Login and Register pages with UCR email enforcement, password strength, sign-up code, and "Sign in with Google" button
- Swipe page with Pass/Like buttons wired to the API
- Real-time Chat page using Socket.io (join room, send/receive messages)
- Profile page with edit modal (all profile fields)
- Matches page listing active matches
- GroupSpace page: enroll in course, create/join/view/edit/leave groups, shared links, member list
- `/auth/callback` route handles the Google OAuth redirect and stores the JWT in context
- Admin Dashboard: analytics stats, create/delete courses, user table, major breakdown, group size distribution

## Running Locally

### Backend
```bash
cd server
npm install
cp .env.example .env
# fill in MONGO_URI, JWT_SECRET, CLIENT_URL, SERVER_URL, PORT, CLOUDINARY_*, BOOTSTRAP_SECRET
# fill in GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET for Google OAuth
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

### Bootstrapping an Admin

After creating a user account, promote it to admin:

```bash
curl -X POST http://localhost:5000/api/admin/bootstrap \
  -H "Content-Type: application/json" \
  -d '{"email":"your@ucr.edu","secret":"YOUR_BOOTSTRAP_SECRET"}'
```

## Features

- **UCR Email Registration** — validates `@ucr.edu` email and requires a course-specific sign-up code
- **Google OAuth 2.0** — sign in with Google via Passport.js; links to existing accounts by email
- **Profile Builder** — major, year, bio, skill tags, working style preferences, group size preference, profile photo upload
- **Swipe Matching** — swipe queue filtered by shared course; mutual likes auto-create a match
- **Real-time Chat** — Socket.io rooms per match with persistent message history replayed on reconnect
- **Group Space** — create, join, view, edit, and leave groups within a shared course; shared links and member list
- **Admin Dashboard** — course creation with auto-generated sign-up codes, user management, match rate and analytics
- **Photo Upload** — profile photos stored via Multer + Cloudinary

## Team

| Name | Contributions |
|---|---|
| Mari Ozuna Garcia | Backend — Mongoose schemas, auth endpoints (JWT + Google OAuth), admin API, Google OAuth 2.0 integration with Passport.js, deployment configuration |
| Courtney Songco | Frontend — React pages, swipe UI, chat UI, auth forms, GroupSpace page, Admin Dashboard |
| Abby Allers | Server infrastructure — Express setup, Socket.io real-time chat, Railway deployment, API wiring |

## AI Usage

We used AI assistance (Claude) in several areas throughout the project:

- **Debugging** — used extensively for tracking down bugs on both the frontend and backend, including issues with React state, API response handling, and Mongoose query errors
- **Google OAuth setup** — used to help configure Passport.js with the Google OAuth 2.0 strategy, wire up the callback route, and handle the token redirect flow to the frontend
- **Deployment** — used to troubleshoot Railway deployment failures, identify missing environment variables, and fix redirect URI mismatches in Google Cloud Console
- **Real-time chat** — used for guidance on structuring Socket.io rooms per match and handling JWT authentication on the socket handshake
