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
  ChevronRight
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
    .slice(0, 4)
    .map(([hookId]) => hooks.find(h => h.id === hookId))
    .filter(Boolean);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'intermediate': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'advanced': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const learningPaths = [
    {
      id: 'beginner',
      title: 'Fundamentals',
      description: 'Master the essential hooks',
      hooks: ['useState', 'useEffect', 'useRef'],
      color: 'emerald',
      icon: BookOpen
    },
    {
      id: 'intermediate',
      title: 'State Management',
      description: 'Advanced state patterns',
      hooks: ['useContext', 'useReducer', 'custom'],
      color: 'blue',
      icon: Brain
    },
    {
      id: 'advanced',
      title: 'Performance',
      description: 'Optimization techniques',
      hooks: ['useCallback', 'useMemo', 'useLayoutEffect'],
      color: 'purple',
      icon: Zap
    }
  ];

  const getPathProgress = (pathHooks: string[]) => {
    const completed = pathHooks.filter(hookId => progress[hookId]?.completed).length;
    return Math.round((completed / pathHooks.length) * 100);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Code className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">React Hooks Mastery</h1>
              </div>
            </div>
            <button
              onClick={onSettingsOpen}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Settings size={20} className="text-slate-600" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Sparkles size={16} />
            Welcome back to your learning journey
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Master React Hooks
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Interactive learning with hands-on examples, quizzes, and progress tracking
          </p>
          
          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-slate-600">{completedHooks} Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-slate-600">{completionPercentage}% Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span className="text-slate-600">{formatTime(totalTimeSpent)} Studied</span>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <Star size={20} className="text-yellow-300" />
                  <span className="text-blue-100 text-sm font-medium uppercase tracking-wide">Recommended</span>
                </div>
                <h3 className="text-3xl font-bold mb-3">Continue with {recommendedHook?.name}</h3>
                <p className="text-blue-100 mb-6 text-lg">{recommendedHook?.description}</p>
                <button
                  onClick={() => onStartLearning(recommendedHook?.id)}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Play size={20} />
                  Start Learning
                  <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>

            {/* Learning Paths */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Learning Paths</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {learningPaths.map((path, index) => {
                  const pathProgress = getPathProgress(path.hooks);
                  const colorClasses = {
                    emerald: 'from-emerald-500 to-emerald-600 bg-emerald-50 border-emerald-200 text-emerald-900',
                    blue: 'from-blue-500 to-blue-600 bg-blue-50 border-blue-200 text-blue-900',
                    purple: 'from-purple-500 to-purple-600 bg-purple-50 border-purple-200 text-purple-900'
                  };
                  
                  return (
                    <motion.div
                      key={path.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      onClick={() => onStartLearning(path.hooks[0])}
                      className={`${colorClasses[path.color as keyof typeof colorClasses].split(' ').slice(2).join(' ')} border rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all group`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 bg-gradient-to-r ${colorClasses[path.color as keyof typeof colorClasses].split(' ').slice(0, 2).join(' ')} rounded-xl group-hover:scale-110 transition-transform`}>
                          <path.icon size={24} className="text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{path.title}</h4>
                          <p className="text-sm opacity-70">{path.hooks.length} hooks</p>
                        </div>
                      </div>
                      
                      <p className="text-sm mb-4 opacity-80">{path.description}</p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">Progress</span>
                          <span className="font-bold">{pathProgress}%</span>
                        </div>
                        <div className="w-full bg-white/50 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${colorClasses[path.color as keyof typeof colorClasses].split(' ').slice(0, 2).join(' ')} transition-all duration-1000`}
                            style={{ width: `${pathProgress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs opacity-70">{path.hooks.length} hooks total</span>
                          <ChevronRight size={16} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Browse All Hooks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900">All React Hooks</h3>
                <button
                  onClick={() => onStartLearning()}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                >
                  View All <ArrowRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {hooks.slice(0, 8).map((hook) => {
                  const isCompleted = progress[hook.id]?.completed;
                  return (
                    <button
                      key={hook.id}
                      onClick={() => onStartLearning(hook.id)}
                      className="text-left p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                        <span className="font-medium text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                          {hook.name}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-md border ${getDifficultyColor(hook.difficulty)}`}>
                        {hook.difficulty}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Progress Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4">Your Progress</h3>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{completionPercentage}%</div>
                  <div className="text-sm text-slate-600">Complete</div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div className="text-center">
                    <div className="text-xl font-bold text-emerald-600">{completedHooks}</div>
                    <div className="text-xs text-slate-600">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-amber-600">{formatTime(totalTimeSpent)}</div>
                    <div className="text-xs text-slate-600">Time Spent</div>
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
                <h3 className="text-lg font-bold text-slate-900 mb-4">Continue Learning</h3>
                <div className="space-y-3">
                  {recentlyStudied.map((hook) => (
                    <button
                      key={hook?.id}
                      onClick={() => onStartLearning(hook?.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpen size={16} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 text-sm">{hook?.name}</div>
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

            {/* Achievement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <Trophy size={20} className="text-amber-600" />
                <h3 className="font-bold text-amber-900">Achievement</h3>
              </div>
              <p className="text-sm text-amber-800 mb-3">
                {completedHooks < 3 
                  ? `Complete ${3 - completedHooks} more hooks to unlock "Quick Learner"`
                  : completedHooks < 8
                  ? `Complete ${8 - completedHooks} more hooks to unlock "Hook Master"`
                  : "You've mastered React Hooks! 🎉"
                }
              </p>
              <div className="w-full bg-amber-200 rounded-full h-2">
                <div 
                  className="bg-amber-600 h-2 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${Math.min(100, (completedHooks / (completedHooks < 3 ? 3 : 8)) * 100)}%` 
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;