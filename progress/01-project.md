# Project — SessionReset

## What it is

A local-only Expo (React Native) mobile app that reminds developers when their Claude / Codex AI context windows reset after hitting 5-hour rolling rate limits.

## Target users

Developers who use Claude (Anthropic) and/or Codex (OpenAI) for coding and regularly hit usage limits that interrupt their flow state.

## Core value proposition

**Never lose your flow state to unexpected AI rate limits.** Log a limit hit, get a precise 5-hour countdown, and receive a notification 15 minutes before your window clears — so you can prepare your next prompt and stay in the zone.

## Key features

1. **Timer tracking** — Log limit hits for Claude and Codex with accurate 5-hour countdowns
2. **Pre-reset alerts** — 15-minute heads-up notification before your window clears
3. **Onboarding** — 6-screen personalized first-launch experience
4. **Settings** — Notifications section, data export, restore purchases, contact
5. **Dark mode** — Full light/dark theme support across all screens
6. **10 languages** — en, es, hi, ar, pt, ru, ja, de, fr, ko
7. **Monetization** — Currently everyone gets Pro (IAP disabled, purchase code preserved)

## What it is NOT

- Not a backend service
- Not an API client
- Not an analytics platform
- Not a team tool — single-user, local-only

## Tech stack

- Expo 57 + expo-router
- Uniwind (Tailwind for React Native)
- HeroUI Native
- react-native-mmkv (encrypted storage)
- expo-notifications (local)
- react-native-reanimated (animations)
- react-native-purchases + react-native-purchases-ui (RevenueCat, disabled)
- i18next + expo-localization (10 languages)
- @expo/vector-icons (Ionicons)

## Monetization status

- **AdMob**: Removed (Kotlin 2.3 incompatible with Expo SDK 57). Will re-add when Expo supports it.
- **RevenueCat IAP**: Installed, wired, but disabled. `DEFAULT_SETTINGS.isPro = true` — everyone gets Pro.
- **Purchase code preserved**: `lib/purchases.ts` has full RevenueCat integration ready to activate.

## Non-negotiables

1. No backend server — ever
2. No user accounts — ever
3. 100% on-device data — no telemetry, no analytics
4. One todo, one commit — enforced by plan files
5. Every screen built from its design file — when designs exist
