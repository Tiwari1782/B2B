import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ThemeContext = createContext(null);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('b2b_theme');
    return saved ? saved === 'dark' : true;
  });

  const location = useLocation();
  const isDashboard =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/superadmin');

  useEffect(() => {
    if (isDashboard) {
      // Always force light mode on admin / super-admin pages
      document.body.classList.add('light');
    } else {
      document.body.classList.toggle('light', !isDark);
    }
    localStorage.setItem('b2b_theme', isDark ? 'dark' : 'light');
  }, [isDark, isDashboard]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark: isDashboard ? false : isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
