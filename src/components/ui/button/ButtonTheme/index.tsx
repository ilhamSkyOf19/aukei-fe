import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const ButtonTheme = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light",
    );
  }, [isDark]);

  return (
    <label className="swap swap-rotate cursor-pointer">
      <input
        type="checkbox"
        checked={isDark}
        onChange={() => setIsDark((prev) => !prev)}
      />

      {/* icon saat dark mode */}
      <Sun className="swap-on size-7 fill-current text-base-content" />

      {/* icon saat light mode */}
      <Moon className="swap-off size-7 fill-current text-base-content" />
    </label>
  );
};

export default ButtonTheme;
