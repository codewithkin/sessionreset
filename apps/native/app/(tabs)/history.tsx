import { useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { storage } from "@/lib/storage";
import { getAppLanguage } from "@/lib/i18n";
import { formatClockTime } from "@/lib/timeline";
import { useAppTheme } from "@/contexts/app-theme-context";
import { colors, components, fontFamily, fontSizes, layout, letterSpacing, spacing } from "@/lib/tokens";
import { useDirection } from "@/lib/rtl";
import { Timer } from "@/lib/types";

export default function HistoryScreen() {
  const { t } = useTranslation();
  const { isDark } = useAppTheme();
  const { row, textAlign, writingDirection } = useDirection();
  const insets = useSafeAreaInsets();
  const c = isDark ? colors.dark : colors.light;
  const locale = getAppLanguage();

  const groups = useMemo(() => {
    const past = storage.timers
      .get()
      .filter((timer) => !timer.active)
      .sort((a, b) => b.resetTime - a.resetTime);

    // Insertion order is preserved, and `past` is already newest-first, so the
    // resulting day groups come out in the right order too.
    const byDay = new Map<string, Timer[]>();
    for (const timer of past) {
      const day = new Date(timer.resetTime).toLocaleDateString(locale, {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      const bucket = byDay.get(day);
      if (bucket) bucket.push(timer);
      else byDay.set(day, [timer]);
    }
    return [...byDay.entries()];
  }, [locale]);

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
          {t("history.title")}
        </Text>
      </Animated.View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: layout.dashboard.hPadding,
          paddingTop: spacing[8],
          paddingBottom: spacing[24],
        }}
        showsVerticalScrollIndicator={false}
      >
        {groups.length === 0 ? (
          <Animated.View
            entering={FadeInDown.duration(400).delay(150)}
            style={{ alignItems: "center", paddingTop: spacing[56], gap: spacing[12] }}
          >
            <Ionicons name="time-outline" size={40} color={c.textMuted} />
            <Text
              style={{
                fontFamily: fontFamily.manrope[500],
                fontSize: fontSizes.body,
                color: c.textMuted,
                textAlign: "center",
              }}
            >
              {t("history.empty")}
            </Text>
          </Animated.View>
        ) : (
          groups.map(([day, timers], groupIndex) => (
            <Animated.View
              key={day}
              entering={FadeInDown.duration(360).delay(100 + groupIndex * 70)}
              style={{ marginTop: groupIndex === 0 ? spacing[12] : spacing[26] }}
            >
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
                {day.toUpperCase()}
              </Text>

              <View style={{ marginTop: spacing[10], borderTopWidth: 1, borderTopColor: divider }}>
                {timers.map((timer, i) => (
                  <View
                    key={timer.id}
                    style={{
                      flexDirection: row,
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: spacing[12],
                      paddingVertical: spacing[14],
                      borderBottomWidth: i === timers.length - 1 ? 0 : 1,
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
                      <Text
                        numberOfLines={1}
                        style={{
                          flex: 1,
                          fontFamily: fontFamily.manrope[600],
                          fontSize: fontSizes.bodySm,
                          color: c.textPrimary,
                          textAlign,
                          writingDirection,
                        }}
                      >
                        {t(`dashboard.timer.${timer.platform}`)}
                      </Text>
                    </View>

                    <Text
                      style={{
                        fontFamily: fontFamily.mono[500],
                        fontSize: fontSizes.xs,
                        color: c.textMuted,
                        flexShrink: 0,
                      }}
                    >
                      {formatClockTime(timer.startTime, locale)} → {formatClockTime(timer.resetTime, locale)}
                    </Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
