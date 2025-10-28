"""
Progress Tracker for LearnMate AI
Track student learning progress over time
"""

import json
import os
from datetime import datetime, timedelta
from collections import defaultdict
import logging

logger = logging.getLogger(__name__)


class ProgressTracker:
    """
    Track and analyze student learning progress over time
    """
    
    def __init__(self, data_file='logs/progress_data.json'):
        self.data_file = data_file
        self.ensure_data_file()
    
    def ensure_data_file(self):
        """Ensure progress data file exists"""
        os.makedirs(os.path.dirname(self.data_file), exist_ok=True)
        if not os.path.exists(self.data_file):
            with open(self.data_file, 'w') as f:
                json.dump({}, f)
    
    def record_quiz_attempt(self, user_id, quiz_data):
        """
        Record a quiz attempt for progress tracking
        
        Args:
            user_id: User identifier
            quiz_data: Quiz result data
        """
        try:
            # Read existing progress
            with open(self.data_file, 'r') as f:
                progress = json.load(f)
            
            # Initialize user if not exists
            if user_id not in progress:
                progress[user_id] = {
                    'quizzes': [],
                    'roadmaps': [],
                    'career_explorations': [],
                    'created_at': datetime.utcnow().isoformat()
                }
            
            # Add quiz attempt
            progress[user_id]['quizzes'].append({
                'timestamp': datetime.utcnow().isoformat(),
                'subject': quiz_data.get('subject'),
                'score': quiz_data.get('score'),
                'percentage': quiz_data.get('percentage'),
                'grade': quiz_data.get('grade'),
                'topics': quiz_data.get('topicPerformance', {})
            })
            
            # Write back
            with open(self.data_file, 'w') as f:
                json.dump(progress, f)
            
            logger.info(f"Recorded quiz attempt for user {user_id}")
            
        except Exception as e:
            logger.error(f"Error recording quiz attempt: {e}")
    
    def record_roadmap_generation(self, user_id, roadmap_data):
        """Record roadmap generation for tracking"""
        try:
            with open(self.data_file, 'r') as f:
                progress = json.load(f)
            
            if user_id not in progress:
                progress[user_id] = {
                    'quizzes': [],
                    'roadmaps': [],
                    'career_explorations': [],
                    'created_at': datetime.utcnow().isoformat()
                }
            
            progress[user_id]['roadmaps'].append({
                'timestamp': datetime.utcnow().isoformat(),
                'milestones_count': len(roadmap_data.get('roadmap', [])),
                'target_career': roadmap_data.get('targetCareer'),
                'estimated_hours': roadmap_data.get('statistics', {}).get('estimatedTotalHours')
            })
            
            with open(self.data_file, 'w') as f:
                json.dump(progress, f)
            
        except Exception as e:
            logger.error(f"Error recording roadmap: {e}")
    
    def record_career_exploration(self, user_id, career_data):
        """Record career exploration activity"""
        try:
            with open(self.data_file, 'r') as f:
                progress = json.load(f)
            
            if user_id not in progress:
                progress[user_id] = {
                    'quizzes': [],
                    'roadmaps': [],
                    'career_explorations': [],
                    'created_at': datetime.utcnow().isoformat()
                }
            
            progress[user_id]['career_explorations'].append({
                'timestamp': datetime.utcnow().isoformat(),
                'recommendations': [r.get('career') for r in career_data.get('recommendations', [])[:3]]
            })
            
            with open(self.data_file, 'w') as f:
                json.dump(progress, f)
            
        except Exception as e:
            logger.error(f"Error recording career exploration: {e}")
    
    def get_user_progress(self, user_id):
        """
        Get comprehensive progress report for a user
        
        Returns:
            dict: Progress report with analytics
        """
        try:
            with open(self.data_file, 'r') as f:
                progress = json.load(f)
            
            user_data = progress.get(user_id)
            
            if not user_data:
                return {
                    'user_id': user_id,
                    'status': 'no_data',
                    'message': 'No progress data found for this user'
                }
            
            # Analyze quiz progress
            quiz_analysis = self._analyze_quiz_progress(user_data.get('quizzes', []))
            
            # Analyze learning trends
            trends = self._calculate_trends(user_data.get('quizzes', []))
            
            # Calculate streaks
            streaks = self._calculate_streaks(user_data)
            
            # Overall stats
            total_quizzes = len(user_data.get('quizzes', []))
            total_roadmaps = len(user_data.get('roadmaps', []))
            total_career_explorations = len(user_data.get('career_explorations', []))
            
            # Calculate engagement level
            engagement = self._calculate_engagement(user_data)
            
            return {
                'user_id': user_id,
                'member_since': user_data.get('created_at'),
                'overall_stats': {
                    'total_quizzes': total_quizzes,
                    'total_roadmaps': total_roadmaps,
                    'career_explorations': total_career_explorations,
                    'engagement_level': engagement
                },
                'quiz_progress': quiz_analysis,
                'learning_trends': trends,
                'streaks': streaks,
                'recent_activity': self._get_recent_activity(user_data),
                'generated_at': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting user progress: {e}")
            return {
                'user_id': user_id,
                'status': 'error',
                'error': str(e)
            }
    
    def _analyze_quiz_progress(self, quizzes):
        """Analyze quiz performance over time"""
        if not quizzes:
            return {'count': 0}
        
        # Calculate averages
        total_percentage = sum(q.get('percentage', 0) for q in quizzes)
        avg_percentage = total_percentage / len(quizzes)
        
        # Grade distribution
        grades = defaultdict(int)
        for quiz in quizzes:
            grades[quiz.get('grade', 'N/A')] += 1
        
        # Subject performance
        subject_performance = defaultdict(list)
        for quiz in quizzes:
            subject = quiz.get('subject', 'Unknown')
            subject_performance[subject].append(quiz.get('percentage', 0))
        
        subject_avgs = {
            subject: round(sum(scores) / len(scores), 1)
            for subject, scores in subject_performance.items()
        }
        
        # Recent vs overall comparison
        recent_quizzes = quizzes[-5:] if len(quizzes) >= 5 else quizzes
        recent_avg = sum(q.get('percentage', 0) for q in recent_quizzes) / len(recent_quizzes)
        
        improvement = round(recent_avg - avg_percentage, 1)
        
        return {
            'total_quizzes': len(quizzes),
            'average_score': round(avg_percentage, 1),
            'recent_average': round(recent_avg, 1),
            'improvement': improvement,
            'grade_distribution': dict(grades),
            'subject_performance': subject_avgs,
            'strongest_subject': max(subject_avgs, key=subject_avgs.get) if subject_avgs else None,
            'weakest_subject': min(subject_avgs, key=subject_avgs.get) if subject_avgs else None
        }
    
    def _calculate_trends(self, quizzes):
        """Calculate learning trends"""
        if len(quizzes) < 3:
            return {'trend': 'insufficient_data'}
        
        # Get last 10 quizzes or all if less
        recent = quizzes[-10:]
        scores = [q.get('percentage', 0) for q in recent]
        
        # Calculate trend using simple linear regression
        x = list(range(len(scores)))
        n = len(scores)
        
        sum_x = sum(x)
        sum_y = sum(scores)
        sum_xy = sum(xi * yi for xi, yi in zip(x, scores))
        sum_x2 = sum(xi * xi for xi in x)
        
        slope = (n * sum_xy - sum_x * sum_y) / (n * sum_x2 - sum_x * sum_x) if (n * sum_x2 - sum_x * sum_x) != 0 else 0
        
        if slope > 2:
            trend = 'improving'
        elif slope < -2:
            trend = 'declining'
        else:
            trend = 'stable'
        
        return {
            'trend': trend,
            'slope': round(slope, 2),
            'recent_scores': scores
        }
    
    def _calculate_streaks(self, user_data):
        """Calculate learning streaks"""
        quizzes = user_data.get('quizzes', [])
        
        if not quizzes:
            return {'current_streak': 0}
        
        # Sort by timestamp
        sorted_quizzes = sorted(quizzes, key=lambda x: x.get('timestamp', ''))
        
        # Calculate daily streak
        dates = set()
        for quiz in sorted_quizzes:
            timestamp = quiz.get('timestamp', '')
            if timestamp:
                date = datetime.fromisoformat(timestamp).date()
                dates.add(date)
        
        # Current streak
        current_streak = 0
        today = datetime.utcnow().date()
        
        for i in range(365):  # Check up to 365 days
            check_date = today - timedelta(days=i)
            if check_date in dates:
                current_streak += 1
            else:
                break
        
        # Longest streak
        sorted_dates = sorted(dates)
        longest_streak = 1
        current = 1
        
        for i in range(1, len(sorted_dates)):
            if (sorted_dates[i] - sorted_dates[i-1]).days == 1:
                current += 1
                longest_streak = max(longest_streak, current)
            else:
                current = 1
        
        return {
            'current_streak': current_streak,
            'longest_streak': longest_streak,
            'total_active_days': len(dates)
        }
    
    def _calculate_engagement(self, user_data):
        """Calculate engagement level"""
        total_activities = (
            len(user_data.get('quizzes', [])) +
            len(user_data.get('roadmaps', [])) +
            len(user_data.get('career_explorations', []))
        )
        
        if total_activities >= 50:
            return 'very_high'
        elif total_activities >= 30:
            return 'high'
        elif total_activities >= 15:
            return 'medium'
        elif total_activities >= 5:
            return 'low'
        else:
            return 'very_low'
    
    def _get_recent_activity(self, user_data):
        """Get recent activity summary"""
        # Combine all activities
        activities = []
        
        for quiz in user_data.get('quizzes', [])[-5:]:
            activities.append({
                'type': 'quiz',
                'timestamp': quiz.get('timestamp'),
                'subject': quiz.get('subject'),
                'score': quiz.get('percentage')
            })
        
        for roadmap in user_data.get('roadmaps', [])[-3:]:
            activities.append({
                'type': 'roadmap',
                'timestamp': roadmap.get('timestamp'),
                'career': roadmap.get('target_career')
            })
        
        for career in user_data.get('career_explorations', [])[-3:]:
            activities.append({
                'type': 'career_exploration',
                'timestamp': career.get('timestamp'),
                'careers': career.get('recommendations', [])[:3]
            })
        
        # Sort by timestamp
        activities.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
        
        return activities[:10]  # Return last 10 activities
    
    def compare_users(self, user_ids):
        """
        Compare progress of multiple users
        
        Args:
            user_ids: List of user IDs to compare
        
        Returns:
            dict: Comparison data
        """
        try:
            with open(self.data_file, 'r') as f:
                progress = json.load(f)
            
            comparison = {}
            
            for user_id in user_ids:
                user_data = progress.get(user_id)
                if user_data:
                    quizzes = user_data.get('quizzes', [])
                    avg_score = sum(q.get('percentage', 0) for q in quizzes) / len(quizzes) if quizzes else 0
                    
                    comparison[user_id] = {
                        'total_quizzes': len(quizzes),
                        'average_score': round(avg_score, 1),
                        'total_activities': (
                            len(quizzes) +
                            len(user_data.get('roadmaps', [])) +
                            len(user_data.get('career_explorations', []))
                        )
                    }
            
            # Calculate rankings
            sorted_by_score = sorted(comparison.items(), key=lambda x: x[1]['average_score'], reverse=True)
            sorted_by_quizzes = sorted(comparison.items(), key=lambda x: x[1]['total_quizzes'], reverse=True)
            
            return {
                'users_compared': len(comparison),
                'individual_stats': comparison,
                'rankings': {
                    'by_score': [uid for uid, _ in sorted_by_score],
                    'by_activity': [uid for uid, _ in sorted_by_quizzes]
                }
            }
            
        except Exception as e:
            logger.error(f"Error comparing users: {e}")
            return {'error': str(e)}
    
    def get_leaderboard(self, limit=10, metric='score'):
        """
        Get leaderboard based on different metrics
        
        Args:
            limit: Number of users to return
            metric: 'score', 'quizzes', or 'activity'
        
        Returns:
            list: Top users
        """
        try:
            with open(self.data_file, 'r') as f:
                progress = json.load(f)
            
            user_stats = []
            
            for user_id, user_data in progress.items():
                quizzes = user_data.get('quizzes', [])
                avg_score = sum(q.get('percentage', 0) for q in quizzes) / len(quizzes) if quizzes else 0
                
                user_stats.append({
                    'user_id': user_id,
                    'average_score': round(avg_score, 1),
                    'total_quizzes': len(quizzes),
                    'total_activity': (
                        len(quizzes) +
                        len(user_data.get('roadmaps', [])) +
                        len(user_data.get('career_explorations', []))
                    )
                })
            
            # Sort based on metric
            if metric == 'score':
                user_stats.sort(key=lambda x: x['average_score'], reverse=True)
            elif metric == 'quizzes':
                user_stats.sort(key=lambda x: x['total_quizzes'], reverse=True)
            else:  # activity
                user_stats.sort(key=lambda x: x['total_activity'], reverse=True)
            
            return user_stats[:limit]
            
        except Exception as e:
            logger.error(f"Error getting leaderboard: {e}")
            return []


# Global progress tracker instance
progress_tracker = ProgressTracker()