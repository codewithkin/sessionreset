import { View, Text, ScrollView, Pressable, Alert, RefreshControl } from "react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/contexts/app-theme-context";
import { colors, radii } from "@/lib/tokens";
import { useTimers } from "@/contexts/TimerContext";
import { TimerCard } from "@/components/TimerCard";
import { PressableScale } from "@/components/PressableScale";
import { useState, useCallback } from "react";

export default function DashboardScreen() {
  const { timers, toggleAlert, removeTimer, refreshTimers } = useTimers();
  const router = useRouter();
  const { isDark } = useAppTheme();
  const c = isDark ? colors.dark : colors.light;
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    refreshTimers();
    setTimeout(() => setRefreshing(false), 500);
  }, [refreshTimers]);

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const handleRemove = (id: string) => {
    Alert.alert("Remove Timer", "Remove this timer from your dashboard?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removeTimer(id),
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      {/* Header */}
      <Animated.View
        entering={FadeIn.duration(400)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingTop: 56,
          paddingBottom: 4,
        }}
      >
        <View>
          <Text
            style={{
              fontFamily: "Manrope",
              fontSize: 22,
              fontWeight: "800",
              letterSpacing: -0.5,
              color: c.textPrimary,
            }}
          >
            Today
          </Text>
          <Text
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 12,
              fontWeight: "500",
              color: c.textMuted,
              marginTop: 2,
            }}
          >
            {dateStr}
          </Text>
        </View>
        <Pressable onPress={() => router.push("/settings")}>
          <Ionicons name="settings-outline" size={24} color={c.textPrimary} />
        </Pressable>
      </Animated.View>

      {/* Timer list */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 18,
          paddingBottom: timers.length > 0 ? 120 : 40,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={c.textMuted}
            colors={[c.accent]}
          />
        }
      >
        {timers.length === 0 ? (
          <Animated.View
            entering={FadeInDown.duration(500).delay(200)}
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 120,
              gap: 8,
            }}
          >
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: 22,
                fontWeight: "800",
                letterSpacing: -0.5,
                color: c.textPrimary,
              }}
            >
              No active limits.
            </Text>
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: 16,
                fontWeight: "500",
                color: c.textMuted,
              }}
            >
              Tap below when you hit a wall.
            </Text>
          </Animated.View>
        ) : (
          timers.map((timer, index) => (
            <Animated.View
              key={timer.id}
              entering={FadeInDown.duration(400).delay(index * 80)}
            >
              <TimerCard
                timer={timer}
                onToggleAlert={toggleAlert}
                onRemove={handleRemove}
              />
            </Animated.View>
          ))
        )}
      </ScrollView>

      {/* FAB */}
      <Animated.View
        entering={FadeIn.duration(400).delay(300)}
        style={{
          position: "absolute",
          bottom: timers.length > 0 ? 80 : 32,
          left: 0,
          right: 0,
        }}
      >
        <PressableScale
          onPress={() => router.push("/quick-log")}
          style={{
            marginHorizontal: 16,
            height: 56,
            borderRadius: radii.button,
            backgroundColor: c.accent,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            shadowColor: c.accent,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text
            style={{
              fontFamily: "Manrope",
              fontWeight: "700",
              fontSize: 16,
              color: "#FFFFFF",
            }}
          >
            Log Limit Hit
          </Text>
        </PressableScale>
      </Animated.View>
    </View>
  );
}
