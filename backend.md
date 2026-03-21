# College Connect Backend Documentation

## Overview

The backend is a CommonJS Node.js API built around Express-style route modules, Mongoose models, Redis, BullMQ, and cookie-based JWT auth. It exposes four live API domains under `/api`:

- auth
- colleges
- events
- likes

In addition to the API server, the repo includes a separate BullMQ worker process for event-notification emails.

## Tech Stack

| Area | Package(s) | Notes |
| --- | --- | --- |
| Runtime | Node.js, CommonJS | `server.js` starts the HTTP server |
| Database | `mongoose` | MongoDB persistence |
| Auth | `jsonwebtoken`, `bcrypt`, `cookie-parser` | JWT stored in `token` cookie |
| Validation | `express-validator` | Used on signup, login, create-college, create-event |
| Security/control | `cors`, `express-rate-limit` | CORS allowlist plus per-route/global throttling |
| Queue/cache | `bullmq`, `ioredis`, `redis` | BullMQ for jobs, Redis cache for trending feed |
| Email | `nodemailer` | Event notification emails |

## Scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Start the API server with Node |
| `npm run dev` | Start the API server with Nodemon |

There is currently no npm script for the BullMQ worker. Run it manually with:

```bash
node workers/notification.worker.js
```

## Process Model

There are two runtime processes in the repo:

1. API server: `backend/server.js`
2. Notification worker: `backend/workers/notification.worker.js`

The worker is not started automatically by the API server. If Redis/SMTP notifications matter in a local or deployed environment, the worker must be launched separately.

## High-Level Structure

```text
backend/
|-- app.js
|-- server.js
|-- config/
|   |-- db.js
|   |-- redis.js
|   `-- bullmq.redis.js
|-- controllers/
|   |-- auth.controller.js
|   |-- college.controller.js
|   |-- event.controller.js
|   `-- like.controller.js
|-- middlewares/
|   |-- auth.middleware.js
|   |-- role.middleware.js
|   |-- validate.middleware.js
|   |-- rateLimit.middleware.js
|   `-- error.middleware.js
|-- models/
|   |-- user.model.js
|   |-- college.model.js
|   |-- event.model.js
|   `-- like.model.js
|-- routes/
|   |-- auth.routes.js
|   |-- college.routes.js
|   |-- event.routes.js
|   `-- like.routes.js
|-- services/
|   |-- auth.service.js
|   |-- college.service.js
|   |-- event.service.js
|   |-- like.service.js
|   `-- email.service.js
|-- queues/
|   `-- notification.queue.js
|-- workers/
|   `-- notification.worker.js
|-- validations/
|   |-- auth.validations.js
|   |-- college.validations.js
|   `-- event.validations.js
|-- scripts/
|   |-- createAdmin.js
|   |-- seedColleges.js
|   `-- seedUsersAndEvents.js
`-- data/
    `-- colleges.json
```

## App Bootstrap

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

`server.js` then creates the HTTP server, listens on `process.env.PORT`, and exits on `EADDRINUSE`.

## Environment Variables

The current backend `.env` uses these keys:

| Variable | Purpose |
| --- | --- |
| `PORT` | API server port |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET_KEY` | JWT signing secret |
| `TOKEN_EXPIRY` | JWT expiry used by `generateAuthToken()` |
| `ADMIN_EMAIL` | Bootstrap admin email for `createAdmin.js` |
| `ADMIN_PASSWORD` | Bootstrap admin password for `createAdmin.js` |
| `REDIS_URL` | Redis connection for cache and BullMQ |
| `SMTP_HOST` | SMTP host |
| `SMTP_PORT` | SMTP port |
| `SMTP_SECURE` | Whether SMTP should use a secure transport |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `SMTP_FROM` | Optional sender address override |

Optional but referenced:

| Variable | Purpose |
| --- | --- |
| `FRONTEND_URL` | Additional allowed CORS origin |
| `NODE_ENV` | Controls cookie `secure` flag and logging behavior |

## Data Model

### `User`

Fields:

- `name`
- `email` (unique)
- `password` (`select: false`)
- `role` in `Student | Organizer | Admin`
- `collegeId` (optional ObjectId ref)
- timestamps

Model behavior:

- `generateAuthToken()` signs `{ userId }` with `JWT_SECRET_KEY`
- `hashPassword()` wraps `bcrypt.hash(..., 10)`
- `comparePassword()` wraps `bcrypt.compare(...)`

### `College`

Fields:

- `name`
- `city`
- `state`
- `latitude`
- `longitude`
- `location` as GeoJSON Point
- timestamps

Indexes:

- unique index on `name`
- `2dsphere` index on `location`

### `Event`

Fields:

- `title`
- `description`
- `category`
- `eventDate`
- `eventTime`
- `collegeId`
- `organizerId`
- `externalLink`
- `likesCount`
- `isActive`
- timestamps

Indexes:

- `{ isActive: 1, likesCount: -1, createdAt: -1 }`
- `{ collegeId: 1, isActive: 1, createdAt: -1 }`

The app uses soft delete by setting `isActive: false`.

### `Like`

Fields:

- `userId`
- `eventId`
- timestamps

Index:

- unique compound index on `{ userId, eventId }`

## Auth and Authorization

### Cookie Session Flow

- Signup and login generate a JWT and store it in an `httpOnly` cookie named `token`.
- Cookie options use `sameSite: "strict"` and `secure: process.env.NODE_ENV === "production"`.
- The cookie max age is currently hardcoded to 24 hours.
- Protected routes load the user from `req.cookies.token`.

### Auth Middleware

- `getUser` requires a valid auth cookie and sets `req.user`
- `getOptionalUser` tries to load a user but falls back to `req.user = null`

### Role Rules

- Public signup only allows `Student` and `Organizer`
- `Admin` accounts cannot be created through public signup
- `role.middleware.js` gates admin-only and organizer/admin endpoints

## Routing

### Auth Routes

Mounted at `/api/auth`

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/me` | Returns `{ user: req.user ?? null }` |
| `POST` | `/signup` | Rate limited, validated, sets auth cookie |
| `POST` | `/login` | Rate limited, validated, sets auth cookie |
| `POST` | `/logout` | Requires auth, clears cookie |

