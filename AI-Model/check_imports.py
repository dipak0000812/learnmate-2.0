"""
Diagnostic script to check imports and identify issues
"""

import sys
import os

print("="*60)
print("LearnMate AI - Import Diagnostic")
print("="*60)

# Check Python version
print(f"\n1. Python Version: {sys.version}")

# Check current directory
print(f"\n2. Current Directory: {os.getcwd()}")

# Check if models directory exists
models_dir = "models"
if os.path.exists(models_dir):
    print(f"\n3. ✓ Models directory exists")
    print(f"   Contents: {os.listdir(models_dir)}")
else:
    print(f"\n3. ✗ Models directory NOT found!")
    sys.exit(1)

# Check if __init__.py exists
init_file = os.path.join(models_dir, "__init__.py")
if os.path.exists(init_file):
    print(f"\n4. ✓ models/__init__.py exists")
else:
    print(f"\n4. ✗ models/__init__.py NOT found!")
    print("   Creating it now...")
    with open(init_file, 'w') as f:
        f.write('"""Models package"""\n')
    print("   ✓ Created models/__init__.py")

# Check required files
required_files = [
    "quiz_evaluator.py",
    "roadmap_generator.py",
    "career_recommender.py"
]

print("\n5. Checking required model files:")
for filename in required_files:
    filepath = os.path.join(models_dir, filename)
    if os.path.exists(filepath):
        size = os.path.getsize(filepath)
        print(f"   ✓ {filename} ({size} bytes)")
    else:
        print(f"   ✗ {filename} NOT FOUND!")

# Try importing modules one by one
print("\n6. Testing imports:")

try:
    print("   Attempting: from models.quiz_evaluator import QuizEvaluator")
    from models.quiz_evaluator import QuizEvaluator
    print("   ✓ QuizEvaluator imported successfully")
except Exception as e:
    print(f"   ✗ Error importing QuizEvaluator: {e}")
    print(f"   Error type: {type(e).__name__}")
    import traceback
    traceback.print_exc()

try:
    print("\n   Attempting: from models.roadmap_generator import RoadmapGenerator")
    from models.roadmap_generator import RoadmapGenerator
    print("   ✓ RoadmapGenerator imported successfully")
except Exception as e:
    print(f"   ✗ Error importing RoadmapGenerator: {e}")

try:
    print("\n   Attempting: from models.career_recommender import CareerRecommender")
    from models.career_recommender import CareerRecommender
    print("   ✓ CareerRecommender imported successfully")
except Exception as e:
    print(f"   ✗ Error importing CareerRecommender: {e}")

# Check Flask installation
print("\n7. Checking Flask installation:")
try:
    import flask
    print(f"   ✓ Flask version: {flask.__version__}")
except ImportError:
    print("   ✗ Flask not installed!")

print("\n" + "="*60)
print("Diagnostic Complete")
print("="*60)