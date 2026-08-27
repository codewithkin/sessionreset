# Screens Plan — SessionReset

> **Source of truth for every screen.** When designs arrive, they override this document for visual details. This document is authoritative for behavior, interactions, and flow.

## Screen inventory

| # | Screen | Route | Type | Depends on |
|---|--------|-------|------|------------|
| 01 | Outcome Hook | `(onboarding)/index.tsx` | Full-screen | — |
| 02 | Personalization Quiz | `(onboarding)/quiz.tsx` | Full-screen | 01 |
| 03 | Founder Note | `(onboarding)/founder-note.tsx` | Full-screen | 02 |
| 04 | Onboarding Paywall | `(onboarding)/paywall.tsx` | Full-screen | 03 |
| 05 | Notification Primer | `(onboarding)/notifications.tsx` | Full-screen | 04 |
| 06 | AHA Moment | `(onboarding)/starter.tsx` | Full-screen | 05 |
| 07 | Main Dashboard | `(tabs)/index.tsx` | Tab screen | 06 |
| 08 | Quick-Log Sheet | `components/QuickLogSheet.tsx` | Bottom sheet overlay | 07 |
| 09 | Settings Modal | `settings.tsx` | Modal | 07 |
| 10 | Rewarded Ad Modal | `components/RewardedAdModal.tsx` | Centered dialog | 09 |

---

## Screen 01: Outcome Hook

### Purpose
First thing the user sees. Sells the outcome (staying in flow state), not features. Must communicate what the app does in under 3 seconds.

### Layout
- **Container:** Full-screen, centered vertically and horizontally.
- **Safe area:** Respects top and bottom safe area insets.
- **Background:** Solid — dark mode: `#000000`, light mode: `#FFFFFF`.

### UI Elements (top to bottom)

| Element | Position | Spec |
|---------|----------|------|
| Animated graphic | Top 30% of screen | Looping Lottie or frame animation |
| Headline | Center, below graphic | Bold, 28sp, centered, 2 lines max |
| Subtitle | Below headline | Regular, 16sp, muted color, 2 lines max |
| CTA button | Bottom 25% | Full-width primary button, 56px height |
| Footer text | Bottom safe area + 16px | Caption, 12sp, muted, centered |

### Animated graphic
A looping status sequence showing the core value:
1. Red badge: "Rate Limit Hit" (1.5s hold)
2. Transition to timer: "05:00:00" (0.5s fade)
3. Timer counts down rapidly to "00:00:00" (1s)
4. Green badge: "Back to Code" with subtle bounce (1s hold)
5. Loop back to step 1

If Lottie is not available, use a simple pulsing circle with text labels that cycle.

### Copy
- **Headline:** "Never lose your flow state to unexpected AI limits."
- **Subtitle:** "Instant 5-hour rolling reset alarms for Claude, Codex, and AI CLI tools."
- **CTA:** "Get Started →"
- **Footer:** "No account required • 100% On-Device Data"

### Interactions
- Tapping "Get Started →" navigates to Screen 02 (Quiz) with a slide-left transition.
- No swipe-back gesture allowed (this is the entry point).

### Edge cases
- First launch only. If `onboarding_complete === true`, skip to Screen 07.
- If the user force-quits mid-onboarding, resume from Screen 01 on relaunch (progress is NOT saved until Screen 07).

---

## Screen 02: Personalization Quiz

### Purpose
Build ownership by letting the user select their tools and pain level. This data personalizes the paywall (Screen 04) and makes the app feel custom-built.

### Layout
- **Container:** Full-screen, scrollable.
- **Safe area:** Top inset for status bar.
- **Background:** Same as Screen 01.

### UI Elements (top to bottom)

