import React from 'react';
import { useTimer } from '../contexts/TimerContext';
import { useTheme } from '../contexts/ThemeContext';
import Icons from './Icons';

/**
 * SettingsPanel component renders the settings UI with sliders and theme selection
 */
const SettingsPanel: React.FC = () => {
  const {
    focusTime,
    setFocusTime,
    shortBreakTime,
    setShortBreakTime,
    alarmSound,
  } = useTimer();

  const { currentTheme, setCurrentTheme, themes } = useTheme();

  return (
    <div className="settings-panel">
      <div className="navigation">
        <button
          type="button"
          className="nav-button"
          onClick={() =>
            window.dispatchEvent(new CustomEvent('toggle-settings'))
          }
        >
          <Icons.Back />
        </button>
        <h3>Setting</h3>
        <div />
      </div>

      <div className="settings-row">
        <span className="settings-label">Focus</span>
        <div className="slider-container">
          <input
            type="range"
            min="1"
            max="60"
            value={focusTime}
            onChange={(e) => setFocusTime(Number(e.target.value))}
          />
        </div>
        <span className="slider-value">{focusTime}</span>
      </div>

      <div className="settings-row">
        <span className="settings-label">Break</span>
        <div className="slider-container">
          <input
            type="range"
            min="1"
            max="15"
            value={shortBreakTime}
            onChange={(e) => setShortBreakTime(Number(e.target.value))}
          />
        </div>
        <span className="slider-value">{shortBreakTime}</span>
      </div>

      <div className="settings-row">
        <span className="settings-label">Tema</span>
        <select
          value={currentTheme}
          onChange={(e) => setCurrentTheme(e.target.value as any)}
          className="theme-dropdown"
        >
          <option value="focus">{themes.light.name}</option>
          <option value="dark">{themes.dark.name}</option>
          <option value="relax">{themes.relax.name}</option>
          <option value="creative">{themes.creative.name}</option>
          <option value="pastel">{themes.pastel.name}</option>
          <option value="vibrant">{themes.vibrant.name}</option>
          <option value="forest">{themes.forest.name}</option>
        </select>
      </div>

      <div className="settings-row">
        <span className="settings-label">Alarm Volume</span>
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            defaultValue="0.7"
            onChange={(e) => {
              if (alarmSound) {
                alarmSound.volume = parseFloat(e.target.value);
              }
            }}
          />
        </div>
        <div className="check-volume">
          <button
            className="button-check"
            type="button"
            onClick={() => {
              alarmSound.currentTime = 0;
              alarmSound.play();
            }}
          >
            <Icons.Play />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
