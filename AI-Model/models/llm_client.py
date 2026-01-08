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
            # STABILIZATION: Lock temperature to 0.2 to prevent hallucinations and ensure consistency
            self.model = genai.GenerativeModel(
                'gemini-1.5-flash',
                generation_config=genai.types.GenerationConfig(
                    temperature=0.2,
                    top_p=0.8,
                    top_k=40,
                    response_mime_type='application/json'
                ),
                safety_settings=[
                    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                ]
            )
            logger.info("Gemini API Client initialized with STABLE config (Temp: 0.2)")

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
            # With response_mime_type='application/json', text is guaranteed to be JSON
            return json.loads(response.text)
        except Exception as e:
            logger.error(f"LLM Generation Error: {str(e)}")
            logger.error(f"Raw Response: {response.text if 'response' in locals() else 'None'}")
            raise e
