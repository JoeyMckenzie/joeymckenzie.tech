import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export function useThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [enabled, setEnabled] = useState(false);

  const toggleDarkMode = () => setTheme(enabled ? 'light' : 'dark');

  useEffect(() => setEnabled(theme === 'dark'), [setEnabled, theme]);

  return {
    enabled,
    toggleDarkMode,
  };
}
