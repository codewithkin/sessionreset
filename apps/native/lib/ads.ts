// Ads module — placeholder stub
// react-native-google-mobile-ads was removed (requires Kotlin 2.3.0, incompatible with Expo SDK 57)
// Will be re-added when Expo SDK supports Kotlin 2.3+

let interstitialShownThisSession = false;

export async function initializeAds(): Promise<void> {
  // No-op — ads disabled
}

export function shouldShowBanner(): boolean {
  return false; // Ads disabled — everyone gets Pro
}

export function canShowInterstitial(): boolean {
  return false; // Ads disabled
}

export async function showInterstitial(): Promise<void> {
  // No-op — ads disabled
}

export async function showRewardedAd(): Promise<boolean> {
  return false; // Ads disabled
}
