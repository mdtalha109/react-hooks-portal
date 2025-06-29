import React, { useState } from 'react';
import { LearningProvider } from './contexts/LearningContext';
import Dashboard from './components/Dashboard';
import HookLearning from './components/HookLearning';
import SettingsModal from './components/SettingsModal';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'learning'>('dashboard');
  const [selectedHook, setSelectedHook] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const handleStartLearning = (hookId?: string) => {
    if (hookId) {
      setSelectedHook(hookId);
    }
    setCurrentView('learning');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedHook('');
  };

  return (
    <LearningProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {currentView === 'dashboard' ? (
          <Dashboard 
            onStartLearning={handleStartLearning}
            onSettingsOpen={() => setShowSettings(true)}
          />
        ) : (
          <HookLearning 
            selectedHook={selectedHook}
            onHookSelect={setSelectedHook}
            onBackToDashboard={handleBackToDashboard}
            onSettingsOpen={() => setShowSettings(true)}
          />
        )}
        
        <SettingsModal 
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      </div>
    </LearningProvider>
  );
}

export default App;