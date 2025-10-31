import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  Flag,
  RotateCcw
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { toast } from 'sonner';

const QuizTake = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());

  // Mock quiz data (will be replaced with API call)
  const quiz = {
    id: 1,
    title: 'React Fundamentals',
    duration: 20,
    totalQuestions: 10,
    questions: [
      {
        id: 1,
        question: 'What is React?',
        options: [
          'A JavaScript library for building user interfaces',
          'A programming language',
          'A database management system',
          'A web server'
        ],
        correctAnswer: 0
      },
      {
        id: 2,
        question: 'What is JSX?',
        options: [
          'A JavaScript framework',
          'A syntax extension for JavaScript',
          'A CSS preprocessor',
          'A database query language'
        ],
        correctAnswer: 1
      },
      {
        id: 3,
        question: 'Which hook is used for side effects in React?',
        options: [
          'useState',
          'useContext',
          'useEffect',
          'useReducer'
        ],
        correctAnswer: 2
      },
      {
        id: 4,
        question: 'What is the purpose of useState hook?',
        options: [
          'To manage component state',
          'To fetch data from API',
          'To navigate between pages',
          'To style components'
        ],
        correctAnswer: 0
      },
      {
        id: 5,
        question: 'What is a React component?',
        options: [
          'A JavaScript function or class',
          'A CSS file',
          'An HTML template',
          'A database table'
        ],
        correctAnswer: 0
      },
      {
        id: 6,
        question: 'What is props in React?',
        options: [
          'A way to pass data between components',
          'A styling method',
          'A routing technique',
          'A state management tool'
        ],
        correctAnswer: 0
      },
      {
        id: 7,
        question: 'What is the Virtual DOM?',
        options: [
          'A copy of the real DOM kept in memory',
          'A new version of HTML',
          'A JavaScript framework',
          'A CSS technique'
        ],
        correctAnswer: 0
      },
      {
        id: 8,
        question: 'Which method is used to update state?',
        options: [
          'updateState()',
          'setState()',
          'changeState()',
          'modifyState()'
        ],
        correctAnswer: 1
      },
      {
        id: 9,
        question: 'What is React Router used for?',
        options: [
          'State management',
          'Navigation between pages',
          'API calls',
          'Styling components'
        ],
        correctAnswer: 1
      },
      {
        id: 10,
        question: 'What is the purpose of useContext hook?',
        options: [
          'To manage local state',
          'To share data across components',
          'To make API calls',
          'To handle events'
        ],
        correctAnswer: 1
      }
    ]
  };

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get time color based on remaining time
  const getTimeColor = () => {
    if (timeLeft < 60) return 'text-red-600';
    if (timeLeft < 300) return 'text-yellow-600';
    return 'text-green-600';
  };

  // Handle answer selection
  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex
    });
  };

  // Navigate to question
  const goToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  // Next question
  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Previous question
  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Toggle flag
  const toggleFlag = (questionIndex) => {
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(questionIndex)) {
      newFlagged.delete(questionIndex);
    } else {
      newFlagged.add(questionIndex);
    }
    setFlaggedQuestions(newFlagged);
  };

  // Submit quiz
  const handleSubmit = async () => {
    const unanswered = quiz.questions.length - Object.keys(selectedAnswers).length;
    
    if (unanswered > 0) {
      const confirm = window.confirm(
        `You have ${unanswered} unanswered question(s). Do you want to submit anyway?`
      );
      if (!confirm) return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Quiz submitted successfully!');
      navigate(`/quiz/results/${id}`);
    }, 1000);
  };

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {quiz.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border-2 ${timeLeft < 60 ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}>
          <Clock className={`w-5 h-5 ${getTimeColor()}`} />
          <span className={`text-xl font-bold ${getTimeColor()}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
          <span>{answeredCount} answered</span>
          <span>{quiz.questions.length - answeredCount} remaining</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Card */}
        <Card className="lg:col-span-3">
          <CardContent className="p-8">
            {/* Question Number & Flag */}
            <div className="flex items-center justify-between mb-6">
              <span className="px-3 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900/30 rounded-lg text-sm font-medium">
                Question {currentQuestion + 1}
              </span>
              <button
                onClick={() => toggleFlag(currentQuestion)}
                className={`p-2 rounded-lg transition-colors ${
                  flaggedQuestions.has(currentQuestion)
                    ? 'bg-red-100 text-red-600 dark:bg-red-900/30'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                <Flag className="w-5 h-5" />
              </button>
            </div>

            {/* Question Text */}
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
              {question.question}
            </h2>

            {/* Options */}
            <div className="space-y-4">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQuestion, index)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {selectedAnswers[currentQuestion] === index && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="text-lg text-gray-900 dark:text-white">
                      {option}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={previousQuestion}
                disabled={currentQuestion === 0}
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Previous
              </Button>

              {currentQuestion === quiz.questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Quiz
                      <CheckCircle className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={nextQuestion}>
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Question Navigator */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Question Navigator
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all relative ${
                    currentQuestion === index
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : selectedAnswers[index] !== undefined
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  {index + 1}
                  {flaggedQuestions.has(index) && (
                    <Flag className="w-3 h-3 text-red-500 absolute top-0 right-0" />
                  )}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Not answered</span>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Answered</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {answeredCount}/{quiz.questions.length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Flagged</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {flaggedQuestions.size}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warning for unanswered questions */}
      {answeredCount < quiz.questions.length && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              You have {quiz.questions.length - answeredCount} unanswered question(s). 
              Make sure to answer all questions before submitting.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuizTake;