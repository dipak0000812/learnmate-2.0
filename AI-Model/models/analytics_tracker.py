"""
Analytics Tracker for LearnMate AI
Tracks usage, performance, and generates insights
"""

import json
import os
from datetime import datetime, timedelta
from collections import defaultdict
import logging

logger = logging.getLogger(__name__)


class AnalyticsTracker:
    """
    Track and analyze AI system usage and performance
    """
    
    def __init__(self, log_file='logs/analytics.json'):
        self.log_file = log_file
        self.ensure_log_file()
    
    def ensure_log_file(self):
        """Ensure analytics log file exists"""
        os.makedirs(os.path.dirname(self.log_file), exist_ok=True)
        if not os.path.exists(self.log_file):
            with open(self.log_file, 'w') as f:
                json.dump([], f)
    
    def log_event(self, event_type, data):
        """
        Log an analytics event
        
        Args:
            event_type: Type of event (quiz, roadmap, career, etc.)
            data: Event data dictionary
        """
        try:
            event = {
                'timestamp': datetime.utcnow().isoformat(),
                'type': event_type,
                'data': data
            }
            
            # Read existing events
            with open(self.log_file, 'r') as f:
                events = json.load(f)
            
            # Append new event
            events.append(event)
            
            # Keep only last 10,000 events (prevent file from growing too large)
            if len(events) > 10000:
                events = events[-10000:]
            
            # Write back
            with open(self.log_file, 'w') as f:
                json.dump(events, f)
            
        except Exception as e:
            logger.error(f"Error logging analytics event: {e}")
    
    def get_analytics(self, days=30):
        """
        Get analytics summary for last N days
        
        Returns:
            dict: Analytics summary
        """
        try:
            # Read events
            with open(self.log_file, 'r') as f:
                events = json.load(f)
            
            # Filter by date
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            filtered_events = [
                e for e in events 
                if datetime.fromisoformat(e['timestamp']) > cutoff_date
            ]
            
            # Calculate metrics
            total_requests = len(filtered_events)
            
            # Count by type
            by_type = defaultdict(int)
            for event in filtered_events:
                by_type[event['type']] += 1
            
            # Quiz analytics
            quiz_events = [e for e in filtered_events if e['type'] == 'quiz_evaluation']
            quiz_stats = self._analyze_quiz_events(quiz_events)
            
            # Career analytics
            career_events = [e for e in filtered_events if e['type'] == 'career_recommendation']
            career_stats = self._analyze_career_events(career_events)
            
            # Roadmap analytics
            roadmap_events = [e for e in filtered_events if e['type'] == 'roadmap_generation']
            roadmap_stats = self._analyze_roadmap_events(roadmap_events)
            
            # Usage by day
            daily_usage = self._calculate_daily_usage(filtered_events)
            
            # Performance metrics
            performance = self._calculate_performance_metrics(filtered_events)
            
            analytics = {
                'period_days': days,
                'total_requests': total_requests,
                'requests_by_type': dict(by_type),
                'daily_average': total_requests / days if days > 0 else 0,
                'quiz_analytics': quiz_stats,
                'career_analytics': career_stats,
                'roadmap_analytics': roadmap_stats,
                'daily_usage': daily_usage,
                'performance_metrics': performance,
                'generated_at': datetime.utcnow().isoformat()
            }
            
            return analytics
            
        except Exception as e:
            logger.error(f"Error generating analytics: {e}")
            return {
                'error': str(e),
                'total_requests': 0
            }
    
    def _analyze_quiz_events(self, events):
        """Analyze quiz evaluation events"""
        if not events:
            return {'count': 0}
        
        total_score = 0
        total_percentage = 0
        grades = defaultdict(int)
        subjects = defaultdict(int)
        
        for event in events:
            data = event.get('data', {})
            total_score += data.get('score', 0)
            total_percentage += data.get('percentage', 0)
            grades[data.get('grade', 'N/A')] += 1
            subjects[data.get('subject', 'Unknown')] += 1
        
        return {
            'count': len(events),
            'avg_score': round(total_score / len(events), 2),
            'avg_percentage': round(total_percentage / len(events), 2),
            'grade_distribution': dict(grades),
            'popular_subjects': dict(sorted(subjects.items(), key=lambda x: x[1], reverse=True)[:5])
        }
    
    def _analyze_career_events(self, events):
        """Analyze career recommendation events"""
        if not events:
            return {'count': 0}
        
        recommended_careers = defaultdict(int)
        avg_confidence = 0
        
        for event in events:
            data = event.get('data', {})
            recommendations = data.get('recommendations', [])
            
            for rec in recommendations[:3]:  # Top 3
                recommended_careers[rec.get('career', 'Unknown')] += 1
                avg_confidence += rec.get('confidence', 0)
        
        total_recs = sum(recommended_careers.values())
        
        return {
            'count': len(events),
            'total_recommendations': total_recs,
            'avg_confidence': round(avg_confidence / total_recs, 3) if total_recs > 0 else 0,
            'most_recommended': dict(sorted(recommended_careers.items(), key=lambda x: x[1], reverse=True)[:10])
        }
    
    def _analyze_roadmap_events(self, events):
        """Analyze roadmap generation events"""
        if not events:
            return {'count': 0}
        
        total_milestones = 0
        total_hours = 0
        subjects = defaultdict(int)
        
        for event in events:
            data = event.get('data', {})
            stats = data.get('statistics', {})
            total_milestones += stats.get('totalMilestones', 0)
            total_hours += stats.get('estimatedTotalHours', 0)
            
            # Track subjects
            roadmap = data.get('roadmap', [])
            for milestone in roadmap:
                subjects[milestone.get('subject', 'Unknown')] += 1
        
        return {
            'count': len(events),
            'avg_milestones': round(total_milestones / len(events), 1) if len(events) > 0 else 0,
            'avg_hours': round(total_hours / len(events), 1) if len(events) > 0 else 0,
            'popular_subjects': dict(sorted(subjects.items(), key=lambda x: x[1], reverse=True)[:5])
        }
    
    def _calculate_daily_usage(self, events):
        """Calculate daily usage statistics"""
        daily_counts = defaultdict(int)
        
        for event in events:
            date = datetime.fromisoformat(event['timestamp']).date()
            daily_counts[str(date)] += 1
        
        # Get last 7 days
        last_7_days = {}
        for i in range(7):
            date = (datetime.utcnow().date() - timedelta(days=i))
            last_7_days[str(date)] = daily_counts.get(str(date), 0)
        
        return dict(sorted(last_7_days.items()))
    
    def _calculate_performance_metrics(self, events):
        """Calculate system performance metrics"""
        if not events:
            return {}
        
        response_times = []
        
        for event in events:
            data = event.get('data', {})
            response_time = data.get('response_time')
            if response_time:
                response_times.append(response_time)
        
        if response_times:
            return {
                'avg_response_time': round(sum(response_times) / len(response_times), 3),
                'min_response_time': round(min(response_times), 3),
                'max_response_time': round(max(response_times), 3)
            }
        
        return {}
    
    def get_system_health(self):
        """Get system health status"""
        try:
            analytics = self.get_analytics(days=1)  # Last 24 hours
            
            total_requests = analytics.get('total_requests', 0)
            
            # Determine health status
            if total_requests > 100:
                status = 'excellent'
            elif total_requests > 50:
                status = 'good'
            elif total_requests > 10:
                status = 'fair'
            else:
                status = 'low_usage'
            
            return {
                'status': status,
                'requests_24h': total_requests,
                'uptime': 'operational',
                'models_loaded': True,
                'last_check': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'error': str(e)
            }


# Global tracker instance
analytics_tracker = AnalyticsTracker()