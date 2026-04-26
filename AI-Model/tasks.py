import logging
from celery_app import app
from models.career_recommender import CareerRecommender
from models.quiz_evaluator import QuizEvaluator
from models.roadmap_generator import RoadmapGenerator

logger = logging.getLogger(__name__)

# Initialize models (singleton-like behavior per worker process)
try:
    career_recommender = CareerRecommender()
    quiz_evaluator = QuizEvaluator()
    roadmap_generator = RoadmapGenerator()
except Exception as e:
    logger.error(f"Error initializing models in Celery: {e}")

@app.task(name='tasks.recommend_career')
def recommend_career(data):
    try:
        result = career_recommender.recommend(
            scores=data.get('scores', {}),
            interests=data.get('interests', []),
            skills=data.get('skills', []),
            semester=data.get('semester', 1)
        )
        return result
    except Exception as e:
        logger.error(f"Career recommendation failed: {e}")
        raise e

@app.task(name='tasks.evaluate_quiz')
def evaluate_quiz(data):
    try:
        result = quiz_evaluator.evaluate(
            answers=data.get('answers', []),
            correct_answers=data.get('correctAnswers', []),
            subject=data.get('subject', 'General')
        )
        return result
    except Exception as e:
        logger.error(f"Quiz evaluation failed: {e}")
        raise e

@app.task(name='tasks.generate_roadmap')
def generate_roadmap(user_id, performance, semester, interests, target_career, time_available, known_skills):
    try:
        result = roadmap_generator.generate(
            user_id=user_id,
            performance=performance,
            semester=semester,
            interests=interests,
            target_career=target_career,
            time_available=time_available,
            known_skills=known_skills
        )
        return result
    except Exception as e:
        logger.error(f"Roadmap generation failed: {e}")
        raise e
