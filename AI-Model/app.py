from flask import Flask, request, jsonify
from flask_cors import CORS
from flask.json.provider import DefaultJSONProvider
import logging
from datetime import datetime
import os
import numpy as np
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from models.quiz_evaluator import QuizEvaluator
from models.roadmap_generator import RoadmapGenerator
from models.career_recommender import CareerRecommender


# Custom JSON provider for NumPy types
class NumpyJSONProvider(DefaultJSONProvider):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, (np.bool_, bool)):
            return bool(obj)
        return super().default(obj)


# Initialize Flask app
app = Flask(__name__)
app.json_provider_class = NumpyJSONProvider
app.json = app.json_provider_class(app)
CORS(app)


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('learnmate_ai.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Security Middleware
@app.before_request
def require_api_key():
    # Allow health check without key
    if request.endpoint == 'health_check':
        return
    
    api_key = os.getenv('AI_API_KEY')
    if not api_key:
        logger.critical("SECURITY ALERT: AI_API_KEY not set! Rejecting all requests.")
        return jsonify({
            "status": "fail",
            "message": "Server Configuration Error: Missing API Key"
        }), 500

    auth_header = request.headers.get('X-API-Key')
    if not auth_header or auth_header != api_key:
        logger.warning(f"Unauthorized access attempt from {request.remote_addr}")
        return jsonify({
            "status": "fail",
            "message": "Unauthorized"
        }), 401

# Rate Limiting Logic (In-Memory)
import time
from functools import wraps

class RateLimiter:
    def __init__(self, limit=60, window=60):
        self.limit = limit
        self.window = window
        self.requests = {}

    def is_allowed(self, ip):
        current = time.time()
        # Clean old requests
        self.requests = {k: v for k, v in self.requests.items() if current - v['start'] < self.window}
        
        if ip not in self.requests:
            self.requests[ip] = {'count': 1, 'start': current}
            return True
        
        if self.requests[ip]['count'] < self.limit:
            self.requests[ip]['count'] += 1
            return True
        
        # Reset if window passed (handled by cleanup logic mostly, but explicit check)
        if current - self.requests[ip]['start'] > self.window:
             self.requests[ip] = {'count': 1, 'start': current}
             return True
             
        return False

limiter_instance = RateLimiter(limit=60, window=60) # 60 req/min/IP

def limit_rate(f):
    @wraps(f)
    def wrapped(*args, **kwargs):
        # Allow localhost bypass if needed, but safer to enforce global
        if not limiter_instance.is_allowed(request.remote_addr):
            logger.warning(f"Rate limit exceeded for {request.remote_addr}")
            return jsonify({
                "status": "fail",
                "message": "Too many requests. Please try again later."
            }), 429
        return f(*args, **kwargs)
    return wrapped

def validate_payload_size(data, max_keys=20, max_str_len=5000):
    """Defense against massive payloads causing DoS"""
    if len(str(data)) > 50000: # Rough total size bytes
        return False, "Payload too large"
    if isinstance(data, dict):
        if len(data) > max_keys:
             return False, "Too many fields"
        for k, v in data.items():
            if isinstance(v, str) and len(v) > max_str_len:
                return False, f"Field '{k}' too long"
            if isinstance(v, list) and len(v) > 50:
                return False, f"List '{k}' too long"
    return True, None


# Initialize AI models
try:
    quiz_evaluator = QuizEvaluator()
    roadmap_generator = RoadmapGenerator()
    career_recommender = CareerRecommender()
    logger.info("All AI models initialized successfully")
except Exception as e:
    logger.error(f"Error initializing models: {str(e)}")
    raise

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for monitoring"""
    return jsonify({
        "status": "success",
        "message": "LearnMate AI service is running",
        "timestamp": datetime.utcnow().isoformat(),
        "models_loaded": True
    }), 200

# Quiz Evaluation Endpoint
@app.route('/ai/evaluate-quiz', methods=['POST'])
@limit_rate
def evaluate_quiz():
    """Evaluate quiz answers and provide detailed feedback"""
    try:
        logger.info("Received quiz evaluation request")
        data = request.get_json()
        
        if not data:
            return jsonify({"status": "fail", "message": "No data provided"}), 400
            
        is_valid, err_msg = validate_payload_size(data)
        if not is_valid:
             return jsonify({"status": "fail", "message": err_msg}), 400
        
        if 'answers' not in data or 'correctAnswers' not in data:
            return jsonify({"status": "fail", "message": "Missing required fields"}), 400
            
        result = quiz_evaluator.evaluate(
            answers=data['answers'],
            correct_answers=data['correctAnswers'],
            subject=data.get('subject', 'General')
        )
        
        logger.info(f"Quiz evaluated successfully. Score: {result['score']}/{result['total']}")
        return jsonify({"status": "success", "data": result}), 200
        
    except Exception as e:
        logger.error(f"Error in quiz evaluation: {str(e)}")
        return jsonify({"status": "fail", "message": f"Internal server error: {str(e)}"}), 500

# Roadmap Generation Endpoint
@app.route('/ai/generate-roadmap', methods=['POST'])
@limit_rate
def generate_roadmap():
    """Generate personalized learning roadmap"""
    try:
        logger.info("Received roadmap generation request")
        data = request.get_json()
        
        if not data:
            return jsonify({"status": "fail", "message": "No data provided"}), 400
            
        is_valid, err_msg = validate_payload_size(data)
        if not is_valid:
             return jsonify({"status": "fail", "message": err_msg}), 400
        
        required_fields = ['userId', 'performance', 'semester']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            return jsonify({"status": "fail", "message": f"Missing fields: {', '.join(missing_fields)}"}), 400
        
        result = roadmap_generator.generate(
            user_id=data['userId'],
            performance=data['performance'],
            semester=data['semester'],
            interests=data.get('interests', []),
            target_career=data.get('targetCareer'),
            time_available=data.get('timeAvailable', 15),
            known_skills=data.get('knownSkills', [])
        )
        
        logger.info(f"Roadmap generated for user {data['userId']}")
        return jsonify({"status": "success", "data": result}), 200
        
    except Exception as e:
        logger.error(f"Error in roadmap generation: {str(e)}")
        return jsonify({"status": "fail", "message": f"Internal server error: {str(e)}"}), 500

# Career Recommendation Endpoint
@app.route('/ai/recommend-career', methods=['POST'])
@limit_rate
def recommend_career():
    """Recommend careers based on performance and interests"""
    try:
        logger.info("Received career recommendation request")
        data = request.get_json()
        
        if not data:
             return jsonify({"status": "fail", "message": "No data provided"}), 400

        is_valid, err_msg = validate_payload_size(data)
        if not is_valid:
             return jsonify({"status": "fail", "message": err_msg}), 400
        
        if 'scores' not in data:
            return jsonify({"status": "fail", "message": "Missing required field: scores"}), 400
        
        result = career_recommender.recommend(
            scores=data['scores'],
            interests=data.get('interests', []),
            skills=data.get('skills', []),
            semester=data.get('semester', 1)
        )
        
        logger.info(f"Career recommendations generated: {len(result['recommendations'])} careers")
        return jsonify({"status": "success", "data": result}), 200
        
    except Exception as e:
        logger.error(f"Error in career recommendation: {str(e)}")
        return jsonify({"status": "fail", "message": f"Internal server error: {str(e)}"}), 500

# Batch Analysis Endpoint (Advanced Feature)
@app.route('/ai/batch-analyze', methods=['POST'])
def batch_analyze():
    """
    Perform comprehensive analysis including quiz eval, roadmap, and career recommendations
    
    Expected Input:
    {
        "userId": "user123",
        "quizData": {...},
        "performanceData": {...},
        "semester": 3
    }
    """
    try:
        logger.info("Received batch analysis request")
        data = request.get_json()
        
        if not data or 'userId' not in data:
            return jsonify({
                "status": "fail",
                "message": "Missing userId"
            }), 400
        
        results = {}
        
        # Quiz evaluation if provided
        if 'quizData' in data:
            quiz_result = quiz_evaluator.evaluate(
                answers=data['quizData'].get('answers', []),
                correct_answers=data['quizData'].get('correctAnswers', []),
                subject=data['quizData'].get('subject', 'General')
            )
            results['quizEvaluation'] = quiz_result
        
        # Roadmap generation if performance data provided
        if 'performanceData' in data:
            roadmap_result = roadmap_generator.generate(
                user_id=data['userId'],
                performance=data['performanceData'].get('scores', {}),
                semester=data.get('semester', 1),
                interests=data['performanceData'].get('interests', [])
            )
            results['roadmap'] = roadmap_result
            
            # Career recommendation
            career_result = career_recommender.recommend(
                scores=data['performanceData'].get('scores', {}),
                interests=data['performanceData'].get('interests', []),
                semester=data.get('semester', 1)
            )
            results['careerRecommendations'] = career_result
        
        logger.info(f"Batch analysis completed for user {data['userId']}")
        
        return jsonify({
            "status": "success",
            "data": results
        }), 200
        
    except Exception as e:
        logger.error(f"Error in batch analysis: {str(e)}")
        return jsonify({
            "status": "fail",
            "message": f"Internal server error: {str(e)}"
        }), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "status": "fail",
        "message": "Endpoint not found"
    }), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({
        "status": "fail",
        "message": "Internal server error"
    }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)