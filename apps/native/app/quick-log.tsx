import { useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useTimers } from "@/contexts/TimerContext";
import { Platform } from "@/lib/types";
import { showInterstitial, canShowInterstitial } from "@/lib/ads";
import { useAppTheme } from "@/contexts/app-theme-context";
import { colors, components, fontSizes, spacing, radii, shadows, layout } from "@/lib/tokens";

const SERVICES: { key: Platform; label: string; color: string }[] = [
  { key: "claude", label: "Claude", color: colors.light.claude },
  { key: "codex", label: "Codex", color: colors.light.codex },
];

const OFFSETS = [
  { label: "Just Now", minutes: 0 },
  { label: "5m ago", minutes: 5 },
  { label: "15m ago", minutes: 15 },
  { label: "30m ago", minutes: 30 },
];

export default function QuickLogScreen() {
  const router = useRouter();
  const { isDark } = useAppTheme();
  const c = isDark ? colors.dark : colors.light;
  const { addTimer, timers } = useTimers();
  const [selectedService, setSelectedService] = useState<Platform | null>(null);
  const [selectedOffset, setSelectedOffset] = useState(0);
  const [preResetAlert, setPreResetAlert] = useState(true);

  const handleStart = async () => {
    if (!selectedService) return;

    const existing = timers.find(
      (t) => t.platform === selectedService && t.active
    );

    const doStart = async () => {
      await addTimer(selectedService, preResetAlert);
      router.back();
      // Show interstitial after logging (free tier, once per session)
      if (canShowInterstitial()) {
        setTimeout(() => showInterstitial(), 500);
      }
    };

    if (existing) {
      Alert.alert(
        "Replace existing timer?",
        `Replace existing ${selectedService === "claude" ? "Claude" : "Codex"} timer? This will cancel the current countdown.`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Replace", style: "destructive", onPress: doStart },
        ]
      );
      return;
    }

    await doStart();
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: c.overlay,
        justifyContent: "flex-end",
      }}
    >
      <Pressable style={{ flex: 1 }} onPress={() => router.back()} />

      <Animated.View
        entering={SlideInDown.springify().damping(0.8)}
        style={{
          backgroundColor: c.bg,
          borderTopLeftRadius: components.bottomSheet.radius,
          borderTopRightRadius: components.bottomSheet.radius,
          paddingTop: components.bottomSheet.padding.top,
          paddingHorizontal: components.bottomSheet.padding.horizontal,
          paddingBottom: spacing[32],
        }}
      >
        {/* Handle */}
        <View style={{ alignItems: "center", marginBottom: spacing[18] }}>
          <View
            style={{
              width: components.bottomSheet.handleWidth,
              height: components.bottomSheet.handleHeight,
              borderRadius: components.bottomSheet.handleRadius,
              backgroundColor: isDark ? components.bottomSheet.dark.handle : components.bottomSheet.light.handle,
            }}
          />
        </View>

        <Text
          style={{
            fontFamily: "Manrope",
            fontSize: fontSizes.h5,
            fontWeight: "800",
            letterSpacing: -0.3,
            color: c.textPrimary,
            marginBottom: spacing[20],
          }}
        >
          Log Limit Hit
        </Text>

        {/* Service selector */}
        <Text
          style={{
            fontFamily: "Manrope",
            fontSize: fontSizes.micro,
            fontWeight: "700",
            color: c.textTertiary,
            marginBottom: spacing[10],
          }}
        >
          Which service?
        </Text>
        <View style={{ flexDirection: "row", gap: spacing[10], marginBottom: spacing[22] }}>
          {SERVICES.map((s) => {
            const active = selectedService === s.key;
            return (
              <Pressable
                key={s.key}
                onPress={() => setSelectedService(s.key)}
                style={{
                  flex: 1,
                  borderWidth: 2,
                  borderColor: active ? s.color : c.border,
                  backgroundColor: active ? s.color : "transparent",
                  borderRadius: components.primaryButton.radius,
                  padding: spacing[16],
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing[12],
                  opacity: selectedService && !active ? 0.5 : 1,
                }}
              >
                <View
                  style={{
                    width: layout.serviceDot.size,
                    height: layout.serviceDot.size,
                    borderRadius: 50,
                    backgroundColor: active ? c.textOnAccent : s.color,
                  }}
                />
                <Text
                  style={{
                    fontFamily: "Manrope",
                    fontSize: fontSizes.body,
                    fontWeight: "700",
                    color: active ? c.textOnAccent : c.textPrimary,
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
            fontSize: fontSizes.micro,
            fontWeight: "700",
            color: c.textTertiary,
            marginBottom: spacing[10],
          }}
        >
          When did you hit the limit?
        </Text>
        <View style={{ flexDirection: "row", gap: spacing[8], marginBottom: spacing[22] }}>
          {OFFSETS.map((o) => {
            const active = selectedOffset === o.minutes;
            return (
              <Pressable
                key={o.minutes}
                onPress={() => setSelectedOffset(o.minutes)}
                style={{
                  flex: 1,
                  borderWidth: 1.5,
                  borderColor: active ? (isDark ? components.offsetPill.dark.activeBg : components.offsetPill.light.activeBg) : (isDark ? components.offsetPill.dark.inactiveBorder : components.offsetPill.light.inactiveBorder),
                  backgroundColor: active ? (isDark ? components.offsetPill.dark.activeBg : components.offsetPill.light.activeBg) : "transparent",
                  borderRadius: radii.full,
                  paddingVertical: active ? spacing[12] : spacing[10],
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "JetBrains Mono",
                    fontSize: fontSizes.micro,
                    fontWeight: "700",
                    color: active ? (isDark ? components.offsetPill.dark.activeText : components.offsetPill.light.activeText) : c.textSecondary,
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
            backgroundColor: c.surface,
            borderRadius: components.primaryButton.radius,
            padding: spacing[16],
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: spacing[22],
          }}
        >
          <Text
            style={{
              fontFamily: "Manrope",
              fontSize: fontSizes.caption,
              fontWeight: "600",
              color: c.textPrimary,
            }}
          >
            Remind me 15 minutes before reset
          </Text>
          <View
            style={{
              width: components.toggle.width,
              height: components.toggle.height,
              borderRadius: components.toggle.radius,
              backgroundColor: preResetAlert ? (isDark ? components.toggle.dark.on : components.toggle.light.on) : c.border,
              padding: components.toggle.padding,
              justifyContent: "center",
              alignItems: preResetAlert ? "flex-end" : "flex-start",
            }}
          >
            <View
              style={{
                width: components.toggle.knobSize,
                height: components.toggle.knobSize,
                borderRadius: 50,
                backgroundColor: preResetAlert ? (isDark ? components.toggle.dark.knob : components.toggle.light.knob) : c.textOnAccent,
              }}
            />
          </View>
        </Pressable>

        {/* CTA */}
        <Pressable
          onPress={handleStart}
          disabled={!selectedService}
          style={{
            height: components.primaryButton.height,
            borderRadius: components.primaryButton.radius,
            backgroundColor: selectedService
              ? (isDark ? components.primaryButton.dark.bg : components.primaryButton.light.bg)
              : c.border,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: selectedService ? c.accent : "transparent",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: selectedService ? 0.32 : 0,
            shadowRadius: 18,
            elevation: selectedService ? 8 : 0,
            opacity: selectedService ? 1 : 0.5,
          }}
        >
          <Text
            style={{
              fontFamily: "Manrope",
              fontSize: fontSizes.body,
              fontWeight: "700",
              color: selectedService
                ? (isDark ? components.primaryButton.dark.text : components.primaryButton.light.text)
                : c.textDisabled,
            }}
          >
            Start 5-Hour Timer
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
