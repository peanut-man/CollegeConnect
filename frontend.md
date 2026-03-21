# College Connect Frontend Documentation

## Overview

The frontend is a Vite + React 19 single-page app for browsing, liking, and managing campus events. It uses cookie-based auth, React Router for navigation, React Query for read-heavy event fetching, and Axios for all backend requests.

The current UI is built with Tailwind CSS v4 plus a small custom theme in `src/index.css`. Most page state is local to each screen; shared auth state lives in `AuthProvider`, and shared event-feed fetching lives in `useEventsFeed`.

## Tech Stack

| Area | Package(s) | Notes |
| --- | --- | --- |
| Build/dev | `vite`, `@vitejs/plugin-react` | Standard Vite setup |
| Styling | `tailwindcss`, `@tailwindcss/vite` | Tailwind v4 imported from `src/index.css` |
| UI | `react`, `react-dom` | React 19 |
| Routing | `react-router-dom` | BrowserRouter, Routes, route guards |
| Data fetching | `@tanstack/react-query` | Used for event feeds and event detail |
| HTTP | `axios` | Shared client with `withCredentials: true` |
| Linting | `eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` | Flat config |

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build a production bundle |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## High-Level Structure

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

## Bootstrap and Providers

`src/main.jsx` mounts the app with these wrappers, in order:

1. `ErrorBoundary`
2. `QueryClientProvider`
3. `BrowserRouter`
4. `AuthProvider`
5. `App`

React Query defaults currently set:

- `refetchOnWindowFocus: false`
- `retry: 1`

## Routing

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

### Route Guards

- `ProtectedRoute` waits for auth bootstrap, redirects unauthenticated users to `/login`, and blocks unauthorized roles with an in-page message.
- `PublicOnlyRoute` prevents signed-in users from revisiting `/login` and `/signup`.

## Auth Model

The app is fully cookie-session based.

- `AuthProvider` bootstraps the session with `GET /auth/me`.
- `login(credentials)` calls `POST /auth/login`.
- `signup(formData)` calls `POST /auth/signup`.
- `logout()` calls `POST /auth/logout` and clears frontend user state.
- `refreshUser()` re-fetches `GET /auth/me`.

Implementation note:

- `AuthProvider` explicitly removes a legacy `college-connect-token` localStorage key, so the app has already migrated away from client-stored token auth.

## Data Fetching

### Shared Event Feeds

`useEventsFeed(path)` is the common hook for feed-style pages:

- `Home`
- `Events`
- `Trending`
- `Nearby`
- `MyCollege`

Behavior:

- Uses React Query with `queryKey: ["events", path]`
- Normalizes different backend response shapes into an events array
- Uses `staleTime: 30000`
- Exposes `applyLikeDelta(eventId, delta)` for optimistic like-count updates

### Single Event Page

`EventDetail.jsx` uses its own `useQuery` call for `GET /events/:eventId` and re-fetches after a like/unlike action instead of sharing feed cache state.

### Local State Screens

The rest of the app mainly uses component-local state for forms and admin pages:

- `Login`
- `Signup`
- `CreateEvent`
- `ManageColleges`
- `ManageEvents`
- `ManageUsers`

## API Integration

`src/services/api.js` creates one Axios instance with:

- `withCredentials: true`
- `Content-Type: application/json`
- `baseURL` from `VITE_API_URL`, if defined
- fallback base URL of `http://<current-hostname>:3000/api`

### Endpoints Used by the Frontend

| Method | Path | Used by |
| --- | --- | --- |
| `GET` | `/auth/me` | `AuthProvider` |
| `POST` | `/auth/login` | `AuthProvider` |
| `POST` | `/auth/signup` | `AuthProvider` |
| `POST` | `/auth/logout` | `AuthProvider` |
| `GET` | `/events` | `Home`, `Events`, `ManageEvents` |
| `GET` | `/events/:eventId` | `EventDetail` |
| `GET` | `/events/trending` | `Trending` |
| `GET` | `/events/nearby` | `Nearby` |
| `GET` | `/events/my-college` | `MyCollege` |
| `POST` | `/events` | `CreateEvent` |
| `DELETE` | `/events/:eventId` | `ManageEvents` |
| `POST` | `/likes/:eventId/like` | `LikeButton` |
| `DELETE` | `/likes/:eventId/like` | `LikeButton` |
| `GET` | `/colleges` | `ManageColleges` |
| `POST` | `/colleges` | `ManageColleges` |
| `GET` | `/colleges/search` | `CollegeSelect` |
| `GET` | `/users` | `ManageUsers` |

## Page Responsibilities

- `Home` shows the hero plus the first three items from the general events feed.
- `Events` shows the full active event board.
- `Trending` shows the most-liked events feed.
- `Nearby` uses the authenticated user's college to fetch nearby college events.
- `MyCollege` shows events for the signed-in user's own college.
- `EventDetail` shows the full event view with category, date, time, link, and like actions.
- `CreateEvent` is the organizer/admin form for publishing a new event.
- `Login` redirects back to the originally requested protected route when possible.
- `Signup` creates an account and immediately enters an authenticated session.
- `AdminDashboard` links to the three admin management pages.
- `ManageColleges` lists colleges and creates new ones.
- `ManageEvents` lists all events and soft-deletes them through the backend.
- `ManageUsers` attempts to list all users for admins.

## Important Components

### `Shell.jsx`

- Renders the top-level header and nav
- Shows `Create event` only for `Admin` and `Organizer`
- Shows `Admin` only for `Admin`
- Shows login/signup actions for guests and name/role/logout for signed-in users

### `CollegeSelect.jsx`

- Async search field for signup
- Debounces backend search by 300ms
- Cancels stale requests with `AbortController`
- Supports keyboard navigation for results
- Stores the selected college `_id` in a hidden input

### `LikeButton.jsx`

- Guest users are sent to `/login`
- Signed-in users can like or unlike
- Applies optimistic count updates through `onLikeChange`
- Reverts the optimistic change if the request fails

## Styling

The styling system is a mix of Tailwind utilities and a custom theme in `src/index.css`.

Notable choices:

- Tailwind v4 is loaded with `@import "tailwindcss";`
- Theme font is `Space Grotesk`
- Shared CSS variables define panel colors, accent colors, muted text, and shadows
- The page background uses layered radial and linear gradients
- `input`, `select`, and `textarea` share a common glass-panel style

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Optional explicit backend base URL |

Example:

```env
VITE_API_URL=http://localhost:3000/api
```

## Current Implementation Notes

- `Navbar.jsx` exists but is currently empty and unused; navigation lives in `Shell.jsx`.
- `ManageUsers` calls `GET /users`, but the current backend does not expose that route.
- Several frontend screens expect `event.collegeId?.name`, but the backend does not currently populate `collegeId` on event responses.
- `CreateEvent` still submits a hidden placeholder `collegeId` to satisfy backend validation, even though the backend derives the actual college from the authenticated user.
- `ErrorBoundary` uses a `solid-button` class that is not defined in `src/index.css`.
- `AdminDashboard.jsx` contains mojibake icon text and may need cleanup if those cards are polished later.
