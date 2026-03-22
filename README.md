# College Connect

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

## Documentation

For more detailed information about the inner workings of each part of the system, refer to their respective documentation files:

- [Backend Documentation](./backend.md)
- [Frontend Documentation](./frontend.md)
