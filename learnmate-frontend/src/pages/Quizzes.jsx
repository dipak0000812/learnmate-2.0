import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  TrendingUp, 
  Search,
  Filter,
  Play,
  CheckCircle,
  Lock
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/input';

const Quizzes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Mock quiz data (will be replaced with API call)
  const quizzes = [
    {
      id: 1,
      title: 'React Fundamentals',
      description: 'Test your knowledge of React basics, components, and hooks',
      category: 'Frontend',
      difficulty: 'Beginner',
      questions: 15,
      duration: 20,
      points: 150,
      completed: true,
      score: 85,
      thumbnail: '⚛️'
    },
    {
      id: 2,
      title: 'JavaScript ES6+',
      description: 'Modern JavaScript features and best practices',
      category: 'Programming',
      difficulty: 'Intermediate',
      questions: 20,
      duration: 30,
      points: 200,
      completed: true,
      score: 92,
      thumbnail: '📜'
    },
    {
      id: 3,
      title: 'Node.js & Express',
      description: 'Backend development with Node.js and Express framework',
      category: 'Backend',
      difficulty: 'Intermediate',
      questions: 18,
      duration: 25,
      points: 180,
      completed: false,
      thumbnail: '🟢'
    },
    {
      id: 4,
      title: 'Database Design',
      description: 'SQL, NoSQL, and database architecture fundamentals',
      category: 'Database',
      difficulty: 'Intermediate',
      questions: 15,
      duration: 20,
      points: 150,
      completed: false,
      thumbnail: '🗄️'
    },
    {
      id: 5,
      title: 'Machine Learning Basics',
      description: 'Introduction to ML algorithms and applications',
      category: 'AI/ML',
      difficulty: 'Advanced',
      questions: 25,
      duration: 40,
      points: 300,
      completed: false,
      locked: true,
      requiredLevel: 8,
      thumbnail: '🤖'
    },
    {
      id: 6,
      title: 'Python Programming',
      description: 'Core Python concepts and data structures',
      category: 'Programming',
      difficulty: 'Beginner',
      questions: 12,
      duration: 15,
      points: 120,
      completed: false,
      thumbnail: '🐍'
    },
  ];

  const categories = ['all', 'Frontend', 'Backend', 'Programming', 'Database', 'AI/ML'];
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || quiz.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || quiz.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'Advanced': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Available Quizzes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Test your knowledge and earn points
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg">
            <p className="text-sm">Total Points</p>
            <p className="text-2xl font-bold">1250</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Quizzes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{quizzes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {quizzes.filter(q => q.completed).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">89%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Streak</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">7 Days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              {difficulties.map(diff => (
                <option key={diff} value={diff}>
                  {diff === 'all' ? 'All Levels' : diff}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Quiz Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => (
          <Card key={quiz.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              {/* Thumbnail */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl mb-4">
                {quiz.thumbnail}
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {quiz.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {quiz.description}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                  {quiz.difficulty}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                  {quiz.category}
                </span>
                {quiz.completed && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 dark:bg-green-900/30 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {quiz.score}%
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {quiz.questions} Questions
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {quiz.duration} min
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  {quiz.points} pts
                </div>
              </div>

              {/* Action Button */}
              {quiz.locked ? (
                <Button variant="secondary" className="w-full" disabled>
                  <Lock className="w-4 h-4 mr-2" />
                  Unlock at Level {quiz.requiredLevel}
                </Button>
              ) : (
                <Link to={`/quiz/${quiz.id}`} className="block">
                  <Button className="w-full">
                    <Play className="w-4 h-4 mr-2" />
                    {quiz.completed ? 'Retake Quiz' : 'Start Quiz'}
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredQuizzes.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No quizzes found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default Quizzes;