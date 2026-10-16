import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const THEME_KEY = "theme";

const ButtonTheme = () => {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem(THEME_KEY) === "dark",
  );

  useEffect(() => {
    const theme = isDark ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [isDark]);

  return (
    <label className="swap swap-rotate cursor-pointer">
      <input
        type="checkbox"
        checked={isDark}
        onChange={() => setIsDark((prev) => !prev)}
        aria-label="Toggle dark mode"
      />

      <Sun className="swap-on size-6 fill-current text-base-content" />

      <Moon className="swap-off size-6 fill-current text-base-content" />
    </label>
  );
};

export default ButtonTheme;
