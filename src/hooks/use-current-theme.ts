import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const useCurrentTheme = (): string | undefined => {
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