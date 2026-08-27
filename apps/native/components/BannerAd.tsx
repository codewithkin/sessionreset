import { View, Text } from "react-native";
import { useThemeColor } from "heroui-native";
import { shouldShowBanner } from "@/lib/ads";
import { fontFamily } from "@/lib/tokens";

export function BannerAd() {
  const bg = useThemeColor("background");

  if (!shouldShowBanner()) return null;

  return (
    <View
      style={{
        height: 58,
        borderRadius: 10,
        backgroundColor: bg === "#000000" ? "#111111" : "#F0F1F3",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 20,
      }}
    >
      <Text
        style={{
          fontFamily: fontFamily.mono[500],
          fontSize: 11,
          color: bg === "#000000" ? "#8A8A8A" : "#6C7076",
        }}
      >
        BANNER AD
      </Text>
    </View>
  );
}
