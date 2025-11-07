import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Target, 
  Briefcase, 
  Clock, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { toast } from 'sonner';

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    currentYear: '',
    dreamCareer: '',
    timeCommitment: '',
    knownSkills: [],
    experienceLevel: ''
  });

  const totalSteps = 4;

  // Career options
  const careerOptions = [
    { 
      id: 'faang-swe', 
      title: 'FAANG Software Engineer',
      description: 'Google, Amazon, Meta, Apple, Netflix',
      icon: '💻',
      popular: true
    },
    { 
      id: 'product-manager', 
      title: 'Product Manager',
      description: 'Build and ship products',
      icon: '📱'
    },
    { 
      id: 'data-scientist', 
      title: 'Data Scientist',
      description: 'ML, AI, Analytics',
      icon: '📊'
    },
    { 
      id: 'full-stack-dev', 
      title: 'Full Stack Developer',
      description: 'Frontend + Backend',
      icon: '🌐'
    },
    { 
      id: 'ui-ux-designer', 
      title: 'UI/UX Designer',
      description: 'User experience design',
      icon: '🎨'
    },
    { 
      id: 'devops-engineer', 
      title: 'DevOps Engineer',
      description: 'Infrastructure & deployment',
      icon: '⚙️'
    }
  ];

  // Time commitment options
  const timeOptions = [
    { id: 'intensive', label: '3-4 hours/day', description: 'Fast track', icon: '🚀' },
    { id: 'moderate', label: '1-2 hours/day', description: 'Balanced', icon: '⚡' },
    { id: 'relaxed', label: '30 min/day', description: 'Steady pace', icon: '🐢' }
  ];

  // Experience levels
  const experienceLevels = [
    { id: 'beginner', label: 'Beginner', description: 'Just starting out', icon: '🌱' },
    { id: 'intermediate', label: 'Intermediate', description: 'Know the basics', icon: '🌿' },
    { id: 'advanced', label: 'Advanced', description: 'Strong foundation', icon: '🌳' }
  ];

  // Common skills
  const commonSkills = [
    'HTML/CSS', 'JavaScript', 'Python', 'Java', 'C++',
    'React', 'Node.js', 'SQL', 'Git', 'Data Structures',
    'Algorithms', 'System Design', 'OOP'
  ];

  const handleNext = () => {
    // Validation
    if (step === 1 && !formData.currentYear) {
      toast.error('Please select your current year');
      return;
    }
    if (step === 2 && !formData.dreamCareer) {
      toast.error('Please select your dream career');
      return;
    }
    if (step === 3 && !formData.experienceLevel) {
      toast.error('Please select your experience level');
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    // Save onboarding data
    localStorage.setItem('onboardingData', JSON.stringify(formData));
    toast.success('Profile completed! 🎉');
    
    // Redirect to initial assessment
    navigate('/assessment/initial');
  };

  const toggleSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      knownSkills: prev.knownSkills.includes(skill)
        ? prev.knownSkills.filter(s => s !== skill)
        : [...prev.knownSkills, skill]
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-teal-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-teal-600">
              {Math.round((step / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-teal-600 transition-all duration-500"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Card */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50">
          <CardContent className="p-8">
            {/* Step 1: Current Year */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome to LearnMate! 👋
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Let's personalize your learning journey
                  </p>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    What year are you currently in?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'Working Professional'].map((year) => (
                      <button
                        key={year}
                        onClick={() => setFormData({ ...formData, currentYear: year })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.currentYear === year
                            ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-teal-300'
                        }`}
                      >
                        <span className="font-medium text-gray-900 dark:text-white">
                          {year}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Dream Career */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    What's your dream career?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    We'll create a personalized roadmap to get you there
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {careerOptions.map((career) => (
                    <button
                      key={career.id}
                      onClick={() => setFormData({ ...formData, dreamCareer: career.id })}
                      className={`relative p-5 rounded-xl border-2 transition-all text-left ${
                        formData.dreamCareer === career.id
                          ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/20 scale-105'
                          : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 hover:scale-102'
                      }`}
                    >
                      {career.popular && (
                        <Badge variant="gradient" size="sm" className="absolute top-3 right-3">
                          Popular
                        </Badge>
                      )}
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{career.icon}</span>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                            {career.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {career.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Experience Level & Skills */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Your current skill level?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    This helps us customize your learning path
                  </p>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Experience Level
                  </label>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {experienceLevels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setFormData({ ...formData, experienceLevel: level.id })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.experienceLevel === level.id
                            ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-teal-300'
                        }`}
                      >
                        <div className="text-3xl mb-2">{level.icon}</div>
                        <div className="font-semibold text-gray-900 dark:text-white mb-1">
                          {level.label}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {level.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Skills you already know (optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {commonSkills.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          formData.knownSkills.includes(skill)
                            ? 'border-teal-600 bg-teal-600 text-white'
                            : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-teal-300'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Time Commitment */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    How much time can you dedicate?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    We'll adjust your roadmap accordingly
                  </p>
                </div>

                <div className="space-y-3">
                  {timeOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setFormData({ ...formData, timeCommitment: option.id })}
                      className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                        formData.timeCommitment === option.id
                          ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/20 scale-105'
                          : 'border-gray-200 dark:border-gray-700 hover:border-teal-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">{option.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                            {option.label}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {option.description}
                          </p>
                        </div>
                        {formData.timeCommitment === option.id && (
                          <CheckCircle className="w-6 h-6 text-teal-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mt-6">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    💡 <strong>Pro tip:</strong> Consistency is more important than intensity. 
                    Even 30 minutes daily can lead to significant progress!
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              {step > 1 ? (
                <Button
                  onClick={handleBack}
                  variant="outline"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              <Button
                onClick={handleNext}
                className="ml-auto"
              >
                {step === totalSteps ? (
                  <>
                    Complete Setup
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Skip Option */}
        {step === 1 && (
          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;