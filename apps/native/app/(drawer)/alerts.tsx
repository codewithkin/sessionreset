import { View, Text, ScrollView } from "react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { storage } from "@/lib/storage";
import { useAppTheme } from "@/contexts/app-theme-context";
import { colors, components, fontSizes, spacing, radii, shadows, letterSpacing, layout } from "@/lib/tokens";

export default function AlertsScreen() {
  const { isDark } = useAppTheme();
  const c = isDark ? colors.dark : colors.light;
  const settings = storage.settings.get();
  const timers = storage.timers.getActive();
  const withAlert = timers.filter((t) => t.preResetAlert);

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
          Alerts
        </Text>
      </Animated.View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing[20], paddingBottom: spacing[40] }}
      >
        {/* Alert status */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(100)}
          style={{
            backgroundColor: c.surface,
            borderRadius: radii.badge,
            padding: spacing[18],
            marginBottom: spacing[16],
          }}
        >
          <Text
            style={{
              fontFamily: "Manrope",
              fontSize: fontSizes.body,
              fontWeight: "700",
              color: c.textPrimary,
              marginBottom: spacing[4],
            }}
          >
            Pre-Reset Alerts
          </Text>
          <Text
            style={{
              fontFamily: "Manrope",
              fontSize: fontSizes.micro,
              fontWeight: "500",
              color: c.textTertiary,
            }}
          >
            {settings.preResetAlertEnabled
              ? "Enabled — You'll get notified 15 minutes before each reset."
              : "Disabled — Turn on to get notified before resets."}
          </Text>
        </Animated.View>

        {/* Active alerts */}
        {withAlert.length > 0 ? (
          <Animated.View entering={FadeInDown.duration(400).delay(200)}>
            <Text
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: fontSizes.xs,
                fontWeight: "700",
                letterSpacing: letterSpacing.wideMd,
                color: c.textMuted,
                marginBottom: spacing[10],
              }}
            >
              ACTIVE ALERTS
            </Text>
            {withAlert.map((t, index) => (
              <Animated.View
                key={t.id}
                entering={FadeInDown.duration(400).delay(300 + index * 80)}
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
                      width: layout.serviceDot.size,
                      height: layout.serviceDot.size,
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
                <View
                  style={{
                    backgroundColor: isDark ? components.offsetPill.dark.activeBg : components.offsetPill.light.activeBg,
                    borderRadius: radii.full,
                    paddingHorizontal: spacing[10],
                    paddingVertical: spacing[5],
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "JetBrains Mono",
                      fontSize: fontSizes.xs,
                      fontWeight: "700",
                      color: isDark ? components.offsetPill.dark.activeText : components.offsetPill.light.activeText,
                    }}
                  >
                    15m
                  </Text>
                </View>
              </Animated.View>
            ))}
          </Animated.View>
        ) : (
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
              No active alerts. Enable alerts on your timers to see them here.
            </Text>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
