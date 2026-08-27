import { View, Text } from "react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/contexts/app-theme-context";
import { colors, components, fontSizes, spacing, radii, shadows } from "@/lib/tokens";
import { PressableScale } from "@/components/PressableScale";

export default function FounderNoteScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isDark } = useAppTheme();
  const c = isDark ? colors.dark : colors.light;

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
                backgroundColor: i === 2 ? c.progressFill : c.borderStrong,
              }}
            />
          ))}
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(300).delay(100)}
          style={{ alignItems: "center", gap: spacing[24], marginTop: spacing[40] }}
        >
          {/* Clock icon */}
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: radii.xl,
              backgroundColor: isDark ? components.founderCard.dark.bg : components.founderCard.light.bg,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="time-outline" size={48} color={c.textTertiary} />
          </View>

          <Text
            style={{
              fontFamily: "Manrope",
              fontSize: fontSizes.h2,
              fontWeight: "800",
              letterSpacing: -0.8,
              color: c.textPrimary,
              textAlign: "center",
            }}
          >
            {t("onboarding.founderNote.title")}
          </Text>

          {/* Quote card */}
          <View
            style={{
              backgroundColor: isDark ? components.founderCard.dark.bg : components.founderCard.light.bg,
              borderRadius: components.founderCard.radius,
              padding: components.founderCard.padding,
            }}
          >
            <Text
              style={{
                fontFamily: components.founderCard.font.family,
                fontSize: components.founderCard.font.size,
                fontWeight: components.founderCard.font.weight,
                lineHeight: 26.4,
                color: c.textSecondary,
              }}
            >
              {t("onboarding.founderNote.body")}
            </Text>
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: fontSizes.caption,
                fontWeight: "700",
                color: c.textTertiary,
                textAlign: "right",
                marginTop: spacing[16],
              }}
            >
              — The SessionReset Team
            </Text>
          </View>
        </Animated.View>

        {/* CTA */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(300)}
          style={{ marginBottom: spacing[12] }}
        >
          <PressableScale
            onPress={() => router.push("/(onboarding)/paywall")}
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
              {t("onboarding.founderNote.cta")}
            </Text>
          </PressableScale>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
