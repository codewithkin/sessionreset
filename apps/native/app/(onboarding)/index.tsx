import { useEffect, useState } from "react";
import { View, Text, Pressable, Alert, ScrollView } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  SlideInRight,
  SlideOutLeft,
  ZoomIn,
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/contexts/app-theme-context";
import { colors, components, elevations, fontSizes, spacing, radii, layout, springs, fontFamily } from "@/lib/tokens";
import { PressableScale } from "@/components/PressableScale";
import { useDirection, type Direction } from "@/lib/rtl";
import { storage } from "@/lib/storage";
import { SUPPORTED_LANGUAGES, setAppLanguage, getAppLanguage, LanguageCode } from "@/lib/i18n";
import { createTimer } from "@/lib/timer-engine";
import {
  scheduleTimerNotifications,
  requestNotificationPermission,
  getNotificationPermissionStatus,
  NotificationPermissionStatus,
} from "@/lib/notifications";
import { purchaseLifetimePro, getOfferings } from "@/lib/purchases";

type ThemeColors = typeof colors.light | typeof colors.dark;
type TFn = ReturnType<typeof useTranslation>["t"];

/** The four quiz services, chunked into the design's 2-column grid rows. */
const SERVICE_ROWS = [
  ["claude", "codex"],
  ["claudeCode", "cursor"],
] as const;
const FREQUENCIES = ["low", "medium", "high"] as const;

/** Brand dot beside each quiz option, per the design's colour per service. */
function serviceDotColor(service: string, c: ThemeColors, isDark: boolean): string {
  if (service === "claude" || service === "claudeCode") return c.claude;
  if (service === "codex") return c.codex;
  return isDark ? c.textDisabled : c.textMuted;
}

// 7 screens shown as one mounted route, switched via local state so there is
// no router push/pop between them — only a single replace() when onboarding
// finishes (see systems/06-onboarding.md, updated per session-4 note).
const STEP = {
  LANGUAGE: 0,
  HOOK: 1,
  QUIZ: 2,
  FOUNDER: 3,
  PAYWALL: 4,
  NOTIFICATIONS: 5,
  STARTER: 6,
} as const;

/**
 * Which progress dot each step lights. The hook is deliberately absent: the
 * design keeps that screen clean, with no dots at all. That leaves six dots
 * for the six steps that do show them.
 */
const TOTAL_DOTS = 6;
const DOT_INDEX: Record<number, number> = {
  [STEP.LANGUAGE]: 0,
  [STEP.QUIZ]: 1,
  [STEP.FOUNDER]: 2,
  [STEP.PAYWALL]: 3,
  [STEP.NOTIFICATIONS]: 4,
  [STEP.STARTER]: 5,
};

/** Ten shipped locales, chunked into the same 2-column grid the quiz uses. */
const LANGUAGE_ROWS = SUPPORTED_LANGUAGES.reduce<(typeof SUPPORTED_LANGUAGES)[number][][]>(
  (rows, lang, i) => {
    if (i % 2 === 0) rows.push([lang]);
    else rows[rows.length - 1].push(lang);
    return rows;
  },
  []
);

