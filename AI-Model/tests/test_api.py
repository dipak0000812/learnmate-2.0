"""
API Testing Script for LearnMate AI
Tests all endpoints with realistic data
"""

import requests
import json
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:5000"
HEADERS = {"Content-Type": "application/json"}


def print_section(title):
    """Print formatted section header"""
    print("\n" + "="*70)
    print(f"  {title}")
    print("="*70)


def print_response(response):
    """Pretty print API response"""
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response:")
    print(json.dumps(response.json(), indent=2))


def test_health_check():
    """Test health check endpoint"""
    print_section("TEST 1: Health Check")
    
    response = requests.get(f"{BASE_URL}/health")
    print_response(response)
    
    assert response.status_code == 200
    assert response.json()["status"] == "success"
    print("✅ Health check passed!")


def test_quiz_evaluation():
    """Test quiz evaluation endpoint"""
    print_section("TEST 2: Quiz Evaluation")
    
    data = {
        "answers": [
            {
                "questionId": "q1",
                "answer": "Machine learning is a subset of artificial intelligence",
                "type": "subjective"
            },
            {
                "questionId": "q2",
                "answer": "B",
                "type": "mcq"
            },
            {
                "questionId": "q3",
                "answer": "Supervised learning uses labeled data",
                "type": "subjective"
            }
        ],
        "correctAnswers": [
            {
                "questionId": "q1",
                "answer": "Machine learning is a branch of AI that allows systems to learn from data",
                "topic": "ML Fundamentals"
            },
            {
                "questionId": "q2",
                "answer": "B",
                "topic": "Python Basics"
            },
            {
                "questionId": "q3",
                "answer": "Supervised learning uses labeled training data",
                "topic": "ML Types"
            }
        ],
        "subject": "Machine Learning"
    }
    
    response = requests.post(
        f"{BASE_URL}/ai/evaluate-quiz",
        headers=HEADERS,
        json=data
    )
    
    print_response(response)
    
    assert response.status_code == 200
    result = response.json()
    assert result["status"] == "success"
    assert "score" in result["data"]
    
    print(f"\n📊 Quiz Results:")
    print(f"   Score: {result['data']['score']}/{result['data']['total']}")
    print(f"   Percentage: {result['data']['percentage']}%")
    print(f"   Grade: {result['data']['grade']}")
    print("✅ Quiz evaluation passed!")


def test_roadmap_generation():
    """Test roadmap generation endpoint"""
    print_section("TEST 3: Roadmap Generation")
    
    data = {
        "userId": "test_user_123",
        "performance": {
            "AI": 65,
            "Math": 85,
            "Programming": 75,
            "DataScience": 70
        },
        "semester": 3,
        "interests": ["AI", "Machine Learning"],
        "targetCareer": "AI Engineer",
        "timeAvailable": 20
    }
    
    response = requests.post(
        f"{BASE_URL}/ai/generate-roadmap",
        headers=HEADERS,
        json=data
    )
    
    print_response(response)
    
    assert response.status_code == 200
    result = response.json()
    assert result["status"] == "success"
    assert "roadmap" in result["data"]
    
    print(f"\n📚 Roadmap Summary:")
    print(f"   Milestones: {result['data']['statistics']['totalMilestones']}")
    print(f"   Estimated Hours: {result['data']['statistics']['estimatedTotalHours']}")
    print("✅ Roadmap generation passed!")


def test_career_recommendation():
    """Test career recommendation endpoint"""
    print_section("TEST 4: Career Recommendation")
    
    data = {
        "scores": {
            "AI": 82,
            "Programming": 90,
            "Math": 78,
            "DataScience": 85
        },
        "interests": ["AI", "Research"],
        "skills": ["Python", "Machine Learning", "TensorFlow"],
        "semester": 4
    }
    
    response = requests.post(
        f"{BASE_URL}/ai/recommend-career",
        headers=HEADERS,
        json=data
    )
    
    print_response(response)
    
    assert response.status_code == 200
    result = response.json()
    assert result["status"] == "success"
    assert "recommendations" in result["data"]
    
    print(f"\n💼 Top 3 Career Recommendations:")
    for i, rec in enumerate(result["data"]["recommendations"][:3], 1):
        print(f"   {i}. {rec['career']} ({rec['confidence']:.1%} confidence)")
    print("✅ Career recommendation passed!")


def test_error_handling():
    """Test error handling"""
    print_section("TEST 5: Error Handling")
    
    print("\n📝 Testing missing data error...")
    response = requests.post(
        f"{BASE_URL}/ai/evaluate-quiz",
        headers=HEADERS,
        json={}
    )
    
    assert response.status_code == 400
    assert response.json()["status"] == "fail"
    print("✅ Missing data error handled correctly")
    
    print("\n📝 Testing invalid endpoint...")
    response = requests.get(f"{BASE_URL}/invalid-endpoint")
    
    assert response.status_code == 404
    print("✅ Invalid endpoint handled correctly")
    
    print("\n✅ Error handling tests passed!")


def run_all_tests():
    """Run all API tests"""
    print("\n" + "="*70)
    print("  LearnMate AI - API Test Suite")
    print("  " + datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    print("="*70)
    
    try:
        test_health_check()
        test_quiz_evaluation()
        test_roadmap_generation()
        test_career_recommendation()
        test_error_handling()
        
        print("\n" + "="*70)
        print("  ✅ ALL TESTS PASSED!")
        print("="*70 + "\n")
        
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Cannot connect to API server")
        print("   Make sure the server is running: python app.py")
        
    except AssertionError as e:
        print(f"\n❌ TEST FAILED: {str(e)}")
        
    except Exception as e:
        print(f"\n❌ UNEXPECTED ERROR: {str(e)}")


if __name__ == "__main__":
    run_all_tests()