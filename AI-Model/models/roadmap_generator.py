import logging
from datetime import datetime
from .llm_client import LLMClient

logger = logging.getLogger(__name__)

class RoadmapGenerator:
    """
    Intelligent Roadmap Generator (Powered by Gemini AI)
    """
    
    def __init__(self):
        self.llm = LLMClient()
        logger.info("RoadmapGenerator initialized with Gemini AI")
    
    def generate(self, user_id, performance, semester, interests=None, 
                 target_career=None, time_available=15, known_skills=None):
        """
        Generate personalized week-by-week roadmap using LLM
        """
        try:
            logger.info(f"Generating AI roadmap for {target_career}")
            
            prompt = f"""
            Act as an expert Learning Curriculum Designer.
            Create a detailed, week-by-week learning roadmap for a student targeting the role of: {target_career}.
            
            STUDENT CONTEXT:
            - Current Semester: {semester}
            - Weak Areas (Low Scores): {[k for k,v in performance.items() if v < 60]}
            - Strong Areas: {[k for k,v in performance.items() if v >= 80]}
            - Interests: {interests}
            - Existing Skills: {known_skills}
            - Available Study Time: {time_available} hours/week
            
            OUTPUT REQUIREMENTS:
            Return a JSON object with this exact structure:
            {{
                "roadmap": [
                    {{
                        "milestone": "Phase Title (e.g., Foundation)",
                        "duration": "2 weeks",
                        "priority": "critical/high/medium",
                        "currentScore": 0,
                        "targetScore": 80,
                        "reason": "Why this is needed",
                        "resources": ["Resource 1", "Resource 2"],
                        "milestones": [ // Tasks for this phase
                             "Task 1", "Task 2", "Task 3"
                        ]
                    }}
                ],
                "studyRecommendations": [
                    {{ "category": "Strategy", "suggestion": "...", "priority": "high" }}
                ],
                "semesterAdvice": ["Advice 1", "Advice 2"],
                "targetCareer": "{target_career}",
                "statistics": {{
                    "estimatedTotalWeeks": 12,
                    "estimatedTotalHours": 150
                }}
            }}
            
            IMPORTANT:
            - The "milestones" field inside each phase is crucial. It must contain specific, actionable learning tasks.
            - Adapt curriculum to fill gaps in 'Weak Areas' first.
            """
            
            result = self.llm.generate_json(prompt)
            result["userId"] = user_id
            result["generatedAt"] = datetime.utcnow().isoformat() + "Z"
            
            logger.info(f"AI generated roadmap with {len(result.get('roadmap', []))} phases")
            return result
            
        except Exception as e:
            logger.error(f"Error generating roadmap: {str(e)}")
            return {
                "roadmap": [],
                "studyRecommendations": [],
                "error": str(e)
            }