export default function OnboardingScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isDark } = useAppTheme();
  const d = useDirection();
  const c = isDark ? colors.dark : colors.light;

  const [step, setStep] = useState<number>(STEP.LANGUAGE);
  const [language, setLanguage] = useState<LanguageCode>(() => getAppLanguage());
  const [services, setServices] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<string | null>(null);
  const [notifStatus, setNotifStatus] = useState<NotificationPermissionStatus>("undetermined");
  const [startingDemo, setStartingDemo] = useState(false);
  const [isPro, setIsPro] = useState(() => storage.settings.get().isPro);
  const [offeringsPrice, setOfferingsPrice] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  // Surface the real, localized store price on the paywall. RevenueCat's
  // storeProduct carries the Play Console price (what Google actually charges);
  // we fall back to the translated "$9.99" only if the offering isn't ready.
  useEffect(() => {
    if (step !== STEP.PAYWALL) return;
    let cancelled = false;
    getOfferings().then((pkg) => {
      if (cancelled || !pkg?.product?.priceString) return;
      setOfferingsPrice(pkg.product.priceString);
    });
    return () => {
      cancelled = true;
    };
  }, [step]);

  // Auto-advance if permission was already granted in a previous session.
  useEffect(() => {
    if (step !== STEP.NOTIFICATIONS) return;
    let cancelled = false;
    getNotificationPermissionStatus().then((s) => {
      if (cancelled) return;
      setNotifStatus(s);
      if (s === "granted") setStep(STEP.STARTER);
    });
    return () => {
      cancelled = true;
    };
  }, [step]);

  const finishOnboarding = () => {
    // Flips the reactive onboarding_complete flag; the root layout's
    // Stack.Protected guard picks this up and swaps to (tabs) on its own —
    // no router call needed here (see app/_layout.tsx).
    storage.onboarding.markComplete();
  };

  const handleSelectLanguage = (code: LanguageCode) => {
    setLanguage(code);
    // Applies immediately — every useTranslation consumer re-renders, so the
    // rest of this screen switches under the user's finger.
    void setAppLanguage(code);
  };

  const handleQuizContinue = () => {
    if (services.length === 0) return;
    storage.onboarding.setQuizAnswers({ services, frequency });
    setStep(STEP.PAYWALL);
  };

  const handlePaywallPrimary = async () => {
    if (isPro) {
      setStep(STEP.NOTIFICATIONS);
      return;
    }
    if (purchasing) return;
    setPurchasing(true);
    const success = await purchaseLifetimePro();
    setPurchasing(false);
    if (success) {
      setIsPro(true);
      setStep(STEP.NOTIFICATIONS);
    } else {
      Alert.alert(t("onboarding.paywall.purchaseFailedTitle"), t("onboarding.paywall.purchaseFailedBody"));
    }
  };

  const handleEnableNotifications = async () => {
    const result = await requestNotificationPermission();
    setNotifStatus(result);
    setStep(STEP.STARTER);
  };

  const handleDemoTimer = async () => {
    if (startingDemo) return;
    setStartingDemo(true);
    const timer = createTimer("claude", Date.now(), true);
    storage.timers.add(timer);
    await scheduleTimerNotifications(timer);
    finishOnboarding();
  };

  const handleBlocked = () => {
    finishOnboarding();
    setTimeout(() => router.push("/quick-log"), 300);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <Animated.View
        key={step}
        entering={SlideInRight.duration(320).easing(Easing.out(Easing.cubic))}
        exiting={SlideOutLeft.duration(320).easing(Easing.in(Easing.cubic))}
        style={{ flex: 1 }}
      >
        {step === STEP.LANGUAGE && (
          <LanguageStep d={d}
            c={c}
            isDark={isDark}
            t={t}
            selected={language}
            onSelect={handleSelectLanguage}
            onNext={() => setStep(STEP.HOOK)}
          />
        )}
        {step === STEP.HOOK && <HookStep d={d} c={c} isDark={isDark} t={t} onNext={() => setStep(STEP.QUIZ)} />}
        {step === STEP.QUIZ && (
          <QuizStep d={d}
            c={c}
            isDark={isDark}
            t={t}
            services={services}
            setServices={setServices}
            frequency={frequency}
            setFrequency={setFrequency}
            onContinue={handleQuizContinue}
          />
        )}
        {step === STEP.FOUNDER && (
          <FounderStep d={d} c={c} isDark={isDark} t={t} onNext={() => setStep(STEP.PAYWALL)} />
        )}
        {step === STEP.PAYWALL && (
          <PaywallStep d={d}
            c={c}
            isDark={isDark}
            t={t}
            isPro={isPro}
            offeringsPrice={offeringsPrice}
            purchasing={purchasing}
            onPrimary={handlePaywallPrimary}
            onSkip={() => setStep(STEP.NOTIFICATIONS)}
          />
        )}
        {step === STEP.NOTIFICATIONS && (
          <NotificationsStep d={d} c={c} isDark={isDark} t={t} status={notifStatus} onEnable={handleEnableNotifications} />
        )}
        {step === STEP.STARTER && (
          <StarterStep d={d}
            c={c}
            isDark={isDark}
            t={t}
            busy={startingDemo}
            onBlocked={handleBlocked}
            onDemo={handleDemoTimer}
          />
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

// ─── Shared bits ─────────────────────────────────────────────────────────────

function ProgressDots({ activeIndex, allComplete, c }: { activeIndex: number; allComplete?: boolean; c: ThemeColors }) {
  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      style={{ flexDirection: "row", justifyContent: "center", gap: spacing[6], flexShrink: 0 }}
    >
      {Array.from({ length: TOTAL_DOTS }, (_, i) => i).map((i) => (
        <View
          key={i}
          style={{
            width: layout.progressDot.width,
            height: layout.progressDot.height,
            borderRadius: radii.sm,
            backgroundColor: allComplete || i === activeIndex ? c.progressFill : c.borderStrong,
          }}
        />
      ))}
    </Animated.View>
  );
}

function PrimaryButton({
  label,
  onPress,
  c,
  isDark,
  disabled,
}: {
  label: string;
  onPress: () => void;
  c: ThemeColors;
  isDark: boolean;
  disabled?: boolean;
}) {
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      style={{
        height: components.primaryButton.height,
        borderRadius: components.primaryButton.radius,
        backgroundColor: disabled ? c.borderStrong : c.accent,
        justifyContent: "center",
        alignItems: "center",
        boxShadow: disabled ? undefined : elevations[isDark ? "dark" : "light"].accentButton,
      }}
    >
      <Text
        style={{
          fontFamily: fontFamily.manrope[700],
          fontSize: components.primaryButton.font.size,
          color: disabled ? c.textMuted : c.textOnAccent,
        }}
      >
        {label}
      </Text>
    </PressableScale>
  );
}

// ─── Screen 00 — Language ────────────────────────────────────────────────────

/**
 * Not in the design files. Built from the existing system — it reuses the quiz
 * card's shape, borders and checkmark so it reads as part of the same flow.
 *
 * Selecting applies the language immediately rather than on Continue, so the
 * heading, subtext and button below the grid visibly switch as you tap. That
 * is the confirmation that the choice took effect.
 */
function LanguageStep({
  c,
  isDark,
  t,
  d,
  selected,
  onSelect,
  onNext,
}: {
  c: ThemeColors;
  isDark: boolean;
  t: TFn;
  d: Direction;
  selected: LanguageCode;
  onSelect: (code: LanguageCode) => void;
  onNext: () => void;
}) {
  return (
    <View style={{ flex: 1, paddingHorizontal: spacing[24], paddingTop: spacing[16] }}>
      <ProgressDots activeIndex={DOT_INDEX[STEP.LANGUAGE]} c={c} />

      <Animated.View entering={FadeInDown.duration(400).delay(100)} style={{ marginTop: spacing[40] }}>
        <Text
          style={{
            fontFamily: fontFamily.manrope[800],
            fontSize: fontSizes.h4,
            lineHeight: 27.3,
            letterSpacing: -0.4,
            color: c.textPrimary,
                      textAlign: d.textAlign,
            writingDirection: d.writingDirection,
          }}
        >
          {t("onboarding.language.headline")}
        </Text>
        <Text
          style={{
            fontFamily: fontFamily.manrope[500],
            fontSize: fontSizes.micro,
            color: c.textMuted,
            marginTop: spacing[6],
          }}
        >
          {t("onboarding.language.subtext")}
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(200)} style={{ flex: 1, marginTop: spacing[18] }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: spacing[10], paddingBottom: spacing[16] }}>
          {LANGUAGE_ROWS.map((row, rowIndex) => (
            <View key={rowIndex} style={{ flexDirection: d.row, gap: spacing[10] }}>
              {row.map((lang) => {
                const active = selected === lang.code;
                return (
                  <PressableScale
                    key={lang.code}
                    onPress={() => onSelect(lang.code)}
                    style={{
                      flex: 1,
                      borderWidth: 2,
                      borderColor: active
                        ? isDark
                          ? components.quizCard.dark.activeBorder
                          : components.quizCard.light.activeBorder
                        : isDark
                          ? components.quizCard.dark.inactiveBorder
                          : components.quizCard.light.inactiveBorder,
                      backgroundColor: active
                        ? isDark
                          ? components.quizCard.dark.activeBg
                          : components.quizCard.light.activeBg
                        : "transparent",
                      borderRadius: components.quizCard.radius,
                      padding: components.quizCard.padding,
                      gap: spacing[8],
                    }}
                  >
                    <View style={{ flexDirection: d.row, justifyContent: "space-between", alignItems: "center" }}>
                      <Text
                        style={{
                          fontFamily: fontFamily.mono[700],
                          fontSize: fontSizes.tiny,
                          letterSpacing: 1.2,
                          color: active ? c.accent : c.textMuted,
                        }}
                      >
                        {lang.code.toUpperCase()}
                      </Text>
                      {active ? (
                        <Animated.View
                          entering={ZoomIn.springify()
                            .damping(springs.pop.damping)
                            .stiffness(springs.pop.stiffness)
                            .mass(springs.pop.mass)}
                          style={{
                            width: components.quizCard.checkboxSize,
                            height: components.quizCard.checkboxSize,
                            borderRadius: 50,
                            backgroundColor: c.accent,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Ionicons name="checkmark" size={12} color={c.textOnAccent} />
                        </Animated.View>
                      ) : (
                        <View
                          style={{
                            width: components.quizCard.checkboxSize,
                            height: components.quizCard.checkboxSize,
                            borderRadius: 50,
                            borderWidth: 2,
                            borderColor: c.borderStrong,
                          }}
                        />
                      )}
                    </View>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontFamily: fontFamily.manrope[700],
                        fontSize: fontSizes.bodySm,
                        color: active ? c.textPrimary : c.textSecondary,
                      }}
                    >
                      {lang.nativeName}
                    </Text>
                  </PressableScale>
                );
              })}
            </View>
          ))}
        </ScrollView>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(400).delay(300)} style={{ marginBottom: spacing[16] }}>
        <PrimaryButton label={t("onboarding.language.cta")} onPress={onNext} c={c} isDark={isDark} />
      </Animated.View>
    </View>
  );
}

