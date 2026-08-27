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
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { storage } from "@/lib/storage";
import { SUPPORTED_LANGUAGES, setAppLanguage, getAppLanguage, LanguageCode } from "@/lib/i18n";
import { restorePurchases } from "@/lib/purchases";
import { useAppTheme } from "@/contexts/app-theme-context";
import { colors, components, fontSizes, spacing, radii, shadows, letterSpacing, fontFamily } from "@/lib/tokens";
import { PressableScale } from "@/components/PressableScale";

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isDark } = useAppTheme();
  const c = isDark ? colors.dark : colors.light;
  const [settings, setSettings] = useState(() => storage.settings.get());
  const [restoring, setRestoring] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>(() => getAppLanguage());

  const handleSelectLanguage = (code: LanguageCode) => {
    setLanguage(code);
    setLanguageOpen(false);
    // Applies app-wide immediately; every useTranslation consumer re-renders.
    void setAppLanguage(code);
  };

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
      Alert.alert(t("settings.alerts.exported"), t("settings.alerts.exportedBody"));
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
        Alert.alert(t("settings.alerts.restored"), t("settings.alerts.restoredBody"));
      } else {
        Alert.alert(t("settings.alerts.noPurchases"), t("settings.alerts.noPurchasesBody"));
      }
    } catch {
      Alert.alert(t("settings.alerts.error"), t("settings.alerts.restoreError"));
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
            fontFamily: fontFamily.manrope[800],
            fontSize: fontSizes.h5,
            color: c.textPrimary,
          }}
        >
          {t("settings.title")}
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
                fontFamily: fontFamily.manrope[700],
                fontSize: fontSizes.body,
                color: c.success,
              }}
            >
              {t("settings.pro.active")}
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.manrope[500],
                fontSize: fontSizes.micro,
                color: c.textTertiary,
                marginTop: spacing[4],
              }}
            >
              {t("settings.pro.activeSubtext")}
            </Text>
          </View>
        ) : (
          <Pressable
            onPress={() =>
              Alert.alert(
                t("onboarding.paywall.comingSoonTitle"),
                t("onboarding.paywall.comingSoonBody")
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
                fontFamily: fontFamily.manrope[700],
                fontSize: fontSizes.body,
                color: isDark ? components.upgradeCard.dark.border : components.upgradeCard.light.border,
              }}
            >
              {t("settings.pro.upgrade")}
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.manrope[500],
                fontSize: fontSizes.micro,
                color: c.textTertiary,
                marginTop: spacing[4],
              }}
            >
              {t("settings.pro.upgradeSubtext")}
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.manrope[500],
                fontSize: fontSizes.xs,
                color: c.textMuted,
                marginTop: spacing[2],
              }}
            >
              {t("settings.pro.upgradePeriod")}
            </Text>
          </Pressable>
        )}
        </Animated.View>

        {/* NOTIFICATIONS section */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={{ marginBottom: spacing[24] }}>
          <Text
            style={{
              fontFamily: fontFamily.mono[700],
              fontSize: fontSizes.xs,
              letterSpacing: letterSpacing.wideMd,
              color: c.textMuted,
              paddingHorizontal: spacing[20],
              marginBottom: spacing[10],
            }}
          >
            {t("settings.sections.notifications")}
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
                    fontFamily: fontFamily.manrope[600],
                    fontSize: components.settingsRow.titleFont.size,
                    color: c.textPrimary,
                  }}
                >
                  {t("settings.notifications.sound")}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing[6] }}>
                <Text
                  style={{
                    fontFamily: fontFamily.manrope[500],
                    fontSize: components.settingsRow.valueFont.size,
                    color: isDark ? components.settingsRow.dark.value : components.settingsRow.light.value,
                  }}
                >
                  {t("settings.soundDefault")}
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
                    fontFamily: fontFamily.manrope[600],
                    fontSize: components.settingsRow.titleFont.size,
                    color: c.textPrimary,
                  }}
                >
                  {t("settings.notifications.preResetAlert")}
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

        {/* LANGUAGE section — the onboarding language step promises this exists */}
        <Animated.View entering={FadeInDown.duration(400).delay(250)} style={{ marginBottom: spacing[24] }}>
          <Text
            style={{
              fontFamily: fontFamily.mono[700],
              fontSize: fontSizes.xs,
              letterSpacing: letterSpacing.wideMd,
              color: c.textMuted,
              paddingHorizontal: spacing[20],
              marginBottom: spacing[10],
            }}
          >
            {t("settings.sections.language")}
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
              onPress={() => setLanguageOpen((open) => !open)}
              style={{
                paddingVertical: components.settingsRow.padding.vertical,
                paddingHorizontal: 18,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing[10] }}>
                <Ionicons name="language-outline" size={18} color={c.textTertiary} />
                <Text
                  style={{
                    fontFamily: fontFamily.manrope[600],
                    fontSize: components.settingsRow.titleFont.size,
                    color: c.textPrimary,
                  }}
                >
                  {t("settings.languageRow")}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing[6] }}>
                <Text
                  style={{
                    fontFamily: fontFamily.manrope[500],
                    fontSize: components.settingsRow.valueFont.size,
                    color: isDark ? components.settingsRow.dark.value : components.settingsRow.light.value,
                  }}
                >
                  {SUPPORTED_LANGUAGES.find((l) => l.code === language)?.nativeName}
                </Text>
                <Ionicons
                  name={languageOpen ? "chevron-up" : "chevron-down"}
                  size={14}
                  color={isDark ? components.settingsRow.dark.chevron : components.settingsRow.light.chevron}
                />
              </View>
            </Pressable>

            {languageOpen &&
              SUPPORTED_LANGUAGES.map((lang) => {
                const active = lang.code === language;
                return (
                  <Pressable
                    key={lang.code}
                    onPress={() => handleSelectLanguage(lang.code)}
                    style={{
                      paddingVertical: spacing[12],
                      paddingHorizontal: 18,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTopWidth: 1,
                      borderTopColor: isDark ? components.settingsRow.dark.divider : components.settingsRow.light.divider,
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing[10] }}>
                      <Text
                        style={{
                          fontFamily: fontFamily.mono[700],
                          fontSize: fontSizes.tiny,
                          letterSpacing: 1.2,
                          width: 24,
                          color: active ? c.accent : c.textMuted,
                        }}
                      >
                        {lang.code.toUpperCase()}
                      </Text>
                      <Text
                        style={{
                          fontFamily: fontFamily.manrope[active ? 700 : 500],
                          fontSize: components.settingsRow.valueFont.size,
                          color: active ? c.textPrimary : c.textSecondary,
                        }}
                      >
                        {lang.nativeName}
                      </Text>
                    </View>
                    {active && <Ionicons name="checkmark" size={16} color={c.accent} />}
                  </Pressable>
                );
              })}
          </View>
        </Animated.View>

        {/* POWER FEATURES section — disabled for now */}
        {/* Will re-enable when ads/IAP go live */}

        {/* DATA section */}
        <Animated.View entering={FadeInDown.duration(400).delay(300)} style={{ marginBottom: spacing[24] }}>
          <Text
            style={{
              fontFamily: fontFamily.mono[700],
              fontSize: fontSizes.xs,
              letterSpacing: letterSpacing.wideMd,
              color: c.textMuted,
              paddingHorizontal: spacing[20],
              marginBottom: spacing[10],
            }}
          >
            {t("settings.sections.data")}
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
                    fontFamily: fontFamily.manrope[600],
                    fontSize: components.settingsRow.titleFont.size,
                    color: c.textPrimary,
                  }}
                >
                  {t("settings.data.export")}
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
                    fontFamily: fontFamily.manrope[600],
                    fontSize: components.settingsRow.titleFont.size,
                    color: restoring ? c.textMuted : c.textPrimary,
                  }}
                >
                  {restoring ? t("settings.restoring") : t("settings.data.restore")}
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
              fontFamily: fontFamily.mono[700],
              fontSize: fontSizes.xs,
              letterSpacing: letterSpacing.wideMd,
              color: c.textMuted,
              paddingHorizontal: spacing[20],
              marginBottom: spacing[10],
            }}
          >
            {t("settings.sections.about")}
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
                  fontFamily: fontFamily.mono[500],
                  fontSize: fontSizes.xs,
                  color: isDark ? components.settingsRow.dark.chevron : components.settingsRow.light.chevron,
                }}
              >
                {t("settings.about.version", { version: "1.0.0" })}
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
                    fontFamily: fontFamily.manrope[600],
                    fontSize: components.settingsRow.titleFont.size,
                    color: c.textPrimary,
                  }}
                >
                  {t("settings.about.contact")}
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
