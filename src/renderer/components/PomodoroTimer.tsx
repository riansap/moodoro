import React, { useState, useEffect } from 'react';
import { TimerProvider } from '../contexts/TimerContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import TimerDisplay from './TimerDisplay';
import SettingsPanel from './SettingsPanel';

/**
 * PomodoroTimer is the main component that wraps the timer functionality
 * with necessary context providers and manages settings visibility
 */
const PomodoroTimer: React.FC = () => {
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Listen for toggle settings event
  useEffect(() => {
    const handleToggleSettings = () => setShowSettings((prev) => !prev);
    window.addEventListener('toggle-settings', handleToggleSettings);

    return () => {
      window.removeEventListener('toggle-settings', handleToggleSettings);
    };
  }, []);

  return (
    <ThemeProvider>
      <TimerProvider>
        <div className="app-container">
          {showSettings ? <SettingsPanel /> : <TimerDisplay />}
        </div>
      </TimerProvider>
    </ThemeProvider>
  );
};

export default PomodoroTimer;
