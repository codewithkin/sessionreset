import { useCallback, useMemo, useRef, useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { useTimers } from "@/contexts/TimerContext";
import { Platform } from "@/lib/types";
import { useAppTheme } from "@/contexts/app-theme-context";
import { colors, components, elevations, fontFamily, fontSizes, layout, radii, spacing, springs } from "@/lib/tokens";
import { useDirection } from "@/lib/rtl";
import { getAppLanguage } from "@/lib/i18n";
import { formatClockTime } from "@/lib/timeline";
import { FIVE_HOURS_MS, FIFTEEN_MINUTES_MS } from "@/lib/timer-engine";
import { PressableScale } from "@/components/PressableScale";

const SERVICES: { key: Platform; color: string }[] = [
  { key: "claude", color: colors.light.claude },
  { key: "codex", color: colors.light.codex },
];

const OFFSET_MINUTES = [0, 5, 15, 30] as const;

export default function QuickLogScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isDark } = useAppTheme();
  const { row, textAlign, writingDirection } = useDirection();
  const c = isDark ? colors.dark : colors.light;
  const { addTimer, timers } = useTimers();
  const sheetRef = useRef<BottomSheet>(null);

  const [selectedService, setSelectedService] = useState<Platform | null>(null);
  const [selectedOffset, setSelectedOffset] = useState(0);
  const [preResetAlert, setPreResetAlert] = useState(true);

  const startTime = Date.now() - selectedOffset * 60_000;
  const alarmAt = useMemo(
    () => formatClockTime(startTime + FIVE_HOURS_MS - FIFTEEN_MINUTES_MS, getAppLanguage()),
    [startTime]
  );

  // Let the sheet animate out before the route unmounts.
  const dismiss = useCallback(() => sheetRef.current?.close(), []);

  const handleStart = async () => {
    if (!selectedService) return;

    const existing = timers.find((timer) => timer.platform === selectedService && timer.active);

    const doStart = async () => {
      // The window opened when they hit the limit, not when they logged it.
      await addTimer(selectedService, preResetAlert, Date.now() - selectedOffset * 60_000);
      dismiss();
    };

    if (existing) {
      Alert.alert(
        t("quickLog.title"),
        t("quickLog.replaceWarning", { platform: t(`quickLog.${selectedService}`) }),
        [
          { text: t("quickLog.cancel"), style: "cancel" },
          { text: t("quickLog.confirm"), style: "destructive", onPress: doStart },
        ]
      );
      return;
    }

    await doStart();
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={isDark ? 0.68 : 0.5} />
    ),
    [isDark]
  );

  return (
    <BottomSheet
      ref={sheetRef}
      enablePanDownToClose
      enableDynamicSizing
      onClose={() => router.back()}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: isDark ? components.timerCard.dark.bg : c.bg,
        borderTopLeftRadius: components.bottomSheet.radius,
        borderTopRightRadius: components.bottomSheet.radius,
      }}
      handleIndicatorStyle={{
        width: components.bottomSheet.handleWidth,
        height: components.bottomSheet.handleHeight,
        borderRadius: components.bottomSheet.handleRadius,
        backgroundColor: isDark ? components.bottomSheet.dark.handle : components.bottomSheet.light.handle,
      }}
    >
      <BottomSheetView
        style={{
          paddingHorizontal: components.bottomSheet.padding.horizontal,
          paddingBottom: spacing[32],
        }}
      >
        <Text
          style={{
            marginTop: spacing[18],
            fontFamily: fontFamily.manrope[800],
            fontSize: fontSizes.h5,
            letterSpacing: -0.3,
            color: c.textPrimary,
            textAlign,
            writingDirection,
          }}
        >
          {t("quickLog.title")}
        </Text>

        {/* Service — dot above the name, filled in the brand colour when picked */}
        <View style={{ marginTop: spacing[20], flexDirection: row, gap: spacing[12] }}>
          {SERVICES.map((s) => {
            const active = selectedService === s.key;
            return (
              <PressableScale
                key={s.key}
                onPress={() => setSelectedService(s.key)}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                style={{
                  flex: 1,
                  borderWidth: 2,
                  borderColor: active ? s.color : c.border,
                  backgroundColor: active ? s.color : "transparent",
                  borderRadius: components.primaryButton.radius,
                  padding: spacing[16],
                  gap: spacing[10],
                }}
              >
                <View
                  style={{
                    width: layout.serviceDot.size,
                    height: layout.serviceDot.size,
                    borderRadius: layout.serviceDot.size / 2,
                    backgroundColor: active ? (isDark ? colors.dark.textOnBrand : "#FFFFFF") : s.color,
                  }}
                />
                <Text
                  style={{
                    fontFamily: fontFamily.manrope[700],
                    fontSize: fontSizes.bodySm,
                    color: active ? (isDark ? colors.dark.textOnBrand : "#FFFFFF") : c.textSecondary,
                    textAlign,
                    writingDirection,
                  }}
                >
                  {t(`quickLog.${s.key}`)}
                </Text>
              </PressableScale>
            );
          })}
        </View>

        <Text
          style={{
            marginTop: spacing[24],
            fontFamily: fontFamily.manrope[700],
            fontSize: fontSizes.micro,
            color: c.textTertiary,
            textAlign,
            writingDirection,
          }}
        >
          {t("quickLog.timeLabel")}
        </Text>

        {/* Offset pills — "Just Now" in Manrope, the rest mono, per the design */}
        <View style={{ marginTop: spacing[12], flexDirection: row, gap: spacing[8] }}>
          {OFFSET_MINUTES.map((minutes) => {
            const active = selectedOffset === minutes;
            const isNow = minutes === 0;
            return (
              <PressableScale
                key={minutes}
                onPress={() => setSelectedOffset(minutes)}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                style={{
                  flex: 1,
                  borderRadius: radii.full,
                  borderWidth: active ? 0 : 1.5,
                  borderColor: isDark ? components.offsetPill.dark.inactiveBorder : components.offsetPill.light.inactiveBorder,
                  backgroundColor: active
                    ? isDark
                      ? components.offsetPill.dark.activeBg
                      : components.offsetPill.light.activeBg
                    : "transparent",
                  paddingVertical: active ? 11 : 10,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: isNow ? fontFamily.manrope[700] : fontFamily.mono[700],
                    fontSize: fontSizes.micro,
                    color: active
                      ? isDark
                        ? components.offsetPill.dark.activeText
                        : components.offsetPill.light.activeText
                      : c.textSecondary,
                  }}
                >
                  {isNow ? t("quickLog.justNow") : t("quickLog.minutesShort", { minutes })}
                </Text>
              </PressableScale>
            );
          })}
        </View>

        {/* Alert card — subtitle names the exact local alarm time */}
        <Pressable
          onPress={() => setPreResetAlert((v) => !v)}
          accessibilityRole="switch"
          accessibilityState={{ checked: preResetAlert }}
          style={{
            marginTop: spacing[22],
            backgroundColor: isDark ? colors.dark.surfaceAlt : c.surface,
            borderRadius: components.primaryButton.radius,
            paddingVertical: spacing[16],
            paddingHorizontal: spacing[18],
            flexDirection: row,
            alignItems: "center",
            justifyContent: "space-between",
            gap: spacing[12],
          }}
        >
          <View style={{ flex: 1, gap: spacing[3] }}>
            <Text
              style={{
                fontFamily: fontFamily.manrope[700],
                fontSize: fontSizes.caption,
                color: c.textPrimary,
                textAlign,
                writingDirection,
              }}
            >
              {t("quickLog.alertLabel")}
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
              {t("quickLog.alertSub", { time: alarmAt })}
            </Text>
          </View>

          <View
            style={{
              width: components.toggle.width,
              height: components.toggle.height,
              borderRadius: components.toggle.radius,
              backgroundColor: preResetAlert
                ? isDark
                  ? components.toggle.dark.on
                  : components.toggle.light.on
                : c.border,
              padding: components.toggle.padding,
              justifyContent: "center",
              alignItems: preResetAlert ? "flex-end" : "flex-start",
              flexShrink: 0,
            }}
          >
            <Animated.View
              key={preResetAlert ? "on" : "off"}
              entering={ZoomIn.springify()
                .damping(springs.pop.damping)
                .stiffness(springs.pop.stiffness)
                .mass(springs.pop.mass)}
              style={{
                width: components.toggle.knobSize,
                height: components.toggle.knobSize,
                borderRadius: components.toggle.knobSize / 2,
                backgroundColor: preResetAlert
                  ? isDark
                    ? components.toggle.dark.knob
                    : components.toggle.light.knob
                  : c.bg,
              }}
            />
          </View>
        </Pressable>

        <Animated.View entering={FadeIn.duration(250)} style={{ marginTop: spacing[22] }}>
          <PressableScale
            onPress={handleStart}
            disabled={!selectedService}
            accessibilityRole="button"
            style={{
              height: components.primaryButton.height,
              borderRadius: components.primaryButton.radius,
              backgroundColor: selectedService ? c.accent : c.border,
              alignItems: "center",
              justifyContent: "center",
              boxShadow: selectedService ? elevations[isDark ? "dark" : "light"].accentButton : undefined,
            }}
          >
            <Text
              style={{
                fontFamily: fontFamily.manrope[700],
                fontSize: fontSizes.body,
                color: selectedService ? c.textOnAccent : c.textDisabled,
              }}
            >
              {t("quickLog.cta")}
            </Text>
          </PressableScale>
        </Animated.View>
      </BottomSheetView>
    </BottomSheet>
  );
}
