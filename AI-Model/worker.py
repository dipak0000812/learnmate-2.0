import os
import time
import logging
import pymongo
from pymongo import MongoClient
from dotenv import load_dotenv
from bson.objectid import ObjectId
import sys

# Add models directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'models'))
from roadmap_generator import RoadmapGenerator

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '..', 'learnmate-backend', '.env'))

# Configuration
MONGO_URI = os.getenv('MONGO_URI')
if not MONGO_URI:
    print("FATAL: MONGO_URI not found")
    sys.exit(1)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger('Worker')

# Connect to MongoDB
try:
    client = MongoClient(MONGO_URI)
    db = client.get_database() # Uses database name from URI
    jobs_collection = db['jobs']
    roadmaps_collection = db['roadmaps'] # To save the final roadmap
    users_collection = db['users']
    logger.info("Connected to MongoDB")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {e}")
    sys.exit(1)

def process_roadmap_job(job):
    try:
        payload = job.get('payload', {})
        user_id = payload.get('userId')
        dream_career = payload.get('dreamCareer')
        
        logger.info(f"Processing Roadmap Job {job['_id']} for user {user_id}")
        
        # 1. Generate Roadmap using AI Logic (Reusing RoadmapGenerator)
        # Note: We need to adapt RoadmapGenerator to be standalone or imported
        # For this implementation, we will instantiate it directly
        
        # Mocking the Generator call for now, assuming logic is similar to what was in app.py
        # Real implementation would call the actual AI model here.
        # Since app.py had the logic, let's extract or call it.
        # Ideally, RoadmapGenerator class should be in models/roadmap_generator.py
        
        # Let's import it (done above)
        generator = RoadmapGenerator()
        
        # 1. Fetch User Context from DB to ensure AI uses latest profile data
        user_data = users_collection.find_one({'_id': ObjectId(user_id)})
        
        if not user_data:
            logger.warning(f"User {user_id} not found in DB, using limited payload data")
            user_context = {}
        else:
            logger.info(f"Fetched rich context for user {user_data.get('name')}")
            user_context = user_data
            
        # Extract fields from User Document (handling nested onboardingData)
        onboarding = user_context.get('onboardingData', {})
        
        # Merge Payload (Specific request) with User Profile (Long-term data)
        # Payload takes precedence for 'dreamCareer' if overriden
        effective_career = dream_career or onboarding.get('targetRole') or user_context.get('dreamCareer')
        
        skills = payload.get('knownSkills') or onboarding.get('knownSkills') or user_context.get('skills', [])
        interests = payload.get('interests') or onboarding.get('interests') or user_context.get('learningPreferences', [])
        semester = user_context.get('semester', 1)
        
        # Prepare AI payload
        ai_input = {
            "career": effective_career,
            "skills": skills,
            "time": payload.get('timeAvailable', 15), # Default 15h if not specified
            "interests": interests,
            "semester": semester
        }
        
        # Generate
        # We need to adapt the call to match RoadmapGenerator.generate signature
        roadmap_data = generator.generate(
            user_id=user_id,
            performance={}, # TODO: Fetch assessment history if needed
            semester=ai_input['semester'],
            interests=ai_input['interests'],
            target_career=ai_input['career'],
            time_available=ai_input['time'],
            known_skills=ai_input['skills']
        )
        
        # Normalize (simplified version of backend logic)
        # In a real microservice, this logic should be shared or in the worker
        # We will save the RAW roadmap data in the result, and let the Backend (User polling)
        # create the Roadmap document? NO.
        # The WORKER should do the heavy lifting.
        
        # Wait, if we save the roadmap here, we need the Mongoose Schema structure?
        # Python doesn't know Mongoose schemas.
        # Better Strategy: Worker returns the JSON data, Backend (poller) saves it?
        # NO, Backend polling is just a GET request.
        
        # Strategy: Worker saves the 'result' in the Job document.
        # The Frontend polls Job. If complete, Frontend calls 'create_roadmap' with data?
        # OR: Backend 'poll' endpoint checks if job complete, then creates Roadmap?
        # OR: Worker writes to 'roadmaps' collection directly.
        
        # Let's have the Worker return the DATA in 'result'.
        # The Frontend will receive the data.
        # BUT we want to persist it.
        
        # Let's keep it simple: Worker returns the structure.
        # The 'getJobStatus' endpoint in Node.js *could* trigger the save if it sees 'completed'?
        # No, 'getJobStatus' is idempotent.
        
        # Best approach for decoupling:
        # Worker does purely CPU work.
        # Worker saves 'result' to Job.
        # We need a 'finalize' step.
        # Let's update 'roadmapController.js' -> 'getJobStatus'
        # If job.status === 'completed' and !job.processedAt:
        #   Create Roadmap Document
        #   Link to User
        #   Mark job as processed
        #   Return Roadmap
        
        return roadmap_data

    except Exception as e:
        logger.error(f"Error processing job: {e}")
        raise e

def main():
    logger.info("Worker started. Polling for jobs...")
    while True:
        try:
            # Find one pending job
            # atomic findOneAndUpdate to claim the job
            job = jobs_collection.find_one_and_update(
                {'status': 'pending', 'type': 'GENERATE_ROADMAP'},
                {'$set': {'status': 'processing', 'processedAt': None}},
                return_document=pymongo.ReturnDocument.AFTER
            )
            
            if job:
                try:
                    result = process_roadmap_job(job)
                    
                    # Mark complete
                    jobs_collection.update_one(
                        {'_id': job['_id']},
                        {'$set': {
                            'status': 'completed', 
                            'result': result,
                            'completedAt': datetime.datetime.utcnow()
                        }}
                    )
                    logger.info(f"Job {job['_id']} completed successfully")
                except Exception as task_error:
                    jobs_collection.update_one(
                        {'_id': job['_id']},
                        {'$set': {'status': 'failed', 'error': str(task_error)}}
                    )
                    logger.error(f"Job {job['_id']} failed: {task_error}")
            else:
                # No jobs, sleep
                time.sleep(2)
                
        except Exception as e:
            logger.error(f"Worker loop error: {e}")
            time.sleep(5)
            
if __name__ == "__main__":
    import datetime
    main()
