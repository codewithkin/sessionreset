import { View, Text, ScrollView } from "react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { storage } from "@/lib/storage";
import { useAppTheme } from "@/contexts/app-theme-context";
import { colors, components, fontSizes, spacing, radii, shadows } from "@/lib/tokens";

export default function HistoryScreen() {
  const { isDark } = useAppTheme();
  const c = isDark ? colors.dark : colors.light;
  const allTimers = storage.timers.get();
  const inactive = allTimers
    .filter((t) => !t.active)
    .sort((a, b) => b.resetTime - a.resetTime);

  const grouped = inactive.reduce(
    (acc, t) => {
      const date = new Date(t.resetTime).toLocaleDateString("en-US", {
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
            fontFamily: "Manrope",
            fontSize: fontSizes.h3,
            fontWeight: "800",
            letterSpacing: -0.5,
            color: c.textPrimary,
          }}
        >
          History
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
                fontFamily: "Manrope",
                fontSize: fontSizes.body,
                fontWeight: "500",
                color: c.textMuted,
              }}
            >
              No past timers yet.
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
                  fontFamily: "Manrope",
                  fontSize: fontSizes.bodySm,
                  fontWeight: "700",
                  color: c.textPrimary,
                  marginBottom: spacing[10],
                }}
              >
                {date}
              </Text>
              {timers.map((t) => (
                <View
                  key={t.id}
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
                          t.platform === "claude" ? c.claude : c.codex,
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: "Manrope",
                        fontSize: fontSizes.caption,
                        fontWeight: "600",
                        color: c.textPrimary,
                      }}
                    >
                      {t.platform === "claude" ? "Claude" : "Codex"}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: "JetBrains Mono",
                      fontSize: fontSizes.xs,
                      fontWeight: "500",
                      color: c.textTertiary,
                    }}
                  >
                    {new Date(t.resetTime).toLocaleTimeString([], {
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
