import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OutcomeHookScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 28,
          paddingTop: 56,
          justifyContent: "space-between",
        }}
      >
        <View style={{ gap: 16 }}>
          <Text
            style={{
              fontFamily: "Manrope",
              fontSize: 30,
              fontWeight: "800",
              letterSpacing: -1,
              lineHeight: 36,
              color: "#17181A",
            }}
          >
            {t("onboarding.outcomeHook.headline")}
          </Text>
          <Text
            style={{
              fontFamily: "Manrope",
              fontSize: 16,
              fontWeight: "500",
              lineHeight: 24.8,
              color: "#6C7076",
            }}
          >
            {t("onboarding.outcomeHook.subtitle")}
          </Text>
        </View>

        <View style={{ gap: 18, marginBottom: 12 }}>
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
              onPress={() => router.push("/(onboarding)/quiz")}
            >
              {t("onboarding.outcomeHook.cta")}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: "Manrope",
              fontSize: 12,
              fontWeight: "500",
              color: "#9DA1A7",
              textAlign: "center",
            }}
          >
            {t("onboarding.outcomeHook.footer")}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
