import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os
import logging
from datetime import datetime

logger = logging.getLogger(__name__)


class CareerRecommender:
    """
    Intelligent Career Recommendation System
    Uses ML model trained on student performance data to suggest career paths
    """
    
    def __init__(self, model_path='models/saved/career_model.pkl'):
        """Initialize career recommender and load trained model"""
        self.model_path = model_path
        self.model = None
        self.scaler = None
        self.feature_names = []
        self.career_profiles = self._load_career_profiles()
        
        # Load model if exists, otherwise use rule-based system
        if os.path.exists(model_path):
            self._load_model()
            logger.info("Career model loaded from disk")
        else:
            logger.warning("Model file not found, using rule-based recommendation")
            self.use_rule_based = True
    
    def _load_career_profiles(self):
        """
        Load detailed career profiles with requirements and characteristics
        """
        return {
            "AI Engineer": {
                "required_skills": ["AI", "Programming", "Math"],
                "importance": {"AI": 0.35, "Programming": 0.30, "Math": 0.25, "DataScience": 0.10},
                "min_score": 70,
                "description": "Design and develop AI systems and machine learning models",
                "growth_rate": "Very High",
                "avg_salary": "$120,000 - $180,000",
                "key_skills": ["Python", "TensorFlow", "PyTorch", "Deep Learning", "NLP"],
                "industries": ["Tech", "Healthcare", "Finance", "Automotive"]
            },
            "Data Scientist": {
                "required_skills": ["DataScience", "Math", "Programming"],
                "importance": {"DataScience": 0.35, "Math": 0.30, "Programming": 0.25, "AI": 0.10},
                "min_score": 65,
                "description": "Extract insights from data using statistical and ML techniques",
                "growth_rate": "High",
                "avg_salary": "$100,000 - $150,000",
                "key_skills": ["Python", "R", "SQL", "Statistics", "Data Visualization"],
                "industries": ["Tech", "Finance", "Healthcare", "E-commerce"]
            },
            "Machine Learning Engineer": {
                "required_skills": ["AI", "Programming", "Math"],
                "importance": {"AI": 0.35, "Programming": 0.35, "Math": 0.20, "DataScience": 0.10},
                "min_score": 70,
                "description": "Build and deploy scalable ML systems in production",
                "growth_rate": "Very High",
                "avg_salary": "$115,000 - $170,000",
                "key_skills": ["Python", "ML Ops", "Docker", "Kubernetes", "Cloud Platforms"],
                "industries": ["Tech", "Finance", "E-commerce", "Gaming"]
            },
            "Data Analyst": {
                "required_skills": ["DataScience", "Math"],
                "importance": {"DataScience": 0.40, "Math": 0.30, "Programming": 0.20, "AI": 0.10},
                "min_score": 60,
                "description": "Analyze data to help businesses make informed decisions",
                "growth_rate": "High",
                "avg_salary": "$70,000 - $100,000",
                "key_skills": ["Excel", "SQL", "Tableau", "Power BI", "Statistics"],
                "industries": ["Finance", "Consulting", "Healthcare", "Retail"]
            },
            "Software Engineer": {
                "required_skills": ["Programming"],
                "importance": {"Programming": 0.50, "Math": 0.20, "DataScience": 0.15, "AI": 0.15},
                "min_score": 65,
                "description": "Design, develop and maintain software applications",
                "growth_rate": "High",
                "avg_salary": "$95,000 - $140,000",
                "key_skills": ["Data Structures", "Algorithms", "System Design", "Git"],
                "industries": ["Tech", "Finance", "Healthcare", "Any industry"]
            },
            "Full Stack Developer": {
                "required_skills": ["WebDevelopment", "Programming"],
                "importance": {"WebDevelopment": 0.40, "Programming": 0.40, "DataScience": 0.10, "AI": 0.10},
                "min_score": 60,
                "description": "Build complete web applications from frontend to backend",
                "growth_rate": "High",
                "avg_salary": "$85,000 - $130,000",
                "key_skills": ["React", "Node.js", "Databases", "RESTful APIs", "DevOps"],
                "industries": ["Tech", "Startups", "E-commerce", "Media"]
            },
            "Research Scientist": {
                "required_skills": ["AI", "Math", "DataScience"],
                "importance": {"AI": 0.35, "Math": 0.35, "DataScience": 0.20, "Programming": 0.10},
                "min_score": 75,
                "description": "Conduct cutting-edge research in AI and related fields",
                "growth_rate": "Medium",
                "avg_salary": "$110,000 - $160,000",
                "key_skills": ["Research Methods", "Paper Writing", "Mathematics", "ML Algorithms"],
                "industries": ["Academia", "Tech Research Labs", "Government", "Healthcare"]
            },
            "Business Intelligence Analyst": {
                "required_skills": ["DataScience", "Math"],
                "importance": {"DataScience": 0.35, "Math": 0.25, "Programming": 0.25, "AI": 0.15},
                "min_score": 60,
                "description": "Transform data into actionable business insights",
                "growth_rate": "Medium",
                "avg_salary": "$75,000 - $110,000",
                "key_skills": ["SQL", "Tableau", "Business Acumen", "Data Warehousing"],
                "industries": ["Consulting", "Finance", "Retail", "Healthcare"]
            },
            "DevOps Engineer": {
                "required_skills": ["Programming"],
                "importance": {"Programming": 0.45, "Math": 0.15, "DataScience": 0.20, "AI": 0.20},
                "min_score": 65,
                "description": "Manage infrastructure and automate deployment pipelines",
                "growth_rate": "High",
                "avg_salary": "$100,000 - $145,000",
                "key_skills": ["Docker", "Kubernetes", "CI/CD", "Cloud (AWS/Azure)", "Linux"],
                "industries": ["Tech", "Finance", "E-commerce", "Any industry"]
            },
            "Cybersecurity Analyst": {
                "required_skills": ["Programming"],
                "importance": {"Programming": 0.40, "Math": 0.25, "DataScience": 0.20, "AI": 0.15},
                "min_score": 65,
                "description": "Protect systems and networks from cyber threats",
                "growth_rate": "Very High",
                "avg_salary": "$90,000 - $135,000",
                "key_skills": ["Network Security", "Penetration Testing", "Security Tools", "Python"],
                "industries": ["Finance", "Government", "Tech", "Healthcare"]
            }
        }
    
    def _load_model(self):
        """Load pre-trained model from disk"""
        try:
            model_data = joblib.load(self.model_path)
            self.model = model_data['model']
            self.scaler = model_data['scaler']
            self.feature_names = model_data['feature_names']
            self.use_rule_based = False
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            self.use_rule_based = True
    
    def _calculate_career_score(self, career_name, scores, interests, skills):
        """
        Calculate compatibility score for a career based on multiple factors
        
        Returns:
            float: Score between 0 and 1
        """
        career_profile = self.career_profiles.get(career_name)
        if not career_profile:
            return 0.0
        
        score_component = 0.0
        importance_weights = career_profile['importance']
        
        # 1. Academic performance component (60% weight)
        for subject, importance in importance_weights.items():
            subject_score = 0
            # Flexible subject matching
            for score_subject, score_value in scores.items():
                if subject.lower() in score_subject.lower() or score_subject.lower() in subject.lower():
                    subject_score = max(subject_score, score_value)
            
            score_component += (subject_score / 100) * importance
        
        # Normalize to 0-1 and apply 60% weight
        score_component = score_component * 0.6
        
        # 2. Interest alignment component (25% weight)
        interest_score = 0.0
        career_keywords = career_name.lower().split() + career_profile['required_skills']
        career_keywords = [k.lower() for k in career_keywords]
        
        for interest in interests:
            interest_lower = interest.lower()
            if any(keyword in interest_lower or interest_lower in keyword for keyword in career_keywords):
                interest_score += 0.33  # Each matching interest adds value
        
        interest_score = min(interest_score, 1.0) * 0.25
        
        # 3. Skills alignment component (15% weight)
        skills_score = 0.0
        if skills:
            career_skills = [s.lower() for s in career_profile.get('key_skills', [])]
            user_skills_lower = [s.lower() for s in skills]
            
            matches = sum(1 for us in user_skills_lower 
                         if any(cs in us or us in cs for cs in career_skills))
            
            if career_skills:
                skills_score = (matches / len(career_skills)) * 0.15
        
        # Total score
        total_score = score_component + interest_score + skills_score
        
        # Apply minimum score threshold
        avg_score = sum(scores.values()) / len(scores) if scores else 0
        if avg_score < career_profile['min_score']:
            total_score *= 0.7  # Penalty for not meeting minimum requirements
        
        return min(total_score, 1.0)
    
    def _rule_based_recommend(self, scores, interests, skills, semester):
        """
        Rule-based career recommendation system
        Fallback when ML model is not available
        """
        recommendations = []
        
        for career_name, profile in self.career_profiles.items():
            confidence = self._calculate_career_score(
                career_name, scores, interests, skills
            )
            
            if confidence > 0.3:  # Minimum threshold
                recommendations.append({
                    "career": career_name,
                    "confidence": round(confidence, 3),
                    "description": profile['description'],
                    "matchReasons": self._generate_match_reasons(
                        career_name, profile, scores, interests, skills
                    ),
                    "requirements": profile['required_skills'],
                    "keySkills": profile['key_skills'],
                    "growthRate": profile['growth_rate'],
                    "avgSalary": profile['avg_salary'],
                    "industries": profile['industries']
                })
        
        # Sort by confidence
        recommendations.sort(key=lambda x: x['confidence'], reverse=True)
        
        return recommendations[:6]  # Return top 6
    
    def _generate_match_reasons(self, career_name, profile, scores, interests, skills):
        """Generate personalized reasons why a career matches"""
        reasons = []
        
        # Check strong subjects
        importance = profile['importance']
        for subject, weight in importance.items():
            if weight >= 0.25:  # Important subject
                for score_subject, score_value in scores.items():
                    if subject.lower() in score_subject.lower():
                        if score_value >= 75:
                            reasons.append(f"Strong performance in {subject} ({score_value}%)")
                        break
        
        # Check interest alignment
        career_keywords = career_name.lower().split()
        for interest in interests:
            if any(keyword in interest.lower() for keyword in career_keywords):
                reasons.append(f"Aligns with your interest in {interest}")
        
        # Check skills
        if skills:
            matching_skills = [s for s in skills if s in profile.get('key_skills', [])]
            if matching_skills:
                reasons.append(f"You have relevant skills: {', '.join(matching_skills[:3])}")
        
        # Add growth potential
        if profile['growth_rate'] == "Very High":
            reasons.append("High demand and excellent growth prospects")
        
        if not reasons:
            reasons.append("Good foundational match with this career path")
        
        return reasons[:4]  # Return top 4 reasons
    
    def _generate_career_advice(self, recommendations, scores, semester):
        """Generate personalized career development advice"""
        advice = []
        
        if not recommendations:
            advice.append("📚 Focus on building strong fundamentals first")
            advice.append("🎯 Explore different areas to discover your interests")
            return advice
        
        top_career = recommendations[0]
        avg_score = sum(scores.values()) / len(scores) if scores else 0
        
        # Semester-specific advice
        if semester <= 2:
            advice.append("🌱 Early stage - focus on exploring and building foundations")
            advice.append(f"🎯 Consider {top_career['career']} as a potential goal")
        elif semester <= 4:
            advice.append(f"💼 Start preparing for {top_career['career']} with targeted skill building")
            advice.append("🚀 Seek internships or projects in your top career areas")
        elif semester <= 6:
            advice.append(f"🎓 Deep dive into skills required for {top_career['career']}")
            advice.append("💻 Build a portfolio showcasing relevant projects")
        else:
            advice.append(f"🏆 Final push - master key skills for {top_career['career']}")
            advice.append("🎤 Prepare for interviews and networking in your target field")
        
        # Performance-based advice
        if avg_score < 60:
            advice.append("📈 Focus on improving grades to increase career options")
        elif avg_score >= 80:
            advice.append("⭐ Excellent performance! Consider advanced roles or research")
        
        return advice
    
    def recommend(self, scores, interests=None, skills=None, semester=1):
        """
        Main recommendation function
        
        Args:
            scores: Dict of subject scores (e.g., {"AI": 82, "Programming": 90})
            interests: List of interest areas
            skills: List of skills user has
            semester: Current semester (1-8)
        
        Returns:
            dict: Career recommendations with detailed information
        """
        try:
            if interests is None:
                interests = []
            if skills is None:
                skills = []
            
            logger.info(f"Generating career recommendations")
            
            # Get recommendations (always use rule-based for production reliability)
            recommendations = self._rule_based_recommend(scores, interests, skills, semester)
            
            # Generate personalized advice
            career_advice = self._generate_career_advice(recommendations, scores, semester)
            
            # Calculate overall career readiness
            avg_score = sum(scores.values()) / len(scores) if scores else 0
            readiness = "High" if avg_score >= 75 else "Medium" if avg_score >= 60 else "Developing"
            
            result = {
                "recommendations": recommendations,
                "careerAdvice": career_advice,
                "careerReadiness": readiness,
                "avgScore": round(avg_score, 1),
                "analysisDate": datetime.utcnow().isoformat() + "Z"
            }
            
            logger.info(f"Generated {len(recommendations)} career recommendations")
            return result
            
        except Exception as e:
            logger.error(f"Error in career recommendation: {str(e)}")
            raise