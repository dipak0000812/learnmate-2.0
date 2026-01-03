import os
import logging
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

class LLMClient:
    """
    Client for interacting with Google Gemini API
    """
    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            logger.warning("GEMINI_API_KEY not found in environment variables")
        else:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash') # Use Flash for speed/cost efficiently
            logger.info("Gemini API Client initialized")

    def generate_json(self, prompt, context=""):
        """
        Generate JSON response from LLM
        """
        if not self.api_key:
            raise Exception("GEMINI_API_KEY is missing")

        full_prompt = f"""
        {context}
        
        STRICT OUTPUT FORMAT:
        You must return ONLY a valid JSON object. Do not include markdown formatting like ```json ... ```. 
        
        TASK:
        {prompt}
        """

        try:
            response = self.model.generate_content(full_prompt)
            text = response.text.strip()
            
            # Cleanup common markdown issues if the model ignores instruction
            if text.startswith("```json"):
                text = text.replace("```json", "", 1)
            if text.startswith("```"):
                text = text.replace("```", "", 1)
            if text.endswith("```"):
                text = text.rsplit("```", 1)[0]
                
            return json.loads(text.strip())
        except Exception as e:
            logger.error(f"LLM Generation Error: {str(e)}")
            logger.error(f"Raw Response: {response.text if 'response' in locals() else 'None'}")
            raise e
