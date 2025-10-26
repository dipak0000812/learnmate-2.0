import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import logging
from collections import defaultdict

logger = logging.getLogger(__name__)


def convert_to_json_serializable(obj):
    """Convert NumPy types to Python native types"""
    if isinstance(obj, np.bool_):
        return bool(obj)
    elif isinstance(obj, (np.int_, np.intc, np.intp, np.int8, np.int16, np.int32, np.int64)):
        return int(obj)
    elif isinstance(obj, (np.float_, np.float16, np.float32, np.float64)):
        return float(obj)
    return obj


class QuizEvaluator:
    """
    Advanced Quiz Evaluator with NLP-based subjective answer evaluation
    """
    
    def __init__(self, similarity_threshold=0.7):
        self.similarity_threshold = similarity_threshold
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            stop_words='english',
            lowercase=True,
            max_features=1000
        )
        logger.info("QuizEvaluator initialized")
    
    def preprocess_text(self, text):
        """Clean and normalize text"""
        if not isinstance(text, str):
            text = str(text)
        text = text.lower().strip()
        text = re.sub(r'[^a-z0-9\s]', '', text)
        text = re.sub(r'\s+', ' ', text)
        return text
    
    def evaluate_mcq(self, user_answer, correct_answer):
        """Evaluate MCQ questions"""
        user_ans = self.preprocess_text(user_answer)
        correct_ans = self.preprocess_text(correct_answer)
        
        if user_ans == correct_ans:
            return True, 1.0
        
        if len(user_ans) <= 3 and len(correct_ans) <= 3:
            return user_ans == correct_ans, 1.0 if user_ans == correct_ans else 0.0
        
        return False, 0.0
    
    def evaluate_subjective(self, user_answer, correct_answer):
        """Evaluate subjective answers using NLP"""
        try:
            user_ans = self.preprocess_text(user_answer)
            correct_ans = self.preprocess_text(correct_answer)
            
            if not user_ans or len(user_ans) < 3:
                return False, 0.0, 0.0
            
            if len(user_ans.split()) <= 2:
                exact_match = user_ans in correct_ans or correct_ans in user_ans
                return exact_match, 1.0 if exact_match else 0.0, 1.0 if exact_match else 0.0
            
            tfidf_matrix = self.vectorizer.fit_transform([user_ans, correct_ans])
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            
            is_correct = similarity >= self.similarity_threshold
            
            if similarity >= 0.9:
                score = 1.0
            elif similarity >= 0.7:
                score = 0.8
            elif similarity >= 0.5:
                score = 0.6
            elif similarity >= 0.3:
                score = 0.3
            else:
                score = 0.0
            
            return is_correct, score, similarity
            
        except Exception as e:
            logger.error(f"Error in subjective evaluation: {str(e)}")
            return False, 0.0, 0.0
    
    def generate_topic_feedback(self, topic_performance):
        """Generate feedback based on topic performance"""
        feedback = []
        
        for topic, (correct, total) in topic_performance.items():
            if total == 0:
                continue
            
            percentage = (correct / total) * 100
            
            if percentage >= 90:
                feedback.append(f"✅ Excellent mastery of {topic}!")
            elif percentage >= 75:
                feedback.append(f"✓ Good understanding of {topic}.")
            elif percentage >= 60:
                feedback.append(f"⚠ Moderate understanding of {topic}. More practice needed.")
            elif percentage >= 40:
                feedback.append(f"⚠ Weak in {topic}. Dedicated study required.")
            else:
                feedback.append(f"❌ Critical gaps in {topic}. Review fundamentals.")
        
        return feedback
    
    def generate_improvement_suggestions(self, weak_topics, score_percentage):
        """Generate improvement suggestions"""
        suggestions = []
        
        if score_percentage < 50:
            suggestions.append("📚 Review basic concepts before advanced topics")
            suggestions.append("🎯 Focus on one topic at a time")
        
        if weak_topics:
            suggestions.append(f"🔍 Priority topics: {', '.join(weak_topics[:3])}")
            suggestions.append("📝 Practice more problems in weak areas")
        
        if score_percentage >= 80:
            suggestions.append("🚀 Great job! Try advanced problems")
        elif score_percentage >= 60:
            suggestions.append("💪 Keep practicing consistently")
        
        suggestions.append("⏰ Regular revision is key")
        
        return suggestions
    
    def evaluate(self, answers, correct_answers, subject="General"):
        """Main evaluation function"""
        try:
            correct_lookup = {ca['questionId']: ca for ca in correct_answers}
            
            total_score = 0.0
            max_score = len(answers)
            topic_performance = defaultdict(lambda: [0, 0])
            detailed_results = []
            weak_topics = []
            
            for user_ans in answers:
                q_id = user_ans.get('questionId')
                user_answer = user_ans.get('answer', '')
                q_type = user_ans.get('type', 'mcq')
                
                if q_id not in correct_lookup:
                    logger.warning(f"Question {q_id} not found")
                    continue
                
                correct_data = correct_lookup[q_id]
                correct_answer = correct_data.get('answer', '')
                topic = correct_data.get('topic', 'General')
                
                if q_type.lower() in ['mcq', 'multiple_choice', 'objective']:
                    is_correct, score = self.evaluate_mcq(user_answer, correct_answer)
                    similarity = 1.0 if is_correct else 0.0
                else:
                    is_correct, score, similarity = self.evaluate_subjective(user_answer, correct_answer)
                
                total_score += score
                topic_performance[topic][1] += 1
                if is_correct:
                    topic_performance[topic][0] += 1
                
                # FIX: Convert NumPy types to Python types for JSON serialization
                detailed_results.append({
                    "questionId": str(q_id),
                    "topic": str(topic),
                    "isCorrect": bool(is_correct),
                    "score": float(round(score, 2)),
                    "similarity": float(round(similarity, 2)) if q_type != 'mcq' else None,
                    "userAnswer": str(user_answer[:100]),
                    "correctAnswer": str(correct_answer[:100])
                })
            
            score_percentage = (total_score / max_score * 100) if max_score > 0 else 0
            
            for topic, (correct, total) in topic_performance.items():
                if total > 0 and (correct / total) < 0.6:
                    weak_topics.append(str(topic))
            
            topic_feedback = self.generate_topic_feedback(dict(topic_performance))
            improvement_suggestions = self.generate_improvement_suggestions(weak_topics, score_percentage)
            
            result = {
                "score": float(round(total_score, 1)),
                "total": int(max_score),
                "percentage": float(round(score_percentage, 1)),
                "grade": str(self._calculate_grade(score_percentage)),
                "subject": str(subject),
                "topicPerformance": {
                    str(topic): {
                        "correct": int(correct),
                        "total": int(total),
                        "percentage": float(round((correct/total)*100, 1)) if total > 0 else 0.0
                    }
                    for topic, (correct, total) in topic_performance.items()
                },
                "feedback": [str(f) for f in topic_feedback],
                "improvementSuggestions": [str(s) for s in improvement_suggestions],
                "weakTopics": [str(t) for t in weak_topics],
                "detailedResults": detailed_results,
                "evaluatedAt": str(self._get_timestamp())
            }
            
            logger.info(f"Quiz evaluation completed: {score_percentage:.1f}%")
            return result
            
        except Exception as e:
            logger.error(f"Error in quiz evaluation: {str(e)}")
            raise
    
    def _calculate_grade(self, percentage):
        """Convert percentage to grade"""
        if percentage >= 90:
            return "A+"
        elif percentage >= 80:
            return "A"
        elif percentage >= 70:
            return "B+"
        elif percentage >= 60:
            return "B"
        elif percentage >= 50:
            return "C"
        elif percentage >= 40:
            return "D"
        else:
            return "F"
    
    def _get_timestamp(self):
        """Get current timestamp"""
        from datetime import datetime
        return datetime.utcnow().isoformat() + "Z"