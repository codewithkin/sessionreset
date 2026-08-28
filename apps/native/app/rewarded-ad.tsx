import { View, Text, Pressable } from "react-native";
import Animated, { FadeIn, FadeOut, ZoomIn } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "@/contexts/app-theme-context";
import { colors, components, fontFamily, fontSizes, spacing, springs } from "@/lib/tokens";
import { useDirection } from "@/lib/rtl";
import { PressableScale } from "@/components/PressableScale";

/**
 * Design screen 10 — centred dialog over Settings offering a 10-hour Pro
 * unlock in exchange for a rewarded video.
 *
 * The video itself is a placeholder: AdMob was removed in session 2 (Kotlin
 * 2.3 vs Expo SDK 57's 2.1.20) and ads are explicitly out of scope, so the
 * CTA explains that rather than pretending to play something.
 */
export default function RewardedAdScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isDark } = useAppTheme();
  const { writingDirection } = useDirection();
  const c = isDark ? colors.dark : colors.light;

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      style={{
        flex: 1,
        backgroundColor: c.overlayHeavy,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: spacing[26],
      }}
    >
      {/* Tapping the scrim dismisses, as with any dialog. */}
      <Pressable style={{ position: "absolute", inset: 0 }} onPress={() => router.back()} accessible={false} />

      <Animated.View
        entering={ZoomIn.springify()
          .damping(springs.pop.damping)
          .stiffness(springs.pop.stiffness)
          .mass(springs.pop.mass)}
        style={{
          width: "100%",
          maxWidth: components.dialog.maxWidth,
          backgroundColor: isDark ? components.dialog.dark.bg : components.dialog.light.bg,
          borderRadius: components.dialog.radius,
          padding: components.dialog.padding,
          alignItems: "center",
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isDark ? 0.6 : 0.2,
          shadowRadius: 32,
          elevation: 12,
        }}
      >
        <View
          style={{
            width: components.dialog.iconSize,
            height: components.dialog.iconSize,
            borderRadius: components.dialog.iconRadius,
            backgroundColor: isDark ? components.checklistItem.dark.circleBg : components.checklistItem.light.circleBg,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: fontFamily.mono[700],
              fontSize: 10,
              letterSpacing: 1,
              color: c.accent,
            }}
          >
            LOCK
          </Text>
        </View>

        <Text
          style={{
            marginTop: spacing[20],
            textAlign: "center",
            fontFamily: fontFamily.manrope[800],
            fontSize: fontSizes.h3,
            lineHeight: 27.5,
            letterSpacing: -0.5,
            color: c.textPrimary,
            writingDirection,
          }}
        >
          {t("rewardedAd.headline")}
        </Text>

        <Text
          style={{
            marginTop: spacing[12],
            textAlign: "center",
            fontFamily: fontFamily.manrope[500],
            fontSize: fontSizes.bodySm,
            lineHeight: 23.25,
            color: c.textTertiary,
            writingDirection,
          }}
        >
          {t("rewardedAd.body")}
        </Text>

        <PressableScale
          onPress={() => router.back()}
          accessibilityRole="button"
          style={{
            marginTop: spacing[24],
            width: "100%",
            height: 52,
            borderRadius: components.primaryButton.radius,
            backgroundColor: c.accent,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontFamily: fontFamily.manrope[700], fontSize: fontSizes.bodySm, color: c.textOnAccent }}>
            {t("rewardedAd.cta")}
          </Text>
        </PressableScale>

        <Pressable onPress={() => router.back()} hitSlop={8} style={{ marginTop: spacing[16] }}>
          <Text style={{ fontFamily: fontFamily.manrope[600], fontSize: fontSizes.caption, color: c.textMuted }}>
            {t("rewardedAd.dismiss")}
          </Text>
        </Pressable>

        <Text
          style={{
            marginTop: spacing[14],
            textAlign: "center",
            fontFamily: fontFamily.manrope[500],
            fontSize: fontSizes.tiny,
            color: c.textMuted,
            writingDirection,
          }}
        >
          {t("rewardedAd.unavailable")}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}
