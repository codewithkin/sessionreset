import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { storage } from "@/lib/storage";
import { createTimer } from "@/lib/timer-engine";
import { scheduleTimerNotifications } from "@/lib/notifications";

export default function StarterScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleFinish = () => {
    storage.onboarding.markComplete();
    router.replace("/(drawer)");
  };

  const handleDemoTimer = async () => {
    // Create a real demo timer for Claude
    const timer = createTimer("claude", Date.now(), true);
    storage.timers.add(timer);
    await scheduleTimerNotifications(timer);
    storage.onboarding.markComplete();
    router.replace("/(drawer)");
  };

  const handleBlocked = async () => {
    // Create a real timer immediately (as if limit was just hit)
    const timer = createTimer("claude", Date.now(), true);
    storage.timers.add(timer);
    await scheduleTimerNotifications(timer);
    storage.onboarding.markComplete();
    router.replace("/(drawer)");
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
        {/* Progress dots — all complete */}
        <View style={{ flexDirection: "row", justifyContent: "center", gap: 6 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={{
                width: 22,
                height: 4,
                borderRadius: 2,
                backgroundColor: "#3B82F6",
              }}
            />
          ))}
        </View>

        <View style={{ gap: 24, marginTop: 40, alignItems: "center" }}>
          {/* Checkmark circle */}
          <View
            style={{
              width: 76,
              height: 76,
              borderRadius: 50,
              backgroundColor: "#F0F6FF",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 32,
                color: "#3B82F6",
              }}
            >
              ✓
            </Text>
          </View>

          <Text
            style={{
              fontFamily: "Manrope",
              fontSize: 30,
              fontWeight: "800",
              letterSpacing: -1,
              lineHeight: 36,
              color: "#17181A",
              textAlign: "center",
            }}
          >
            {t("onboarding.starter.headline")}
          </Text>

          <Text
            style={{
              fontFamily: "Manrope",
              fontSize: 16,
              fontWeight: "500",
              lineHeight: 24.8,
              color: "#6C7076",
              textAlign: "center",
            }}
          >
            {t("onboarding.starter.subtext")}
          </Text>
        </View>

        {/* CTAs */}
        <View style={{ gap: 12, marginBottom: 12 }}>
          <Pressable
            onPress={handleBlocked}
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
            >
              {t("onboarding.starter.blocked")}
            </Text>
          </Pressable>
          <Pressable
            onPress={handleDemoTimer}
            style={{
              height: 56,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: "#DDE0E4",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: 16,
                fontWeight: "700",
                color: "#17181A",
              }}
            >
              {t("onboarding.starter.demo")}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
