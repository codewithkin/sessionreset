import "@/global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { I18nextProvider } from "react-i18next";
import { useMMKVBoolean } from "react-native-mmkv";

import { AppThemeProvider } from "@/contexts/app-theme-context";
import { TimerProvider } from "@/contexts/TimerContext";
import i18n from "@/lib/i18n";
import { mmkv, STORAGE_KEYS } from "@/lib/storage";
import { reconcileMissedNotifications } from "@/lib/notifications";

// (onboarding)/index.tsx and (drawer)/index.tsx both resolve to the same URL
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
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
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
  useEffect(() => {
    // Initialize services on app launch
    // Ads + purchases disabled for now — everyone gets Pro
    reconcileMissedNotifications();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
