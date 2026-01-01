import joblib
import os
import sys

# Path to the model
# Assuming we run this from AI-Model directory
model_path = os.path.join('models', 'saved', 'career_model.pkl')
print(f"Testing model load from: {os.path.abspath(model_path)}")

if not os.path.exists(model_path):
    print("❌ File NOT FOUND at path!")
    # Try finding it relative to this script if moved
    sys.exit(1)

try:
    print("Attempting joblib.load...")
    data = joblib.load(model_path)
    print("✅ Model Data Loaded!")
    print(f"Keys: {data.keys()}")
    
    model = data.get('model')
    if model:
        print(f"✅ contained 'model': {type(model)}")
    else:
        print("❌ 'model' key missing")

    scaler = data.get('scaler')
    if scaler:
        print(f"✅ contained 'scaler': {type(scaler)}")
        
except Exception as e:
    print(f"❌ FAILED to load model: {e}")
    import traceback
    traceback.print_exc()
