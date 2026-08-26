# START HERE

You are picking up **SessionReset**, a local-only Expo app that reminds developers when their Claude/Codex AI context windows reset. This file is self-contained.

> Read `AGENT-WORKFLOW.md` first — that is *how* work is done here.
> This file is *what* to build next.

Last updated: end of session 1 (scaffold).

## The rule that comes before everything else

Every screen you build, you build from its design file. Currently there are no design files — screens are described in `systems/06-onboarding.md` and `systems/07-screens.md`. When designs arrive, they take precedence.

## Your task

**Phase 1 — Foundations (no UI):**
1. Run `plans/01-infrastructure.md` — T01 through T08
2. Run `plans/02-notifications.md` — T09 through T14

**Phase 2 — Core screens:**
3. Run `plans/03-onboarding.md` — T15 through T22
4. Run `plans/04-dashboard.md` — T23 through T30
5. Run `plans/05-settings.md` — T31 through T36

**Phase 3 — Monetization:**
6. Run `plans/06-ads-iap.md` — T37 through T44

Start with T01 in `plans/01-infrastructure.md`. One todo, one commit.

## What SessionReset is, in five rules

1. **No backend server.** All computation, storage, and scheduling on-device.
2. **No user accounts.** Works instantly.
3. **Expo managed workflow.** Native builds via EAS for production features.
4. **Two platforms: Claude and Codex.** Each has a 5-hour rolling window.
5. **100% on-device data.** No analytics, no telemetry.

## What is already built

- Turborepo monorepo scaffold (Expo native + Next.js web + shared packages)
- Expo 57 with expo-router, Uniwind, HeroUI Native, Reanimated, Gesture Handler
- Shared packages: config (tsconfig), env (t3-env), ui (shadcn — web only)
- **Nothing app-specific yet.** All SessionReset code is ahead.

## Read this before you write a line

- The native app is at `apps/native/`. Do not touch `apps/web/` — it's out of scope.
- `packages/ui` has shadcn components for web. Native uses `heroui-native` — check before importing.
- MMKV is synchronous. No need for async/await on reads.
- AdMob requires native build — will not work in Expo Go.
- One timer per platform max. New log replaces old timer for same platform.
- `systems/09-decisions.md` is empty. Add decisions as you make them.

## How to work here

- One todo, one commit. See plan files for commit message format.
- Change the plan first if the plan is wrong. Add `**Note (session N):**`.
- Update the changelog with reasoning, not just file lists.
- Run `pnpm check-types` after each change.

## Where things are

| Path | What | Tracked |
|------|------|---------|
| `apps/native/` | Expo app (our focus) | Yes |
| `packages/config/` | Shared tsconfig | Yes |
| `packages/env/` | Environment validation | Yes |
| `packages/ui/` | Web UI components (out of scope) | Yes |
| `systems/` | Architecture docs | No (gitignored) |
| `plans/` | Task breakdowns | No (gitignored) |
| `progress/` | Session memory | No (gitignored) |
| `designs/` | Design source (empty) | Partial |

## Open items, in priority order

1. No design files yet — screens are described in prose only
2. Bundle identifier is `com.anonymous.sessionreset` — needs real one before App Store
3. AdMob app IDs need real values before native build
4. Founder name for onboarding note not finalized

## The test

**When a developer hits a Claude rate limit and opens SessionReset, can they log it and walk away knowing exactly when they'll be unblocked — with zero friction, zero accounts, and zero server calls?**