// ─── Screen 01 — Outcome Hook ────────────────────────────────────────────────

function HookStep({ c, isDark, t, d, onNext }: { c: ThemeColors; isDark: boolean; t: TFn; d: Direction; onNext: () => void }) {
  return (
    <View style={{ flex: 1, paddingHorizontal: spacing[28], paddingTop: spacing[56], justifyContent: "space-between" }}>
      <View>
        <Animated.View entering={FadeInDown.duration(300)}>
          <RateLimitTimeline c={c} isDark={isDark} t={t} dir={d} />
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.duration(300).delay(120)}
          style={{
            marginTop: spacing[56],
            fontFamily: fontFamily.manrope[800],
            fontSize: fontSizes.displaySm,
            letterSpacing: -1,
            lineHeight: 36,
            color: c.textPrimary,
          }}
        >
          {t("onboarding.outcomeHook.headline")}
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.duration(300).delay(200)}
          style={{
            marginTop: spacing[16],
            fontFamily: fontFamily.manrope[500],
            fontSize: fontSizes.body,
            lineHeight: 24.8,
            color: c.textTertiary,
                      textAlign: d.textAlign,
            writingDirection: d.writingDirection,
          }}
        >
          {t("onboarding.outcomeHook.subtitle")}
        </Animated.Text>
      </View>

      <Animated.View entering={FadeInDown.duration(500).delay(200)} style={{ marginBottom: spacing[12] }}>
        <PrimaryButton label={t("onboarding.outcomeHook.cta")} onPress={onNext} c={c} isDark={isDark} />
        <Text
          style={{
            marginTop: spacing[18],
            fontFamily: fontFamily.manrope[500],
            fontSize: fontSizes.xs,
            color: c.textMuted,
            textAlign: "center",
          }}
        >
          {t("onboarding.outcomeHook.footer")}
        </Text>
      </Animated.View>
    </View>
  );
}

