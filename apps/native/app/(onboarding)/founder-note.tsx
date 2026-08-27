import { View, Text } from "react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FounderNoteScreen() {
  const router = useRouter();
  const { t } = useTranslation();

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
        <Animated.View
          entering={FadeIn.duration(300)}
          style={{ flexDirection: "row", justifyContent: "center", gap: 6 }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={{
                width: 22,
                height: 4,
                borderRadius: 2,
                backgroundColor: i === 2 ? "#3B82F6" : "#DDE0E4",
              }}
            />
          ))}
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(500).delay(100)}
          style={{ alignItems: "center", gap: 24, marginTop: 40 }}
        >
          {/* Clock doodle placeholder */}
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              backgroundColor: "#F5F6F7",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 32 }}>🕐</Text>
          </View>

          <Text
            style={{
              fontFamily: "Manrope",
              fontSize: 26,
              fontWeight: "800",
              letterSpacing: -0.8,
              color: "#17181A",
              textAlign: "center",
            }}
          >
            {t("onboarding.founderNote.title")}
          </Text>

          {/* Quote card */}
          <View
            style={{
              backgroundColor: "#F5F6F7",
              borderRadius: 16,
              padding: 28,
            }}
          >
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: 16,
                fontWeight: "500",
                lineHeight: 26.4,
                color: "#4A4E54",
              }}
            >
              {t("onboarding.founderNote.body")}
            </Text>
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: 14,
                fontWeight: "700",
                color: "#6C7076",
                textAlign: "right",
                marginTop: 16,
              }}
            >
              — The SessionReset Team
            </Text>
          </View>
        </Animated.View>

        {/* CTA */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(300)}
          style={{ marginBottom: 12 }}
        >
          <View
            style={{
              height: 56,
              borderRadius: 16,
              backgroundColor: "#3B82F6",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#3B82F6",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.32,
              shadowRadius: 18,
              elevation: 8,
            }}
          >
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: 16,
                fontWeight: "700",
                color: "#FFFFFF",
              }}
              onPress={() => router.push("/(onboarding)/paywall")}
            >
              {t("onboarding.founderNote.cta")}
            </Text>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
