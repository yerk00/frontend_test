import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import "./App.css";

type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "frontend-theme-mode";

const getInitialTheme = (): ThemeMode => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return "light";
};

function App() {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-shell__topbar">
          <div className="app-shell__brand">
            <p className="app-shell__brand-title">Prueba Frontend</p>
            <p className="app-shell__brand-subtitle">
              Dashboard de publicaciones y reportes
            </p>
          </div>

          <div className="app-shell__actions">
            <button
              type="button"
              className="app-shell__theme-button"
              onClick={handleToggleTheme}
              aria-label="Cambiar tema"
            >
              {theme === "light" ? "Modo oscuro" : "Modo claro"}
            </button>
          </div>
        </header>

        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;