import { useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTimers } from "@/contexts/TimerContext";
import { Platform } from "@/lib/types";
import { showInterstitial, canShowInterstitial } from "@/lib/ads";
import { useAppTheme } from "@/contexts/app-theme-context";
import { colors, components, fontSizes, spacing, radii, shadows, layout, springs, fontFamily } from "@/lib/tokens";
import { PressableScale } from "@/components/PressableScale";

const SERVICES: { key: Platform; color: string }[] = [
  { key: "claude", color: colors.light.claude },
  { key: "codex", color: colors.light.codex },
];

const OFFSET_MINUTES = [0, 5, 15, 30] as const;

export default function QuickLogScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isDark } = useAppTheme();
  const c = isDark ? colors.dark : colors.light;
  const { addTimer, timers } = useTimers();
  const [selectedService, setSelectedService] = useState<Platform | null>(null);
  const [selectedOffset, setSelectedOffset] = useState(0);
  const [preResetAlert, setPreResetAlert] = useState(true);

  const handleStart = async () => {
    if (!selectedService) return;

    // Named `timer`, not `t` — `t` is the translation function in this scope.
    const existing = timers.find(
      (timer) => timer.platform === selectedService && timer.active
    );

    const doStart = async () => {
      // The window opened when they hit the limit, not when they logged it.
      const startTime = Date.now() - selectedOffset * 60_000;
      await addTimer(selectedService, preResetAlert, startTime);
      router.back();
      // Show interstitial after logging (free tier, once per session)
      if (canShowInterstitial()) {
        setTimeout(() => showInterstitial(), 500);
      }
    };

    if (existing) {
      Alert.alert(
        t("quickLog.title"),
        t("quickLog.replaceWarning", { platform: t(`quickLog.${selectedService}`) }),
        [
          { text: t("quickLog.cancel"), style: "cancel" },
          { text: t("quickLog.confirm"), style: "destructive", onPress: doStart },
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
        entering={SlideInDown.springify()
          .damping(springs.sheet.damping)
          .stiffness(springs.sheet.stiffness)
          .mass(springs.sheet.mass)}
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
            fontFamily: fontFamily.manrope[800],
            fontSize: fontSizes.h5,
            letterSpacing: -0.3,
            color: c.textPrimary,
            marginBottom: spacing[20],
          }}
        >
          {t("quickLog.title")}
        </Text>

        {/* Service selector */}
        <Text
          style={{
            fontFamily: fontFamily.manrope[700],
            fontSize: fontSizes.micro,
            color: c.textTertiary,
            marginBottom: spacing[10],
          }}
        >
          {t("quickLog.serviceLabel")}
        </Text>
        <View style={{ flexDirection: "row", gap: spacing[10], marginBottom: spacing[22] }}>
          {SERVICES.map((s) => {
            const active = selectedService === s.key;
            return (
              <PressableScale
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
                    fontFamily: fontFamily.manrope[700],
                    fontSize: fontSizes.body,
                    color: active ? c.textOnAccent : c.textPrimary,
                  }}
                >
                  {t(`quickLog.${s.key}`)}
                </Text>
              </PressableScale>
            );
          })}
        </View>

        {/* Time offset */}
        <Text
          style={{
            fontFamily: fontFamily.manrope[700],
            fontSize: fontSizes.micro,
            color: c.textTertiary,
            marginBottom: spacing[10],
          }}
        >
          {t("quickLog.timeLabel")}
        </Text>
        <View style={{ flexDirection: "row", gap: spacing[8], marginBottom: spacing[22] }}>
          {OFFSET_MINUTES.map((minutes) => {
            const active = selectedOffset === minutes;
            return (
              <PressableScale
                key={minutes}
                onPress={() => setSelectedOffset(minutes)}
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
                    fontFamily: fontFamily.mono[700],
                    fontSize: fontSizes.micro,
                    color: active ? (isDark ? components.offsetPill.dark.activeText : components.offsetPill.light.activeText) : c.textSecondary,
                  }}
                >
                  {minutes === 0 ? t("quickLog.justNow") : t("quickLog.minutesAgo", { minutes })}
                </Text>
              </PressableScale>
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
              fontFamily: fontFamily.manrope[600],
              fontSize: fontSizes.caption,
              color: c.textPrimary,
            }}
          >
            {t("quickLog.alertLabel")}
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
        <PressableScale
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
              fontFamily: fontFamily.manrope[700],
              fontSize: fontSizes.body,
              color: selectedService
                ? (isDark ? components.primaryButton.dark.text : components.primaryButton.light.text)
                : c.textDisabled,
            }}
          >
            {t("quickLog.cta")}
          </Text>
        </PressableScale>
      </Animated.View>
    </View>
  );
}
