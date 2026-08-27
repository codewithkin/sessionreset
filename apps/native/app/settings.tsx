import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  Platform as RNPlatform,
  Linking,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { storage } from "@/lib/storage";
import { restorePurchases } from "@/lib/purchases";
import { useAppTheme } from "@/contexts/app-theme-context";
import { colors, components, fontSizes, spacing, radii, shadows, letterSpacing } from "@/lib/tokens";
import { PressableScale } from "@/components/PressableScale";

export default function SettingsScreen() {
  const router = useRouter();
  const { isDark } = useAppTheme();
  const c = isDark ? colors.dark : colors.light;
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

  const handleTogglePreResetAlert = () => {
    const updated = { ...settings, preResetAlertEnabled: !settings.preResetAlertEnabled };
    storage.settings.set(updated);
    setSettings(updated);
  };

  const handleContact = () => {
    Linking.openURL("mailto:support@sessionreset.app?subject=SessionReset Feedback");
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: spacing[20],
          paddingTop: spacing[56],
          paddingBottom: spacing[18],
        }}
      >
        <PressableScale onPress={() => router.back()} style={{ padding: spacing[4] }}>
          <Ionicons name="close" size={24} color={c.textPrimary} />
        </PressableScale>
        <Text
          style={{
            fontFamily: "Manrope",
            fontSize: fontSizes.h5,
            fontWeight: "800",
            color: c.textPrimary,
          }}
        >
          Settings
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: spacing[40] }}>
        {/* Pro upgrade / status */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
        {settings.isPro ? (
          <View
            style={{
              marginHorizontal: spacing[20],
              backgroundColor: isDark ? components.upgradeCard.dark.bg : components.upgradeCard.light.bg,
              borderLeftWidth: components.upgradeCard.leftBorderWidth,
              borderLeftColor: c.success,
              borderRadius: components.upgradeCard.radius,
              padding: components.upgradeCard.padding,
              marginBottom: spacing[24],
            }}
          >
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: fontSizes.body,
                fontWeight: "700",
                color: c.success,
              }}
            >
              You're Pro
            </Text>
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: fontSizes.micro,
                fontWeight: "500",
                color: c.textTertiary,
                marginTop: spacing[4],
              }}
            >
              All features unlocked, ads removed.
            </Text>
          </View>
        ) : (
          <Pressable
            onPress={() =>
              Alert.alert(
                "Coming soon",
                "Purchases aren't live yet — everyone gets Pro for free while we finish setting this up."
              )
            }
            style={{
              marginHorizontal: spacing[20],
              backgroundColor: isDark ? components.upgradeCard.dark.bg : components.upgradeCard.light.bg,
              borderLeftWidth: components.upgradeCard.leftBorderWidth,
              borderLeftColor: isDark ? components.upgradeCard.dark.border : components.upgradeCard.light.border,
              borderRadius: components.upgradeCard.radius,
              padding: components.upgradeCard.padding,
              marginBottom: spacing[24],
            }}
          >
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: fontSizes.body,
                fontWeight: "700",
                color: isDark ? components.upgradeCard.dark.border : components.upgradeCard.light.border,
              }}
            >
              Unlock Pro
            </Text>
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: fontSizes.micro,
                fontWeight: "500",
                color: c.textTertiary,
                marginTop: spacing[4],
              }}
            >
              Remove Ads & Unlock Widgets — $1.99
            </Text>
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: fontSizes.xs,
                fontWeight: "500",
                color: c.textMuted,
                marginTop: spacing[2],
              }}
            >
              Lifetime Access • Launch Price
            </Text>
          </Pressable>
        )}
        </Animated.View>

        {/* NOTIFICATIONS section */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={{ marginBottom: spacing[24] }}>
          <Text
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: fontSizes.xs,
              fontWeight: "700",
              letterSpacing: letterSpacing.wideMd,
              color: c.textMuted,
              paddingHorizontal: spacing[20],
              marginBottom: spacing[10],
            }}
          >
            NOTIFICATIONS
          </Text>
          <View
            style={{
              marginHorizontal: spacing[20],
              backgroundColor: c.surface,
              borderRadius: radii.badge,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                paddingVertical: components.settingsRow.padding.vertical,
                paddingHorizontal: 18,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: isDark ? components.settingsRow.dark.divider : components.settingsRow.light.divider,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing[10] }}>
                <Ionicons name="notifications-outline" size={18} color={c.textTertiary} />
                <Text
                  style={{
                    fontFamily: "Manrope",
                    fontSize: components.settingsRow.titleFont.size,
                    fontWeight: components.settingsRow.titleFont.weight as any,
                    color: c.textPrimary,
                  }}
                >
                  Notification Sound
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing[6] }}>
                <Text
                  style={{
                    fontFamily: "Manrope",
                    fontSize: components.settingsRow.valueFont.size,
                    fontWeight: components.settingsRow.valueFont.weight as any,
                    color: isDark ? components.settingsRow.dark.value : components.settingsRow.light.value,
                  }}
                >
                  Default
                </Text>
                <Text style={{ color: isDark ? components.settingsRow.dark.chevron : components.settingsRow.light.chevron, fontSize: 14 }}>›</Text>
              </View>
            </View>
            <Pressable
              onPress={handleTogglePreResetAlert}
              style={{
                paddingVertical: components.settingsRow.padding.vertical,
                paddingHorizontal: 18,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing[10] }}>
                <Ionicons name="time-outline" size={18} color={c.textTertiary} />
                <Text
                  style={{
                    fontFamily: "Manrope",
                    fontSize: components.settingsRow.titleFont.size,
                    fontWeight: components.settingsRow.titleFont.weight as any,
                    color: c.textPrimary,
                  }}
                >
                  Pre-Reset Alert Default
                </Text>
              </View>
              <View
                style={{
                  width: components.toggle.width,
                  height: components.toggle.height,
                  borderRadius: components.toggle.radius,
                  backgroundColor: settings.preResetAlertEnabled ? (isDark ? components.toggle.dark.on : components.toggle.light.on) : c.border,
                  padding: components.toggle.padding,
                  justifyContent: "center",
                  alignItems: settings.preResetAlertEnabled ? "flex-end" : "flex-start",
                }}
              >
                <View
                  style={{
                    width: components.toggle.knobSize,
                    height: components.toggle.knobSize,
                    borderRadius: 50,
                    backgroundColor: settings.preResetAlertEnabled ? (isDark ? components.toggle.dark.knob : components.toggle.light.knob) : c.textOnAccent,
                  }}
                />
              </View>
            </Pressable>
          </View>
        </Animated.View>

        {/* POWER FEATURES section — disabled for now */}
        {/* Will re-enable when ads/IAP go live */}

        {/* DATA section */}
        <Animated.View entering={FadeInDown.duration(400).delay(300)} style={{ marginBottom: spacing[24] }}>
          <Text
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: fontSizes.xs,
              fontWeight: "700",
              letterSpacing: letterSpacing.wideMd,
              color: c.textMuted,
              paddingHorizontal: spacing[20],
              marginBottom: spacing[10],
            }}
          >
            DATA
          </Text>
          <View
            style={{
              marginHorizontal: spacing[20],
              backgroundColor: c.surface,
              borderRadius: radii.badge,
              overflow: "hidden",
            }}
          >
            <Pressable
              onPress={handleExport}
              style={{
                paddingVertical: components.settingsRow.padding.vertical,
                paddingHorizontal: 18,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: isDark ? components.settingsRow.dark.divider : components.settingsRow.light.divider,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing[10] }}>
                <Ionicons name="download-outline" size={18} color={c.textTertiary} />
                <Text
                  style={{
                    fontFamily: "Manrope",
                    fontSize: components.settingsRow.titleFont.size,
                    fontWeight: components.settingsRow.titleFont.weight as any,
                    color: c.textPrimary,
                  }}
                >
                  Export Timer History
                </Text>
              </View>
              <Text style={{ color: isDark ? components.settingsRow.dark.chevron : components.settingsRow.light.chevron, fontSize: 14 }}>›</Text>
            </Pressable>
            <Pressable
              onPress={handleRestore}
              style={{
                paddingVertical: components.settingsRow.padding.vertical,
                paddingHorizontal: 18,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing[10] }}>
                <Ionicons name="refresh-outline" size={18} color={c.textTertiary} />
                <Text
                  style={{
                    fontFamily: "Manrope",
                    fontSize: components.settingsRow.titleFont.size,
                    fontWeight: components.settingsRow.titleFont.weight as any,
                    color: restoring ? c.textMuted : c.textPrimary,
                  }}
                >
                  {restoring ? "Restoring..." : "Restore Purchases"}
                </Text>
              </View>
              <Text style={{ color: isDark ? components.settingsRow.dark.chevron : components.settingsRow.light.chevron, fontSize: 14 }}>›</Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* ABOUT section */}
        <Animated.View entering={FadeInDown.duration(400).delay(400)} style={{ marginBottom: spacing[24] }}>
          <Text
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: fontSizes.xs,
              fontWeight: "700",
              letterSpacing: letterSpacing.wideMd,
              color: c.textMuted,
              paddingHorizontal: spacing[20],
              marginBottom: spacing[10],
            }}
          >
            ABOUT
          </Text>
          <View
            style={{
              marginHorizontal: spacing[20],
              backgroundColor: c.surface,
              borderRadius: radii.badge,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                paddingVertical: components.settingsRow.padding.vertical,
                paddingHorizontal: 18,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? components.settingsRow.dark.divider : components.settingsRow.light.divider,
              }}
            >
              <Text
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: fontSizes.xs,
                  fontWeight: "500",
                  color: isDark ? components.settingsRow.dark.chevron : components.settingsRow.light.chevron,
                }}
              >
                SessionReset v1.0.0
              </Text>
            </View>
            <Pressable
              onPress={handleContact}
              style={{
                paddingVertical: components.settingsRow.padding.vertical,
                paddingHorizontal: 18,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing[10] }}>
                <Ionicons name="mail-outline" size={18} color={c.textTertiary} />
                <Text
                  style={{
                    fontFamily: "Manrope",
                    fontSize: components.settingsRow.titleFont.size,
                    fontWeight: components.settingsRow.titleFont.weight as any,
                    color: c.textPrimary,
                  }}
                >
                  Contact / Feedback
                </Text>
              </View>
              <Text style={{ color: isDark ? components.settingsRow.dark.chevron : components.settingsRow.light.chevron, fontSize: 14 }}>›</Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
