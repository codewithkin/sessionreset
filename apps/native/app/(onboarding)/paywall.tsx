import { useState, useEffect } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  purchaseLifetimePro,
  getOfferings,
  initializePurchases,
} from "@/lib/purchases";

const FEATURES = ["alerts", "widgets", "sounds"] as const;

export default function PaywallScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [purchasing, setPurchasing] = useState(false);
  const [price, setPrice] = useState("$1.99");

  useEffect(() => {
    initializePurchases().then(async () => {
      const pkg = await getOfferings();
      if (pkg?.product.priceString) {
        setPrice(pkg.product.priceString);
      }
    });
  }, []);

  const handlePurchase = async () => {
    if (purchasing) return;
    setPurchasing(true);
    try {
      const success = await purchaseLifetimePro();
      if (success) {
        router.replace("/(drawer)");
      } else {
        Alert.alert("Purchase cancelled", "You were not charged.");
      }
    } catch {
      Alert.alert("Purchase failed", "Please try again later.");
    } finally {
      setPurchasing(false);
    }
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
                backgroundColor: i === 3 ? "#3B82F6" : "#DDE0E4",
              }}
            />
          ))}
        </Animated.View>

        <View style={{ gap: 24, marginTop: 40 }}>
          {/* Social proof */}
          <Animated.Text
            entering={FadeInDown.duration(400).delay(100)}
            style={{
              fontFamily: "Manrope",
              fontSize: 13,
              fontWeight: "500",
              color: "#9DA1A7",
              textAlign: "center",
            }}
          >
            {t("onboarding.paywall.socialProof")}
          </Animated.Text>

          <Animated.Text
            entering={FadeInDown.duration(400).delay(150)}
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
          </Animated.Text>

          {/* Feature checklist */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(200)}
            style={{ gap: 14 }}
          >
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
          </Animated.View>

          {/* Price card */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(300)}
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
                {price}
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
          </Animated.View>

          <Animated.Text
            entering={FadeInDown.duration(400).delay(350)}
            style={{
              fontFamily: "Manrope",
              fontSize: 13,
              fontWeight: "500",
              color: "#9DA1A7",
              textAlign: "center",
            }}
          >
            {t("onboarding.paywall.period")}
          </Animated.Text>
        </View>

        {/* CTAs */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(400)}
          style={{ gap: 18, marginBottom: 12 }}
        >
          <Pressable
            onPress={handlePurchase}
            style={{
              height: 56,
              borderRadius: 16,
              backgroundColor: purchasing ? "#9DA1A7" : "#3B82F6",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#3B82F6",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: purchasing ? 0 : 0.32,
              shadowRadius: 18,
              elevation: purchasing ? 0 : 8,
            }}
          >
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: 16,
                fontWeight: "700",
                color: "#FFFFFF",
              }}
            >
              {purchasing ? "Processing..." : t("onboarding.paywall.cta")}
            </Text>
          </Pressable>
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
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
