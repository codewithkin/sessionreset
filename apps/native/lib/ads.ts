import { Platform } from "react-native";
import { storage } from "./storage";

// AdMob unit IDs — replace with real IDs before production
const AD_UNITS = {
  banner: Platform.select({
    ios: "ca-app-pub-xxxxx/banner",
    android: "ca-app-pub-xxxxx/banner",
  }),
  interstitial: Platform.select({
    ios: "ca-app-pub-xxxxx/interstitial",
    android: "ca-app-pub-xxxxx/interstitial",
  }),
  rewarded: Platform.select({
    ios: "ca-app-pub-xxxxx/rewarded",
    android: "ca-app-pub-xxxxx/rewarded",
  }),
};

let interstitialShownThisSession = false;

export async function initializeAds(): Promise<void> {
  // RNGMA initialization — requires native build
  // mobileAds().initialize()
}

export function shouldShowBanner(): boolean {
  return !storage.settings.get().isPro;
}

export function canShowInterstitial(): boolean {
  if (storage.settings.get().isPro) return false;
  if (interstitialShownThisSession) return false;
  return true;
}

export function markInterstitialShown(): void {
  interstitialShownThisSession = true;
}

export async function showRewardedAd(): Promise<boolean> {
  // RNIAP rewarded ad — requires native build
  // On completion:
  // const settings = storage.settings.get();
  // storage.settings.set({ ...settings, isPro: true, proExpiresAt: Date.now() + 24*60*60*1000 });
  // return true;
  return false;
}