| Element | Position | Spec |
|---------|----------|------|
| Progress dots | Top, centered | 5 dots, current dot highlighted |
| Question 1 label | 16px below dots | Bold, 20sp |
| Q1 chips | Below label | Multi-select chip grid, 2 columns |
| Question 2 label | 32px below Q1 chips | Bold, 20sp |
| Q2 chips | Below label | Single-select chip row, 3 columns |
| CTA button | Bottom 16px (sticky) | Full-width primary button, 56px height |

### Question 1: "Which AI assistants do you rely on daily?"

Chips (multi-select, max 4):
| Chip label | Icon | Value |
|------------|------|-------|
| Claude 3.5 Sonnet | `☁️` or Anthropic logo | `claude` |
| OpenAI Codex / ChatGPT | `🤖` or OpenAI logo | `codex` |
| Claude Code CLI | `⌨️` | `claude-code` |
| Cursor / Copilot | `📊` or Cursor logo | `cursor` |

**Selection behavior:**
- Tap to select (fills with accent color, checkmark appears).
- Tap again to deselect.
- At least 1 chip must be selected to enable CTA.

### Question 2: "How often do rate limits interrupt your coding?"

Chips (single-select):
| Chip label | Value |
|------------|-------|
| 1–2 times/week | `low` |
| 3–5 times/week | `medium` |
| Every single day | `high` |

**Selection behavior:**
- Tap to select (fills with accent color).
- Selecting a new option deselects the previous.
- Selection is optional — CTA is enabled based on Q1 only.

### CTA
- **Label:** "Continue →"
- **Disabled state:** Grayed out, no press feedback, until ≥1 Q1 chip is selected.
- **Enabled state:** Primary color fill, navigates to Screen 03.

### State management
- Selections stored in component state (useState).
- Persisted to MMKV on Screen 07 completion (not earlier).

### Edge cases
- User selects all 4 chips — all valid, no max enforcement visually, just allows it.
- User backs out and returns — selections are lost (not persisted until onboarding completes).

---

## Screen 03: Founder Note

### Purpose
Build trust with a human, developer-to-developer message. Creates emotional connection before the paywall.

### Layout
- **Container:** Full-screen, centered.
- **Background:** Same as previous screens.

### UI Elements (top to bottom)

| Element | Position | Spec |
|---------|----------|------|
| Progress dots | Top, centered | 5 dots, dot 3 highlighted |
| Hand-drawn icon | Center-top | 80x80 SVG: clock with pencil doodle |
| Note card | Center | Rounded rectangle, subtle shadow, 32px padding |
| CTA button | Bottom 25% | Full-width primary button |

### Note card content
- **Background:** Slightly elevated surface (light gray in light mode, dark gray in dark mode).
- **Border radius:** 16px.
- **Shadow:** Subtle (0 2px 8px rgba(0,0,0,0.08)).

**Copy (inside card):**
> "Hey! I built SessionReset because hitting a 5-hour limit in the middle of a refactor drove me crazy. No accounts, no cloud databases tracking your data—just pure utility to keep you in the zone. Hope it saves your flow state!"

**Attribution (below card, right-aligned):**
> "— [Founder Name]"

(Founder name is a placeholder until finalized. Use "Alex" as default.)

### CTA
- **Label:** "Sounds Good →"
- **Action:** Navigates to Screen 04 (Paywall).

### Interactions
- No interactive elements besides CTA.
- Subtle fade-in animation on card (300ms ease-out).

### Edge cases
- Founder name placeholder — set in `lib/constants.ts`, easy to update.

---

## Screen 04: Onboarding Paywall

### Purpose
Drive early monetization with a time-limited launch offer. Show social proof, tailored features, and clear pricing.

### Layout
- **Container:** Full-screen, scrollable.
- **Background:** Same as previous screens.

### UI Elements (top to bottom)

| Element | Position | Spec |
|---------|----------|------|
| Progress dots | Top, centered | 5 dots, dot 4 highlighted |
| Social proof bar | 16px below dots | Muted text, centered |
| Feature checklist | Center | 3–4 items with checkmarks |
| Price card | Below checklist | Elevated card with price |
| CTA button | Below price card | Full-width primary button |
| Skip link | Below CTA | Text-only, muted, centered |

