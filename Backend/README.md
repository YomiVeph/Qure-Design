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

### Appointments

- `POST /api/appointments` (Patient only)

  - body: `{ doctor, specialty, appointmentDate, appointmentTime, notes?, hospitalName? }`
  - returns: `{ success, message, data }`

- `GET /api/appointments` (Patient only)

  - query: `{ status?, page?, limit? }`
  - returns: `{ success, data: { appointments, pagination } }`

- `GET /api/appointments/:id` (Patient only)

  - returns: `{ success, data }`

- `PUT /api/appointments/:id` (Patient only)

  - body: `{ doctor?, specialty?, appointmentDate?, appointmentTime?, notes?, hospitalName? }`
  - returns: `{ success, message, data }`

- `DELETE /api/appointments/:id` (Patient only)
  - returns: `{ success, message, data }`

### Queue Management

- `POST /api/queues/join` (Patient only)

  - body: `{ hospitalName, specialty, notes?, priority? }`
  - returns: `{ success, message, data }`

- `GET /api/queues/status` (Patient only)

  - returns: `{ success, data }`

- `DELETE /api/queues/leave` (Patient only)

  - returns: `{ success, message, data }`

- `GET /api/queues/history` (Patient only)

  - query: `{ page?, limit? }`
  - returns: `{ success, data: { queues, pagination } }`

- `GET /api/queues/hospital` (Staff only)

  - query: `{ hospitalName, specialty? }`
  - returns: `{ success, data }`

- `POST /api/queues/call-next` (Staff only)
  - body: `{ hospitalName, specialty }`
  - returns: `{ success, message, data }`

### Notifications

- `GET /api/notifications` (All users)

  - query: `{ page?, limit?, unreadOnly? }`
  - returns: `{ success, data: { notifications, unreadCount, pagination } }`

- `PUT /api/notifications/:id/read` (All users)

  - returns: `{ success, message, data }`

- `PUT /api/notifications/read-all` (All users)

  - returns: `{ success, message }`

- `DELETE /api/notifications/:id` (All users)

  - returns: `{ success, message }`

- `GET /api/notifications/preferences` (All users)

  - returns: `{ success, data }`

- `PUT /api/notifications/preferences` (All users)
  - body: `{ email?, sms?, push?, inApp?, queueUpdates?, appointmentReminders?, generalNotifications? }`
  - returns: `{ success, message, data }`
