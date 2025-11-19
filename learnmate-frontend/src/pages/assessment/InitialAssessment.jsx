// src/pages/assessment/InitialAssessment.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Brain,
  Code,
  Database,
  Lightbulb,
  ArrowRight,
  Timer
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { toast } from 'sonner';

const InitialAssessment = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [startTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Adaptive question bank
  const questionBank = [
    // Programming Fundamentals (Easy)
    {
      id: 1,
      category: 'programming',
      difficulty: 'easy',
      question: 'What is the output of the following code?\n\nfor i in range(3):\n    print(i)',
      options: ['0 1 2', '1 2 3', '0 1 2 3', 'Error'],
      correct: 0,
      explanation: 'range(3) generates numbers from 0 to 2 (not including 3)'
    },
    {
      id: 2,
      category: 'programming',
      difficulty: 'easy',
      question: 'Which data type is mutable in Python?',
      options: ['String', 'Tuple', 'List', 'Integer'],
      correct: 2,
      explanation: 'Lists are mutable, meaning their contents can be changed after creation'
    },
    {
      id: 3,
      category: 'programming',
      difficulty: 'medium',
      question: 'What is the time complexity of accessing an element in an array by index?',
      options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
      correct: 2,
      explanation: 'Array access by index is O(1) - constant time operation'
    },
    
    // Data Structures (Medium)
    {
      id: 4,
      category: 'data-structures',
      difficulty: 'medium',
      question: 'Which data structure uses LIFO (Last In First Out)?',
      options: ['Queue', 'Stack', 'Array', 'Linked List'],
      correct: 1,
      explanation: 'Stack follows LIFO principle - last element added is first to be removed'
    },
    {
      id: 5,
      category: 'data-structures',
      difficulty: 'medium',
      question: 'What is the average time complexity of searching in a hash table?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correct: 0,
      explanation: 'Hash tables provide O(1) average case search with good hash function'
    },
    {
      id: 6,
      category: 'data-structures',
      difficulty: 'hard',
      question: 'In a binary search tree, which traversal gives nodes in sorted order?',
      options: ['Preorder', 'Inorder', 'Postorder', 'Level order'],
      correct: 1,
      explanation: 'Inorder traversal of BST visits nodes in ascending sorted order'
    },
    
    // Algorithms (Medium to Hard)
    {
      id: 7,
      category: 'algorithms',
      difficulty: 'medium',
      question: 'Which sorting algorithm has the best average time complexity?',
      options: ['Bubble Sort O(n²)', 'Quick Sort O(n log n)', 'Selection Sort O(n²)', 'Insertion Sort O(n²)'],
      correct: 1,
      explanation: 'Quick Sort has average time complexity of O(n log n)'
    },
    {
      id: 8,
      category: 'algorithms',
      difficulty: 'hard',
      question: 'What technique is used to solve the "Coin Change" problem optimally?',
      options: ['Greedy Algorithm', 'Divide and Conquer', 'Dynamic Programming', 'Backtracking'],
      correct: 2,
      explanation: 'Coin Change is a classic DP problem with overlapping subproblems'
    },
    {
      id: 9,
      category: 'algorithms',
      difficulty: 'hard',
      question: 'What is the space complexity of merge sort?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correct: 2,
      explanation: 'Merge sort requires O(n) extra space for merging arrays'
    },
    
    // Problem Solving
    {
      id: 10,
      category: 'problem-solving',
      difficulty: 'medium',
      question: 'To find if a string is a palindrome, which approach is most efficient?',
      options: [
        'Reverse and compare',
        'Two pointers from both ends',
        'Use stack',
        'Recursion'
      ],
      correct: 1,
      explanation: 'Two pointers approach is O(n) time and O(1) space - most efficient'
    },
    {
      id: 11,
      category: 'problem-solving',
      difficulty: 'hard',
      question: 'How would you detect a cycle in a linked list?',
      options: [
        'Use hash set to store visited nodes',
        'Floyd\'s Cycle Detection (Tortoise and Hare)',
        'Mark visited nodes',
        'All of the above'
      ],
      correct: 3,
      explanation: 'Multiple approaches work, but Floyd\'s algorithm is space-efficient O(1)'
    },
    {
      id: 12,
      category: 'problem-solving',
      difficulty: 'hard',
      question: 'What pattern solves "Find Kth largest element" efficiently?',
      options: ['Sort the array', 'Use Max Heap', 'QuickSelect algorithm', 'Both B and C'],
      correct: 3,
      explanation: 'Max Heap (O(n log k)) and QuickSelect (O(n) average) are efficient approaches'
    }
  ];

  const [questions] = useState(questionBank);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (optionIndex) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: {
        answer: optionIndex,
        correct: optionIndex === questions[currentQuestion].correct,
        timeSpent: timeElapsed
      }
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    const totalQuestions = questions.length;
    const answeredQuestions = Object.keys(answers).length;
    const correctAnswers = Object.values(answers).filter(a => a.correct).length;
    const score = (correctAnswers / totalQuestions) * 100;

    // Calculate category-wise performance
    const categoryScores = {};
    questions.forEach(q => {
      if (!categoryScores[q.category]) {
        categoryScores[q.category] = { total: 0, correct: 0 };
      }
      categoryScores[q.category].total++;
      if (answers[q.id]?.correct) {
        categoryScores[q.category].correct++;
      }
    });

    // Determine skill level
    let skillLevel = 'beginner';
    if (score >= 80) skillLevel = 'advanced';
    else if (score >= 60) skillLevel = 'intermediate';

    return {
      totalQuestions,
      answeredQuestions,
      correctAnswers,
      score: Math.round(score),
      categoryScores,
      skillLevel,
      timeSpent: timeElapsed,
      strengths: Object.entries(categoryScores)
        .filter(([_, s]) => (s.correct / s.total) >= 0.7)
        .map(([cat]) => cat),
      weaknesses: Object.entries(categoryScores)
        .filter(([_, s]) => (s.correct / s.total) < 0.5)
        .map(([cat]) => cat)
    };
  };

  const handleSubmit = () => {
    const unanswered = questions.length - Object.keys(answers).length;
    
    if (unanswered > 0) {
      const confirm = window.confirm(
        `You have ${unanswered} unanswered question(s). Submit anyway?`
      );
      if (!confirm) return;
    }

    setIsSubmitting(true);
    const results = calculateResults();
    
    // Save results to localStorage
    localStorage.setItem('assessmentResults', JSON.stringify(results));
    toast.success('Assessment completed! 🎉');
    
    // Redirect to results page
    setTimeout(() => {
      navigate('/assessment/results');
    }, 1000);
  };

  const currentQ = questions[currentQuestion];
  const selectedAnswer = answers[currentQ?.id]?.answer;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const categoryIcons = {
    'programming': <Code className="w-5 h-5" />,
    'data-structures': <Database className="w-5 h-5" />,
    'algorithms': <Brain className="w-5 h-5" />,
    'problem-solving': <Lightbulb className="w-5 h-5" />
  };

  if (!currentQ) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-300">Initial Skills Assessment</p>
                <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                  This helps us understand your current level and create a personalized roadmap. Take your time!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress and Timer */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Timer className="w-4 h-4" />
              <span className="font-mono">{formatTime(timeElapsed)}</span>
            </div>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-teal-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6 shadow-lg border-gray-200 dark:border-gray-700">
          <CardContent className="p-8">
            {/* Category Badge */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                {categoryIcons[currentQ.category]}
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300 capitalize">
                  {currentQ.category.replace('-', ' ')}
                </span>
              </div>
              <Badge 
                variant={
                  currentQ.difficulty === 'easy' ? 'success' :
                  currentQ.difficulty === 'medium' ? 'warning' : 'danger'
                }
                size="sm"
              >
                {currentQ.difficulty.toUpperCase()}
              </Badge>
            </div>

            {/* Question */}
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 leading-relaxed whitespace-pre-wrap">
              {currentQ.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    selectedAnswer === index
                      ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/20 shadow-md'
                      : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedAnswer === index
                        ? 'border-teal-600 bg-teal-600'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {selectedAnswer === index && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {option}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Question Counter */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-1 flex-wrap">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${
                      index === currentQuestion
                        ? 'bg-teal-600 text-white'
                        : answers[questions[index].id]
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            size="lg"
          >
            Previous
          </Button>

          <div className="flex gap-3">
            {currentQuestion < questions.length - 1 ? (
              <Button
                onClick={handleNext}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-teal-600"
              >
                Next Question
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-teal-600"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Warning for unanswered */}
        {currentQuestion === questions.length - 1 && Object.keys(answers).length < questions.length && (
          <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                You have {questions.length - Object.keys(answers).length} unanswered question(s). Review before submitting!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InitialAssessment;