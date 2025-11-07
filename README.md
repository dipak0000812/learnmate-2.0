# 🎓 LearnMate - AI-Powered Personalized Learning Platform

> **Empowering students to plan and achieve their dream careers through intelligent learning roadmaps, skill tracking, and gamified experiences.**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-yellow)](https://www.python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green)](https://www.mongodb.com/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Module Documentation](#-module-documentation)
  - [Frontend](#1-frontend-react)
  - [Backend](#2-backend-nodejs--express)
  - [AI Service](#3-ai-service-python--flask)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [Team](#-team)
- [License](#-license)

---

## 🎯 Overview

**LearnMate** is a comprehensive, production-ready web platform designed to revolutionize personalized education. It combines the power of **AI/ML**, **modern web technologies**, and **gamification** to create adaptive learning experiences tailored to each student's goals, performance, and career aspirations.

### The Problem We Solve

Students often struggle to:
- Create structured learning paths aligned with career goals
- Identify knowledge gaps and weak areas
- Stay motivated through long-term learning journeys
- Get personalized feedback on subjective assessments
- Make informed career decisions based on their skills

### Our Solution

LearnMate provides:
- **AI-Powered Quiz Evaluation** with natural language processing for subjective answers
- **Personalized Learning Roadmaps** that adapt to performance and goals
- **Career Recommendations** based on comprehensive skill analysis
- **Gamification System** with points, badges, and leaderboards
- **Real-time Progress Tracking** across multiple subjects

---

## ✨ Key Features

### 🧠 Intelligent Assessment
- **Multi-format Questions**: MCQ, subjective, and short answer support
- **NLP-Based Evaluation**: TF-IDF + Cosine Similarity for subjective answers
- **Partial Credit Scoring**: Graduated scoring (0-100%) based on answer similarity
- **Topic-wise Analysis**: Performance breakdown by subject areas
- **Actionable Feedback**: Personalized improvement suggestions

### 🗺️ Adaptive Learning Roadmaps
- **Career-Aligned Paths**: Customized based on target career
- **Priority-Based Learning**: Focuses on weak areas while building strengths
- **Time-Optimized Planning**: Considers available study hours
- **Milestone Tracking**: Clear goals with target dates
- **Resource Recommendations**: Curated learning materials

### 💼 Career Guidance
- **10+ Career Paths**: AI Engineer, Data Scientist, Full Stack Developer, etc.
- **Multi-Factor Analysis**: Scores, interests, skills, and academic progress
- **Confidence Scoring**: Transparent probability estimates
- **Match Reasoning**: Detailed explanations for recommendations
- **Industry Insights**: Salary ranges, growth rates, and required skills

### 🎮 Gamification & Engagement
- **Points System**: Earn rewards for completing assessments and milestones
- **Achievement Badges**: Unlock badges for various accomplishments
- **Leaderboards**: Compete with peers (optional)
- **Streak Tracking**: Maintain daily learning habits
- **Progress Visualization**: Interactive charts and graphs

### 🔐 Security & Performance
- **JWT Authentication**: Secure user sessions
- **Rate Limiting**: Protection against API abuse
- **Input Validation**: Comprehensive data sanitization
- **CORS Protection**: Configured for production environments
- **Optimized Performance**: Response times <500ms for most endpoints

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Dashboard   │  │ Assessments  │  │   Roadmaps   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js/Express)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │   Auth   │  │  Users   │  │Questions │  │Roadmaps  │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                  │
│  ┌────────────────────────────────────────────────────┐        │
│  │           MongoDB (User Data, Assessments)          │        │
│  └────────────────────────────────────────────────────┘        │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP/REST (AI Service Calls)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AI SERVICE (Python/Flask)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │Quiz Evaluator│  │   Roadmap    │  │    Career    │         │
│  │    (NLP)     │  │  Generator   │  │ Recommender  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌────────────────────────────────────────────────────┐        │
│  │      ML Models (Random Forest, TF-IDF, etc.)        │        │
│  └────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | UI framework |
| **React Router** | 6.x | Client-side routing |
| **Axios** | 1.x | HTTP client |
| **Chart.js** | 4.x | Data visualization |
| **Tailwind CSS** | 3.x | Styling |
| **React Query** | - | State management |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18.x+ | Runtime environment |
| **Express.js** | 4.x | Web framework |
| **MongoDB** | 6.x | Database |
| **Mongoose** | 7.x | ODM |
| **JWT** | 9.x | Authentication |
| **bcrypt** | 5.x | Password hashing |
| **Express Validator** | 7.x | Input validation |
| **Helmet** | 7.x | Security headers |
| **CORS** | 2.x | Cross-origin requests |

### AI/ML Service
| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.10+ | Runtime |
| **Flask** | 3.x | Web framework |
| **scikit-learn** | 1.x | ML models |
| **NumPy** | 1.x | Numerical computing |
| **Pandas** | 2.x | Data processing |
| **NLTK** | 3.x | NLP processing |
| **Gunicorn** | 21.x | Production server |

### DevOps & Deployment
- **Docker** - Containerization
- **Render/Railway** - Hosting (Backend & AI)
- **Vercel/Netlify** - Frontend hosting
- **MongoDB Atlas** - Cloud database
- **GitHub Actions** - CI/CD

---

## 📁 Project Structure

```
learnmate/
│
├── learnmate-frontend/           # React application
│   ├── public/
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   ├── pages/                # Page components
│   │   ├── services/             # API calls
│   │   ├── contexts/             # React contexts
│   │   ├── utils/                # Helper functions
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── README.md
│
├── learnmate-backend/            # Node.js/Express API
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/              # Route handlers
│   │   ├── authController.js
│   │   ├── assessmentController.js
│   │   ├── roadmapController.js
│   │   └── gamificationController.js
│   ├── models/                   # Mongoose schemas
│   │   ├── User.js
│   │   ├── Question.js
│   │   ├── Assessment.js
│   │   └── Roadmap.js
│   ├── routes/                   # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── questions.js
│   │   ├── assessments.js
│   │   └── roadmaps.js
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   └── errorHandler.js
│   ├── services/
│   │   ├── aiService.js          # AI API integration
│   │   └── gamificationService.js
│   ├── utils/
│   │   └── validators.js
│   ├── app.js                    # Express app
│   ├── package.json
│   └── README.md
│
├── learnmate-ai/                 # Python/Flask AI service
│   ├── models/
│   │   ├── __init__.py
│   │   ├── quiz_evaluator.py    # NLP evaluation
│   │   ├── roadmap_generator.py # Roadmap logic
│   │   ├── career_recommender.py# ML classifier
│   │   └── saved/                # Trained models
│   │       └── career_model.pkl
│   ├── data/
│   │   └── mock_students.csv    # Training data
│   ├── tests/
│   │   └── test_api.py
│   ├── app.py                    # Flask application
│   ├── train_models.py           # Model training
│   ├── utils.py                  # Helper functions
│   ├── requirements.txt
│   └── README.md
│
├── docs/                         # Additional documentation
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
│
└── README.md                     # This file
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18.x or higher) - [Download](https://nodejs.org/)
- **Python** (v3.10 or higher) - [Download](https://www.python.org/)
- **MongoDB** (v6.x or higher) - [Download](https://www.mongodb.com/) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** - Package managers
- **Git** - Version control

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/learnmate.git
cd learnmate
```

#### 2️⃣ Set Up Backend (Node.js)

```bash
cd learnmate-backend

# Install dependencies
npm install

# Create .env file

# Start MongoDB (if running locally)
mongod

# Run development server
npm run dev
```

Backend will run on `http://localhost:5000`

#### 3️⃣ Set Up AI Service (Python)

```bash
cd ../learnmate-ai

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Train ML models
python train_models.py

# Run Flask server
python app.py
```

AI Service will run on `http://localhost:5001`

#### 4️⃣ Set Up Frontend (React)

```bash
cd ../learnmate-frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_AI_API_URL=http://localhost:5001/ai
EOF

# Start development server
npm start
```

Frontend will run on `http://localhost:3000`

### Running the Application

**Option 1: Manual Start (Development)**

Open 3 terminal windows:

```bash
# Terminal 1 - Backend
cd learnmate-backend && npm run dev

# Terminal 2 - AI Service
cd learnmate-ai && source venv/bin/activate && python app.py

# Terminal 3 - Frontend
cd learnmate-frontend && npm start
```

**Option 2: Docker (Coming Soon)**

```bash
docker-compose up
```

---

## 📚 Module Documentation

### 1. Frontend (React)

**Location**: `learnmate-frontend/`

#### Key Features
- Responsive, mobile-first design
- Real-time progress tracking
- Interactive data visualizations
- Smooth animations and transitions

#### Main Components

**Pages**:
- `Dashboard.js` - User overview and statistics
- `Assessment.js` - Quiz taking interface
- `Roadmap.js` - Learning path visualization
- `Career.js` - Career recommendations
- `Profile.js` - User settings

**Components**:
- `QuizCard.js` - Individual quiz display
- `ProgressBar.js` - Progress visualization
- `BadgeDisplay.js` - Achievement badges
- `Leaderboard.js` - Competition rankings

#### State Management
Uses React Context API for:
- User authentication state
- Theme preferences
- Global notifications

#### Styling
- **Tailwind CSS** for utility-first styling
- Custom CSS for animations
- Responsive breakpoints for mobile/tablet/desktop

#### Scripts

```bash
npm start          # Development server (port 3000)
npm run build      # Production build
npm test           # Run tests
npm run eject      # Eject from CRA (irreversible)
```

---

### 2. Backend (Node.js + Express)

**Location**: `learnmate-backend/`

#### Key Features
- RESTful API architecture
- JWT-based authentication
- MongoDB integration with Mongoose
- Comprehensive input validation
- Rate limiting and security headers

#### API Routes

**Authentication** (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /me` - Get current user

**Users** (`/api/users`)
- `GET /me` - Get user profile
- `PUT /me` - Update user profile

**Questions** (`/api/questions`)
- `GET /` - Get questions (filtered by career/semester)
- `POST /` - Create question (admin)
- `GET /:id` - Get single question
- `PUT /:id` - Update question (admin)
- `DELETE /:id` - Delete question (admin)

**Assessments** (`/api/assessments`)
- `POST /submit` - Submit quiz answers

**Roadmaps** (`/api/roadmaps`)
- `POST /generate` - Generate personalized roadmap
- `GET /:id` - Get roadmap by ID
- `GET /user/:userId` - Get user roadmaps
- `PUT /:id/goals/:goalId/complete` - Mark goal complete

**Gamification** (`/api/gamification`)
- `GET /:userId` - Get user points and badges

#### Database Models

**User Schema**:
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  semester: Number,
  dreamCareer: String,
  interests: [String],
  skills: [String],
  createdAt: Date
}
```

**Assessment Schema**:
```javascript
{
  userId: ObjectId,
  subject: String,
  score: Number,
  total: Number,
  percentage: Number,
  answers: [Object],
  feedback: [String],
  topicPerformance: Object,
  createdAt: Date
}
```

#### Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/learnmate
JWT_SECRET=your_secret_key
CORS_ORIGINS=http://localhost:3000
RATE_WINDOW_MS=900000
RATE_MAX=100
AI_API_URL=http://localhost:5001
```

#### Scripts

```bash
npm run dev        # Development with nodemon
npm start          # Production server
npm run seed       # Seed sample data
npm test           # Run tests
```

---

### 3. AI Service (Python + Flask)

**Location**: `learnmate-ai/`

#### Key Features
- **Quiz Evaluation**: NLP-powered subjective answer grading
- **Roadmap Generation**: Personalized learning paths
- **Career Recommendation**: ML-based career matching
- **High Accuracy**: 85-90% accuracy on career predictions

#### API Endpoints

**Health Check**
```http
GET /health
Response: { "status": "success", "models_loaded": true }
```

**Quiz Evaluation**
```http
POST /ai/evaluate-quiz
Body: {
  "answers": [...],
  "correctAnswers": [...],
  "subject": "Machine Learning"
}
Response: { score, feedback, topicPerformance, suggestions }
```

**Roadmap Generation**
```http
POST /ai/generate-roadmap
Body: {
  "userId": "user123",
  "performance": { "AI": 65, "Math": 85 },
  "semester": 3,
  "targetCareer": "AI Engineer"
}
Response: { roadmap, studyRecommendations, statistics }
```

**Career Recommendation**
```http
POST /ai/recommend-career
Body: {
  "scores": { "AI": 82, "Programming": 90 },
  "interests": ["AI", "Research"],
  "skills": ["Python", "ML"],
  "semester": 4
}
Response: { recommendations, careerAdvice, readiness }
```

#### ML Models

**Career Recommender**:
- Algorithm: Random Forest Classifier
- Training Size: 2000 synthetic student records
- Features: 13 (scores, interests, skills, semester)
- Accuracy: 85-90%
- Classes: 10 career paths

**Quiz Evaluator**:
- Algorithm: TF-IDF + Cosine Similarity
- Partial Credit: 70-100% similarity = full credit
- 40-70% similarity = partial credit
- <40% similarity = incorrect

#### Scripts

```bash
python train_models.py    # Train ML models
python app.py             # Run Flask server
python tests/test_api.py  # Test all endpoints
```

---

## 🔌 API Documentation

### Base URLs

- **Development**:
  - Frontend: `http://localhost:3000`
  - Backend: `http://localhost:5000/api`
  - AI Service: `http://localhost:5001/ai`

- **Production**:
  - Frontend: `https://learnmate.vercel.app`
  - Backend: `https://learnmate-api.onrender.com/api`
  - AI Service: `https://learnmate-ai.onrender.com/ai`

### Authentication

All protected routes require JWT token in header:

```http
Authorization: Bearer <your_jwt_token>
```

### Response Format

**Success**:
```json
{
  "status": "success",
  "data": { ... }
}
```

**Error**:
```json
{
  "status": "fail",
  "message": "Error description"
}
```

### Complete API Reference

For detailed API documentation with request/response examples, see:
- Backend API: [Backend README](learnmate-backend/README.md)
- AI Service API: [AI README](learnmate-ai/README.md)

---

## 🚀 Deployment

### Prerequisites for Production

- **MongoDB Atlas** account (free tier available)
- **Render** or **Railway** account (for backend & AI)
- **Vercel** or **Netlify** account (for frontend)
- Environment variables configured

### Step-by-Step Deployment

#### 1. Deploy Backend (Render)

```bash
# 1. Push code to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Create new Web Service on Render
# - Connect GitHub repository
# - Root directory: learnmate-backend
# - Build command: npm install
# - Start command: npm start

# 3. Set environment variables in Render dashboard:
PORT=10000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/learnmate
JWT_SECRET=your_production_secret
CORS_ORIGINS=https://your-frontend-domain.vercel.app
AI_API_URL=https://your-ai-service.onrender.com
```

#### 2. Deploy AI Service (Render)

```bash
# Create another Web Service
# - Root directory: learnmate-ai
# - Build command: pip install -r requirements.txt && python train_models.py
# - Start command: gunicorn -w 4 -b 0.0.0.0:$PORT app:app

# Set environment variables:
PYTHON_VERSION=3.10.0
```

#### 3. Deploy Frontend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd learnmate-frontend
vercel

# Set environment variables in Vercel dashboard:
REACT_APP_API_URL=https://your-backend.onrender.com/api
REACT_APP_AI_API_URL=https://your-ai-service.onrender.com/ai
```

### Docker Deployment (Alternative)

```dockerfile
# Coming soon: docker-compose.yml for full stack deployment
```

---

## 🧪 Testing

### Backend Tests

```bash
cd learnmate-backend
npm test
```

### AI Service Tests

```bash
cd learnmate-ai
python tests/test_api.py
```

### Frontend Tests

```bash
cd learnmate-frontend
npm test
```

### Manual Testing

Use the provided Postman collection:
- Import `docs/LearnMate.postman_collection.json`
- Set environment variables
- Run test scenarios

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Standards

- **JavaScript**: Follow Airbnb style guide
- **Python**: Follow PEP 8
- **Commits**: Use conventional commit messages
- **Testing**: Write tests for new features
- **Documentation**: Update README for significant changes

---

## 👥 Team

| Name | Role | GitHub |
|------|------|--------|
| Dipak Dhangar | Full Stack Developer | 
| Bhushan Patil | Backend Developer | 
| Prachi Pingale | ML model developer
| Aakanksha Borse | Frontend Developer 

**Institution**: R.C. Patel Institute of Technology, Shirpur  
**Department**: Artificial Intelligence & Machine Learning

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **R.C. Patel Institute of Technology** for supporting this project
- **Open-source communities** for amazing tools and libraries
- **Students worldwide** who inspired this platform

---

## 📞 Support & Contact

- **Documentation**: [docs.learnmate.ai](https://docs.learnmate.ai)
- **Email**: support@learnmate.ai
- **Issues**: [GitHub Issues](https://github.com/your-username/learnmate/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/learnmate/discussions)

---

## 🎉 What's Next?

### Upcoming Features
- [ ] Mobile app (React Native)
- [ ] Video learning integration
- [ ] Peer-to-peer study groups
- [ ] Live doubt-solving sessions
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

---

**Built with ❤️ by the LearnMate Team**

*Last Updated: November 2024*
