# START HERE

You are picking up **SessionReset**, a local-only Expo app that reminds developers when their Claude/Codex AI context windows reset. This file is self-contained.

> Read `AGENT-WORKFLOW.md` first — that is *how* work is done here.
> This file is *what* to build next.

Last updated: end of session 4 (onboarding rebuilt as a single-route state machine, matched pixel-for-pixel to `designs/extracted/all-screens-template.html`).

## The rule that comes before everything else

Every screen you build, you build from its design file. Design specs are in `designs/screens.md` and the design system is in `systems/03-design-system.md`. Design tokens are in `apps/native/lib/tokens.ts`.

## What SessionReset is, in five rules

1. **No backend server.** All computation, storage, and scheduling on-device.
2. **No user accounts.** Works instantly.
3. **Expo managed workflow.** Native builds via EAS for production features.
4. **Two platforms: Claude and Codex.** Each has a 5-hour rolling window.
5. **100% on-device data.** No analytics, no telemetry.

## What is already built

- Turborepo monorepo scaffold (Expo native + Next.js web)
- Expo 57 with expo-router, Uniwind, HeroUI Native, Reanimated, Gesture Handler
- **All 44 plan todos completed** (infrastructure, notifications, onboarding, dashboard, settings, ads/IAP)
- **10 languages** via i18next + expo-localization
- **Design tokens** (`lib/tokens.ts`) — 540 lines, full light/dark palettes, component tokens
- **Dark mode** — all 15 screens use `useAppTheme()` + token references
- **Animations** — spring damping 0.8 on bottom sheets, press scale on all buttons, quiz chip ZoomIn
- **Haptic feedback** — Light impact on iOS for primary actions
- **Settings** — Notifications section, pre-reset alert toggle, Contact/Feedback row
- **Quick-Log** — No default service, CTA disabled until selected, spring animation
- **Dashboard** — Pull-to-refresh, empty state icon, + Log Limit Hit FAB
- **AdMob removed** — Incompatible with Expo SDK 57 (Kotlin 2.3 vs 2.1.20)
- **RevenueCat IAP** — Installed but disabled (everyone gets Pro)
- **Website** — Next.js with privacy/terms pages, Dockerfile for Coolify
- **Play Store listing** — EN + 9 locale translations
- **EAS build** — 823 KB archive, prebuild succeeds, 0 TypeScript errors

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

## Where things are

| Path | What | Tracked |
|------|------|---------|
| `apps/native/` | Expo app (our focus) | Yes |
| `apps/web/` | Next.js website | Yes |
| `designs/` | Design specs + Play Store listing | Yes |
| `systems/` | Architecture docs | No (gitignored) |
| `plans/` | Task breakdowns | No (gitignored) |
| `progress/` | Session memory | No (gitignored) |

## How to work here

- One todo, one commit. See plan files for commit message format.
- Change the plan first if the plan is wrong. Add `**Note (session N):**`.
- Update the changelog with reasoning, not just file lists.
- Run `npx tsc --noEmit` after each change.

## Open items, in priority order

1. AdMob re-add when Expo SDK supports Kotlin 2.3+
2. RevenueCat IAP activation when ready to monetize
3. Rewarded Ad Modal (Screen 10) — not yet implemented
4. Banner Ad on dashboard (free tier) — not yet implemented
5. Settings: Power Features section placeholder preserved
6. Tab Bar navigation (spec says tabs, currently drawer)
7. Quick-Log should use `@gorhom/bottom-sheet` for proper gesture handling

## The test

**When a developer hits a Claude rate limit and opens SessionReset, can they log it and walk away knowing exactly when they'll be unblocked — with zero friction, zero accounts, and zero server calls?**
