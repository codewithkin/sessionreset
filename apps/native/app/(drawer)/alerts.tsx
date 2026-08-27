import { View, Text, ScrollView } from "react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { storage } from "@/lib/storage";

export default function AlertsScreen() {
  const settings = storage.settings.get();
  const timers = storage.timers.getActive();
  const withAlert = timers.filter((t) => t.preResetAlert);

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <Animated.View
        entering={FadeIn.duration(400)}
        style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 18 }}
      >
        <Text
          style={{
            fontFamily: "Manrope",
            fontSize: 22,
            fontWeight: "800",
            letterSpacing: -0.5,
            color: "#17181A",
          }}
        >
          Alerts
        </Text>
      </Animated.View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      >
        {/* Alert status */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(100)}
          style={{
            backgroundColor: "#F5F6F7",
            borderRadius: 14,
            padding: 18,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontFamily: "Manrope",
              fontSize: 15,
              fontWeight: "700",
              color: "#17181A",
              marginBottom: 4,
            }}
          >
            Pre-Reset Alerts
          </Text>
          <Text
            style={{
              fontFamily: "Manrope",
              fontSize: 13,
              fontWeight: "500",
              color: "#6C7076",
            }}
          >
            {settings.preResetAlertEnabled
              ? "Enabled — You'll get notified 15 minutes before each reset."
              : "Disabled — Turn on to get notified before resets."}
          </Text>
        </Animated.View>

        {/* Active alerts */}
        {withAlert.length > 0 ? (
          <Animated.View entering={FadeInDown.duration(400).delay(200)}>
            <Text
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: 11,
                fontWeight: "700",
                letterSpacing: 1.4,
                color: "#9DA1A7",
                marginBottom: 10,
              }}
            >
              ACTIVE ALERTS
            </Text>
            {withAlert.map((t, index) => (
              <Animated.View
                key={t.id}
                entering={FadeInDown.duration(400).delay(300 + index * 80)}
                style={{
                  backgroundColor: "#F5F6F7",
                  borderRadius: 14,
                  padding: 16,
                  marginBottom: 8,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 50,
                      backgroundColor:
                        t.platform === "claude" ? "#CC785C" : "#10A37F",
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: "Manrope",
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#17181A",
                    }}
                  >
                    {t.platform === "claude" ? "Claude" : "Codex"}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "#3B82F6",
                    borderRadius: 999,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "JetBrains Mono",
                      fontSize: 11,
                      fontWeight: "700",
                      color: "#FFFFFF",
                    }}
                  >
                    15m
                  </Text>
                </View>
              </Animated.View>
            ))}
          </Animated.View>
        ) : (
          <Animated.View
            entering={FadeInDown.duration(500).delay(200)}
            style={{ alignItems: "center", paddingTop: 60 }}
          >
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: 16,
                fontWeight: "500",
                color: "#9DA1A7",
              }}
            >
              No active alerts. Enable alerts on your timers to see them here.
            </Text>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
