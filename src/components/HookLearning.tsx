import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  BookOpen, 
  Brain, 
  CheckCircle, 
  Clock, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Settings,
  BookmarkPlus,
  MessageSquare,
  Code,
  Target,
  Search,
  Filter,
  Star,
  Zap,
  Award,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { useLearning } from '../contexts/LearningContext';
import { hooks } from '../data/hooks';
import { quizzes } from '../data/quizzes';
import UseStateExample from './examples/UseStateExample';
import UseEffectExample from './examples/UseEffectExample';
import UseContextExample from './examples/UseContextExample';
import UseReducerExample from './examples/UseReducerExample';
import UseCallbackExample from './examples/UseCallbackExample';
import UseMemoExample from './examples/UseMemoExample';
import UseRefExample from './examples/UseRefExample';
import AdvancedHooksExample from './examples/AdvancedHooksExample';
import CustomHooksExample from './examples/CustomHooksExample';
import NotesPanel from './NotesPanel';
import QuizModal from './QuizModal';

interface HookLearningProps {
  selectedHook: string;
  onHookSelect: (hookId: string) => void;
  onBackToDashboard: () => void;
  onSettingsOpen: () => void;
}

const HookLearning: React.FC<HookLearningProps> = ({ 
  selectedHook, 
  onHookSelect, 
  onBackToDashboard, 
  onSettingsOpen 
}) => {
  const { progress, updateProgress } = useLearning();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [studyTimer, setStudyTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (selectedHook) {
      setSessionStartTime(new Date());
      setIsTimerRunning(true);
      updateProgress(selectedHook, { lastVisited: new Date() });
    }

    return () => {
      if (selectedHook && sessionStartTime) {
        const timeSpent = Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000);
        updateProgress(selectedHook, { 
          timeSpent: (progress[selectedHook]?.timeSpent || 0) + timeSpent 
        });
      }
    };
  }, [selectedHook]);

  // Study timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setStudyTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const currentHook = hooks.find(h => h.id === selectedHook);
  const currentProgress = selectedHook ? progress[selectedHook] : null;
  const currentQuiz = quizzes.find(q => q.hookId === selectedHook);

  const currentIndex = hooks.findIndex(h => h.id === selectedHook);
  const prevHook = currentIndex > 0 ? hooks[currentIndex - 1] : null;
  const nextHook = currentIndex < hooks.length - 1 ? hooks[currentIndex + 1] : null;

  const filteredHooks = hooks.filter(hook => {
    const matchesSearch = hook.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hook.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || hook.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const toggleBookmark = () => {
    if (selectedHook) {
      const isBookmarked = currentProgress?.bookmarked || false;
      updateProgress(selectedHook, { bookmarked: !isBookmarked });
    }
  };

  const markAsCompleted = () => {
    if (selectedHook) {
      updateProgress(selectedHook, { completed: true });
    }
  };

  const handleQuizComplete = (score: number) => {
    if (selectedHook) {
      updateProgress(selectedHook, { 
        completed: score >= 70,
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getHookTitle = (hookId: string) => {
    const titles = {
      useState: 'useState Hook',
      useEffect: 'useEffect Hook',
      useContext: 'useContext Hook',
      useReducer: 'useReducer Hook',
      useCallback: 'useCallback Hook',
      useMemo: 'useMemo Hook',
      useRef: 'useRef Hook',
      useImperativeHandle: 'useImperativeHandle Hook',
      useLayoutEffect: 'useLayoutEffect Hook',
      useDebugValue: 'useDebugValue Hook',
      useId: 'useId Hook',
      useDeferredValue: 'useDeferredValue Hook',
      useTransition: 'useTransition Hook',
      useSyncExternalStore: 'useSyncExternalStore Hook',
      useInsertionEffect: 'useInsertionEffect Hook',
      custom: 'Custom Hooks'
    };
    return titles[hookId as keyof typeof titles] || hookId;
  };

  const renderContent = () => {
    switch (selectedHook) {
      case 'useState':
        return <UseStateExample />;
      case 'useEffect':
        return <UseEffectExample />;
      case 'useContext':
        return <UseContextExample />;
      case 'useReducer':
        return <UseReducerExample />;
      case 'useCallback':
        return <UseCallbackExample />;
      case 'useMemo':
        return <UseMemoExample />;
      case 'useRef':
        return <UseRefExample />;
      case 'useImperativeHandle':
      case 'useLayoutEffect':
      case 'useDebugValue':
      case 'useId':
      case 'useDeferredValue':
      case 'useTransition':
      case 'useSyncExternalStore':
      case 'useInsertionEffect':
        return <AdvancedHooksExample />;
      case 'custom':
        return <CustomHooksExample />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl mb-8 border border-blue-200"
            >
              <Code size={80} className="text-blue-600 mx-auto" />
            </motion.div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Choose a Hook to Learn</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-md leading-relaxed">
              Select a React hook from the sidebar to start your interactive learning journey
            </p>
            <button
              onClick={() => setShowSidebar(true)}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Menu size={20} />
              Browse Hooks
            </button>
          </div>
        );
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'intermediate': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'advanced': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getHookIcon = (hookId: string) => {
    const icons = {
      useState: '🎯',
      useEffect: '⚡',
      useContext: '🔗',
      useReducer: '⚙️',
      useCallback: '🚀',
      useMemo: '🧠',
      useRef: '📌',
      custom: '🛠️'
    };
    return icons[hookId as keyof typeof icons] || '⚛️';
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setShowSidebar(true)}
        className="lg:hidden fixed top-6 left-6 z-50 p-3 bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all hover:scale-105"
      >
        <Menu size={20} className="text-slate-700" />
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {(showSidebar || window.innerWidth >= 1024) && (
          <>
            {/* Mobile Backdrop */}
            {showSidebar && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={() => setShowSidebar(false)}
              />
            )}
            
            {/* Sidebar Content */}
            <motion.div
              initial={{ x: -400 }}
              animate={{ x: 0 }}
              exit={{ x: -400 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:relative fixed left-0 top-0 h-full w-96 bg-white border-r border-slate-200 shadow-2xl lg:shadow-none z-50 flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={onBackToDashboard}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium group"
                  >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Dashboard
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onSettingsOpen}
                      className="p-2 hover:bg-white/60 rounded-xl transition-colors"
                    >
                      <Settings size={16} className="text-slate-600" />
                    </button>
                    <button
                      onClick={() => setShowSidebar(false)}
                      className="lg:hidden p-2 hover:bg-white/60 rounded-xl transition-colors"
                    >
                      <X size={16} className="text-slate-600" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                    <Code className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">React Hooks</h2>
                    <p className="text-sm text-slate-600">Interactive Learning</p>
                  </div>
                </div>

                {/* Search and Filter */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search hooks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  
                  <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Hooks List */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {filteredHooks.map((hook) => {
                    const hookProgress = progress[hook.id];
                    const isCompleted = hookProgress?.completed || false;
                    const isSelected = selectedHook === hook.id;
                    const isBookmarked = hookProgress?.bookmarked || false;
                    
                    return (
                      <motion.button
                        key={hook.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => {
                          onHookSelect(hook.id);
                          setShowSidebar(false);
                        }}
                        className={`w-full text-left p-4 rounded-2xl transition-all duration-200 ${
                          isSelected 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-[1.02]' 
                            : 'hover:bg-slate-50 border border-transparent hover:border-slate-200 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`text-2xl ${isSelected ? 'grayscale-0' : ''}`}>
                            {getHookIcon(hook.id)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                {hook.name}
                              </span>
                              <div className="flex items-center gap-1">
                                {isCompleted && (
                                  <CheckCircle size={14} className={isSelected ? 'text-emerald-300' : 'text-emerald-600'} />
                                )}
                                {isBookmarked && (
                                  <Star size={14} className={isSelected ? 'text-amber-300' : 'text-amber-500'} />
                                )}
                              </div>
                            </div>
                            <p className={`text-sm leading-tight mb-3 ${isSelected ? 'text-blue-100' : 'text-slate-600'}`}>
                              {hook.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className={`inline-block px-2 py-1 text-xs rounded-lg font-medium border ${
                                isSelected 
                                  ? 'bg-white/20 text-white border-white/30' 
                                  : getDifficultyColor(hook.difficulty)
                              }`}>
                                {hook.difficulty}
                              </span>
                              {hookProgress?.timeSpent && (
                                <span className={`text-xs ${isSelected ? 'text-blue-200' : 'text-slate-500'}`}>
                                  {Math.floor(hookProgress.timeSpent / 60)}m studied
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navigation */}
        {selectedHook && currentHook && (
          <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
            <div className="max-w-6xl mx-auto px-6 lg:px-8 py-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl border border-blue-200">
                    <Target size={28} className="text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                      {getHookTitle(selectedHook)}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className={`px-3 py-1 rounded-lg font-medium border ${getDifficultyColor(currentHook.difficulty)}`}>
                        {currentHook.difficulty}
                      </span>
                      {currentProgress?.timeSpent && (
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          <span>{Math.floor(currentProgress.timeSpent / 60)}m studied</span>
                        </div>
                      )}
                      {currentProgress?.completed && (
                        <div className="flex items-center gap-2 text-emerald-600">
                          <CheckCircle size={14} />
                          <span>Completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Study Timer */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl">
                    <Clock size={16} className="text-slate-600" />
                    <span className="font-mono text-sm font-medium text-slate-700">
                      {formatTime(studyTimer)}
                    </span>
                    <button
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className="p-1 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      {isTimerRunning ? (
                        <Pause size={14} className="text-slate-600" />
                      ) : (
                        <Play size={14} className="text-slate-600" />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={toggleBookmark}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-medium ${
                      currentProgress?.bookmarked 
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <BookmarkPlus size={16} />
                    <span className="hidden sm:inline">
                      {currentProgress?.bookmarked ? 'Saved' : 'Save'}
                    </span>
                  </button>
                  
                  <button
                    onClick={() => setShowNotes(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all text-sm font-medium"
                  >
                    <MessageSquare size={16} />
                    <span className="hidden sm:inline">Notes</span>
                  </button>
                  
                  {currentQuiz && (
                    <button
                      onClick={() => setShowQuiz(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-all text-sm font-medium"
                    >
                      <Brain size={16} />
                      <span className="hidden sm:inline">Quiz</span>
                    </button>
                  )}
                  
                  {!currentProgress?.completed && (
                    <button
                      onClick={markAsCompleted}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition-all text-sm font-medium"
                    >
                      <CheckCircle size={16} />
                      <span className="hidden sm:inline">Complete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-white">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        {selectedHook && (
          <div className="bg-white border-t border-slate-200 p-6 shadow-sm">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <button
                onClick={() => prevHook && onHookSelect(prevHook.id)}
                disabled={!prevHook}
                className="flex items-center gap-3 px-6 py-3 text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium rounded-xl hover:bg-slate-50 group"
              >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <div className="text-left">
                  <div className="text-xs text-slate-500">Previous</div>
                  <div className="hidden sm:block">
                    {prevHook ? prevHook.name : 'None'}
                  </div>
                </div>
              </button>
              
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="font-medium">{currentIndex + 1}</span>
                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${((currentIndex + 1) / hooks.length) * 100}%` }}
                  />
                </div>
                <span className="font-medium">{hooks.length}</span>
              </div>
              
              <button
                onClick={() => nextHook && onHookSelect(nextHook.id)}
                disabled={!nextHook}
                className="flex items-center gap-3 px-6 py-3 text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium rounded-xl hover:bg-slate-50 group"
              >
                <div className="text-right">
                  <div className="text-xs text-slate-500">Next</div>
                  <div className="hidden sm:block">
                    {nextHook ? nextHook.name : 'None'}
                  </div>
                </div>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedHook && (
        <>
          <NotesPanel 
            hookId={selectedHook}
            isOpen={showNotes}
            onClose={() => setShowNotes(false)}
          />

          {currentQuiz && (
            <QuizModal
              isOpen={showQuiz}
              onClose={() => setShowQuiz(false)}
              hookId={selectedHook}
              questions={currentQuiz.questions}
              onComplete={handleQuizComplete}
            />
          )}
        </>
      )}
    </div>
  );
};

export default HookLearning;