### Social proof bar
**Copy:** "Joined by 2,000+ developers from GitHub, Vercel & Stripe."

### Feature checklist
Dynamically tailored to Screen 02 quiz selections:

**If user selected Claude:**
- ✓ Instant 15-Minute Pre-Reset Alerts for Claude
- ✓ Home Screen & Lock Screen Widgets
- ✓ Custom Sound Effects & Zero Banner Ads

**If user selected Codex:**
- ✓ Instant 15-Minute Pre-Reset Alerts for Codex
- ✓ Home Screen & Lock Screen Widgets
- ✓ Custom Sound Effects & Zero Banner Ads

**If user selected both:**
- ✓ Instant 15-Minute Pre-Reset Alerts (Claude + Codex)
- ✓ Home Screen & Lock Screen Widgets
- ✓ Custom Sound Effects & Zero Banner Ads

**If user selected other tools:**
- ✓ Track Any AI Service with Custom Timers
- ✓ Home Screen & Lock Screen Widgets
- ✓ Custom Sound Effects & Zero Banner Ads

Each item: checkmark icon (accent color) + label (16sp, regular).

### Price card
- **Background:** Elevated surface with accent border (2px left border in primary color).
- **Border radius:** 12px.
- **Padding:** 20px.

**Content:**
- Price: "$1.99" (bold, 32sp)
- Subtext: "Lifetime Pro • Launch Discount"
- Strikethrough: "~~$4.99~~" (muted, smaller)

### CTA
- **Label:** "Unlock Lifetime Pro"
- **Action:** Triggers IAP flow (Screen 10 if reward ad, or native IAP purchase).
- **Loading state:** Spinner replaces text during purchase.

### Skip link
- **Label:** "Continue with Free Version"
- **Style:** Muted text button, no background.
- **Action:** Navigates to Screen 05 (Notification Primer).
- **Intentionally de-emphasized** — smaller font, lower contrast.

### Interactions
- CTA triggers IAP. On success, sets `isPro = true` and navigates to Screen 05.
- On IAP failure/cancel, stays on this screen, shows brief error toast.
- Skip link always works, no gating.

### Edge cases
- No internet — IAP will fail gracefully, skip link still works.
- Already purchased — CTA changes to "You're Pro ✓" and is disabled; skip link becomes "Continue →".

---

## Screen 05: Notification Primer

### Purpose
Maximize notification permission acceptance by showing the value BEFORE the OS prompt.

### Layout
- **Container:** Full-screen, centered.
- **Background:** Same as previous screens.

### UI Elements (top to bottom)

| Element | Position | Spec |
|---------|----------|------|
| Progress dots | Top, centered | 5 dots, dot 5 highlighted |
| Mock notification card | Center-top | iOS-style notification banner preview |
| Headline | Below card | Bold, 24sp, centered |
| Body copy | Below headline | Regular, 16sp, muted, centered |
| CTA button | Bottom 25% | Full-width primary button |

### Mock notification card
A realistic preview of what the notification will look like:

```
┌─────────────────────────────────────────────┐
│  SessionReset · 15m ago                      │
│  ⚡ Claude Reset in 15 Minutes               │
│  Finish your current task—your 5-hour       │
│  context window is about to clear.           │
└─────────────────────────────────────────────┘
```

- **Style:** iOS notification banner style (rounded rect, blur background).
- **Width:** 85% of screen width, centered.
- **Border radius:** 16px.
- **Shadow:** Medium (0 4px 16px rgba(0,0,0,0.12)).
- **Animation:** Slides down from top on mount (spring animation, 500ms).

### Copy
- **Headline:** "Never miss your reset window"
- **Body:** "We only send local alarms for your active timers. Zero marketing push spam."

