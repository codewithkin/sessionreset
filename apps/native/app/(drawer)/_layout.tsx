import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useTranslation } from "react-i18next";
import React, { useCallback } from "react";
import { Pressable, Text, View } from "react-native";

import { ThemeToggle } from "@/components/theme-toggle";
import { useAppTheme } from "@/contexts/app-theme-context";
import { colors, fontFamily } from "@/lib/tokens";

function DrawerLayout() {
  const { t } = useTranslation();
  const { isDark } = useAppTheme();
  const c = isDark ? colors.dark : colors.light;

  const renderHeaderRight = useCallback(
    () => (
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginRight: 16 }}>
        <ThemeToggle />
        <Link href="/settings" asChild>
          <Pressable>
            <Ionicons name="settings-outline" size={22} color={c.textTertiary} />
          </Pressable>
        </Link>
      </View>
    ),
    [c]
  );

  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: c.bg, elevation: 0, shadowOpacity: 0 },
        headerTitleStyle: { display: "none" },
        headerRight: renderHeaderRight,
        drawerStyle: { backgroundColor: c.bg, width: 280 },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          headerTitle: "",
          drawerLabel: ({ color, focused }) => (
            <Text
              style={{
                fontFamily: focused ? fontFamily.manrope[700] : fontFamily.manrope[500],
                fontSize: 15,
                color: focused ? c.textPrimary : c.textTertiary,
              }}
            >
              {t("drawer.dashboard")}
            </Text>
          ),
          drawerIcon: ({ size, focused }) => (
            <Ionicons
              name="grid-outline"
              size={20}
              color={focused ? c.textPrimary : c.textTertiary}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="history"
        options={{
          headerTitle: "",
          drawerLabel: ({ color, focused }) => (
            <Text
              style={{
                fontFamily: focused ? fontFamily.manrope[700] : fontFamily.manrope[500],
                fontSize: 15,
                color: focused ? c.textPrimary : c.textTertiary,
              }}
            >
              {t("drawer.history")}
            </Text>
          ),
          drawerIcon: ({ size, focused }) => (
            <Ionicons
              name="time-outline"
              size={20}
              color={focused ? c.textPrimary : c.textTertiary}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="alerts"
        options={{
          headerTitle: "",
          drawerLabel: ({ color, focused }) => (
            <Text
              style={{
                fontFamily: focused ? fontFamily.manrope[700] : fontFamily.manrope[500],
                fontSize: 15,
                color: focused ? c.textPrimary : c.textTertiary,
              }}
            >
              {t("drawer.alerts")}
            </Text>
          ),
          drawerIcon: ({ size, focused }) => (
            <Ionicons
              name="notifications-outline"
              size={20}
              color={focused ? c.textPrimary : c.textTertiary}
            />
          ),
        }}
      />
    </Drawer>
  );
}

export default DrawerLayout;
