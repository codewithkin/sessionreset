import { useState } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/contexts/app-theme-context";
import { colors, components, fontSizes, spacing, radii, shadows } from "@/lib/tokens";
import { PressableScale } from "@/components/PressableScale";

const SERVICES = ["claude", "codex", "claudeCode", "cursor"] as const;
const FREQUENCIES = ["low", "medium", "high"] as const;

export default function QuizScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isDark } = useAppTheme();
  const c = isDark ? colors.dark : colors.light;
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedFreq, setSelectedFreq] = useState<string | null>(null);

  const canContinue = selectedServices.length > 0;

  const toggleService = (s: string) => {
    setSelectedServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
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
                width: layout.progressDot.width,
                height: layout.progressDot.height,
                borderRadius: radii.sm,
                backgroundColor: i === 1 ? c.progressFill : c.borderStrong,
              }}
            />
          ))}
        </Animated.View>

        <View style={{ gap: spacing[22], marginTop: spacing[40] }}>
          {/* Question 1 */}
          <Animated.View entering={FadeInDown.duration(400).delay(100)}>
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: fontSizes.h4,
                fontWeight: "800",
                lineHeight: 27.3,
                letterSpacing: -0.4,
                color: c.textPrimary,
              }}
            >
              {t("onboarding.quiz.question1")}
            </Text>
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: fontSizes.micro,
                fontWeight: "500",
                color: c.textMuted,
                marginTop: spacing[6],
              }}
            >
              Pick all that apply
            </Text>
          </Animated.View>

          {/* Service grid */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(200)}
            style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing[10] }}
          >
            {SERVICES.map((s) => {
              const active = selectedServices.includes(s);
              return (
                <PressableScale
                  key={s}
                  onPress={() => toggleService(s)}
                  style={{
                    width: "47%",
                    borderWidth: 2,
                    borderColor: active
                      ? components.quizCard.light.activeBorder
                      : components.quizCard.light.inactiveBorder,
                    backgroundColor: active
                      ? (isDark ? components.quizCard.dark.activeBg : components.quizCard.light.activeBg)
                      : "transparent",
                    borderRadius: components.quizCard.radius,
                    padding: components.quizCard.padding,
                    minHeight: components.quizCard.minHeight,
                    gap: spacing[10],
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: components.quizCard.serviceDotSize,
                        height: components.quizCard.serviceDotSize,
                        borderRadius: 50,
                        backgroundColor:
                          s === "claude"
                            ? c.claude
                            : s === "codex"
                              ? c.codex
                              : s === "claudeCode"
                                ? c.claude
                                : c.textMuted,
                      }}
                    />
                    {active ? (
                      <View
                        style={{
                          width: components.quizCard.checkboxSize,
                          height: components.quizCard.checkboxSize,
                          borderRadius: 50,
                          backgroundColor: c.accent,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Manrope",
                            fontSize: fontSizes.tiny,
                            fontWeight: "700",
                            color: c.textOnAccent,
                          }}
                        >
                          ✓
                        </Text>
                      </View>
                    ) : (
                      <View
                        style={{
                          width: components.quizCard.checkboxSize,
                          height: components.quizCard.checkboxSize,
                          borderRadius: 50,
                          borderWidth: 2,
                          borderColor: c.borderStrong,
                        }}
                      />
                    )}
                  </View>
                  <Text
                    style={{
                      fontFamily: "Manrope",
                      fontSize: fontSizes.caption,
                      fontWeight: "700",
                      lineHeight: 18.2,
                      color: active ? c.textPrimary : c.textSecondary,
                    }}
                  >
                    {t(`onboarding.quiz.options.${s}`)}
                  </Text>
                </PressableScale>
              );
            })}
          </Animated.View>

          {/* Question 2 */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(300)}
            style={{ marginTop: spacing[12] }}
          >
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: fontSizes.h4,
                fontWeight: "800",
                lineHeight: 27.3,
                letterSpacing: -0.4,
                color: c.textPrimary,
              }}
            >
              {t("onboarding.quiz.question2")}
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(400).delay(400)}
            style={{ flexDirection: "row", gap: spacing[8] }}
          >
            {FREQUENCIES.map((f) => {
              const active = selectedFreq === f;
              return (
                <PressableScale
                  key={f}
                  onPress={() => setSelectedFreq(f)}
                  style={{
                    flex: 1,
                    borderWidth: 2,
                    borderColor: active
                      ? components.quizCard.light.activeBorder
                      : components.quizCard.light.inactiveBorder,
                    backgroundColor: active
                      ? (isDark ? components.quizCard.dark.activeBg : components.quizCard.light.activeBg)
                      : "transparent",
                    borderRadius: components.quizCard.radius,
                    paddingVertical: components.quizCard.padding,
                    paddingHorizontal: spacing[8],
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Manrope",
                      fontSize: fontSizes.micro,
                      fontWeight: "700",
                      color: active ? c.textPrimary : c.textSecondary,
                    }}
                  >
                    {t(`onboarding.quiz.options.${f}`)}
                  </Text>
                </PressableScale>
              );
            })}
          </Animated.View>
        </View>

        {/* CTA */}
        <Animated.View entering={FadeIn.duration(400).delay(500)} style={{ marginBottom: spacing[12] }}>
          <PressableScale
            onPress={() => {
              if (canContinue) router.push("/(onboarding)/founder-note");
            }}
            style={{
              height: components.primaryButton.height,
              borderRadius: components.primaryButton.radius,
              backgroundColor: canContinue ? c.accent : c.borderStrong,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: components.primaryButton.font.family,
                fontSize: components.primaryButton.font.size,
                fontWeight: components.primaryButton.font.weight,
                color: canContinue ? c.textOnAccent : c.textMuted,
              }}
            >
              {t("onboarding.quiz.cta")}
            </Text>
          </PressableScale>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const layout = {
  progressDot: {
    width: 22,
    height: 4,
  },
};
