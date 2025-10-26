# 🚀 LearnMate – Backend (Node.js + Express + MongoDB)

## Environment
- Create a `.env` in `learnmate-backend/` with:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/learnmate
JWT_SECRET=supersecret
CORS_ORIGINS=http://localhost:3000
RATE_WINDOW_MS=900000
RATE_MAX=100
MONGO_MAX_POOL=10
```

## Install & Run
```
npm install
npm run dev
# production
npm start
```

Seed sample data
```
npm run seed
```

Security
- Uses helmet, cors, rate limiting, JWT auth, input validation (express-validator)

## API Endpoints (v1)
- Auth
  - POST `/api/auth/register`
  - POST `/api/auth/login`
  - GET  `/api/auth/me`
- Users
  - GET  `/api/users/me`
  - PUT  `/api/users/me`
- Questions
  - GET  `/api/questions?career=..&semester=..`
  - POST `/api/questions` (admin)
  - GET  `/api/questions/:id`
  - PUT  `/api/questions/:id` (admin)
  - DELETE `/api/questions/:id` (admin)
- Assessments
  - POST `/api/assessments/submit` (answers, timeTaken)
- Roadmaps
  - POST `/api/roadmaps/generate` (dreamCareer, assessmentId?)
  - GET  `/api/roadmaps/:id`
  - GET  `/api/roadmaps/user/:userId`
  - PUT  `/api/roadmaps/:id/goals/:goalId/complete`
- Gamification
  - GET  `/api/gamification/:userId`

AI Stub
- `utils/aiRoadmapGenerator.js` with contract: input {userProfile, assessmentSummary, dreamCareer} → milestones array.

Figma UI Reference
- LearnMate Web App UI: https://www.figma.com/make/gvztHyRqdqzJuZH4OuPbkB/LearnMate-Web-App-UI-Design?t=exTwAlbEd1zTbbR8-0
## 🧠 Overview
**LearnMate** is an AI-powered web platform that helps students plan and achieve their dream careers through **personalized learning roadmaps**, **skill tracking**, and **gamified learning experiences**.  
This repository contains the **production-ready backend** built using **Node.js**, **Express**, and **MongoDB**.

---

## ⚙️ Tech Stack
| Layer | Technology |
|:------|:------------|
| Backend Framework | **Node.js (Express.js)** |
| Database | **MongoDB (Mongoose ORM)** |
| Authentication | **JWT (JSON Web Tokens)** |
| Security | **bcrypt, dotenv, cors** |
| Dev Tools | **Nodemon, Postman, GitHub** |
| Deployment Ready | ✅ |

---

## 🧩 Folder Structure
learnmate-backend/
│
├── app.js # Main server file
├── package.json # Dependencies & scripts
├── .env # Environment variables (not committed)
│
├── config/
│ └── db.js # MongoDB connection setup
│
├── controllers/ # Logic for each route
├── models/ # Database schemas
├── routes/ # API endpoints
├── middleware/ # Auth & error handling
├── services/ # Business logic (e.g. gamification, AI)
└── utils/ # Helper functions

└── utils/ # Helper functions


---

## 🔐 Environment Variables
Create a `.env` file in the project root:



PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


---

## 🛠️ Installation & Setup

```bash
# 1️⃣ Clone the repository
git clone https://github.com/<your-username>/learnmate-backend.git
cd learnmate-backend

# 2️⃣ Install dependencies
npm install

# 3️⃣ Run the development server
npm run dev

# ✅ Server runs on: http://localhost:5000

📡 API Endpoints
Route	Method	Description
/api/auth/register	POST	Register a new user
/api/auth/login	POST	Login and get JWT token
/api/users/:id	GET	Get user profile
/api/careers	GET	Get AI-based career list
/api/gamification/points	GET	Retrieve user gamification stats

(More endpoints will be added in Phase-II)

## 🧠 Features

✅ User Authentication (JWT)
✅ Secure Password Hashing (bcrypt)
✅ RESTful API Architecture
✅ Environment Variable Configuration
✅ Ready for Deployment

## Deployment (Render / Railway / Fly.io)
1. Set environment variables: `PORT`, `MONGO_URI`, `JWT_SECRET`, `CORS_ORIGINS`, `RATE_*`.
2. Start command: `npm start` (uses `cross-env NODE_ENV=production node app.js`).
3. Health check: `GET /` → `{ status: 'ok', service: 'learnmate-backend' }`.

Notes:
- CORS defaults to allow only localhost if `CORS_ORIGINS` is unset.
- Mongo connection uses graceful shutdown hooks.

## Deployment Guide (Render / Vercel with MongoDB Atlas)

### MongoDB Atlas
- Create an Atlas cluster and get a connection string (e.g. `MONGODB+SRV` URI).
- Add a database user and whitelist IPs (or use 0.0.0.0/0 for testing).

### Render (recommended for Node API)
1. Create a new Web Service, connect to your repo or upload the backend directory.
2. Set Environment:
   - `PORT=10000` (Render sets PORT automatically; you can omit)
   - `MONGO_URI=<your_atlas_uri>`
   - `JWT_SECRET=<random_string>`
   - `CORS_ORIGINS=https://your-frontend-domain`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Verify Health: open the service URL and check `GET /` returns status ok.

### Vercel (serverless note)
- This app is an Express server; Vercel prefers serverless functions. Use the Render approach, or adapt with `vercel.json` and serverless handlers.
- If adapting, ensure long-lived connections (Mongoose) are handled in a singleton per function context.

### Frontend CORS
- Set `CORS_ORIGINS` to the exact frontend origin(s), comma-separated.

### Environment Variables to set
- `PORT` (if your platform requires it)
- `MONGO_URI`
- `JWT_SECRET`
- `CORS_ORIGINS`

👨‍💻 Developers
Name	Role
[Your Name]	Backend Developer
[Teammate Name]	Frontend Developer
[Teammate Name]	ML Engineer
[Teammate Name]	Project Manager
📚 License

This project is licensed under the MIT License — feel free to use and modify it.

🌟 Acknowledgements

R.C. Patel Institute of Technology, Shirpur

Department of Artificial Intelligence & Machine Learning

Open-source Node.js, MongoDB, and Express communities
