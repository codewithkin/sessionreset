import { Tabs } from "expo-router";

import { TabBar } from "@/components/TabBar";

/**
 * Design screen 07 puts navigation in a bottom bar (Today / History / log FAB
 * / Alerts), not the drawer this app previously used. The bar itself is fully
 * custom because the raised FAB sits between the tab items and is not a route.
 */
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="history" />
      <Tabs.Screen name="alerts" />
    </Tabs>
  );
}
