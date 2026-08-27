import { useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useTimers } from "@/contexts/TimerContext";
import { TimerCard } from "@/components/TimerCard";
import { BannerAd } from "@/components/BannerAd";
import { storage } from "@/lib/storage";

export default function DashboardScreen() {
  const { timers, toggleAlert, removeTimer } = useTimers();
  const router = useRouter();

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
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 56,
          paddingBottom: 4,
        }}
      >
        <Text
          style={{
            fontFamily: "Manrope",
            fontSize: 22,
            fontWeight: "800",
            letterSpacing: -0.5,
            color: "#17181A",
          }}
        >
          Today
        </Text>
        <Text
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: 12,
            fontWeight: "500",
            color: "#9DA1A7",
            marginTop: 2,
          }}
        >
          {dateStr}
        </Text>
      </View>

      {/* Timer list */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 18,
          paddingBottom: 120,
          gap: 14,
        }}
        showsVerticalScrollIndicator={false}
      >
        {timers.length === 0 ? (
          <View
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
                color: "#17181A",
              }}
            >
              No active limits.
            </Text>
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: 16,
                fontWeight: "500",
                color: "#9DA1A7",
              }}
            >
              Tap below when you hit a wall.
            </Text>
          </View>
        ) : (
          timers.map((timer) => (
            <TimerCard
              key={timer.id}
              timer={timer}
              onToggleAlert={toggleAlert}
              onRemove={handleRemove}
            />
          ))
        )}

        {/* Banner ad placeholder (for non-Pro) */}
        {storage.settings.get().isPro === false && timers.length > 0 && (
          <BannerAd />
        )}
      </ScrollView>

      {/* FAB */}
      <View
        style={{
          position: "absolute",
          bottom: 32,
          alignSelf: "center",
        }}
      >
        <Pressable
          onPress={() => router.push("/quick-log")}
          style={{
            backgroundColor: "#3B82F6",
            borderRadius: 50,
            width: 60,
            height: 60,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#3B82F6",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.36,
            shadowRadius: 20,
            elevation: 8,
          }}
        >
          <Text
            style={{
              fontFamily: "Manrope",
              fontSize: 30,
              fontWeight: "400",
              color: "#FFFFFF",
              lineHeight: 1,
            }}
          >
            +
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
