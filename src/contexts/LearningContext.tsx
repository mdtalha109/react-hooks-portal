import React, { createContext, useContext, useState, useEffect } from 'react';

interface LearningProgress {
  [hookId: string]: {
    completed: boolean;
    timeSpent: number;
    lastVisited: Date;
    notes: string;
    bookmarked: boolean;
  };
}

interface LearningSettings {
  theme: 'light' | 'dark' | 'auto';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'all';
  showHints: boolean;
  autoSave: boolean;
  soundEnabled: boolean;
}

interface LearningContextType {
  progress: LearningProgress;
  settings: LearningSettings;
  updateProgress: (hookId: string, updates: Partial<LearningProgress[string]>) => void;
  updateSettings: (updates: Partial<LearningSettings>) => void;
  resetProgress: () => void;
  getCompletionPercentage: () => number;
  getTotalTimeSpent: () => number;
}

const LearningContext = createContext<LearningContextType | null>(null);

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<LearningProgress>(() => {
    const saved = localStorage.getItem('learning-progress');
    return saved ? JSON.parse(saved) : {};
  });

  const [settings, setSettings] = useState<LearningSettings>(() => {
    const saved = localStorage.getItem('learning-settings');
    return saved ? JSON.parse(saved) : {
      theme: 'light',
      difficulty: 'all',
      showHints: true,
      autoSave: true,
      soundEnabled: false
    };
  });

  useEffect(() => {
    if (settings.autoSave) {
      localStorage.setItem('learning-progress', JSON.stringify(progress));
    }
  }, [progress, settings.autoSave]);

  useEffect(() => {
    localStorage.setItem('learning-settings', JSON.stringify(settings));
  }, [settings]);

  const updateProgress = (hookId: string, updates: Partial<LearningProgress[string]>) => {
    setProgress(prev => ({
      ...prev,
      [hookId]: {
        completed: false,
        timeSpent: 0,
        lastVisited: new Date(),
        notes: '',
        bookmarked: false,
        ...prev[hookId],
        ...updates
      }
    }));
  };

  const updateSettings = (updates: Partial<LearningSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const resetProgress = () => {
    setProgress({});
    localStorage.removeItem('learning-progress');
  };

  const getCompletionPercentage = () => {
    const totalHooks = 16; // Updated total number of hooks
    const completedHooks = Object.values(progress).filter(p => p.completed).length;
    return Math.round((completedHooks / totalHooks) * 100);
  };

  const getTotalTimeSpent = () => {
    return Object.values(progress).reduce((total, p) => total + p.timeSpent, 0);
  };

  return (
    <LearningContext.Provider value={{
      progress,
      settings,
      updateProgress,
      updateSettings,
      resetProgress,
      getCompletionPercentage,
      getTotalTimeSpent
    }}>
      {children}
    </LearningContext.Provider>
  );
};