import { View, Text, Pressable } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
// bottom-tabs ships inside expo-router rather than as its own package.
import type { BottomTabBarProps } from "expo-router/tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@/contexts/app-theme-context";
import { colors, components, elevations, fontFamily, layout, spacing } from "@/lib/tokens";
import { useDirection } from "@/lib/rtl";
import { PressableScale } from "@/components/PressableScale";

const ICONS: Record<string, { on: keyof typeof Ionicons.glyphMap; off: keyof typeof Ionicons.glyphMap }> = {
  index: { on: "today", off: "today-outline" },
  history: { on: "time", off: "time-outline" },
  alerts: { on: "notifications", off: "notifications-outline" },
  settings: { on: "settings", off: "settings-outline" },
};

/**
 * Design screen 07's tab bar: two tabs, the log FAB raised through the bar,
 * then a third tab. The FAB is not a route — it opens the quick-log sheet —
 * so it is rendered between the tab items rather than as a tab.
 */
export function TabBar({ state, navigation }: BottomTabBarProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { isDark } = useAppTheme();
  const { row } = useDirection();
  const insets = useSafeAreaInsets();
  const c = isDark ? colors.dark : colors.light;
  const tab = isDark ? components.tabBar.dark : components.tabBar.light;

  // Split the routes so the FAB can sit in the middle of the bar.
  const left = state.routes.slice(0, 2);
  const right = state.routes.slice(2);

  const renderTab = (route: (typeof state.routes)[number]) => {
    const index = state.routes.findIndex((r) => r.key === route.key);
    const focused = state.index === index;
    const icon = ICONS[route.name] ?? ICONS.index;

    const onPress = () => {
      const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
      if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
    };

    return (
      <Pressable
        key={route.key}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityState={focused ? { selected: true } : {}}
        style={{
          width: components.tabBar.itemWidth,
          alignItems: "center",
          gap: spacing[5],
          paddingVertical: spacing[4],
        }}
      >
        <Ionicons
          name={focused ? icon.on : icon.off}
          size={20}
          color={focused ? tab.activeText : tab.inactiveText}
        />
        <Text
          style={{
            fontFamily: focused ? fontFamily.manrope[700] : fontFamily.manrope[600],
            fontSize: 10,
            color: focused ? tab.activeText : tab.inactiveText,
          }}
        >
          {route.name === "settings"
            ? t("settings.title")
            : t(`drawer.${route.name === "index" ? "dashboard" : route.name}`)}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      style={{
        flexDirection: row,
        alignItems: "center",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderTopColor: tab.border,
        backgroundColor: c.bg,
        paddingTop: components.tabBar.padding.top,
        paddingHorizontal: components.tabBar.padding.horizontal,
        paddingBottom: Math.max(insets.bottom, components.tabBar.padding.bottom),
      }}
    >
      {left.map(renderTab)}

      {/* Raised log button — opens the sheet, not a tab route. */}
      <Animated.View entering={FadeIn.duration(300).delay(150)}>
        <PressableScale
          onPress={() => router.push("/quick-log")}
          accessibilityLabel={t("dashboard.fab")}
          style={{
            width: layout.fab.size,
            height: layout.fab.size,
            borderRadius: layout.fab.size / 2,
            backgroundColor: c.accent,
            alignItems: "center",
            justifyContent: "center",
            transform: [{ translateY: layout.fab.offset }],
            boxShadow: elevations[isDark ? "dark" : "light"].fab,
          }}
        >
          <Ionicons name="add" size={30} color={c.textOnAccent} />
        </PressableScale>
      </Animated.View>

      {right.map(renderTab)}
    </View>
  );
}
