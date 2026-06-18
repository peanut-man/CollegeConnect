# College Connect

**Live Demo:** [https://collegeconnect-frontend-zdse.onrender.com/](https://collegeconnect-frontend-zdse.onrender.com/)

College Connect is a platform for viewing, creating, and engaging with college events. It consists of a Node.js/Express backend, a React (Vite) frontend, and a Docker Compose setup for containerized development and deployment.

## Project Structure

This repository contains two main packages:

- **[`backend/`](./backend)**: A Node.js API with Express, MongoDB, Redis, BullMQ, and Cloudinary.
- **[`frontend/`](./frontend)**: A React 19 single-page application built with Vite, Tailwind CSS v4, and React Query.
- **[`docker-compose.yml`](./docker-compose.yml)**: Orchestrates MongoDB, Redis, API server, worker, and frontend via Docker.

## Tech Stack

### Backend
- **Runtime:** Node.js (CommonJS)
- **Framework:** Express
- **Database:** MongoDB (Mongoose)
- **Caching & Queues:** Redis, BullMQ (for email notifications)
- **Authentication:** JWT (Cookie-based), bcrypt
- **Validation & Security:** express-validator, cors, express-rate-limit
- **Image Upload:** Cloudinary, multer, multer-storage-cloudinary
- **AI:** Groq SDK (two-stage LLM: extraction + response)

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
- **Event Filtering:** Category dropdown and college name search on the All Events page with debounced querying.
- **AI Event Assistant:** Floating chat widget powered by Groq (llama-3.1-8b-instant for filter extraction, llama-3.3-70b-versatile for response generation). Understands natural language — "Hackathons at IIT this month" — and returns AI answers with matching event cards.
- **Engagement:** Like/Unlike functionality with automatic trending cache invalidation.
- **Image Upload:** Cloudinary-powered event poster/banner upload with preview on create and edit forms.
- **Background Jobs:** BullMQ worker for processing event notification emails asynchronously.

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB
- Redis server
- SMTP Server (for email notifications)
- Docker & Docker Compose (for containerized setup)
- Cloudinary account (free tier) for image uploads

### Option A: Manual Setup (for development)

#### 1. Clone the repository

```bash
git clone <repository-url>
cd college-connect
```

#### 2. Setup Backend

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
GROQ_API_KEY=gsk_your_groq_api_key
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
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

#### 3. Setup Frontend

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

### Option B: Docker Setup (for containerized deployment)

#### 1. Clone and configure

```bash
git clone <repository-url>
cd college-connect
```

Ensure `backend/.env` exists with all required variables (including Cloudinary credentials from the example above).

#### 2. Start all services

```bash
docker compose up --build
```

This starts five containers:
- **mongodb** — MongoDB 7 database
- **redis** — Redis 7 for BullMQ and caching
- **backend** — Express API (port 3000, internal only)
- **worker** — BullMQ notification worker (same image, different command)
- **frontend** — Nginx serving the React SPA, proxying `/api` to backend

Open `http://localhost:3000` in your browser. Nginx serves the frontend and forwards all `/api/*` requests to the backend container. No `VITE_API_URL` needed.

#### 3. Optional — Seed data

```bash
# One-off seed (run after services are up)
docker compose run --rm backend sh -c "node scripts/seedColleges.js && node scripts/seedUsersAndEvents.js && node scripts/createAdmin.js"
```

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
    |   |-- api.js
    |   `-- ai.js
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
    |   |-- AiAssistant.jsx
    |   |-- CollegeSelect.jsx
    |   |-- Hero.jsx
    |   |-- PageIntro.jsx
    |   |-- ErrorBoundary.jsx
    |   |-- DeleteConfirmModal.jsx
    |   `-- Navbar.jsx
    `-- pages/
        |-- Home.jsx
        |-- Events.jsx
        |-- EventDetail.jsx
        |-- EditEvent.jsx
        |-- Trending.jsx
        |-- Nearby.jsx
        |-- MyCollege.jsx
        |-- Profile.jsx
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
| `/events/:eventId/edit` | `EditEvent` | `Admin` or `Organizer` |
| `/create-event` | `CreateEvent` | `Admin` or `Organizer` |
| `/profile` | `Profile` | Authenticated |
| `/admin` | `AdminDashboard` | `Admin` only |
| `/admin/colleges` | `ManageColleges` | `Admin` only |
| `/admin/events` | `ManageEvents` | `Admin` only |
| `/admin/users` | `ViewUsers` | `Admin` only |
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
- `baseURL` from `VITE_API_URL`, if defined
- fallback base URL of `http://<current-hostname>:3000/api`
- Content-Type is auto-detected: `application/json` for JSON payloads, `multipart/form-data` for file uploads

### Page Responsibilities
- `Home` shows the hero plus the first three items from the general events feed.
- `Events` shows the full active event board with category dropdown filter and debounced college name search bar.
- `Event Assistant` is a floating chat widget (FAB button, bottom-right) on all pages. It uses Groq LLMs to answer natural language queries about events and renders matching event cards inline.
- `Trending` shows the most-liked events feed.
- `Nearby` uses the authenticated user's college to fetch nearby college events.
- `MyCollege` shows events for the signed-in user's own college.
- `EventDetail` shows the full event view.
- `CreateEvent` is the organizer/admin form for publishing a new event with optional Cloudinary image upload.
- `EditEvent` pre-fills the event form including the existing image, allowing replacement or removal.
- `Login` redirects back to the originally requested protected route when possible.
- `Signup` creates an account and immediately enters an authenticated session.
- `Profile` shows the signed-in user's avatar, name, role, email, college, and member since date.
- `AdminDashboard` links to the three admin management pages.
- `ManageColleges` lists colleges and creates new ones.
- `ManageEvents` lists all events and soft-deletes them through the backend.
- `ViewUsers` lists all users for admins with role badges and college names.

### Important Components
#### `Shell.jsx`
- Renders the top-level header and nav
- Shows `Create event` only for `Admin` and `Organizer`
- Shows `Admin` only for `Admin`
- Mounts the `AiAssistant` floating widget

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
| `VITE_API_URL` | Optional explicit backend base URL (not needed in Docker — Nginx proxies `/api`) |
| `GROQ_API_KEY` | Groq API key for the AI Event Assistant (two-stage LLM pipeline) |

---

## Backend Documentation

The backend is a CommonJS Node.js API built around Express-style route modules, Mongoose models, Redis, BullMQ, Groq, Cloudinary, and cookie-based JWT auth. It exposes six live API domains under `/api`:
- auth
- colleges
- events
- likes
- users
- upload
- ai

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
| Image upload | `cloudinary`, `multer`, `multer-storage-cloudinary` | Cloudinary-backed poster upload |
| AI | `groq-sdk` | Two-stage LLM: llama-3.1-8b-instant (JSON filter extraction) + llama-3.3-70b-versatile (response generation) |

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

When using Docker, both processes (plus MongoDB, Redis, and the frontend) run as separate containers orchestrated by `docker-compose.yml`.

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
9. Mount `/api/auth`, `/api/colleges`, `/api/events`, `/api/likes`, `/api/users`, `/api/upload`, and `/api/ai`
10. Register the centralized error handler

### Data Model

#### `User`
- Fields: `name`, `email` (unique), `password` (`select: false`), `role` in `Student | Organizer | Admin`, `collegeId` (optional ObjectId ref), timestamps
- Methods: `generateAuthToken()`, `hashPassword()`, `comparePassword()`

#### `College`
- Fields: `name`, `city`, `state`, `latitude`, `longitude`, `location` as GeoJSON Point, timestamps
- Indexes: unique index on `name`, `2dsphere` index on `location`

#### `Event`
- Fields: `title`, `description`, `category`, `eventDate`, `eventTime`, `collegeId`, `organizerId`, `externalLink`, `imageUrl`, `likesCount`, `isActive`, timestamps
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
- `GET /` - Paginated active events; supports `category`, `search` (college name), `q` (text search title/description), `dateFrom`, and `dateTo` query params
- `GET /my-college` - Authenticated college-scoped events
- `GET /trending` - Cached top events
- `GET /nearby` - Authenticated geospatial nearby events
- `GET /:eventId` - Active event details
- `PUT /:eventId` - Organizer or admin update
- `DELETE /:eventId` - Organizer or admin soft delete

#### Like Routes (`/api/likes`)
- `POST /:eventId/like` - Authenticated like
- `DELETE /:eventId/like` - Authenticated unlike

#### User Routes (`/api/users`)
- `GET /` - Admin-only list of all users (populated with college name)

#### Upload Routes (`/api/upload`)
- `POST /` - Authenticated `Admin`/`Organizer` upload image to Cloudinary, returns URL

#### AI Routes (`/api/ai`)
- `POST /query` - Public (rate limited, 10/min). Accepts `{ query }`, returns `{ answer, events }`. Uses two-stage Groq LLM pipeline: extraction model parses query into structured filters, then response model generates a grounded answer from matching events.

### Queueing, Cache, Email, and Image Upload
- A single Redis client (`config/redis.js`) is used for both caching and BullMQ.
- **Trending Cache**: Caches top events in Redis. Key `trending_events`, TTL 60 seconds. Invalidates on like/unlike.
- **Notification Queue**: Adds `send-event-email` job to `event-notifications` queue upon event creation.
- **Notification Worker**: Fetches event and users in the same college, sends one email per user using Nodemailer.

### Validation, Errors, and Rate Limits
- `validate.middleware.js` converts the first validation failure into an `AppError` with status `400`.
- Rate limits applied for `/login` (5/min), `/signup` (3/min), `/api/ai/query` (10/min), and globally on `/api` (100/min).

### Seeding and Bootstrap Scripts
- `scripts/createAdmin.js`: Creates a single `Admin` user.
- `scripts/seedColleges.js`: Inserts missing colleges with unique names.
- `scripts/seedUsersAndEvents.js`: Creates test users and events.

