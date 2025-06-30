import React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  BookOpen, 
  Trophy, 
  Clock, 
  Target, 
  Star, 
  ArrowRight, 
  CheckCircle,
  Settings,
  Zap,
  Brain,
  Code,
  Sparkles,
  TrendingUp,
  Award,
  ChevronRight,
  Flame,
  Calendar,
  BarChart3,
  Users,
  Bookmark,
  Filter
} from 'lucide-react';
import { useLearning } from '../contexts/LearningContext';
import { hooks } from '../data/hooks';

interface DashboardProps {
  onStartLearning: (hookId?: string) => void;
  onSettingsOpen: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartLearning, onSettingsOpen }) => {
  const { progress, getCompletionPercentage, getTotalTimeSpent } = useLearning();

  const completionPercentage = getCompletionPercentage();
  const totalTimeSpent = getTotalTimeSpent();
  const completedHooks = Object.values(progress).filter(p => p.completed).length;
  const bookmarkedHooks = Object.values(progress).filter(p => p.bookmarked).length;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getNextRecommended = () => {
    const basicHooks = ['useState', 'useEffect', 'useRef'];
    const intermediateHooks = ['useContext', 'useReducer'];
    const advancedHooks = ['useCallback', 'useMemo'];

    for (const hookId of basicHooks) {
      if (!progress[hookId]?.completed) {
        return hooks.find(h => h.id === hookId);
      }
    }
    for (const hookId of intermediateHooks) {
      if (!progress[hookId]?.completed) {
        return hooks.find(h => h.id === hookId);
      }
    }
    for (const hookId of advancedHooks) {
      if (!progress[hookId]?.completed) {
        return hooks.find(h => h.id === hookId);
      }
    }
    return hooks[0];
  };

  const recommendedHook = getNextRecommended();

  const recentlyStudied = Object.entries(progress)
    .filter(([_, p]) => p.lastVisited)
    .sort((a, b) => new Date(b[1].lastVisited!).getTime() - new Date(a[1].lastVisited!).getTime())
    .slice(0, 3)
    .map(([hookId]) => hooks.find(h => h.id === hookId))
    .filter(Boolean);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-emerald-500/10 text-emerald-700 border-emerald-200';
      case 'intermediate': return 'bg-amber-500/10 text-amber-700 border-amber-200';
      case 'advanced': return 'bg-rose-500/10 text-rose-700 border-rose-200';
      default: return 'bg-slate-500/10 text-slate-700 border-slate-200';
    }
  };

  const learningPaths = [
    {
      id: 'fundamentals',
      title: 'React Fundamentals',
      description: 'Master the core hooks every React developer needs',
      hooks: ['useState', 'useEffect', 'useRef'],
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      icon: BookOpen,
      difficulty: 'Beginner'
    },
    {
      id: 'state-management',
      title: 'State Management',
      description: 'Advanced patterns for complex state logic',
      hooks: ['useContext', 'useReducer', 'custom'],
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
      icon: Brain,
      difficulty: 'Intermediate'
    },
    {
      id: 'performance',
      title: 'Performance Optimization',
      description: 'Optimize your React apps for maximum performance',
      hooks: ['useCallback', 'useMemo', 'useLayoutEffect'],
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      borderColor: 'border-emerald-200',
      icon: Zap,
      difficulty: 'Advanced'
    }
  ];

  const getPathProgress = (pathHooks: string[]) => {
    const completed = pathHooks.filter(hookId => progress[hookId]?.completed).length;
    return Math.round((completed / pathHooks.length) * 100);
  };

  const getStreakDays = () => {
    // Simple streak calculation based on recent activity
    const recentDays = Object.values(progress)
      .filter(p => p.lastVisited)
      .map(p => new Date(p.lastVisited!).toDateString())
      .filter((date, index, arr) => arr.indexOf(date) === index)
      .length;
    return Math.min(recentDays, 7); // Cap at 7 days for demo
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                  <Code className="text-white" size={28} />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  React Hooks Mastery
                </h1>
                <p className="text-sm text-slate-600">Interactive Learning Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Flame size={16} className="text-orange-500" />
                  <span className="font-medium">{getStreakDays()} day streak</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Trophy size={16} className="text-amber-500" />
                  <span className="font-medium">{completedHooks} completed</span>
                </div>
              </div>
              <button
                onClick={onSettingsOpen}
                className="p-3 hover:bg-slate-100 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <Settings size={20} className="text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium mb-6 border border-blue-200">
            <Sparkles size={16} />
            Welcome back to your learning journey
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6 leading-tight">
            Master React Hooks
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Interactive learning with hands-on examples, real-world projects, and progress tracking
          </p>
          
          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-sm"></div>
              <span className="text-slate-600 font-medium">{completedHooks} Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
              <span className="text-slate-600 font-medium">{completionPercentage}% Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full shadow-sm"></div>
              <span className="text-slate-600 font-medium">{formatTime(totalTimeSpent)} Studied</span>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Continue Learning Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
                <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Star size={24} className="text-yellow-300" />
                  </div>
                  <span className="text-blue-100 text-sm font-medium uppercase tracking-wider">Recommended for you</span>
                </div>
                <h3 className="text-4xl font-bold mb-4">Continue with {recommendedHook?.name}</h3>
                <p className="text-blue-100 mb-8 text-lg leading-relaxed max-w-lg">{recommendedHook?.description}</p>
                <button
                  onClick={() => onStartLearning(recommendedHook?.id)}
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-2xl hover:bg-blue-50 transition-all font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
                >
                  <Play size={24} />
                  Start Learning
                  <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* Learning Paths */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">Learning Paths</h3>
                  <p className="text-slate-600">Structured learning journeys for every skill level</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors">
                  <Filter size={16} />
                  <span className="text-sm font-medium">Filter</span>
                </button>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {learningPaths.map((path, index) => {
                  const pathProgress = getPathProgress(path.hooks);
                  
                  return (
                    <motion.div
                      key={path.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      onClick={() => onStartLearning(path.hooks[0])}
                      className={`${path.bgColor} border ${path.borderColor} rounded-2xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300 group hover:-translate-y-1`}
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`p-4 bg-gradient-to-r ${path.color} rounded-2xl group-hover:scale-110 transition-transform shadow-lg`}>
                          <path.icon size={28} className="text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xl text-slate-900 mb-1">{path.title}</h4>
                          <span className="text-xs font-medium px-2 py-1 bg-white/60 rounded-full text-slate-600">
                            {path.difficulty}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-slate-700 mb-6 leading-relaxed">{path.description}</p>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-semibold text-slate-700">Progress</span>
                          <span className="font-bold text-slate-900">{pathProgress}%</span>
                        </div>
                        <div className="w-full bg-white/60 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-3 rounded-full bg-gradient-to-r ${path.color} transition-all duration-1000 shadow-sm`}
                            style={{ width: `${pathProgress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-600">{path.hooks.length} hooks total</span>
                          <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* All Hooks Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">All React Hooks</h3>
                  <p className="text-slate-600">Explore the complete collection of React hooks</p>
                </div>
                <button
                  onClick={() => onStartLearning()}
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                >
                  View All <ArrowRight size={16} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {hooks.slice(0, 8).map((hook) => {
                  const isCompleted = progress[hook.id]?.completed;
                  const isBookmarked = progress[hook.id]?.bookmarked;
                  
                  return (
                    <button
                      key={hook.id}
                      onClick={() => onStartLearning(hook.id)}
                      className="text-left p-4 rounded-xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-200 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-slate-300'} shadow-sm`}></div>
                        <span className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                          {hook.name}
                        </span>
                        {isBookmarked && <Bookmark size={12} className="text-amber-500" />}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-md border font-medium ${getDifficultyColor(hook.difficulty)}`}>
                        {hook.difficulty}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Progress Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <BarChart3 size={20} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Your Progress</h3>
              </div>
              
              <div className="space-y-6">
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-slate-200"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - completionPercentage / 100)}`}
                        className="text-blue-600 transition-all duration-1000"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-600">{completionPercentage}%</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm">Overall Completion</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <div className="text-2xl font-bold text-emerald-600 mb-1">{completedHooks}</div>
                    <div className="text-xs text-emerald-700 font-medium">Completed</div>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="text-2xl font-bold text-amber-600 mb-1">{formatTime(totalTimeSpent)}</div>
                    <div className="text-xs text-amber-700 font-medium">Time Spent</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recently Studied */}
            {recentlyStudied.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-xl">
                    <Clock size={20} className="text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Continue Learning</h3>
                </div>
                
                <div className="space-y-3">
                  {recentlyStudied.map((hook) => (
                    <button
                      key={hook?.id}
                      onClick={() => onStartLearning(hook?.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all text-left group border border-transparent hover:border-slate-200"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <BookOpen size={16} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                          {hook?.name}
                        </div>
                        <div className="text-xs text-slate-500">{hook?.difficulty}</div>
                      </div>
                      {progress[hook?.id!]?.completed && (
                        <CheckCircle size={16} className="text-emerald-600" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Achievement Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 rounded-xl">
                  <Trophy size={20} className="text-amber-600" />
                </div>
                <h3 className="font-bold text-amber-900">Next Achievement</h3>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-amber-800 leading-relaxed">
                  {completedHooks < 3 
                    ? `Complete ${3 - completedHooks} more hooks to unlock "Quick Learner" badge`
                    : completedHooks < 8
                    ? `Complete ${8 - completedHooks} more hooks to unlock "Hook Master" badge`
                    : "You've mastered React Hooks! 🎉"
                  }
                </p>
                
                <div className="w-full bg-amber-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-1000 shadow-sm"
                    style={{ 
                      width: `${Math.min(100, (completedHooks / (completedHooks < 3 ? 3 : 8)) * 100)}%` 
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-xs text-amber-700">
                  <span>Progress</span>
                  <span className="font-bold">
                    {Math.min(100, Math.round((completedHooks / (completedHooks < 3 ? 3 : 8)) * 100))}%
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Study Streak */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-xl">
                  <Flame size={20} className="text-orange-600" />
                </div>
                <h3 className="font-bold text-orange-900">Study Streak</h3>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">{getStreakDays()}</div>
                <p className="text-sm text-orange-800">
                  {getStreakDays() === 1 ? 'day' : 'days'} in a row
                </p>
                <p className="text-xs text-orange-600 mt-2">
                  Keep it up! Consistency is key to mastering React hooks.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;