### CTA
- **Label:** "Enable Notifications"
- **Action:** Calls `Notifications.requestPermissionsAsync()`.
  - If granted: navigates to Screen 06.
  - If denied: navigates to Screen 06 anyway (app works without notifications).
  - If already granted: navigates directly to Screen 06.

### Interactions
- CTA triggers native OS permission dialog.
- The mock notification is purely visual — no interaction.

### Edge cases
- Notifications already granted: CTA label changes to "Notifications Enabled ✓", auto-navigates after 1s.
- Notifications denied: Still navigates, but Screen 07 shows a subtle "Notifications disabled" badge.

---

## Screen 06: AHA Moment (Interactive Starter)

### Purpose
Complete onboarding by having the user log their first timer immediately. This is the "aha" — they experience the core loop before seeing the dashboard.

### Layout
- **Container:** Full-screen, centered.
- **Background:** Same as previous screens.

### UI Elements (top to bottom)

| Element | Position | Spec |
|---------|----------|------|
| Celebration graphic | Top 30% | Subtle confetti or checkmark animation |
| Headline | Center | Bold, 28sp, centered |
| Subtext | Below headline | Regular, 16sp, muted |
| Action buttons | Bottom 35% | Two stacked buttons |

### Celebration graphic
A subtle, non-intrusive animation:
- Option A: Animated checkmark that draws itself (Lottie or SVG).
- Option B: Minimal confetti burst (20 particles, 1s duration).
- Should feel rewarding but not childish.

### Copy
- **Headline:** "Let's log your first reset"
- **Subtext:** "Tap below to start tracking your first 5-hour window."

### Action buttons (stacked vertically, 16px gap)

**Button 1 (Primary):**
- **Label:** "I'm Blocked Right Now"
- **Style:** Full-width, primary color fill, 56px height.
- **Action:** Opens Quick-Log Sheet (Screen 08) with "Just Now" pre-selected.

**Button 2 (Secondary):**
- **Label:** "Start Demo Timer"
- **Style:** Full-width, outline style, 56px height.
- **Action:** Creates a test timer (Claude, starts 2h30m into the 5h window) so the user immediately sees a ticking countdown on the dashboard.

### Interactions
- Both buttons transition to Screen 07 (Dashboard).
- If "I'm Blocked Right Now" is tapped, the Quick-Log sheet opens ON TOP of the dashboard (not instead of it).
- If "Start Demo Timer" is tapped, the dashboard loads with an active timer already ticking.

### Onboarding completion
When either button is tapped:
1. Save quiz selections to MMKV.
2. Set `onboarding_complete = true`.
3. Navigate to `(tabs)` (Dashboard) with `replace` (no back navigation to onboarding).

### Edge cases
- User force-quits here — onboarding is NOT complete, they restart from Screen 01.
- Both buttons do the same thing functionally (start a timer), but the UX framing is different.

---

## Screen 07: Main Dashboard

### Purpose
The home screen. Ultra-scannable status hub showing all active timers and countdowns. This is where users spend 90% of their time.

### Layout
- **Container:** Full-screen, vertical scroll.
- **Safe area:** Top (status bar) and bottom (home indicator).
- **Background:** Default system background.

### UI Elements (top to bottom)

| Element | Position | Spec |
|---------|----------|------|
| Header | Top safe area | App title left, settings gear right |
| Timer card list | Scrollable center area | Vertical stack, 16px horizontal padding |
| Empty state | Center (when no timers) | Graphic + text |
| FAB | Bottom center, above safe area | Full-width primary button |
| Banner ad | Bottom edge | AdMob anchored banner (free tier only) |

### Header
- **Left:** "SessionReset" — bold, 20sp.
- **Right:** Gear icon (⚙️) — 24x24, tappable, opens Screen 09 (Settings).
- **Height:** 56px + top safe area.
- **No border** — clean separation from content.

### Timer card list
A vertical `ScrollView` or `FlatList` of timer cards. Each card represents one active timer.

