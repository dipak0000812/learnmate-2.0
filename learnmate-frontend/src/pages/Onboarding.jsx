import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Layers,
  Plus,
  Trash2
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/input';
import Badge from '../components/ui/Badge';
import { toast } from 'sonner';
import onboardingService from '../services/onboardingService';

const interestOptions = [
  'Web Development',
  'Mobile Apps',
  'AI & Machine Learning',
  'Data Science',
  'Cloud Computing',
  'Cybersecurity',
  'Product Management',
  'UI/UX Design'
];

const experienceLevels = [
  { id: 'beginner', label: 'Beginner', description: 'Just starting out', icon: '🌱' },
  { id: 'intermediate', label: 'Intermediate', description: 'Know the basics', icon: '🌿' },
  { id: 'advanced', label: 'Advanced', description: 'Strong foundation', icon: '🌳' }
];

const commonSkills = [
  'HTML/CSS', 'JavaScript', 'Python', 'Java', 'C++',
  'React', 'Node.js', 'SQL', 'Git', 'Data Structures',
  'Algorithms', 'System Design', 'OOP'
];

const careerOptions = [
  { id: 'Full Stack Developer', title: 'Full Stack Developer', description: 'Frontend + Backend', icon: '🌐' },
  { id: 'Data Scientist', title: 'Data Scientist', description: 'ML, AI, Analytics', icon: '📊' },
  { id: 'AI/ML Engineer', title: 'AI/ML Engineer', description: 'Deep learning & AI systems', icon: '🤖' },
  { id: 'Product Manager', title: 'Product Manager', description: 'Build and ship products', icon: '📱' },
  { id: 'UI/UX Designer', title: 'UI/UX Designer', description: 'Design delightful experiences', icon: '🎨' },
  { id: 'DevOps Engineer', title: 'DevOps Engineer', description: 'Infrastructure & deployment', icon: '⚙️' }
];

