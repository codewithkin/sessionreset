import { View, Text, ScrollView } from "react-native";
import { storage } from "@/lib/storage";

export default function HistoryScreen() {
  const allTimers = storage.timers.get();
  const inactive = allTimers
    .filter((t) => !t.active)
    .sort((a, b) => b.resetTime - a.resetTime);

  const grouped = inactive.reduce(
    (acc, t) => {
      const date = new Date(t.resetTime).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(t);
      return acc;
    },
    {} as Record<string, typeof inactive>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 18 }}>
        <Text
          style={{
            fontFamily: "Manrope",
            fontSize: 22,
            fontWeight: "800",
            letterSpacing: -0.5,
            color: "#17181A",
          }}
        >
          History
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      >
        {inactive.length === 0 ? (
          <View style={{ alignItems: "center", paddingTop: 120 }}>
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: 16,
                fontWeight: "500",
                color: "#9DA1A7",
              }}
            >
              No past timers yet.
            </Text>
          </View>
        ) : (
          Object.entries(grouped).map(([date, timers]) => (
            <View key={date} style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontFamily: "Manrope",
                  fontSize: 15,
                  fontWeight: "700",
                  color: "#17181A",
                  marginBottom: 10,
                }}
              >
                {date}
              </Text>
              {timers.map((t) => (
                <View
                  key={t.id}
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
                  <Text
                    style={{
                      fontFamily: "JetBrains Mono",
                      fontSize: 12,
                      fontWeight: "500",
                      color: "#6C7076",
                    }}
                  >
                    {new Date(t.resetAt ?? t.resetTime).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
