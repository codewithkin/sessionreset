import { ReactNode, useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { useAppTheme } from "@/contexts/app-theme-context";
import { colors, components, fontFamily, fontSizes, layout, spacing } from "@/lib/tokens";
import { useDirection } from "@/lib/rtl";

type ThemeColors = typeof colors.light | typeof colors.dark;

/**
 * Shared three-column row: clock time, the dot/line rail, then content.
 * Column widths come straight from the design (54 / 16, 12px gutters).
 */
export function TimelineRow({
  time,
  timeTone = "muted",
  dot,
  dotOffset,
  timeOffset,
  showLine = true,
  children,
}: {
  time: string;
  timeTone?: "muted" | "strong" | "accent";
  dot: ReactNode;
  dotOffset: number;
  timeOffset: number;
  showLine?: boolean;
  children: ReactNode;
}) {
  const { isDark } = useAppTheme();
  const { row, textAlignEnd } = useDirection();
  const c = isDark ? colors.dark : colors.light;

  const timeColor =
    timeTone === "accent" ? c.accent : timeTone === "strong" ? c.textPrimary : c.textMuted;

  return (
    <View style={{ flexDirection: row, gap: spacing[12] }}>
      <Text
        style={{
          width: layout.timeline.timeColWidth,
          flexShrink: 0,
          textAlign: textAlignEnd,
          paddingTop: timeOffset,
          fontFamily: timeTone === "muted" ? fontFamily.mono[500] : fontFamily.mono[700],
          fontSize: fontSizes.xs,
          color: timeColor,
        }}
      >
        {time}
      </Text>

      <View style={{ width: layout.timeline.dotColWidth, flexShrink: 0, alignItems: "center" }}>
        <View style={{ marginTop: dotOffset }}>{dot}</View>
        {showLine && (
          <View
            style={{
              flex: 1,
              width: layout.timeline.lineWidth,
              backgroundColor: isDark ? components.timeline.dark.line : components.timeline.light.line,
            }}
          />
        )}
      </View>

      <View style={{ flex: 1, minWidth: 0 }}>{children}</View>
    </View>
  );
}

/** Hollow dot — a moment that carries no countdown (logged, or all-clear). */
export function TimelineHollowDot({ c, isDark }: { c: ThemeColors; isDark: boolean }) {
  return (
    <View
      style={{
        width: layout.timeline.dotPast,
        height: layout.timeline.dotPast,
        borderRadius: layout.timeline.dotPast / 2,
        borderWidth: 2,
        borderColor: isDark ? components.timeline.dark.dotBorder : components.timeline.light.dotBorder,
        backgroundColor: c.bg,
      }}
    />
  );
}

/** Filled dot in a service's brand colour — a window reopening. */
export function TimelineBrandDot({ color }: { color: string }) {
  return (
    <View
      style={{
        width: layout.timeline.dotFuture,
        height: layout.timeline.dotFuture,
        borderRadius: layout.timeline.dotFuture / 2,
        backgroundColor: color,
      }}
    />
  );
}

/**
 * The NOW marker: accent dot with a soft halo, a rule across the row and the
 * NOW label. The halo breathes slowly — it is the one live thing on the
 * screen, and the pulse is what makes the timeline read as "you are here".
 */
export function TimelineNowRow({ time }: { time: string }) {
  const { isDark } = useAppTheme();
  const { row, isRTL } = useDirection();
  const c = isDark ? colors.dark : colors.light;

  const pulse = useSharedValue(0);
  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, [pulse]);

  // RN has no spread shadow, so the design's `0 0 0 4px` ring is a real view.
  const haloStyle = useAnimatedStyle(() => ({
    opacity: 0.1 + pulse.value * 0.16,
    transform: [{ scale: 0.9 + pulse.value * 0.25 }],
  }));

  return (
    <View
      style={{
        flexDirection: row,
        gap: spacing[12],
        alignItems: "center",
        marginTop: spacing[2],
        marginBottom: spacing[10],
      }}
    >
      <Text
        style={{
          width: layout.timeline.timeColWidth,
          flexShrink: 0,
          textAlign: isRTL ? "left" : "right",
          fontFamily: fontFamily.mono[700],
          fontSize: fontSizes.xs,
          color: c.accent,
        }}
      >
        {time}
      </Text>

      <View
        style={{
          width: layout.timeline.dotColWidth,
          flexShrink: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              width: layout.timeline.dotActive + 8,
              height: layout.timeline.dotActive + 8,
              borderRadius: (layout.timeline.dotActive + 8) / 2,
              backgroundColor: c.accent,
            },
            haloStyle,
          ]}
        />
        <View
          style={{
            width: layout.timeline.dotActive,
            height: layout.timeline.dotActive,
            borderRadius: layout.timeline.dotActive / 2,
            backgroundColor: c.accent,
          }}
        />
      </View>

      <View style={{ flex: 1, flexDirection: row, alignItems: "center", gap: spacing[10] }}>
        <View style={{ flex: 1, height: layout.timeline.lineWidth, backgroundColor: c.accent }} />
        <Text
          style={{
            fontFamily: fontFamily.mono[700],
            fontSize: fontSizes.tiny,
            letterSpacing: 1.4,
            color: c.accent,
          }}
        >
          NOW
        </Text>
      </View>
    </View>
  );
}

/** Plain two-line note used for "limit logged" and "all clear" rows. */
export function TimelineNote({ title, subtitle }: { title: string; subtitle?: string }) {
  const { isDark } = useAppTheme();
  const { textAlign, writingDirection } = useDirection();
  const c = isDark ? colors.dark : colors.light;

  return (
    <View>
      <Text
        style={{
          fontFamily: fontFamily.manrope[600],
          fontSize: fontSizes.caption,
          color: c.textTertiary,
          textAlign,
          writingDirection,
        }}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={{
            marginTop: spacing[3],
            fontFamily: fontFamily.manrope[500],
            fontSize: fontSizes.xs,
            color: c.textMuted,
            textAlign,
            writingDirection,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
