import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  requestNotificationPermission,
  NotificationPermissionStatus,
} from "@/lib/notifications";

export default function NotificationsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [status, setStatus] = useState<NotificationPermissionStatus>("undetermined");

  const handleEnable = async () => {
    const result = await requestNotificationPermission();
    setStatus(result);
    router.push("/(onboarding)/starter");
  };

  const handleSkip = () => {
    router.push("/(onboarding)/starter");
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
                backgroundColor: i === 4 ? "#3B82F6" : "#DDE0E4",
              }}
            />
          ))}
        </Animated.View>

        <View style={{ gap: 24, marginTop: 40, alignItems: "center" }}>
          {/* Mock notification card */}
          <Animated.View
            entering={FadeInDown.duration(500).delay(100)}
            style={{
              backgroundColor: "#F5F6F7",
              borderRadius: 18,
              padding: 16,
              width: "100%",
              shadowColor: "#14161A",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.1,
              shadowRadius: 24,
              elevation: 4,
            }}
          >
            <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  backgroundColor: "#3B82F6",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 18 }}>⏱</Text>
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <Text
                  style={{
                    fontFamily: "JetBrains Mono",
                    fontSize: 12,
                    fontWeight: "700",
                    letterSpacing: 0.4,
                    color: "#6C7076",
                  }}
                >
                  {t("onboarding.notifications.previewTitle")}
                </Text>
                <Text
                  style={{
                    fontFamily: "Manrope",
                    fontSize: 15,
                    fontWeight: "700",
                    color: "#17181A",
                  }}
                >
                  {t("onboarding.notifications.previewHeadline")}
                </Text>
                <Text
                  style={{
                    fontFamily: "Manrope",
                    fontSize: 14,
                    fontWeight: "500",
                    color: "#6C7076",
                    lineHeight: 19.6,
                  }}
                >
                  {t("onboarding.notifications.previewBody")}
                </Text>
              </View>
            </View>
          </Animated.View>

          <Animated.Text
            entering={FadeInDown.duration(400).delay(200)}
            style={{
              fontFamily: "Manrope",
              fontSize: 26,
              fontWeight: "800",
              letterSpacing: -0.8,
              color: "#17181A",
              textAlign: "center",
            }}
          >
            {t("onboarding.notifications.headline")}
          </Animated.Text>

          <Animated.Text
            entering={FadeInDown.duration(400).delay(250)}
            style={{
              fontFamily: "Manrope",
              fontSize: 16,
              fontWeight: "500",
              lineHeight: 24.8,
              color: "#6C7076",
              textAlign: "center",
            }}
          >
            {t("onboarding.notifications.body")}
          </Animated.Text>
        </View>

        {/* CTAs */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(300)}
          style={{ gap: 18, marginBottom: 12 }}
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
              onPress={handleEnable}
            >
              {status === "granted"
                ? t("onboarding.notifications.enabled")
                : t("onboarding.notifications.cta")}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: "Manrope",
              fontSize: 13,
              fontWeight: "500",
              color: "#9DA1A7",
              textAlign: "center",
            }}
            onPress={handleSkip}
          >
            Skip for now
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
