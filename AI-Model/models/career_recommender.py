import logging
from datetime import datetime
from .llm_client import LLMClient

logger = logging.getLogger(__name__)

class CareerRecommender:
    """
    Intelligent Career Recommendation System (Powered by Gemini AI)
    """
    
    def __init__(self):
        """Initialize with LLM Client"""
        self.llm = LLMClient()
        logger.info("CareerRecommender initialized with Gemini AI")
    
    def recommend(self, scores, interests=None, skills=None, semester=1):
        """
        Generate career recommendations using LLM analysis
        """
        try:
            logger.info(f"Generating AI career recommendations for semester {semester}")
            
            prompt = f"""
            Act as an expert Career Counselor for university students.
            Analyze the student's profile and recommend the top 6 most suitable career paths.
            
            STUDENT PROFILE:
            - Current Semester: {semester}
            - Academic Performance (Subject Scores): {scores}
            - Interests: {interests}
            - Known Skills: {skills}
            
            OUTPUT REQUIREMENTS:
            Return a JSON object with this exact structure:
            {{
                "recommendations": [
                    {{
                        "career": "Career Name",
                        "confidence": 0.95,  // Float between 0-1
                        "description": "Brief description of the role",
                        "matchReasons": ["Reason 1", "Reason 2"], // Specific to the student's profile
                        "requirements": ["Skill 1", "Skill 2"],
                        "keySkills": ["Tech Stack 1", "Tech Stack 2"],
                        "growthRate": "High/Very High",
                        "avgSalary": "$X - $Y",
                        "industries": ["Ind 1", "Ind 2"]
                    }}
                ],
                "careerAdvice": ["Specific action item 1", "Specific action item 2"],
                "careerReadiness": "High/Medium/Developing",
                "avgScore": {sum(scores.values()) / len(scores) if scores else 0}
            }}
            
            Ensure the "matchReasons" are highly personalized to the input scores and interests.
            """
            
            result = self.llm.generate_json(prompt)
            result["analysisDate"] = datetime.utcnow().isoformat() + "Z"
            
            logger.info(f"AI generated {len(result.get('recommendations', []))} recommendations")
            return result
            
        except Exception as e:
            logger.error(f"Error in career recommendation: {str(e)}")
            # Fallback to empty/error response rather than crashing
            return {
                "recommendations": [],
                "careerAdvice": ["AI Service is currently unavailable. Please check API Key."],
                "careerReadiness": "Unknown",
                "avgScore": 0,
                "error": str(e)
            }