import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import { useTimer } from '../contexts/TimerContext';
import Icons from './Icons';

/**
 * TimerDisplay component renders the timer UI with progress circle and controls
 */
const TimerDisplay: React.FC = () => {
  const {
    timerMode,
    progress,
    formatTime,
    isRunning,
    toggleTimer,
    resetTimer,
    skipTimer,
  } = useTimer();

  return (
    <div className="settings-panel">
      <div className="navigation">
        <div />
        <h3>Moodoro</h3>
        <button
          className="nav-button"
          type="button"
          onClick={() =>
            window.dispatchEvent(new CustomEvent('toggle-settings'))
          }
        >
          <Icons.Settings />
        </button>
      </div>

      <div className="progress-container">
        <CircularProgressbar
          value={progress * 100}
          text={formatTime()}
          styles={{
            path: { stroke: 'var(--accent-color)' },
            trail: { stroke: '#e5e7eb' },
            text: {
              fill: 'var(--primary-color)',
              fontSize: '24px',
              fontWeight: 'bold',
            },
          }}
        />
        <div className="timer-label">
          {timerMode === 'focus' ? 'FOCUS' : 'BREAK'}
        </div>
      </div>

      <div className="timer-controls">
        <button className="control-button" type="button" onClick={resetTimer}>
          <Icons.Reset />
        </button>
        <button
          className="control-button play-button"
          type="button"
          onClick={toggleTimer}
        >
          {isRunning ? <Icons.Pause /> : <Icons.Play />}
        </button>
        <button className="control-button" type="button" onClick={skipTimer}>
          <Icons.Skip />
        </button>
      </div>
    </div>
  );
};

export default TimerDisplay;
