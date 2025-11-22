# Backend: Task Tracker API

Node.js/Express API with MongoDB & JWT.

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and fill in MONGO_URI (use MongoDB Atlas free tier)
3. `npm run dev`

## API Endpoints
- POST `/api/auth/signup` - Create user
- POST `/api/auth/login` - Login
- GET/POST `/api/tasks` - List/create tasks (auth required)
- PUT/DELETE `/api/tasks/:id` - Update/delete
- PATCH `/api/tasks/:id/complete` - Toggle complete

Swagger docs: http://localhost:5000/api-docs