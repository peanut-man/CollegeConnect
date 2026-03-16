# College Connect — Backend Documentation

## Table of Contents

1. [Overview](#1-overview)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Project Structure](#3-project-structure)
4. [Entry Points](#4-entry-points)
5. [Database & Config](#5-database--config)
6. [Models](#6-models)
7. [Routes](#7-routes)
8. [Controllers](#8-controllers)
9. [Services](#9-services)
10. [Middlewares](#10-middlewares)
11. [Validations](#11-validations)
12. [Utilities](#12-utilities)
13. [Scripts](#13-scripts)
14. [Authentication Flow](#14-authentication-flow)
15. [Data Flow by Feature](#15-data-flow-by-feature)
16. [Error Handling](#16-error-handling)
17. [Environment Variables](#17-environment-variables)

---

## 1. Overview

College Connect is a campus event platform. The backend is a Node.js/Express REST API that exposes four domains: **auth**, **colleges**, **events**, and **likes**. All state is persisted in MongoDB via Mongoose. Authentication is cookie-based (HttpOnly JWT). The API is consumed exclusively by the React frontend.

---

## 2. Tech Stack & Dependencies

| Package | Version | Purpose |
|---|---|---|
| `express` | (peer) | HTTP server framework |
| `mongoose` | ^9.1.3 | MongoDB ODM |
| `jsonwebtoken` | ^9.0.3 | Create and verify JWTs |
| `bcrypt` | ^6.0.0 | Password hashing (10 salt rounds) |
| `cookie-parser` | ^1.4.7 | Parse `Cookie` header into `req.cookies` |
| `cors` | ^2.8.5 | Cross-origin resource sharing |
| `dotenv` | ^17.2.3 | Load `.env` into `process.env` |
| `express-validator` | ^7.3.1 | Request body validation via chainable rules |

**Scripts:**

| Command | Action |
|---|---|
| `npm start` | `node server.js` |
| `npm run dev` | `npx nodemon server.js` |

---

## 3. Project Structure

```
backend/
├── app.js                  # Express app setup, middleware registration, route mounting
├── server.js               # HTTP server creation and port binding
├── config/
│   └── db.js               # MongoDB connection via Mongoose
├── constants/              # (directory exists; no files currently used)
├── controllers/
│   ├── auth.controller.js
│   ├── college.controller.js
│   ├── event.controller.js
│   └── like.controller.js
├── middlewares/
│   ├── auth.middleware.js   # JWT cookie verification (enforced + optional variants)
│   ├── error.middleware.js  # Centralized Express error handler
│   ├── role.middleware.js   # Role-based access control
│   └── validate.middleware.js # express-validator result consumer
├── models/
│   ├── college.model.js
│   ├── event.model.js
│   ├── like.model.js
│   └── user.model.js
├── routes/
│   ├── auth.routes.js
│   ├── college.routes.js
│   ├── event.routes.js
│   └── like.routes.js
├── scripts/
│   └── createAdmin.js      # One-time admin seed script
├── services/
│   ├── auth.service.js
│   ├── college.service.js
│   ├── event.service.js
│   └── like.service.js
├── utils/
│   ├── appError.js         # Custom operational error class
│   └── geo.js              # Haversine distance formula
└── validations/
    ├── auth.validations.js
    ├── college.validations.js
    └── event.validations.js
```

---

## 4. Entry Points

### `app.js`

Sets up the entire Express application in this order:

1. Loads `dotenv` (environment variables available before any other require).
2. Imports and calls `connectToDb()` — DB connection is established on module load.
3. Builds `allowedOrigins` from `[process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174']` (falsy values filtered out).
4. Registers global middleware:
   - `cors({ origin: allowedOrigins, credentials: true })` — allows cookies cross-origin
   - `cookie-parser`
   - `express.json()`
   - `express.urlencoded({ extended: true })`
5. Health-check: `GET /` returns `"hello"`.
6. Mounts routers:
   - `/api/auth` → auth routes
   - `/api/colleges` → college routes
   - `/api/events` → event routes
   - `/api/likes` → like routes
7. Registers `errorHandler` as the final middleware (catches all errors forwarded by `next(err)`).

### `server.js`

Thin wrapper around `app`. Creates a native `http.Server`, reads `PORT` from env, calls `server.listen(port)`. On `EADDRINUSE` error it logs and exits with code 1.

---

## 5. Database & Config

### `config/db.js`

```
mongoose.connect(process.env.MONGODB_URI)
```

- Logs `"Connected to database."` on success.
- Calls `process.exit(1)` on failure — the process cannot run without a DB connection.
- No explicit connection pool settings; Mongoose defaults apply.

---

## 6. Models

### `user.model.js`

**Collection:** `users`

| Field | Type | Rules |
|---|---|---|
| `name` | String | required |
| `email` | String | required, unique |
| `password` | String | required, `select: false`, minlength 6 |
| `role` | String | required, enum: `Student \| Organizer \| Admin` |
| `collegeId` | ObjectId → `'college'` | optional |
| `createdAt/updatedAt` | Date | auto (`timestamps: true`) |

**Instance methods:**

| Method | Behaviour |
|---|---|
| `generateAuthToken()` | Signs `{ userId: this._id }` with `JWT_SECRET_KEY`, expiry from `TOKEN_EXPIRY`. Returns the token string. |
| `comparePassword(plain)` | `bcrypt.compare(plain, this.password)`. Returns boolean promise. |

**Static methods:**

| Method | Behaviour |
|---|---|
| `hashPassword(plain)` | `bcrypt.hash(plain, 10)`. Returns hashed string promise. |

> `password` has `select: false` — must use `.select('+password')` to retrieve it.

---

### `college.model.js`

**Collection:** `colleges`

| Field | Type | Rules |
|---|---|---|
| `name` | String | required |
| `city` | String | required |
| `state` | String | required |
| `latitude` | Number | required |
| `longitude` | Number | required |
| `createdAt/updatedAt` | Date | auto |

No indexes beyond `_id`. No methods or hooks.

---

### `event.model.js`

**Collection:** `events`

| Field | Type | Rules |
|---|---|---|
| `title` | String | required, trim |
| `description` | String | required |
| `category` | String | required, enum: `Hackathon \| Seminar \| Fest \| Workshop \| Other` |
| `eventDate` | Date | required |
| `eventTime` | String | required |
| `collegeId` | ObjectId → `'College'` | required |
| `organizerId` | ObjectId → `'User'` | required |
| `externalLink` | String | optional |
| `likesCount` | Number | default: `0` |
| `isActive` | Boolean | default: `true` |
| `createdAt/updatedAt` | Date | auto |

**Compound indexes:**

| Index | Purpose |
|---|---|
| `{ isActive: 1, likesCount: -1, createdAt: -1 }` | Trending queries |
| `{ collegeId: 1, isActive: 1, createdAt: -1 }` | College-scoped feed queries |

Events are **soft-deleted** (`isActive: false`) rather than removed from the collection.

---

### `like.model.js`

**Collection:** `likes`

| Field | Type |
|---|---|
| `userId` | ObjectId → `'User'` |
| `eventId` | ObjectId → `'Event'` |
| `createdAt/updatedAt` | Date (auto) |

**Unique compound index:** `{ userId: 1, eventId: 1 }` — enforces one like per user per event at the database level.

---

## 7. Routes

All routes are prefixed with `/api`.

### Auth — `/api/auth`

| Method | Path | Middleware | Controller |
|---|---|---|---|
| GET | `/me` | `getOptionalUser` | `getUser` |
| POST | `/signup` | `signupValidation`, `validateMiddleware` | `signUpUser` |
| POST | `/login` | `loginValidation`, `validateMiddleware` | `loginUser` |
| POST | `/logout` | `getUser` (enforced) | `logoutUser` |

### Colleges — `/api/colleges`

| Method | Path | Middleware | Controller |
|---|---|---|---|
| POST | `/` | `getUser`, `createCollegeValidation`, `validateMiddleware`, `requireRole("Admin")` | `createCollege` |
| GET | `/` | — | `getAllColleges` |

### Events — `/api/events`

| Method | Path | Middleware | Controller |
|---|---|---|---|
| POST | `/` | `getUser`, `requireRole("Admin","Organizer")`, `createEventValidation`, `validateMiddleware` | `createEvent` |
| GET | `/` | — | `getAllEvents` |
| GET | `/my-college` | `getUser` | `getEventByCollegeId` |
| GET | `/trending` | — | `getTrendingEvents` |
| GET | `/nearby` | `getUser` | `getNearbyEvents` |
| GET | `/:eventId` | — | `getEventById` |
| PUT | `/:eventId` | `getUser`, `requireRole("Admin","Organizer")` | `updateEventById` |
| DELETE | `/:eventId` | `getUser`, `requireRole("Admin","Organizer")` | `deleteEventById` |

> Literal paths (`/my-college`, `/trending`, `/nearby`) are registered before `/:eventId` to prevent the param route from matching them.

### Likes — `/api/likes`

| Method | Path | Middleware | Controller |
|---|---|---|---|
| POST | `/:eventId/like` | `getUser` | `likeEvent` |
| DELETE | `/:eventId/like` | `getUser` | `unlikeEvent` |

---

## 8. Controllers

Controllers handle only HTTP concerns: read from `req`, call a service, set cookies/headers, send responses, and forward errors to `next`.

### `auth.controller.js`

**Helper `getAuthCookieOptions()`** — returns:
```js
{ httpOnly: true, sameSite: "strict", secure: (NODE_ENV === "production"), maxAge: 604800000 }
```
(7 days, in milliseconds)

| Function | Behaviour |
|---|---|
| `signUpUser` | Calls `authService.createUser(req.body)` → generates token → sets cookie → `201 { user }` |
| `loginUser` | Calls `authService.loginUser(req.body)` → generates token → sets cookie → `200 { user }` |
| `getUser` | Returns `req.user ?? null` as `200 { user }` (populated upstream by `getOptionalUser`) |
| `logoutUser` | Clears `token` cookie → `200 { message: "Logged out successfully" }` |

### `college.controller.js`

| Function | Behaviour |
|---|---|
| `createCollege` | Calls `collegeService.createCollege(req.body)` → `201 { success: true, data: college }` |
| `getAllColleges` | Calls `collegeModel.find({})` directly → `200 { success: true, data: colleges }` |

### `event.controller.js`

| Function | Behaviour |
|---|---|
| `createEvent` | Calls `eventService.createEvent(req.body, req.user)` → `201 { success, data }` |
| `getAllEvents` | Calls `eventService.getAllEvents()` → `200 { success, data }` |
| `getEventById` | Calls `eventService.getEventById(req.params.eventId)` → `200 { success, data }` |
| `updateEventById` | Calls `eventService.updateEventById(eventId, req.body, req.user)` → `200 { success, data }` |
| `deleteEventById` | Calls `eventService.deleteEventById(eventId, req.user)` → `200 { success, data }` |
| `getEventByCollegeId` | Guards `req.user.collegeId` presence, calls service → `200 { success, data }` |
| `getTrendingEvents` | Calls `eventService.getTrendingEvents()` → `200 { success, data }` |
| `getNearbyEvents` | Guards `req.user.collegeId` presence, calls service → `200 { success, data }` |

### `like.controller.js`

| Function | Behaviour |
|---|---|
| `likeEvent` | Calls `likeService.likeEvent(eventId, req.user)` → `200 { success, data: like }` |
| `unlikeEvent` | Calls `likeService.unlikeEvent(eventId, req.user)` → `200 { success, data }` |

---

## 9. Services

Services contain all business logic. They return data or throw `AppError` instances.

### `auth.service.js`

**`createUser(data)`**

1. Throws `AppError(403)` if `role === "Admin"` — Admin accounts cannot be self-registered.
2. Throws `AppError(403)` if role is not `Student` or `Organizer`.
3. `userModel.findOne({ email })` — throws `AppError(409)` if email already registered.
4. Hashes password via `userModel.hashPassword(password)` (bcrypt, 10 rounds).
5. `userModel.create({ name, email, password: hashed, role, collegeId })`.
6. Strips `password` from the returned object before returning.

**`loginUser(data)`**

1. `userModel.findOne({ email }).select('+password')` — throws `AppError(401)` with generic message if not found (prevents email enumeration).
2. `user.comparePassword(password)` — throws `AppError(401)` with same generic message on mismatch.
3. Strips `password` from user, returns user.

---

### `college.service.js`

**`createCollege(data)`**

Calls `collegeModel.create({ name, city, state, latitude, longitude })`. Wraps in try/catch and re-throws as `AppError(500)` on failure.

---

### `event.service.js`

**`createEvent(eventData, user)`**

Builds the event document sourcing `collegeId` and `organizerId` from `user` — clients cannot supply these fields. Calls `eventModel.create(...)`.

**`getAllEvents()`**

`eventModel.find({ isActive: true })` — no sorting or pagination.

**`getEventById(eventId)`**

`eventModel.findOne({ _id: eventId, isActive: true })`. Throws `AppError(404)` if not found.

**`updateEventById(eventId, updateData, user)`**

1. Finds event; throws `AppError(404)` if missing.
2. Authorization: throws `AppError(403)` if requester is not the event organizer AND is not an Admin.
3. `eventModel.findByIdAndUpdate(eventId, updateData, { new: true })`.

**`deleteEventById(eventId, user)`**

1. `eventModel.findById(eventId)` (finds even inactive events). Throws `AppError(404)` if missing.
2. Same authorization check as update.
3. Soft-delete: sets `isActive: false`.

**`getEventByCollegeId(collegeId)`**

`eventModel.find({ collegeId, isActive: true })`, projects out `collegeId`, sorts by `createdAt: -1`.

**`getTrendingEvents()`**

`eventModel.find({ isActive: true })`, projects out `collegeId`, sorts by `{ likesCount: -1, createdAt: -1 }`, limits to 10.

**`getNearbyEvents(collegeId)`**

1. Fetches user's college and reads its `latitude` and `longitude`. Throws `AppError(404)` if college missing.
2. Fetches all colleges from the DB.
3. Filters in-memory using Haversine formula (from `utils/geo.js`) to colleges within **50 km**.
4. `eventModel.find({ collegeId: { $in: nearbyCollegeIds }, isActive: true })`, projects out `collegeId`, sorts by `createdAt: -1`.

---

### `like.service.js`

**`likeEvent(eventId, user)`**

1. Verifies event exists and is active. Throws `AppError(404)` if not.
2. `likeModel.findOne({ userId, eventId })` — throws `AppError(409)` if already liked.
3. `likeModel.create({ userId, eventId })`.
4. `eventModel.updateOne({ _id: eventId }, { $inc: { likesCount: 1 } })` — atomic increment.
5. Returns the new like document.

**`unlikeEvent(eventId, user)`**

1. `likeModel.findOne({ userId, eventId })` — throws `AppError(400)` if like does not exist.
2. `likeModel.deleteOne({ _id: existingLike._id })`.
3. `eventModel.updateOne({ _id: eventId, likesCount: { $gt: 0 } }, { $inc: { likesCount: -1 } })` — atomic decrement with a floor guard (prevents going below 0).
4. Returns `{ message: "Event unliked successfully" }`.

---

## 10. Middlewares

### `auth.middleware.js`

**Internal helper `loadUserFromCookie(req)`** (not exported):
- Reads `req.cookies?.token`.
- Returns `null` if no token.
- `jwt.verify(token, JWT_SECRET_KEY)` → `userModel.findById(decoded.userId)`.

**`getUser(req, res, next)`** — enforced authentication:
- Blocks if no cookie → `AppError(401, "Authentication token missing")`.
- Blocks if user not found in DB → `AppError(401, "User not found")`.
- Catches JWT errors (expired, malformed) → `AppError(401, "Invalid or expired token")`.
- Sets `req.user` and calls `next()` on success.

**`getOptionalUser(req, res, next)`** — optional authentication:
- Calls `loadUserFromCookie`; sets `req.user` to the result (may be `null`).
- Swallows all errors silently (`req.user = null`). Never blocks the request.
- Used on `GET /auth/me` so unauthenticated clients still get a `200` response.

---

### `role.middleware.js`

**`requireRole(...allowedRoles)`** — factory returning a middleware closure:

- If `!req.user`: responds directly `401 { message: "Authentication required" }`.
- If `req.user.role` not in `allowedRoles`: responds `403 { message: "Insufficient permissions", requiredRole, yourRole }`.
- Otherwise: `next()`.

Accepts variadic arguments, e.g., `requireRole("Admin", "Organizer")`.

---

### `validate.middleware.js`

Reads `validationResult(req)` from `express-validator`. If there are errors, takes the first one and passes `AppError(firstError.msg || "Validation failed", 400)` to `next`. Clears the chain if valid.

---

### `error.middleware.js`

Central 4-argument Express error handler (registered last in `app.js`).

- Reads `err.statusCode` (default `500`) and `err.message` (default `"Internal server error"`).
- **Development mode:** logs 5xx non-operational errors with full `console.error(err)`; logs 4xx as a one-line warning.
- **Production mode:** logs only 5xx errors; suppresses 4xx log noise entirely.
- Always responds `{ success: false, message }` — never exposes stack traces.

---

## 11. Validations

All validators use `express-validator`'s `body()` API and are run as a middleware array before `validateMiddleware`.

### Auth Validations (`auth.validations.js`)

**`signupValidation`:**

| Field | Rules |
|---|---|
| `name` | `notEmpty` |
| `email` | `isEmail` |
| `password` | `isLength({ min: 6 })` |
| `role` | `notEmpty` → `bail()` → `isIn(["Student", "Organizer"])` |
| `collegeId` | `notEmpty` → custom ObjectId format check → async DB check (college must exist) |

**`loginValidation`:**

| Field | Rules |
|---|---|
| `email` | `isEmail` |
| `password` | `isLength({ min: 6 })` |

### College Validations (`college.validations.js`)

**`createCollegeValidation`:**

| Field | Rules |
|---|---|
| `name` | `notEmpty`, `isString` |
| `city` | `notEmpty`, `isString` |
| `state` | `notEmpty`, `isString` |
| `latitude` | `notEmpty`, `isFloat` |
| `longitude` | `notEmpty`, `isFloat` |

### Event Validations (`event.validations.js`)

**`createEventValidation`:**

| Field | Rules |
|---|---|
| `title` | `notEmpty`, `isString` |
| `description` | `notEmpty`, `isString` |
| `category` | `notEmpty`, `isIn(["Hackathon","Seminar","Fest","Workshop","Other"])` |
| `eventDate` | `notEmpty`, `isISO8601` |
| `eventTime` | `notEmpty`, `matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)` (HH:MM) |
| `collegeId` | `notEmpty`, `isMongoId` |
| `externalLink` | optional, `isURL` |

---

## 12. Utilities

### `utils/appError.js`

```js
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

`isOperational = true` distinguishes expected HTTP errors from unexpected programming errors in the error middleware. Stack trace excludes the `AppError` constructor frame itself.

---

### `utils/geo.js`

**`getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2)`**

Implements the **Haversine formula** for great-circle distance between two geographic coordinate pairs. Uses Earth radius `R = 6371 km`. Returns distance in km as a float. Pure function with no side effects.

Used by `event.service.js → getNearbyEvents()` to filter colleges within 50 km.

---

## 13. Scripts

### `scripts/createAdmin.js`

Standalone CLI script, not connected to any route or HTTP server.

**Run:** `node scripts/createAdmin.js`

**Flow:**
1. Loads `.env` from the parent `backend/` directory.
2. Reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from env — exits with error if either is missing.
3. Connects to MongoDB.
4. `User.findOne({ role: "Admin" })` — if one already exists, logs and exits `0` (idempotent).
5. Hashes the password and creates `{ name: "System Admin", email, password, role: "Admin" }` — no `collegeId`.
6. Logs success and exits `0`. On any error, exits `1`.

---

## 14. Authentication Flow

```
Client                          Backend
  |                                |
  |  POST /api/auth/signup         |
  |  { name, email, password,      |
  |    role, collegeId }           |
  |------------------------------> |
  |                                | validateMiddleware (400 if invalid)
  |                                | authService.createUser()
  |                                |   - role guard (403)
  |                                |   - duplicate email check (409)
  |                                |   - bcrypt hash (10 rounds)
  |                                |   - userModel.create()
  |                                | user.generateAuthToken() → JWT
  |                                | Set-Cookie: token=<JWT>; HttpOnly; SameSite=Strict
  |  201 { user }                  |
  |<------------------------------- |

  |  POST /api/auth/login          |
  |  { email, password }           |
  |------------------------------> |
  |                                | validateMiddleware
  |                                | authService.loginUser()
  |                                |   - find user + select password
  |                                |   - bcrypt.compare()  (401 on mismatch)
  |                                | user.generateAuthToken() → JWT
  |                                | Set-Cookie: token=<JWT>; HttpOnly
  |  200 { user }                  |
  |<------------------------------- |

  |  (any authenticated request)   |
  |  Cookie: token=<JWT>           |
  |------------------------------> |
  |                                | authMiddleware.getUser()
  |                                |   - jwt.verify()
  |                                |   - userModel.findById(decoded.userId)
  |                                |   → req.user = user
  |                                | (proceed to route handler)
  |<------------------------------- |

  |  POST /api/auth/logout         |
  |------------------------------> |
  |                                | authMiddleware.getUser() (required)
  |                                | res.clearCookie("token")
  |  200 { message }               |
  |<------------------------------- |
```

**JWT payload:** `{ userId: <ObjectId> }` only. Role and other fields are never stored in the token — they are always loaded fresh from the database via `userModel.findById`.

**Cookie attributes:** `HttpOnly` (not accessible to JS), `SameSite=Strict` (CSRF protection), `Secure` only in production, `maxAge` 7 days.

---

## 15. Data Flow by Feature

### Signup

```
POST /api/auth/signup
  → signupValidation[]     (express-validator checks all fields; async DB check on collegeId)
  → validateMiddleware      (short-circuits on first error, 400)
  → authController.signUpUser
      → authService.createUser(req.body)
          → role guard
          → duplicate email guard
          → User.hashPassword()
          → User.create()
      → user.generateAuthToken()
      → Set-Cookie: token
      → 201 { user }
```

### Login

```
POST /api/auth/login
  → loginValidation[]
  → validateMiddleware
  → authController.loginUser
      → authService.loginUser(req.body)
          → User.findOne({ email }).select('+password')
          → user.comparePassword()
      → user.generateAuthToken()
      → Set-Cookie: token
      → 200 { user }
```

### Create Event

```
POST /api/events
  → authMiddleware.getUser       (reads JWT from cookie, populates req.user)
  → roleMiddleware.requireRole("Admin","Organizer")
  → createEventValidation[]
  → validateMiddleware
  → eventController.createEvent
      → eventService.createEvent(req.body, req.user)
          → collegeId and organizerId sourced from req.user (not from body)
          → Event.create()
      → 201 { success, data }
```

### Like / Unlike Event

```
POST /api/likes/:eventId/like
  → authMiddleware.getUser
  → likeController.likeEvent
      → likeService.likeEvent(eventId, user)
          → verify event exists and isActive
          → check for existing like (409 if duplicate)
          → Like.create()
          → Event.updateOne $inc likesCount +1  (atomic)
      → 200 { success, data: like }

DELETE /api/likes/:eventId/like
  → authMiddleware.getUser
  → likeController.unlikeEvent
      → likeService.unlikeEvent(eventId, user)
          → verify like exists (400 if not)
          → Like.deleteOne()
          → Event.updateOne $inc likesCount -1  (with $gt: 0 floor guard)
      → 200 { success, data }
```

### Nearby Events

```
GET /api/events/nearby
  → authMiddleware.getUser         (collegeId comes from session user)
  → eventController.getNearbyEvents
      → eventService.getNearbyEvents(user.collegeId)
          → College.findById(collegeId)  → read lat/lng
          → College.find({})             → load all colleges
          → filter by Haversine distance ≤ 50 km (in-memory)
          → Event.find({ collegeId: { $in: nearbyIds }, isActive: true })
      → 200 { success, data }
```

### Trending Events

```
GET /api/events/trending         (public, no auth required)
  → eventController.getTrendingEvents
      → eventService.getTrendingEvents()
          → Event.find({ isActive: true })
            .sort({ likesCount: -1, createdAt: -1 })
            .limit(10)
      → 200 { success, data }
```

---

## 16. Error Handling

All intentional errors flow through `AppError`. The error middleware is the only place that sends error responses.

**Typical error response:**
```json
{ "success": false, "message": "Human-readable error message" }
```

**Common status codes used:**

| Code | Where thrown |
|---|---|
| 400 | Validation failures (validateMiddleware), unlike on non-existent like, missing collegeId on user |
| 401 | Missing/invalid/expired token, user not found after token decode, wrong credentials |
| 403 | Admin signup attempt, disallowed role, organizer trying to edit another's event |
| 404 | Event not found, college not found |
| 409 | Duplicate email on signup, duplicate like |
| 500 | Unexpected errors, college creation failure |

---

## 17. Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET_KEY` | Yes | Secret used to sign JWTs |
| `TOKEN_EXPIRY` | Yes | JWT expiry string, e.g. `"7d"` |
| `PORT` | Yes | HTTP server port |
| `FRONTEND_URL` | No | Production frontend origin added to CORS allowed list |
| `NODE_ENV` | No | Set to `"production"` to enable secure cookies and suppress 4xx logs |
| `ADMIN_EMAIL` | Script only | Email for the initial admin account (used by `createAdmin.js`) |
| `ADMIN_PASSWORD` | Script only | Password for the initial admin account |
