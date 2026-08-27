import { useAppTheme } from "@/contexts/app-theme-context";
import { colors } from "@/lib/tokens";

type ColorSet = typeof colors.light;

/**
 * Returns the current theme's color set from design tokens.
 * Usage: const c = useThemeColor(); then c.bg, c.textPrimary, etc.
 */
export function useThemeColor(): ColorSet {
  const { isDark } = useAppTheme();
  return (isDark ? colors.dark : colors.light) as ColorSet;
}
