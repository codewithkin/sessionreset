import Purchases, { PurchasesPackage } from "react-native-purchases";
import { Platform } from "react-native";
import { storage } from "./storage";

const REVENUECAT_API_KEY = Platform.select({
  ios: "appl_YOUR_REVENUECAT_API_KEY",
  android: "goog_YOUR_REVENUECAT_API_KEY",
})!;

let initialized = false;

export async function initializePurchases(): Promise<void> {
  if (initialized) return;
  try {
    Purchases.configure({ apiKey: REVENUECAT_API_KEY });
    initialized = true;
  } catch {
    // RevenueCat not available in dev
  }
}

export async function getOfferings(): Promise<PurchasesPackage | null> {
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
    const entitles = result.customerInfo.entitlements.active;
    if (entitles["pro"]) {
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

export async function restorePurchases(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    const entitles = customerInfo.entitlements.active;
    if (entitles["pro"]) {
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
