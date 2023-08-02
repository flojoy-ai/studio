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

const ThemeContext = createContext<IThemeContext>({
  theme: "light",
  toggleTheme: () => console.warn("no theme provider"),
} as IThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<string>("light");

  const toggleTheme = useCallback(() => {
    const toggled = theme === "dark" ? "dark" : "light";
    setTheme(toggled);
    window.localStorage.setItem("theme", toggled);
  }, [theme]);

  useEffect(() => {
    const localTheme = window.localStorage.getItem("theme");
    if (localTheme) {
      setTheme(localTheme);
    }
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
