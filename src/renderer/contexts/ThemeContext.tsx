import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

// Theme types
export type ThemeName =
  | 'light'
  | 'relax'
  | 'creative'
  | 'dark'
  | 'pastel'
  | 'vibrant'
  | 'forest';
export type Theme = {
  name: string;
  primary: string;
  accent: string;
  background: string;
  description: string;
};

interface ThemeContextType {
  currentTheme: ThemeName;
  setCurrentTheme: (theme: ThemeName) => void;
  themes: Record<ThemeName, Theme>;
}

const themes: Record<ThemeName, Theme> = {
  relax: {
    name: 'Chill',
    primary: '#0D9488',
    accent: '#22D3EE',
    background: '#FFF7ED',
    description:
      'Warna yang menenangkan untuk memberi kesan istirahat dan pelepasan stres.',
  },
  creative: {
    name: 'Energized',
    primary: '#F97316',
    accent: '#FDBA74',
    background: '#FFF7ED',
    description:
      'Cocok untuk sesi brainstorming atau kerja yang membutuhkan energi dan semangat.',
  },
  light: {
    name: 'Light',
    primary: '#1E293B',
    accent: '#4F46E5',
    background: '#FFF7ED',
    description:
      'Warna yang memberi kesan profesional, tenang, dan meningkatkan konsentrasi.',
  },
  dark: {
    name: 'Dark',
    primary: '#F8FAFC',
    accent: '#60A5FA',
    background: '#111827',
    description:
      'Tema gelap yang nyaman untuk penggunaan malam hari dan mengurangi kelelahan mata.',
  },
  pastel: {
    name: 'Pastel',
    primary: '#6B7280',
    accent: '#C4B5FD',
    background: '#F5F5F4',
    description:
      'Nuansa pastel yang lembut dan estetik untuk suasana kerja yang santai namun tetap fokus.',
  },
  vibrant: {
    name: 'Vibrant',
    primary: '#BE123C',
    accent: '#FB7185',
    background: '#FEF3C7',
    description:
      'Kombinasi warna cerah dan berani untuk memberikan energi dan motivasi tinggi.',
  },
  forest: {
    name: 'Forest',
    primary: '#166534',
    accent: '#4ADE80',
    background: '#F5F5DC',
    description:
      'Tema hijau alami yang membawa nuansa ketenangan dan kedekatan dengan alam.',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper function to adjust color brightness
const adjustColor = (color: string, amount: number): string => {
  const num = parseInt(color.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('pastel');

  // Apply theme to document
  useEffect(() => {
    const theme = themes[currentTheme];
    document.documentElement.style.setProperty(
      '--primary-color',
      theme.primary,
    );
    document.documentElement.style.setProperty('--accent-color', theme.accent);
    document.documentElement.style.setProperty(
      '--background-color',
      theme.background,
    );
    document.documentElement.style.setProperty(
      '--primary-color-light',
      adjustColor(theme.primary, 20),
    );
    document.documentElement.style.setProperty('--text-color', theme.primary);
    document.documentElement.style.setProperty(
      '--text-color-secondary',
      theme.primary === '#F8FAFC' ? '#64748B' : '#ccc',
    );
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
