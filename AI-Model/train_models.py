"""
Model Training Script for LearnMate AI
Trains and saves ML models for career recommendation
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import joblib
import os
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ModelTrainer:
    """Train and evaluate ML models for LearnMate"""
    
    def __init__(self):
        self.models_dir = 'models/saved'
        self.data_dir = 'data'
        os.makedirs(self.models_dir, exist_ok=True)
        os.makedirs(self.data_dir, exist_ok=True)
    
    def generate_synthetic_data(self, n_samples=2000):
        """
        Generate realistic synthetic student data for training
        
        Creates dataset with:
        - Subject scores
        - Interest flags
        - Skill indicators
        - Career labels
        """
        logger.info(f"Generating {n_samples} synthetic student records...")
        
        np.random.seed(42)
        
        data = {
            'avg_ai_score': [],
            'avg_programming_score': [],
            'avg_math_score': [],
            'avg_datascience_score': [],
            'avg_webdev_score': [],
            'interest_ai': [],
            'interest_data': [],
            'interest_web': [],
            'interest_research': [],
            'skill_python': [],
            'skill_web_tech': [],
            'skill_ml': [],
            'semester': [],
            'career': []
        }
        
        careers = [
            'AI Engineer',
            'Data Scientist', 
            'Machine Learning Engineer',
            'Software Engineer',
            'Full Stack Developer',
            'Data Analyst',
            'Research Scientist',
            'Business Intelligence Analyst',
            'DevOps Engineer',
            'Cybersecurity Analyst'
        ]
        
        for _ in range(n_samples):
            # Randomly select a career
            career = np.random.choice(careers)
            
            # Generate scores based on career path (with realistic correlations)
            if career == 'AI Engineer':
                ai_score = np.random.normal(82, 10)
                prog_score = np.random.normal(80, 12)
                math_score = np.random.normal(78, 10)
                ds_score = np.random.normal(75, 12)
                web_score = np.random.normal(60, 15)
                interest_ai, interest_data, interest_web, interest_research = 1, 1, 0, 0
                skill_python, skill_web, skill_ml = 1, 0, 1
                
            elif career == 'Data Scientist':
                ai_score = np.random.normal(75, 12)
                prog_score = np.random.normal(78, 10)
                math_score = np.random.normal(82, 10)
                ds_score = np.random.normal(85, 8)
                web_score = np.random.normal(62, 15)
                interest_ai, interest_data, interest_web, interest_research = 0, 1, 0, 0
                skill_python, skill_web, skill_ml = 1, 0, 1
                
            elif career == 'Machine Learning Engineer':
                ai_score = np.random.normal(85, 8)
                prog_score = np.random.normal(88, 8)
                math_score = np.random.normal(80, 10)
                ds_score = np.random.normal(78, 10)
                web_score = np.random.normal(65, 15)
                interest_ai, interest_data, interest_web, interest_research = 1, 1, 0, 0
                skill_python, skill_web, skill_ml = 1, 0, 1
                
            elif career == 'Software Engineer':
                ai_score = np.random.normal(65, 15)
                prog_score = np.random.normal(85, 10)
                math_score = np.random.normal(72, 12)
                ds_score = np.random.normal(68, 15)
                web_score = np.random.normal(70, 12)
                interest_ai, interest_data, interest_web, interest_research = 0, 0, 0, 0
                skill_python, skill_web, skill_ml = 1, 1, 0
                
            elif career == 'Full Stack Developer':
                ai_score = np.random.normal(60, 15)
                prog_score = np.random.normal(80, 10)
                math_score = np.random.normal(68, 12)
                ds_score = np.random.normal(65, 15)
                web_score = np.random.normal(88, 8)
                interest_ai, interest_data, interest_web, interest_research = 0, 0, 1, 0
                skill_python, skill_web, skill_ml = 1, 1, 0
                
            elif career == 'Data Analyst':
                ai_score = np.random.normal(62, 15)
                prog_score = np.random.normal(70, 12)
                math_score = np.random.normal(78, 10)
                ds_score = np.random.normal(82, 10)
                web_score = np.random.normal(60, 15)
                interest_ai, interest_data, interest_web, interest_research = 0, 1, 0, 0
                skill_python, skill_web, skill_ml = 1, 0, 0
                
            elif career == 'Research Scientist':
                ai_score = np.random.normal(88, 8)
                prog_score = np.random.normal(75, 12)
                math_score = np.random.normal(90, 6)
                ds_score = np.random.normal(80, 10)
                web_score = np.random.normal(55, 18)
                interest_ai, interest_data, interest_web, interest_research = 1, 1, 0, 1
                skill_python, skill_web, skill_ml = 1, 0, 1
                
            elif career == 'Business Intelligence Analyst':
                ai_score = np.random.normal(65, 15)
                prog_score = np.random.normal(72, 12)
                math_score = np.random.normal(75, 12)
                ds_score = np.random.normal(80, 10)
                web_score = np.random.normal(62, 15)
                interest_ai, interest_data, interest_web, interest_research = 0, 1, 0, 0
                skill_python, skill_web, skill_ml = 1, 0, 0
                
            elif career == 'DevOps Engineer':
                ai_score = np.random.normal(62, 15)
                prog_score = np.random.normal(85, 10)
                math_score = np.random.normal(70, 12)
                ds_score = np.random.normal(68, 15)
                web_score = np.random.normal(75, 12)
                interest_ai, interest_data, interest_web, interest_research = 0, 0, 1, 0
                skill_python, skill_web, skill_ml = 1, 1, 0
                
            else:  # Cybersecurity Analyst
                ai_score = np.random.normal(65, 15)
                prog_score = np.random.normal(82, 10)
                math_score = np.random.normal(75, 12)
                ds_score = np.random.normal(70, 15)
                web_score = np.random.normal(72, 12)
                interest_ai, interest_data, interest_web, interest_research = 0, 0, 0, 0
                skill_python, skill_web, skill_ml = 1, 0, 0
            
            # Clip scores to realistic range [40, 100]
            ai_score = np.clip(ai_score, 40, 100)
            prog_score = np.clip(prog_score, 40, 100)
            math_score = np.clip(math_score, 40, 100)
            ds_score = np.clip(ds_score, 40, 100)
            web_score = np.clip(web_score, 40, 100)
            
            # Random semester
            semester = np.random.randint(1, 9)
            
            # Add noise to interests and skills (not everyone fits perfectly)
            if np.random.random() < 0.15:
                interest_ai = 1 - interest_ai
            if np.random.random() < 0.15:
                interest_data = 1 - interest_data
            if np.random.random() < 0.15:
                interest_web = 1 - interest_web
            
            # Store data
            data['avg_ai_score'].append(ai_score)
            data['avg_programming_score'].append(prog_score)
            data['avg_math_score'].append(math_score)
            data['avg_datascience_score'].append(ds_score)
            data['avg_webdev_score'].append(web_score)
            data['interest_ai'].append(interest_ai)
            data['interest_data'].append(interest_data)
            data['interest_web'].append(interest_web)
            data['interest_research'].append(interest_research)
            data['skill_python'].append(skill_python)
            data['skill_web_tech'].append(skill_web)
            data['skill_ml'].append(skill_ml)
            data['semester'].append(semester)
            data['career'].append(career)
        
        df = pd.DataFrame(data)
        
        # Save to CSV
        csv_path = os.path.join(self.data_dir, 'mock_students.csv')
        df.to_csv(csv_path, index=False)
        logger.info(f"Synthetic data saved to {csv_path}")
        
        return df
    
    def train_career_model(self, df):
        """
        Train Random Forest model for career prediction
        """
        logger.info("Training career recommendation model...")
        
        # Prepare features and labels
        feature_columns = [
            'avg_ai_score', 'avg_programming_score', 'avg_math_score',
            'avg_datascience_score', 'avg_webdev_score',
            'interest_ai', 'interest_data', 'interest_web', 'interest_research',
            'skill_python', 'skill_web_tech', 'skill_ml', 'semester'
        ]
        
        X = df[feature_columns]
        y = df['career']
        
        # Encode labels
        label_encoder = LabelEncoder()
        y_encoded = label_encoder.fit_transform(y)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
        )
        
        # Scale features
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        # Train Random Forest
        logger.info("Training Random Forest classifier...")
        rf_model = RandomForestClassifier(
            n_estimators=200,
            max_depth=15,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        )
        
        rf_model.fit(X_train_scaled, y_train)
        
        # Evaluate
        y_pred = rf_model.predict(X_test_scaled)
        accuracy = accuracy_score(y_test, y_pred)
        
        logger.info(f"Model Accuracy: {accuracy:.4f}")
        
        # Cross-validation
        cv_scores = cross_val_score(rf_model, X_train_scaled, y_train, cv=5)
        logger.info(f"Cross-validation scores: {cv_scores}")
        logger.info(f"Mean CV Score: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
        
        # Classification report
        logger.info("\nClassification Report:")
        print(classification_report(y_test, y_pred, target_names=label_encoder.classes_))
        
        # Feature importance
        feature_importance = pd.DataFrame({
            'feature': feature_columns,
            'importance': rf_model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        logger.info("\nTop 10 Important Features:")
        print(feature_importance.head(10))
        
        # Save model
        model_path = os.path.join(self.models_dir, 'career_model.pkl')
        model_data = {
            'model': rf_model,
            'scaler': scaler,
            'label_encoder': label_encoder,
            'feature_names': feature_columns,
            'accuracy': accuracy,
            'cv_scores': cv_scores,
            'trained_at': datetime.utcnow().isoformat()
        }
        
        joblib.dump(model_data, model_path)
        logger.info(f"Model saved to {model_path}")
        
        return rf_model, scaler, label_encoder
    
    def train_all_models(self):
        """
        Main training pipeline
        """
        logger.info("="*60)
        logger.info("LearnMate AI - Model Training Pipeline")
        logger.info("="*60)
        
        # Generate synthetic data
        df = self.generate_synthetic_data(n_samples=2000)
        
        logger.info(f"\nDataset Info:")
        logger.info(f"Total samples: {len(df)}")
        logger.info(f"Features: {df.shape[1]}")
        logger.info(f"\nCareer distribution:")
        print(df['career'].value_counts())
        
        # Train career model
        rf_model, scaler, label_encoder = self.train_career_model(df)
        
        logger.info("\n" + "="*60)
        logger.info("Training Complete!")
        logger.info("="*60)
        logger.info(f"Models saved in: {self.models_dir}")
        logger.info(f"Data saved in: {self.data_dir}")


if __name__ == "__main__":
    trainer = ModelTrainer()
    trainer.train_all_models()