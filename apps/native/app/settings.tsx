import { ReactNode, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  Platform as RNPlatform,
  Linking,
  Share,
} from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { storage } from "@/lib/storage";
import { SUPPORTED_LANGUAGES, setAppLanguage, getAppLanguage, LanguageCode } from "@/lib/i18n";
import { restorePurchases } from "@/lib/purchases";
import { useAppTheme } from "@/contexts/app-theme-context";
import {
  colors,
  components,
  fontFamily,
  fontSizes,
  layout,
  letterSpacing,
  radii,
  spacing,
  springs,
} from "@/lib/tokens";
import { useDirection } from "@/lib/rtl";
import { PressableScale } from "@/components/PressableScale";

const APP_VERSION = "1.0.0";

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isDark } = useAppTheme();
  const { row, textAlign, writingDirection, isRTL } = useDirection();
  const insets = useSafeAreaInsets();
  const c = isDark ? colors.dark : colors.light;

  const [settings, setSettings] = useState(() => storage.settings.get());
  const [restoring, setRestoring] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>(() => getAppLanguage());

  const divider = isDark ? components.settingsRow.dark.divider : components.settingsRow.light.divider;
  const chevronColor = isDark ? components.settingsRow.dark.chevron : components.settingsRow.light.chevron;
  const valueColor = isDark ? components.settingsRow.dark.value : components.settingsRow.light.value;

  const handleSelectLanguage = (code: LanguageCode) => {
    setLanguage(code);
    setLanguageOpen(false);
    void setAppLanguage(code);
  };

  const handleExport = async () => {
    const data = JSON.stringify(
      { timers: storage.timers.get(), usageLog: storage.usageLog.get(), exportedAt: new Date().toISOString() },
      null,
      2
    );

    if (RNPlatform.OS === "ios") {
      await Share.share({ message: data, title: "SessionReset Data Export" });
    } else {
      await Share.share({ message: data });
    }
  };

  const handleRestore = async () => {
    if (restoring) return;
    setRestoring(true);
    try {
      const success = await restorePurchases();
      if (success) {
        setSettings(storage.settings.get());
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

  const handleTogglePreReset = () => {
    const updated = { ...settings, preResetAlertEnabled: !settings.preResetAlertEnabled };
    storage.settings.set(updated);
    setSettings(updated);
  };

  // ── Building blocks ──────────────────────────────────────────────────────

  const SectionLabel = ({ children }: { children: ReactNode }) => (
    <Text
      style={{
        marginTop: spacing[26],
        fontFamily: fontFamily.mono[700],
        fontSize: fontSizes.tiny,
        letterSpacing: letterSpacing.wideMd,
        color: c.textMuted,
        textAlign,
        writingDirection,
      }}
    >
      {children}
    </Text>
  );

  const Row = ({
    title,
    subtitle,
    value,
    onPress,
    right,
    last,
  }: {
    title: string;
    subtitle?: string;
    value?: string;
    onPress?: () => void;
    right?: ReactNode;
    last?: boolean;
  }) => {
    const body = (
      <View
        style={{
          flexDirection: row,
          alignItems: "center",
          justifyContent: "space-between",
          gap: spacing[12],
          paddingVertical: components.settingsRow.padding.vertical,
          paddingHorizontal: components.settingsRow.padding.horizontal,
          borderBottomWidth: last ? 0 : 1,
          borderBottomColor: divider,
        }}
      >
        <View style={{ flex: 1, gap: spacing[2] }}>
          <Text
            style={{
              fontFamily: fontFamily.manrope[600],
              fontSize: components.settingsRow.titleFont.size,
              color: c.textPrimary,
              textAlign,
              writingDirection,
            }}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={{
                fontFamily: fontFamily.manrope[500],
                fontSize: fontSizes.xs,
                color: c.textMuted,
                textAlign,
                writingDirection,
              }}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View style={{ flexDirection: row, alignItems: "center", gap: spacing[8], flexShrink: 0 }}>
          {value ? (
            <Text
              style={{
                fontFamily: fontFamily.manrope[500],
                fontSize: components.settingsRow.valueFont.size,
                color: valueColor,
              }}
            >
              {value}
            </Text>
          ) : null}
          {right ??
            (onPress ? (
              <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={16} color={chevronColor} />
            ) : null)}
        </View>
      </View>
    );

    return onPress ? <Pressable onPress={onPress}>{body}</Pressable> : body;
  };

  const Toggle = ({ on }: { on: boolean }) => (
    <View
      style={{
        width: components.toggle.width,
        height: components.toggle.height,
        borderRadius: components.toggle.radius,
        backgroundColor: on ? (isDark ? components.toggle.dark.on : components.toggle.light.on) : c.border,
        padding: components.toggle.padding,
        justifyContent: "center",
        alignItems: on ? "flex-end" : "flex-start",
      }}
    >
      <Animated.View
        key={on ? "on" : "off"}
        entering={ZoomIn.springify()
          .damping(springs.pop.damping)
          .stiffness(springs.pop.stiffness)
          .mass(springs.pop.mass)}
        style={{
          width: components.toggle.knobSize,
          height: components.toggle.knobSize,
          borderRadius: components.toggle.knobSize / 2,
          backgroundColor: on ? (isDark ? components.toggle.dark.knob : components.toggle.light.knob) : c.bg,
        }}
      />
    </View>
  );

  /** Rows sit on the page with hairline dividers, not inside a filled card. */
  const List = ({ children }: { children: ReactNode }) => (
    <View style={{ marginTop: spacing[10], borderTopWidth: 1, borderTopColor: divider }}>{children}</View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top }}>
      {/* Header — close tile on the leading edge, title optically centred */}
      <View
        style={{
          flexDirection: row,
          alignItems: "center",
          height: 48,
          paddingHorizontal: layout.settings.hPadding,
        }}
      >
        <PressableScale
          onPress={() => router.back()}
          accessibilityLabel={t("common.cancel")}
          style={{
            width: layout.hamburger.size,
            height: layout.hamburger.size,
            borderRadius: layout.hamburger.radius,
            backgroundColor: c.surface,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="close" size={18} color={c.textPrimary} />
        </PressableScale>
        <Text
          style={{
            flex: 1,
            textAlign: "center",
            // Offsets the close tile so the title centres against the screen.
            marginEnd: layout.hamburger.size,
            fontFamily: fontFamily.manrope[700],
            fontSize: 17,
            color: c.textPrimary,
          }}
        >
          {t("settings.title")}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: layout.settings.hPadding,
          paddingBottom: spacing[32] + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Pro status / upgrade */}
        <Animated.View entering={FadeInDown.duration(400).delay(80)}>
          <Pressable
            onPress={
              settings.isPro
                ? undefined
                : () =>
                    Alert.alert(
                      t("onboarding.paywall.comingSoonTitle"),
                      t("onboarding.paywall.comingSoonBody")
                    )
            }
            style={{
              marginTop: spacing[18],
              backgroundColor: isDark ? components.upgradeCard.dark.bg : components.upgradeCard.light.bg,
              borderLeftWidth: components.upgradeCard.leftBorderWidth,
              borderLeftColor: settings.isPro
                ? c.success
                : isDark
                  ? components.upgradeCard.dark.border
                  : components.upgradeCard.light.border,
              borderRadius: components.upgradeCard.radius,
              padding: components.upgradeCard.padding,
            }}
          >
            <View style={{ flexDirection: row, alignItems: "center", justifyContent: "space-between", gap: spacing[12] }}>
              <Text
                style={{
                  fontFamily: fontFamily.manrope[700],
                  fontSize: fontSizes.body,
                  color: settings.isPro ? c.success : c.textPrimary,
                  textAlign,
                  writingDirection,
                }}
              >
                {settings.isPro ? t("settings.pro.active") : t("settings.pro.upgrade")}
              </Text>
              {!settings.isPro && (
                <Text style={{ fontFamily: fontFamily.mono[700], fontSize: 17, color: c.accent }}>
                  {t("onboarding.paywall.price")}
                </Text>
              )}
            </View>
            <Text
              style={{
                marginTop: spacing[6],
                fontFamily: fontFamily.manrope[500],
                fontSize: fontSizes.captionSm,
                lineHeight: 19.5,
                color: c.textTertiary,
                textAlign,
                writingDirection,
              }}
            >
              {settings.isPro ? t("settings.pro.activeSubtext") : t("settings.pro.upgradeBody")}
            </Text>
          </Pressable>
        </Animated.View>

        {/* Notifications */}
        <Animated.View entering={FadeInDown.duration(400).delay(140)}>
          <SectionLabel>{t("settings.sections.notifications")}</SectionLabel>
          <List>
            {/* Display-only: the app uses the system default sound and has no
                picker, so this row deliberately has no chevron to tap. */}
            <Row title={t("settings.notifications.sound")} value={t("settings.soundDefault")} />
            <Row
              title={t("settings.notifications.preResetAlert")}
              subtitle={t("settings.notifications.preResetSub")}
              onPress={handleTogglePreReset}
              right={<Toggle on={settings.preResetAlertEnabled} />}
              last
            />
          </List>
        </Animated.View>

        {/* Power features — entry point for the rewarded-ad unlock (screen 10) */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)}>
          <SectionLabel>{t("settings.sections.power")}</SectionLabel>
          <Pressable
            onPress={() => router.push("/rewarded-ad")}
            style={{
              marginTop: spacing[10],
              backgroundColor: isDark ? components.upgradeCard.dark.bg : components.upgradeCard.light.bg,
              borderRadius: components.upgradeCard.radius,
              paddingVertical: spacing[16],
              paddingHorizontal: spacing[18],
              flexDirection: row,
              alignItems: "center",
              justifyContent: "space-between",
              gap: spacing[12],
            }}
          >
            <View style={{ flex: 1, gap: spacing[3] }}>
              <Text
                style={{
                  fontFamily: fontFamily.manrope[700],
                  fontSize: fontSizes.bodySm,
                  color: c.textPrimary,
                  textAlign,
                  writingDirection,
                }}
              >
                {t("settings.power.watchAd")}
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.manrope[500],
                  fontSize: fontSizes.xs,
                  color: c.textTertiary,
                  textAlign,
                  writingDirection,
                }}
              >
                {t("settings.power.watchAdSubtext")}
              </Text>
            </View>
            <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={16} color={chevronColor} />
          </Pressable>
        </Animated.View>

        {/* Language */}
        <Animated.View entering={FadeInDown.duration(400).delay(260)}>
          <SectionLabel>{t("settings.sections.language")}</SectionLabel>
          <List>
            <Row
              title={t("settings.languageRow")}
              value={SUPPORTED_LANGUAGES.find((l) => l.code === language)?.nativeName}
              onPress={() => setLanguageOpen((open) => !open)}
              right={
                <Ionicons name={languageOpen ? "chevron-up" : "chevron-down"} size={16} color={chevronColor} />
              }
              last={!languageOpen}
            />
            {languageOpen &&
              SUPPORTED_LANGUAGES.map((lang, i) => {
                const active = lang.code === language;
                return (
                  <Pressable
                    key={lang.code}
                    onPress={() => handleSelectLanguage(lang.code)}
                    style={{
                      flexDirection: row,
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingVertical: spacing[12],
                      paddingHorizontal: components.settingsRow.padding.horizontal,
                      borderBottomWidth: i === SUPPORTED_LANGUAGES.length - 1 ? 0 : 1,
                      borderBottomColor: divider,
                    }}
                  >
                    <View style={{ flexDirection: row, alignItems: "center", gap: spacing[10] }}>
                      <Text
                        style={{
                          width: 26,
                          fontFamily: fontFamily.mono[700],
                          fontSize: fontSizes.tiny,
                          letterSpacing: 1.2,
                          color: active ? c.accent : c.textMuted,
                        }}
                      >
                        {lang.code.toUpperCase()}
                      </Text>
                      <Text
                        style={{
                          fontFamily: active ? fontFamily.manrope[700] : fontFamily.manrope[500],
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
          </List>
        </Animated.View>

        {/* Data */}
        <Animated.View entering={FadeInDown.duration(400).delay(320)}>
          <SectionLabel>{t("settings.sections.data")}</SectionLabel>
          <List>
            <Row title={t("settings.data.export")} onPress={handleExport} />
            <Row
              title={restoring ? t("settings.restoring") : t("settings.data.restore")}
              onPress={handleRestore}
            />
            <Row
              title={t("settings.about.contact")}
              onPress={() => Linking.openURL("mailto:support@sessionreset.app?subject=SessionReset Feedback")}
              last
            />
          </List>
        </Animated.View>

        <Text
          style={{
            marginTop: spacing[32],
            textAlign: "center",
            fontFamily: fontFamily.mono[500],
            fontSize: fontSizes.xs,
            color: chevronColor,
          }}
        >
          {t("settings.about.version", { version: APP_VERSION })}
        </Text>
      </ScrollView>
    </View>
  );
}
