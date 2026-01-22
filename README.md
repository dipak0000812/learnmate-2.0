# LearnMate 2.0

> AI-assisted personalized learning platform with roadmap generation, gamification, and career guidance.

---

## ⚠️ Project Status: Stabilization Phase

This project is currently in a **stabilization and hardening phase** before archival.

- ✅ Core features complete
- 🔧 Accepting bug fixes and security patches
- ❌ Not accepting new features
- 📦 Will be archived after hardening

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

---

## Overview

LearnMate is a multi-service web application that generates personalized learning roadmaps based on user assessments and career goals. It was developed as an academic project and is being prepared for clean archival.

### Core Functionality

| Feature | Description |
|---------|-------------|
| **Roadmap Generation** | AI-generated learning paths based on assessments |
| **Gamification** | XP, levels, streaks, and achievements |
| **Career Guidance** | Recommendations based on performance |
| **Authentication** | OAuth 2.0 (Google, GitHub) + JWT |

---

## Architecture

```
Frontend (React)  ─────►  Backend (Express)  ─────►  AI Service (Flask)
    :3000                     :5000                      :5001
                                │
                                ▼
                           MongoDB
```

For detailed architecture, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, Vite, TailwindCSS, Zustand |
| Backend | Node.js, Express, MongoDB, Passport.js |
| AI Service | Python, Flask, Google Gemini API |

---

## Getting Started

### Prerequisites

- Node.js v18+
- Python 3.9+
- MongoDB (local or Atlas)

### Setup

```bash
# Clone
git clone https://github.com/dipak0000812/learnmate-2.0.git
cd learnmate-2.0

# Backend
cd learnmate-backend
cp .env.example .env  # Configure your secrets
npm install

# Frontend
cd ../learnmate-frontend
cp .env.example .env
npm install

# AI Service
cd ../AI-Model
cp .env.example .env  # Add Gemini API key
pip install -r requirements.txt
```

### Run

```bash
# Terminal 1: Backend
cd learnmate-backend && npm run dev

# Terminal 2: Frontend
cd learnmate-frontend && npm start

# Terminal 3: AI Service
cd AI-Model && python app.py
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Deployment guide |
| [SECURITY.md](docs/SECURITY.md) | Security practices |
| [SECRETS.md](docs/SECRETS.md) | Secrets management |

---

## Contributing

This project follows a **maintainer-led model**. See:

- [CONTRIBUTING.md](CONTRIBUTING.md) — How to contribute
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) — Community standards
- [MAINTAINERS.md](MAINTAINERS.md) — Project governance

---

## License

MIT License — see [LICENSE](LICENSE)

---

## Maintainer

**Dipak Dhangar** — Final decision authority

---

*This is an academic project undergoing stabilization. It is not production-ready.*
