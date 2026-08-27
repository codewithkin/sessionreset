import { useEffect, useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
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
import { colors, components, fontSizes, spacing, radii, layout, springs, fontFamily } from "@/lib/tokens";
import { PressableScale } from "@/components/PressableScale";
import { storage } from "@/lib/storage";
import { createTimer } from "@/lib/timer-engine";
import {
  scheduleTimerNotifications,
  requestNotificationPermission,
  getNotificationPermissionStatus,
  NotificationPermissionStatus,
} from "@/lib/notifications";

type ThemeColors = typeof colors.light | typeof colors.dark;
type TFn = ReturnType<typeof useTranslation>["t"];

const SERVICES = ["claude", "codex", "claudeCode", "cursor"] as const;
const FREQUENCIES = ["low", "medium", "high"] as const;

// 6 screens shown as one mounted route, switched via local state so there is
// no router push/pop between them — only a single replace() when onboarding
// finishes (see systems/06-onboarding.md, updated per session-4 note).
const STEP = { HOOK: 0, QUIZ: 1, FOUNDER: 2, PAYWALL: 3, NOTIFICATIONS: 4, STARTER: 5 } as const;

export default function OnboardingScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isDark } = useAppTheme();
  const c = isDark ? colors.dark : colors.light;

  const [step, setStep] = useState<number>(STEP.HOOK);
  const [services, setServices] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<string | null>(null);
  const [notifStatus, setNotifStatus] = useState<NotificationPermissionStatus>("undetermined");
  const [startingDemo, setStartingDemo] = useState(false);
  const [isPro] = useState(() => storage.settings.get().isPro);

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
    // Stack.Protected guard picks this up and swaps to (drawer) on its own —
    // no router call needed here (see app/_layout.tsx).
    storage.onboarding.markComplete();
  };

  const handleQuizContinue = () => {
    if (services.length === 0) return;
    storage.onboarding.setQuizAnswers({ services, frequency });
    setStep(STEP.PAYWALL);
  };

  const handlePaywallPrimary = () => {
    if (isPro) {
      setStep(STEP.NOTIFICATIONS);
      return;
    }
    // Placeholder only — RevenueCat purchase flow is intentionally not wired
    // up here (out of scope for this pass). See trade-off note.
    Alert.alert(t("onboarding.paywall.comingSoonTitle"), t("onboarding.paywall.comingSoonBody"));
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
        {step === STEP.HOOK && <HookStep c={c} isDark={isDark} t={t} onNext={() => setStep(STEP.QUIZ)} />}
        {step === STEP.QUIZ && (
          <QuizStep
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
          <FounderStep c={c} isDark={isDark} t={t} onNext={() => setStep(STEP.PAYWALL)} />
        )}
        {step === STEP.PAYWALL && (
          <PaywallStep
            c={c}
            isDark={isDark}
            t={t}
            isPro={isPro}
            onPrimary={handlePaywallPrimary}
            onSkip={() => setStep(STEP.NOTIFICATIONS)}
          />
        )}
        {step === STEP.NOTIFICATIONS && (
          <NotificationsStep c={c} isDark={isDark} t={t} status={notifStatus} onEnable={handleEnableNotifications} />
        )}
        {step === STEP.STARTER && (
          <StarterStep
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
      {[0, 1, 2, 3, 4].map((i) => (
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
  disabled,
}: {
  label: string;
  onPress: () => void;
  c: ThemeColors;
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
        shadowColor: c.accent,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: disabled ? 0 : 0.32,
        shadowRadius: 18,
        elevation: disabled ? 0 : 8,
      }}
    >
      <Text
        style={{
          fontFamily: components.primaryButton.font.family,
          fontSize: components.primaryButton.font.size,
          fontWeight: components.primaryButton.font.weight,
          color: disabled ? c.textMuted : c.textOnAccent,
        }}
      >
        {label}
      </Text>
    </PressableScale>
  );
}

// ─── Screen 01 — Outcome Hook ────────────────────────────────────────────────

function HookStep({ c, isDark, t, onNext }: { c: ThemeColors; isDark: boolean; t: TFn; onNext: () => void }) {
  return (
    <View style={{ flex: 1, paddingHorizontal: spacing[28], paddingTop: spacing[56], justifyContent: "space-between" }}>
      <View>
        <Animated.View entering={FadeInDown.duration(300)}>
          <RateLimitTimeline c={c} isDark={isDark} />
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.duration(300).delay(120)}
          style={{
            marginTop: spacing[56],
            fontFamily: "Manrope",
            fontSize: fontSizes.displaySm,
            fontWeight: "800",
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
            fontFamily: "Manrope",
            fontSize: fontSizes.body,
            fontWeight: "500",
            lineHeight: 24.8,
            color: c.textTertiary,
          }}
        >
          {t("onboarding.outcomeHook.subtitle")}
        </Animated.Text>
      </View>

      <Animated.View entering={FadeInDown.duration(500).delay(200)} style={{ marginBottom: spacing[12] }}>
        <PrimaryButton label={t("onboarding.outcomeHook.cta")} onPress={onNext} c={c} />
        <Text
          style={{
            marginTop: spacing[18],
            fontFamily: "Manrope",
            fontSize: fontSizes.xs,
            fontWeight: "500",
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
function RateLimitTimeline({ c, isDark }: { c: ThemeColors; isDark: boolean }) {
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
      <Animated.View style={[{ flexDirection: "row", gap: spacing[14], alignItems: "center" }, rowStyle0]}>
        <View style={{ width: 12, alignItems: "center" }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c.error }} />
        </View>
        <View style={{ backgroundColor: c.errorBg, borderRadius: radii.card, paddingVertical: 12, paddingHorizontal: 16 }}>
          <Text style={{ fontFamily: "Manrope", fontSize: 14, fontWeight: "700", color: c.error }}>Rate Limit Hit</Text>
        </View>
      </Animated.View>

      {/* 05:00:00 */}
      <View style={{ flexDirection: "row", gap: spacing[14] }}>
        <View style={{ width: 12, alignItems: "center" }}>
          <View style={{ width: 2, flex: 1, backgroundColor: c.border }} />
        </View>
        <Animated.Text
          style={[
            { paddingVertical: 18, fontFamily: "JetBrains Mono", fontSize: 44, fontWeight: "700", letterSpacing: -2, color: c.textPrimary },
            rowStyle1,
          ]}
        >
          05:00:00
        </Animated.Text>
      </View>

      {/* 00:00:00 */}
      <View style={{ flexDirection: "row", gap: spacing[14] }}>
        <View style={{ width: 12, alignItems: "center" }}>
          <View style={{ width: 2, flex: 1, backgroundColor: c.border }} />
        </View>
        <Animated.Text
          style={[
            { paddingBottom: 18, fontFamily: "JetBrains Mono", fontSize: 44, fontWeight: "700", letterSpacing: -2, color: c.textDisabled },
            rowStyle2,
          ]}
        >
          00:00:00
        </Animated.Text>
      </View>

      {/* Back to Code */}
      <Animated.View style={[{ flexDirection: "row", gap: spacing[14], alignItems: "center" }, rowStyle3]}>
        <View style={{ width: 12, alignItems: "center" }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c.success }} />
        </View>
        <View style={{ backgroundColor: c.success, borderRadius: radii.card, paddingVertical: 12, paddingHorizontal: 16 }}>
          <Text style={{ fontFamily: "Manrope", fontSize: 14, fontWeight: "700", color: backToCodeText }}>Back to Code</Text>
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
  services,
  setServices,
  frequency,
  setFrequency,
  onContinue,
}: {
  c: ThemeColors;
  isDark: boolean;
  t: TFn;
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
      <ProgressDots activeIndex={STEP.QUIZ} c={c} />

      <View style={{ gap: spacing[22], marginTop: spacing[40] }}>
        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <Text
            style={{
              fontFamily: "Manrope",
              fontSize: fontSizes.h4,
              fontWeight: "800",
              lineHeight: 27.3,
              letterSpacing: -0.4,
              color: c.textPrimary,
            }}
          >
            {t("onboarding.quiz.question1")}
          </Text>
          <Text style={{ fontFamily: "Manrope", fontSize: fontSizes.micro, fontWeight: "500", color: c.textMuted, marginTop: spacing[6] }}>
            {t("onboarding.quiz.pickAllThatApply")}
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(400).delay(200)}
          style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing[10] }}
        >
          {SERVICES.map((s) => {
            const active = services.includes(s);
            return (
              <PressableScale
                key={s}
                onPress={() => toggleService(s)}
                style={{
                  width: "47%",
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
                  padding: components.quizCard.padding,
                  minHeight: components.quizCard.minHeight,
                  gap: spacing[10],
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View
                    style={{
                      width: components.quizCard.serviceDotSize,
                      height: components.quizCard.serviceDotSize,
                      borderRadius: 50,
                      backgroundColor:
                        s === "claude" ? c.claude : s === "codex" ? c.codex : s === "claudeCode" ? c.claude : c.textMuted,
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
                      <Text style={{ fontFamily: "Manrope", fontSize: fontSizes.tiny, fontWeight: "700", color: c.textOnAccent }}>✓</Text>
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
                    fontFamily: "Manrope",
                    fontSize: fontSizes.caption,
                    fontWeight: "700",
                    lineHeight: 18.2,
                    color: active ? c.textPrimary : c.textSecondary,
                  }}
                >
                  {t(`onboarding.quiz.options.${s}`)}
                </Text>
              </PressableScale>
            );
          })}
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(300)} style={{ marginTop: spacing[12] }}>
          <Text
            style={{
              fontFamily: "Manrope",
              fontSize: fontSizes.h4,
              fontWeight: "800",
              lineHeight: 27.3,
              letterSpacing: -0.4,
              color: c.textPrimary,
            }}
          >
            {t("onboarding.quiz.question2")}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(400)} style={{ flexDirection: "row", gap: spacing[10] }}>
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
                <Text style={{ fontFamily: "Manrope", fontSize: fontSizes.captionSm, fontWeight: "700", color: active ? c.textPrimary : c.textSecondary }}>
                  {t(`onboarding.quiz.frequency.${f}.main`)}
                </Text>
                <Text
                  style={{
                    marginTop: spacing[4],
                    fontFamily: "Manrope",
                    fontSize: fontSizes.xs,
                    fontWeight: "500",
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
        <PrimaryButton label={t("onboarding.quiz.cta")} onPress={onContinue} c={c} disabled={!canContinue} />
      </Animated.View>
    </View>
  );
}

// ─── Screen 03 — Founder Note ────────────────────────────────────────────────

function FounderStep({ c, isDark, t, onNext }: { c: ThemeColors; isDark: boolean; t: TFn; onNext: () => void }) {
  return (
    <View style={{ flex: 1, paddingHorizontal: spacing[24], paddingTop: spacing[16], justifyContent: "space-between" }}>
      <ProgressDots activeIndex={STEP.FOUNDER} c={c} />

      <View style={{ gap: spacing[28], justifyContent: "center" }}>
        <Animated.View
          entering={FadeInDown.duration(300).delay(100)}
          style={{
            width: 80,
            height: 80,
            borderRadius: radii.xl,
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
              fontFamily: components.founderCard.font.family,
              fontSize: components.founderCard.font.size,
              fontWeight: components.founderCard.font.weight,
              lineHeight: 26.4,
              color: c.textSecondary,
            }}
          >
            {t("onboarding.founderNote.body")}
          </Text>
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.duration(300).delay(300)}
          style={{ fontFamily: "Manrope", fontSize: fontSizes.caption, fontWeight: "700", color: c.textTertiary, textAlign: "right" }}
        >
          — {t("onboarding.founderNote.signature")}
        </Animated.Text>
      </View>

      <Animated.View entering={FadeInDown.duration(500).delay(300)} style={{ marginBottom: spacing[20] }}>
        <PrimaryButton label={t("onboarding.founderNote.cta")} onPress={onNext} c={c} />
      </Animated.View>
    </View>
  );
}

