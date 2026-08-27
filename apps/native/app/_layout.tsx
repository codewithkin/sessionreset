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

    // Test settings
    const initialSettings = storage.settings.get();
    console.log('[Storage Test] Initial settings:', initialSettings);
    storage.settings.set({ ...initialSettings, isPro: true, notificationSound: 'radar' });
    const updatedSettings = storage.settings.get();
    console.log('[Storage Test] Updated settings:', updatedSettings);
    storage.settings.set(initialSettings);

    // Test usage log
    const initialLogs = storage.usageLog.get();
    console.log('[Storage Test] Initial logs:', initialLogs);
    storage.usageLog.set([...initialLogs, { id: 'log-1', platform: 'claude', hitAt: Date.now(), resetAt: Date.now() + 18000000 }]);
    const afterLog = storage.usageLog.get();
    console.log('[Storage Test] After add log:', afterLog);
    storage.usageLog.set([]);
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