**When timers exist:**
- Cards are stacked vertically with 12px gap.
- Scrollable if more than 2 cards.
- Horizontal padding: 16px.

**When no timers exist (empty state):**
- Centered vertically.
- Subtle illustration placeholder (clock icon, muted).
- **Copy:** "No active limits."
- **Subtext:** "Tap below when you hit a wall."

### TimerCard component

Each card contains:

```
┌─────────────────────────────────────────────────┐
│  ● Claude 3.5 Sonnet                    🔔 15m  │
│                                                   │
│  02h : 14m : 08s                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━░░░░░░░░░░░░░░░  │
│                                                   │
│  Resets at 4:15 PM                               │
└─────────────────────────────────────────────────┘
```

**Elements within card:**

| Element | Spec |
|---------|------|
| Platform badge | Colored dot (Claude: `#CC785C`, Codex: `#10A37F`) + platform name, bold 14sp |
| Alert toggle | Pill button, "🔔 15m" label, toggleable, right-aligned |
| Countdown | Monospace font, 36sp bold, `02h : 14m : 08s` format |
| Progress bar | Horizontal, 4px height, rounded, fills left-to-right, accent color |
| Reset time | Regular, 14sp, muted: "Resets at 4:15 PM" |

**Card styling:**
- Background: Surface color (slightly elevated from background).
- Border radius: 16px.
- Padding: 20px.
- Shadow: Subtle (0 1px 4px rgba(0,0,0,0.06)).

**Alert toggle behavior:**
- ON: Pill fills with accent color, label "🔔 15m".
- OFF: Pill is outline, label "🔔 15m Off".
- Toggling updates MMKV and reschedules/cancels the pre-reset notification.

**Countdown behavior:**
- Updates every second via `useInterval` hook.
- When remaining < 15 minutes, countdown color changes to warning (amber).
- When remaining < 1 minute, countdown color changes to urgent (red).
- When timer expires, card fades out over 500ms and is removed.

**Progress bar:**
- Computed as `(elapsed / totalMs) * 100`.
- Filled portion uses accent color gradient.
- Unfilled portion is muted gray.

### FAB (Floating Action Button)
- **Label:** "+ Log Limit Hit"
- **Style:** Full-width (minus 32px padding), 56px height, primary color fill, bold 16sp.
- **Position:** Bottom center, 16px above banner ad (or safe area if Pro).
- **Action:** Opens Quick-Log Sheet (Screen 08).
- **Shadow:** Medium elevation (0 4px 12px rgba(0,0,0,0.15)).

### Banner ad
- **Type:** AdMob adaptive banner, anchored to bottom edge.
- **Visibility:** Only shown when `isPro === false`.
- **Height:** ~60dp (adaptive).
- **Margin:** FAB sits 16px above the banner.

### State management
- Timer data comes from `storage.timers.getActive()`.
- Countdown updates via `useCountdown` hook (1-second interval).
- `storage.timers.markExpired()` runs on app foreground and periodically.

### Interactions
- Tapping a timer card: No action (read-only display). Future: could expand to show details.
- Tapping alert toggle: Switches pre-reset alert on/off.
- Tapping FAB: Opens Quick-Log Sheet.
- Tapping settings gear: Opens Settings Modal.
- Pull-to-refresh: Re-checks expired timers.

### Edge cases
- Multiple timers: Both Claude and Codex can be active simultaneously (one per platform).
- Same platform timer exists: Quick-Log sheet warns "Replace existing Claude timer?"
- Timer expires while app is open: Card fades out, notification fires if scheduled.
- Timer expires while app is closed: Missed notification fires on next app launch (T13).

---

## Screen 08: Quick-Log Sheet (Bottom Sheet)

### Purpose
Log a rate limit hit in under 3 seconds. Minimal friction, maximum speed.

