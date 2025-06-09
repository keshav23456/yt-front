import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Theme constants
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

const STORAGE_KEY = 'video-platform-theme';

// Initial state
const initialState = {
  theme: THEMES.LIGHT,
  isDark: false
};

// Action types
const THEME_ACTIONS = {
  SET_THEME: 'SET_THEME',
  TOGGLE_THEME: 'TOGGLE_THEME'
};

// Theme reducer
const themeReducer = (state, action) => {
  switch (action.type) {
    case THEME_ACTIONS.SET_THEME:
      return {
        ...state,
        theme: action.payload,
        isDark: action.payload === THEMES.DARK
      };

    case THEME_ACTIONS.TOGGLE_THEME:
      const newTheme = state.theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
      return {
        ...state,
        theme: newTheme,
        isDark: newTheme === THEMES.DARK
      };

    default:
      return state;
  }
};

// Create context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY);
      if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
        dispatch({ type: THEME_ACTIONS.SET_THEME, payload: savedTheme });
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const systemTheme = prefersDark ? THEMES.DARK : THEMES.LIGHT;
        dispatch({ type: THEME_ACTIONS.SET_THEME, payload: systemTheme });
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  }, []);

  // Apply theme to document and save to localStorage
  useEffect(() => {
    try {
      // Apply theme class to document
      document.documentElement.classList.remove(THEMES.LIGHT, THEMES.DARK);
      document.documentElement.classList.add(state.theme);
      
      // Update data attribute for CSS
      document.documentElement.setAttribute('data-theme', state.theme);
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, state.theme);
      
      // Update meta theme-color for mobile browsers
      const themeColor = state.isDark ? '#1f2937' : '#ffffff';
      let metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.head.appendChild(metaThemeColor);
      }
      metaThemeColor.content = themeColor;
      
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  }, [state.theme, state.isDark]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only update if no theme is saved in localStorage
      if (!localStorage.getItem(STORAGE_KEY)) {
        const systemTheme = e.matches ? THEMES.DARK : THEMES.LIGHT;
        dispatch({ type: THEME_ACTIONS.SET_THEME, payload: systemTheme });
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setTheme = (theme) => {
    if (Object.values(THEMES).includes(theme)) {
      dispatch({ type: THEME_ACTIONS.SET_THEME, payload: theme });
    }
  };

  const toggleTheme = () => {
    dispatch({ type: THEME_ACTIONS.TOGGLE_THEME });
  };

  const setLightTheme = () => {
    dispatch({ type: THEME_ACTIONS.SET_THEME, payload: THEMES.LIGHT });
  };

  const setDarkTheme = () => {
    dispatch({ type: THEME_ACTIONS.SET_THEME, payload: THEMES.DARK });
  };

  const resetToSystem = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = prefersDark ? THEMES.DARK : THEMES.LIGHT;
      dispatch({ type: THEME_ACTIONS.SET_THEME, payload: systemTheme });
    } catch (error) {
      console.error('Error resetting theme:', error);
    }
  };

  const value = {
    // State
    theme: state.theme,
    isDark: state.isDark,
    isLight: !state.isDark,
    
    // Constants
    themes: THEMES,
    
    // Actions
    setTheme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    resetToSystem
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;