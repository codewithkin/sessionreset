# Changelog

Newest first.

---

## Session 4

**Onboarding rebuilt as a single-route state machine, rewritten pixel-for-pixel against `designs/extracted/all-screens-template.html`.**

### Onboarding architecture change
- `(onboarding)/quiz.tsx`, `founder-note.tsx`, `paywall.tsx`, `notifications.tsx`, `starter.tsx` deleted — replaced by step components inside `(onboarding)/index.tsx`, switched via local `step` state (0–5) instead of `router.push`. Removes the visible screen-to-screen transition the old multi-route version had; the only navigation left is the single `router.replace("/(drawer)")` when onboarding completes.
- `(onboarding)/_layout.tsx` simplified to one `Stack.Screen`.
- Root `_layout.tsx` was already resolving `storage.onboarding.isComplete()` synchronously (MMKV) for `initialRouteName`, so app launch already lands directly on the right group with no flash — left as-is.

### Design accuracy fixes (against the extracted HTML, not the old hand-built version)
- Screen 01: replaced the placeholder checkmark icon with the actual "Rate Limit Hit → 05:00:00 → 00:00:00 → Back to Code" status rail from the mockup, with a looping highlight sweep (Reanimated `interpolate` over a repeating shared value) standing in for the spec'd frame animation.
- Screen 03 (Founder Note): removed a headline that isn't in the design; moved the attribution line outside/below the quote card to match.
- Screen 04 (Paywall): price card's "LIFETIME" tag was a filled pill — design has it as plain accent-colored text; moved the "Lifetime Pro • …" line inside the price card (was a separate paragraph below it); paywall CTA now branches on `settings.isPro` (already `true` for everyone) and shows the design's own "You're Pro ✓" state instead of always showing "Unlock Lifetime Pro".
- Screen 05 (Notifications): mock notification icon was a bell/clock glyph — design uses an "SR" wordmark badge; added the missing "Local alarms only • nothing leaves the device" footer line; split the preview header into app name + relative time (two elements, design has them at opposite ends of the row) instead of one concatenated string.
- Quiz frequency pills were single-line; design shows two lines (bold number + muted unit, e.g. "1–2" / "a week") — rebuilt to match.

### Trade-offs (see chat for full list)
- RevenueCat purchase and AdMob ad calls were intentionally **not** wired into the rebuilt paywall — pressing "Unlock Lifetime Pro" shows a placeholder alert instead of calling the real (placeholder-keyed) `purchases.ts` SDK. `settings.tsx`'s now-dead "Unlock Pro" entry point (unreachable while `isPro` defaults to `true`) was pointed at the same placeholder instead of the deleted `/(onboarding)/paywall` route it used to push to.
- New/changed onboarding copy (paywall headline, quiz "pick all that apply", frequency pill sub-labels, notification footer, etc.) was only added to `en.json`. The other 9 locale files fall back to English for these specific strings via `fallbackLng: 'en'` rather than risk unverified translations.
- Kept the design's literal `$14.99` strikethrough out of `en.json` — using it would have put English out of sync with the other 9 locales' already-localized "original price" (₹349, ¥590, etc.), all pegged to the product-decided $4.99 → $1.99 discount from `systems/06-onboarding.md`. Treated the mockup's number as illustrative, not the source of truth.
- Added `storage.onboarding.{get,set}QuizAnswers` (was speced in T22 but never actually implemented) so quiz answers persist; nothing downstream reads them yet (paywall checklist is fixed, not quiz-tailored, matching the actual design mockup rather than the older systems-doc description of a tailored checklist).

---

## Session 3

**Design token adoption, dark mode, animation polish, interaction fixes, missing features.**

### Design tokens + dark mode (commit `bbe9c43`)
- Created `useThemeColor` hook for theme-aware color access
- All 15 screens now use `tokens.ts` for colors, spacing, typography, shadows
- Full dark mode support via `useAppTheme()` — all screens toggle correctly
- Dark color palette expanded to match light (accentHover, warningDark, link, etc.)
- Drawer layout themed for dark mode
- TimerCard, Quick-Log, Settings, History, Alerts all tokenized

