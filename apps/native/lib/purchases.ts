import { Platform } from "react-native";
import { storage } from "./storage";

export const PRODUCT_ID = "com.codewithkin.sessionreset.pro lifetime";

export async function initializePurchases(): Promise<void> {
  // RNIAP initialization — requires native build
  // Will be wired up in Plan 06 T42-T43
}

export async function purchaseLifetimePro(): Promise<boolean> {
  try {
    // RNIAP purchase flow — requires native build
    // On success:
    // storage.settings.set({ ...storage.settings.get(), isPro: true, proExpiresAt: null });
    // return true;
    return false;
  } catch {
    return false;
  }
}

export async function restorePurchases(): Promise<boolean> {
  try {
    // RNIAP restore flow — requires native build
    // On success with valid receipt:
    // storage.settings.set({ ...storage.settings.get(), isPro: true, proExpiresAt: null });
    // return true;
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
