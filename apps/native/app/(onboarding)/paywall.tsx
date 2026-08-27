import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

const FEATURES = ["alerts", "widgets", "sounds"] as const;

export default function PaywallScreen() {
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
        <View style={{ flexDirection: "row", justifyContent: "center", gap: 6 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={{
                width: 22,
                height: 4,
                borderRadius: 2,
                backgroundColor: i === 3 ? "#3B82F6" : "#DDE0E4",
              }}
            />
          ))}
        </View>

        <View style={{ gap: 24, marginTop: 40 }}>
          {/* Social proof */}
          <Text
            style={{
              fontFamily: "Manrope",
              fontSize: 13,
              fontWeight: "500",
              color: "#9DA1A7",
              textAlign: "center",
            }}
          >
            {t("onboarding.paywall.socialProof")}
          </Text>

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
            Everything you need,{"\n"}nothing you don't.
          </Text>

          {/* Feature checklist */}
          <View style={{ gap: 14 }}>
            {FEATURES.map((f) => (
              <View
                key={f}
                style={{ flexDirection: "row", alignItems: "center", gap: 14 }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 50,
                    backgroundColor: "#F0F6FF",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Manrope",
                      fontSize: 11,
                      fontWeight: "700",
                      color: "#3B82F6",
                    }}
                  >
                    ✓
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: "Manrope",
                    fontSize: 16,
                    fontWeight: "500",
                    color: "#17181A",
                    flex: 1,
                  }}
                >
                  {t(`onboarding.paywall.features.${f}`)}
                </Text>
              </View>
            ))}
          </View>

          {/* Price card */}
          <View
            style={{
              backgroundColor: "#F5F6F7",
              borderLeftWidth: 3,
              borderLeftColor: "#3B82F6",
              borderRadius: 12,
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: 34,
                  fontWeight: "700",
                  letterSpacing: -1.5,
                  color: "#17181A",
                }}
              >
                {t("onboarding.paywall.price")}
              </Text>
              <Text
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: 15,
                  fontWeight: "500",
                  color: "#9DA1A7",
                  textDecorationLine: "line-through",
                }}
              >
                {t("onboarding.paywall.originalPrice")}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "#17181A",
                borderRadius: 6,
                paddingHorizontal: 9,
                paddingVertical: 5,
              }}
            >
              <Text
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: 10,
                  fontWeight: "700",
                  letterSpacing: 1.2,
                  color: "#FFFFFF",
                }}
              >
                LIFETIME
              </Text>
            </View>
          </View>

          <Text
            style={{
              fontFamily: "Manrope",
              fontSize: 13,
              fontWeight: "500",
              color: "#9DA1A7",
              textAlign: "center",
            }}
          >
            {t("onboarding.paywall.period")}
          </Text>
        </View>

        {/* CTAs */}
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
              onPress={() => router.push("/(onboarding)/notifications")}
            >
              {t("onboarding.paywall.cta")}
            </Text>
          </View>
          <Pressable onPress={() => router.push("/(onboarding)/notifications")}>
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: 13,
                fontWeight: "500",
                color: "#9DA1A7",
                textAlign: "center",
              }}
            >
              {t("onboarding.paywall.skip")}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
