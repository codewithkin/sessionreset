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
import { useAppTheme } from "@/contexts/app-theme-context";
import { colors, components, fontSizes, spacing, radii, shadows } from "@/lib/tokens";

const FEATURES = ["alerts", "widgets", "sounds"] as const;

export default function PaywallScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isDark } = useAppTheme();
  const c = isDark ? colors.dark : colors.light;
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
                backgroundColor: i === 3 ? c.progressFill : c.borderStrong,
              }}
            />
          ))}
        </Animated.View>

        <View style={{ gap: spacing[24], marginTop: spacing[40] }}>
          {/* Social proof */}
          <Animated.Text
            entering={FadeInDown.duration(400).delay(100)}
            style={{
              fontFamily: "Manrope",
              fontSize: fontSizes.micro,
              fontWeight: "500",
              color: c.textMuted,
              textAlign: "center",
            }}
          >
            {t("onboarding.paywall.socialProof")}
          </Animated.Text>

          <Animated.Text
            entering={FadeInDown.duration(400).delay(150)}
            style={{
              fontFamily: "Manrope",
              fontSize: fontSizes.h2,
              fontWeight: "800",
              letterSpacing: -0.8,
              color: c.textPrimary,
              textAlign: "center",
            }}
          >
            Everything you need,{"\n"}nothing you don't.
          </Animated.Text>

          {/* Feature checklist */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(200)}
            style={{ gap: components.checklistItem.gap }}
          >
            {FEATURES.map((f) => (
              <View
                key={f}
                style={{ flexDirection: "row", alignItems: "center", gap: components.checklistItem.gap }}
              >
                <View
                  style={{
                    width: components.checklistItem.circleSize,
                    height: components.checklistItem.circleSize,
                    borderRadius: 50,
                    backgroundColor: isDark
                      ? components.checklistItem.dark.circleBg
                      : components.checklistItem.light.circleBg,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: components.checklistItem.font.family,
                      fontSize: components.checklistItem.font.size,
                      fontWeight: components.checklistItem.font.weight,
                      color: isDark
                        ? components.checklistItem.dark.circleText
                        : components.checklistItem.light.circleText,
                    }}
                  >
                    ✓
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: components.checklistItem.labelFont.family,
                    fontSize: components.checklistItem.labelFont.size,
                    fontWeight: components.checklistItem.labelFont.weight,
                    lineHeight: 23.2,
                    color: c.textPrimary,
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
              backgroundColor: isDark ? components.priceCard.dark.bg : components.priceCard.light.bg,
              borderLeftWidth: components.priceCard.leftBorderWidth,
              borderLeftColor: isDark ? components.priceCard.dark.border : components.priceCard.light.border,
              borderRadius: components.priceCard.radius,
              padding: components.priceCard.padding,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: components.priceCard.priceFont.family,
                  fontSize: components.priceCard.priceFont.size,
                  fontWeight: components.priceCard.priceFont.weight,
                  letterSpacing: components.priceCard.priceLetterSpacing,
                  color: c.textPrimary,
                }}
              >
                {price}
              </Text>
              <Text
                style={{
                  fontFamily: components.priceCard.strikethroughFont.family,
                  fontSize: components.priceCard.strikethroughFont.size,
                  fontWeight: components.priceCard.strikethroughFont.weight,
                  color: c.textMuted,
                  textDecorationLine: "line-through",
                }}
              >
                {t("onboarding.paywall.originalPrice")}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: c.textPrimary,
                borderRadius: radii.badge,
                paddingHorizontal: spacing[8],
                paddingVertical: spacing[5],
              }}
            >
              <Text
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: fontSizes.tiny,
                  fontWeight: "700",
                  letterSpacing: 1.2,
                  color: c.bg,
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
              fontSize: fontSizes.micro,
              fontWeight: "500",
              color: c.textMuted,
              textAlign: "center",
            }}
          >
            {t("onboarding.paywall.period")}
          </Animated.Text>
        </View>

        {/* CTAs */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(400)}
          style={{ gap: spacing[18], marginBottom: spacing[12] }}
        >
          <Pressable
            onPress={handlePurchase}
            style={{
              height: components.primaryButton.height,
              borderRadius: components.primaryButton.radius,
              backgroundColor: purchasing ? c.textMuted : c.accent,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: c.accent,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: purchasing ? 0 : 0.32,
              shadowRadius: 18,
              elevation: purchasing ? 0 : 8,
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
              {purchasing ? "Processing..." : t("onboarding.paywall.cta")}
            </Text>
          </Pressable>
          <Pressable onPress={() => router.push("/(onboarding)/notifications")}>
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: fontSizes.micro,
                fontWeight: "500",
                color: c.textMuted,
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