### College Routes

Mounted at `/api/colleges`

| Method | Path | Notes |
| --- | --- | --- |
| `POST` | `/` | Admin-only create |
| `GET` | `/search` | Public name search, returns `_id` and `name` |
| `GET` | `/` | Public list of all colleges |

### Event Routes

Mounted at `/api/events`

| Method | Path | Notes |
| --- | --- | --- |
| `POST` | `/` | Authenticated `Admin`/`Organizer` create |
| `GET` | `/` | Paginated active events |
| `GET` | `/my-college` | Authenticated college-scoped events |
| `GET` | `/trending` | Cached top events |
| `GET` | `/nearby` | Authenticated geospatial nearby events |
| `GET` | `/:eventId` | Active event details |
| `PUT` | `/:eventId` | Organizer or admin update |
| `DELETE` | `/:eventId` | Organizer or admin soft delete |

### Like Routes

Mounted at `/api/likes`

| Method | Path | Notes |
| --- | --- | --- |
| `POST` | `/:eventId/like` | Authenticated like |
| `DELETE` | `/:eventId/like` | Authenticated unlike |

## Services and Business Logic

### `auth.service.js`

- Creates users after checking allowed roles and duplicate email
- Hashes passwords before insert
- Verifies credentials for login

### `college.service.js`

- Creates colleges and builds the GeoJSON `location` field

### `event.service.js`

- Creates events tied to `req.user.collegeId` and `req.user._id`
- Paginates and sorts active events
- Enforces organizer/admin ownership on update and delete
- Soft-deletes by setting `isActive: false`
- Fetches same-college and nearby-college events
- Caches trending events in Redis for 60 seconds
- Invalidates the trending cache on like/unlike
- Enqueues notification emails on event creation

### `like.service.js`

- Prevents duplicate likes
- Maintains `Event.likesCount`
- Invalidates trending cache after like or unlike

## Queueing, Cache, and Email

### Redis

Two Redis clients are used:

- `config/redis.js`: cache operations through the `redis` package
- `config/bullmq.redis.js`: BullMQ transport through `ioredis`

### Trending Cache

- Cache key: `trending_events`
- TTL: 60 seconds
- Read path: `getTrendingEvents()`
- Invalidation path: `invalidateTrendingCache()`

### Notification Queue

When an event is created, `event.service.js` adds a `send-event-email` job to the `event-notifications` queue with:

- `eventId`
- `collegeId`

### Notification Worker

`workers/notification.worker.js`:

- connects to MongoDB
- starts a BullMQ worker on `event-notifications`
- fetches the event by `eventId`
- finds all users in the same college
- sends one email per user with `email.service.js`

## Validation, Errors, and Rate Limits

### Validation

Validation exists for:

- signup
- login
- create college
- create event

`validate.middleware.js` converts the first validation failure into an `AppError` with status `400`.

### Error Format

The centralized error handler returns:

```json
{
  "success": false,
  "message": "..."
}
```

### Rate Limits

| Limiter | Scope |
| --- | --- |
| `loginLimiter` | 5 requests per minute per IP |
| `signupLimiter` | 3 requests per minute per IP |
| `generalLimiter` | 100 requests per minute per IP across `/api` |

## Seeding and Bootstrap Scripts

### `scripts/createAdmin.js`

- reads `ADMIN_EMAIL` and `ADMIN_PASSWORD`
- creates a single `Admin` user if one does not already exist

### `scripts/seedColleges.js`

- reads `data/colleges.json`
- ensures the unique `name` index
- inserts only missing colleges
- supports batch size via `SEED_BATCH_SIZE`

### `scripts/seedUsersAndEvents.js`

- requires colleges to exist first
- creates 25 organizer test users
- creates 100 events
- uses `password123` for seeded test accounts

## Current Implementation Notes

- The frontend admin page calls `GET /users`, but the backend currently has no `/api/users` route.
- Event responses do not currently `populate()` `collegeId` or `organizerId`, so consumers usually receive raw ObjectIds instead of nested objects.
- `POST /api/events` validation requires a `collegeId` field in the request body, but `event.service.js` ignores it and always derives the real college from the authenticated user.
- `PUT /api/events/:eventId` has auth and role checks but no validation middleware.
- `seedUsersAndEvents.js` generates times like `9:30 AM`, while the create-event validator expects `HH:MM` 24-hour format.
- Cookie max age is fixed at 24 hours, while JWT expiry comes from `TOKEN_EXPIRY`; those settings can drift if env values change.
