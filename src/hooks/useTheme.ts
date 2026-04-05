import { useEffect } from 'react';
import type { ThemeConfig } from '../types';

const FONT_MAP: Record<string, string> = {
  inter: "'Inter', sans-serif",
  playfair: "'Playfair Display', serif",
  lato: "'Lato', sans-serif",
  merriweather: "'Merriweather', serif",
  poppins: "'Poppins', sans-serif",
};

const RADIUS_MAP: Record<string, string> = {
  none: '0px',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
};

export function useTheme(theme: ThemeConfig) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-accent', theme.accentColor);
    root.style.setProperty('--color-bg', theme.backgroundColor);
    root.style.setProperty('--color-surface', theme.surfaceColor);
    root.style.setProperty('--color-text', theme.textColor);
    root.style.setProperty('--radius-card', RADIUS_MAP[theme.borderRadius] ?? '0.75rem');
    root.style.setProperty('--font-body', FONT_MAP[theme.fontFamily] ?? "'Inter', sans-serif");
    const headingFont = theme.fontFamily === 'inter' ? "'Playfair Display', serif" : FONT_MAP[theme.fontFamily];
    root.style.setProperty('--font-heading', headingFont);
  }, [theme]);
}
