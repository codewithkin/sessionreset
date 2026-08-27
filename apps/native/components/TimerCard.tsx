import { View, Text, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "@/contexts/app-theme-context";
import { colors, radii, components, fontFamily } from "@/lib/tokens";
import { Timer } from "@/lib/types";
import { useCountdown } from "@/hooks/useCountdown";
import { getResetTimeString } from "@/lib/timer-engine";

interface TimerCardProps {
  timer: Timer;
  onToggleAlert: (id: string) => void;
  onRemove: (id: string) => void;
}

export function TimerCard({ timer, onToggleAlert, onRemove }: TimerCardProps) {
  const { timeString, progress, isWarning, isUrgent } = useCountdown(timer);
  const { t } = useTranslation();
  const { isDark } = useAppTheme();
  const c = isDark ? colors.dark : colors.light;

  const brandName = t(`dashboard.timer.${timer.platform}`);

  const progressColor = isWarning ? c.progressWarning : c.progressFill;
  const timeColor = isUrgent
    ? c.error
    : isWarning
      ? c.warningDark
      : c.textPrimary;

  const cardBg = isDark ? components.timerCard.dark.bg : components.timerCard.light.bg;

  return (
    <Pressable
      onLongPress={() => onRemove(timer.id)}
      style={{
        backgroundColor: cardBg,
        borderRadius: radii.timer,
        padding: components.timerCard.padding,
        shadowColor: c.textPrimary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0 : 0.06,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Title row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <Text
          style={{
            fontFamily: fontFamily.manrope[700],
            fontSize: components.timerCard.titleFont.size,
            color: c.textPrimary,
          }}
        >
          {brandName}
        </Text>
        <Pressable onPress={() => onToggleAlert(timer.id)}>
          <View
            style={{
              backgroundColor: timer.preResetAlert ? c.accent : c.border,
              borderRadius: radii.full,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <Text
              style={{
                fontFamily: fontFamily.mono[700],
                fontSize: components.timerCard.alertBadgeFont.size,
                color: timer.preResetAlert ? c.textOnAccent : c.textMuted,
              }}
            >
              {timer.preResetAlert ? t("dashboard.timer.alertOn") : t("dashboard.timer.alertOff")}
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Countdown */}
      <Text
        style={{
          fontFamily: fontFamily.mono[700],
          fontSize: components.timerCard.countdownFont.size,
          letterSpacing: components.timerCard.countdownLetterSpacing,
          // Design is `28px/1`; in RN lineHeight is pixels, not a ratio, so
          // this must be the font size — `1` collapsed the line box to 1px.
          lineHeight: components.timerCard.countdownFont.size,
          color: timeColor,
          marginBottom: 12,
        }}
      >
        {timeString}
      </Text>

      {/* Progress bar */}
      <View
        style={{
          height: components.progressBar.height,
          borderRadius: components.progressBar.radius,
          backgroundColor: c.progressTrack,
          overflow: "hidden",
          marginBottom: 14,
        }}
      >
        <View
          style={{
            height: "100%",
            borderRadius: components.progressBar.radius,
            width: `${progress}%`,
            backgroundColor: progressColor,
          }}
        />
      </View>

      {/* Reset time */}
      <Text
        style={{
          fontFamily: fontFamily.manrope[500],
          fontSize: 12,
          color: c.textMuted,
        }}
      >
        {t("dashboard.timer.resetsAt", { time: getResetTimeString(timer) })}
      </Text>
    </Pressable>
  );
}
