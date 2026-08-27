import { View, Text, Pressable } from "react-native";
import { useThemeColor } from "heroui-native";
import { Timer } from "@/lib/types";
import { useCountdown } from "@/hooks/useCountdown";
import { getResetTimeString } from "@/lib/timer-engine";

interface TimerCardProps {
  timer: Timer;
  onToggleAlert: (id: string) => void;
  onRemove: (id: string) => void;
}

const BRAND_COLORS = {
  claude: "#CC785C",
  codex: "#10A37F",
} as const;

const BRAND_NAMES = {
  claude: "Claude 3.5 Sonnet",
  codex: "Codex",
} as const;

export function TimerCard({ timer, onToggleAlert, onRemove }: TimerCardProps) {
  const { timeString, progress, isWarning, isUrgent } = useCountdown(timer);

  const bg = useThemeColor("background");
  const fg = useThemeColor("foreground");

  const brandColor = BRAND_COLORS[timer.platform];
  const brandName = BRAND_NAMES[timer.platform];

  const progressColor = isWarning ? "#F59E0B" : "#3B82F6";
  const timeColor = isUrgent
    ? "#EF4444"
    : isWarning
      ? "#D97706"
      : fg;

  return (
    <Pressable
      onLongPress={() => onRemove(timer.id)}
      style={{
        backgroundColor: bg === "#000000" ? "#1A1A1A" : "#F5F6F7",
        borderRadius: 18,
        padding: 18,
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
            fontSize: 15,
            fontWeight: "700",
            color: fg,
          }}
        >
          {brandName}
        </Text>
        <Pressable onPress={() => onToggleAlert(timer.id)}>
          <View
            style={{
              backgroundColor: timer.preResetAlert ? "#3B82F6" : bg === "#000000" ? "#2A2A2A" : "#E6E7EA",
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <Text
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: 11,
                fontWeight: "700",
                color: timer.preResetAlert ? "#FFFFFF" : "#9DA1A7",
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
          fontSize: 28,
          fontWeight: "700",
          letterSpacing: -1.4,
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
          height: 4,
          borderRadius: 2,
          backgroundColor: bg === "#000000" ? "#2A2A2A" : "#E1E3E6",
          overflow: "hidden",
          marginBottom: 14,
        }}
      >
        <View
          style={{
            height: "100%",
            borderRadius: 2,
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
          color: "#9DA1A7",
        }}
      >
        Resets at {getResetTimeString(timer)}
      </Text>
    </Pressable>
  );
}
