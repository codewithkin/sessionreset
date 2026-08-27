import { View, Text, Pressable } from "react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { storage } from "@/lib/storage";
import { createTimer } from "@/lib/timer-engine";
import { scheduleTimerNotifications } from "@/lib/notifications";
import { useAppTheme } from "@/contexts/app-theme-context";
import { colors, components, fontSizes, spacing, radii, shadows } from "@/lib/tokens";

export default function StarterScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isDark } = useAppTheme();
  const c = isDark ? colors.dark : colors.light;

  const handleFinish = () => {
    storage.onboarding.markComplete();
    router.replace("/(drawer)");
  };

  const handleDemoTimer = async () => {
    const timer = createTimer("claude", Date.now(), true);
    storage.timers.add(timer);
    await scheduleTimerNotifications(timer);
    storage.onboarding.markComplete();
    router.replace("/(drawer)");
  };

  const handleBlocked = async () => {
    const timer = createTimer("claude", Date.now(), true);
    storage.timers.add(timer);
    await scheduleTimerNotifications(timer);
    storage.onboarding.markComplete();
    router.replace("/(drawer)");
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
        {/* Progress dots — all complete */}
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
                backgroundColor: c.progressFill,
              }}
            />
          ))}
        </Animated.View>

        <View style={{ gap: spacing[24], marginTop: spacing[40], alignItems: "center" }}>
          {/* Checkmark circle */}
          <Animated.View
            entering={FadeInDown.duration(500).delay(100)}
            style={{
              width: 76,
              height: 76,
              borderRadius: 50,
              backgroundColor: isDark
                ? components.quizCard.dark.activeBg
                : components.quizCard.light.activeBg,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="checkmark-done-circle" size={76} color={c.accent} />
          </Animated.View>

          <Animated.Text
            entering={FadeInDown.duration(400).delay(200)}
            style={{
              fontFamily: "Manrope",
              fontSize: fontSizes.h1,
              fontWeight: "800",
              letterSpacing: -1,
              lineHeight: 36,
              color: c.textPrimary,
              textAlign: "center",
            }}
          >
            {t("onboarding.starter.headline")}
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
            {t("onboarding.starter.subtext")}
          </Animated.Text>
        </View>

        {/* CTAs */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(300)}
          style={{ gap: spacing[12], marginBottom: spacing[12] }}
        >
          <Pressable
            onPress={handleBlocked}
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
              {t("onboarding.starter.blocked")}
            </Text>
          </Pressable>
          <Pressable
            onPress={handleDemoTimer}
            style={{
              height: components.secondaryButton.height,
              borderRadius: components.secondaryButton.radius,
              borderWidth: components.secondaryButton.borderWidth,
              borderColor: isDark
                ? components.secondaryButton.dark.border
                : components.secondaryButton.light.border,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: components.secondaryButton.font.family,
                fontSize: components.secondaryButton.font.size,
                fontWeight: components.secondaryButton.font.weight,
                color: isDark
                  ? components.secondaryButton.dark.text
                  : components.secondaryButton.light.text,
              }}
            >
              {t("onboarding.starter.demo")}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
