// src/pages/assessment/AssessmentResults.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Brain,
  Code,
  Database,
  Lightbulb,
  Sparkles,
  ArrowRight,
  Clock,
  Award
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { toast } from 'sonner';

const AssessmentResults = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load results from localStorage
    const savedResults = localStorage.getItem('assessmentResults');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    } else {
      toast.error('No assessment results found');
      navigate('/assessment/initial');
    }
    setLoading(false);
  }, [navigate]);

  const handleGenerateRoadmap = () => {
    toast.success('Generating your personalized roadmap...');
    // Save that user has completed assessment
    localStorage.setItem('assessmentCompleted', 'true');
    setTimeout(() => {
      navigate('/roadmap');
    }, 1500);
  };

  const categoryDetails = {
    'programming': {
      icon: <Code className="w-6 h-6" />,
      label: 'Programming Fundamentals',
      color: 'blue'
    },
    'data-structures': {
      icon: <Database className="w-6 h-6" />,
      label: 'Data Structures',
      color: 'purple'
    },
    'algorithms': {
      icon: <Brain className="w-6 h-6" />,
      label: 'Algorithms',
      color: 'teal'
    },
    'problem-solving': {
      icon: <Lightbulb className="w-6 h-6" />,
      label: 'Problem Solving',
      color: 'orange'
    }
  };

  const skillLevelConfig = {
    beginner: {
      label: 'Beginner',
      description: 'Building foundations',
      color: 'yellow',
      icon: '🌱',
      message: 'Great start! We\'ll build a strong foundation for you.'
    },
    intermediate: {
      label: 'Intermediate',
      description: 'Making good progress',
      color: 'blue',
      icon: '🌿',
      message: 'Good work! You have a solid base. Let\'s advance your skills.'
    },
    advanced: {
      label: 'Advanced',
      description: 'Strong foundations',
      color: 'green',
      icon: '🌳',
      message: 'Excellent! You have strong fundamentals. Let\'s focus on mastery.'
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!results) return null;

  const skillConfig = skillLevelConfig[results.skillLevel];
  const categoryEntries = Object.entries(results.categoryScores);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Assessment Complete! 🎉
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Here's your personalized skill analysis
          </p>
        </div>

        {/* Overall Score Card */}
        <Card className="mb-8 overflow-hidden border-2 border-teal-200 dark:border-teal-800">
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <p className="text-teal-100 mb-2">Your Overall Score</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-bold">{results.score}%</span>
                  <span className="text-2xl text-teal-100">
                    / 100
                  </span>
                </div>
                <p className="text-teal-100 mt-2">
                  {results.correctAnswers} out of {results.totalQuestions} correct
                </p>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="text-5xl">{skillConfig.icon}</div>
                <div className="text-center">
                  <Badge variant="secondary" size="lg" className="mb-2">
                    {skillConfig.label}
                  </Badge>
                  <p className="text-sm text-teal-100">{skillConfig.description}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 text-center md:text-right">
                <div className="flex items-center gap-2 text-teal-100">
                  <Clock className="w-5 h-5" />
                  <span>Time: {Math.floor(results.timeSpent / 60)}m {results.timeSpent % 60}s</span>
                </div>
                <div className="flex items-center gap-2 text-teal-100">
                  <CheckCircle className="w-5 h-5" />
                  <span>Completed: {results.answeredQuestions}/{results.totalQuestions}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Category Performance */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Target className="w-6 h-6 text-teal-600" />
                Category Performance
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Your performance across different topics
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryEntries.map(([category, scores]) => {
                const details = categoryDetails[category];
                const percentage = Math.round((scores.correct / scores.total) * 100);
                const isStrength = percentage >= 70;
                const isWeakness = percentage < 50;

                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-${details.color}-100 dark:bg-${details.color}-900/30`}>
                          {details.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {details.label}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {scores.correct} / {scores.total} correct
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {percentage}%
                        </span>
                        {isStrength && <CheckCircle className="w-5 h-5 text-green-600" />}
                        {isWeakness && <AlertCircle className="w-5 h-5 text-red-600" />}
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${
                          isStrength ? 'bg-green-600' :
                          isWeakness ? 'bg-red-600' : 'bg-yellow-600'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Strengths & Weaknesses */}
          <div className="space-y-6">
            {/* Strengths */}
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Strengths
                </h3>
              </CardHeader>
              <CardContent>
                {results.strengths.length > 0 ? (
                  <div className="space-y-2">
                    {results.strengths.map(strength => (
                      <div
                        key={strength}
                        className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                      >
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                          {categoryDetails[strength].label}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Keep practicing to build your strengths!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Weaknesses */}
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Focus Areas
                </h3>
              </CardHeader>
              <CardContent>
                {results.weaknesses.length > 0 ? (
                  <div className="space-y-2">
                    {results.weaknesses.map(weakness => (
                      <div
                        key={weakness}
                        className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                      >
                        <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                          {categoryDetails[weakness].label}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Great job! No major weaknesses detected.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Personalized Message */}
        <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Personalized Recommendation
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {skillConfig.message}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Based on your assessment, we'll create a customized learning roadmap that focuses on your areas of improvement while leveraging your strengths. Your roadmap will be tailored to help you achieve your goal efficiently.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button
            onClick={handleGenerateRoadmap}
            size="lg"
            className="bg-gradient-to-r from-teal-600 to-blue-600 text-lg px-8 py-6"
          >
            <Award className="w-5 h-5 mr-2" />
            Generate My Personalized Roadmap
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            This will create a custom learning path based on your assessment results
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResults;