"""
Improved Data Processor with Advanced Feature Engineering
Handles imbalanced data and creates better features
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE
from collections import Counter
import logging

logger = logging.getLogger(__name__)


class ImprovedDataProcessor:
    """
    Advanced data processing with feature engineering and balancing
    """
    
    def __init__(self):
        self.scaler = StandardScaler()
        
    def engineer_features(self, df):
        """
        Create advanced features from raw data
        """
        logger.info("Engineering advanced features...")
        
        df = df.copy()
        
        # 1. Overall academic performance metrics
        score_columns = [col for col in df.columns if 'score' in col]
        df['overall_avg'] = df[score_columns].mean(axis=1)
        df['score_variance'] = df[score_columns].std(axis=1)
        df['min_score'] = df[score_columns].min(axis=1)
        df['max_score'] = df[score_columns].max(axis=1)
        df['score_range'] = df['max_score'] - df['min_score']
        
        # 2. Domain-specific strengths
        df['tech_strength'] = (df['avg_ai_score'] + df['avg_programming_score']) / 2
        df['analytical_strength'] = (df['avg_math_score'] + df['avg_datascience_score']) / 2
        df['practical_strength'] = (df['avg_programming_score'] + df['avg_webdev_score']) / 2
        
        # 3. Career inclination indicators
        df['research_oriented'] = (
            (df['avg_math_score'] > 75) & 
            (df['interest_research'] == 1) & 
            (df['avg_ai_score'] > 75)
        ).astype(int)
        
        df['engineering_oriented'] = (
            (df['avg_programming_score'] > 75) & 
            (df['skill_python'] == 1)
        ).astype(int)
        
        df['web_oriented'] = (
            (df['avg_webdev_score'] > 70) & 
            (df['interest_web'] == 1) & 
            (df['skill_web_tech'] == 1)
        ).astype(int)
        
        df['data_oriented'] = (
            (df['avg_datascience_score'] > 70) & 
            (df['interest_data'] == 1)
        ).astype(int)
        
        # 4. Skill-interest alignment
        df['ai_alignment'] = df['interest_ai'] * df['skill_ml'] * (df['avg_ai_score'] / 100)
        df['web_alignment'] = df['interest_web'] * df['skill_web_tech'] * (df['avg_webdev_score'] / 100)
        df['data_alignment'] = df['interest_data'] * (df['avg_datascience_score'] / 100)
        
        # 5. Experience level indicators
        df['is_beginner'] = (df['semester'] <= 2).astype(int)
        df['is_intermediate'] = ((df['semester'] > 2) & (df['semester'] <= 6)).astype(int)
        df['is_advanced'] = (df['semester'] > 6).astype(int)
        
        # 6. Polynomial features for key scores
        df['ai_programming_interaction'] = df['avg_ai_score'] * df['avg_programming_score'] / 100
        df['math_ai_interaction'] = df['avg_math_score'] * df['avg_ai_score'] / 100
        df['programming_squared'] = (df['avg_programming_score'] ** 2) / 100
        
        # 7. Percentile rankings (relative performance)
        for col in score_columns:
            df[f'{col}_percentile'] = df[col].rank(pct=True)
        
        logger.info(f"✓ Created {len(df.columns) - len(score_columns) - 8} new features")
        
        return df
    
    def balance_dataset(self, X, y, strategy='auto'):
        """
        Balance dataset using SMOTE (Synthetic Minority Over-sampling)
        """
        logger.info("Balancing dataset with SMOTE...")
        
        # Check class distribution
        class_counts = Counter(y)
        logger.info(f"Original distribution: {dict(class_counts)}")
        
        # Calculate minimum samples needed for SMOTE (at least 2)
        min_samples = min(class_counts.values())
        k_neighbors = min(5, min_samples - 1) if min_samples > 1 else 1
        
        if min_samples > 1:
            try:
                # Apply SMOTE
                smote = SMOTE(
                    sampling_strategy=strategy,
                    k_neighbors=max(1, k_neighbors),
                    random_state=42
                )
                X_balanced, y_balanced = smote.fit_resample(X, y)
                
                # Check new distribution
                new_counts = Counter(y_balanced)
                logger.info(f"Balanced distribution: {dict(new_counts)}")
                logger.info(f"✓ Dataset balanced: {len(X)} → {len(X_balanced)} samples")
                
                return X_balanced, y_balanced
            except Exception as e:
                logger.warning(f"SMOTE failed: {e}. Using original data.")
                return X, y
        else:
            logger.warning("Not enough samples for SMOTE. Using original data.")
            return X, y
    
    def remove_outliers(self, df, columns, n_std=3):
        """
        Remove outliers using z-score method
        """
        logger.info("Removing outliers...")
        original_len = len(df)
        
        for col in columns:
            if col in df.columns:
                z_scores = np.abs((df[col] - df[col].mean()) / df[col].std())
                df = df[z_scores < n_std]
        
        removed = original_len - len(df)
        logger.info(f"✓ Removed {removed} outliers ({removed/original_len*100:.1f}%)")
        
        return df
    
    def improve_career_assignments(self, df):
        """
        Improve career assignments using better logic
        """
        logger.info("Improving career assignments...")
        
        improved_careers = []
        
        for idx, row in df.iterrows():
            # Calculate domain strengths
            ai_strength = row['avg_ai_score']
            prog_strength = row['avg_programming_score']
            math_strength = row['avg_math_score']
            ds_strength = row['avg_datascience_score']
            web_strength = row['avg_webdev_score']
            
            # Decision tree for better career matching
            if row['interest_research'] == 1 and ai_strength > 80 and math_strength > 80:
                career = 'Research Scientist'
            
            elif ai_strength > 78 and prog_strength > 78 and row['skill_ml'] == 1:
                if prog_strength > ai_strength:
                    career = 'Machine Learning Engineer'
                else:
                    career = 'AI Engineer'
            
            elif ds_strength > 75 and math_strength > 72:
                if prog_strength > 75:
                    career = 'Data Scientist'
                else:
                    career = 'Data Analyst'
            
            elif web_strength > 75 and row['interest_web'] == 1:
                if prog_strength > 75:
                    career = 'Full Stack Developer'
                else:
                    career = 'Full Stack Developer'
            
            elif prog_strength > 78:
                if ai_strength > 70:
                    career = 'Software Engineer'
                elif web_strength > 70:
                    career = 'DevOps Engineer'
                else:
                    career = 'Software Engineer'
            
            elif ds_strength > 70 and math_strength > 65:
                career = 'Business Intelligence Analyst'
            
            elif prog_strength > 72 and math_strength > 70:
                career = 'Cybersecurity Analyst'
            
            else:
                # Default assignment based on highest score
                scores = {
                    'AI Engineer': ai_strength,
                    'Software Engineer': prog_strength,
                    'Data Analyst': ds_strength,
                    'Full Stack Developer': web_strength
                }
                career = max(scores, key=scores.get)
            
            improved_careers.append(career)
        
        df['career'] = improved_careers
        
        logger.info("✓ Career assignments improved")
        logger.info(f"Career distribution:\n{df['career'].value_counts()}")
        
        return df
    
    def process_full_pipeline(self, df, balance_data=True, remove_outliers_flag=True):
        """
        Complete data processing pipeline
        """
        logger.info("="*60)
        logger.info("ADVANCED DATA PROCESSING PIPELINE")
        logger.info("="*60)
        
        # Step 1: Improve career assignments
        df = self.improve_career_assignments(df)
        
        # Step 2: Remove outliers
        if remove_outliers_flag:
            score_columns = [col for col in df.columns if 'score' in col and 'avg' in col]
            df = self.remove_outliers(df, score_columns)
        
        # Step 3: Feature engineering
        df = self.engineer_features(df)
        
        # Step 4: Prepare features and target
        X = df.drop('career', axis=1)
        y = df['career']
        
        # Step 5: Balance dataset
        if balance_data:
            X, y = self.balance_dataset(X, y, strategy='auto')
        
        logger.info("="*60)
        logger.info(f"✓ Processing complete: {len(X)} samples ready for training")
        logger.info("="*60)
        
        return X, y, df


if __name__ == "__main__":
    # Test the processor
    logging.basicConfig(level=logging.INFO)
    
    # Load data
    df = pd.read_csv('real_training_data.csv')
    
    # Process
    processor = ImprovedDataProcessor()
    X, y, processed_df = processor.process_full_pipeline(df)
    
    print(f"\nProcessed dataset shape: {X.shape}")
    print(f"Number of features: {X.shape[1]}")
    print(f"\nSample features:\n{X.head()}")