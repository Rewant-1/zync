import { useTheme } from "next-themes";

export const useCurrentTheme = (): string | undefined => {
  const { theme, systemTheme } = useTheme();

  if (theme === "dark" || theme === "light") {
    return theme;
  }

  return systemTheme;
};  