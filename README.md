# LearnMate 2.0 🎓 - Enterprise Edition

**LearnMate** is an AI-powered personalized learning platform that helps users achieve their career goals through custom roadmaps, gamification, and career guidance.

---

## 🚀 Features

*   **AI-Generated Roadmaps**: Personalized learning paths based on skills and goals (Powered by Python AI Service).
*   **Gamification**: Earn XP, level up, maintain streaks, and buy items with virtual currency.
*   **Career Guidance**: AI-driven career recommendations based on user performance.
*   **Enterprise Security**:
    *   **OAuth 2.0**: Sign in securely with Google and GitHub.
    *   **Zero-Trust AI**: Python service protected by strong API Key authentication.
    *   **Email Verification**: SMTP integration for user validity.

---

## 🛠️ Tech Stack

*   **Frontend**: React, Tailwind CSS, Zustand, Vite.
*   **Backend**: Node.js, Express, MongoDB, Passport.js (OAuth).
*   **AI Service**: Python (Flask), NumPy, Pandas.
*   **DevOps**: GitHub Actions (CI), Concurrently (Unified Start).

---

## ⚡ Quick Start

### Prerequisites
*   Node.js (v18+)
*   Python (v3.8+)
*   MongoDB (Local or Atlas)

### 1. Installation
```bash
# Install Root Dependencies
npm install

# Install Backend Dependencies
cd learnmate-backend
npm install

# Install Frontend Dependencies
cd ../learnmate-frontend
npm install

# Install AI Service Dependencies
cd ../AI-Model
pip install -r requirements.txt
```

### 2. Configuration (`.env`)

You must configure the environment variables for the system to work securely.

**Backend (`learnmate-backend/.env`)**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/learnmate
JWT_SECRET=your_secret
AI_SERVICE_URL=http://localhost:5001
AI_API_KEY=your_secure_ai_key  # Must match AI-Model .env

# OAuth Credentials (Get from Google/GitHub Developer Consoles)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_USER=...
SMTP_PASS=...
```

**AI Service (`AI-Model/.env`)**
```env
PORT=5001
AI_API_KEY=your_secure_ai_key  # Must match Backend .env
```

### 3. Run the App
From the **root** directory:
```bash
npm start
```
This command concurrently launches:
*   Backend (Port 5000)
*   Frontend (Port 3000)
*   AI Service (Port 5001)

---

## 🔒 Security Notes

*   **API Protection**: The AI Service now rejects any request without the correct `X-API-Key` header.
*   **OAuth**: Social logins require valid client IDs in the backend `.env`. If missing, the frontend will show an error or fail gracefully.
*   **Networking**: The system is designed to be container-friendly. Use `AI_SERVICE_URL` to point to a Docker container or remote IP if needed.

---

## 🧪 Testing

Run the automated test suite:
```bash
# Backend Tests
cd learnmate-backend
npm test

# Frontend Tests
cd learnmate-frontend
npm test
```

---

**Developed by Antigravity Team**
