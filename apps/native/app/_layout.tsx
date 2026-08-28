import "@/global.css";
import { useCallback, useEffect } from "react";
import { Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { I18nextProvider } from "react-i18next";
import { useMMKVBoolean } from "react-native-mmkv";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from "@expo-google-fonts/manrope";
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_700Bold,
} from "@expo-google-fonts/jetbrains-mono";

import { AppThemeProvider } from "@/contexts/app-theme-context";
import { TimerProvider } from "@/contexts/TimerContext";
import i18n from "@/lib/i18n";
import { mmkv, STORAGE_KEYS } from "@/lib/storage";
import { reconcileMissedNotifications } from "@/lib/notifications";

// Hold the native splash until the design fonts are ready, so the first frame
// is never the system-font fallback (which then visibly reflows once Manrope
// lands). Failing is non-fatal — see onLayoutRootView.
SplashScreen.preventAutoHideAsync().catch(() => {});

// (onboarding)/index.tsx and (tabs)/index.tsx both resolve to the same URL
// ("/" — route groups don't appear in the path), so they can't both be
// mounted at once: expo-router has no reliable way to pick between two
// screens claiming the same path, and `initialRouteName` doesn't resolve
// that collision (it only affects back-navigation inside a single already-
// mounted navigator). Stack.Protected guards which one is actually mounted,
// and reacts live via useMMKVBoolean so finishing onboarding flips it
// automatically — no manual navigation call needed.
function StackLayout() {
  const [onboardingComplete] = useMMKVBoolean(STORAGE_KEYS.onboardingComplete, mmkv);

  return (
    <Stack screenOptions={{}}>
      <Stack.Protected guard={!onboardingComplete}>
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!!onboardingComplete}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Screen
        name="quick-log"
        options={{
          headerShown: false,
          presentation: "transparentModal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}

export default function Layout() {
  const [fontsLoaded, fontError] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    JetBrainsMono_700Bold,
  });

  useEffect(() => {
    // Initialize services on app launch
    // Ads + purchases disabled for now — everyone gets Pro
    reconcileMissedNotifications();
  }, []);

  const onLayoutRootView = useCallback(() => {
    // Render on success *or* failure: a missing font should degrade to the
    // system face, never leave the user staring at the splash forever.
    if (fontsLoaded || fontError) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <KeyboardProvider>
        <I18nextProvider i18n={i18n}>
          <AppThemeProvider>
            <HeroUINativeProvider>
              <TimerProvider>
                <StackLayout />
              </TimerProvider>
            </HeroUINativeProvider>
          </AppThemeProvider>
        </I18nextProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
