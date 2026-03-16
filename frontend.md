# College Connect — Frontend Documentation

## Table of Contents

1. [Overview](#1-overview)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Project Structure](#3-project-structure)
4. [Entry Point & Bootstrap](#4-entry-point--bootstrap)
5. [Routing](#5-routing)
6. [API Service Layer](#6-api-service-layer)
7. [Auth Context & State](#7-auth-context--state)
8. [Hooks](#8-hooks)
9. [Pages](#9-pages)
10. [Components](#10-components)
11. [Styling](#11-styling)
12. [Data Flow by Feature](#12-data-flow-by-feature)
13. [Environment Variables](#13-environment-variables)

---

## 1. Overview

The frontend is a single-page application built with React 19 and React Router v7. It communicates with the backend exclusively via an Axios instance that sends cookies with every request (`withCredentials: true`). There is no client-side token storage — session state is maintained by an HttpOnly cookie set by the backend.

The UI is a dark glassmorphic design implemented entirely in hand-written CSS (`index.css`). There is no global state management library; all state is component-local or provided through a single `AuthContext`.

---

## 2. Tech Stack & Dependencies

**Production:**

| Package | Version | Purpose |
|---|---|---|
| `react` | ^19.2.0 | UI library |
| `react-dom` | ^19.2.0 | DOM renderer |
| `react-router-dom` | ^7.13.0 | Client-side routing (BrowserRouter, Routes, Route, NavLink, etc.) |
| `axios` | ^1.13.5 | HTTP client, configured with `withCredentials: true` |

**Development:**

| Package | Purpose |
|---|---|
| `vite` | Dev server and production bundler |
| `@vitejs/plugin-react` | React JSX transform and HMR via Babel |
| `tailwindcss` | Installed but unused — no `@tailwind` directives, no config file |
| `eslint` + plugins | Linting (Rules of Hooks, React Refresh) |

**Scripts:**

| Command | Action |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production bundle via `vite build` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint across all `.js`/`.jsx` files |

---

## 3. Project Structure

```
frontend/
├── index.html                    # HTML shell with <div id="root">
├── vite.config.js                # Vite config (React plugin only)
├── eslint.config.js              # ESLint flat config (v9+)
├── .env.example                  # Documents VITE_API_URL variable
└── src/
    ├── main.jsx                  # App entry point — BrowserRouter + AuthProvider + App
    ├── App.jsx                   # All route definitions
    ├── index.css                 # All application styles (hand-written CSS)
    ├── context/
    │   ├── auth-context.js       # createContext(null) — the context object
    │   └── AuthContext.jsx       # AuthProvider — all auth state and functions
    ├── hooks/
    │   ├── useAuth.js            # useContext(AuthContext) with guard
    │   └── useEventsFeed.js      # Generic data-fetching hook for event feeds
    ├── services/
    │   └── api.js                # Axios instance (withCredentials, base URL resolution)
    ├── pages/
    │   ├── Home.jsx              # Landing page with hero + event highlights
    │   ├── Events.jsx            # Full public event feed
    │   ├── Trending.jsx          # Top 10 most-liked events
    │   ├── Nearby.jsx            # Events from colleges within 50 km (protected)
    │   ├── MyCollege.jsx         # Events from user's own college (protected)
    │   ├── CreateEvent.jsx       # Event creation form (Admin/Organizer only)
    │   ├── Login.jsx             # Login form
    │   └── Signup.jsx            # Registration form
    └── components/
        ├── Shell.jsx             # App layout wrapper (topbar + Outlet)
        ├── ProtectedRoute.jsx    # Auth and role guard
        ├── EventCard.jsx         # Single event card
        ├── EventGrid.jsx         # Grid of EventCards with empty state
        ├── LikeButton.jsx        # Like / Unlike controls
        ├── Hero.jsx              # Landing page hero section
        ├── PageIntro.jsx         # Page heading block (eyebrow + title + body)
        └── Navbar.jsx            # Empty file — navigation lives in Shell.jsx
```

---

## 4. Entry Point & Bootstrap

### `index.html`

Standard Vite HTML shell. Contains `<div id="root">` and loads `src/main.jsx` as an ES module. Page title is not yet updated from the Vite default.

### `src/main.jsx`

```jsx
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
```

Three layers wrap the application:

1. **`BrowserRouter`** — enables the HTML5 History API for client-side routing.
2. **`AuthProvider`** — runs the session bootstrap check (`GET /auth/me`) before the first render completes and provides auth state to the entire tree.
3. **`App`** — contains all `<Route>` definitions.

`index.css` is also imported here — it is the only stylesheet in the project.

---

## 5. Routing

### `src/App.jsx`

All routes are children of a single parent `<Route element={<Shell />}>`. Every rendered page is therefore wrapped in Shell's layout (sticky topbar + `<main>` content area).

| Path | Component | Guard |
|---|---|---|
| `/` | `Home` | Public |
| `/events` | `Events` | Public |
| `/trending` | `Trending` | Public |
| `/nearby` | `Nearby` | `ProtectedRoute` (auth required) |
| `/my-college` | `MyCollege` | `ProtectedRoute` (auth required) |
| `/create-event` | `CreateEvent` | `ProtectedRoute` with `requireRoles={["Admin", "Organizer"]}` |
| `/login` | `Login` | Public |
| `/signup` | `Signup` | Public |
| `*` | — | `<Navigate to="/" replace>` |

**`ProtectedRoute`** handles three states before rendering its children: loading, unauthenticated, and insufficient role. See [Components → ProtectedRoute](#protectedroutejsx) for details.

---

## 6. API Service Layer

### `src/services/api.js`

A pre-configured Axios instance. No interceptors are defined.

**Base URL resolution (priority order):**

1. `import.meta.env.VITE_API_URL` (trimmed, trailing slashes stripped), if set
2. `${window.location.protocol}//${window.location.hostname}:3000/api` (same host, port 3000)
3. `http://localhost:3000/api` (absolute fallback)

**Instance configuration:**
```js
{
  baseURL: resolveApiBaseUrl(),
  withCredentials: true,         // cookies are sent with every request
  headers: { "Content-Type": "application/json" }
}
```

**All API calls made across the app:**

| Method | Path | Called from |
|---|---|---|
| GET | `/auth/me` | `AuthProvider` (bootstrap + `refreshUser`) |
| POST | `/auth/login` | `AuthProvider.login` |
| POST | `/auth/signup` | `AuthProvider.signup` |
| POST | `/auth/logout` | `AuthProvider.logout` |
| GET | `/colleges` | `Signup.jsx` |
| GET | `/events` | `Home.jsx`, `Events.jsx` |
| GET | `/events/trending` | `Trending.jsx` |
| GET | `/events/nearby` | `Nearby.jsx` |
| GET | `/events/my-college` | `MyCollege.jsx` |
| POST | `/events` | `CreateEvent.jsx` |
| POST | `/likes/:eventId/like` | `LikeButton.jsx` |
| DELETE | `/likes/:eventId/like` | `LikeButton.jsx` |

**Error handling pattern** — since there are no response interceptors, every caller inspects the error inline:
```js
catch (error) {
  error.response?.data?.message || error.message || "fallback text"
}
```

---

## 7. Auth Context & State

### `src/context/auth-context.js`

```js
export const AuthContext = createContext(null);
```

The context object is a separate file to prevent circular imports between `AuthContext.jsx` (provider) and `useAuth.js` (consumer).

---

### `src/context/AuthContext.jsx`

The `AuthProvider` component manages all authentication state for the application.

**State:**

| Variable | Type | Purpose |
|---|---|---|
| `user` | object \| null | The currently logged-in user, or `null` |
| `loading` | boolean | `true` while the bootstrap `/auth/me` call is in flight |
| `authReady` | boolean | `true` once the initial session check has settled (success or failure) |

**Mount effects (two `useEffect` calls):**

1. **Legacy token cleanup** — removes `college-connect-token` from `localStorage` (migration artifact from a previous token-based auth scheme). Errors are silently swallowed.

2. **Session bootstrap** (`bootstrapAuth`):
   - Calls `GET /auth/me`.
   - On success: sets `user` from `response.data.user` using `startTransition` (non-urgent update).
   - On failure (401, network error, etc.): sets `user = null`.
   - Either way: sets `loading = false` and `authReady = true`.
   - Uses an `active` flag to discard state updates if the component unmounts before the request completes.

**Exposed functions:**

| Function | Signature | Behaviour |
|---|---|---|
| `login` | `(credentials)` | `POST /auth/login` → sets `user` from response body or falls back to `refreshUser()` |
| `signup` | `(formData)` | `POST /auth/signup` → same pattern; throws on error so callers can display messages |
| `logout` | `()` | `POST /auth/logout` → sets `user = null` in `finally` block regardless of server response |
| `refreshUser` | `()` | `GET /auth/me` → sets and returns the latest user object |

**Context value provided:**
```js
{ authReady, loading, login, logout, refreshUser, signup, user }
```

---

## 8. Hooks

### `src/hooks/useAuth.js`

```js
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
```

Thin consumer hook that guards against being called outside the provider tree. Returns all six values from `AuthContext`.

---

### `src/hooks/useEventsFeed.js`

The primary data-fetching hook used by every event feed page.

**Signature:** `useEventsFeed(path)` — accepts a relative API path string.

**State:**

| Variable | Initial | Purpose |
|---|---|---|
| `events` | `[]` | Array of event objects |
| `error` | `""` | Error message string |
| `loading` | `true` | Fetch in-flight indicator |

**Fetch behaviour:**

- Calls `api.get(path)` on mount (and whenever `path` changes).
- Normalizes the response via `normalizeEvents(payload)` which handles three response shapes from the backend:
  - `payload.data[]` (standard shape)
  - `payload.events[]` (alternate shape)
  - `payload` itself being an array
  - Falls back to `[]` for any other shape.
- On error: extracts `requestError.response?.data?.message` or falls back to `"Unable to load events right now."`.
- Uses an `active` flag to suppress state updates after navigation away.

**`applyLikeDelta(eventId, delta)`:**

Optimistic UI updater. Maps over the `events` array and applies `delta` (+1 or -1) to `likesCount` for the matching event. Uses `Math.max(0, ...)` to prevent negative counts. No refetch is triggered.

**Returns:** `{ applyLikeDelta, error, events, loading }`

---

## 9. Pages

### `Home.jsx`

**Route:** `/`
**Auth:** reads `user` from `useAuth`
**Data:** `useEventsFeed("/events")`

Renders a landing page with three sections:
1. **`<Hero />`** — full-width hero with CTAs
2. **`<PageIntro>`** — "This week / Fresh campus activity" heading with a "See full calendar" link to `/events`
3. **Event highlights** — shows only the first 3 events (`events.slice(0, 3)`) as a preview grid. `showCollegeHint` is `false` here since all events may be from different colleges.

---

### `Events.jsx`

**Route:** `/events`
**Auth:** reads `user`
**Data:** `useEventsFeed("/events")`

Full public event board. Shows all active events from all colleges. No filtering or pagination.

**Empty state text:** "No events available / Create the first event to start the board."

---

### `Trending.jsx`

**Route:** `/trending`
**Auth:** reads `user`
**Data:** `useEventsFeed("/events/trending")`

Displays the top 10 most-liked active events (sorted by `likesCount` descending, then `createdAt` descending — handled entirely by the backend).

**Empty state text:** "No trending events yet / Likes will shape this feed."

---

### `Nearby.jsx`

**Route:** `/nearby`
**Protection:** `<ProtectedRoute>` (authentication required)
**Auth:** reads `user`
**Data:** `useEventsFeed("/events/nearby")`

Shows events from colleges within 50 km of the authenticated user's college. The radius calculation happens server-side using the user's session — this page passes no geolocation data itself.

**Empty state text:** "No nearby events right now."

---

### `MyCollege.jsx`

**Route:** `/my-college`
**Protection:** `<ProtectedRoute>` (authentication required)
**Auth:** reads `user`
**Data:** `useEventsFeed("/events/my-college")`

Shows all active events from the user's own college, most recent first. The college is derived on the backend from the authenticated session.

**Empty state text:** "No events published for your college yet."

---

### `CreateEvent.jsx`

**Route:** `/create-event`
**Protection:** `<ProtectedRoute requireRoles={["Admin","Organizer"]}>`
**State:** `formData`, `error`, `submitting`

**Form fields:**

| Field | Input type | Notes |
|---|---|---|
| `title` | text (required) | |
| `description` | textarea, 5 rows (required) | |
| `category` | select | Options: Hackathon, Seminar, Fest, Workshop, Other |
| `eventDate` | date (required) | |
| `eventTime` | time (required) | |
| `externalLink` | url (optional) | |
| `collegeId` | hidden | Hardcoded to `"managed-by-backend"` — the backend derives the real value from the session user |

**Submit flow:**
- `POST /events` with `formData`.
- On success: navigates to `/events` with `replace: true`.
- Error handling: checks for `requestError.response?.data?.errors` (array — joins all `{ msg }` strings); falls back to `response.data.message`.

---

### `Login.jsx`

**Route:** `/login`
**State:** `email`, `password`, `error`, `submitting`
**Auth:** reads `login` from `useAuth`

**Layout:** two-column — visual panel on the left, form on the right.

**Submit flow:**
1. Calls `login({ email, password })`.
2. On success: navigates to `location.state?.from?.pathname` (the page the user tried to visit before being redirected to login) or falls back to `/events`.
3. On error: shows `requestError.response?.data?.message` or fallback.

The `from` pathname in `location.state` is set by `ProtectedRoute` when it redirects unauthenticated users.

---

### `Signup.jsx`

**Route:** `/signup`
**State:** `formData`, `colleges[]`, `loadingColleges`, `error`, `submitting`
**Auth:** reads `signup` from `useAuth`

**On mount:** `GET /colleges` to populate the college dropdown. Response is normalized via `normalizeColleges` (handles `payload.data[]`, `payload.colleges[]`, or a direct array).

**Form fields:** name, email, password, role select (Student / Organizer), college select.

The college select is disabled while colleges are loading and shows "Loading colleges..." as the placeholder option until the fetch resolves.

**Submit flow:**
1. Calls `signup(formData)`.
2. On success: navigates to `/events` with `replace: true`.
3. Error: shows `requestError.response?.data?.message || requestError.message`.

---

## 10. Components

### `Shell.jsx`

The persistent application layout, rendered as the parent route element wrapping every page.

**Reads from `useAuth`:** `user`, `logout`

**Structure:**

```
<div className="app-shell">
  <header className="topbar">
    [Brand]   [Nav links]   [Account bar]
  </header>
  <main className="page-frame">
    <Outlet />      ← current page renders here
  </main>
</div>
```

**Brand area:** NavLink to `/` with the "CC" logo mark and "College Connect / Campus events with momentum" tagline.

**Nav links (always visible):**
- All events → `/events`
- Trending → `/trending`
- Nearby → `/nearby`
- My college → `/my-college`
- **Create event → `/create-event`** — only rendered when `user?.role === "Admin"` or `"Organizer"`

All nav links use NavLink and receive the `nav-link-active` class when the route matches.

**Account bar:**
- Authenticated: account chip showing `user.name` and `user.role` badge + "Log out" button (calls `logout()`)
- Unauthenticated: "Log in" (ghost NavLink to `/login`) + "Join now" (solid NavLink to `/signup`)

---

### `ProtectedRoute.jsx`

**Props:**
- `children` — page component to render if access is granted
- `requireRoles` — optional string array of allowed roles

**Decision tree:**

```
if (!authReady || loading)
  → render loading panel "Checking session / Loading your space"

else if (!user)
  → <Navigate to="/login" replace state={{ from: location }} />
    (preserves original URL for post-login redirect)

else if (requireRoles && !requireRoles.includes(user.role))
  → render access-denied panel "Access limited / This page is not available for your role"

else
  → render children
```

The `authReady` flag prevents a flash-redirect where the user is sent to `/login` before the bootstrap check has finished.

---

### `EventCard.jsx`

Renders a single event as an `<article>`.

**Props:**

| Prop | Type | Purpose |
|---|---|---|
| `event` | object | Event data |
| `onLikeChange` | function | `(eventId, delta)` — callback for optimistic like count update |
| `showCollegeHint` | boolean | If true, renders a "College" row in the metadata |
| `user` | object \| null | Passed to `LikeButton` |

**Card sections:**
1. **Header row** — category pill badge + like count (defaults to `0`)
2. **`<h3>`** — event title
3. **Description paragraph**
4. **`<dl>` metadata grid** — Date (formatted via `Intl.DateTimeFormat` with `en-IN` locale), Time, and optionally College name
5. **Actions row** — "Open link" anchor (opens in new tab) if `externalLink` exists, otherwise "No external link provided" text; plus `<LikeButton>`

`formatDate(dateString)` is an internal helper using `Intl.DateTimeFormat`. Falls back to the raw string on formatting failure.

---

### `EventGrid.jsx`

**Props:**

| Prop | Type | Purpose |
|---|---|---|
| `events` | array | List of event objects |
| `onLikeChange` | function | Passed to each `EventCard` |
| `showCollegeHint` | boolean | Passed to each `EventCard` |
| `user` | object \| null | Passed to each `EventCard` |
| `emptyTitle` | string | H1 for empty state panel |
| `emptyBody` | string | Body text for empty state panel |

**Behaviour:**
- If `events.length === 0`: renders an empty state panel with eyebrow "Nothing here yet", the configured title and body.
- Otherwise: renders a `<section className="event-grid">` (3-column CSS grid) with one `<EventCard>` per event, keyed by `event._id`.

---

### `LikeButton.jsx`

**Props:**

| Prop | Type | Purpose |
|---|---|---|
| `eventId` | string | The `_id` of the event |
| `onLikeChange` | function \| undefined | `(eventId, delta)` — optimistic update callback |
| `user` | object \| null | Current user |

**Behaviour:**
- If `!user`: renders a `<Link className="ghost-button" to="/login">Log in to like</Link>`.
- If authenticated: renders two side-by-side buttons ("Like" and "Unlike"), both disabled while a request is in flight (`busy` state).

**`handleLike`:**
1. Sets `busy = true`.
2. `POST /likes/:eventId/like`.
3. On success: calls `onLikeChange(eventId, 1)` and sets `message = "Liked"`.
4. On error: sets `message` to `error.response?.data?.message` or `"Failed to like"`.
5. Sets `busy = false` in `finally`.

**`handleUnlike`:**
1. Same pattern as like but `DELETE /likes/:eventId/like` and `delta = -1`.

Inline feedback is rendered as a `<small>` element below the buttons.

---

### `Hero.jsx`

**Reads from `useAuth`:** `user`

Renders a two-column hero section on the Home page.

**Left column (copy):**
- Eyebrow label: "Designed for live campus energy"
- H1: "Discover what your college is building this week."
- Body paragraph about the platform
- Two CTAs:
  - "Explore events" → `/events` (always shown)
  - If logged in: "View my college feed" → `/my-college`
  - If not logged in: "Create an account" → `/signup`

**Right column (`aria-hidden="true"`):**
Three decorative mock `<article className="spotlight-card">` elements with fabricated event titles, positioned absolutely with slight CSS rotations (-5°, +4°, -2°) to create a stacked card visual effect.

---

### `PageIntro.jsx`

Pure presentational component. Used at the top of every feed page.

**Props:**

| Prop | Type | Purpose |
|---|---|---|
| `eyebrow` | string | Uppercase cyan label with wide letter-spacing |
| `title` | string | H1 heading |
| `text` | string | Body paragraph |
| `actions` | ReactNode (optional) | Rendered in `.intro-actions` div (e.g., CTA buttons) |

No data fetching or state.

---

### `Navbar.jsx`

**Empty file — 0 bytes.** All navigation is implemented in `Shell.jsx`. This file is a dead artifact.

---

## 11. Styling

All styles are hand-written in `src/index.css`. Tailwind CSS is installed but completely unused — there are no `@tailwind` directives and no `tailwind.config.js` file.

**Design language:** dark glassmorphic theme with orange and cyan accents, backdrop-blur panels, and subtle transparency layers.

**CSS custom properties (`:root`):**

| Variable | Value | Usage |
|---|---|---|
| `--bg-panel` | `rgba(10, 16, 29, 0.7)` | Card and panel backgrounds |
| `--bg-panel-strong` | `rgba(16, 24, 40, 0.88)` | Topbar, auth card |
| `--line` | `rgba(255, 255, 255, 0.12)` | Subtle borders |
| `--line-strong` | `rgba(255, 255, 255, 0.22)` | Highlighted borders |
| `--text` | `#f7f2e8` | Primary text (warm white) |
| `--muted` | `#aeb8c8` | Secondary text |
| `--accent` | `#ff8451` | Orange — CTAs, active states |
| `--accent-strong` | `#ff6a2f` | Orange hover/active |
| `--accent-cool` | `#66d1ff` | Cyan — eyebrow labels |
| `--shadow` | `0 30px 80px rgba(0,0,0,0.28)` | Card drop shadows |

**Page background:** three-layer gradient — orange radial glow at top-left + cyan radial glow at top-right + a dark blue-to-navy linear gradient base.

**Font stack:** `"Space Grotesk"` with `"Segoe UI"` fallback.

**Key layout classes:**

| Class | Description |
|---|---|
| `.app-shell` | Full `100dvh` flex column wrapper |
| `.topbar` | Sticky 3-column grid header (`brand / nav / account`), `backdrop-filter: blur(18px)` |
| `.page-frame` | Centered content area, `min(1200px, 100% - 2rem)` wide, `2rem 0 4rem` padding |
| `.page-stack` | Vertical grid with `1.5rem` gap for stacking page sections |
| `.hero` | 2-column grid with gradient overlay and decorative card stack |
| `.event-grid` | 3-column auto-fill CSS grid for event cards |
| `.auth-layout` | 2-column grid for login and signup pages |
| `.editor-grid` | 2-column grid for CreateEvent form fields |
| `.state-panel` | Centered informational panel for loading / error / empty states |
| `.solid-button` | Orange gradient filled CTA button |
| `.ghost-button` | Transparent bordered button |
| `.pill` | Small orange-tinted category badge pill |
| `.eyebrow` | Uppercase cyan label with `0.1em` letter-spacing |
| `.form-error` | Orange-tinted error message container |

**Responsive breakpoints:**

| Breakpoint | Changes |
|---|---|
| `max-width: 1000px` | Topbar, hero, auth layout, event grid, editor grid collapse to single column |
| `max-width: 700px` | Tighter padding; spotlight cards become static (no absolute positioning, no rotation); event metadata grid collapses |

---

## 12. Data Flow by Feature

### Session Bootstrap (App Load)

```
main.jsx renders <AuthProvider>
  │
  └── useEffect (bootstrapAuth)
        │
        ├── GET /auth/me  (cookie sent automatically via withCredentials)
        │     ├── 200 → setUser(response.data.user)
        │     └── 401/error → setUser(null)
        │
        └── setLoading(false), setAuthReady(true)
              │
              └── ProtectedRoute gates now evaluate (no false flash-redirects)
```

---

### Signup Flow

```
User fills Signup form
  │
  ├── On mount: GET /colleges → populate college dropdown
  │
  └── handleSubmit
        │
        └── AuthProvider.signup(formData)
              │
              └── POST /auth/signup  { name, email, password, role, collegeId }
                    ├── 201 → setUser(response.data.user) → navigate("/events")
                    └── 4xx → setError(response.data.message)
```

---

### Login Flow

```
User fills Login form
  │
  └── handleSubmit
        │
        └── AuthProvider.login({ email, password })
              │
              └── POST /auth/login
                    ├── 200 → setUser(user) → navigate(from || "/events")
                    └── 401 → setError(message)
```

The `from` path is preserved in `location.state` by `ProtectedRoute` when it redirects unauthenticated users. After login, `Login.jsx` navigates back to that page automatically.

---

### Protected Page Access

```
User navigates to /nearby
  │
  └── ProtectedRoute evaluates
        ├── loading → "Checking session" panel
        ├── !user → <Navigate to="/login" state={{ from: "/nearby" }} />
        └── user exists → render <Nearby />
                            │
                            └── useEventsFeed("/events/nearby")
                                  │
                                  └── GET /events/nearby  (cookie sent)
                                        ├── 200 → setEvents(normalizeEvents(data))
                                        └── error → setError(message)
```

---

### Like an Event

```
User clicks "Like" on an EventCard
  │
  └── LikeButton.handleLike
        │
        ├── setsBusy(true)
        │
        ├── POST /likes/:eventId/like  (cookie sent)
        │     ├── 200 → onLikeChange(eventId, +1)
        │     │          │
        │     │          └── useEventsFeed.applyLikeDelta(eventId, 1)
        │     │                │
        │     │                └── events.map → find matching _id
        │     │                      → Math.max(0, likesCount + 1)
        │     │                      → setEvents(updated)  [optimistic, no refetch]
        │     │
        │     └── 409/error → setMessage(error text)
        │
        └── setBusy(false)
```

---

### Create Event Flow

```
Organizer/Admin navigates to /create-event
  │
  └── ProtectedRoute: requireRoles=["Admin","Organizer"]
        ├── role not in list → access-denied panel
        └── role matches → render <CreateEvent />
                            │
                            └── handleSubmit
                                  │
                                  └── POST /events  { title, description, category,
                                        eventDate, eventTime, externalLink,
                                        collegeId: "managed-by-backend" }
                                        ├── 201 → navigate("/events", { replace: true })
                                        └── 4xx → setError(errors[].msg joined, or message)
```

---

### Logout Flow

```
User clicks "Log out" in Shell topbar
  │
  └── AuthProvider.logout()
        │
        ├── POST /auth/logout  (cookie sent, server clears it)
        │
        └── finally: setUser(null)   ← user is cleared regardless of server response
```

---

## 13. Environment Variables

Only one environment variable is read by the frontend:

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | No | Full base URL for the backend API, e.g. `http://localhost:3000/api`. If omitted, the app falls back to same-host port 3000. |

Set it in a `.env` file in the `frontend/` directory:

```
VITE_API_URL=http://localhost:3000/api
```

Vite exposes variables prefixed with `VITE_` to the browser bundle via `import.meta.env`. Variables without the `VITE_` prefix are not bundled and are inaccessible at runtime.
