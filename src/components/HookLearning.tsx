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
  Target
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

  useEffect(() => {
    if (selectedHook) {
      setSessionStartTime(new Date());
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

  const currentHook = hooks.find(h => h.id === selectedHook);
  const currentProgress = selectedHook ? progress[selectedHook] : null;
  const currentQuiz = quizzes.find(q => q.hookId === selectedHook);

  const currentIndex = hooks.findIndex(h => h.id === selectedHook);
  const prevHook = currentIndex > 0 ? hooks[currentIndex - 1] : null;
  const nextHook = currentIndex < hooks.length - 1 ? hooks[currentIndex + 1] : null;

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
            <div className="p-8 bg-blue-50 rounded-3xl mb-8">
              <Code size={64} className="text-blue-600 mx-auto" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Choose a Hook to Learn</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-md">
              Select a React hook from the sidebar to start your interactive learning journey
            </p>
            <button
              onClick={() => setShowSidebar(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
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

  return (
    <div className="min-h-screen flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setShowSidebar(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow"
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
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:relative fixed left-0 top-0 h-full w-80 bg-white border-r border-slate-200 shadow-xl lg:shadow-none z-50 flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="p-6 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={onBackToDashboard}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium"
                  >
                    <ArrowLeft size={18} />
                    Dashboard
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={onSettingsOpen}
                      className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      <Settings size={16} className="text-slate-600" />
                    </button>
                    <button
                      onClick={() => setShowSidebar(false)}
                      className="lg:hidden p-2 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      <X size={16} className="text-slate-600" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-xl">
                    <Code className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">React Hooks</h2>
                    <p className="text-sm text-slate-600">Interactive Learning</p>
                  </div>
                </div>
              </div>

              {/* Hooks List */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-1">
                  {hooks.map((hook) => {
                    const hookProgress = progress[hook.id];
                    const isCompleted = hookProgress?.completed || false;
                    const isSelected = selectedHook === hook.id;
                    
                    return (
                      <button
                        key={hook.id}
                        onClick={() => {
                          onHookSelect(hook.id);
                          setShowSidebar(false);
                        }}
                        className={`w-full text-left p-4 rounded-xl transition-all ${
                          isSelected 
                            ? 'bg-blue-600 text-white shadow-lg transform scale-[1.02]' 
                            : 'hover:bg-slate-50 border border-transparent hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-lg ${
                            isSelected 
                              ? 'bg-white/20' 
                              : 'bg-slate-100'
                          }`}>
                            <BookOpen size={16} className={isSelected ? 'text-white' : 'text-slate-600'} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                {hook.name}
                              </span>
                              {isCompleted && (
                                <CheckCircle size={14} className={isSelected ? 'text-white' : 'text-emerald-600'} />
                              )}
                            </div>
                            <p className={`text-sm leading-tight ${isSelected ? 'text-blue-100' : 'text-slate-600'}`}>
                              {hook.description}
                            </p>
                            <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-md font-medium border ${
                              isSelected 
                                ? 'bg-white/20 text-white border-white/30' 
                                : getDifficultyColor(hook.difficulty)
                            }`}>
                              {hook.difficulty}
                            </span>
                          </div>
                        </div>
                      </button>
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
            <div className="max-w-6xl mx-auto px-4 lg:px-8 py-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Target size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                      {getHookTitle(selectedHook)}
                    </h1>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <span className={`px-2 py-1 rounded-md font-medium border ${getDifficultyColor(currentHook.difficulty)}`}>
                        {currentHook.difficulty}
                      </span>
                      {currentProgress?.timeSpent && (
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{Math.floor(currentProgress.timeSpent / 60)}m studied</span>
                        </div>
                      )}
                      {currentProgress?.completed && (
                        <div className="flex items-center gap-1 text-emerald-600">
                          <CheckCircle size={14} />
                          <span>Completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleBookmark}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm font-medium ${
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
                    className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all text-sm font-medium"
                  >
                    <MessageSquare size={16} />
                    <span className="hidden sm:inline">Notes</span>
                  </button>
                  
                  {currentQuiz && (
                    <button
                      onClick={() => setShowQuiz(true)}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-all text-sm font-medium"
                    >
                      <Brain size={16} />
                      <span className="hidden sm:inline">Quiz</span>
                    </button>
                  )}
                  
                  {!currentProgress?.completed && (
                    <button
                      onClick={markAsCompleted}
                      className="flex items-center gap-2 px-3 py-2 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition-all text-sm font-medium"
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
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        {selectedHook && (
          <div className="bg-white border-t border-slate-200 p-4 shadow-sm">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <button
                onClick={() => prevHook && onHookSelect(prevHook.id)}
                disabled={!prevHook}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <ChevronLeft size={20} />
                <span className="hidden sm:inline">
                  {prevHook ? prevHook.name : 'Previous'}
                </span>
              </button>
              
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>{currentIndex + 1}</span>
                <div className="w-16 h-1 bg-slate-200 rounded-full">
                  <div 
                    className="h-1 bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / hooks.length) * 100}%` }}
                  />
                </div>
                <span>{hooks.length}</span>
              </div>
              
              <button
                onClick={() => nextHook && onHookSelect(nextHook.id)}
                disabled={!nextHook}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <span className="hidden sm:inline">
                  {nextHook ? nextHook.name : 'Next'}
                </span>
                <ChevronRight size={20} />
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