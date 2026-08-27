import { View, Text, ScrollView } from "react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { storage } from "@/lib/storage";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "@/contexts/app-theme-context";
import { colors, components, fontSizes, spacing, radii, shadows, fontFamily } from "@/lib/tokens";

export default function HistoryScreen() {
  const { t } = useTranslation();
  const { isDark } = useAppTheme();
  const c = isDark ? colors.dark : colors.light;
  const allTimers = storage.timers.get();
  const inactive = allTimers
    .filter((timer) => !timer.active)
    .sort((a, b) => b.resetTime - a.resetTime);

  const grouped = inactive.reduce(
    (acc, t) => {
      const date = new Date(timer.resetTime).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(t);
      return acc;
    },
    {} as Record<string, typeof inactive>
  );

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <Animated.View
        entering={FadeIn.duration(400)}
        style={{ paddingHorizontal: spacing[20], paddingTop: spacing[56], paddingBottom: spacing[18] }}
      >
        <Text
          style={{
            fontFamily: fontFamily.manrope[800],
            fontSize: fontSizes.h3,
            letterSpacing: -0.5,
            color: c.textPrimary,
          }}
        >
          {t("history.title")}
        </Text>
      </Animated.View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing[20], paddingBottom: spacing[40] }}
      >
        {inactive.length === 0 ? (
          <Animated.View
            entering={FadeInDown.duration(500).delay(200)}
            style={{ alignItems: "center", paddingTop: spacing[56] }}
          >
            <Text
              style={{
                fontFamily: fontFamily.manrope[500],
                fontSize: fontSizes.body,
                color: c.textMuted,
              }}
            >
              {t("history.empty")}
            </Text>
          </Animated.View>
        ) : (
          Object.entries(grouped).map(([date, timers], groupIndex) => (
            <Animated.View
              key={date}
              entering={FadeInDown.duration(400).delay(groupIndex * 100)}
              style={{ marginBottom: spacing[24] }}
            >
              <Text
                style={{
                  fontFamily: fontFamily.manrope[700],
                  fontSize: fontSizes.bodySm,
                  color: c.textPrimary,
                  marginBottom: spacing[10],
                }}
              >
                {date}
              </Text>
              {timers.map((timer) => (
                <View
                  key={timer.id}
                  style={{
                    backgroundColor: c.surface,
                    borderRadius: radii.badge,
                    padding: spacing[16],
                    marginBottom: spacing[8],
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing[10] }}>
                    <View
                      style={{
                        width: components.timeline.lineWidth * 4,
                        height: components.timeline.lineWidth * 4,
                        borderRadius: 50,
                        backgroundColor:
                          timer.platform === "claude" ? c.claude : c.codex,
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: fontFamily.manrope[600],
                        fontSize: fontSizes.caption,
                        color: c.textPrimary,
                      }}
                    >
                      {t(`dashboard.timer.${timer.platform}`)}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: fontFamily.mono[500],
                      fontSize: fontSizes.xs,
                      color: c.textTertiary,
                    }}
                  >
                    {new Date(timer.resetTime).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              ))}
            </Animated.View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
