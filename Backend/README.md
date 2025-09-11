# Qure Backend

Node.js + Express API (ES Modules) with MongoDB and JWT auth.

## Setup

1. Create an `.env` file (see `.env.example`).
2. Install dependencies:
   - `npm install`
3. Run in dev: `npm run dev`

## Environment

- `PORT=4000`
- `MONGODB_URI=mongodb://localhost:27017/qure`
- `JWT_SECRET=your-strong-secret`
- `CORS_ORIGIN=http://localhost:5173,http://localhost:5500`

## API

Base path: `/api`

### Auth

- `POST /api/auth/register`

  - body: `{ firstName, lastName, email, phone, password, role: "patient"|"staff", hospitalName? }`
  - returns: `{ token, user }`

- `POST /api/auth/login`

  - body: `{ emailOrPhone, password }`
  - returns: `{ token, user }`

- `POST /api/auth/forgot-password`

  - body: `{ email }`
  - returns: `{ message }` (and `resetToken` in development)

- `POST /api/auth/reset-password`
  - body: `{ token, password }`
  - returns: `{ message }`

Use the returned `token` as `Authorization: Bearer <token>` for protected routes.
