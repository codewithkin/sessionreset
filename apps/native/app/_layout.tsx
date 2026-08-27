import "@/global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { I18nextProvider } from "react-i18next";

import { AppThemeProvider } from "@/contexts/app-theme-context";
import { TimerProvider } from "@/contexts/TimerContext";
import i18n from "@/lib/i18n";
import { storage } from "@/lib/storage";
import { reconcileMissedNotifications } from "@/lib/notifications";

export const unstable_settings = {
  initialRouteName: storage.onboarding.isComplete()
    ? "(drawer)"
    : "(onboarding)",
};

function StackLayout() {
  const initialRoute = storage.onboarding.isComplete()
    ? "(drawer)"
    : "(onboarding)";

  return (
    <Stack screenOptions={{}} initialRouteName={initialRoute}>
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
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
