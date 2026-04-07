import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const ThemeContext = createContext();

const palettes = {
  light: {
    bgPrimary: '#FFFDF5',
    bgSecondary: '#f5f5f5',
    bgTertiary: '#F8F9FA',
    bgCard: '#ffffff',
    bgCardHover: '#f9f9f9',
    bgInput: '#ffffff',
    bgOverlay: 'rgba(255,255,255,0.65)',
    textPrimary: '#1A1A1A',
    textSecondary: '#666666',
    textMuted: '#999999',
    textOnCoral: '#ffffff',
    textOnSage: '#ffffff',
    coral: '#FF6B6B',
    coralHover: '#ff5252',
    coralLight: '#FFF0F0',
    coralLighter: '#FFE8E8',
    coralBg: '#FFE8E6',
    sage: '#4A7C7E',
    sageLight: '#f0f9f8',
    border: '#E5E7EB',
    borderLight: '#e5e5e5',
    borderLighter: '#f0f0f0',
    shadow: '0 4px 16px rgba(0,0,0,0.08)',
    shadowSmall: '0 2px 8px rgba(0,0,0,0.05)',
    shadowMedium: '0 2px 8px rgba(0,0,0,0.08)',
    shadowLarge: '0 8px 24px rgba(0,0,0,0.15)',
    heroGradient: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
    pageGradient: 'linear-gradient(135deg, #f5f5f5 0%, #fffdf5 100%)',
    bodyGradient: 'linear-gradient(135deg, #FFF6F4, #FFFDF5)',
    ctaGradient: 'linear-gradient(135deg, #2C3E50, #34495E)',
    avatarGradient: 'linear-gradient(135deg, #FF6B6B, #4A7C7E)',
    footerBg: '#1A1A1A',
    footerText: 'rgba(255,255,255,0.7)',
    footerBorder: 'rgba(255,255,255,0.1)',
    messageBubbleMine: '#FF6B6B',
    messageBubbleTheirs: '#e5e5e5',
    messageTextMine: '#ffffff',
    messageTextTheirs: '#333333',
    progressBg: '#eee',
    tipBg: '#FFF5E8',
    badgeSuccess: '#e8f5e9',
    badgeSuccessText: '#2e7d32',
    badgeDanger: '#fce4ec',
    badgeDangerText: '#c62828',
    badgeWarning: '#fff3e0',
    badgeWarningText: '#e65100',
    // Admin-specific
    adminNavBg: '#1a1a1a',
    adminNavBorder: '#FF6B6B',
    adminNavText: '#ffffff',
    adminLogoutBorder: '#555',
    adminLogoutText: '#ccc',
  },
  dark: {
    bgPrimary: '#1a1a2e',
    bgSecondary: '#16213e',
    bgTertiary: '#1f2940',
    bgCard: '#1f2940',
    bgCardHover: '#263350',
    bgInput: '#1f2940',
    bgOverlay: 'rgba(31,41,64,0.85)',
    textPrimary: '#E8E8E8',
    textSecondary: '#A0A0B0',
    textMuted: '#7A7A8C',
    textOnCoral: '#ffffff',
    textOnSage: '#ffffff',
    coral: '#FF6B6B',
    coralHover: '#ff5252',
    coralLight: '#3D2030',
    coralLighter: '#3D2030',
    coralBg: '#3D2030',
    sage: '#5A9CA0',
    sageLight: '#1a2e2e',
    border: '#2D3748',
    borderLight: '#3D4F6F',
    borderLighter: '#2D3748',
    shadow: '0 4px 16px rgba(0,0,0,0.3)',
    shadowSmall: '0 2px 8px rgba(0,0,0,0.2)',
    shadowMedium: '0 2px 8px rgba(0,0,0,0.3)',
    shadowLarge: '0 8px 24px rgba(0,0,0,0.4)',
    heroGradient: 'linear-gradient(135deg, #16213e 0%, #1a1a2e 100%)',
    pageGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    bodyGradient: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    ctaGradient: 'linear-gradient(135deg, #0f0f23, #1a1a2e)',
    avatarGradient: 'linear-gradient(135deg, #FF6B6B, #5A9CA0)',
    footerBg: '#0f0f23',
    footerText: 'rgba(255,255,255,0.5)',
    footerBorder: 'rgba(255,255,255,0.08)',
    messageBubbleMine: '#FF6B6B',
    messageBubbleTheirs: '#2D3748',
    messageTextMine: '#ffffff',
    messageTextTheirs: '#E8E8E8',
    progressBg: '#2D3748',
    tipBg: '#2a2a1e',
    badgeSuccess: '#1a2e1a',
    badgeSuccessText: '#4caf50',
    badgeDanger: '#2e1a1a',
    badgeDangerText: '#ef5350',
    badgeWarning: '#2e2a1a',
    badgeWarningText: '#ffa726',
    // Admin-specific
    adminNavBg: '#0f0f23',
    adminNavBorder: '#FF6B6B',
    adminNavText: '#E8E8E8',
    adminLogoutBorder: '#3D4F6F',
    adminLogoutText: '#A0A0B0',
  },
  'high-contrast': {
    bgPrimary: '#000000',
    bgSecondary: '#000000',
    bgTertiary: '#000000',
    bgCard: '#000000',
    bgCardHover: '#1a1a1a',
    bgInput: '#000000',
    bgOverlay: 'rgba(0,0,0,0.95)',
    textPrimary: '#FFFFFF',
    textSecondary: '#FFFF00',
    textMuted: '#FFFF00',
    textOnCoral: '#000000',
    textOnSage: '#000000',
    coral: '#FF4444',
    coralHover: '#FF0000',
    coralLight: '#330000',
    coralLighter: '#330000',
    coralBg: '#330000',
    sage: '#00FFFF',
    sageLight: '#001a1a',
    border: '#FFFFFF',
    borderLight: '#FFFFFF',
    borderLighter: '#FFFFFF',
    shadow: 'none',
    shadowSmall: 'none',
    shadowMedium: 'none',
    shadowLarge: 'none',
    heroGradient: '#000000',
    pageGradient: '#000000',
    bodyGradient: '#000000',
    ctaGradient: '#000000',
    avatarGradient: 'linear-gradient(135deg, #FF4444, #00FFFF)',
    footerBg: '#000000',
    footerText: '#FFFF00',
    footerBorder: '#FFFFFF',
    messageBubbleMine: '#FF4444',
    messageBubbleTheirs: '#1a1a1a',
    messageTextMine: '#000000',
    messageTextTheirs: '#FFFFFF',
    progressBg: '#333333',
    tipBg: '#1a1a00',
    badgeSuccess: '#003300',
    badgeSuccessText: '#00FF00',
    badgeDanger: '#330000',
    badgeDangerText: '#FF4444',
    badgeWarning: '#332200',
    badgeWarningText: '#FFFF00',
    // Admin-specific
    adminNavBg: '#000000',
    adminNavBorder: '#FF4444',
    adminNavText: '#FFFFFF',
    adminLogoutBorder: '#FFFFFF',
    adminLogoutText: '#FFFF00',
  },
};

const THEME_KEY = 'roomiez-theme';

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || 'light';
    } catch {
      return 'light';
    }
  });

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_KEY, newTheme);
    } catch { /* ignore */ }
  };

  const cycleTheme = () => {
    const order = ['light', 'dark', 'high-contrast'];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const colors = useMemo(() => palettes[theme] || palettes.light, [theme]);

  const value = useMemo(() => ({
    theme,
    setTheme,
    cycleTheme,
    colors,
  }), [theme, colors]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};

export default ThemeContext;