/** Looping "Rate Limit Hit → 05:00:00 → 00:00:00 → Back to Code" status rail. */
function RateLimitTimeline({ c, isDark, t, dir }: { c: ThemeColors; isDark: boolean; t: TFn; dir: Direction }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(4, { duration: 4800, easing: Easing.linear }), -1, false);
  }, [progress]);

  const useGlow = (index: number) =>
    useAnimatedStyle(() => ({
      opacity: interpolate(
        progress.value,
        [index - 1, index - 0.35, index, index + 0.65, index + 1],
        [0.4, 0.4, 1, 1, 0.4],
        Extrapolation.CLAMP
      ),
    }));

  const rowStyle0 = useGlow(0);
  const rowStyle1 = useGlow(1);
  const rowStyle2 = useGlow(2);
  const rowStyle3 = useGlow(3);

  const backToCodeText = isDark ? colors.dark.textOnBrand : "#FFFFFF";

  return (
    <View style={{ gap: 0 }}>
      {/* Rate Limit Hit */}
      <Animated.View style={[{ flexDirection: dir.row, gap: spacing[14], alignItems: "center" }, rowStyle0]}>
        <View style={{ width: 12, alignItems: "center" }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c.error }} />
        </View>
        <View style={{ backgroundColor: c.errorBg, borderRadius: radii.card, paddingVertical: 12, paddingHorizontal: 16 }}>
          <Text style={{ fontFamily: fontFamily.manrope[700], fontSize: 14, color: c.error }}>
            {t("onboarding.outcomeHook.timeline.limitHit")}
          </Text>
        </View>
      </Animated.View>

      {/* 05:00:00 */}
      <View style={{ flexDirection: dir.row, gap: spacing[14] }}>
        <View style={{ width: 12, alignItems: "center" }}>
          <View style={{ width: 2, flex: 1, backgroundColor: c.border }} />
        </View>
        <Animated.Text
          style={[
            { paddingVertical: 18, fontFamily: fontFamily.mono[700], fontSize: 44, letterSpacing: -2, color: c.textPrimary },
            rowStyle1,
          ]}
        >
          05:00:00
        </Animated.Text>
      </View>

      {/* 00:00:00 */}
      <View style={{ flexDirection: dir.row, gap: spacing[14] }}>
        <View style={{ width: 12, alignItems: "center" }}>
          <View style={{ width: 2, flex: 1, backgroundColor: c.border }} />
        </View>
        <Animated.Text
          style={[
            { paddingBottom: 18, fontFamily: fontFamily.mono[700], fontSize: 44, letterSpacing: -2, color: c.textDisabled },
            rowStyle2,
          ]}
        >
          00:00:00
        </Animated.Text>
      </View>

      {/* Back to Code */}
      <Animated.View style={[{ flexDirection: dir.row, gap: spacing[14], alignItems: "center" }, rowStyle3]}>
        <View style={{ width: 12, alignItems: "center" }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c.success }} />
        </View>
        <View style={{ backgroundColor: c.success, borderRadius: radii.card, paddingVertical: 12, paddingHorizontal: 16 }}>
          <Text style={{ fontFamily: fontFamily.manrope[700], fontSize: 14, color: backToCodeText }}>
            {t("onboarding.outcomeHook.timeline.backToCode")}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

// ─── Screen 02 — Personalization Quiz ───────────────────────────────────────

