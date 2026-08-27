import { useState } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

const SERVICES = ["claude", "codex", "claudeCode", "cursor"] as const;
const FREQUENCIES = ["low", "medium", "high"] as const;

export default function QuizScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedFreq, setSelectedFreq] = useState<string | null>(null);

  const canContinue = selectedServices.length > 0;

  const toggleService = (s: string) => {
    setSelectedServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          paddingTop: 16,
          justifyContent: "space-between",
        }}
      >
        {/* Progress dots */}
        <View style={{ flexDirection: "row", justifyContent: "center", gap: 6 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={{
                width: 22,
                height: 4,
                borderRadius: 2,
                backgroundColor: i === 1 ? "#3B82F6" : "#DDE0E4",
              }}
            />
          ))}
        </View>

        <View style={{ gap: 22, marginTop: 40 }}>
          {/* Question 1 */}
          <View>
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: 21,
                fontWeight: "800",
                lineHeight: 27.3,
                letterSpacing: -0.4,
                color: "#17181A",
              }}
            >
              {t("onboarding.quiz.question1")}
            </Text>
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: 13,
                fontWeight: "500",
                color: "#9DA1A7",
                marginTop: 6,
              }}
            >
              Pick all that apply
            </Text>
          </View>

          {/* Service grid */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {SERVICES.map((s) => {
              const active = selectedServices.includes(s);
              return (
                <Pressable
                  key={s}
                  onPress={() => toggleService(s)}
                  style={{
                    width: "47%",
                    borderWidth: 2,
                    borderColor: active ? "#3B82F6" : "#E6E7EA",
                    backgroundColor: active ? "#F0F6FF" : "transparent",
                    borderRadius: 14,
                    padding: 14,
                    minHeight: 92,
                    gap: 10,
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
                        width: 9,
                        height: 9,
                        borderRadius: 50,
                        backgroundColor:
                          s === "claude"
                            ? "#CC785C"
                            : s === "codex"
                              ? "#10A37F"
                              : s === "claudeCode"
                                ? "#CC785C"
                                : "#9DA1A7",
                      }}
                    />
                    {active ? (
                      <View
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 50,
                          backgroundColor: "#3B82F6",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Manrope",
                            fontSize: 11,
                            fontWeight: "700",
                            color: "#FFFFFF",
                          }}
                        >
                          ✓
                        </Text>
                      </View>
                    ) : (
                      <View
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 50,
                          borderWidth: 2,
                          borderColor: "#DDE0E4",
                        }}
                      />
                    )}
                  </View>
                  <Text
                    style={{
                      fontFamily: "Manrope",
                      fontSize: 14,
                      fontWeight: "700",
                      lineHeight: 18.2,
                      color: active ? "#17181A" : "#4A4E54",
                    }}
                  >
                    {t(`onboarding.quiz.options.${s}`)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Question 2 */}
          <View style={{ marginTop: 12 }}>
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: 21,
                fontWeight: "800",
                lineHeight: 27.3,
                letterSpacing: -0.4,
                color: "#17181A",
              }}
            >
              {t("onboarding.quiz.question2")}
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: 8 }}>
            {FREQUENCIES.map((f) => {
              const active = selectedFreq === f;
              return (
                <Pressable
                  key={f}
                  onPress={() => setSelectedFreq(f)}
                  style={{
                    flex: 1,
                    borderWidth: 2,
                    borderColor: active ? "#3B82F6" : "#E6E7EA",
                    backgroundColor: active ? "#F0F6FF" : "transparent",
                    borderRadius: 14,
                    paddingVertical: 14,
                    paddingHorizontal: 8,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Manrope",
                      fontSize: 13,
                      fontWeight: "700",
                      color: active ? "#17181A" : "#4A4E54",
                    }}
                  >
                    {t(`onboarding.quiz.options.${f}`)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* CTA */}
        <View style={{ marginBottom: 12 }}>
          <View
            style={{
              height: 56,
              borderRadius: 16,
              backgroundColor: canContinue ? "#3B82F6" : "#DDE0E4",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: 16,
                fontWeight: "700",
                color: canContinue ? "#FFFFFF" : "#9DA1A7",
              }}
              onPress={() => {
                if (canContinue) router.push("/(onboarding)/founder-note");
              }}
            >
              {t("onboarding.quiz.cta")}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
