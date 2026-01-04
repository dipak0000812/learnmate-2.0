 # LearnMate 2.0 🎓

> Enterprise-grade AI-powered personalized learning platform that helps users achieve their career goals through custom roadmaps, gamification, and intelligent career guidance.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Python Version](https://img.shields.io/badge/python-%3E%3D3.8-blue)](https://www.python.org/)

---

## 🌟 Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI-Generated Roadmaps** | Personalized learning paths powered by machine learning algorithms |
| 🎮 **Gamification System** | Earn XP, level up, maintain streaks, and unlock achievements |
| 🎯 **Career Guidance** | AI-driven career recommendations based on your performance |
| 🔐 **Enterprise Security** | OAuth 2.0, JWT authentication, and email verification |
| 📊 **Progress Analytics** | Track your learning journey with detailed insights |
| 🏆 **Leaderboards** | Compete with peers and stay motivated |

---

## 🏗️ Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Frontend  │◄────►│   Backend   │◄────►│ AI Service  │
│   (React)   │      │  (Express)  │      │   (Flask)   │
│   Port 3000 │      │  Port 5000  │      │  Port 5001  │
└─────────────┘      └──────┬──────┘      └─────────────┘
                             │
                             ▼
                      ┌─────────────┐
                      │   MongoDB   │
                      │  Database   │
                      └─────────────┘
```

---

## 💻 Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS
- Zustand (State Management)
- React Router

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- Passport.js (OAuth 2.0)
- JWT Authentication
- Nodemailer (SMTP)

**AI Service**
- Python 3.8+ + Flask
- NumPy + Pandas
- Machine Learning Algorithms

**DevOps**
- GitHub Actions (CI/CD)
- Concurrently (Development)

---

## 📋 Prerequisites

Before you begin, ensure you have installed:

- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [Python](https://www.python.org/) (v3.8.0 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (v5.0 or higher) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Git](https://git-scm.com/)

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/learnmate.git
cd learnmate
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd learnmate-backend && npm install && cd ..

# Install frontend dependencies
cd learnmate-frontend && npm install && cd ..

# Install AI service dependencies
cd AI-Model && pip install -r requirements.txt && cd ..
```

### 3. Configure Environment Variables

#### Backend Configuration
Create `learnmate-backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/learnmate

# Authentication
JWT_SECRET=your_secure_jwt_secret_min_32_chars
JWT_EXPIRES_IN=7d

# AI Service
AI_SERVICE_URL=http://localhost:5001
AI_API_KEY=your_secure_ai_api_key_min_32_chars

# OAuth - Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

# OAuth - GitHub
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/auth/github/callback

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# CORS
FRONTEND_URL=http://localhost:3000
```

#### AI Service Configuration
Create `AI-Model/.env`:

```env
PORT=5001
FLASK_ENV=development
AI_API_KEY=your_secure_ai_api_key_min_32_chars
```

> **Note:** The `AI_API_KEY` must match in both `.env` files.

### 4. Get OAuth Credentials

<details>
<summary><b>Google OAuth Setup</b></summary>

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Navigate to **APIs & Services → Credentials**
4. Create **OAuth 2.0 Client ID**
5. Add redirect URI: `http://localhost:5000/auth/google/callback`
6. Copy Client ID and Secret to `.env`

</details>

<details>
<summary><b>GitHub OAuth Setup</b></summary>

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Set callback URL: `http://localhost:5000/auth/github/callback`
4. Copy Client ID and Secret to `.env`

</details>

<details>
<summary><b>Gmail SMTP Setup</b></summary>

1. Enable 2-Factor Authentication on your Google account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password for "Mail"
4. Use this password in `SMTP_PASS`

</details>

### 5. Run the Application

```bash
npm start
```

This will start all services concurrently:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **AI Service**: http://localhost:5001

---

## 🧪 Testing

```bash
# Backend tests
cd learnmate-backend && npm test

# Frontend tests
cd learnmate-frontend && npm test

# AI service tests
cd AI-Model && pytest
```

---

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login with credentials |
| GET | `/auth/google` | Google OAuth login |
| GET | `/auth/github` | GitHub OAuth login |
| POST | `/auth/logout` | Logout user |

### Roadmaps
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/roadmaps` | Get all user roadmaps |
| POST | `/api/roadmaps` | Generate new AI roadmap |
| GET | `/api/roadmaps/:id` | Get specific roadmap |
| PUT | `/api/roadmaps/:id` | Update roadmap progress |
| DELETE | `/api/roadmaps/:id` | Delete roadmap |

### Gamification
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/gamification/stats` | Get user XP, level, streaks |
| POST | `/api/gamification/xp` | Award XP for completion |
| GET | `/api/gamification/leaderboard` | Get leaderboard |

### AI Service (Internal - Requires `X-API-Key` header)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate-roadmap` | Generate personalized roadmap |
| POST | `/api/recommend-career` | Get career recommendations |
| POST | `/api/analyze-progress` | Analyze user performance |

---

## 🔒 Security Features

✅ **OAuth 2.0** - Secure social authentication  
✅ **JWT Tokens** - Stateless session management  
✅ **API Key Protection** - Secured internal services  
✅ **Email Verification** - SMTP-based validation  
✅ **Password Hashing** - bcrypt encryption  
✅ **CORS Protection** - Controlled origins  
✅ **Rate Limiting** - DDoS prevention  
✅ **Input Validation** - SQL injection protection  

> **Important:** Never commit `.env` files. Use strong secrets (32+ characters) in production.

---

## 🚢 Deployment

### Docker

```bash
docker-compose up -d
```

### Cloud Platforms

| Service | Recommended Platform |
|---------|---------------------|
| Frontend | Vercel, Netlify, AWS S3 |
| Backend | Heroku, AWS ECS, Google Cloud Run |
| Database | MongoDB Atlas, AWS DocumentDB |
| AI Service | AWS Lambda, Google Cloud Functions |

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Run `npm run lint` before committing

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

**LearnMate Development Team**

Built with ❤️ for learners worldwide

---

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/learnmate/issues)
- 📧 **Email**: support@learnmate.com
- 📖 **Documentation**: [Wiki](https://github.com/yourusername/learnmate/wiki)

---

## 🙏 Acknowledgments

- Thanks to all contributors who helped shape LearnMate
- Built with amazing open-source technologies
- Inspired by modern learning platforms and educational best practices

---

<div align="center">

**⭐ Star us on GitHub — it motivates us a lot!**

Made with passion for education and technology 🚀

[⬆ Back to Top](#learnmate-20-)

</div>
