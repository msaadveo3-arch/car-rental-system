import React, { createContext, useEffect, useMemo, useState } from 'react';

export type AppTheme = 'light' | 'dark';

type ThemeContextValue = {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
};

const STORAGE_KEY = 'car-rental-theme';

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getInitialTheme = (): AppTheme => {
  const savedTheme = window.localStorage.getItem(STORAGE_KEY);
  return savedTheme === 'dark' ? 'dark' : 'light';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<AppTheme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light')),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
