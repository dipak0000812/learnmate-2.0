"""
Personalized Quiz Generator for LearnMate AI
Generates custom quizzes based on student performance and weak areas
"""

import random
import json
import os
import logging
from collections import defaultdict

logger = logging.getLogger(__name__)


class QuizGenerator:
    """
    Generate personalized quizzes based on student performance
    """
    
    def __init__(self, question_bank_file='data/question_bank.json'):
        self.question_bank_file = question_bank_file
        self.question_bank = self._load_question_bank()
    
    def _load_question_bank(self):
        """Load or create question bank"""
        if os.path.exists(self.question_bank_file):
            try:
                with open(self.question_bank_file, 'r') as f:
                    return json.load(f)
            except:
                pass
        
        # Create default question bank
        return self._create_default_question_bank()
    
    def _create_default_question_bank(self):
        """Create a comprehensive default question bank"""
        bank = {
            "AI": {
                "easy": [
                    {
                        "question": "What does AI stand for?",
                        "options": ["Artificial Intelligence", "Automated Intelligence", "Advanced Integration", "Algorithmic Implementation"],
                        "answer": "Artificial Intelligence",
                        "topic": "AI Basics"
                    },
                    {
                        "question": "Which of the following is a type of machine learning?",
                        "options": ["Supervised Learning", "Random Learning", "Passive Learning", "Static Learning"],
                        "answer": "Supervised Learning",
                        "topic": "ML Types"
                    }
                ],
                "medium": [
                    {
                        "question": "What is the purpose of a neural network activation function?",
                        "options": ["Introduce non-linearity", "Store weights", "Calculate loss", "Normalize data"],
                        "answer": "Introduce non-linearity",
                        "topic": "Neural Networks"
                    },
                    {
                        "question": "Which algorithm is commonly used for classification tasks?",
                        "options": ["Decision Tree", "K-means", "PCA", "Linear Regression"],
                        "answer": "Decision Tree",
                        "topic": "ML Algorithms"
                    }
                ],
                "hard": [
                    {
                        "question": "Explain the concept of backpropagation in neural networks.",
                        "answer": "Backpropagation is an algorithm for computing gradients of the loss function with respect to the weights by propagating errors backward through the network layers",
                        "topic": "Deep Learning",
                        "type": "subjective"
                    },
                    {
                        "question": "What is the vanishing gradient problem?",
                        "answer": "The vanishing gradient problem occurs when gradients become extremely small during backpropagation in deep networks, making it difficult to train earlier layers",
                        "topic": "Deep Learning",
                        "type": "subjective"
                    }
                ]
            },
            "Programming": {
                "easy": [
                    {
                        "question": "What is a variable in programming?",
                        "options": ["A container for storing data", "A function", "A loop", "A class"],
                        "answer": "A container for storing data",
                        "topic": "Programming Basics"
                    },
                    {
                        "question": "Which data structure follows LIFO principle?",
                        "options": ["Stack", "Queue", "Array", "Tree"],
                        "answer": "Stack",
                        "topic": "Data Structures"
                    }
                ],
                "medium": [
                    {
                        "question": "What is time complexity of binary search?",
                        "options": ["O(log n)", "O(n)", "O(n²)", "O(1)"],
                        "answer": "O(log n)",
                        "topic": "Algorithms"
                    },
                    {
                        "question": "What is polymorphism in OOP?",
                        "options": ["Ability to take multiple forms", "Hiding data", "Inheritance", "Encapsulation"],
                        "answer": "Ability to take multiple forms",
                        "topic": "OOP Concepts"
                    }
                ],
                "hard": [
                    {
                        "question": "Explain the difference between stack and heap memory.",
                        "answer": "Stack memory is used for static memory allocation with automatic management and LIFO access, while heap memory is used for dynamic allocation with manual management and random access",
                        "topic": "Memory Management",
                        "type": "subjective"
                    }
                ]
            },
            "Math": {
                "easy": [
                    {
                        "question": "What is the derivative of x²?",
                        "options": ["2x", "x", "x²", "2"],
                        "answer": "2x",
                        "topic": "Calculus"
                    },
                    {
                        "question": "What is a matrix?",
                        "options": ["Array of numbers in rows and columns", "A graph", "A vector", "A function"],
                        "answer": "Array of numbers in rows and columns",
                        "topic": "Linear Algebra"
                    }
                ],
                "medium": [
                    {
                        "question": "What is the determinant of a 2x2 matrix [[a,b],[c,d]]?",
                        "options": ["ad - bc", "ab - cd", "ac - bd", "ad + bc"],
                        "answer": "ad - bc",
                        "topic": "Linear Algebra"
                    }
                ],
                "hard": [
                    {
                        "question": "Explain the concept of eigenvalues and eigenvectors.",
                        "answer": "Eigenvalues are scalars and eigenvectors are non-zero vectors such that when a linear transformation is applied to the eigenvector, it only scales by the eigenvalue without changing direction",
                        "topic": "Linear Algebra",
                        "type": "subjective"
                    }
                ]
            },
            "DataScience": {
                "easy": [
                    {
                        "question": "What is data preprocessing?",
                        "options": ["Cleaning and transforming raw data", "Storing data", "Visualizing data", "Collecting data"],
                        "answer": "Cleaning and transforming raw data",
                        "topic": "Data Processing"
                    }
                ],
                "medium": [
                    {
                        "question": "What is the purpose of cross-validation?",
                        "options": ["Assess model performance", "Clean data", "Visualize data", "Collect data"],
                        "answer": "Assess model performance",
                        "topic": "Model Evaluation"
                    }
                ],
                "hard": [
                    {
                        "question": "Explain the bias-variance tradeoff.",
                        "answer": "The bias-variance tradeoff refers to the balance between a model's ability to minimize bias (error from wrong assumptions) and variance (error from sensitivity to training data fluctuations)",
                        "topic": "ML Theory",
                        "type": "subjective"
                    }
                ]
            }
        }
        
        # Save for future use
        os.makedirs(os.path.dirname(self.question_bank_file), exist_ok=True)
        with open(self.question_bank_file, 'w') as f:
            json.dump(bank, f, indent=2)
        
        return bank
    
    def generate_personalized_quiz(self, user_performance, num_questions=10, focus_weak_areas=True):
        """
        Generate a personalized quiz based on user performance
        
        Args:
            user_performance: Dict with subject scores and weak topics
            num_questions: Number of questions to generate
            focus_weak_areas: Whether to focus on weak areas (True) or balanced (False)
        
        Returns:
            dict: Generated quiz
        """
        logger.info(f"Generating personalized quiz for user with {num_questions} questions")
        
        try:
            # Analyze performance to determine subjects and difficulty
            subject_difficulty = self._determine_difficulty_levels(user_performance)
            
            # Identify weak topics
            weak_topics = user_performance.get('weak_topics', [])
            
            # Generate questions
            questions = []
            question_id = 1
            
            for subject, difficulty_dist in subject_difficulty.items():
                if subject not in self.question_bank:
                    continue
                
                # Determine how many questions from this subject
                subject_questions = int(num_questions * difficulty_dist['weight'])
                
                # Select questions based on difficulty
                for difficulty, count in difficulty_dist['difficulty_split'].items():
                    if difficulty not in self.question_bank[subject]:
                        continue
                    
                    available_questions = self.question_bank[subject][difficulty].copy()
                    
                    # Prioritize weak topics if focus_weak_areas is True
                    if focus_weak_areas and weak_topics:
                        prioritized = [q for q in available_questions if q.get('topic') in weak_topics]
                        if prioritized:
                            available_questions = prioritized + [q for q in available_questions if q not in prioritized]
                    
                    # Select random questions
                    selected = random.sample(
                        available_questions,
                        min(count, len(available_questions))
                    )
                    
                    for q in selected:
                        question_data = q.copy()
                        question_data['questionId'] = f"q{question_id}"
                        question_data['subject'] = subject
                        question_data['difficulty'] = difficulty
                        question_id += 1
                        questions.append(question_data)
            
            # Shuffle questions
            random.shuffle(questions)
            
            # Limit to num_questions
            questions = questions[:num_questions]
            
            # Prepare quiz metadata
            quiz = {
                'quizId': f"quiz_{random.randint(1000, 9999)}",
                'title': self._generate_quiz_title(user_performance),
                'description': self._generate_quiz_description(user_performance, focus_weak_areas),
                'total_questions': len(questions),
                'estimated_time': len(questions) * 2,  # 2 minutes per question
                'questions': questions,
                'generated_at': self._get_timestamp(),
                'personalization': {
                    'focused_on_weak_areas': focus_weak_areas,
                    'target_subjects': list(subject_difficulty.keys()),
                    'weak_topics_included': weak_topics
                }
            }
            
            logger.info(f"Generated quiz with {len(questions)} questions")
            return quiz
            
        except Exception as e:
            logger.error(f"Error generating quiz: {e}")
            raise
    
    def _determine_difficulty_levels(self, user_performance):
        """Determine difficulty distribution based on performance"""
        subject_difficulty = {}
        
        scores = user_performance.get('scores', {})
        total_subjects = len(scores) if scores else 1
        
        for subject, score in scores.items():
            # Determine difficulty split based on score
            if score >= 85:
                # Strong - more hard questions
                difficulty_split = {'easy': 1, 'medium': 2, 'hard': 2}
            elif score >= 70:
                # Good - balanced
                difficulty_split = {'easy': 1, 'medium': 3, 'hard': 1}
            elif score >= 50:
                # Moderate - more medium
                difficulty_split = {'easy': 2, 'medium': 3, 'hard': 0}
            else:
                # Weak - focus on easy/medium
                difficulty_split = {'easy': 3, 'medium': 2, 'hard': 0}
            
            subject_difficulty[subject] = {
                'weight': 1.0 / total_subjects,
                'difficulty_split': difficulty_split
            }
        
        return subject_difficulty
    
    def _generate_quiz_title(self, user_performance):
        """Generate descriptive quiz title"""
        weak_topics = user_performance.get('weak_topics', [])
        
        if weak_topics:
            return f"Personalized Assessment: Focus on {', '.join(weak_topics[:2])}"
        else:
            return "Personalized Comprehensive Assessment"
    
    def _generate_quiz_description(self, user_performance, focus_weak_areas):
        """Generate quiz description"""
        if focus_weak_areas:
            weak_topics = user_performance.get('weak_topics', [])
            if weak_topics:
                return f"This quiz is tailored to help you improve in: {', '.join(weak_topics)}. Questions are selected based on your previous performance."
        
        return "This is a comprehensive assessment covering multiple topics based on your learning profile."
    
    def generate_adaptive_quiz(self, user_id, previous_answers=None, current_difficulty='medium'):
        """
        Generate adaptive quiz that adjusts difficulty based on answers
        
        Args:
            user_id: User identifier
            previous_answers: List of previous answers (for adaptive adjustment)
            current_difficulty: Current difficulty level
        
        Returns:
            dict: Next set of questions
        """
        # Analyze previous answers to adjust difficulty
        if previous_answers:
            correct_count = sum(1 for ans in previous_answers if ans.get('isCorrect', False))
            accuracy = correct_count / len(previous_answers) if previous_answers else 0.5
            
            # Adjust difficulty
            if accuracy >= 0.8 and current_difficulty != 'hard':
                new_difficulty = 'hard' if current_difficulty == 'medium' else 'medium'
            elif accuracy <= 0.4 and current_difficulty != 'easy':
                new_difficulty = 'easy' if current_difficulty == 'medium' else 'medium'
            else:
                new_difficulty = current_difficulty
        else:
            new_difficulty = current_difficulty
        
        # Generate questions at new difficulty
        questions = []
        question_id = len(previous_answers) + 1 if previous_answers else 1
        
        # Select 3 questions at current difficulty
        for subject, difficulties in self.question_bank.items():
            if new_difficulty in difficulties:
                available = difficulties[new_difficulty]
                if available:
                    q = random.choice(available).copy()
                    q['questionId'] = f"q{question_id}"
                    q['subject'] = subject
                    q['difficulty'] = new_difficulty
                    questions.append(q)
                    question_id += 1
                    
                    if len(questions) >= 3:
                        break
        
        return {
            'questions': questions,
            'current_difficulty': new_difficulty,
            'adaptive_status': 'adjusted' if previous_answers else 'initial'
        }
    
    def _get_timestamp(self):
        """Get current timestamp"""
        from datetime import datetime
        return datetime.utcnow().isoformat() + "Z"


# Global quiz generator instance
quiz_generator = QuizGenerator()