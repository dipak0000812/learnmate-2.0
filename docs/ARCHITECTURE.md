# LearnMate Architecture

## System Overview

LearnMate is a multi-service web application consisting of three main components:

```
┌─────────────────────────────────────────────────────────────────┐
│                         User (Browser)                          │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    learnmate-frontend                           │
│                    (React 18 + Vite)                            │
│                    Port: 3000                                   │
└─────────────────────────────┬───────────────────────────────────┘
                              │ HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    learnmate-backend                            │
│                    (Node.js + Express)                          │
│                    Port: 5000                                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │   Auth     │  │  Roadmap   │  │ Gamification│                │
│  │  Module    │  │  Module    │  │   Module   │                 │
│  └────────────┘  └────────────┘  └────────────┘                │
└──────────┬─────────────────────────────┬────────────────────────┘
           │                             │
           │ MongoDB                     │ HTTP + API Key
           ▼                             ▼
┌─────────────────────┐    ┌─────────────────────────────────────┐
│   MongoDB Atlas     │    │           AI-Model                  │
│   (Database)        │    │       (Python + Flask)              │
│                     │    │       Port: 5001                    │
│                     │    │  ┌─────────────┐  ┌─────────────┐  │
│                     │    │  │Quiz Evaluator│  │Roadmap Gen  │  │
│                     │    │  └─────────────┘  └─────────────┘  │
│                     │    │         │                           │
└─────────────────────┘    │         ▼ Gemini API               │
                           │  ┌─────────────────────┐           │
                           │  │   Google Gemini     │           │
                           │  │   (LLM Provider)    │           │
                           │  └─────────────────────┘           │
                           └─────────────────────────────────────┘
```

## Service Descriptions

### Frontend (`learnmate-frontend/`)
- **Technology**: React 18, Vite, TailwindCSS
- **State Management**: Zustand
- **Responsibilities**:
  - User interface
  - Authentication flow
  - Dashboard and visualization
  - API consumption

### Backend (`learnmate-backend/`)
- **Technology**: Node.js, Express.js, Mongoose
- **Responsibilities**:
  - REST API endpoints
  - Authentication (JWT + OAuth)
  - Business logic
  - Database operations
  - AI service proxy

### AI Service (`AI-Model/`)
- **Technology**: Python, Flask, Google Gemini
- **Responsibilities**:
  - Quiz evaluation
  - Learning roadmap generation
  - Career recommendations
  - NLP-based answer analysis

## Authentication Flow

```
User → Frontend → Backend → JWT Generated
                     ↓
              MongoDB (User stored)
                     ↓
              Token returned to Frontend
                     ↓
              Stored in localStorage + httpOnly cookie (refresh)
```

## Data Flow

1. User completes onboarding
2. Assessment submitted to backend
3. Backend proxies to AI service
4. AI generates personalized roadmap
5. Roadmap stored in MongoDB
6. Frontend displays progress

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Separate AI service | Isolation of Python ML stack from Node.js |
| API key auth for AI | Internal service, no user context needed |
| MongoDB | Flexible schema for learning content |
| Zustand over Redux | Simpler state management for project scope |

## Directory Structure

```
learnmate/
├── AI-Model/           # Python Flask AI service
├── learnmate-backend/  # Node.js Express API
├── learnmate-frontend/ # React SPA
├── docs/               # Documentation
├── scripts/            # Build and utility scripts
└── .github/            # CI/CD and templates
```

---

*Last Updated: 2026-01-22*
