import { View, Text } from "react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/contexts/app-theme-context";
import { colors, components, fontSizes, spacing, radii, shadows } from "@/lib/tokens";

export default function OutcomeHookScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isDark } = useAppTheme();
  const c = isDark ? colors.dark : colors.light;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: spacing[28],
          paddingTop: spacing[56],
          justifyContent: "space-between",
        }}
      >
        <Animated.View entering={FadeInDown.duration(500)} style={{ gap: spacing[16] }}>
          <Ionicons name="checkmark-circle" size={80} color={c.accent} />
          <Text
            style={{
              fontFamily: "Manrope",
              fontSize: fontSizes.h1,
              fontWeight: "800",
              letterSpacing: -1,
              lineHeight: 36,
              color: c.textPrimary,
            }}
          >
            {t("onboarding.outcomeHook.headline")}
          </Text>
          <Text
            style={{
              fontFamily: "Manrope",
              fontSize: fontSizes.body,
              fontWeight: "500",
              lineHeight: 24.8,
              color: c.textTertiary,
            }}
          >
            {t("onboarding.outcomeHook.subtitle")}
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(500).delay(200)}
          style={{ gap: spacing[18], marginBottom: spacing[12] }}
        >
          <View
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
              onPress={() => router.push("/(onboarding)/quiz")}
            >
              {t("onboarding.outcomeHook.cta")}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: "Manrope",
              fontSize: fontSizes.xs,
              fontWeight: "500",
              color: c.textMuted,
              textAlign: "center",
            }}
          >
            {t("onboarding.outcomeHook.footer")}
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
