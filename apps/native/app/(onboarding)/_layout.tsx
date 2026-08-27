import { Stack } from "expo-router";

// Onboarding is a single mounted route (see index.tsx) that switches between
// its 6 screens via local state instead of router navigation, so there is
// only ever one screen in this stack.
export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
