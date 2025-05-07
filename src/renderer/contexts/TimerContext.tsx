import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

import alarmSoundFile from '../../assets/alarm-ringtone.mp3';

// Timer types
export type TimerMode = 'focus' | 'shortBreak';

export type TimeLeft = {
  minutes: number;
  seconds: number;
};

interface TimerContextType {
  timerMode: TimerMode;
  setTimerMode: (mode: TimerMode) => void;
  timeLeft: TimeLeft;
  setTimeLeft: React.Dispatch<React.SetStateAction<TimeLeft>>;
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
  currentRound: number;
  setCurrentRound: React.Dispatch<React.SetStateAction<number>>;
  focusTime: number;
  setFocusTime: React.Dispatch<React.SetStateAction<number>>;
  shortBreakTime: number;
  setShortBreakTime: React.Dispatch<React.SetStateAction<number>>;
  progress: number;
  toggleTimer: () => void;
  resetTimer: () => void;
  skipTimer: () => void;
  formatTime: () => string;
  alarmSound: HTMLAudioElement;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Timer state
  const [timerMode, setTimerMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    minutes: 25,
    seconds: 0,
  });
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [focusTime, setFocusTime] = useState<number>(25);
  const [shortBreakTime, setShortBreakTime] = useState<number>(5);
  const [progress, setProgress] = useState<number>(0);

  // Initialize alarm sound
  const [alarmSound] = useState<HTMLAudioElement>(() => {
    const audio = new Audio(alarmSoundFile);

    audio.addEventListener('error', (e) => {
      console.error('Error loading audio file:', e);
    });

    return audio;
  });

  // Reset timer when mode or duration changes
  useEffect(() => {
    if (timerMode === 'focus') {
      setTimeLeft({ minutes: focusTime, seconds: 0 });
    } else {
      setTimeLeft({ minutes: shortBreakTime, seconds: 0 });
    }
  }, [timerMode, focusTime, shortBreakTime]);

  // Timer countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev.seconds === 0) {
            if (prev.minutes === 0) {
              clearInterval(interval!);
              handleTimerComplete();
              return prev;
            }
            return { minutes: prev.minutes - 1, seconds: 59 };
          } else {
            return { ...prev, seconds: prev.seconds - 1 };
          }
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  // Calculate and update progress
  useEffect(() => {
    const progressValue = calculateProgress();
    setProgress(progressValue);
    window.electronAPI?.updateProgress?.(progressValue);
  }, [timeLeft]);

  // Handle timer completion
  const handleTimerComplete = () => {
    setIsRunning(false);

    // Play sound when timer completes
    alarmSound.currentTime = 0;
    alarmSound
      .play()
      .catch((err) => console.error('Error playing alarm sound:', err));

    // Switch timer mode
    setTimerMode((prev) => {
      if (prev === 'focus') {
        // If completing a focus session
        return 'shortBreak';
      } else {
        // If completing a break session, increment round if needed
        if (currentRound < 4) {
          setCurrentRound((prev) => prev + 1);
        } else {
          setCurrentRound(1);
        }
        return 'focus';
      }
    });
  };

  // Format time as MM:SS
  const formatTime = (): string => {
    const minutes = timeLeft.minutes.toString().padStart(2, '0');
    const seconds = timeLeft.seconds.toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  // Toggle timer start/pause
  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  // Reset timer to initial state
  const resetTimer = () => {
    setIsRunning(false);
    if (timerMode === 'focus') {
      setTimeLeft({ minutes: focusTime, seconds: 0 });
    } else {
      setTimeLeft({ minutes: shortBreakTime, seconds: 0 });
    }
  };

  // Skip to next timer mode
  const skipTimer = () => {
    setIsRunning(false);
    const nextMode = timerMode === 'focus' ? 'shortBreak' : 'focus';
    setTimerMode(nextMode);
    setTimeLeft({
      minutes: nextMode === 'focus' ? focusTime : shortBreakTime,
      seconds: 0,
    });
  };

  // Calculate progress percentage
  const calculateProgress = (): number => {
    const total = (timerMode === 'focus' ? focusTime : shortBreakTime) * 60;
    const left = timeLeft.minutes * 60 + timeLeft.seconds;
    return (total - left) / total;
  };

  return (
    <TimerContext.Provider
      value={{
        timerMode,
        setTimerMode,
        timeLeft,
        setTimeLeft,
        isRunning,
        setIsRunning,
        currentRound,
        setCurrentRound,
        focusTime,
        setFocusTime,
        shortBreakTime,
        setShortBreakTime,
        progress,
        toggleTimer,
        resetTimer,
        skipTimer,
        formatTime,
        alarmSound,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

// Custom hook to use the timer context
export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