// ─── Screen 04 — Onboarding Paywall ─────────────────────────────────────────

function PaywallStep({
  c,
  isDark,
  t,
  isPro,
  onPrimary,
  onSkip,
}: {
  c: ThemeColors;
  isDark: boolean;
  t: TFn;
  isPro: boolean;
  onPrimary: () => void;
  onSkip: () => void;
}) {
  const FEATURES = ["dualAlerts", "widgets", "sounds"] as const;

  return (
    <View style={{ flex: 1, paddingHorizontal: spacing[24], paddingTop: spacing[16], justifyContent: "space-between" }}>
      <ProgressDots activeIndex={STEP.PAYWALL} c={c} />

      <View style={{ gap: spacing[24], marginTop: spacing[22] }}>
        <Animated.Text
          entering={FadeInDown.duration(400).delay(100)}
          style={{ fontFamily: "Manrope", fontSize: fontSizes.micro, fontWeight: "500", color: c.textMuted, textAlign: "center" }}
        >
          {t("onboarding.paywall.socialProof")}
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.duration(400).delay(150)}
          style={{ fontFamily: "Manrope", fontSize: fontSizes.h2, fontWeight: "800", letterSpacing: -0.8, color: c.textPrimary, textAlign: "center" }}
        >
          {t("onboarding.paywall.headline")}
        </Animated.Text>

        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={{ gap: components.checklistItem.gap }}>
          {FEATURES.map((f) => (
            <View key={f} style={{ flexDirection: "row", alignItems: "flex-start", gap: components.checklistItem.gap }}>
              <View
                style={{
                  width: components.checklistItem.circleSize,
                  height: components.checklistItem.circleSize,
                  borderRadius: 50,
                  backgroundColor: isDark ? components.checklistItem.dark.circleBg : components.checklistItem.light.circleBg,
                  justifyContent: "center",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                <Text
                  style={{
                    fontFamily: components.checklistItem.font.family,
                    fontSize: components.checklistItem.font.size,
                    fontWeight: components.checklistItem.font.weight,
                    color: isDark ? components.checklistItem.dark.circleText : components.checklistItem.light.circleText,
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

        <Animated.View
          entering={FadeInDown.duration(400).delay(300)}
          style={{
            backgroundColor: isDark ? components.priceCard.dark.bg : components.priceCard.light.bg,
            borderLeftWidth: components.priceCard.leftBorderWidth,
            borderLeftColor: isDark ? components.priceCard.dark.border : components.priceCard.light.border,
            borderRadius: components.priceCard.radius,
            padding: components.priceCard.padding,
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <View style={{ gap: spacing[6] }}>
            <View style={{ flexDirection: "row", alignItems: "baseline", gap: spacing[10] }}>
              <Text
                style={{
                  fontFamily: components.priceCard.priceFont.family,
                  fontSize: components.priceCard.priceFont.size,
                  fontWeight: components.priceCard.priceFont.weight,
                  letterSpacing: components.priceCard.priceLetterSpacing,
                  color: c.textPrimary,
                }}
              >
                {t("onboarding.paywall.price")}
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
            <Text style={{ fontFamily: "Manrope", fontSize: fontSizes.captionSm, fontWeight: "500", color: c.textTertiary }}>
              {t("onboarding.paywall.period")}
            </Text>
          </View>
          <Text style={{ fontFamily: "JetBrains Mono", fontSize: fontSizes.tiny, fontWeight: "700", letterSpacing: 1.2, color: c.accent }}>
            {t("onboarding.paywall.lifetimeBadge")}
          </Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.duration(400).delay(400)} style={{ marginBottom: spacing[12] }}>
        {isPro ? (
          <View
            style={{
              height: components.primaryButton.height,
              borderRadius: components.primaryButton.radius,
              backgroundColor: c.surface,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontFamily: "Manrope", fontSize: 16, fontWeight: "700", color: c.success }}>{t("onboarding.paywall.isPro")}</Text>
          </View>
        ) : (
          <PrimaryButton label={t("onboarding.paywall.cta")} onPress={onPrimary} c={c} />
        )}
        <Pressable onPress={isPro ? onPrimary : onSkip} style={{ marginTop: spacing[16] }}>
          <Text style={{ fontFamily: "Manrope", fontSize: fontSizes.micro, fontWeight: "500", color: c.textMuted, textAlign: "center" }}>
            {isPro ? t("onboarding.paywall.continueLabel") : t("onboarding.paywall.skip")}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

// ─── Screen 05 — Notification Primer ────────────────────────────────────────

function NotificationsStep({
  c,
  isDark,
  t,
  status,
  onEnable,
}: {
  c: ThemeColors;
  isDark: boolean;
  t: TFn;
  status: NotificationPermissionStatus;
  onEnable: () => void;
}) {
  return (
    <View style={{ flex: 1, paddingHorizontal: spacing[24], paddingTop: spacing[16], justifyContent: "space-between" }}>
      <ProgressDots activeIndex={STEP.NOTIFICATIONS} c={c} />

      <View style={{ marginTop: spacing[56] }}>
        <Animated.View
          entering={FadeInDown.duration(300).delay(100)}
          style={{
            backgroundColor: isDark ? components.notificationCard.dark.bg : components.notificationCard.light.bg,
            borderRadius: components.notificationCard.radius,
            padding: components.notificationCard.padding,
            shadowColor: isDark ? "#000000" : "#14161A",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: isDark ? 0.5 : 0.1,
            shadowRadius: 24,
            elevation: 4,
          }}
        >
          <View style={{ flexDirection: "row", gap: spacing[12] }}>
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
              <Text style={{ fontFamily: "JetBrains Mono", fontSize: 13, fontWeight: "700", color: c.textOnAccent }}>SR</Text>
            </View>
            <View style={{ flex: 1, gap: spacing[3] }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
                <Text style={{ fontFamily: "Manrope", fontSize: fontSizes.xs, fontWeight: "700", letterSpacing: 0.4, color: c.textTertiary }}>
                  {t("onboarding.notifications.previewApp")}
                </Text>
                <Text style={{ fontFamily: "Manrope", fontSize: fontSizes.xs, fontWeight: "500", color: c.textMuted }}>
                  {t("onboarding.notifications.previewTime")}
                </Text>
              </View>
              <Text style={{ fontFamily: "Manrope", fontSize: fontSizes.bodySm, fontWeight: "700", color: c.textPrimary }}>
                {t("onboarding.notifications.previewHeadline")}
              </Text>
              <Text style={{ fontFamily: "Manrope", fontSize: fontSizes.caption, fontWeight: "500", color: c.textTertiary, lineHeight: 19.6 }}>
                {t("onboarding.notifications.previewBody")}
              </Text>
            </View>
          </View>
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.duration(400).delay(200)}
          style={{
            marginTop: spacing[52],
            fontFamily: "Manrope",
            fontSize: fontSizes.h2,
            fontWeight: "800",
            letterSpacing: -0.8,
            color: c.textPrimary,
            textAlign: "center",
          }}
        >
          {t("onboarding.notifications.headline")}
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.duration(400).delay(250)}
          style={{
            marginTop: spacing[14],
            fontFamily: "Manrope",
            fontSize: fontSizes.body,
            fontWeight: "500",
            lineHeight: 24.8,
            color: c.textTertiary,
            textAlign: "center",
          }}
        >
          {t("onboarding.notifications.body")}
        </Animated.Text>
      </View>

      <Animated.View entering={FadeInDown.duration(400).delay(300)} style={{ marginBottom: spacing[12] }}>
        <PrimaryButton
          label={status === "granted" ? t("onboarding.notifications.enabled") : t("onboarding.notifications.cta")}
          onPress={onEnable}
          c={c}
        />
        <Text
          style={{
            marginTop: spacing[16],
            fontFamily: "Manrope",
            fontSize: fontSizes.xs,
            fontWeight: "500",
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
  busy,
  onBlocked,
  onDemo,
}: {
  c: ThemeColors;
  isDark: boolean;
  t: TFn;
  busy: boolean;
  onBlocked: () => void;
  onDemo: () => void;
}) {
  return (
    <View style={{ flex: 1, paddingHorizontal: spacing[24], paddingTop: spacing[16], justifyContent: "space-between" }}>
      <ProgressDots activeIndex={STEP.STARTER} allComplete c={c} />

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
          <Text style={{ fontFamily: "Manrope", fontSize: 32, color: c.accent, lineHeight: 32 }}>✓</Text>
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.duration(400).delay(200)}
          style={{
            marginTop: spacing[32],
            fontFamily: "Manrope",
            fontSize: fontSizes.displaySm,
            fontWeight: "800",
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
            fontFamily: "Manrope",
            fontSize: fontSizes.body,
            fontWeight: "500",
            lineHeight: 24.8,
            color: c.textTertiary,
          }}
        >
          {t("onboarding.starter.subtext")}
        </Animated.Text>

        <Animated.View
          entering={FadeInDown.duration(300).delay(280)}
          style={{ marginTop: spacing[36], flexDirection: "row", gap: spacing[12], alignItems: "center" }}
        >
          <View style={{ width: 12, alignItems: "center" }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c.accent }} />
          </View>
          <Text style={{ fontFamily: "JetBrains Mono", fontSize: fontSizes.captionSm, fontWeight: "500", color: c.textTertiary }}>
            NOW → 5H WINDOW OPENS
          </Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.duration(400).delay(360)} style={{ gap: spacing[12], marginBottom: spacing[20] }}>
        <PrimaryButton label={t("onboarding.starter.blocked")} onPress={onBlocked} c={c} />
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
              fontFamily: components.secondaryButton.font.family,
              fontSize: components.secondaryButton.font.size,
              fontWeight: components.secondaryButton.font.weight,
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
