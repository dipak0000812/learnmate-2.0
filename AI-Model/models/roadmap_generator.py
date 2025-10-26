import json
import os
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)


class RoadmapGenerator:
    """
    Intelligent Learning Roadmap Generator
    Creates personalized, adaptive learning paths based on student performance and goals
    """
    
    def __init__(self):
        """Initialize roadmap generator with curriculum templates"""
        self.curriculum_db = self._load_curriculum_templates()
        self.priority_weights = {
            'weak_subject': 3.0,
            'moderate_subject': 2.0,
            'strong_subject': 1.0,
            'interest_boost': 1.5,
            'career_alignment': 2.0,
            'prerequisite': 2.5
        }
        logger.info("RoadmapGenerator initialized")
    
    def _load_curriculum_templates(self):
        """Load comprehensive curriculum templates for different subjects and levels"""
        return {
            "AI": {
                "prerequisites": ["Python", "Math", "Statistics"],
                "beginner": [
                    {
                        "milestone": "Python for AI/ML",
                        "tasks": ["NumPy basics", "Pandas fundamentals", "Data visualization with Matplotlib", "Scikit-learn introduction"],
                        "duration": "2 weeks",
                        "resources": ["Python Data Science Handbook", "Kaggle Learn - Python"]
                    },
                    {
                        "milestone": "Mathematics for AI",
                        "tasks": ["Linear Algebra review", "Probability & Statistics", "Calculus basics for ML", "Matrix operations"],
                        "duration": "3 weeks",
                        "resources": ["Khan Academy - Linear Algebra", "3Blue1Brown YouTube"]
                    }
                ],
                "intermediate": [
                    {
                        "milestone": "Machine Learning Fundamentals",
                        "tasks": ["Supervised Learning", "Regression algorithms", "Classification models", "Model evaluation metrics"],
                        "duration": "4 weeks",
                        "resources": ["Andrew Ng's ML Course", "Hands-On ML Book"]
                    },
                    {
                        "milestone": "Deep Learning Basics",
                        "tasks": ["Neural Networks intro", "Backpropagation", "TensorFlow/PyTorch basics", "CNN fundamentals"],
                        "duration": "4 weeks",
                        "resources": ["Deep Learning Specialization", "Fast.ai"]
                    }
                ],
                "advanced": [
                    {
                        "milestone": "Advanced Deep Learning",
                        "tasks": ["RNNs and LSTMs", "Transformers architecture", "GANs", "Reinforcement Learning basics"],
                        "duration": "6 weeks",
                        "resources": ["Stanford CS230", "Papers with Code"]
                    }
                ]
            },
            "Programming": {
                "prerequisites": ["Computer Basics"],
                "beginner": [
                    {
                        "milestone": "Programming Fundamentals",
                        "tasks": ["Variables & Data Types", "Control Structures", "Functions", "Basic OOP"],
                        "duration": "2 weeks",
                        "resources": ["Python.org Tutorial", "Codecademy"]
                    },
                    {
                        "milestone": "Data Structures Basics",
                        "tasks": ["Arrays & Lists", "Stacks & Queues", "Hash Tables", "Basic searching & sorting"],
                        "duration": "3 weeks",
                        "resources": ["GeeksforGeeks", "LeetCode Easy"]
                    }
                ],
                "intermediate": [
                    {
                        "milestone": "Advanced Data Structures",
                        "tasks": ["Trees & Graphs", "Dynamic Programming intro", "Recursion mastery", "Complexity analysis"],
                        "duration": "4 weeks",
                        "resources": ["CLRS Book", "LeetCode Medium"]
                    }
                ],
                "advanced": [
                    {
                        "milestone": "System Design & Architecture",
                        "tasks": ["Design patterns", "Scalability concepts", "Database design", "API development"],
                        "duration": "5 weeks",
                        "resources": ["System Design Primer", "Martin Fowler's Blog"]
                    }
                ]
            },
            "Math": {
                "prerequisites": [],
                "beginner": [
                    {
                        "milestone": "Mathematical Foundations",
                        "tasks": ["Algebra review", "Functions & Graphs", "Basic calculus", "Set theory"],
                        "duration": "3 weeks",
                        "resources": ["Khan Academy", "MIT OCW"]
                    }
                ],
                "intermediate": [
                    {
                        "milestone": "Advanced Mathematics",
                        "tasks": ["Multivariable calculus", "Linear Algebra", "Differential equations", "Optimization"],
                        "duration": "5 weeks",
                        "resources": ["Gilbert Strang's LA", "3Blue1Brown"]
                    }
                ]
            },
            "DataScience": {
                "prerequisites": ["Python", "Statistics"],
                "beginner": [
                    {
                        "milestone": "Data Analysis Fundamentals",
                        "tasks": ["Pandas mastery", "Data cleaning", "Exploratory Data Analysis", "Data visualization"],
                        "duration": "3 weeks",
                        "resources": ["Python for Data Analysis", "Kaggle Datasets"]
                    }
                ],
                "intermediate": [
                    {
                        "milestone": "Statistical Analysis & ML",
                        "tasks": ["Hypothesis testing", "Feature engineering", "Model selection", "Cross-validation"],
                        "duration": "4 weeks",
                        "resources": ["Statistical Learning Book", "Kaggle Competitions"]
                    }
                ],
                "advanced": [
                    {
                        "milestone": "Big Data & Production ML",
                        "tasks": ["Spark basics", "ML pipelines", "Model deployment", "A/B testing"],
                        "duration": "5 weeks",
                        "resources": ["Spark Documentation", "MLOps resources"]
                    }
                ]
            },
            "WebDevelopment": {
                "prerequisites": ["HTML", "CSS", "JavaScript"],
                "beginner": [
                    {
                        "milestone": "Frontend Basics",
                        "tasks": ["Responsive design", "DOM manipulation", "Basic React/Vue", "Git version control"],
                        "duration": "3 weeks",
                        "resources": ["freeCodeCamp", "MDN Web Docs"]
                    }
                ],
                "intermediate": [
                    {
                        "milestone": "Full Stack Development",
                        "tasks": ["Node.js & Express", "RESTful APIs", "Database integration", "Authentication"],
                        "duration": "4 weeks",
                        "resources": ["Node.js docs", "The Odin Project"]
                    }
                ]
            }
        }
    
    def _determine_skill_level(self, score):
        """Determine skill level based on performance score"""
        if score >= 80:
            return "advanced"
        elif score >= 60:
            return "intermediate"
        else:
            return "beginner"
    
    def _calculate_priority(self, subject, score, interests, target_career):
        """
        Calculate priority score for a subject
        Higher score = higher priority
        """
        priority_score = 0
        
        # Performance-based priority (inverse - weak subjects get higher priority)
        if score < 50:
            priority_score += self.priority_weights['weak_subject']
        elif score < 70:
            priority_score += self.priority_weights['moderate_subject']
        else:
            priority_score += self.priority_weights['strong_subject']
        
        # Interest boost
        if subject in interests or any(interest.lower() in subject.lower() for interest in interests):
            priority_score += self.priority_weights['interest_boost']
        
        # Career alignment boost
        if target_career:
            career_subjects = self._get_career_subjects(target_career)
            if subject in career_subjects:
                priority_score += self.priority_weights['career_alignment']
        
        return priority_score
    
    def _get_career_subjects(self, career):
        """Map careers to relevant subjects"""
        career_mapping = {
            "AI Engineer": ["AI", "Programming", "Math", "DataScience"],
            "Data Scientist": ["DataScience", "Math", "Programming", "AI"],
            "Machine Learning Engineer": ["AI", "Programming", "Math"],
            "Web Developer": ["WebDevelopment", "Programming"],
            "Full Stack Developer": ["WebDevelopment", "Programming"],
            "Software Engineer": ["Programming", "DataStructures", "Math"],
            "Data Analyst": ["DataScience", "Math"],
            "Research Scientist": ["AI", "Math", "DataScience"]
        }
        
        for key, subjects in career_mapping.items():
            if career and key.lower() in career.lower():
                return subjects
        
        return []
    
    def _get_priority_label(self, score):
        """Convert priority score to label"""
        if score >= 5:
            return "critical"
        elif score >= 3.5:
            return "high"
        elif score >= 2:
            return "medium"
        else:
            return "low"
    
    def _estimate_completion_time(self, milestones, time_available):
        """
        Estimate completion time for each milestone based on available time
        
        Args:
            milestones: List of milestone dictionaries
            time_available: Hours per week available for study
        """
        time_map = {
            "2 weeks": 20,  # hours
            "3 weeks": 30,
            "4 weeks": 40,
            "5 weeks": 50,
            "6 weeks": 60
        }
        
        current_date = datetime.now()
        
        for milestone in milestones:
            duration_str = milestone.get('duration', '2 weeks')
            estimated_hours = time_map.get(duration_str, 30)
            
            # Adjust based on available time per week
            weeks_needed = estimated_hours / time_available if time_available > 0 else 4
            milestone['estimatedWeeks'] = round(weeks_needed, 1)
            milestone['estimatedHours'] = estimated_hours
            
            # Calculate target completion date
            target_date = current_date + timedelta(weeks=weeks_needed)
            milestone['targetDate'] = target_date.strftime('%Y-%m-%d')
            
            current_date = target_date
    
    def _add_prerequisite_check(self, subject, performance):
        """Check if prerequisites are met for a subject"""
        if subject not in self.curriculum_db:
            return True, []
        
        prerequisites = self.curriculum_db[subject].get('prerequisites', [])
        missing_prereqs = []
        
        for prereq in prerequisites:
            # Check if prerequisite exists in performance and score is adequate
            prereq_score = None
            for perf_subject, score in performance.items():
                if prereq.lower() in perf_subject.lower():
                    prereq_score = score
                    break
            
            if prereq_score is None or prereq_score < 50:
                missing_prereqs.append(prereq)
        
        return len(missing_prereqs) == 0, missing_prereqs
    
    def generate(self, user_id, performance, semester, interests=None, 
                 target_career=None, time_available=15):
        """
        Generate personalized learning roadmap
        
        Args:
            user_id: User identifier
            performance: Dict of subject scores (e.g., {"AI": 65, "Math": 85})
            semester: Current semester (1-8)
            interests: List of interest areas
            target_career: Target career path
            time_available: Hours per week available for study
        
        Returns:
            dict: Comprehensive roadmap with milestones and recommendations
        """
        try:
            if interests is None:
                interests = []
            
            logger.info(f"Generating roadmap for user {user_id}")
            
            # Calculate priorities for each subject
            subject_priorities = []
            for subject, score in performance.items():
                priority_score = self._calculate_priority(
                    subject, score, interests, target_career
                )
                subject_priorities.append({
                    'subject': subject,
                    'score': score,
                    'priority': priority_score,
                    'priorityLabel': self._get_priority_label(priority_score),
                    'level': self._determine_skill_level(score)
                })
            
            # Sort by priority (highest first)
            subject_priorities.sort(key=lambda x: x['priority'], reverse=True)
            
            # Generate roadmap milestones
            roadmap = []
            all_recommendations = []
            
            for subj_data in subject_priorities[:5]:  # Focus on top 5 subjects
                subject = subj_data['subject']
                score = subj_data['score']
                level = subj_data['level']
                priority_label = subj_data['priorityLabel']
                
                # Check prerequisites
                prereqs_met, missing_prereqs = self._add_prerequisite_check(subject, performance)
                
                if not prereqs_met and missing_prereqs:
                    # Add prerequisite milestones first
                    for prereq in missing_prereqs:
                        roadmap.append({
                            "milestone": f"Foundation: {prereq}",
                            "subject": prereq,
                            "tasks": [f"Review {prereq} fundamentals", 
                                     f"Complete {prereq} practice problems",
                                     f"Build {prereq} mini-project"],
                            "priority": "critical",
                            "duration": "2 weeks",
                            "reason": f"Required prerequisite for {subject}",
                            "resources": ["Khan Academy", "Coursera", "YouTube tutorials"]
                        })
                
                # Get curriculum for subject and level
                if subject in self.curriculum_db:
                    curriculum = self.curriculum_db[subject].get(level, [])
                    
                    for milestone_template in curriculum[:2]:  # Max 2 milestones per subject
                        milestone = {
                            "milestone": milestone_template['milestone'],
                            "subject": subject,
                            "tasks": milestone_template['tasks'],
                            "priority": priority_label,
                            "duration": milestone_template['duration'],
                            "resources": milestone_template['resources'],
                            "currentScore": score,
                            "targetScore": min(score + 20, 100),
                            "reason": self._get_milestone_reason(score, subject, interests, target_career)
                        }
                        roadmap.append(milestone)
                else:
                    # Generic milestone for subjects not in database
                    roadmap.append({
                        "milestone": f"Improve {subject} Skills",
                        "subject": subject,
                        "tasks": [
                            f"Review {subject} fundamentals",
                            f"Practice {subject} problems daily",
                            f"Complete {subject} projects",
                            "Seek help from instructors/peers"
                        ],
                        "priority": priority_label,
                        "duration": "3 weeks",
                        "currentScore": score,
                        "targetScore": min(score + 20, 100),
                        "reason": self._get_milestone_reason(score, subject, interests, target_career),
                        "resources": ["Online courses", "Textbooks", "Practice platforms"]
                    })
            
            # Estimate completion times
            self._estimate_completion_time(roadmap, time_available)
            
            # Generate study recommendations
            study_recommendations = self._generate_study_recommendations(
                performance, semester, time_available
            )
            
            # Generate semester-specific advice
            semester_advice = self._generate_semester_advice(semester, performance)
            
            # Calculate overall roadmap statistics
            total_hours = sum(m.get('estimatedHours', 30) for m in roadmap)
            total_weeks = sum(m.get('estimatedWeeks', 2) for m in roadmap)
            
            result = {
                "userId": user_id,
                "roadmap": roadmap,
                "studyRecommendations": study_recommendations,
                "semesterAdvice": semester_advice,
                "statistics": {
                    "totalMilestones": len(roadmap),
                    "estimatedTotalHours": round(total_hours, 1),
                    "estimatedTotalWeeks": round(total_weeks, 1),
                    "hoursPerWeek": time_available,
                    "criticalPriority": len([m for m in roadmap if m['priority'] == 'critical']),
                    "highPriority": len([m for m in roadmap if m['priority'] == 'high'])
                },
                "targetCareer": target_career,
                "generatedAt": datetime.utcnow().isoformat() + "Z"
            }
            
            logger.info(f"Roadmap generated: {len(roadmap)} milestones")
            return result
            
        except Exception as e:
            logger.error(f"Error generating roadmap: {str(e)}")
            raise
    
    def _get_milestone_reason(self, score, subject, interests, target_career):
        """Generate personalized reason for including milestone"""
        reasons = []
        
        if score < 50:
            reasons.append(f"Critical gap in {subject} fundamentals")
        elif score < 70:
            reasons.append(f"Strengthen {subject} foundation")
        
        if subject in interests:
            reasons.append("Aligns with your interests")
        
        if target_career and subject in self._get_career_subjects(target_career):
            reasons.append(f"Essential for {target_career}")
        
        return " • ".join(reasons) if reasons else f"Important for academic progress"
    
    def _generate_study_recommendations(self, performance, semester, time_available):
        """Generate personalized study recommendations"""
        recommendations = []
        
        avg_score = sum(performance.values()) / len(performance) if performance else 0
        
        # Time management
        if time_available < 10:
            recommendations.append({
                "category": "Time Management",
                "suggestion": "Consider increasing study time to at least 10-15 hours/week for optimal progress",
                "priority": "high"
            })
        
        # Study approach based on performance
        if avg_score < 60:
            recommendations.append({
                "category": "Study Strategy",
                "suggestion": "Focus on fundamentals first. Use active recall and spaced repetition techniques",
                "priority": "critical"
            })
            recommendations.append({
                "category": "Support",
                "suggestion": "Seek regular help from instructors and join study groups",
                "priority": "high"
            })
        elif avg_score < 80:
            recommendations.append({
                "category": "Study Strategy",
                "suggestion": "Balance theory with practical projects. Teach concepts to others to solidify understanding",
                "priority": "medium"
            })
        else:
            recommendations.append({
                "category": "Advanced Learning",
                "suggestion": "Explore advanced topics and contribute to open-source projects",
                "priority": "low"
            })
        
        # Weak subjects focus
        weak_subjects = [subj for subj, score in performance.items() if score < 50]
        if weak_subjects:
            recommendations.append({
                "category": "Priority Focus",
                "suggestion": f"Dedicate 60% of study time to: {', '.join(weak_subjects)}",
                "priority": "critical"
            })
        
        # Balance recommendation
        recommendations.append({
            "category": "Balance",
            "suggestion": "Maintain 70-30 balance between weak and strong subjects",
            "priority": "medium"
        })
        
        return recommendations
    
    def _generate_semester_advice(self, semester, performance):
        """Generate semester-specific advice"""
        advice = []
        
        if semester <= 2:
            advice.append("🎯 Build strong foundations - this semester sets the tone for your entire program")
            advice.append("📚 Focus on core subjects like Programming and Math")
            advice.append("🤝 Network with seniors and join tech communities")
        elif semester <= 4:
            advice.append("🚀 Start building projects to apply theoretical knowledge")
            advice.append("💼 Begin exploring internship opportunities")
            advice.append("🔬 Consider research projects or competitive programming")
        elif semester <= 6:
            advice.append("🎓 Deepen specialization in your areas of interest")
            advice.append("💻 Contribute to open-source projects")
            advice.append("📝 Start preparing for placement/grad school")
        else:
            advice.append("🏆 Focus on capstone projects and portfolio building")
            advice.append("🎤 Prepare for technical interviews")
            advice.append("🌐 Establish your professional online presence")
        
        return advice