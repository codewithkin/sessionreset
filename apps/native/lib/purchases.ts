import Purchases, { PurchasesPackage } from "react-native-purchases";
import { Platform } from "react-native";
import { storage } from "./storage";

const REVENUECAT_API_KEY = Platform.select({
  ios: "appl_YOUR_REVENUECAT_API_KEY",
  android: "goog_ZizeZnPCSCDSjjcjoNySCHViRIW",
})!;

/** Must match the entitlement identifier created in the RevenueCat dashboard. */
const PRO_ENTITLEMENT = "session_reset_pro";

let initialized = false;

export async function initializePurchases(): Promise<void> {
  if (initialized) return;
  // Lazy-init is also called on demand below (offering fetch), so the paywall
  // never races app-launch initialisation.
  try {
    Purchases.configure({
      apiKey: REVENUECAT_API_KEY,
      // Store the purchase state locally ourselves (storage is the source of
      // truth); RC just performs the transaction and reports entitlements.
    });
    initialized = true;
  } catch {
    // RevenueCat not available (dev / offline) — fall through to null results.
  }
}

async function ensureInitialized(): Promise<void> {
  await initializePurchases();
}

export async function getOfferings(): Promise<PurchasesPackage | null> {
  await ensureInitialized();
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current?.availablePackages[0] ?? null;
  } catch {
    return null;
  }
}

export async function purchaseLifetimePro(): Promise<boolean> {
  try {
    const pkg = await getOfferings();
    if (!pkg) return false;

    const result = await Purchases.purchasePackage(pkg);
    const entitlements = result.customerInfo.entitlements.active;
    if (entitlements[PRO_ENTITLEMENT]) {
      const settings = storage.settings.get();
      storage.settings.set({
        ...settings,
        isPro: true,
        proExpiresAt: null, // non-consumable → permanent
      });
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function restorePurchases(): Promise<boolean> {
  await ensureInitialized();
  try {
    const customerInfo = await Purchases.restorePurchases();
    const entitlements = customerInfo.entitlements.active;
    if (entitlements[PRO_ENTITLEMENT]) {
      const settings = storage.settings.get();
      storage.settings.set({
        ...settings,
        isPro: true,
        proExpiresAt: null,
      });
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function isProActive(): boolean {
  const settings = storage.settings.get();
  if (!settings.isPro) return false;
  if (settings.proExpiresAt === null) return true; // lifetime
  return Date.now() < settings.proExpiresAt;
}