const timeOptions = [
  { id: '3-months', label: '3 months (intensive)', description: '3-4 hours/day · Fast track', icon: '🚀' },
  { id: '6-months', label: '6 months (balanced)', description: '1-2 hours/day · Consistent pace', icon: '⚡' },
  { id: '1-year', label: '1 year (steady)', description: '30-60 min/day · Sustainable', icon: '🐢' }
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    interests: [],
    skillLevel: '',
    targetRole: '',
    dreamCompanies: [],
    newCompany: '',
    knownSkills: [],
    timeline: ''
  });

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const response = await onboardingService.getProgress();
        const onboardingData = response.data?.data?.onboardingData || {};
        setFormData((prev) => ({
          ...prev,
          interests: onboardingData.interests || [],
          skillLevel: onboardingData.skillLevel || '',
          targetRole: onboardingData.targetRole || '',
          dreamCompanies: onboardingData.dreamCompanies || [],
          knownSkills: onboardingData.knownSkills || [],
          timeline: onboardingData.timeline || ''
        }));
      } catch (error) {
        console.error('Failed to load onboarding progress', error);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, []);

  const toggleSelection = (list, value) =>
    list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

  const handleInterestToggle = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: toggleSelection(prev.interests, interest)
    }));
  };

  const handleSkillToggle = (skill) => {
    setFormData((prev) => ({
      ...prev,
      knownSkills: toggleSelection(prev.knownSkills, skill)
    }));
  };

  const addDreamCompany = () => {
    const company = formData.newCompany.trim();
    if (!company) return;
    if (formData.dreamCompanies.includes(company)) {
      toast.info('Company already added');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      dreamCompanies: [...prev.dreamCompanies, company],
      newCompany: ''
    }));
  };

  const removeDreamCompany = (company) => {
    setFormData((prev) => ({
      ...prev,
      dreamCompanies: prev.dreamCompanies.filter((c) => c !== company)
    }));
  };

  const handleSaveStep = async (currentStep) => {
    if (currentStep === 1) {
      await onboardingService.saveStep('interests', {
        interests: formData.interests,
        skillLevel: formData.skillLevel || 'beginner'
      });
    } else if (currentStep === 2) {
      await onboardingService.saveStep('goals', {
        dreamCompanies: formData.dreamCompanies,
        targetRole: formData.targetRole
      });
    } else if (currentStep === 3) {
      await onboardingService.saveStep('skills', {
        knownSkills: formData.knownSkills
      });
    } else if (currentStep === 4) {
      await onboardingService.saveStep('timeline', {
        timeline: formData.timeline
      });
    }
  };

  const validateStep = () => {
    if (step === 1) {
      if (formData.interests.length === 0) {
        toast.error('Select at least one interest');
        return false;
      }
      if (!formData.skillLevel) {
        toast.error('Select your current skill level');
        return false;
      }
    }
    if (step === 2 && !formData.targetRole) {
      toast.error('Select your target role');
      return false;
    }
    if (step === 4 && !formData.timeline) {
      toast.error('Select your preferred timeline');
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateStep()) return;
    try {
      setSaving(true);
      await handleSaveStep(step);
      if (step === totalSteps) {
        toast.success('Great! Let’s take a short assessment.');
        navigate('/assessment/initial');
      } else {
        setStep((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Failed to save onboarding step', error);
      toast.error(error.response?.data?.message || 'Failed to save your progress.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-teal-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-4xl">
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

        <Card className="bg-white/90 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
          <CardContent className="p-8 space-y-8">
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    What excites you the most?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Pick the topics you love and your current expertise level.
                  </p>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Areas of interest
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => handleInterestToggle(interest)}
                        className={`px-4 py-2 rounded-full border-2 transition ${
                          formData.interests.includes(interest)
                            ? 'border-teal-600 bg-teal-50 text-teal-700'
                            : 'border-gray-200 text-gray-700 hover:border-teal-300'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Current skill level
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {experienceLevels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setFormData((prev) => ({ ...prev, skillLevel: level.id }))}
                        className={`p-4 rounded-xl border-2 transition ${
                          formData.skillLevel === level.id
                            ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/20'
                            : 'border-gray-200 hover:border-teal-300'
                        }`}
                      >
                        <div className="text-3xl mb-2">{level.icon}</div>
                        <div className="font-semibold text-gray-900 dark:text-white">{level.label}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{level.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Define your dream role
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Choose your target role and dream companies.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {careerOptions.map((career) => (
                    <button
                      key={career.id}
                      onClick={() => setFormData((prev) => ({ ...prev, targetRole: career.id }))}
                      className={`relative p-5 rounded-xl border-2 text-left transition ${
                        formData.targetRole === career.id
                          ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/20 shadow-lg'
                          : 'border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{career.icon}</span>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">{career.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{career.description}</p>
                        </div>
                      </div>
                      {formData.targetRole === career.id && (
                        <Badge variant="gradient" size="sm" className="absolute top-3 right-3">
                          Selected
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Dream companies
                  </label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={formData.newCompany}
                      onChange={(e) => setFormData((prev) => ({ ...prev, newCompany: e.target.value }))}
                      placeholder="Add company name"
                    />
                    <Button type="button" onClick={addDreamCompany}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  {formData.dreamCompanies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.dreamCompanies.map((company) => (
                        <span key={company} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm">
                          {company}
                          <button onClick={() => removeDreamCompany(company)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Layers className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Show off your current skills
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    This helps us skip what you already know.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {commonSkills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => handleSkillToggle(skill)}
                      className={`px-4 py-2 rounded-xl border-2 transition ${
                        formData.knownSkills.includes(skill)
                          ? 'border-teal-600 bg-teal-600 text-white'
                          : 'border-gray-200 text-gray-700 hover:border-teal-300'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    How fast do you want to get there?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Pick the timeline that matches your schedule.
                  </p>
                </div>

                <div className="space-y-3">
                  {timeOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setFormData((prev) => ({ ...prev, timeline: option.id }))}
                      className={`w-full p-5 rounded-xl border-2 text-left transition ${
                        formData.timeline === option.id
                          ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/20 shadow-lg'
                          : 'border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">{option.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 dark:text-white">{option.label}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
                        </div>
                        {formData.timeline === option.id && <CheckCircle className="w-6 h-6 text-teal-600" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              {step > 1 ? (
                <Button onClick={handleBack} variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              <Button onClick={handleNext} className="ml-auto" disabled={saving}>
                {saving ? (
                  <>
                    Saving...
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                  </>
                ) : step === totalSteps ? (
                  <>
                    Continue to Assessment
                    <ArrowRight className="w-4 h-4 ml-2" />
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
      </div>
    </div>
  );
};

export default Onboarding;



