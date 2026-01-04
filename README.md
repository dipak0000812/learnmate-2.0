LearnMate 2.0 🎓
AI-Powered Personalized Learning Platform
LearnMate combines artificial intelligence, gamification, and career guidance to help learners achieve their professional goals through customized learning paths.

🌟 Features

AI-Generated Roadmaps: Personalized learning paths powered by machine learning
Gamification: XP, levels, streaks, and virtual currency to boost engagement
Career Guidance: AI-driven recommendations based on performance
Enterprise Security: OAuth 2.0, API key authentication, and email verification


💻 Tech Stack
Frontend: React, Vite, Tailwind CSS, Zustand
Backend: Node.js, Express, MongoDB, Passport.js
AI Service: Python, Flask, NumPy, Pandas
DevOps: GitHub Actions, Concurrently

📦 Prerequisites

Node.js (v18+)
Python (v3.8+)
MongoDB (Local or Atlas)


🚀 Installation
bash# Clone repository
git clone https://github.com/yourusername/learnmate.git
cd learnmate

# Install all dependencies
npm install
cd learnmate-backend && npm install && cd ..
cd learnmate-frontend && npm install && cd ..
cd AI-Model && pip install -r requirements.txt && cd ..

⚙️ Configuration
Backend .env (learnmate-backend/.env)
envPORT=5000
MONGO_URI=mongodb://localhost:27017/learnmate
JWT_SECRET=your_secure_jwt_secret_min_32_chars
AI_SERVICE_URL=http://localhost:5001
AI_API_KEY=your_secure_ai_key_min_32_chars

# OAuth (Get from Google/GitHub Developer Consoles)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
AI Service .env (AI-Model/.env)
envPORT=5001
AI_API_KEY=your_secure_ai_key_min_32_chars  # Must match backend
Getting OAuth Credentials
Google: Console → APIs & Services → Credentials → OAuth 2.0
GitHub: Settings → OAuth Apps → New

🏃 Running the Application
Start All Services
bashnpm start
This launches:

Frontend: http://localhost:3000
Backend: http://localhost:5000
AI Service: http://localhost:5001

Run Individually
bash# Backend
cd learnmate-backend && npm run dev

# Frontend
cd learnmate-frontend && npm run dev

# AI Service
cd AI-Model && python app.py

🧪 Testing
bash# Backend
cd learnmate-backend && npm test

# Frontend
cd learnmate-frontend && npm test

# AI Service
cd AI-Model && pytest
```

---

## 🔒 Security

- **OAuth 2.0**: Secure social login (Google, GitHub)
- **API Keys**: Protected internal service communication
- **JWT**: Stateless authentication
- **Email Verification**: SMTP-based account validation

**Important**: Never commit `.env` files. Use strong secrets (32+ characters) in production.

---

## 📚 API Overview

### Authentication
```
POST /auth/register          - Register user
POST /auth/login             - Login
GET  /auth/google            - Google OAuth
GET  /auth/github            - GitHub OAuth
```

### Core Features
```
GET  /api/roadmaps           - Get roadmaps
POST /api/roadmaps           - Generate roadmap (AI)
GET  /api/gamification/stats - Get XP/levels
POST /api/gamification/xp    - Award XP
AI endpoints require X-API-Key header

🚢 Deployment
Docker
bashdocker-compose up -d
Cloud Options

Frontend: Vercel, Netlify, AWS S3
Backend: Heroku, AWS ECS, Google Cloud Run
Database: MongoDB Atlas


🤝 Contributing

Fork the repository
Create feature branch: git checkout -b feature/name
Commit changes: git commit -m 'Add feature'
Push: git push origin feature/name
Open Pull Request


📄 License
MIT License - see LICENSE file

👥 Authors
Developed by the LearnMate Development Team

📞 Support

Issues: GitHub Issues
Email: support@learnmate.com