### Layout
- **Type:** Half-screen bottom sheet (`@gorhom/bottom-sheet`).
- **Detent points:** Half-screen (50% height) and full-screen (optional, not used by default).
- **Background:** Surface color with top border radius (24px).
- **Handle:** Centered pill handle at top (40x4, rounded, muted).

### UI Elements (top to bottom)

| Element | Position | Spec |
|---------|----------|------|
| Handle bar | Top center | 40x4px, rounded, muted |
| Title | 16px below handle | Bold, 18sp: "Log Limit Hit" |
| Service selector | Below title | Two large toggle buttons, horizontal |
| Time offset section | Below service selector | Label + chip row |
| Alert toggle | Below chips | Row with label and switch |
| CTA button | Bottom, above safe area | Full-width primary button |

### Service selector
Two large, equal-width buttons side by side (12px gap):

| Button | Label | Icon | Active state |
|--------|-------|------|--------------|
| Left | "Claude" | Cloud icon | Filled with Claude brand color (`#CC785C`) |
| Right | "Codex" | Bot icon | Filled with Codex brand color (`#10A37F`) |

**Behavior:**
- Tap to select (fills with brand color, white text).
- Default: No selection (both outline). User must pick one.
- Only one can be active at a time.
- Selection is required to enable CTA.

### Time offset section
**Label:** "When did you hit the limit?"

**Chip row (horizontal, scrollable if needed):**
| Chip | Value | Default |
|------|-------|---------|
| "Just Now" | 0 | ✓ (selected by default) |
| "5m ago" | 5 | |
| "15m ago" | 15 | |
| "30m ago" | 30 | |

**Behavior:**
- "Just Now" is pre-selected (accent fill).
- Tapping another chip selects it and deselects others.
- Offset adjusts the timer's `startTime` backward: `startTime = Date.now() - (offset * 60 * 1000)`.
- This means the 5-hour window started earlier, so reset time is sooner.

### Alert toggle
**Row layout:**
```
┌──────────────────────────────────────────────┐
│  🔔 Remind me 15m before reset      [═══○]  │
└──────────────────────────────────────────────┘
```

- **Label:** "Remind me 15 minutes before reset"
- **Switch:** iOS-style toggle, default ON.
- **Behavior:** Toggling updates the timer's `preResetAlert` field.

### CTA button
- **Label:** "Start 5-Hour Timer"
- **Disabled state:** Until service is selected.
- **Action (in order):**
  1. Create timer via `createTimer(platform, startTime, preResetAlert)`.
  2. Add to storage via `storage.timers.add(timer)`.
  3. Schedule notifications via `scheduleTimerNotifications(timer)`.
  4. Log usage via `storage.usageLog.set([...existing, logEntry])`.
  5. Dismiss sheet.
  6. If free tier, show interstitial ad (max 1 per session).

### Interactions
- Sheet opens with spring animation (damping: 0.8).
- Tap outside sheet or swipe down to dismiss (without saving).
- No save until CTA is tapped.

### Edge cases
- Existing timer for same platform: Show confirmation dialog — "Replace existing Claude timer? This will cancel the current countdown."
- No service selected: CTA is disabled, no action.
- Device is offline: Notifications won't schedule (but timer still saves locally).

---

## Screen 09: Settings Modal

### Purpose
Configuration, upgrade path, and data management. Clean, grouped list.

### Layout
- **Type:** Full-screen modal (presented over Dashboard).
- **Navigation:** Close button (X) top-left, title centered.
- **Background:** System background.
- **Scrollable:** Yes, grouped list.

### UI Elements

#### Header
- **Left:** Close button (X icon, 24x24).
- **Center:** "Settings" — bold, 18sp.

#### Section 1: Pro Status

**If free tier:**
```
┌──────────────────────────────────────────────┐
│  ⭐ Unlock Pro                               │
│  Remove Ads & Unlock Widgets — $1.99        │
│  Lifetime Access • Launch Price              │
└──────────────────────────────────────────────┘
```
- Elevated card, accent border (2px left).
- Tappable → triggers IAP flow.

