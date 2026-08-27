import { Platform } from "react-native";
import { storage } from "./storage";

// AdMob config — requires native build to function
// Test IDs are used here; replace with production IDs before release
const AD_UNITS = {
  banner: Platform.select({
    ios: "ca-app-pub-3940256099942544/2934735716",
    android: "ca-app-pub-3940256099942544/6300978111",
  })!,
  interstitial: Platform.select({
    ios: "ca-app-pub-3940256099942544/4411468910",
    android: "ca-app-pub-3940256099942544/1033173712",
  })!,
  rewarded: Platform.select({
    ios: "ca-app-pub-3940256099942544/1712485313",
    android: "ca-app-pub-3940256099942544/7880719434",
  })!,
};

let interstitialShownThisSession = false;

export async function initializeAds(): Promise<void> {
  try {
    const { mobileAds } = require("react-native-google-mobile-ads");
    await mobileAds().initialize();
  } catch {
    // AdMob not available in Expo Go / dev
  }
}

export function shouldShowBanner(): boolean {
  return false; // Ads disabled — everyone gets Pro
}

export async function loadInterstitial(): Promise<void> {
  // Requires native build — stub for Expo Go
}

export function canShowInterstitial(): boolean {
  if (storage.settings.get().isPro) return false;
  if (interstitialShownThisSession) return false;
  return true;
}

export async function showInterstitial(): Promise<void> {
  if (!canShowInterstitial()) return;
  try {
    const { AdMobInterstitial } = require("react-native-google-mobile-ads");
    await AdMobInterstitial.setAdUnitID(AD_UNITS.interstitial);
    await AdMobInterstitial.requestAdAsync();
    await AdMobInterstitial.showAdAsync();
    interstitialShownThisSession = true;
  } catch {
    // Not available in Expo Go
  }
}

export async function showRewardedAd(): Promise<boolean> {
  try {
    const { AdMobRewarded } = require("react-native-google-mobile-ads");
    await AdMobRewarded.setAdUnitID(AD_UNITS.rewarded);
    await AdMobRewarded.requestAdAsync();
    await AdMobRewarded.showAdAsync();
    // If we get here, ad was shown
    const settings = storage.settings.get();
    storage.settings.set({
      ...settings,
      isPro: true,
      proExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    return true;
  } catch {
    return false;
  }
}
