import { useMemo } from "react";
import { View, Text, Alert } from "react-native";
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTimers } from "@/contexts/TimerContext";
import { useCountdown } from "@/hooks/useCountdown";
import { useAppTheme } from "@/contexts/app-theme-context";
import {
  colors,
  components,
  elevations,
  fontFamily,
  fontSizes,
  layout,
  letterSpacing,
  spacing,
} from "@/lib/tokens";
import { useDirection } from "@/lib/rtl";
import { getAppLanguage } from "@/lib/i18n";
import { formatClockTime } from "@/lib/timeline";
import { FIFTEEN_MINUTES_MS } from "@/lib/timer-engine";
import { Timer } from "@/lib/types";
import { PressableScale } from "@/components/PressableScale";

/**
 * Full-screen view of a single window. Pushed on the root stack rather than
 * inside the tabs, so it covers the tab bar too and the countdown is the only
 * thing on screen.
 */
export default function TimerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { timers } = useTimers();

  const timer = useMemo(() => timers.find((x) => x.id === id), [timers, id]);

  // The timer can disappear underneath this screen — it expires on a tick, or
  // is stopped elsewhere. Swap to a closing state rather than render a
  // half-empty screen. Split into two components so the countdown's hooks
  // never sit behind a conditional return.
  return timer ? <TimerDetail key={timer.id} timer={timer} /> : <ReopenedState />;
}

function useChrome() {
  const { isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  return { isDark, insets, c: isDark ? colors.dark : colors.light };
}

function ReopenedState() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isDark, insets, c } = useChrome();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: c.bg,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: spacing[28],
        paddingBottom: insets.bottom,
        gap: spacing[12],
      }}
    >
      <Ionicons name="checkmark-circle-outline" size={48} color={c.success} />
      <Text
        style={{
          fontFamily: fontFamily.manrope[800],
          fontSize: fontSizes.h3,
          letterSpacing: -0.5,
          color: c.textPrimary,
          textAlign: "center",
        }}
      >
        {t("timerDetail.done")}
      </Text>
      <Text
        style={{
          fontFamily: fontFamily.manrope[500],
          fontSize: fontSizes.body,
          color: c.textTertiary,
          textAlign: "center",
        }}
      >
        {t("timerDetail.doneSub")}
      </Text>
      <PressableScale
        onPress={() => router.back()}
        style={{
          marginTop: spacing[20],
          height: components.primaryButton.height,
          paddingHorizontal: spacing[32],
          borderRadius: components.primaryButton.radius,
          backgroundColor: c.accent,
          alignItems: "center",
          justifyContent: "center",
          boxShadow: elevations[isDark ? "dark" : "light"].accentButton,
        }}
      >
        <Text style={{ fontFamily: fontFamily.manrope[700], fontSize: fontSizes.body, color: c.textOnAccent }}>
          {t("common.back")}
        </Text>
      </PressableScale>
    </View>
  );
}