**If Pro:**
```
┌──────────────────────────────────────────────┐
│  ✓ You're Pro                                │
│  All features unlocked, ads removed.         │
└──────────────────────────────────────────────┘
```
- Subtle green accent.
- Not tappable.

#### Section 2: Notifications

**Row:**
```
┌──────────────────────────────────────────────┐
│  🔔 Notification Sound              Chime >  │
└──────────────────────────────────────────────┘
```
- Tappable → opens sound picker (inline radio or action sheet).
- Options: Chime (default), Radar, Subtle Ping.
- Tap plays a preview of the sound.

**Row:**
```
┌──────────────────────────────────────────────┐
│  ⏰ Pre-Reset Alert Default         [═══○]  │
└──────────────────────────────────────────────┘
```
- Toggle switch. Default ON.
- Controls the default `preResetAlertEnabled` for new timers.

#### Section 3: Power Features

**Row (free tier only):**
```
┌──────────────────────────────────────────────┐
│  🎬 Watch Ad for 24h Pro Access              │
│  Watch a 15s video to unlock all features    │
└──────────────────────────────────────────────┘
```
- Tappable → opens Rewarded Ad Modal (Screen 10).
- Hidden if Pro.

#### Section 4: Data

**Row:**
```
┌──────────────────────────────────────────────┐
│  📤 Export Timer History                      │
└──────────────────────────────────────────────┘
```
- Tappable → generates JSON file, opens native share sheet.

**Row:**
```
┌──────────────────────────────────────────────┐
│  🔄 Restore Purchases                        │
└──────────────────────────────────────────────┘
```
- Tappable → checks IAP receipt, restores Pro if valid.

#### Section 5: About

**Row:**
```
┌──────────────────────────────────────────────┐
│  SessionReset v1.0.0                         │
└──────────────────────────────────────────────┘
```
- Non-tappable, just info.

**Row:**
```
┌──────────────────────────────────────────────┐
│  💬 Contact / Feedback                       │
└──────────────────────────────────────────────┘
```
- Tappable → opens mailto: or in-app feedback link.

### Interactions
- Sheet opens with slide-up animation.
- Close button or swipe down dismisses.
- All changes persist immediately to MMKV.

### Edge cases
- Notifications disabled at OS level: Show warning badge on notification rows.
- No sounds installed yet: Sound picker shows placeholder states.

---

## Screen 10: Rewarded Ad Unlock Modal

### Purpose
Allow non-paying users to unlock Pro features temporarily by watching a video ad. High eCPM ad placement.

### Layout
- **Type:** Centered dialog (not full-screen).
- **Width:** 85% of screen width, max 360px.
- **Background:** Surface color, elevated.
- **Border radius:** 20px.
- **Shadow:** Heavy (0 8px 32px rgba(0,0,0,0.2)).
- **Overlay:** Semi-transparent black backdrop (0.5 opacity).

### UI Elements (top to bottom)

| Element | Position | Spec |
|---------|----------|------|
| Icon | Top center | 64x64 lock/unlock icon |
| Headline | Below icon | Bold, 22sp, centered |
| Body copy | Below headline | Regular, 16sp, muted, centered |
| CTA button | Below copy | Full-width primary button |
| Dismiss link | Bottom | Text-only, muted |

### Icon
An animated lock icon that transitions to unlocked:
- Static state: Lock icon (gray).
- On mount: Subtle bounce animation, lock shakes slightly.

### Copy
- **Headline:** "Unlock Pro for 24 Hours"
- **Body:** "Watch a short 15-second video to use all Pro features for the next day."

### CTA button
- **Label:** "Watch Short Video"
- **Action:**
  1. Load rewarded ad via `AdMobRewarded.requestAd()`.
  2. Show ad.
  3. On `onUserEarnedReward`: set `proExpiresAt = Date.now() + 24h` in MMKV.
  4. Dismiss modal.
  5. Show toast: "Pro unlocked for 24 hours!"

