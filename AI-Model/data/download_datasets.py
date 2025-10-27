"""
Dataset Downloader and Processor
Downloads real public datasets and prepares them for training
"""

import pandas as pd
import numpy as np
import requests
import zipfile
import io
import os
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DatasetDownloader:
    """Download and process public educational datasets"""
    
    def __init__(self, data_dir='data/external'):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(parents=True, exist_ok=True)
        
    def download_uci_student_performance(self):
        """
        Download UCI Student Performance Dataset
        https://archive.ics.uci.edu/ml/datasets/student+performance
        """
        logger.info("Downloading UCI Student Performance Dataset...")
        
        url = "https://archive.ics.uci.edu/ml/machine-learning-databases/00320/student.zip"
        
        try:
            response = requests.get(url, timeout=30)
            
            # Extract zip file
            with zipfile.ZipFile(io.BytesIO(response.content)) as z:
                z.extractall(self.data_dir / 'uci_student')
            
            # Load both datasets
            math_df = pd.read_csv(self.data_dir / 'uci_student/student-mat.csv', sep=';')
            port_df = pd.read_csv(self.data_dir / 'uci_student/student-por.csv', sep=';')
            
            logger.info(f"✓ UCI Math dataset: {len(math_df)} records")
            logger.info(f"✓ UCI Portuguese dataset: {len(port_df)} records")
            
            return math_df, port_df
            
        except Exception as e:
            logger.error(f"Error downloading UCI dataset: {e}")
            return None, None
    
    def download_kaggle_student_performance(self):
        """
        Download Kaggle Students Performance Dataset
        Note: Requires Kaggle API or manual download
        """
        logger.info("Checking for Kaggle dataset...")
        
        # Check if manually downloaded
        kaggle_path = self.data_dir / 'StudentsPerformance.csv'
        
        if kaggle_path.exists():
            df = pd.read_csv(kaggle_path)
            logger.info(f"✓ Kaggle dataset loaded: {len(df)} records")
            return df
        else:
            logger.warning("Kaggle dataset not found. Please download manually from:")
            logger.warning("https://www.kaggle.com/datasets/spscientist/students-performance-in-exams")
            logger.warning(f"And place in: {kaggle_path}")
            return None
    
    def create_career_mapping_dataset(self):
        """
        Create a realistic career dataset based on industry standards
        Maps skills and performance to tech careers
        """
        logger.info("Creating career mapping dataset...")
        
        # Career profiles with realistic requirements
        career_profiles = {
            'AI Engineer': {
                'min_ai': 75, 'min_programming': 75, 'min_math': 70,
                'skills': ['python', 'tensorflow', 'pytorch', 'ml'],
                'count': 250
            },
            'Data Scientist': {
                'min_ai': 70, 'min_programming': 70, 'min_math': 75,
                'skills': ['python', 'statistics', 'sql', 'r'],
                'count': 250
            },
            'Machine Learning Engineer': {
                'min_ai': 80, 'min_programming': 80, 'min_math': 75,
                'skills': ['python', 'ml', 'docker', 'cloud'],
                'count': 200
            },
            'Software Engineer': {
                'min_ai': 50, 'min_programming': 75, 'min_math': 60,
                'skills': ['programming', 'algorithms', 'git', 'testing'],
                'count': 300
            },
            'Full Stack Developer': {
                'min_ai': 45, 'min_programming': 70, 'min_math': 55,
                'skills': ['javascript', 'react', 'nodejs', 'databases'],
                'count': 280
            },
            'Data Analyst': {
                'min_ai': 60, 'min_programming': 60, 'min_math': 70,
                'skills': ['excel', 'sql', 'tableau', 'statistics'],
                'count': 250
            },
            'DevOps Engineer': {
                'min_ai': 50, 'min_programming': 75, 'min_math': 60,
                'skills': ['docker', 'kubernetes', 'ci_cd', 'linux'],
                'count': 200
            },
            'Research Scientist': {
                'min_ai': 85, 'min_programming': 70, 'min_math': 85,
                'skills': ['research', 'python', 'mathematics', 'ml'],
                'count': 150
            },
            'Business Intelligence Analyst': {
                'min_ai': 60, 'min_programming': 65, 'min_math': 70,
                'skills': ['sql', 'powerbi', 'business', 'analytics'],
                'count': 200
            },
            'Cybersecurity Analyst': {
                'min_ai': 55, 'min_programming': 75, 'min_math': 65,
                'skills': ['security', 'networking', 'python', 'pentesting'],
                'count': 180
            }
        }
        
        data = []
        
        for career, profile in career_profiles.items():
            for _ in range(profile['count']):
                # Generate realistic scores around minimums with variance
                ai_score = np.clip(np.random.normal(profile['min_ai'] + 10, 12), 40, 100)
                prog_score = np.clip(np.random.normal(profile['min_programming'] + 10, 12), 40, 100)
                math_score = np.clip(np.random.normal(profile['min_math'] + 10, 12), 40, 100)
                ds_score = np.clip(np.random.normal((ai_score + math_score) / 2, 10), 40, 100)
                web_score = np.clip(np.random.normal(70 if 'web' in career.lower() else 60, 15), 40, 100)
                
                # Interest flags based on career
                interest_ai = 1 if 'AI' in career or 'ML' in career or 'Data' in career else np.random.choice([0, 1], p=[0.7, 0.3])
                interest_data = 1 if 'Data' in career or 'Analytics' in career else np.random.choice([0, 1], p=[0.6, 0.4])
                interest_web = 1 if 'Web' in career or 'Full Stack' in career else np.random.choice([0, 1], p=[0.7, 0.3])
                interest_research = 1 if 'Research' in career else np.random.choice([0, 1], p=[0.8, 0.2])
                
                # Skills based on career profile
                skill_python = 1 if 'python' in profile['skills'] else np.random.choice([0, 1], p=[0.5, 0.5])
                skill_web_tech = 1 if any(s in ['javascript', 'react', 'nodejs'] for s in profile['skills']) else np.random.choice([0, 1], p=[0.6, 0.4])
                skill_ml = 1 if any(s in ['ml', 'tensorflow', 'pytorch'] for s in profile['skills']) else np.random.choice([0, 1], p=[0.7, 0.3])
                
                # Random semester
                semester = np.random.randint(1, 9)
                
                data.append({
                    'avg_ai_score': ai_score,
                    'avg_programming_score': prog_score,
                    'avg_math_score': math_score,
                    'avg_datascience_score': ds_score,
                    'avg_webdev_score': web_score,
                    'interest_ai': interest_ai,
                    'interest_data': interest_data,
                    'interest_web': interest_web,
                    'interest_research': interest_research,
                    'skill_python': skill_python,
                    'skill_web_tech': skill_web_tech,
                    'skill_ml': skill_ml,
                    'semester': semester,
                    'career': career
                })
        
        df = pd.DataFrame(data)
        logger.info(f"✓ Created career dataset: {len(df)} records")
        
        return df
    
    def process_uci_to_learnmate_format(self, math_df, port_df):
        """
        Convert UCI dataset to LearnMate format
        Maps UCI features to our career prediction features
        """
        if math_df is None or port_df is None:
            return None
        
        logger.info("Processing UCI dataset to LearnMate format...")
        
        # Combine datasets
        math_df['subject'] = 'Mathematics'
        port_df['subject'] = 'Portuguese'
        combined = pd.concat([math_df, port_df], ignore_index=True)
        
        # Map UCI features to LearnMate features
        processed_data = []
        
        for _, row in combined.iterrows():
            # Calculate average scores (G1, G2, G3 are grades)
            avg_score = (row['G1'] + row['G2'] + row['G3']) / 3
            normalized_score = (avg_score / 20) * 100  # UCI uses 0-20 scale
            
            # Map to our subjects (with some intelligent guessing)
            math_score = normalized_score if row['subject'] == 'Mathematics' else normalized_score * 0.9
            programming_score = normalized_score * 0.85 if row.get('internet', 'no') == 'yes' else normalized_score * 0.7
            
            # Infer interests from study time and activities
            study_time = row.get('studytime', 2)
            
            processed_data.append({
                'avg_ai_score': normalized_score * 0.8,
                'avg_programming_score': programming_score,
                'avg_math_score': math_score,
                'avg_datascience_score': normalized_score * 0.85,
                'avg_webdev_score': normalized_score * 0.75,
                'interest_ai': 1 if study_time >= 3 else 0,
                'interest_data': 1 if row.get('higher', 'no') == 'yes' else 0,
                'interest_web': 1 if row.get('internet', 'no') == 'yes' else 0,
                'interest_research': 1 if row.get('higher', 'no') == 'yes' and study_time >= 3 else 0,
                'skill_python': 1 if programming_score > 70 else 0,
                'skill_web_tech': 1 if row.get('internet', 'no') == 'yes' else 0,
                'skill_ml': 1 if math_score > 75 and study_time >= 3 else 0,
                'semester': np.random.randint(1, 9),
                # Assign career based on scores and interests
                'career': self._assign_career_from_profile(normalized_score, study_time, row)
            })
        
        df = pd.DataFrame(processed_data)
        logger.info(f"✓ Processed UCI data: {len(df)} records")
        
        return df
    
    def _assign_career_from_profile(self, score, study_time, row):
        """Intelligently assign career based on student profile"""
        
        if score >= 80 and study_time >= 3 and row.get('higher', 'no') == 'yes':
            return np.random.choice(['AI Engineer', 'Data Scientist', 'Research Scientist'], p=[0.4, 0.4, 0.2])
        elif score >= 75 and study_time >= 2:
            return np.random.choice(['Machine Learning Engineer', 'Software Engineer', 'Data Scientist'], p=[0.3, 0.4, 0.3])
        elif score >= 65:
            return np.random.choice(['Software Engineer', 'Data Analyst', 'Full Stack Developer'], p=[0.3, 0.3, 0.4])
        else:
            return np.random.choice(['Full Stack Developer', 'Business Intelligence Analyst', 'DevOps Engineer'], p=[0.4, 0.3, 0.3])
    
    def combine_all_datasets(self):
        """
        Download and combine all available datasets
        """
        logger.info("="*60)
        logger.info("Downloading and Processing All Datasets")
        logger.info("="*60)
        
        datasets = []
        
        # 1. Download UCI dataset
        math_df, port_df = self.download_uci_student_performance()
        if math_df is not None:
            uci_processed = self.process_uci_to_learnmate_format(math_df, port_df)
            if uci_processed is not None:
                datasets.append(uci_processed)
        
        # 2. Check for Kaggle dataset
        kaggle_df = self.download_kaggle_student_performance()
        # Process Kaggle dataset if available (implement similar to UCI)
        
        # 3. Create synthetic career data
        career_df = self.create_career_mapping_dataset()
        datasets.append(career_df)
        
        # Combine all datasets
        if datasets:
            combined_df = pd.concat(datasets, ignore_index=True)
            
            # Remove duplicates and shuffle
            combined_df = combined_df.drop_duplicates()
            combined_df = combined_df.sample(frac=1, random_state=42).reset_index(drop=True)
            
            # Save combined dataset
            output_path = self.data_dir.parent / 'real_training_data.csv'
            combined_df.to_csv(output_path, index=False)
            
            logger.info("="*60)
            logger.info(f"✓ Combined dataset created: {len(combined_df)} total records")
            logger.info(f"✓ Saved to: {output_path}")
            logger.info("="*60)
            
            # Show distribution
            logger.info("\nCareer Distribution:")
            print(combined_df['career'].value_counts())
            
            return combined_df
        else:
            logger.error("No datasets were successfully downloaded")
            return None


if __name__ == "__main__":
    downloader = DatasetDownloader()
    combined_data = downloader.combine_all_datasets()
    
    if combined_data is not None:
        print("\n✅ Dataset preparation complete!")
        print(f"Total records: {len(combined_data)}")
        print(f"\nSample data:")
        print(combined_data.head())