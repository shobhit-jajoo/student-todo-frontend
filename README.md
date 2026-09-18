# Student Task Management Application

A clean full-stack task management application for students to manage academic and personal tasks with authentication, dashboard analytics, search, filters, and task tracking.

## Features

- User registration and login with JWT authentication
- Protected task routes with user ownership enforcement
- Create, view, edit, delete, complete, and uncomplete tasks
- Task filters by status, priority, category, and search
- Sorting by newest, oldest, due date, priority, and completed state
- Dashboard statistics with completion progress
- Responsive modern student-focused UI
- Prisma + PostgreSQL task persistence
- Form validation and user-friendly error handling

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- React Router
- Axios
- CSS modules / plain CSS

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- JWT authentication
- bcryptjs password hashing

### Database
- PostgreSQL

### Authentication
- JWT tokens stored in the browser and sent via Authorization header

## Architecture

React frontend
       |
       | REST API / Axios
       ↓
Express backend
       |
       | Prisma
       ↓
PostgreSQL

The frontend is responsible for rendering pages, state management, and user interaction. The API layer handles incoming requests, the controllers coordinate request flow, services contain business logic, and Prisma interacts with the PostgreSQL database.

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL 16+

## Installation

```bash
git clone <repo-url>
cd student-task-manager
npm install
```

### Frontend setup

```bash
cd frontend
npm install
```

### Backend setup

```bash
cd backend
npm install
```

## Environment Setup

Copy the example environment file and update the values:

```bash
cp .env.example .env
```

Set the following values in the root `.env` file:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/student_tasks?schema=public"
JWT_SECRET="change-this-secret"
PORT=4000
VITE_API_URL="http://localhost:4000/api"
```

## Database Setup

Start PostgreSQL locally or run the provided Docker Compose service:

```bash
docker-compose up -d postgres
```

Then run:

```bash
cd backend
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

## Running the Application

Run both applications in separate terminals:

Terminal 1:
```bash
cd backend
npm run dev
```

Terminal 2:
```bash
cd frontend
npm run dev
```

The frontend will typically run on http://localhost:5173 and the backend on http://localhost:4000.

## API Documentation

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Check API status |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login and get JWT |
| GET | /api/auth/me | Get current user |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Get tasks with filters and search |
| GET | /api/tasks/:id | Get a single task |
| POST | /api/tasks | Create a task |
| PUT | /api/tasks/:id | Update a task |
| DELETE | /api/tasks/:id | Delete a task |
| PATCH | /api/tasks/:id/toggle | Toggle task completion |

## Database Schema

The application uses two main Prisma models:

- User: stores identity data such as name, email, passwordHash, and timestamps
- Task: stores task information including title, description, priority, dueDate, category, completion status, and relationship to the owning user

Each task belongs to exactly one user, and a user can have many tasks.

## Testing

Basic checks can be run with:

```bash
cd backend
npm run test
```

Manual testing should include registration, login, task creation, edits, toggles, deletion, filtering, and dashboard interactions.

## Deployment

This app can be deployed by hosting the backend on a Node.js server and the frontend as a Vite static build. PostgreSQL should be provisioned as a managed database service and all environment variables should be configured securely in the deployment platform.

## Demo Credentials

Development seed user:

- Name: Demo Student
- Email: student@example.com
- Password: Password123!

> This account is for development purposes only.

## Remaining Notes

This project is intentionally lightweight and easy to understand for academic demonstration and local development.
