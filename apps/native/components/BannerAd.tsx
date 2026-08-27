import { View, Text } from "react-native";

export function BannerAd() {
  return (
    <View
      style={{
        height: 58,
        borderRadius: 10,
        backgroundColor: "#F0F1F3",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 20,
      }}
    >
      <Text
        style={{
          fontFamily: "JetBrains Mono",
          fontSize: 11,
          color: "#6C7076",
        }}
      >
        BANNER AD
      </Text>
    </View>
  );
}
