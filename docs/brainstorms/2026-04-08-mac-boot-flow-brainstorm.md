# Mac Boot Flow Redesign

**Date:** 2026-04-08
**Status:** Approved

## Problem

The current birthday website has multiple disconnected metaphors (dark room, lamp, door, Mac desktop) that don't feel cohesive. The experience jumps between "universes" and the transitions feel jarring.

## What We're Building

A unified **Classic Mac OS (System 7/9)** boot experience that replaces all current scenes. The entire journey follows one metaphor: turning on a vintage Macintosh and unlocking it to reveal a birthday surprise.

## New Scene Flow

### Scene 1: Power On
- **Visual:** Pure black screen with a retro Mac power button (classic power symbol)
- **Interaction:** User clicks the power button
- **Audio:** Mac startup chime sound on click
- **Transition:** Advances to Scene 2 after click

### Scene 2: Boot Loading
- **Visual:** Dark/black background with classic "Happy Mac" icon (smiling Macintosh) centered, retro striped/beveled progress bar underneath
- **Interaction:** None — auto-advances
- **Duration:** ~3 seconds for the progress bar to fill
- **Transition:** Auto-advances to Scene 3 when loading completes

### Scene 3: Lock Screen
- **Visual:** Classic Mac OS styled lock screen
- **Content:**
  - Welcome text: "Hey there! Are you ready to have fun with us?"
  - User avatar: Sharon's profile picture (to be provided by user)
  - Username: "Sharon"
  - Password input field
  - Hint text: "Hint: DDMMYY"
- **Interaction:** User types password
  - **Wrong password:** Retro System 7 alert dialog with warning icon ("Incorrect password. Try again.")
  - **Correct password (080426):** Advances to Scene 4
- **Audio:** Consider classic Mac alert sound on wrong password

### Scene 4: Desktop
- **Visual:** Single-viewport Mac OS desktop (no scrolling)
  - Birthday greeting ("Happy Birthday, Ka Sharon!") rendered as the desktop wallpaper/background
  - Retro Mac menu bar at top (existing component)
  - Desktop icons: Gallery and Wishes (existing components)
- **Interaction:** Click icons to open MacWindow modals (existing behavior)
- **Key change:** BirthdayGreeting content is merged INTO the desktop as wallpaper, not a separate scrollable section

## Why This Approach

- **Single metaphor:** Every scene is part of the Mac experience — no context-switching between metaphors
- **Familiar pattern:** The boot → loading → lock → desktop flow is intuitive and universally understood
- **Retro consistency:** Leverages the existing Classic Mac OS styling already built for DesktopScene
- **Interactive engagement:** Password input adds a fun puzzle element (instead of passive door watching)
- **Simpler architecture:** Same 4-scene state machine, same `onComplete` interface, just different content

## Key Decisions

1. **Classic Mac OS style throughout** — not modern macOS. Matches existing DesktopScene aesthetic (beveled windows, Chicago font, teal backgrounds)
2. **Password is 080426** — Sharon's birthday in DDMMYY format, hint is "Hint: DDMMYY"
3. **Wrong password shows retro System 7 alert dialog** — with warning icon, not just a shake animation
4. **Birthday greeting becomes the wallpaper** — no separate scroll section, everything on one viewport
5. **Welcome text preserved** — "Hey there! Are you ready to have fun with us?" appears on lock screen
6. **Sharon's profile picture** — user will provide the image asset

## Components to Create/Modify

| Component | Action | Notes |
|-----------|--------|-------|
| `PowerOnScene.tsx` | **Create** | Replaces DarkRoomScene — black screen + power button |
| `BootLoadingScene.tsx` | **Create** | Replaces LampEffectScene — Happy Mac + progress bar |
| `LockScreenScene.tsx` | **Create** | Replaces DoorOpenScene — login screen with password |
| `DesktopScene.tsx` | **Modify** | Merge BirthdayGreeting content as wallpaper background |
| `page.tsx` | **Modify** | Update scene imports and type |
| `DarkRoomScene.tsx` | **Delete** | Replaced by PowerOnScene |
| `LampEffectScene.tsx` | **Delete** | Replaced by BootLoadingScene |
| `DoorOpenScene.tsx` | **Delete** | Replaced by LockScreenScene |
| `BirthdayGreeting.tsx` | **Delete/Merge** | Content absorbed into DesktopScene wallpaper |
| `globals.css` | **Modify** | Add new keyframes, retro Mac alert styles |

## Assets Needed

- [ ] Sharon's profile picture (from user)
- [ ] Mac startup chime audio file
- [ ] Mac error/alert sound (optional)
- [ ] Happy Mac icon (can be CSS/SVG pixel art)

## Open Questions

- Exact placement/styling of birthday greeting text as wallpaper (centered? with decorations?)
- Whether to keep floating particles from BirthdayGreeting as wallpaper decoration
- Profile picture dimensions/crop style for the lock screen avatar
