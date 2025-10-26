"""
Quick fix script to resolve import issues
Run this if you're having import errors
"""

import os
import sys

print("LearnMate AI - Import Fix Script")
print("="*60)

# 1. Ensure models/__init__.py exists and is correct
print("\n1. Fixing models/__init__.py...")
models_init_content = '''"""
LearnMate AI Models Package
"""

# This file makes the models directory a Python package
# No imports needed here if importing directly in app.py
'''

os.makedirs("models", exist_ok=True)
with open("models/__init__.py", "w", encoding="utf-8") as f:
    f.write(models_init_content)
print("   ✓ models/__init__.py created")

# 2. Ensure models/saved directory exists
print("\n2. Creating models/saved directory...")
os.makedirs("models/saved", exist_ok=True)
print("   ✓ models/saved/ created")

# 3. Ensure data directory exists
print("\n3. Creating data directory...")
os.makedirs("data", exist_ok=True)
print("   ✓ data/ created")

# 4. Check if model files exist
print("\n4. Checking model files...")
required_files = [
    "models/quiz_evaluator.py",
    "models/roadmap_generator.py",
    "models/career_recommender.py",
    "train_models.py",
    "utils.py",
    "app.py"
]

missing_files = []
for filepath in required_files:
    if os.path.exists(filepath):
        size = os.path.getsize(filepath)
        print(f"   ✓ {filepath} ({size:,} bytes)")
    else:
        print(f"   ✗ {filepath} MISSING!")
        missing_files.append(filepath)

if missing_files:
    print("\n⚠ WARNING: Some files are missing!")
    print("   Please copy these files from the artifacts:")
    for f in missing_files:
        print(f"   - {f}")
    print("\n   All Python files should be copied from the Claude artifacts.")
else:
    print("\n✓ All required files present!")

# 5. Test imports
print("\n5. Testing imports...")
sys.path.insert(0, os.getcwd())

try:
    from models.quiz_evaluator import QuizEvaluator
    print("   ✓ QuizEvaluator can be imported")
except ImportError as e:
    print(f"   ✗ Cannot import QuizEvaluator: {e}")
    print("   → Please verify models/quiz_evaluator.py contains the QuizEvaluator class")
except SyntaxError as e:
    print(f"   ✗ Syntax error in quiz_evaluator.py: {e}")
    print("   → Check the file for syntax errors")

try:
    from models.roadmap_generator import RoadmapGenerator
    print("   ✓ RoadmapGenerator can be imported")
except ImportError as e:
    print(f"   ✗ Cannot import RoadmapGenerator: {e}")

try:
    from models.career_recommender import CareerRecommender
    print("   ✓ CareerRecommender can be imported")
except ImportError as e:
    print(f"   ✗ Cannot import CareerRecommender: {e}")

print("\n" + "="*60)
print("Fix script complete!")
print("="*60)
print("\nIf imports still fail, please:")
print("1. Make sure all .py files are properly copied from artifacts")
print("2. Check for any copy-paste issues (missing code)")
print("3. Verify file encoding is UTF-8")
print("4. Run: python check_imports.py")
print("5. Then try: python app.py")