### Dismiss link
- **Label:** "No Thanks"
- **Action:** Dismiss modal, no state change.

### Interactions
- Tap outside modal or swipe down: Dismiss (same as "No Thanks").
- Ad failure: Show error toast, dismiss modal.
- Ad dismissed without completion: No state change, dismiss modal.

### Edge cases
- Ad not loaded: Button shows "Loading..." spinner, retries.
- Already have Pro (lifetime or active reward): Modal should not be reachable (button hidden in Settings).
- Reward expired: On next app launch, `proExpiresAt` check reverts to free tier.

---

## Screen flow diagram

```
┌─────────────────────────────────────────────────────────┐
│                    FIRST LAUNCH                          │
│                                                          │
│  [01] Outcome Hook                                       │
│    │                                                     │
│    ▼                                                     │
│  [02] Quiz ──────────────────────────────────────┐       │
│    │                                             │       │
│    ▼                                             │       │
│  [03] Founder Note                               │       │
│    │                                             │       │
│    ▼                                             │       │
│  [04] Paywall ◄──── tailors features to quiz ────┘       │
│    │                                                     │
│    ├── "Unlock Lifetime Pro" → IAP → [05]                │
│    └── "Free Version" → [05]                             │
│                                                          │
│  [05] Notification Primer                                │
│    │                                                     │
│    ▼                                                     │
│  [06] AHA Moment                                         │
│    │                                                     │
│    ├── "I'm Blocked" → [08] Quick-Log → [07] Dashboard  │
│    └── "Demo Timer" → [07] Dashboard (with active timer) │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    DAILY USAGE                           │
│                                                          │
│  [07] Dashboard                                          │
│    │                                                     │
│    ├── "+ Log Limit Hit" FAB → [08] Quick-Log Sheet      │
│    │                                                     │
│    ├── Settings gear → [09] Settings Modal                │
│    │     ├── "Watch Ad" → [10] Rewarded Ad Modal         │
│    │     ├── "Unlock Pro" → IAP                          │
│    │     └── "Export" → Share sheet                      │
│    │                                                     │
│    └── Timer expires → Local notification fires          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Color tokens (placeholder — awaiting designs)

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--bg` | `#FFFFFF` | `#000000` | Screen background |
| `--surface` | `#F5F5F5` | `#1A1A1A` | Card backgrounds |
| `--border` | `#E0E0E0` | `#2A2A2A` | Card borders |
| `--text-primary` | `#1A1A1A` | `#FFFFFF` | Headlines, body |
| `--text-muted` | `#6B6B6B` | `#8A8A8A` | Subtitles, labels |
| `--accent` | `#3B82F6` | `#60A5FA` | CTAs, progress bars |
| `--claude` | `#CC785C` | `#CC785C` | Claude badge |
| `--codex` | `#10A37F` | `#10A37F` | Codex badge |
| `--warning` | `#F59E0B` | `#FBBF24` | <15m remaining |
| `--urgent` | `#EF4444` | `#F87171` | <1m remaining |

## Typography scale (placeholder — awaiting designs)

| Name | Size | Weight | Usage |
|------|------|--------|-------|
| `display` | 36sp | Bold | Countdown timer |
| `h1` | 28sp | Bold | Screen headlines |
| `h2` | 22sp | Bold | Section headers |
| `body` | 16sp | Regular | Body copy, labels |
| `caption` | 14sp | Regular | Timestamps, muted text |
| `micro` | 12sp | Regular | Footer text, badges |

## Spacing scale

| Token | Value |
|-------|-------|
| `--space-xs` | 4px |
| `--space-sm` | 8px |
| `--space-md` | 16px |
| `--space-lg` | 24px |
| `--space-xl` | 32px |
| `--space-2xl` | 48px |
