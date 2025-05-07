import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-circular-progressbar/dist/styles.css';
import './App.css';
import PomodoroTimer from './components/PomodoroTimer';

// Define the electron API interface
declare global {
  interface Window {
    electronAPI?: {
      updateProgress?: (progress: number) => void;
    };
  }
}

/**
 * Main App component that sets up routing
 */
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PomodoroTimer />} />
      </Routes>
    </Router>
  );
};

export default App;