### Missing features implemented (commits `906c927` through `87ba3fd`)
- **Quick-Log**: No default service selection, CTA disabled until service picked
- **Starter**: "I'm Blocked Right Now" opens Quick-Log sheet instead of creating timer directly
- **Dashboard**: Pull-to-refresh with RefreshControl, calls `refreshTimers()`
- **Settings**: Notifications section (sound row, pre-reset alert toggle), Contact/Feedback row with mailto link, Ionicons on all rows
- **Notifications screen**: Auto-navigates to starter when permissions already granted

### Animation polish (commits `1bcfe89` through `1f70e9a`)
- **Quick-Log**: `SlideInDown.springify().damping(0.8)` for natural spring feel
- **PressableScale component**: New reusable component with 0.96 scale + spring damping 0.8
- **Haptic feedback**: Light impact on iOS for all primary button presses
- Applied PressableScale to all CTA buttons, FAB, service selectors, offset pills, quiz chips across 8 screens
- **Animation timings**: All fade-in animations corrected to 300ms (was 400-500ms)
- **Quiz chip selection**: ZoomIn.springify().damping(0.8) on checkbox appearance

### Interaction fixes (commit `c871b3f`)
- FAB label: "Log Limit Hit" → "+ Log Limit Hit"
- FAB text/icon: `#FFFFFF` → `c.textOnAccent` (dark mode fix)
- Settings header: "Done" text → X close icon (left-aligned), title 19px/800
- Notifications card: emoji ⏱ → Ionicons `time-outline`
- Dashboard empty state: added `timer-outline` icon (48px)
- Quiz cards: dark mode border colors fixed (was always using light variant)

### Prebuild
- `expo prebuild --platform android --clean` succeeded
- 0 TypeScript errors

---

## Session 2

**Core implementation — all 44 plan todos completed, ads removed, website deployed.**

### Plans 01-06 completed
- All 44 todos from plans/01 through plans/06 implemented
- Infrastructure, notifications, onboarding, dashboard, settings, ads/IAP
- Agent workflow enforced: one todo, one commit

### AdMob removed
- `react-native-google-mobile-ads` required Kotlin 2.3.0 (incompatible with Expo SDK 57's Kotlin 2.1.20)
- Removed entirely — `lib/ads.ts` is a clean no-op stub
- Will re-add when Expo SDK supports Kotlin 2.3+

### RevenueCat IAP (disabled)
- `react-native-purchases` + `react-native-purchases-ui` installed
- `lib/purchases.ts` wired but placeholder keys
- `DEFAULT_SETTINGS.isPro = true` — everyone gets Pro, purchase code preserved but inactive

### Website
- Next.js app at `apps/web/` with `/`, `/privacy`, `/terms`
- Privacy policy covers device data, Expo, AdMob (future), RevenueCat (future), notifications
- Dockerfile + .dockerignore for Coolify deployment
- Web build succeeds on Coolify

### Design system
- `lib/tokens.ts` — ~250 tokens extracted from design HTML
- `designs/screens.md` — 10-screen spec
- `designs/play-console-listing.md` — EN listing
- `designs/play-console-translations.md` — 9 locale translations
- `designs/google-play-listing.md` — Screenshot text

### Other
- i18next + 10 language files
- EAS archive: 823 KB (under 10MB target)
- `.easignore` excludes web/, designs/, plans/, systems/, progress/
- JetBrains Mono + Manrope fonts loaded

---

## Session 1

**Scaffolded the agent workflow system — directories, systems docs, plans, and progress tracking.**

### Infrastructure
- Created `designs/`, `systems/`, `plans/`, `progress/` directory structure
- Updated `.gitignore` to exclude working directories
- Added `.gitattributes` for line-ending policy (`* text=auto eol=lf`)

### Systems docs
- Wrote 10 systems documents (00-index through 09-decisions)
- Architecture, data layer, notifications, monetization, onboarding, screens, tone
- Design system placeholder awaiting design files
- Decision log empty, ready for first entries

### Plans
- Wrote roadmap (`00-roadmap.md`) with 3 phases: Foundations, Core Screens, Monetization
- Decomposed all features into 44 commit-sized todos across 6 plan files

### Progress
- Wrote START-HERE.md, project description, changelog
- Copied AGENT-WORKFLOW.md into progress/
