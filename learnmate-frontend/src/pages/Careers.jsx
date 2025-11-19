import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  Users,
  Star,
  Target,
  Brain,
  Search,
  Filter,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/input';
import { toast } from 'sonner';
import careerService from '../services/careerService';

const Careers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock career data (will be replaced with API call)
  const careers = [
    {
      id: 1,
      title: 'Full Stack Developer',
      category: 'Software Development',
      description: 'Build complete web applications from front-end to back-end',
      matchScore: 95,
      icon: '💻',
      salaryRange: '$70k - $150k',
      demand: 'Very High',
      demandScore: 95,
      growthRate: '+22%',
      requiredSkills: ['JavaScript', 'React', 'Node.js', 'Databases', 'Git'],
      learningPath: [
        'HTML/CSS Fundamentals',
        'JavaScript ES6+',
        'React.js',
        'Node.js & Express',
        'Database Design',
        'Full Stack Project'
      ],
      topCompanies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Netflix'],
      timeToLearn: '6-12 months',
      difficulty: 'Intermediate'
    },
    {
      id: 2,
      title: 'Data Scientist',
      category: 'Data & Analytics',
      description: 'Analyze complex data to drive business decisions',
      matchScore: 88,
      icon: '📊',
      salaryRange: '$80k - $160k',
      demand: 'Very High',
      demandScore: 92,
      growthRate: '+28%',
      requiredSkills: ['Python', 'Machine Learning', 'Statistics', 'SQL', 'Data Visualization'],
      learningPath: [
        'Python Programming',
        'Statistics & Mathematics',
        'Machine Learning',
        'Data Analysis',
        'Deep Learning',
        'Real-world Projects'
      ],
      topCompanies: ['Google', 'Amazon', 'IBM', 'Microsoft', 'Uber'],
      timeToLearn: '8-15 months',
      difficulty: 'Advanced'
    },
    {
      id: 3,
      title: 'UI/UX Designer',
      category: 'Design',
      description: 'Create beautiful and intuitive user experiences',
      matchScore: 82,
      icon: '🎨',
      salaryRange: '$60k - $130k',
      demand: 'High',
      demandScore: 85,
      growthRate: '+18%',
      requiredSkills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems'],
      learningPath: [
        'Design Principles',
        'User Research',
        'Wireframing',
        'Prototyping',
        'UI Design',
        'Portfolio Building'
      ],
      topCompanies: ['Apple', 'Airbnb', 'Adobe', 'Spotify', 'Uber'],
      timeToLearn: '4-8 months',
      difficulty: 'Beginner'
    },
    {
      id: 4,
      title: 'DevOps Engineer',
      category: 'Infrastructure',
      description: 'Automate and optimize software deployment',
      matchScore: 78,
      icon: '⚙️',
      salaryRange: '$75k - $155k',
      demand: 'Very High',
      demandScore: 90,
      growthRate: '+25%',
      requiredSkills: ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'Cloud (AWS/Azure)'],
      learningPath: [
        'Linux Fundamentals',
        'Networking Basics',
        'Docker & Containers',
        'Kubernetes',
        'CI/CD Pipelines',
        'Cloud Platforms'
      ],
      topCompanies: ['Amazon', 'Microsoft', 'Google', 'Netflix', 'Atlassian'],
      timeToLearn: '6-12 months',
      difficulty: 'Advanced'
    },
    {
      id: 5,
      title: 'Mobile App Developer',
      category: 'Mobile Development',
      description: 'Build native and cross-platform mobile applications',
      matchScore: 75,
      icon: '📱',
      salaryRange: '$65k - $145k',
      demand: 'High',
      demandScore: 88,
      growthRate: '+20%',
      requiredSkills: ['React Native', 'Flutter', 'iOS/Android', 'APIs', 'Mobile UI'],
      learningPath: [
        'Mobile Development Basics',
        'React Native/Flutter',
        'Mobile UI/UX',
        'API Integration',
        'App Deployment',
        'Portfolio Apps'
      ],
      topCompanies: ['Apple', 'Google', 'Meta', 'Uber', 'Spotify'],
      timeToLearn: '5-10 months',
      difficulty: 'Intermediate'
    },
    {
      id: 6,
      title: 'AI/ML Engineer',
      category: 'Artificial Intelligence',
      description: 'Develop intelligent systems and machine learning models',
      matchScore: 85,
      icon: '🤖',
      salaryRange: '$90k - $180k',
      demand: 'Very High',
      demandScore: 98,
      growthRate: '+35%',
      requiredSkills: ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'NLP'],
      learningPath: [
        'Python & Mathematics',
        'Machine Learning Basics',
        'Deep Learning',
        'Computer Vision',
        'NLP',
        'AI Projects'
      ],
      topCompanies: ['OpenAI', 'Google', 'Microsoft', 'Meta', 'Tesla'],
      timeToLearn: '10-18 months',
      difficulty: 'Advanced'
    }
  ];

  const categories = ['all', 'Software Development', 'Data & Analytics', 'Design', 'Infrastructure', 'Mobile Development', 'Artificial Intelligence'];

  const filteredCareers = careers.filter(career => {
    const matchesSearch = career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         career.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || career.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDemandColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    if (score >= 75) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
    return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'Advanced': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  // Handle AI Recommendations
  const handleGetAIRecommendations = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const onboardingData = JSON.parse(localStorage.getItem('onboardingData'));
      const assessmentResults = JSON.parse(localStorage.getItem('assessmentResults'));

      const userData = {
        userId: user?._id,
        name: user?.name,
        email: user?.email,
        dreamCareer: onboardingData?.dreamCareer || user?.dreamCareer,
        currentYear: onboardingData?.currentYear,
        experienceLevel: onboardingData?.experienceLevel,
        knownSkills: onboardingData?.knownSkills || [],
        assessmentScore: assessmentResults?.score,
        strengths: assessmentResults?.strengths || [],
        weaknesses: assessmentResults?.weaknesses || []
      };

      console.log('Sending to AI:', userData);
      const response = await careerService.getRecommendations(userData);
      
      if (response.status === 'success') {
        toast.success('AI recommendations generated! 🎉');
        console.log('AI Recommendations:', response.data);
        // TODO: Update careers with AI response when backend returns recommendations
      }
    } catch (error) {
      console.error('AI Recommendations Error:', error);
      toast.error('AI service is currently unavailable. Showing default careers.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Start Learning Path
  const handleStartLearningPath = () => {
    if (!selectedCareer) return;
    
    // Save selected career for roadmap generation
    localStorage.setItem('selectedCareer', JSON.stringify({
      title: selectedCareer.title,
      learningPath: selectedCareer.learningPath,
      difficulty: selectedCareer.difficulty,
      timeToLearn: selectedCareer.timeToLearn
    }));
    
    toast.success(`Starting learning path for ${selectedCareer.title}! 🚀`);
    
    // Close modal and navigate to roadmap
    setSelectedCareer(null);
    navigate('/roadmap');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Career Recommendations
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            AI-powered career paths based on your skills and interests
          </p>
        </div>
        <Button onClick={handleGetAIRecommendations} disabled={loading}>
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Get AI Recommendations
            </>
          )}
        </Button>
      </div>

      {/* AI Recommendation Banner */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Brain className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Based on Your Profile</h3>
                <p className="text-blue-100">We've analyzed your skills and learning progress</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <Star className="w-5 h-5 text-yellow-300" />
              <span className="font-semibold">Top 6 Matches</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search careers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
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
          </div>
        </CardContent>
      </Card>

      {/* Career Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCareers.map((career) => (
          <Card key={career.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl">
                    {career.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {career.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {career.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {career.matchScore}%
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Match</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {career.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Salary</span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">{career.salaryRange}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Growth</span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">{career.growthRate}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDemandColor(career.demandScore)}`}>
                  {career.demand} Demand
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(career.difficulty)}`}>
                  {career.difficulty}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-600 dark:bg-purple-900/30">
                  {career.timeToLearn}
                </span>
              </div>

              {/* Skills Required */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Required Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {career.requiredSkills.slice(0, 5).map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => setSelectedCareer(career)}
                >
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline">
                  <BookOpen className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredCareers.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No careers found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Career Detail Modal */}
      {selectedCareer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <span className="text-4xl">{selectedCareer.icon}</span>
                  {selectedCareer.title}
                </CardTitle>
                <Button variant="ghost" onClick={() => setSelectedCareer(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Learning Path */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Learning Path
                </h3>
                <div className="space-y-2">
                  {selectedCareer.learningPath.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                        {idx + 1}
                      </span>
                      <span className="text-gray-900 dark:text-white">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Companies */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  Top Hiring Companies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCareer.topCompanies.map((company, idx) => (
                    <span key={idx} className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg font-medium text-gray-900 dark:text-white">
                      {company}
                    </span>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={handleStartLearningPath}
              >
                Start Learning Path
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Careers;