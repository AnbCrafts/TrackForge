import React, { useContext } from "react";
import { Sun, Moon, Palette } from "lucide-react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useContext(TrackForgeContextAPI);

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-secondary border border-default shadow-md backdrop-blur-xl z-50">
      <button
        onClick={() => toggleTheme("light")}
        className={`p-2 rounded-xl transition-all duration-300 ${
          theme === "light"
            ? "bg-purple-600 text-white shadow-lg scale-105"
            : "text-secondary hover:text-primary hover:bg-hover"
        }`}
        title="Light Theme"
      >
        <Sun size={18} />
      </button>

      <button
        onClick={() => toggleTheme("neon-dark")}
        className={`p-2 rounded-xl transition-all duration-300 ${
          theme === "neon-dark"
            ? "bg-purple-600 text-white shadow-lg scale-105"
            : "text-secondary hover:text-primary hover:bg-hover"
        }`}
        title="Neon Dark Theme"
      >
        <Moon size={18} />
      </button>

      <button
        onClick={() => toggleTheme("purple-dark")}
        className={`p-2 rounded-xl transition-all duration-300 ${
          theme === "purple-dark"
            ? "bg-purple-600 text-white shadow-lg scale-105"
            : "text-secondary hover:text-primary hover:bg-hover"
        }`}
        title="Purple Dark Theme"
      >
        <Palette size={18} />
      </button>
    </div>
  );
}
