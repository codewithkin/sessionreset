import { View, Text, ScrollView } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { getAppLanguage } from "@/lib/i18n";
import { formatClockTime } from "@/lib/timeline";
import { FIFTEEN_MINUTES_MS } from "@/lib/timer-engine";
import { useTimers } from "@/contexts/TimerContext";
import { useAppTheme } from "@/contexts/app-theme-context";
import { colors, components, fontFamily, fontSizes, layout, letterSpacing, spacing } from "@/lib/tokens";
import { useDirection } from "@/lib/rtl";

export default function AlertsScreen() {
  const { t } = useTranslation();
  const { timers, toggleAlert } = useTimers();
  const { isDark } = useAppTheme();
  const { row, textAlign, writingDirection } = useDirection();
  const insets = useSafeAreaInsets();
  const c = isDark ? colors.dark : colors.light;
  const locale = getAppLanguage();

  const armed = timers.filter((timer) => timer.preResetAlert);
  const divider = isDark ? components.settingsRow.dark.divider : components.settingsRow.light.divider;

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top }}>
      <Animated.View
        entering={FadeIn.duration(300)}
        style={{ height: 52, justifyContent: "center", paddingHorizontal: layout.dashboard.hPadding }}
      >
        <Text
          style={{
            fontFamily: fontFamily.manrope[800],
            fontSize: fontSizes.h3,
            letterSpacing: -0.5,
            color: c.textPrimary,
            textAlign,
            writingDirection,
          }}
        >
          {t("alerts.title")}
        </Text>
      </Animated.View>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: layout.dashboard.hPadding,
          paddingTop: spacing[8],
          paddingBottom: spacing[24],
        }}
        showsVerticalScrollIndicator={false}
      >
        {armed.length === 0 ? (
          <Animated.View
            entering={FadeInDown.duration(400).delay(150)}
            style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: spacing[12] }}
          >
            <Ionicons name="notifications-off-outline" size={40} color={c.textMuted} />
            <Text
              style={{
                fontFamily: fontFamily.manrope[500],
                fontSize: fontSizes.body,
                lineHeight: 24,
                color: c.textMuted,
                textAlign: "center",
              }}
            >
              {t("alerts.empty")}
            </Text>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.duration(360).delay(100)} style={{ marginTop: spacing[12] }}>
            <Text
              style={{
                fontFamily: fontFamily.mono[700],
                fontSize: fontSizes.tiny,
                letterSpacing: letterSpacing.wideMd,
                color: c.textMuted,
                textAlign,
                writingDirection,
              }}
            >
              {t("alerts.active")}
            </Text>

            <View style={{ marginTop: spacing[10], borderTopWidth: 1, borderTopColor: divider }}>
              {armed.map((timer, i) => (
                <Animated.View
                  key={timer.id}
                  entering={FadeInDown.duration(340).delay(160 + i * 70)}
                  style={{
                    flexDirection: row,
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: spacing[12],
                    paddingVertical: spacing[16],
                    borderBottomWidth: i === armed.length - 1 ? 0 : 1,
                    borderBottomColor: divider,
                  }}
                >
                  <View style={{ flexDirection: row, alignItems: "center", gap: spacing[10], flex: 1 }}>
                    <View
                      style={{
                        width: layout.serviceDot.size,
                        height: layout.serviceDot.size,
                        borderRadius: layout.serviceDot.size / 2,
                        backgroundColor: timer.platform === "claude" ? c.claude : c.codex,
                      }}
                    />
                    <View style={{ flex: 1, gap: spacing[2] }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: fontFamily.manrope[600],
                          fontSize: fontSizes.bodySm,
                          color: c.textPrimary,
                          textAlign,
                          writingDirection,
                        }}
                      >
                        {t(`dashboard.timer.${timer.platform}`)}
                      </Text>
                      <Text
                        style={{
                          fontFamily: fontFamily.manrope[500],
                          fontSize: fontSizes.xs,
                          color: c.textMuted,
                          textAlign,
                          writingDirection,
                        }}
                      >
                        {t("quickLog.alertSub", {
                          time: formatClockTime(timer.resetTime - FIFTEEN_MINUTES_MS, locale),
                        })}
                      </Text>
                    </View>
                  </View>

                  <Text
                    onPress={() => toggleAlert(timer.id)}
                    suppressHighlighting
                    style={{
                      fontFamily: fontFamily.mono[700],
                      fontSize: fontSizes.tiny,
                      color: c.accent,
                      flexShrink: 0,
                    }}
                  >
                    {t("dashboard.timer.alertOn")}
                  </Text>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
