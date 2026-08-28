import Constants from "expo-constants";
import { Platform } from "react-native";

import { isProActive } from "./purchases";
import { storage } from "./storage";

/**
 * ── Advertising ────────────────────────────────────────────────────────────
 * react-native-google-mobile-ads@16.3.4 (matches Word Hug, works on Expo SDK
 * 57). Every placement is defensive: the native module is absent on web and
 * in Expo Go, AdMob can be blocked/unfilled, and none of that may ever reach
 * the user as an unhandled error. An ad failing is the app's normal day; a
 * crash is not.
 *
 * Monetization model = live freemium (chosen session 7):
 *   - Free users (isPro false) see a dashboard banner + an interstitial once
 *     per app session after logging a limit.
 *   - Any user can watch a rewarded ad in Settings for 10 hours of Pro
 *     (sets proExpiresAt via lib/ads → grantProForHours).
 *   - IAP remains inactive; rewarded ad is the only Pro path for now.
 */

export type RewardResult = "earned" | "dismissed" | "unavailable";

interface AdsExtra {
  enabled?: boolean;
  bannerUnitId?: string;
  interstitialUnitId?: string;
  rewardedUnitId?: string;
}

/** Google sample units — safe to serve, earn nothing. Swapped only if the
 *  real IDs are missing from `app.json` → `extra.ads`. */
const TEST_BANNER = "ca-app-pub-3940256099942544/6300978111";
const TEST_INTERSTITIAL = "ca-app-pub-3940256099942544/1033173712";
const TEST_REWARDED = "ca-app-pub-3940256099942544/5224354917";

function extra(): Required<AdsExtra> {
  const raw = (Constants.expoConfig?.extra?.ads ?? {}) as AdsExtra;
  return {
    enabled: raw.enabled ?? false,
    bannerUnitId: raw.bannerUnitId ?? TEST_BANNER,
    interstitialUnitId: raw.interstitialUnitId ?? TEST_INTERSTITIAL,
    rewardedUnitId: raw.rewardedUnitId ?? TEST_REWARDED,
  };
}

/** Synchronous gate for deciding whether an ad surface renders at all. */
export function adsAvailable(): boolean {
  return extra().enabled && Platform.OS !== "web";
}

type AdsModule = typeof import("react-native-google-mobile-ads");

let cachedModule: AdsModule | null = null;

async function loadModule(): Promise<AdsModule | null> {
  if (cachedModule) return cachedModule;
  try {
    cachedModule = await import("react-native-google-mobile-ads");
    return cachedModule;
  } catch {
    return null;
  }
}

let initPromise: Promise<AdsModule | null> | null = null;

async function ensureReady(): Promise<AdsModule | null> {
  if (!adsAvailable()) return null;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const m = await loadModule();
    if (!m) return null;
    try {
      await m.MobileAds().initialize();
    } catch {
      return null;
    }
    return m;
  })();

  return initPromise;
}

/** Called once at app launch; fire-and-forget. Safe on every platform. */
export async function initializeAds(): Promise<void> {
  await ensureReady();
}

export function shouldShowBanner(): boolean {
  return adsAvailable() && !isProActive();
}

// ── Interstitial (once per app session, free tier only) ───────────────────

let interstitialShownThisSession = false;

export function canShowInterstitial(): boolean {
  if (!adsAvailable()) return false;
  if (interstitialShownThisSession) return false;
  if (isProActive()) return false;
  return true;
}

export async function showInterstitial(): Promise<void> {
  if (!canShowInterstitial()) return;
  interstitialShownThisSession = true; // claim the slot up front

  const m = await ensureReady();
  if (!m) return;

  await new Promise<void>((resolve) => {
    let settled = false;
    let unsubscribe: () => void = () => {};

    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(guard);
      unsubscribe();
      resolve();
    };

    const ad = m.InterstitialAd.createForAdRequest(extra().interstitialUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    const subLoaded = ad.addAdEventListener(m.AdEventType.LOADED, () => {
      try {
        ad.show();
      } catch {
        finish();
      }
    });
    const subClosed = ad.addAdEventListener(m.AdEventType.CLOSED, finish);
    const subError = ad.addAdEventListener(m.AdEventType.ERROR, finish);
    unsubscribe = () => {
      subLoaded();
      subClosed();
      subError();
    };

    // No fill can simply hang. Twenty seconds is longer than any sane load.
    const guard = setTimeout(finish, 20_000);

    try {
      ad.load();
    } catch {
      finish();
    }
  });
}

// ── Rewarded (10 hours of Pro) ─────────────────────────────────────────────

const TEN_HOURS_MS = 10 * 60 * 60 * 1000;

/** Persists the Pro grant. Caller decides when (only after 'earned'). */
export function grantProForHours(hours: number): void {
  const settings = storage.settings.get();
  const base = settings.proExpiresAt && settings.proExpiresAt > Date.now() ? settings.proExpiresAt : Date.now();
  storage.settings.set({
    ...settings,
    isPro: true,
    proExpiresAt: base + hours * 60 * 60 * 1000,
  });
}

const FALLBACK_REWARD_HOURS = 10;

/**
 * One rewarded view. Resolves exactly once:
 * - 'earned'      — reward event fired; caller grants Pro via storage
 * - 'dismissed'   — closed before completion; grant nothing
 * - 'unavailable' — offline, no fill, or SDK missing
 */
export async function showRewardedAd(): Promise<RewardResult> {
  const m = await ensureReady();
  if (!m) return "unavailable";

  return new Promise<RewardResult>((resolve) => {
    let settled = false;
    let earned = false;
    let shown = false;
    let unsubscribe: () => void = () => {};

    const finish = (result: RewardResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(guard);
      unsubscribe();
      resolve(result);
    };

    const ad = m.RewardedAd.createForAdRequest(extra().rewardedUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    const subEarned = ad.addAdEventListener(m.RewardedAdEventType.EARNED_REWARD, () => {
      earned = true;
    });
    const subLoaded = ad.addAdEventListener(m.RewardedAdEventType.LOADED, () => {
      try {
        ad.show();
        shown = true;
      } catch {
        finish("unavailable");
      }
    });
    const subClosed = ad.addAdEventListener(m.AdEventType.CLOSED, () => {
      finish(shown ? (earned ? "earned" : "dismissed") : "unavailable");
    });
    const subError = ad.addAdEventListener(m.AdEventType.ERROR, () => {
      finish("unavailable");
    });
    unsubscribe = () => {
      subEarned();
      subLoaded();
      subClosed();
      subError();
    };

    const guard = setTimeout(() => {
      if (!shown) finish("unavailable");
    }, 20_000);

    try {
      ad.load();
    } catch {
      finish("unavailable");
    }
  });
}

export { FALLBACK_REWARD_HOURS, TEN_HOURS_MS };
