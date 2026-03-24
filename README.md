# College Connect

**Live Demo:** [https://collegeconnect-frontend-zdse.onrender.com/](https://collegeconnect-frontend-zdse.onrender.com/)

College Connect is a platform for viewing, creating, and engaging with college events. It consists of a Node.js/Express backend and a React (Vite) frontend.

## Project Structure

This repository contains two main packages:

- **[`backend/`](./backend)**: A Node.js API with Express, MongoDB, Redis, and BullMQ.
- **[`frontend/`](./frontend)**: A React 19 single-page application built with Vite, Tailwind CSS v4, and React Query.

## Tech Stack

### Backend
- **Runtime:** Node.js (CommonJS)
- **Framework:** Express
- **Database:** MongoDB (Mongoose)
- **Caching & Queues:** Redis, BullMQ (for email notifications)
- **Authentication:** JWT (Cookie-based), bcrypt
- **Validation & Security:** express-validator, cors, express-rate-limit

### Frontend
- **Framework:** React 19, Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **Data Fetching:** React Query (@tanstack/react-query), Axios
- **Auth State:** React Context

## Features

- **Authentication:** Role-based access control (Student, Organizer, Admin) with secure HTTP-only cookies.
- **Colleges:** Admin-managed college registry with geospatial data.
- **Events:** Create, update, soft-delete, and browse events.
- **Feeds:** Supports paginated active events, trending events (cached in Redis), nearby events (geospatial search), and college-specific events.
- **Engagement:** Like/Unlike functionality with automatic trending cache invalidation.
- **Background Jobs:** BullMQ worker for processing event notification emails asynchronously.

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB
- Redis server
- SMTP Server (for email notifications)

### 1. Clone the repository

```bash
git clone <repository-url>
cd college-connect
```

### 2. Setup Backend

Navigate to the `backend` directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory based on the required environment variables:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/college-connect
JWT_SECRET_KEY=your_super_secret_jwt_key
TOKEN_EXPIRY=24h
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=securepassword
REDIS_URL=redis://localhost:6379
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=user@example.com
SMTP_PASS=password
SMTP_FROM=noreply@example.com
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Run seed scripts to populate database (optional):
```bash
node scripts/seedColleges.js
# Ensure colleges exist before seeding users and events
node scripts/seedUsersAndEvents.js
node scripts/createAdmin.js
```

Start the backend API server:
```bash
npm run dev
```

*(Optional)* Start the notification worker in a separate terminal:
```bash
node workers/notification.worker.js
```

### 3. Setup Frontend

Navigate to the `frontend` directory and install dependencies:
```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:3000/api
```

Start the frontend development server:
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Frontend Documentation

The frontend is a Vite + React 19 single-page app for browsing, liking, and managing campus events. It uses cookie-based auth, React Router for navigation, React Query for read-heavy event fetching, and Axios for all backend requests.

### Frontend Tech Stack

| Area | Package(s) | Notes |
| --- | --- | --- |
| Build/dev | `vite`, `@vitejs/plugin-react` | Standard Vite setup |
| Styling | `tailwindcss`, `@tailwindcss/vite` | Tailwind v4 imported from `src/index.css` |
| UI | `react`, `react-dom` | React 19 |
| Routing | `react-router-dom` | BrowserRouter, Routes, route guards |
| Data fetching | `@tanstack/react-query` | Used for event feeds and event detail |
| HTTP | `axios` | Shared client with `withCredentials: true` |
| Linting | `eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` | Flat config |

### Frontend Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build a production bundle |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

### High-Level Frontend Structure

```text
frontend/
|-- index.html
|-- vite.config.js
|-- eslint.config.js
|-- .env.example
`-- src/
    |-- main.jsx
    |-- App.jsx
    |-- index.css
    |-- services/
    |   `-- api.js
    |-- context/
    |   |-- auth-context.js
    |   `-- AuthContext.jsx
    |-- hooks/
    |   |-- useAuth.js
    |   `-- useEventsFeed.js
    |-- components/
    |   |-- Shell.jsx
    |   |-- ProtectedRoute.jsx
    |   |-- PublicOnlyRoute.jsx
    |   |-- EventGrid.jsx
    |   |-- EventCard.jsx
    |   |-- LikeButton.jsx
    |   |-- CollegeSelect.jsx
    |   |-- Hero.jsx
    |   |-- PageIntro.jsx
    |   |-- ErrorBoundary.jsx
    |   `-- Navbar.jsx
    `-- pages/
        |-- Home.jsx
        |-- Events.jsx
        |-- EventDetail.jsx
        |-- Trending.jsx
        |-- Nearby.jsx
        |-- MyCollege.jsx
        |-- CreateEvent.jsx
        |-- Login.jsx
        |-- Signup.jsx
        `-- admin/
            |-- AdminDashboard.jsx
            |-- ManageColleges.jsx
            |-- ManageEvents.jsx
            `-- ManageUsers.jsx
```

### Bootstrap and Providers
`src/main.jsx` mounts the app with these wrappers, in order:
1. `ErrorBoundary`
2. `QueryClientProvider`
3. `BrowserRouter`
4. `AuthProvider`
5. `App`

React Query defaults currently set:
- `refetchOnWindowFocus: false`
- `retry: 1`

### Routing
All routes are rendered inside `Shell`, which provides the sticky header, primary nav, role-aware links, and the main content container.

| Path | Page | Access |
| --- | --- | --- |
| `/` | `Home` | Public |
| `/events` | `Events` | Public |
| `/events/:eventId` | `EventDetail` | Public |
| `/trending` | `Trending` | Public |
| `/nearby` | `Nearby` | Authenticated |
| `/my-college` | `MyCollege` | Authenticated |
| `/create-event` | `CreateEvent` | `Admin` or `Organizer` |
| `/admin` | `AdminDashboard` | `Admin` only |
| `/admin/colleges` | `ManageColleges` | `Admin` only |
| `/admin/events` | `ManageEvents` | `Admin` only |
| `/admin/users` | `ManageUsers` | `Admin` only |
| `/login` | `Login` | Public-only |
| `/signup` | `Signup` | Public-only |
| `*` | Redirect to `/` | Fallback |

#### Route Guards
- `ProtectedRoute` waits for auth bootstrap, redirects unauthenticated users to `/login`, and blocks unauthorized roles with an in-page message.
- `PublicOnlyRoute` prevents signed-in users from revisiting `/login` and `/signup`.

### Auth Model
The app is fully cookie-session based.
- `AuthProvider` bootstraps the session with `GET /auth/me`.
- `login(credentials)` calls `POST /auth/login`.
- `signup(formData)` calls `POST /auth/signup`.
- `logout()` calls `POST /auth/logout` and clears frontend user state.
- `refreshUser()` re-fetches `GET /auth/me`.

### Data Fetching
#### Shared Event Feeds
`useEventsFeed(path)` is the common hook for feed-style pages:
- Uses React Query with `queryKey: ["events", path]`
- Normalizes different backend response shapes into an events array
- Uses `staleTime: 30000`
- Exposes `applyLikeDelta(eventId, delta)` for optimistic like-count updates

#### Single Event Page
`EventDetail.jsx` uses its own `useQuery` call for `GET /events/:eventId` and re-fetches after a like/unlike action instead of sharing feed cache state.

### API Integration
`src/services/api.js` creates one Axios instance with:
- `withCredentials: true`
- `Content-Type: application/json`
- `baseURL` from `VITE_API_URL`, if defined
- fallback base URL of `http://<current-hostname>:3000/api`

### Page Responsibilities
- `Home` shows the hero plus the first three items from the general events feed.
- `Events` shows the full active event board.
- `Trending` shows the most-liked events feed.
- `Nearby` uses the authenticated user's college to fetch nearby college events.
- `MyCollege` shows events for the signed-in user's own college.
- `EventDetail` shows the full event view.
- `CreateEvent` is the organizer/admin form for publishing a new event.
- `Login` redirects back to the originally requested protected route when possible.
- `Signup` creates an account and immediately enters an authenticated session.
- `AdminDashboard` links to the three admin management pages.
- `ManageColleges` lists colleges and creates new ones.
- `ManageEvents` lists all events and soft-deletes them through the backend.
- `ManageUsers` attempts to list all users for admins.

### Important Components
#### `Shell.jsx`
- Renders the top-level header and nav
- Shows `Create event` only for `Admin` and `Organizer`
- Shows `Admin` only for `Admin`

#### `CollegeSelect.jsx`
- Async search field for signup
- Debounces backend search by 300ms
- Cancels stale requests with `AbortController`
- Supports keyboard navigation for results
- Stores the selected college `_id` in a hidden input

#### `LikeButton.jsx`
- Guest users are sent to `/login`
- Signed-in users can like or unlike
- Applies optimistic count updates through `onLikeChange`
- Reverts the optimistic change if the request fails

### Styling
The styling system is a mix of Tailwind utilities and a custom theme in `src/index.css`.
- Tailwind v4 is loaded with `@import "tailwindcss";`
- Theme font is `Space Grotesk`
- Shared CSS variables define panel colors, accent colors, muted text, and shadows
- The page background uses layered radial and linear gradients
- `input`, `select`, and `textarea` share a common glass-panel style

### Environment Variables
| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Optional explicit backend base URL |

---

## Backend Documentation

The backend is a CommonJS Node.js API built around Express-style route modules, Mongoose models, Redis, BullMQ, and cookie-based JWT auth. It exposes four live API domains under `/api`:
- auth
- colleges
- events
- likes

In addition to the API server, the repo includes a separate BullMQ worker process for event-notification emails.

### Backend Tech Stack
| Area | Package(s) | Notes |
| --- | --- | --- |
| Runtime | Node.js, CommonJS | `server.js` starts the HTTP server |
| Database | `mongoose` | MongoDB persistence |
| Auth | `jsonwebtoken`, `bcrypt`, `cookie-parser` | JWT stored in `token` cookie |
| Validation | `express-validator` | Used on signup, login, create-college, create-event |
| Security/control | `cors`, `express-rate-limit` | CORS allowlist plus per-route/global throttling |
| Queue/cache | `bullmq`, `ioredis`, `redis` | BullMQ for jobs, Redis cache for trending feed |
| Email | `nodemailer` | Event notification emails |

### Backend Scripts
| Command | Purpose |
| --- | --- |
| `npm start` | Start the API server with Node |
| `npm run dev` | Start the API server with Nodemon |

Notification Worker (run manually):
```bash
node workers/notification.worker.js
```

### Process Model
There are two runtime processes in the repo:
1. API server: `backend/server.js`
2. Notification worker: `backend/workers/notification.worker.js`

### App Bootstrap
`app.js` performs startup in this order:
1. Load environment variables with `dotenv.config()`
2. Connect to MongoDB with `connectToDb()`
3. Build the CORS allowlist from `FRONTEND_URL`, `http://localhost:5173`, and `http://localhost:5174`
4. Register `cors` with credentials enabled
5. Register `cookie-parser`
6. Register `express.json()` and `express.urlencoded({ extended: true })`
7. Expose `GET /` health-style response returning `"hello"`
8. Apply the general API rate limiter to `/api`
9. Mount `/api/auth`, `/api/colleges`, `/api/events`, and `/api/likes`
10. Register the centralized error handler

### Data Model

#### `User`
- Fields: `name`, `email` (unique), `password` (`select: false`), `role` in `Student | Organizer | Admin`, `collegeId` (optional ObjectId ref), timestamps
- Methods: `generateAuthToken()`, `hashPassword()`, `comparePassword()`

#### `College`
- Fields: `name`, `city`, `state`, `latitude`, `longitude`, `location` as GeoJSON Point, timestamps
- Indexes: unique index on `name`, `2dsphere` index on `location`

#### `Event`
- Fields: `title`, `description`, `category`, `eventDate`, `eventTime`, `collegeId`, `organizerId`, `externalLink`, `likesCount`, `isActive`, timestamps
- Indexes: `{ isActive: 1, likesCount: -1, createdAt: -1 }`, `{ collegeId: 1, isActive: 1, createdAt: -1 }`

#### `Like`
- Fields: `userId`, `eventId`, timestamps
- Index: unique compound index on `{ userId, eventId }`

### Auth and Authorization
- **Cookie Session Flow**: Signup and login generate a JWT and store it in an `httpOnly` cookie named `token`. Cookie max age is 24 hours.
- **Auth Middleware**: `getUser` requires a valid auth cookie and sets `req.user`. `getOptionalUser` tries to load a user but falls back to `req.user = null`.
- **Role Rules**: Public signup only allows `Student` and `Organizer`. `Admin` accounts cannot be created through public signup.

### Routing

#### Auth Routes (`/api/auth`)
- `GET /me` - Returns `{ user: req.user ?? null }`
- `POST /signup` - Rate limited, validated, sets auth cookie
- `POST /login` - Rate limited, validated, sets auth cookie
- `POST /logout` - Requires auth, clears cookie

#### College Routes (`/api/colleges`)
- `POST /` - Admin-only create
- `GET /search` - Public name search, returns `_id` and `name`
- `GET /` - Public list of all colleges

#### Event Routes (`/api/events`)
- `POST /` - Authenticated `Admin`/`Organizer` create
- `GET /` - Paginated active events
- `GET /my-college` - Authenticated college-scoped events
- `GET /trending` - Cached top events
- `GET /nearby` - Authenticated geospatial nearby events
- `GET /:eventId` - Active event details
- `PUT /:eventId` - Organizer or admin update
- `DELETE /:eventId` - Organizer or admin soft delete

#### Like Routes (`/api/likes`)
- `POST /:eventId/like` - Authenticated like
- `DELETE /:eventId/like` - Authenticated unlike

### Queueing, Cache, and Email
- Two Redis clients are used: `config/redis.js` (cache) and `config/bullmq.redis.js` (BullMQ).
- **Trending Cache**: Caches top events in Redis. Key `trending_events`, TTL 60 seconds. Invalidates on like/unlike.
- **Notification Queue**: Adds `send-event-email` job to `event-notifications` queue upon event creation.
- **Notification Worker**: Fetches event and users in the same college, sends one email per user using Nodemailer.

### Validation, Errors, and Rate Limits
- `validate.middleware.js` converts the first validation failure into an `AppError` with status `400`.
- Rate limits applied for `/login` (5/min), `/signup` (3/min), and globally on `/api` (100/min).

### Seeding and Bootstrap Scripts
- `scripts/createAdmin.js`: Creates a single `Admin` user.
- `scripts/seedColleges.js`: Inserts missing colleges with unique names.
- `scripts/seedUsersAndEvents.js`: Creates test users and events.

