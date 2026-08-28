# Changelog

Newest first.

---

## Session 7

**AdMob re-integrated with real ad units — live freemium monetization.**

Package `react-native-google-mobile-ads@16.3.4` (exact match with the Word Hug
project, which builds cleanly on the same Expo SDK 57 — this disproves the
session-2 "requires Kotlin 2.3.0" assumption; that concern applied to a newer
lib version, not this one).

### Ad units (created in AdMob by user)
| Slot | ID |
|------|----|
| App ID | `ca-app-pub-6071419245494198~5833454134` |
| Banner (Dashboard) | `ca-app-pub-6071419245494198/7943295502` |
| Interstitial (Quick-Log, 1/session) | `ca-app-pub-6071419245494198/9103449451` |
| Rewarded (10h Pro) | `ca-app-pub-6071419245494198/4839831469` |

### Model decision — live freemium
- `DEFAULT_SETTINGS.isPro` flipped `true` → `false`. Free users see the
  dashboard banner + one interstitial per app session after logging a limit.
- Rewarded ad in Settings grants 10 hours of Pro via `proExpiresAt` (re-adds
  to any existing window). IAP stays inactive.
- `isProActive()` (lib/purchases) gates all ad surfaces.

### Code
- `app.json`: added `react-native-google-mobile-ads` config plugin with
  `androidAppId` + `extra.ads` (banner/interstitial/rewarded unit IDs,
  `enabled: true`). Verified the plugin injects the AdMob APPLICATION_ID
  meta-data into the generated `AndroidManifest.xml`.
- `lib/ads.ts`: rewrote the no-op stub into a real defensive module (dynamic
  import + `MobileAds().initialize()`, interstitial 1/session guard,
  rewarded `EARNED_REWARD`-gated promise, `grantProForHours()`).
- `BannerAd.tsx`: renders a real `INLINE_ADAPTIVE_BANNER` when `shouldShowBanner()`
  (non-Pro, native only).
- Dashboard renders `<BannerAd />` at the bottom of the timeline scroll.
- `quick-log.tsx`: fires `showInterstitial()` (fire-and-forget) after starting
  a timer.
- `rewarded-ad.tsx`: CTA now plays the rewarded ad, grants 10h Pro on
  `'earned'`, shows a quiet `unavailable`/`success` line (screen 10).
- `_layout.tsx`: calls `initializeAds()` on launch.
- Translations: added `rewardedAd.loading` + `rewardedAd.success`, corrected
  `rewardedAd.unavailable` (removed "free for everyone during launch") across
  all 10 locales.
- `tsc --noEmit` clean; `expo prebuild --platform android --clean` succeeds.

**Requires a native rebuild** (new native module) — EAS Android development
build queued.

---

## Session 6

**Model name updates, app-ads.txt for AdMob verification.**

### Model names (commit `47a49c7`)
- Updated AI model names across all 10 locale files:
  - "Claude 3.5 Sonnet" → "Claude Sonnet 5"
  - "OpenAI Codex / ChatGPT" → "OpenAI Codex / GPT-5"
- 30 replacements total (quiz options, dashboard labels, preview notifications)

### AdMob setup (commit `d5ce935`)
- Added `apps/web/public/app-ads.txt` with AdMob publisher ID `pub-6071419245494198`
- Deployed to `sessionreset.gamesforstrangers.lol/app-ads.txt`
- Verified crawlable via web fetch
- AdMob app verification pending (awaiting "Check for updates" confirmation)

### AdMob re-integration plan (pending)
- **Package**: `react-native-google-mobile-ads@^16.3.4` (same version as Word Hug project)
- **Ad units to create** (see plan below once user provides AdMob IDs):
  - Banner ad (Dashboard bottom, free tier only)
  - Interstitial ad (after Quick-Log submit, 1 per session)
  - Rewarded ad (Settings "Watch Ad for 24h Pro Access")
- **Changes needed**:
  - Reinstall package
  - Update `app.json` with AdMob plugin
  - Replace `lib/ads.ts` no-op stub with real implementation
  - Wire BannerAd component to real AdMob banner
  - Wire interstitial in Quick-Log flow
  - Wire rewarded ad in Settings + RewardedAdModal
  - Remove `DEFAULT_SETTINGS.isPro = true` (let IAP control it)
  - EAS build required (native code change)

---

## Session 5

**Every non-onboarding screen built from the design file, plus RTL.**

Session 4 claimed the other screens were "implemented"; they were not. They
were the session 2/3 screens with a localisation and font pass applied. None
had been compared to `designs/extracted/all-screens-template.html` — the
dashboard in particular was a flat card list where the design specifies a
vertical timeline. This session builds them.

### RTL (commits `c79e718`, `644a5a8`)
- `lib/rtl.ts` — `useDirection()` returns row direction, text alignment and an
  axis sign from the active language. Deliberately avoids `I18nManager.forceRTL`,
  which only applies after a native restart and would break the "language
  applies instantly" behaviour the picker relies on.
- Applied across onboarding and every rebuilt screen.

### Navigation (commit `4175378`)
- Drawer replaced with the design's bottom tab bar (open item 6). The log
  button is raised through the bar and is not a route — it opens the sheet.
- Routes moved `(drawer)` → `(tabs)`.

### Today (commit `8c281c4`)
- Rebuilt as design 07's vertical timeline: `lib/timeline.ts` orders logged
  limits, the NOW marker, reopening windows and a closing "all clear" row;
  `components/Timeline.tsx` draws the 54/16 rail with its connecting line.
- NOW halo is a real view (RN has no spread shadow) breathing on a 2.2s loop.
- TimerCard rebuilt to its in-timeline form and its progress fill now eases
  between ticks.

### Quick-Log (commit `dc324aa`)
- Moved onto `@gorhom/bottom-sheet` (open item 7) — a dependency since session
  2 that was never used. Pans down to close.
- Service cards, offset pills and the alert row rebuilt to design 08; the alert
  row's second line now computes the real local alarm time.

### Settings (commit `7ec1043`)
- Rebuilt to design 09: hairline rows rather than filled cards, close tile,
  price on the upgrade card, POWER FEATURES restored, version as a footer.
- Android export used `Clipboard` from react-native core, which no longer
  exists there; now uses `Share` on both platforms.

### Rewarded ad (commit `d841364`)
- Screen 10 built for the first time. Video is a placeholder and says so.

### History / Alerts (commit `03a354c`)
- Rebuilt. **Fixed a crash**: session 4's bulk rename rewrote `t.resetTime` to
  `timer.resetTime` inside a reduce whose parameter was `t`, so History threw
  on any past timer.

### i18n (commit `aed496a`)
- The 23 onboarding strings that were English-only are translated. All ten
  locales now match key-for-key at 159 keys.

### Verification note
`expo prebuild` never reads app source, so it cannot catch a syntax error.
Added a Babel parse check over all 32 source files alongside it.

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
