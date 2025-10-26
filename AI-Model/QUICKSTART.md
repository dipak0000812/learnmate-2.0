# 🚀 LearnMate AI - Quick Start Guide

Get up and running in 5 minutes!

---

## ⚡ Super Quick Setup (Copy-Paste)

```bash
# 1. Create project directory
mkdir learnmate-ai && cd learnmate-ai

# 2. Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Create requirements.txt
cat > requirements.txt << 'EOF'
Flask==3.0.0
flask-cors==4.0.0
scikit-learn==1.3.2
numpy==1.26.2
pandas==2.1.4
joblib==1.3.2
gunicorn==21.2.0
python-dotenv==1.0.0
EOF

# 4. Install dependencies
pip install -r requirements.txt

# 5. Create directory structure
mkdir -p models/saved data tests
touch models/__init__.py tests/__init__.py
```

Now copy all the Python files from the artifacts provided into their respective locations:
- `app.py` → root directory
- `models/quiz_evaluator.py`
- `models/roadmap_generator.py`
- `models/career_recommender.py`
- `train_models.py` → root directory
- `utils.py` → root directory
- `tests/test_api.py`

```bash
# 6. Train models
python train_models.py

# 7. Start server
python app.py
```

**Done! 🎉** API is running at `http://localhost:5000`

---

## 📝 File Checklist

Make sure you have these files:

```
learnmate-ai/
├── app.py                          ✓ Main Flask application
├── train_models.py                 ✓ Model training
├── utils.py                        ✓ Utilities
├── requirements.txt                ✓ Dependencies
├── models/
│   ├── __init__.py                 ✓ Package marker
│   ├── quiz_evaluator.py           ✓ Quiz evaluation
│   ├── roadmap_generator.py        ✓ Roadmap generation
│   └── career_recommender.py       ✓ Career recommendation
├── tests/
│   ├── __init__.py                 ✓ Package marker
│   └── test_api.py                 ✓ API tests
└── data/                           ✓ (auto-created during training)
```

---

## 🧪 Quick Test

In a new terminal (while server is running):

```bash
# Test 1: Health check
curl http://localhost:5000/health

# Test 2: Career recommendation
curl -X POST http://localhost:5000/ai/recommend-career \
  -H "Content-Type: application/json" \
  -d '{
    "scores": {"AI": 85, "Programming": 90, "Math": 80},
    "interests": ["AI", "ML"],
    "skills": ["Python"],
    "semester": 4
  }'

# Test 3: Run all tests
python tests/test_api.py
```

---

## 🔗 Integration with Node.js Backend

### Step 1: Install Axios

```bash
npm install axios
```

### Step 2: Create AI Service (services/aiService.js)

```javascript
const axios = require('axios');

const AI_API_URL = process.env.AI_API_URL || 'http://localhost:5000';

class AIService {
  async evaluateQuiz(data) {
    const response = await axios.post(`${AI_API_URL}/ai/evaluate-quiz`, data);
    return response.data;
  }

  async generateRoadmap(data) {
    const response = await axios.post(`${AI_API_URL}/ai/generate-roadmap`, data);
    return response.data;
  }

  async recommendCareer(data) {
    const response = await axios.post(`${AI_API_URL}/ai/recommend-career`, data);
    return response.data;
  }
}

module.exports = new AIService();
```

### Step 3: Use in Routes

```javascript
const aiService = require('../services/aiService');

// In your assessment route
router.post('/submit-quiz', async (req, res) => {
  try {
    const evaluation = await aiService.evaluateQuiz(req.body);
    
    // Save to MongoDB
    const assessment = new Assessment({
      userId: req.user.id,
      ...evaluation.data
    });
    await assessment.save();
    
    res.json({ status: 'success', data: assessment });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
});
```

---

## 🚀 Deploy to Render

### Option 1: Auto Deploy

1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Render auto-detects settings from `render.yaml`
6. Click "Create Web Service"

### Option 2: Manual Deploy

1. Create `render.yaml` in project root:

```yaml
services:
  - type: web
    name: learnmate-ai
    env: python
    buildCommand: pip install -r requirements.txt && python train_models.py
    startCommand: gunicorn -w 4 -b 0.0.0.0:$PORT app:app
```

2. Push to GitHub and connect to Render

**Your API will be live at:** `https://learnmate-ai.onrender.com`

---

## 💡 Common Commands

```bash
# Activate virtual environment
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Install new package
pip install package-name
pip freeze > requirements.txt

# Train models
python train_models.py

# Start development server
python app.py

# Start production server
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Run tests
python tests/test_api.py

# View logs
tail -f learnmate_ai.log

# Check Python version
python --version

# Deactivate virtual environment
deactivate
```

---

## 🐛 Quick Fixes

### Problem: Port 5000 already in use

```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>

# Or use different port
PORT=8000 python app.py
```

### Problem: Module not found

```bash
# Make sure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Problem: Models not trained

```bash
# Train models
python train_models.py

# Verify models exist
ls -la models/saved/
```

### Problem: Low quiz scores for correct answers

Adjust similarity threshold in `models/quiz_evaluator.py`:

```python
def __init__(self, similarity_threshold=0.6):  # Lower = more lenient
```

---

## 📊 Expected Performance

| Metric | Value |
|--------|-------|
| Model Training Time | 30-60 seconds |
| Server Startup Time | 2-5 seconds |
| API Response Time | 50-300ms |
| Model Accuracy | 85-90% |
| Memory Usage | 150-300 MB |

---

## 🎯 API Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check |
| `/ai/evaluate-quiz` | POST | Evaluate quiz answers |
| `/ai/generate-roadmap` | POST | Generate learning roadmap |
| `/ai/recommend-career` | POST | Recommend careers |
| `/ai/batch-analyze` | POST | Complete analysis |

---

## 📚 Example Requests

### 1. Evaluate Quiz

```json
POST /ai/evaluate-quiz

{
  "answers": [
    {"questionId": "q1", "answer": "supervised learning", "type": "subjective"}
  ],
  "correctAnswers": [
    {"questionId": "q1", "answer": "supervised learning", "topic": "ML"}
  ],
  "subject": "Machine Learning"
}
```

### 2. Generate Roadmap

```json
POST /ai/generate-roadmap

{
  "userId": "user123",
  "performance": {"AI": 70, "Programming": 80},
  "semester": 3,
  "interests": ["AI"],
  "timeAvailable": 20
}
```

### 3. Recommend Career

```json
POST /ai/recommend-career

{
  "scores": {"AI": 85, "Programming": 90},
  "interests": ["AI", "ML"],
  "skills": ["Python"],
  "semester": 4
}
```

---

## ✅ Verification Checklist

Before deploying to production:

- [ ] Virtual environment created and activated
- [ ] All dependencies installed
- [ ] Models trained successfully
- [ ] Server starts without errors
- [ ] Health check returns 200 OK
- [ ] All API tests pass
- [ ] Logs are being written
- [ ] Environment variables configured
- [ ] CORS configured for your frontend
- [ ] Production server (Gunicorn) tested

---

## 🆘 Need Help?

1. **Check the logs**: `tail -f learnmate_ai.log`
2. **Run tests**: `python tests/test_api.py`
3. **Verify setup**: Check all files are in place
4. **Read full docs**: See `README.md` for detailed information

---

## 🎉 You're All Set!

Your AI microservice is ready to integrate with the LearnMate backend. 

**Next Steps:**
1. Deploy to Render or your preferred platform
2. Update Node.js backend with AI service URL
3. Test integration end-to-end
4. Monitor logs and performance
5. Scale as needed

Happy coding! 🚀