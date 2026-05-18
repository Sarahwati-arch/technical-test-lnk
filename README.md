# Technical Test — LNK (MERN Stack + TypeScript)

A full-stack web application built with **MongoDB, Express, React, Node.js** and **TypeScript**. Key features include JWT authentication, a calendar dashboard with CRUD events, and automated email delivery.

## Features

- **Auth** — Login & Logout with JWT (short-lived, 1 hour) + Audit Trail (logs ip_address & user_agent)
- **Calendar Dashboard** — Calendar view using react-big-calendar, displaying events by date
- **CRUD Events** — Create, Read, Delete events via modal form with Zod validation
- **Email Sender** — Automatically sends "Hi Salam kenal" email via Nodemailer + Mailtrap when an event is created
- **Toast Notifications** — Success/error notifications using react-hot-toast

## Tech Stack

| Layer       | Technology                                         |
|-------------|----------------------------------------------------|
| Frontend    | React 19 + TypeScript + Vite + Tailwind CSS        |
| Backend     | Node.js + Express 5 + TypeScript                   |
| Database    | MongoDB + Mongoose                                 |
| Auth        | JWT (jsonwebtoken) + bcryptjs                      |
| Validation  | Zod (backend & frontend)                           |
| Form        | react-hook-form + @hookform/resolvers              |
| Email       | Nodemailer + Mailtrap                              |
| Calendar    | react-big-calendar + date-fns                      |

## Prerequisites

- **Node.js** v18 or later
- **MongoDB** (local instance or Atlas)
- **Mailtrap** account (for email testing) — sign up at [mailtrap.io](https://mailtrap.io)

## Setup & Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd technical-test-lnk
```

### 2. Setup Backend

```bash
cd server
npm install
```

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

Edit the `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/technical-test-lnk
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1h
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=<your_mailtrap_username>
MAIL_PASS=<your_mailtrap_password>
MAIL_FROM=noreply@example.com
```

> For `MAIL_USER` and `MAIL_PASS`, log in to Mailtrap, open your inbox, and copy the SMTP credentials provided there.

### 3. Setup Frontend

```bash
cd client
npm install
```

## Running the Application

### Start Backend

```bash
cd server
npm run dev
```

The server runs at `http://localhost:5000`.

### Start Frontend

```bash
cd client
npm run dev
```

The frontend runs at `http://localhost:5173`.

### Run Seeder (Dummy User)

Before logging in, run the seeder to create a dummy user:

```bash
cd server
npm run seed
```

Dummy account created:
- **Username:** `admin`
- **Password:** `password123`

## API Endpoints

| Method | Endpoint           | Description                     | Auth Required |
|--------|--------------------|---------------------------------|---------------|
| POST   | `/api/auth/login`  | Login, returns JWT token        | No            |
| POST   | `/api/auth/logout` | Logout, records audit log       | Yes           |
| GET    | `/api/events`      | Get all events                  | Yes           |
| POST   | `/api/events`      | Create new event + send email   | Yes           |
| DELETE | `/api/events/:id`  | Delete an event                 | Yes           |
| GET    | `/api/health`      | Health check                    | No            |

## Project Structure

```
technical-test-lnk/
├── server/
│   ├── src/
│   │   ├── config/          # Database connection
│   │   ├── controllers/     # Request handlers
│   │   ├── middlewares/     # JWT auth middleware
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # Express routes
│   │   ├── schemas/         # Zod validation schemas
│   │   ├── services/        # Email service
│   │   ├── index.ts         # App entry point
│   │   └── seed.ts          # Database seeder
│   ├── .env.example
│   └── tsconfig.json
│
├── client/
│   ├── src/
│   │   ├── api/             # Axios API calls
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── schemas/         # Zod validation schemas
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── tsconfig.json
│
├── docs/                    # Project documentation
└── README.md
```