function QuizStep({
  c,
  isDark,
  t,
  d,
  services,
  setServices,
  frequency,
  setFrequency,
  onContinue,
}: {
  c: ThemeColors;
  isDark: boolean;
  t: TFn;
  d: Direction;
  services: string[];
  setServices: (fn: (prev: string[]) => string[]) => void;
  frequency: string | null;
  setFrequency: (f: string) => void;
  onContinue: () => void;
}) {
  const canContinue = services.length > 0;

  const toggleService = (s: string) => {
    setServices((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: spacing[24], paddingTop: spacing[16], justifyContent: "space-between" }}>
      <ProgressDots activeIndex={DOT_INDEX[STEP.QUIZ]} c={c} />

      <View style={{ marginTop: spacing[40] }}>
        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <Text
            style={{
              fontFamily: fontFamily.manrope[800],
              fontSize: fontSizes.h4,
              lineHeight: 27.3,
              letterSpacing: -0.4,
              color: c.textPrimary,
                        textAlign: d.textAlign,
            writingDirection: d.writingDirection,
          }}
          >
            {t("onboarding.quiz.question1")}
          </Text>
          <Text
            style={{
              fontFamily: fontFamily.manrope[500],
              fontSize: fontSizes.micro,
              color: c.textMuted,
              marginTop: spacing[6],
            }}
          >
            {t("onboarding.quiz.pickAllThatApply")}
          </Text>
        </Animated.View>

        {/* Design is a 2-column grid with a 10px gutter, so cards are laid out
            as rows of two with flex:1 rather than an approximate percentage. */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(200)}
          style={{ marginTop: spacing[18], gap: spacing[10] }}
        >
          {SERVICE_ROWS.map((row, rowIndex) => (
            <View key={rowIndex} style={{ flexDirection: d.row, gap: spacing[10] }}>
              {row.map((s) => {
                const active = services.includes(s);
                return (
                  <PressableScale
                    key={s}
                    onPress={() => toggleService(s)}
                    style={{
                      flex: 1,
                      borderWidth: 2,
                      borderColor: active
                        ? isDark
                          ? components.quizCard.dark.activeBorder
                          : components.quizCard.light.activeBorder
                        : isDark
                          ? components.quizCard.dark.inactiveBorder
                          : components.quizCard.light.inactiveBorder,
                      backgroundColor: active
                        ? isDark
                          ? components.quizCard.dark.activeBg
                          : components.quizCard.light.activeBg
                        : "transparent",
                      borderRadius: components.quizCard.radius,
                      padding: components.quizCard.padding,
                      minHeight: components.quizCard.minHeight,
                      gap: spacing[10],
                    }}
                  >
                    <View style={{ flexDirection: d.row, justifyContent: "space-between", alignItems: "center" }}>
                      <View
                        style={{
                          width: components.quizCard.serviceDotSize,
                          height: components.quizCard.serviceDotSize,
                          borderRadius: 50,
                          backgroundColor: serviceDotColor(s, c, isDark),
                        }}
                      />
                      {active ? (
                        <Animated.View
                          key={`check-${s}`}
                          entering={ZoomIn.springify()
                            .damping(springs.pop.damping)
                            .stiffness(springs.pop.stiffness)
                            .mass(springs.pop.mass)}
                          style={{
                            width: components.quizCard.checkboxSize,
                            height: components.quizCard.checkboxSize,
                            borderRadius: 50,
                            backgroundColor: c.accent,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Ionicons name="checkmark" size={12} color={c.textOnAccent} />
                        </Animated.View>
                      ) : (
                        <View
                          style={{
                            width: components.quizCard.checkboxSize,
                            height: components.quizCard.checkboxSize,
                            borderRadius: 50,
                            borderWidth: 2,
                            borderColor: c.borderStrong,
                          }}
                        />
                      )}
                    </View>
                    <Text
                      style={{
                        fontFamily: fontFamily.manrope[700],
                        fontSize: fontSizes.caption,
                        lineHeight: 18.2,
                        color: active ? c.textPrimary : c.textSecondary,
                      }}
                    >
                      {t(`onboarding.quiz.options.${s}`)}
                    </Text>
                  </PressableScale>
                );
              })}
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(300)} style={{ marginTop: spacing[36] }}>
          <Text
            style={{
              fontFamily: fontFamily.manrope[800],
              fontSize: fontSizes.h4,
              lineHeight: 27.3,
              letterSpacing: -0.4,
              color: c.textPrimary,
                        textAlign: d.textAlign,
            writingDirection: d.writingDirection,
          }}
          >
            {t("onboarding.quiz.question2")}
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(400).delay(400)}
          style={{ marginTop: spacing[18], flexDirection: d.row, gap: spacing[10] }}
        >
          {FREQUENCIES.map((f) => {
            const active = frequency === f;
            return (
              <PressableScale
                key={f}
                onPress={() => setFrequency(f)}
                style={{
                  flex: 1,
                  borderWidth: 2,
                  borderColor: active
                    ? isDark
                      ? components.quizCard.dark.activeBorder
                      : components.quizCard.light.activeBorder
                    : isDark
                      ? components.quizCard.dark.inactiveBorder
                      : components.quizCard.light.inactiveBorder,
                  backgroundColor: active ? (isDark ? components.quizCard.dark.activeBg : components.quizCard.light.activeBg) : "transparent",
                  borderRadius: components.quizCard.radius,
                  paddingVertical: 14,
                  paddingHorizontal: spacing[8],
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: fontFamily.manrope[700],
                    fontSize: fontSizes.captionSm,
                    color: active ? c.textPrimary : c.textSecondary,
                  }}
                >
                  {t(`onboarding.quiz.frequency.${f}.main`)}
                </Text>
                <Text
                  style={{
                    marginTop: spacing[4],
                    fontFamily: fontFamily.manrope[500],
                    fontSize: fontSizes.xs,
                    textAlign: "center",
                    color: active ? c.accent : c.textMuted,
                  }}
                >
                  {t(`onboarding.quiz.frequency.${f}.sub`)}
                </Text>
              </PressableScale>
            );
          })}
        </Animated.View>
      </View>

      <Animated.View entering={FadeIn.duration(400).delay(500)} style={{ marginBottom: spacing[16] }}>
        <PrimaryButton label={t("onboarding.quiz.cta")} onPress={onContinue} c={c} isDark={isDark} disabled={!canContinue} />
      </Animated.View>
    </View>
  );
}

// ─── Screen 03 — Founder Note ────────────────────────────────────────────────

function FounderStep({ c, isDark, t, d, onNext }: { c: ThemeColors; isDark: boolean; t: TFn; d: Direction; onNext: () => void }) {
  return (
    <View style={{ flex: 1, paddingHorizontal: spacing[24], paddingTop: spacing[16], justifyContent: "space-between" }}>
      <ProgressDots activeIndex={DOT_INDEX[STEP.FOUNDER]} c={c} />

      <View style={{ gap: spacing[28], justifyContent: "center" }}>
        <Animated.View
          entering={FadeInDown.duration(300).delay(100)}
          style={{
            width: 80,
            height: 80,
            borderRadius: radii.dialog,
            backgroundColor: isDark ? components.founderCard.dark.bg : components.founderCard.light.bg,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="time-outline" size={48} color={c.textTertiary} />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(300).delay(200)}
          style={{
            backgroundColor: isDark ? components.founderCard.dark.bg : components.founderCard.light.bg,
            borderRadius: components.founderCard.radius,
            padding: components.founderCard.padding,
          }}
        >
          <Text
            style={{
              fontFamily: fontFamily.manrope[500],
              fontSize: components.founderCard.font.size,
              lineHeight: 26.4,
              color: c.textPrimary,
                        textAlign: d.textAlign,
            writingDirection: d.writingDirection,
          }}
          >
            {t("onboarding.founderNote.body")}
          </Text>
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.duration(300).delay(300)}
          style={{
            fontFamily: fontFamily.manrope[700],
            fontSize: fontSizes.caption,
            color: isDark ? c.textSecondary : c.textTertiary,
            textAlign: "right",
          }}
        >
          — {t("onboarding.founderNote.signature")}
        </Animated.Text>
      </View>

      <Animated.View entering={FadeInDown.duration(500).delay(300)} style={{ marginBottom: spacing[20] }}>
        <PrimaryButton label={t("onboarding.founderNote.cta")} onPress={onNext} c={c} isDark={isDark} />
      </Animated.View>
    </View>
  );
}

// ─── Screen 04 — Onboarding Paywall ─────────────────────────────────────────

function PaywallStep({
  c,
  isDark,
  t,
  d,
  isPro,
  offeringsPrice,
  purchasing,
  onPrimary,
  onSkip,
}: {
  c: ThemeColors;
  isDark: boolean;
  t: TFn;
  d: Direction;
  isPro: boolean;
  offeringsPrice: string | null;
  purchasing: boolean;
  onPrimary: () => void;
  onSkip: () => void;
}) {
  const FEATURES = ["dualAlerts", "widgets", "sounds"] as const;

  return (
    <View style={{ flex: 1, paddingHorizontal: spacing[24], paddingTop: spacing[16], justifyContent: "space-between" }}>
      <ProgressDots activeIndex={DOT_INDEX[STEP.PAYWALL]} c={c} />

      <View style={{ marginTop: spacing[22] }}>
        <Animated.Text
          entering={FadeInDown.duration(400).delay(100)}
          style={{
            fontFamily: fontFamily.manrope[500],
            fontSize: fontSizes.micro,
            lineHeight: 19.5,
            color: c.textMuted,
            textAlign: "center",
          }}
        >
          {t("onboarding.paywall.socialProof")}
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.duration(400).delay(150)}
          style={{
            marginTop: spacing[34],
            fontFamily: fontFamily.manrope[800],
            fontSize: fontSizes.h2,
            lineHeight: 32.5,
            letterSpacing: -0.8,
            color: c.textPrimary,
                      textAlign: d.textAlign,
            writingDirection: d.writingDirection,
          }}
        >
          {isPro ? t("onboarding.paywall.proHeadline") : t("onboarding.paywall.headline")}
        </Animated.Text>

        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={{ marginTop: spacing[26], gap: spacing[18] }}>
          {FEATURES.map((f) => (
            <View key={f} style={{ flexDirection: d.row, alignItems: "flex-start", gap: components.checklistItem.gap }}>
              <View
                style={{
                  width: components.checklistItem.circleSize,
                  height: components.checklistItem.circleSize,
                  borderRadius: 50,
                  backgroundColor: isDark ? components.checklistItem.dark.circleBg : components.checklistItem.light.circleBg,
                  justifyContent: "center",
                  alignItems: "center",
                  flexShrink: 0,
                  // Nudge onto the first line's optical centre (label is 16px/1.45).
                  marginTop: 2,
                }}
              >
                <Ionicons
                  name="checkmark"
                  size={13}
                  color={isDark ? components.checklistItem.dark.circleText : components.checklistItem.light.circleText}
                />
              </View>
              <Text
                style={{
                  fontFamily: fontFamily.manrope[500],
                  fontSize: components.checklistItem.labelFont.size,
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

        <Animated.View
          entering={FadeInDown.duration(400).delay(300)}
          style={{
            marginTop: spacing[32],
            backgroundColor: isDark ? components.priceCard.dark.bg : components.priceCard.light.bg,
            borderLeftWidth: components.priceCard.leftBorderWidth,
            borderLeftColor: isDark ? components.priceCard.dark.border : components.priceCard.light.border,
            borderRadius: components.priceCard.radius,
            padding: components.priceCard.padding,
            flexDirection: d.row,
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: spacing[12],
          }}
        >
          {/* flex/minWidth let the price column absorb long localised strings
              instead of pushing the LIFETIME badge past the card edge. */}
          <View style={{ flex: 1, minWidth: 0, gap: spacing[6] }}>
            <View style={{ flexDirection: d.row, alignItems: "baseline", gap: spacing[10], flexWrap: "wrap" }}>
              <Text
                style={{
                  fontFamily: fontFamily.mono[700],
                  fontSize: components.priceCard.priceFont.size,
                  letterSpacing: components.priceCard.priceLetterSpacing,
                  color: c.textPrimary,
                }}
              >
                {isPro ? t("onboarding.paywall.proPrice") : (offeringsPrice ?? t("onboarding.paywall.price"))}
              </Text>
            </View>
            <Text style={{ fontFamily: fontFamily.manrope[500], fontSize: fontSizes.captionSm, color: c.textTertiary }}>
              {isPro ? t("onboarding.paywall.proPeriod") : t("onboarding.paywall.period")}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            style={{
              flexShrink: 0,
              fontFamily: fontFamily.mono[700],
              fontSize: 10,
              letterSpacing: 1.2,
              color: isPro ? c.success : c.accent,
            }}
          >
            {isPro ? t("onboarding.paywall.proBadge") : t("onboarding.paywall.lifetimeBadge")}
          </Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.duration(400).delay(400)} style={{ marginBottom: spacing[14] }}>
        <PrimaryButton
          label={isPro ? t("onboarding.paywall.proCta") : purchasing ? t("onboarding.paywall.purchasing") : t("onboarding.paywall.cta")}
          onPress={onPrimary}
          c={c}
          isDark={isDark}
          disabled={purchasing}
        />
        {!isPro && (
          <Pressable onPress={onSkip} style={{ marginTop: spacing[16] }}>
            <Text
              style={{
                fontFamily: fontFamily.manrope[500],
                fontSize: fontSizes.micro,
                color: c.textMuted,
                textAlign: "center",
              }}
            >
              {t("onboarding.paywall.skip")}
            </Text>
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
}

// ─── Screen 05 — Notification Primer ────────────────────────────────────────

function NotificationsStep({
  c,
  isDark,
  t,
  d,
  status,
  onEnable,
}: {
  c: ThemeColors;
  isDark: boolean;
  t: TFn;
  d: Direction;
  status: NotificationPermissionStatus;
  onEnable: () => void;
}) {
  return (
    <View style={{ flex: 1, paddingHorizontal: spacing[24], paddingTop: spacing[16], justifyContent: "space-between" }}>
      <ProgressDots activeIndex={DOT_INDEX[STEP.NOTIFICATIONS]} c={c} />

      <View style={{ marginTop: spacing[56] }}>
        <Animated.View
          entering={FadeInDown.duration(300).delay(100)}
          style={{
            backgroundColor: isDark ? components.notificationCard.dark.bg : components.notificationCard.light.bg,
            borderRadius: components.notificationCard.radius,
            padding: components.notificationCard.padding,
            boxShadow: elevations[isDark ? "dark" : "light"].notification,
          }}
        >
          <View style={{ flexDirection: d.row, gap: spacing[12] }}>
            <View
              style={{
                width: layout.notification.iconSize,
                height: layout.notification.iconSize,
                borderRadius: layout.notification.iconRadius,
                backgroundColor: c.accent,
                justifyContent: "center",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <Text style={{ fontFamily: fontFamily.mono[700], fontSize: 13, color: c.textOnAccent }}>SR</Text>
            </View>
            <View style={{ flex: 1, gap: spacing[3] }}>
              <View style={{ flexDirection: d.row, justifyContent: "space-between", alignItems: "baseline" }}>
                <Text
                  style={{ fontFamily: fontFamily.manrope[700], fontSize: fontSizes.xs, letterSpacing: 0.4, color: c.textTertiary }}
                >
                  {t("onboarding.notifications.previewApp")}
                </Text>
                <Text style={{ fontFamily: fontFamily.manrope[500], fontSize: fontSizes.xs, color: c.textMuted }}>
                  {t("onboarding.notifications.previewTime")}
                </Text>
              </View>
              <Text style={{ fontFamily: fontFamily.manrope[700], fontSize: fontSizes.bodySm, color: c.textPrimary }}>
                {t("onboarding.notifications.previewHeadline")}
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.manrope[500],
                  fontSize: fontSizes.captionSm,
                  color: c.textTertiary,
                  lineHeight: 18.85,
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
            marginTop: spacing[52],
            fontFamily: fontFamily.manrope[800],
            fontSize: fontSizes.h2,
            lineHeight: 32.5,
            letterSpacing: -0.8,
            color: c.textPrimary,
                      textAlign: d.textAlign,
            writingDirection: d.writingDirection,
          }}
        >
          {t("onboarding.notifications.headline")}
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.duration(400).delay(250)}
          style={{
            marginTop: spacing[14],
            fontFamily: fontFamily.manrope[500],
            fontSize: fontSizes.body,
            lineHeight: 24.8,
            color: c.textTertiary,
                      textAlign: d.textAlign,
            writingDirection: d.writingDirection,
          }}
        >
          {t("onboarding.notifications.body")}
        </Animated.Text>
      </View>

      <Animated.View entering={FadeInDown.duration(400).delay(300)} style={{ marginBottom: spacing[14] }}>
        <PrimaryButton
          label={status === "granted" ? t("onboarding.notifications.enabled") : t("onboarding.notifications.cta")}
          onPress={onEnable}
          c={c}
          isDark={isDark}
        />
        <Text
          style={{
            marginTop: spacing[16],
            fontFamily: fontFamily.manrope[500],
            fontSize: fontSizes.xs,
            color: c.textMuted,
            textAlign: "center",
          }}
        >
          {t("onboarding.notifications.footer")}
        </Text>
      </Animated.View>
    </View>
  );
}

// ─── Screen 06 — AHA Moment ──────────────────────────────────────────────────

function StarterStep({
  c,
  isDark,
  t,
  d,
  busy,
  onBlocked,
  onDemo,
}: {
  c: ThemeColors;
  isDark: boolean;
  t: TFn;
  d: Direction;
  busy: boolean;
  onBlocked: () => void;
  onDemo: () => void;
}) {
  return (
    <View style={{ flex: 1, paddingHorizontal: spacing[24], paddingTop: spacing[16], justifyContent: "space-between" }}>
      <ProgressDots activeIndex={DOT_INDEX[STEP.STARTER]} allComplete c={c} />

      <View style={{ justifyContent: "center" }}>
        <Animated.View
          entering={FadeInDown.duration(300).delay(100)}
          style={{
            width: 76,
            height: 76,
            borderRadius: 50,
            backgroundColor: isDark ? components.quizCard.dark.activeBg : components.quizCard.light.activeBg,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="checkmark" size={36} color={c.accent} />
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.duration(400).delay(200)}
          style={{
            marginTop: spacing[32],
            fontFamily: fontFamily.manrope[800],
            fontSize: fontSizes.displaySm,
            letterSpacing: -1,
            lineHeight: 36,
            color: c.textPrimary,
          }}
        >
          {t("onboarding.starter.headline")}
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.duration(400).delay(250)}
          style={{
            marginTop: spacing[14],
            fontFamily: fontFamily.manrope[500],
            fontSize: fontSizes.body,
            lineHeight: 24.8,
            color: c.textTertiary,
                      textAlign: d.textAlign,
            writingDirection: d.writingDirection,
          }}
        >
          {t("onboarding.starter.subtext")}
        </Animated.Text>

        <Animated.View
          entering={FadeInDown.duration(300).delay(280)}
          style={{ marginTop: spacing[36], flexDirection: d.row, gap: spacing[12], alignItems: "center" }}
        >
          <View style={{ width: 12, alignItems: "center" }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c.accent }} />
          </View>
          <Text style={{ fontFamily: fontFamily.mono[500], fontSize: fontSizes.captionSm, color: c.textTertiary }}>
            {t("onboarding.starter.windowRail")}
          </Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.duration(400).delay(360)} style={{ gap: spacing[12], marginBottom: spacing[20] }}>
        <PrimaryButton label={t("onboarding.starter.blocked")} onPress={onBlocked} c={c} isDark={isDark} />
        <PressableScale
          onPress={onDemo}
          disabled={busy}
          style={{
            height: components.secondaryButton.height,
            borderRadius: components.secondaryButton.radius,
            borderWidth: components.secondaryButton.borderWidth,
            borderColor: isDark ? components.secondaryButton.dark.border : components.secondaryButton.light.border,
            justifyContent: "center",
            alignItems: "center",
            opacity: busy ? 0.6 : 1,
          }}
        >
          <Text
            style={{
              fontFamily: fontFamily.manrope[700],
              fontSize: components.secondaryButton.font.size,
              color: isDark ? components.secondaryButton.dark.text : components.secondaryButton.light.text,
            }}
          >
            {t("onboarding.starter.demo")}
          </Text>
        </PressableScale>
      </Animated.View>
    </View>
  );
}
