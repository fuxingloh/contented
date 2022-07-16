import { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext(undefined);

export function ThemeProvider(props) {
  const [theme, setTheme] = useState(props.theme);

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      setTheme(document.documentElement.getAttribute('data-theme'));
    }
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{props.children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
