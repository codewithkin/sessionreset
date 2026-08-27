import "@/global.css";
import { useEffect } from 'react';
import { Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { AppThemeProvider } from "@/contexts/app-theme-context";
import { storage } from "@/lib/storage";

export const unstable_settings = {
  initialRouteName: "(drawer)",
};

function StackLayout() {
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ title: "Modal", presentation: "modal" }} />
    </Stack>
  );
}

export default function Layout() {
  useEffect(() => {
    const testTimers = storage.timers.get();
    console.log('[Storage Test] Initial timers:', testTimers);
    storage.timers.set([{ id: 'test-1', platform: 'claude', startTime: Date.now(), resetTime: Date.now() + 18000000, preResetAlert: true, active: true }]);
    const afterSet = storage.timers.get();
    console.log('[Storage Test] After set:', afterSet);
    storage.timers.set([]);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <AppThemeProvider>
          <HeroUINativeProvider>
            <StackLayout />
          </HeroUINativeProvider>
        </AppThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
