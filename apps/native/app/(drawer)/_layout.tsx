import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React, { useCallback } from "react";
import { Pressable, Text, View } from "react-native";

import { ThemeToggle } from "@/components/theme-toggle";

function DrawerLayout() {
  const renderHeaderRight = useCallback(
    () => (
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginRight: 16 }}>
        <ThemeToggle />
        <Link href="/settings" asChild>
          <Pressable>
            <Ionicons name="settings-outline" size={22} color="#6C7076" />
          </Pressable>
        </Link>
      </View>
    ),
    []
  );

  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: "#FFFFFF", elevation: 0, shadowOpacity: 0 },
        headerTitleStyle: { display: "none" },
        headerRight: renderHeaderRight,
        drawerStyle: { backgroundColor: "#FFFFFF", width: 280 },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          headerTitle: "",
          drawerLabel: ({ color, focused }) => (
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: 15,
                fontWeight: focused ? "700" : "500",
                color: focused ? "#17181A" : "#6C7076",
              }}
            >
              Dashboard
            </Text>
          ),
          drawerIcon: ({ size, focused }) => (
            <Ionicons
              name="grid-outline"
              size={20}
              color={focused ? "#17181A" : "#6C7076"}
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
                fontFamily: "Manrope",
                fontSize: 15,
                fontWeight: focused ? "700" : "500",
                color: focused ? "#17181A" : "#6C7076",
              }}
            >
              History
            </Text>
          ),
          drawerIcon: ({ size, focused }) => (
            <Ionicons
              name="time-outline"
              size={20}
              color={focused ? "#17181A" : "#6C7076"}
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
                fontFamily: "Manrope",
                fontSize: 15,
                fontWeight: focused ? "700" : "500",
                color: focused ? "#17181A" : "#6C7076",
              }}
            >
              Alerts
            </Text>
          ),
          drawerIcon: ({ size, focused }) => (
            <Ionicons
              name="notifications-outline"
              size={20}
              color={focused ? "#17181A" : "#6C7076"}
            />
          ),
        }}
      />
    </Drawer>
  );
}

export default DrawerLayout;
