# Changelog

Newest first.

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
- Decomposed all features into 44 commit-sized todos across 6 plan files:
  - `01-infrastructure.md` — T01-T08 (MMKV, data models, timer engine)
  - `02-notifications.md` — T09-T14 (expo-notifications, scheduling)
  - `03-onboarding.md` — T15-T22 (7-screen first-launch flow)
  - `04-dashboard.md` — T23-T30 (main screen, timer cards, countdown)
  - `05-settings.md` — T31-T36 (settings modal, pro banner, export)
  - `06-ads-iap.md` — T37-T44 (AdMob, rewarded ads, IAP)

### Progress
- Wrote START-HERE.md, project description, changelog
- Copied AGENT-WORKFLOW.md into progress/

### Divergences from the specs
- None — this is the initial scaffold

### What is verified and what is not
- `.gitignore` and `.gitattributes` are correct
- All markdown files render properly
- No code has been written yet — verification starts with T01

### Next
- Start T01 in `plans/01-infrastructure.md` (install MMKV)
- Phase 1 (T01-T14) is all non-UI foundational work — ideal starting point
