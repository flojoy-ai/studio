import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface IThemeContext {
  theme: string;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<IThemeContext>({
  theme: "light",
  toggleTheme: () => console.warn("no theme provider"),
} as IThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<string>("light");

  const toggleTheme = useCallback(() => {
    const toggleTheme = theme === "light" ? "dark" : "light";
    setTheme(toggleTheme);
    window.localStorage.setItem("theme", toggleTheme);
  }, [theme]);

  useEffect(() => {
    const localTheme = window.localStorage.getItem("theme");
    localTheme && setTheme(localTheme);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext<IThemeContext>(ThemeContext);
