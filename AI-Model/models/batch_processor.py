"""
Batch Processor for LearnMate AI
Process multiple requests efficiently
"""

import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Dict, Any
import time

logger = logging.getLogger(__name__)


class BatchProcessor:
    """
    Process multiple AI requests in batch for efficiency
    """
    
    def __init__(self, max_workers=4):
        self.max_workers = max_workers
        self.executor = ThreadPoolExecutor(max_workers=max_workers)
    
    def batch_evaluate_quizzes(self, quiz_evaluator, quiz_list):
        """
        Evaluate multiple quizzes in batch
        
        Args:
            quiz_evaluator: QuizEvaluator instance
            quiz_list: List of quiz data dictionaries
        
        Returns:
            list: Results for each quiz
        """
        logger.info(f"Batch processing {len(quiz_list)} quizzes")
        start_time = time.time()
        
        results = []
        futures = []
        
        # Submit all tasks
        for idx, quiz_data in enumerate(quiz_list):
            future = self.executor.submit(
                self._evaluate_single_quiz,
                quiz_evaluator,
                quiz_data,
                idx
            )
            futures.append(future)
        
        # Collect results
        for future in as_completed(futures):
            try:
                result = future.result()
                results.append(result)
            except Exception as e:
                logger.error(f"Error in batch quiz evaluation: {e}")
                results.append({
                    'status': 'error',
                    'error': str(e)
                })
        
        # Sort by original index
        results.sort(key=lambda x: x.get('index', 0))
        
        elapsed = time.time() - start_time
        logger.info(f"Batch quiz evaluation completed in {elapsed:.2f}s")
        
        return {
            'total_processed': len(quiz_list),
            'successful': len([r for r in results if r.get('status') == 'success']),
            'failed': len([r for r in results if r.get('status') == 'error']),
            'processing_time': round(elapsed, 2),
            'results': results
        }
    
    def _evaluate_single_quiz(self, quiz_evaluator, quiz_data, index):
        """Helper function to evaluate a single quiz"""
        try:
            result = quiz_evaluator.evaluate(
                answers=quiz_data.get('answers', []),
                correct_answers=quiz_data.get('correctAnswers', []),
                subject=quiz_data.get('subject', 'General')
            )
            return {
                'index': index,
                'status': 'success',
                'data': result
            }
        except Exception as e:
            return {
                'index': index,
                'status': 'error',
                'error': str(e)
            }
    
    def batch_generate_roadmaps(self, roadmap_generator, roadmap_requests):
        """
        Generate multiple roadmaps in batch
        
        Args:
            roadmap_generator: RoadmapGenerator instance
            roadmap_requests: List of roadmap request dictionaries
        
        Returns:
            dict: Batch results
        """
        logger.info(f"Batch processing {len(roadmap_requests)} roadmaps")
        start_time = time.time()
        
        results = []
        futures = []
        
        # Submit all tasks
        for idx, request in enumerate(roadmap_requests):
            future = self.executor.submit(
                self._generate_single_roadmap,
                roadmap_generator,
                request,
                idx
            )
            futures.append(future)
        
        # Collect results
        for future in as_completed(futures):
            try:
                result = future.result()
                results.append(result)
            except Exception as e:
                logger.error(f"Error in batch roadmap generation: {e}")
                results.append({
                    'status': 'error',
                    'error': str(e)
                })
        
        # Sort by original index
        results.sort(key=lambda x: x.get('index', 0))
        
        elapsed = time.time() - start_time
        logger.info(f"Batch roadmap generation completed in {elapsed:.2f}s")
        
        return {
            'total_processed': len(roadmap_requests),
            'successful': len([r for r in results if r.get('status') == 'success']),
            'failed': len([r for r in results if r.get('status') == 'error']),
            'processing_time': round(elapsed, 2),
            'results': results
        }
    
    def _generate_single_roadmap(self, roadmap_generator, request, index):
        """Helper function to generate a single roadmap"""
        try:
            result = roadmap_generator.generate(
                user_id=request.get('userId'),
                performance=request.get('performance', {}),
                semester=request.get('semester', 1),
                interests=request.get('interests', []),
                target_career=request.get('targetCareer'),
                time_available=request.get('timeAvailable', 15)
            )
            return {
                'index': index,
                'userId': request.get('userId'),
                'status': 'success',
                'data': result
            }
        except Exception as e:
            return {
                'index': index,
                'userId': request.get('userId'),
                'status': 'error',
                'error': str(e)
            }
    
    def batch_recommend_careers(self, career_recommender, career_requests):
        """
        Generate career recommendations in batch
        
        Args:
            career_recommender: CareerRecommender instance
            career_requests: List of career request dictionaries
        
        Returns:
            dict: Batch results
        """
        logger.info(f"Batch processing {len(career_requests)} career recommendations")
        start_time = time.time()
        
        results = []
        futures = []
        
        # Submit all tasks
        for idx, request in enumerate(career_requests):
            future = self.executor.submit(
                self._recommend_single_career,
                career_recommender,
                request,
                idx
            )
            futures.append(future)
        
        # Collect results
        for future in as_completed(futures):
            try:
                result = future.result()
                results.append(result)
            except Exception as e:
                logger.error(f"Error in batch career recommendation: {e}")
                results.append({
                    'status': 'error',
                    'error': str(e)
                })
        
        # Sort by original index
        results.sort(key=lambda x: x.get('index', 0))
        
        elapsed = time.time() - start_time
        logger.info(f"Batch career recommendation completed in {elapsed:.2f}s")
        
        return {
            'total_processed': len(career_requests),
            'successful': len([r for r in results if r.get('status') == 'success']),
            'failed': len([r for r in results if r.get('status') == 'error']),
            'processing_time': round(elapsed, 2),
            'results': results
        }
    
    def _recommend_single_career(self, career_recommender, request, index):
        """Helper function to recommend career for single request"""
        try:
            result = career_recommender.recommend(
                scores=request.get('scores', {}),
                interests=request.get('interests', []),
                skills=request.get('skills', []),
                semester=request.get('semester', 1)
            )
            return {
                'index': index,
                'status': 'success',
                'data': result
            }
        except Exception as e:
            return {
                'index': index,
                'status': 'error',
                'error': str(e)
            }
    
    def shutdown(self):
        """Shutdown the executor"""
        self.executor.shutdown(wait=True)
        logger.info("Batch processor shut down")


# Global batch processor instance
batch_processor = BatchProcessor(max_workers=4)