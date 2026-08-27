import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  Platform as RNPlatform,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { storage } from "@/lib/storage";
import { restorePurchases } from "@/lib/purchases";

export default function SettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState(() => storage.settings.get());
  const [restoring, setRestoring] = useState(false);

  const handleExport = async () => {
    const timers = storage.timers.get();
    const logs = storage.usageLog.get();
    const data = JSON.stringify(
      { timers, usageLog: logs, exportedAt: new Date().toISOString() },
      null,
      2
    );

    if (RNPlatform.OS === "ios") {
      const { Share } = require("react-native");
      await Share.share({ message: data, title: "SessionReset Data Export" });
    } else {
      // Android: copy to clipboard
      const { Clipboard } = require("react-native");
      Clipboard.setString(data);
      Alert.alert("Exported", "Data copied to clipboard.");
    }
  };

  const handleRestore = async () => {
    if (restoring) return;
    setRestoring(true);
    try {
      const success = await restorePurchases();
      if (success) {
        const updated = storage.settings.get();
        setSettings(updated);
        Alert.alert("Restored", "Your Pro purchase has been restored.");
      } else {
        Alert.alert("No purchases found", "No previous Pro purchase was found.");
      }
    } catch {
      Alert.alert("Error", "Could not restore purchases.");
    } finally {
      setRestoring(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: 56,
          paddingBottom: 18,
        }}
      >
        <Text
          style={{
            fontFamily: "Manrope",
            fontSize: 17,
            fontWeight: "700",
            color: "#17181A",
          }}
        >
          Settings
        </Text>
        <Pressable onPress={() => router.back()}>
          <Text
            style={{
              fontFamily: "Manrope",
              fontSize: 16,
              fontWeight: "500",
              color: "#3B82F6",
            }}
          >
            Done
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Pro upgrade / status */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
        {settings.isPro ? (
          <View
            style={{
              marginHorizontal: 20,
              backgroundColor: "#F5F6F7",
              borderLeftWidth: 3,
              borderLeftColor: "#10A37F",
              borderRadius: 14,
              padding: 18,
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: 15,
                fontWeight: "700",
                color: "#10A37F",
              }}
            >
              You're Pro
            </Text>
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: 13,
                fontWeight: "500",
                color: "#6C7076",
                marginTop: 4,
              }}
            >
              All features unlocked, ads removed.
            </Text>
          </View>
        ) : (
          <Pressable
            onPress={() => router.push("/(onboarding)/paywall")}
            style={{
              marginHorizontal: 20,
              backgroundColor: "#F5F6F7",
              borderLeftWidth: 3,
              borderLeftColor: "#3B82F6",
              borderRadius: 14,
              padding: 18,
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: 15,
                fontWeight: "700",
                color: "#3B82F6",
              }}
            >
              Unlock Pro
            </Text>
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: 13,
                fontWeight: "500",
                color: "#6C7076",
                marginTop: 4,
              }}
            >
              Remove Ads & Unlock Widgets — $1.99
            </Text>
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: 12,
                fontWeight: "500",
                color: "#9DA1A7",
                marginTop: 2,
              }}
            >
              Lifetime Access • Launch Price
            </Text>
          </Pressable>
        )}
        </Animated.View>

        {/* POWER FEATURES section — disabled for now */}
        {/* Will re-enable when ads/IAP go live */}

        {/* DATA section */}
        <Animated.View entering={FadeInDown.duration(400).delay(300)} style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 11,
              fontWeight: "700",
              letterSpacing: 1.4,
              color: "#9DA1A7",
              paddingHorizontal: 20,
              marginBottom: 10,
            }}
          >
            DATA
          </Text>
          <View
            style={{
              marginHorizontal: 20,
              backgroundColor: "#F5F6F7",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <Pressable
              onPress={handleExport}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 18,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#EDEEF0",
              }}
            >
              <Text
                style={{
                  fontFamily: "Manrope",
                  fontSize: 15,
                  fontWeight: "600",
                  color: "#17181A",
                }}
              >
                Export Timer History
              </Text>
              <Text style={{ color: "#C9CBCF", fontSize: 14 }}>›</Text>
            </Pressable>
            <Pressable
              onPress={handleRestore}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 18,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Manrope",
                  fontSize: 15,
                  fontWeight: "600",
                  color: restoring ? "#9DA1A7" : "#17181A",
                }}
              >
                {restoring ? "Restoring..." : "Restore Purchases"}
              </Text>
              <Text style={{ color: "#C9CBCF", fontSize: 14 }}>›</Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* ABOUT section */}
        <Animated.View entering={FadeInDown.duration(400).delay(400)} style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 11,
              fontWeight: "700",
              letterSpacing: 1.4,
              color: "#9DA1A7",
              paddingHorizontal: 20,
              marginBottom: 10,
            }}
          >
            ABOUT
          </Text>
          <View
            style={{
              marginHorizontal: 20,
              backgroundColor: "#F5F6F7",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                paddingVertical: 16,
                paddingHorizontal: 18,
                borderBottomWidth: 1,
                borderBottomColor: "#EDEEF0",
              }}
            >
              <Text
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: 12,
                  fontWeight: "500",
                  color: "#C9CBCF",
                }}
              >
                SessionReset v1.0.0
              </Text>
            </View>
            <Pressable
              style={{
                paddingVertical: 16,
                paddingHorizontal: 18,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Manrope",
                  fontSize: 15,
                  fontWeight: "600",
                  color: "#17181A",
                }}
              >
                Contact / Feedback
              </Text>
              <Text style={{ color: "#C9CBCF", fontSize: 14 }}>›</Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
