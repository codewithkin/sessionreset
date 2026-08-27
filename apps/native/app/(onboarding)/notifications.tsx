import { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  requestNotificationPermission,
  getNotificationPermissionStatus,
  NotificationPermissionStatus,
} from "@/lib/notifications";
import { useAppTheme } from "@/contexts/app-theme-context";
import { colors, components, fontSizes, spacing, radii, shadows, layout } from "@/lib/tokens";
import { PressableScale } from "@/components/PressableScale";

export default function NotificationsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isDark } = useAppTheme();
  const c = isDark ? colors.dark : colors.light;
  const [status, setStatus] = useState<NotificationPermissionStatus>("undetermined");

  useEffect(() => {
    getNotificationPermissionStatus().then((s) => {
      if (s === "granted") {
        setTimeout(() => router.push("/(onboarding)/starter"), 1000);
      }
    });
  }, []);

  const handleEnable = async () => {
    const result = await requestNotificationPermission();
    setStatus(result);
    router.push("/(onboarding)/starter");
  };

  const handleSkip = () => {
    router.push("/(onboarding)/starter");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: spacing[24],
          paddingTop: spacing[16],
          justifyContent: "space-between",
        }}
      >
        {/* Progress dots */}
        <Animated.View
          entering={FadeIn.duration(300)}
          style={{ flexDirection: "row", justifyContent: "center", gap: spacing[6] }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={{
                width: 22,
                height: 4,
                borderRadius: radii.sm,
                backgroundColor: i === 4 ? c.progressFill : c.borderStrong,
              }}
            />
          ))}
        </Animated.View>

        <View style={{ gap: spacing[24], marginTop: spacing[40], alignItems: "center" }}>
          {/* Mock notification card */}
          <Animated.View
            entering={FadeInDown.duration(500).delay(100)}
            style={{
              backgroundColor: isDark
                ? components.notificationCard.dark.bg
                : components.notificationCard.light.bg,
              borderRadius: components.notificationCard.radius,
              padding: components.notificationCard.padding,
              width: "100%",
              shadowColor: isDark ? "#000000" : "#14161A",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: isDark ? 0.5 : 0.1,
              shadowRadius: 24,
              elevation: 4,
            }}
          >
            <View style={{ flexDirection: "row", gap: spacing[12], alignItems: "center" }}>
              <View
                style={{
                  width: layout.notification.iconSize,
                  height: layout.notification.iconSize,
                  borderRadius: layout.notification.iconRadius,
                  backgroundColor: c.accent,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 18 }}>⏱</Text>
              </View>
              <View style={{ flex: 1, gap: spacing[3] }}>
                <Text
                  style={{
                    fontFamily: "JetBrains Mono",
                    fontSize: fontSizes.xs,
                    fontWeight: "700",
                    letterSpacing: 0.4,
                    color: c.textTertiary,
                  }}
                >
                  {t("onboarding.notifications.previewTitle")}
                </Text>
                <Text
                  style={{
                    fontFamily: "Manrope",
                    fontSize: fontSizes.bodySm,
                    fontWeight: "700",
                    color: c.textPrimary,
                  }}
                >
                  {t("onboarding.notifications.previewHeadline")}
                </Text>
                <Text
                  style={{
                    fontFamily: "Manrope",
                    fontSize: fontSizes.caption,
                    fontWeight: "500",
                    color: c.textTertiary,
                    lineHeight: 19.6,
                  }}
                >
                  {t("onboarding.notifications.previewBody")}
                </Text>
              </View>
            </View>
          </Animated.View>

          <Animated.Text
            entering={FadeInDown.duration(400).delay(200)}
            style={{
              fontFamily: "Manrope",
              fontSize: fontSizes.h2,
              fontWeight: "800",
              letterSpacing: -0.8,
              color: c.textPrimary,
              textAlign: "center",
            }}
          >
            {t("onboarding.notifications.headline")}
          </Animated.Text>

          <Animated.Text
            entering={FadeInDown.duration(400).delay(250)}
            style={{
              fontFamily: "Manrope",
              fontSize: fontSizes.body,
              fontWeight: "500",
              lineHeight: 24.8,
              color: c.textTertiary,
              textAlign: "center",
            }}
          >
            {t("onboarding.notifications.body")}
          </Animated.Text>
        </View>

        {/* CTAs */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(300)}
          style={{ gap: spacing[18], marginBottom: spacing[12] }}
        >
          <PressableScale
            onPress={handleEnable}
            style={{
              height: components.primaryButton.height,
              borderRadius: components.primaryButton.radius,
              backgroundColor: c.accent,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: c.accent,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.32,
              shadowRadius: 18,
              elevation: 8,
            }}
          >
            <Text
              style={{
                fontFamily: components.primaryButton.font.family,
                fontSize: components.primaryButton.font.size,
                fontWeight: components.primaryButton.font.weight,
                color: c.textOnAccent,
              }}
            >
              {status === "granted"
                ? t("onboarding.notifications.enabled")
                : t("onboarding.notifications.cta")}
            </Text>
          </PressableScale>
          <Text
            style={{
              fontFamily: "Manrope",
              fontSize: fontSizes.micro,
              fontWeight: "500",
              color: c.textMuted,
              textAlign: "center",
            }}
            onPress={handleSkip}
          >
            Skip for now
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
