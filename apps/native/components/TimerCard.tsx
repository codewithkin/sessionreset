import { View, Text, Pressable, Platform } from "react-native";
import { useAppTheme } from "@/contexts/app-theme-context";
import { colors, radii, components } from "@/lib/tokens";
import { Timer } from "@/lib/types";
import { useCountdown } from "@/hooks/useCountdown";
import { getResetTimeString } from "@/lib/timer-engine";

interface TimerCardProps {
  timer: Timer;
  onToggleAlert: (id: string) => void;
  onRemove: (id: string) => void;
}

const BRAND_NAMES = {
  claude: "Claude 3.5 Sonnet",
  codex: "Codex",
} as const;

export function TimerCard({ timer, onToggleAlert, onRemove }: TimerCardProps) {
  const { timeString, progress, isWarning, isUrgent } = useCountdown(timer);
  const { isDark } = useAppTheme();
  const c = isDark ? colors.dark : colors.light;

  const brandName = BRAND_NAMES[timer.platform];

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
            fontFamily: "Manrope",
            fontSize: components.timerCard.titleFont.size,
            fontWeight: "700",
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
                fontFamily: "JetBrains Mono",
                fontSize: components.timerCard.alertBadgeFont.size,
                fontWeight: "700",
                color: timer.preResetAlert ? c.textOnAccent : c.textMuted,
              }}
            >
              {timer.preResetAlert ? "🔔 15m" : "🔔 15m Off"}
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Countdown */}
      <Text
        style={{
          fontFamily: "JetBrains Mono",
          fontSize: components.timerCard.countdownFont.size,
          fontWeight: "700",
          letterSpacing: components.timerCard.countdownLetterSpacing,
          lineHeight: 1,
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
          fontFamily: "Manrope",
          fontSize: 12,
          fontWeight: "500",
          color: c.textMuted,
        }}
      >
        Resets at {getResetTimeString(timer)}
      </Text>
    </Pressable>
  );
}
