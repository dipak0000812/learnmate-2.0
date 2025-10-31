import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Award,
  Home,
  RotateCcw,
  Share2,
  Download,
  Brain,
  Target,
  Clock
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const QuizResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock results data (will be replaced with API call)
  const results = {
    quizId: id,
    quizTitle: 'React Fundamentals',
    score: 85,
    totalQuestions: 10,
    correctAnswers: 8.5,
    incorrectAnswers: 1.5,
    timeTaken: 780, // in seconds
    pointsEarned: 128,
    rank: 'A',
    passed: true,
    passPercentage: 70,
    topicWiseScore: [
      { topic: 'React Basics', score: 90, total: 3 },
      { topic: 'Hooks', score: 85, total: 4 },
      { topic: 'Components', score: 75, total: 3 }
    ],
    questions: [
      {
        id: 1,
        question: 'What is React?',
        userAnswer: 0,
        correctAnswer: 0,
        isCorrect: true,
        explanation: 'Correct! React is indeed a JavaScript library for building user interfaces.'
      },
      {
        id: 2,
        question: 'What is JSX?',
        userAnswer: 1,
        correctAnswer: 1,
        isCorrect: true,
        explanation: 'Perfect! JSX is a syntax extension for JavaScript.'
      },
      {
        id: 3,
        question: 'Which hook is used for side effects in React?',
        userAnswer: 2,
        correctAnswer: 2,
        isCorrect: true,
        explanation: 'Great job! useEffect is used for side effects.'
      },
      {
        id: 4,
        question: 'What is the purpose of useState hook?',
        userAnswer: 1,
        correctAnswer: 0,
        isCorrect: false,
        explanation: 'Not quite. useState is used to manage component state, not fetch data.'
      }
    ],
    aiFeedback: {
      strengths: [
        'Excellent understanding of React fundamentals',
        'Strong grasp of hooks concepts',
        'Good knowledge of component lifecycle'
      ],
      improvements: [
        'Review state management patterns',
        'Practice more with useEffect dependencies',
        'Study advanced React patterns'
      ],
      recommendations: [
        'Take the "Advanced React" quiz next',
        'Review the State Management course',
        'Practice building more React projects'
      ]
    },
    badges: [
      { name: 'Quick Learner', icon: '⚡', earned: true },
      { name: 'First Attempt', icon: '🎯', earned: true }
    ]
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return '🎉 Outstanding Performance!';
    if (score >= 70) return '👏 Great Job!';
    if (score >= 50) return '👍 Good Effort!';
    return '💪 Keep Practicing!';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header with Score */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Score Circle */}
            <div className="flex justify-center">
              <div className="w-48 h-48">
                <div className="relative">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="white"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 88}`}
                      strokeDashoffset={`${2 * Math.PI * 88 * (1 - results.score / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold">{results.score}%</span>
                    <span className="text-xl opacity-90">{results.rank} Grade</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {getScoreMessage(results.score)}
                </h1>
                <p className="text-xl opacity-90">{results.quizTitle}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <CheckCircle className="w-6 h-6 mb-1" />
                  <p className="text-2xl font-bold">{results.correctAnswers}</p>
                  <p className="text-sm opacity-80">Correct</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <XCircle className="w-6 h-6 mb-1" />
                  <p className="text-2xl font-bold">{results.incorrectAnswers}</p>
                  <p className="text-sm opacity-80">Incorrect</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <Clock className="w-6 h-6 mb-1" />
                  <p className="text-2xl font-bold">{formatTime(results.timeTaken)}</p>
                  <p className="text-sm opacity-80">Time</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <Trophy className="w-6 h-6 mb-1" />
                  <p className="text-2xl font-bold">{results.pointsEarned}</p>
                  <p className="text-sm opacity-80">Points</p>
                </div>
              </div>

              {/* Badges Earned */}
              {results.badges.some(b => b.earned) && (
                <div className="flex gap-2">
                  {results.badges.filter(b => b.earned).map((badge, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2">
                      <span className="text-2xl">{badge.icon}</span>
                      <span className="text-sm font-medium">{badge.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => navigate('/dashboard')} variant="outline">
          <Home className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <Button onClick={() => navigate(`/quiz/${id}`)} variant="secondary">
          <RotateCcw className="w-4 h-4 mr-2" />
          Retake Quiz
        </Button>
        <Button variant="ghost">
          <Share2 className="w-4 h-4 mr-2" />
          Share Results
        </Button>
        <Button variant="ghost">
          <Download className="w-4 h-4 mr-2" />
          Download Certificate
        </Button>
      </div>

      {/* Topic-wise Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Topic-wise Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.topicWiseScore.map((topic, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {topic.topic}
                  </span>
                  <span className={`font-semibold ${getScoreColor(topic.score)}`}>
                    {topic.score}%
                  </span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
                    style={{ width: `${topic.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Strengths */}
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {results.aiFeedback.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="text-green-600 mt-0.5">✓</span>
                  {strength}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Areas for Improvement */}
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <TrendingUp className="w-5 h-5" />
              Improve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {results.aiFeedback.improvements.map((improvement, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="text-yellow-600 mt-0.5">→</span>
                  {improvement}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-600">
              <Brain className="w-5 h-5" />
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {results.aiFeedback.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="text-purple-600 mt-0.5">★</span>
                  {rec}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Answers Review */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Detailed Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {results.questions.map((q, idx) => (
              <div key={q.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                <div className="flex items-start gap-4">
                  {/* Question Number & Status */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    q.isCorrect 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {q.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>

                  <div className="flex-1">
                    {/* Question */}
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Question {idx + 1}: {q.question}
                    </h4>

                    {/* Status Badge */}
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                      q.isCorrect 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30' 
                        : 'bg-red-100 text-red-600 dark:bg-red-900/30'
                    }`}>
                      {q.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>

                    {/* AI Explanation */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-2">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong className="text-blue-600">AI Feedback:</strong> {q.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Actions */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Ready for the next challenge?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Continue your learning journey with more quizzes
              </p>
            </div>
            <Link to="/quizzes">
              <Button size="lg">
                Browse More Quizzes
                <TrendingUp className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizResults;