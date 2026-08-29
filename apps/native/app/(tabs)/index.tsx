import { useCallback, useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, Alert, RefreshControl } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@/contexts/app-theme-context";
import { colors, fontFamily, fontSizes, layout, spacing } from "@/lib/tokens";
import { useDirection } from "@/lib/rtl";
import { getAppLanguage } from "@/lib/i18n";
import { useTimers } from "@/contexts/TimerContext";
import { buildTimeline, formatClockTime, TimelineEntry } from "@/lib/timeline";
import { TimerCard } from "@/components/TimerCard";
import { BannerAd } from "@/components/BannerAd";
import {
  TimelineRow,
  TimelineNowRow,
  TimelineNote,
  TimelineHollowDot,
  TimelineBrandDot,
} from "@/components/Timeline";

export default function TodayScreen() {
  const { timers, toggleAlert, removeTimer, refreshTimers } = useTimers();
  const { t } = useTranslation();
  const { isDark } = useAppTheme();
  const { row, textAlign, writingDirection } = useDirection();
  const insets = useSafeAreaInsets();
  const c = isDark ? colors.dark : colors.light;

  const [refreshing, setRefreshing] = useState(false);
  // Recomputed on every countdown tick via the timers list; a dedicated
  // "now" in state would drift from what the cards are showing.
  const entries = useMemo(() => buildTimeline(timers), [timers]);

  const locale = getAppLanguage();
  const dateStr = new Date().toLocaleDateString(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refreshTimers();
    setTimeout(() => setRefreshing(false), 500);
  }, [refreshTimers]);

  const handleRemove = (id: string) => {
    Alert.alert(t("dashboard.remove.title"), t("dashboard.remove.body"), [
      { text: t("common.cancel"), style: "cancel" },
      { text: t("dashboard.remove.confirm"), style: "destructive", onPress: () => removeTimer(id) },
    ]);
  };

  const renderEntry = (entry: TimelineEntry, index: number) => {
    const time = formatClockTime(entry.at, locale);
    const stagger = FadeInDown.duration(360).delay(120 + index * 60);

    switch (entry.kind) {
      case "logged":
        return (
          <Animated.View key={entry.id} entering={stagger}>
            <TimelineRow
              time={time}
              timeTone="muted"
              timeOffset={14}
              dotOffset={16}
              dot={<TimelineHollowDot c={c} isDark={isDark} />}
            >
              <View style={{ paddingTop: spacing[12], paddingBottom: spacing[22] }}>
                <TimelineNote
                  title={t("dashboard.timeline.logged", { service: t(`dashboard.timer.${entry.timer.platform}`) })}
                  subtitle={t("dashboard.timeline.loggedSub")}
                />
              </View>
            </TimelineRow>
          </Animated.View>
        );

      case "now":
        return (
          <Animated.View key={entry.id} entering={FadeIn.duration(400).delay(100)}>
            <TimelineNowRow time={time} />
          </Animated.View>
        );

      case "reset":
        return (
          <Animated.View key={entry.id} entering={stagger}>
            <TimelineRow
              time={time}
              timeTone="strong"
              timeOffset={20}
              dotOffset={22}
              dot={<TimelineBrandDot color={entry.timer.platform === "claude" ? c.claude : c.codex} />}
            >
              <View style={{ paddingBottom: spacing[20] }}>
                <TimerCard timer={entry.timer} onToggleAlert={toggleAlert} onRemove={handleRemove} />
              </View>
            </TimelineRow>
          </Animated.View>
        );

      case "clear":
        return (
          <Animated.View key={entry.id} entering={stagger}>
            <TimelineRow
              time={time}
              timeTone="muted"
              timeOffset={12}
              dotOffset={14}
              showLine={false}
              dot={<TimelineHollowDot c={c} isDark={isDark} />}
            >
              <View style={{ paddingTop: spacing[10] }}>
                <TimelineNote
                  title={t("dashboard.timeline.allClear")}
                  subtitle={t("dashboard.timeline.allClearSub")}
                />
              </View>
            </TimelineRow>
          </Animated.View>
        );
    }
  };

  const openWindows = timers.length;

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top }}>
      {/* Header */}
      <Animated.View
        entering={FadeIn.duration(300)}
        style={{
          height: 52,
          justifyContent: "center",
          paddingHorizontal: layout.dashboard.hPadding,
        }}
      >
        <View style={{ gap: spacing[2] }}>
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
            {t("dashboard.today")}
          </Text>
          <Text
            style={{
              fontFamily: fontFamily.manrope[500],
              fontSize: fontSizes.xs,
              color: c.textTertiary,
              textAlign,
              writingDirection,
            }}
          >
            {openWindows === 0
              ? t("dashboard.subtitleEmpty", { date: dateStr })
              : t("dashboard.subtitle", { date: dateStr, count: openWindows })}
          </Text>
        </View>
      </Animated.View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: layout.dashboard.hPadding,
          paddingTop: spacing[20],
          paddingBottom: spacing[24],
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={c.textMuted} colors={[c.accent]} />
        }
      >
        {entries.map((entry, i) => renderEntry(entry, i))}

        {timers.length === 0 && (
          <Animated.View entering={FadeInDown.duration(400).delay(200)} style={{ paddingTop: spacing[8] }}>
            <TimelineRow
              time=""
              timeOffset={12}
              dotOffset={14}
              showLine={false}
              dot={<TimelineHollowDot c={c} isDark={isDark} />}
            >
              <View style={{ paddingTop: spacing[10] }}>
                <TimelineNote title={t("dashboard.empty.title")} subtitle={t("dashboard.empty.subtext")} />
              </View>
            </TimelineRow>
          </Animated.View>
        )}

      </ScrollView>

      <BannerAd />
    </View>
  );
}
