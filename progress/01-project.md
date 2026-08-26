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
3. **Onboarding** — 7-screen personalized first-launch experience
4. **Settings** — Sound profiles, data export, restore purchases
5. **Monetization** — Free tier with ads (AdMob) + $1.99 lifetime Pro (remove ads)
6. **Rewarded ads** — Watch 15s video for 24h temporary Pro access

## What it is NOT

- Not a backend service
- Not an API client
- Not an analytics platform
- Not a team tool — single-user, local-only

## Tech stack

- Expo 57 + expo-router
- Uniwind (Tailwind for React Native)
- HeroUI Native
- react-native-mmkv (storage)
- expo-notifications (local)
- react-native-google-mobile-ads (AdMob)
- react-native-iap (purchases)

## Non-negotiables

1. No backend server — ever
2. No user accounts — ever
3. 100% on-device data — no telemetry, no analytics
4. One todo, one commit — enforced by plan files
5. Every screen built from its design file — when designs exist
