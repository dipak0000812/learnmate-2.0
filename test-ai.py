
import requests
import json

BASE_URL = 'http://localhost:5001'

def test_ai():
    print("--- 🧠 Starting AI Service Test ---")
    
    # 1. Health
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✅ Health Check: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"❌ Health Check Failed: {str(e)}")
        return

    # 2. Career Recommendation
    print("\n2. Testing Career Recommendation...")
    career_payload = {
        "scores": {"AI": 85, "Programming": 90, "Math": 75},
        "interests": ["AI", "Research"],
        "skills": ["Python", "TensorFlow"],
        "semester": 6
    }
    try:
        response = requests.post(f"{BASE_URL}/ai/recommend-career", json=career_payload)
        if response.status_code == 200:
            print("✅ Career Recommendation Success")
            print(f"   Careers: {len(response.json()['data']['recommendations'])}")
        else:
            print(f"❌ Career Recommendation Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Career Recommendation Error: {str(e)}")

    # 3. Roadmap Generation
    print("\n3. Testing Roadmap Generation...")
    roadmap_payload = {
        "userId": "test_user_1",
        "performance": {"AI": 85},
        "semester": 6,
        "interests": ["AI"],
        "targetCareer": "AI Engineer",
        "timeAvailable": 20
    }
    try:
        response = requests.post(f"{BASE_URL}/ai/generate-roadmap", json=roadmap_payload)
        if response.status_code == 200:
            print("✅ Roadmap Generation Success")
            print(f"   Phases: {len(response.json()['data']['roadmap'])}")
        else:
            print(f"❌ Roadmap Generation Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Roadmap Generation Error: {str(e)}")

    print("\n--- 🎉 AI Tests Completed ---")

if __name__ == "__main__":
    test_ai()
