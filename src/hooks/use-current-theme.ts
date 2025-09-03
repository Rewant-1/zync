// Hook to get the current theme, handling system theme
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const useCurrentTheme = (): string | undefined => {
  // Returns the resolved theme after mounting
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return undefined;
  }

  if (theme === "dark" || theme === "light") {
    return theme;
  }

  return systemTheme;
};
