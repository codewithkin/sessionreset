import { useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useTimers } from "@/contexts/TimerContext";
import { storage } from "@/lib/storage";
import { Platform } from "@/lib/types";

const SERVICES: { key: Platform; label: string; color: string }[] = [
  { key: "claude", label: "Claude", color: "#CC785C" },
  { key: "codex", label: "Codex", color: "#10A37F" },
];

const OFFSETS = [
  { label: "Just Now", minutes: 0 },
  { label: "5m ago", minutes: 5 },
  { label: "15m ago", minutes: 15 },
  { label: "30m ago", minutes: 30 },
];

export default function QuickLogScreen() {
  const router = useRouter();
  const { addTimer, timers } = useTimers();
  const [selectedService, setSelectedService] = useState<Platform>("claude");
  const [selectedOffset, setSelectedOffset] = useState(0);
  const [preResetAlert, setPreResetAlert] = useState(true);

  const handleStart = async () => {
    // Check for existing active timer for this platform
    const existing = timers.find(
      (t) => t.platform === selectedService && t.active
    );
    if (existing) {
      Alert.alert(
        "Replace existing timer?",
        `Replace existing ${selectedService === "claude" ? "Claude" : "Codex"} timer? This will cancel the current countdown.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Replace",
            style: "destructive",
            onPress: async () => {
              await addTimer(selectedService, preResetAlert);
              router.back();
            },
          },
        ]
      );
      return;
    }

    await addTimer(selectedService, preResetAlert);
    router.back();
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(23,24,26,0.5)",
        justifyContent: "flex-end",
      }}
    >
      <Pressable style={{ flex: 1 }} onPress={() => router.back()} />

      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingTop: 12,
          paddingHorizontal: 24,
          paddingBottom: 32,
        }}
      >
        {/* Handle */}
        <View style={{ alignItems: "center", marginBottom: 18 }}>
          <View
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: "#DDE0E4",
            }}
          />
        </View>

        <Text
          style={{
            fontFamily: "Manrope",
            fontSize: 19,
            fontWeight: "800",
            letterSpacing: -0.3,
            color: "#17181A",
            marginBottom: 20,
          }}
        >
          Log Limit Hit
        </Text>

        {/* Service selector */}
        <Text
          style={{
            fontFamily: "Manrope",
            fontSize: 13,
            fontWeight: "700",
            color: "#6C7076",
            marginBottom: 10,
          }}
        >
          Which service?
        </Text>
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 22 }}>
          {SERVICES.map((s) => {
            const active = selectedService === s.key;
            return (
              <Pressable
                key={s.key}
                onPress={() => setSelectedService(s.key)}
                style={{
                  flex: 1,
                  borderWidth: 2,
                  borderColor: active ? s.color : "#E6E7EA",
                  backgroundColor: active ? s.color : "transparent",
                  borderRadius: 16,
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 50,
                    backgroundColor: active ? "#FFFFFF" : s.color,
                  }}
                />
                <Text
                  style={{
                    fontFamily: "Manrope",
                    fontSize: 15,
                    fontWeight: "700",
                    color: active ? "#FFFFFF" : "#17181A",
                  }}
                >
                  {s.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Time offset */}
        <Text
          style={{
            fontFamily: "Manrope",
            fontSize: 13,
            fontWeight: "700",
            color: "#6C7076",
            marginBottom: 10,
          }}
        >
          When did you hit the limit?
        </Text>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 22 }}>
          {OFFSETS.map((o) => {
            const active = selectedOffset === o.minutes;
            return (
              <Pressable
                key={o.minutes}
                onPress={() => setSelectedOffset(o.minutes)}
                style={{
                  flex: 1,
                  borderWidth: 1.5,
                  borderColor: active ? "#3B82F6" : "#E6E7EA",
                  backgroundColor: active ? "#3B82F6" : "transparent",
                  borderRadius: 999,
                  paddingVertical: active ? 11 : 10,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "JetBrains Mono",
                    fontSize: 13,
                    fontWeight: "700",
                    color: active ? "#FFFFFF" : "#4A4E54",
                  }}
                >
                  {o.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Alert toggle */}
        <Pressable
          onPress={() => setPreResetAlert(!preResetAlert)}
          style={{
            backgroundColor: "#F5F6F7",
            borderRadius: 16,
            padding: 16,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 22,
          }}
        >
          <Text
            style={{
              fontFamily: "Manrope",
              fontSize: 14,
              fontWeight: "600",
              color: "#17181A",
            }}
          >
            Remind me 15 minutes before reset
          </Text>
          <View
            style={{
              width: 46,
              height: 28,
              borderRadius: 14,
              backgroundColor: preResetAlert ? "#3B82F6" : "#E6E7EA",
              padding: 3,
              justifyContent: "center",
              alignItems: preResetAlert ? "flex-end" : "flex-start",
            }}
          >
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 50,
                backgroundColor: "#FFFFFF",
              }}
            />
          </View>
        </Pressable>

        {/* CTA */}
        <Pressable
          onPress={handleStart}
          style={{
            height: 56,
            borderRadius: 16,
            backgroundColor: "#3B82F6",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#3B82F6",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.32,
            shadowRadius: 18,
            elevation: 8,
          }}
        >
          <Text
            style={{
              fontFamily: "Manrope",
              fontSize: 16,
              fontWeight: "700",
              color: "#FFFFFF",
            }}
          >
            Start 5-Hour Timer
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
