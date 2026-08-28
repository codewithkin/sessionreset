import { View, Text, Pressable } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";

import { useAppTheme } from "@/contexts/app-theme-context";
import { colors, components, fontFamily, fontSizes, spacing } from "@/lib/tokens";
import { useDirection } from "@/lib/rtl";
import { Timer } from "@/lib/types";
import { useCountdown } from "@/hooks/useCountdown";

interface TimerCardProps {
  timer: Timer;
  onToggleAlert: (id: string) => void;
  onRemove: (id: string) => void;
}

/**
 * The card that hangs off a reset row on the Today timeline (design 07).
 *
 * Shows the service, whether the 15-minute alert is armed, the countdown with
 * a "left" suffix, and how much of the 5-hour window has elapsed.
 */
export function TimerCard({ timer, onToggleAlert, onRemove }: TimerCardProps) {
  const { timeString, progress, isWarning, isUrgent } = useCountdown(timer);
  const { t } = useTranslation();
  const router = useRouter();
  const { isDark } = useAppTheme();
  const { row, textAlign, writingDirection } = useDirection();
  const c = isDark ? colors.dark : colors.light;

  const progressColor = isWarning ? c.progressWarning : c.progressFill;
  const timeColor = isUrgent ? c.error : isWarning ? c.warningDark : c.textPrimary;

  // Width animates so the bar eases forward on each tick instead of stepping.
  const fillStyle = useAnimatedStyle(() => ({
    width: withTiming(`${progress}%`, { duration: 400 }),
  }));

  return (
    <Pressable
      onPress={() => router.push(`/timer/${timer.id}`)}
      onLongPress={() => onRemove(timer.id)}
      accessibilityRole="button"
      accessibilityLabel={t(`dashboard.timer.${timer.platform}`)}
      style={{
        backgroundColor: isDark ? components.timerCard.dark.bg : components.timerCard.light.bg,
        borderRadius: components.timerCard.radius,
        padding: components.timerCard.padding,
      }}
    >
      <View style={{ flexDirection: row, alignItems: "center", justifyContent: "space-between", gap: spacing[10] }}>
        <Text
          numberOfLines={1}
          style={{
            flex: 1,
            fontFamily: fontFamily.manrope[700],
            fontSize: components.timerCard.titleFont.size,
            color: c.textPrimary,
            textAlign,
            writingDirection,
          }}
        >
          {t(`dashboard.timer.${timer.platform}`)}
        </Text>

        {/* Design shows the alert state as a bare mono label, not a pill. */}
        <Pressable
          onPress={() => onToggleAlert(timer.id)}
          hitSlop={10}
          accessibilityRole="switch"
          accessibilityState={{ checked: timer.preResetAlert }}
        >
          <Text
            style={{
              fontFamily: fontFamily.mono[700],
              fontSize: components.timerCard.alertBadgeFont.size,
              color: timer.preResetAlert ? c.accent : c.textMuted,
            }}
          >
            {timer.preResetAlert ? t("dashboard.timer.alertOn") : t("dashboard.timer.alertOff")}
          </Text>
        </Pressable>
      </View>

      <View style={{ marginTop: spacing[12], flexDirection: row, alignItems: "baseline", gap: spacing[8] }}>
        <Text
          style={{
            fontFamily: fontFamily.mono[700],
            fontSize: components.timerCard.countdownFont.size,
            // Design is `28px/1`; RN reads lineHeight in px, not as a ratio.
            lineHeight: components.timerCard.countdownFont.size,
            letterSpacing: components.timerCard.countdownLetterSpacing,
            color: timeColor,
          }}
        >
          {timeString}
        </Text>
        <Text style={{ fontFamily: fontFamily.manrope[500], fontSize: fontSizes.xs, color: c.textTertiary }}>
          {t("dashboard.timer.left")}
        </Text>
      </View>

      <View
        style={{
          marginTop: spacing[14],
          height: components.progressBar.height,
          borderRadius: components.progressBar.radius,
          backgroundColor: c.progressTrack,
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={[
            { height: "100%", borderRadius: components.progressBar.radius, backgroundColor: progressColor },
            fillStyle,
          ]}
        />
      </View>
    </Pressable>
  );
}