function TimerDetail({ timer }: { timer: Timer }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { removeTimer } = useTimers();
  const { isDark, insets, c } = useChrome();
  const { row, textAlign, writingDirection } = useDirection();
  const { timeString, progress, isWarning, isUrgent } = useCountdown(timer);
  const locale = getAppLanguage();

  const brand = timer.platform === "claude" ? c.claude : c.codex;
  const countdownColor = isUrgent ? c.error : isWarning ? c.warningDark : c.textPrimary;
  const divider = isDark ? components.settingsRow.dark.divider : components.settingsRow.light.divider;

  const fillStyle = useAnimatedStyle(() => ({
    width: withTiming(`${progress}%`, { duration: 400 }),
  }));

  const handleStop = () => {
    Alert.alert(t("timerDetail.stopTitle"), t("timerDetail.stopBody"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("timerDetail.stopConfirm"),
        style: "destructive",
        onPress: async () => {
          await removeTimer(timer.id);
          router.back();
        },
      },
    ]);
  };

  const rows = [
    { label: t("timerDetail.logged"), value: formatClockTime(timer.startTime, locale) },
    { label: t("timerDetail.resets"), value: formatClockTime(timer.resetTime, locale) },
    {
      label: t("timerDetail.alert"),
      value: timer.preResetAlert
        ? formatClockTime(timer.resetTime - FIFTEEN_MINUTES_MS, locale)
        : t("timerDetail.noAlert"),
    },
    { label: t("timerDetail.elapsed"), value: `${Math.round(progress)}%` },
  ];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: c.bg,
        paddingTop: insets.top,
        paddingBottom: Math.max(insets.bottom, spacing[16]),
      }}
    >
      {/* Which service, and the way out */}
      <Animated.View
        entering={FadeIn.duration(300)}
        style={{
          flexDirection: row,
          alignItems: "center",
          justifyContent: "space-between",
          gap: spacing[12],
          height: 52,
          paddingHorizontal: layout.dashboard.hPadding,
        }}
      >
        <View style={{ flexDirection: row, alignItems: "center", gap: spacing[10], flex: 1 }}>
          <View
            style={{
              width: layout.serviceDot.size,
              height: layout.serviceDot.size,
              borderRadius: layout.serviceDot.size / 2,
              backgroundColor: brand,
            }}
          />
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              fontFamily: fontFamily.manrope[700],
              fontSize: fontSizes.h5,
              letterSpacing: -0.3,
              color: c.textPrimary,
              textAlign,
              writingDirection,
            }}
          >
            {t(`dashboard.timer.${timer.platform}`)}
          </Text>
        </View>

        <PressableScale
          onPress={() => router.back()}
          accessibilityLabel={t("common.back")}
          style={{
            width: layout.hamburger.size,
            height: layout.hamburger.size,
            borderRadius: layout.hamburger.radius,
            backgroundColor: c.surface,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="close" size={18} color={c.textPrimary} />
        </PressableScale>
      </Animated.View>

      {/* The countdown gets the whole middle of the screen */}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing[24] }}>
        {/* Soft brand-tinted bloom behind the numerals. */}
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            width: 220,
            height: 220,
            borderRadius: 110,
            backgroundColor: brand,
            opacity: isDark ? 0.14 : 0.09,
            boxShadow: `0px 0px 110px 55px ${brand}`,
          }}
        />

        <Animated.Text
          entering={FadeIn.duration(400).delay(80)}
          style={{
            fontFamily: fontFamily.mono[700],
            fontSize: 64,
            lineHeight: 68,
            letterSpacing: -3,
            color: countdownColor,
          }}
        >
          {timeString}
        </Animated.Text>

        <Animated.Text
          entering={FadeIn.duration(400).delay(160)}
          style={{
            marginTop: spacing[6],
            fontFamily: fontFamily.manrope[500],
            fontSize: fontSizes.body,
            color: c.textTertiary,
          }}
        >
          {t("dashboard.timer.left")}
        </Animated.Text>

        <Animated.View
          entering={FadeInDown.duration(400).delay(220)}
          style={{
            marginTop: spacing[32],
            width: "100%",
            height: components.progressBar.height,
            borderRadius: components.progressBar.radius,
            backgroundColor: c.progressTrack,
            overflow: "hidden",
          }}
        >
          <Animated.View
            style={[
              {
                height: "100%",
                borderRadius: components.progressBar.radius,
                backgroundColor: isWarning ? c.progressWarning : brand,
              },
              fillStyle,
            ]}
          />
        </Animated.View>
      </View>

      {/* Details, in the hairline language Settings and History already use */}
      <Animated.View
        entering={FadeInDown.duration(400).delay(280)}
        style={{ paddingHorizontal: layout.dashboard.hPadding }}
      >
        <View style={{ borderTopWidth: 1, borderTopColor: divider }}>
          {rows.map((r, i) => (
            <View
              key={r.label}
              style={{
                flexDirection: row,
                alignItems: "center",
                justifyContent: "space-between",
                gap: spacing[12],
                paddingVertical: spacing[14],
                borderBottomWidth: i === rows.length - 1 ? 0 : 1,
                borderBottomColor: divider,
              }}
            >
              <Text
                style={{
                  fontFamily: fontFamily.mono[700],
                  fontSize: fontSizes.tiny,
                  letterSpacing: letterSpacing.wideMd,
                  color: c.textMuted,
                }}
              >
                {r.label}
              </Text>
              <Text style={{ fontFamily: fontFamily.mono[700], fontSize: fontSizes.bodySm, color: c.textPrimary }}>
                {r.value}
              </Text>
            </View>
          ))}
        </View>

        <PressableScale
          onPress={handleStop}
          accessibilityRole="button"
          style={{
            marginTop: spacing[24],
            height: components.secondaryButton.height,
            borderRadius: components.secondaryButton.radius,
            borderWidth: components.secondaryButton.borderWidth,
            borderColor: isDark ? components.secondaryButton.dark.border : components.secondaryButton.light.border,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontFamily: fontFamily.manrope[700], fontSize: fontSizes.body, color: c.error }}>
            {t("timerDetail.stop")}
          </Text>
        </PressableScale>

        {/* Wordmark, quiet — the same one that appears in the shade */}
        <Text
          style={{
            marginTop: spacing[20],
            textAlign: "center",
            fontFamily: fontFamily.mono[700],
            fontSize: 10,
            letterSpacing: 2,
            color: isDark ? components.settingsRow.dark.chevron : components.settingsRow.light.chevron,
          }}
        >
          {t("onboarding.notifications.previewApp")}
        </Text>
      </Animated.View>
    </View>
  );
}
