"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "حالت روشن" : "حالت تیره"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-muted hover:bg-surface-background hover:text-accent-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
