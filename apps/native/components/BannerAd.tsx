import { Platform, View } from "react-native";
import { BannerAd as AdMobBannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";
import Constants from "expo-constants";

import { shouldShowBanner } from "@/lib/ads";
import { colors } from "@/lib/tokens";

function bannerUnitId(): string {
  const raw = (Constants.expoConfig?.extra?.ads ?? {}) as { bannerUnitId?: string };
  // Real ID lives in app.json; Google's sample unit is served only when it's missing.
  return raw.bannerUnitId ?? TestIds.BANNER;
}

export function BannerAd() {
  const bg = colors.light.bg;

  if (!shouldShowBanner()) return null;
  if (Platform.OS === "web") return null;

  return (
    <View
      style={{
        minHeight: 50,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 20,
        marginTop: 8,
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: bg,
      }}
    >
      <AdMobBannerAd
        unitId={bannerUnitId()}
        size={BannerAdSize.INLINE_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}
