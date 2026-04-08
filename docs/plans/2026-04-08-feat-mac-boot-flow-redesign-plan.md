---
title: "feat: Unified Mac OS Boot Flow Redesign"
type: feat
date: 2026-04-08
brainstorm: docs/brainstorms/2026-04-08-mac-boot-flow-brainstorm.md
deepened: 2026-04-08
---

# Unified Mac OS Boot Flow Redesign

## Enhancement Summary

**Deepened on:** 2026-04-08
**Agents used:** TypeScript reviewer, Performance oracle, Security sentinel, Code simplicity reviewer, Frontend races reviewer, Architecture strategist, Pattern recognition specialist, CSS animation researcher, Mobile keyboard researcher, Context7 (Next.js 16.2.2 docs)

### Key Improvements
1. Fixed stale closure bug in `animationend` pattern — use ref to hold latest `onComplete`
2. Added double-click guard on interactive scenes to prevent duplicate `advance()` calls
3. Replaced `dvh` + `visualViewport` with simpler CSS-only `svh` + `pt-[12svh]` + `overflow-y-auto`
4. Simplified error dialog — no focus trapping, just a styled div with OK button
5. Fixed CSS cleanup list — `float`, `gentleBounce`, `flicker`, and `bday-*` colors are also dead code
6. Added `<form onSubmit>` pattern for keyboard-accessible password submission
7. Stabilized `advance()` with `useRef` for the transitioning guard to prevent stale closures
8. Fixed double font-family class bug — only use `font-[family-name:var(--font-retro)]`

### Existing Bugs Discovered (fix during this change)
- `GalleryContent` card positions use `Math.random()` on every render — cards jump when dragged (wrap in `useMemo`)
- Double `font-[family-name:var(--font-retro)] font-[family-name:var(--font-retro-fallback)]` class — second overrides first, ChicagoFLF never applies (use single class)
- `WishesContent` cleanup accesses `containerRef.current` which may be null on unmount (capture ref at effect time)

---

## Overview

Replace the current multi-metaphor birthday website flow (dark room → lamp → door → Mac desktop) with a unified Classic Mac OS (System 7/9) boot experience: **Power On → Boot Loading → Lock Screen → Desktop**. The birthday greeting becomes the desktop wallpaper, and the existing retro Mac desktop with Gallery/Wishes icons remains as the terminal scene.

## Problem Statement

The current 4-scene flow jumps between unrelated metaphors — a dark room with a light switch, a lamp with a door, a 3D door swing animation, and a retro Mac desktop. This creates a disjointed experience where each scene feels like a different "universe." The redesign unifies everything under a single Mac boot metaphor that the existing DesktopScene already establishes.

## Proposed Solution

Keep the same 4-scene state machine architecture (`type Scene = 1 | 2 | 3 | 4` with `advance()`) but replace Scenes 1-3 with Mac-themed equivalents and merge BirthdayGreeting into Scene 4 as desktop wallpaper.

### Scene Map

| Scene | Current | New | Component |
|-------|---------|-----|-----------|
| 1 | DarkRoomScene (light switch) | **PowerOnScene** (power button) | Create |
| 2 | LampEffectScene (lamp + door) | **BootLoadingScene** (Happy Mac + progress bar) | Create |
| 3 | DoorOpenScene (3D door swing) | **LockScreenScene** (password login) | Create |
| 4 | BirthdayGreeting + DesktopScene (scroll) | **DesktopScene** (single viewport, greeting as wallpaper) | Modify |

## Implementation Phases

### Phase 0: Fix `page.tsx` — Stabilize `advance()` and Clean Up State Machine

Before building new scenes, fix the latent race condition in the scene orchestrator.

**Problem:** The current `advance()` function closes over `isTransitioning` at render time. If called from a stale closure (timeout from a previous render), it reads an outdated value. The 600ms `isTransitioning` guard is a timer guarding against other timers — fragile.

**Fix:** Use a ref for the transitioning flag and wrap `advance` in `useCallback`:

```tsx
"use client";

import { useState, useCallback, useRef } from "react";
// ... scene imports ...

type Scene = 1 | 2 | 3 | 4;

export default function Home() {
  const [scene, setScene] = useState<Scene>(1);
  const isTransitioningRef = useRef(false);

  const advance = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setScene((prev) => {
      const next = prev + 1;
      return (next <= 4 ? next : 4) as Scene;
    });
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 600);
  }, []);

  return (
    <main className="relative h-full w-full">
      {scene === 1 && <PowerOnScene onComplete={advance} />}
      {scene === 2 && <BootLoadingScene onComplete={advance} />}
      {scene === 3 && <LockScreenScene onComplete={advance} />}
      {scene === 4 && <DesktopScene />}
    </main>
  );
}
```

**Why this matters:** With `useCallback([], ...)` and no dependencies, `advance` is a stable function reference. Children that receive it as `onComplete` will never see a reference change, which prevents `useEffect` re-runs in BootLoadingScene's `animationend` listener.

---

### Phase 1: PowerOnScene (`app/components/PowerOnScene.tsx`)

Create a new scene component replacing `DarkRoomScene.tsx`.

**Behavior:**
- Pure black (`#0a0a0a`) full-screen background
- Centered power button — the classic `⏻` symbol rendered in a subtle gray (`#333`) that glows on hover
- Subtle pulse animation on the power button to aid discoverability
- After 3 seconds, show hint text: "Click to power on" (reuse existing `hintFade` keyframe)
- On click: play `/audio/chime.mp3`, call `onComplete()` after 500ms

**Implementation details:**
- `"use client"` as first line
- Import `playSound` from `@/app/lib/audio`
- Define local `SceneProps` interface (matches codebase convention)
- Power button: a `<button>` element with `aria-label="Power on"`, keyboard-focusable
- Add a new CSS keyframe `pulse` in `globals.css` for the button glow effect
- **Double-click guard:** Use `useState` to track `activated` state, prevent re-fire
- Root container: `absolute inset-0` (matches existing scene pattern, not `fixed inset-0`)
- Use `font-[family-name:var(--font-retro)]` (single class, not double) for any retro text
- Wrap `setTimeout` in a ref for cleanup on unmount

```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { playSound } from "@/app/lib/audio";

interface SceneProps {
  onComplete: () => void;
}

export default function PowerOnScene({ onComplete }: SceneProps) {
  const [showHint, setShowHint] = useState(false);
  const [activated, setActivated] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const handleClick = () => {
    if (activated) return;
    setActivated(true);
    playSound("/audio/chime.mp3");
    timeoutRef.current = setTimeout(() => onComplete(), 500);
  };

  return (
    <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center">
      <button
        onClick={handleClick}
        aria-label="Power on"
        className="text-[#333] hover:text-[#666] transition-colors"
        style={{ animation: "pulse 2s ease-in-out infinite" }}
      >
        <span style={{ fontSize: "64px" }}>⏻</span>
      </button>
      {showHint && (
        <p
          className="absolute bottom-[20%] text-white/40"
          style={{ animation: "hintFade 1s ease-out forwards", fontSize: "11px" }}
        >
          Click to power on
        </p>
      )}
    </div>
  );
}
```

### Research Insights — PowerOnScene

**Discoverability:** The current `DarkRoomScene` shows "Find the switch" after 2 seconds. PowerOnScene uses the same pattern with `hintFade` at 3 seconds. The `pulse` animation on the power button itself provides an additional visual cue before the text appears.

**Container:** Use `absolute inset-0` not `fixed inset-0`. All existing interactive scenes (DarkRoomScene, LampEffectScene, DoorOpenScene) use `absolute inset-0`. Only `MacWindow` uses `fixed inset-0` (for overlay behavior).

---

### Phase 2: BootLoadingScene (`app/components/BootLoadingScene.tsx`)

Create a new scene component replacing `LampEffectScene.tsx`.

**Behavior:**
- Dark/black background
- Centered "Happy Mac" icon — compact SVG using `<path>` elements (not a pixel-by-pixel `<rect>` grid)
- Below the icon: a retro progress bar with `mac-beveled-inset` trough and filled portion
- Progress bar fills over ~3 seconds using CSS animation
- Auto-advances when progress animation completes (use `animationend` event)
- No user interaction required

**Implementation details:**
- `"use client"` as first line
- Define local `SceneProps` interface
- Happy Mac icon: Simple SVG with `<path>` and `<circle>` elements, max ~20 lines of SVG markup. Use `shapeRendering="crispEdges"` for pixel-perfect rendering. Do NOT construct pixel art from individual `<rect>` elements.
- Progress bar: `mac-beveled-inset` container with an inner div animated via `progressFill` keyframe
- **Stale closure fix:** Use a ref to hold the latest `onComplete` callback instead of putting `onComplete` in the effect dependency array. This prevents effect teardown/re-registration during animation.
- Root container: `absolute inset-0`

```tsx
"use client";

import { useEffect, useRef } from "react";

interface SceneProps {
  onComplete: () => void;
}

export default function BootLoadingScene({ onComplete }: SceneProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const handleEnd = (e: AnimationEvent) => {
      if (e.animationName === "progressFill") {
        onCompleteRef.current();
      }
    };
    bar.addEventListener("animationend", handleEnd);
    return () => bar.removeEventListener("animationend", handleEnd);
  }, []); // Stable — registers once, always calls latest callback via ref

  return (
    <div className="absolute inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center gap-8">
      {/* Happy Mac SVG — keep compact, use <path> not <rect> grid */}
      <svg viewBox="0 0 32 32" width={64} height={64} style={{ shapeRendering: "crispEdges" }}>
        {/* Monitor outline, face, smile — implementer to create */}
      </svg>

      {/* Progress bar */}
      <div
        className="mac-beveled-inset"
        style={{ width: 200, height: 16, padding: 2 }}
      >
        <div
          ref={barRef}
          className="h-full bg-mac-dark"
          style={{ animation: "progressFill 3s linear forwards" }}
        />
      </div>
    </div>
  );
}
```

### Research Insights — BootLoadingScene

**`animationend` reliability:** The event is widely supported (Baseline since 2019). It does NOT fire if the element is removed from the DOM before completion. Since this scene only unmounts after `onComplete` fires, this is safe. Consider also listening for `animationcancel` as a defensive measure.

**Stale closure pattern:** The original plan had `[onComplete]` as a useEffect dependency. If the parent re-renders and `onComplete` gets a new reference, the effect tears down the listener and re-registers it. If the animation fires during that gap, it is missed. The `onCompleteRef` pattern (from the TypeScript reviewer) eliminates this entirely. With `advance` now stable via `useCallback` in Phase 0, this is extra insurance.

**SVG approach:** Use `<path>` and `<circle>` for the Happy Mac icon (5-10 lines of SVG). If it exceeds ~30 lines, use a static `.svg` file in `/public` instead. Do not build a pixel-art renderer from `<rect>` elements.

---

### Phase 3: LockScreenScene (`app/components/LockScreenScene.tsx`)

Create a new scene component replacing `DoorOpenScene.tsx`.

**Behavior:**
- Classic Mac OS styled lock screen with `bg-mac-bg` (#c0c0c0) background
- Welcome text: "Hey there! Are you ready to have fun with us?" at the top
- Centered user avatar (Sharon's photo) in a beveled frame, ~80x80px (w-20 h-20)
- Username "Sharon" below avatar in Chicago font
- Password input field (masked with bullets, System 7 style) with `mac-beveled-inset`
- Submit button styled as System 7 button ("OK") with `mac-beveled`
- Hint text below: "Hint: DDMMYY" in smaller gray text
- **`<form onSubmit>`** wraps input and button — handles both Enter key and button click
- **Auto-focus** the password input on mount (note: iOS Safari blocks programmatic focus from triggering keyboard — user must tap)
- **Wrong password**: Show a styled error dialog with `role="alertdialog"`, message "Hmm, that doesn't seem right! Try again?", and "OK" button. No focus trapping needed. Dismissing clears the field and re-focuses input.
- **Correct password (080426)**: Call `onComplete()` after brief delay

**Password constant:**
```tsx
/** Birthday date used as the lock screen passcode */
const BIRTHDAY_PASSCODE = "080426" as const;
```

**Mobile keyboard handling (CSS-only approach):**
- Root container: `absolute inset-0 h-svh overflow-y-auto` — uses `svh` (small viewport height), allows scroll if keyboard pushes content
- Form positioned at `pt-[12svh]` — sits in the upper portion, above where the keyboard appears
- No `visualViewport` JavaScript API — the CSS-only approach is sufficient for a birthday site
- Avatar kept compact on mobile (w-20 h-20 / 80px) to save vertical space

**Error dialog (inline, not a separate component):**
- Styled with `mac-beveled` outer frame, `mac-title-bar` striped title bar
- Title: "Alert"
- Body: Caution icon (⚠) + message text
- Single "OK" button with `mac-beveled` styling
- Backdrop overlay (semi-transparent black, same pattern as `MacWindow.tsx`)
- `role="alertdialog"` attribute (zero-cost accessibility)
- Dismiss via: OK button click, Enter key, or Escape key (simple `useEffect` keydown listener, same 5-line pattern as MacWindow)
- No focus trapping — unnecessary for a birthday site with a single-button dialog

```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { playSound } from "@/app/lib/audio";

interface SceneProps {
  onComplete: () => void;
}

/** Birthday date used as the lock screen passcode */
const BIRTHDAY_PASSCODE = "080426" as const;

export default function LockScreenScene({ onComplete }: SceneProps) {
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  // Escape key to dismiss error dialog
  useEffect(() => {
    if (!showError) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") dismissError();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showError]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (unlocked) return;
    if (password === BIRTHDAY_PASSCODE) {
      setUnlocked(true);
      timeoutRef.current = setTimeout(() => onComplete(), 300);
    } else {
      setShowError(true);
      playSound("/audio/alert.mp3");
    }
  };

  const dismissError = () => {
    setShowError(false);
    setPassword("");
    inputRef.current?.focus();
  };

  return (
    <div className="absolute inset-0 h-svh bg-mac-bg overflow-y-auto">
      <div className="flex flex-col items-center pt-[12svh] pb-8 gap-3">
        {/* Welcome text */}
        <p
          className="text-mac-dark text-center px-4 mb-4"
          style={{ fontSize: "11px" }}
        >
          Hey there! Are you ready to have fun with us?
        </p>

        {/* Avatar */}
        <div className="w-20 h-20 rounded-full mac-beveled overflow-hidden bg-white flex items-center justify-center">
          {/* <Image> if photo exists, or fallback "S" initial */}
          <span className="text-2xl text-mac-dark font-bold">S</span>
        </div>

        {/* Username */}
        <p
          className="font-[family-name:var(--font-retro)] text-mac-dark"
          style={{ fontSize: "11px" }}
        >
          Sharon
        </p>

        {/* Password form */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mac-beveled-inset bg-white px-2 py-1 text-center w-40"
            style={{ fontSize: "11px" }}
            aria-label="Password"
          />
          <button type="submit" className="mac-beveled bg-mac-bg px-4 py-1" style={{ fontSize: "11px" }}>
            OK
          </button>
        </form>

        {/* Hint */}
        <p className="text-mac-shadow" style={{ fontSize: "10px" }}>
          Hint: DDMMYY
        </p>
      </div>

      {/* Error dialog */}
      {showError && (
        <>
          <div className="fixed inset-0 bg-black/20" onClick={dismissError} />
          <div
            className="fixed top-1/3 left-1/2 -translate-x-1/2 mac-beveled bg-mac-bg p-0 w-72"
            role="alertdialog"
            aria-label="Incorrect password"
          >
            <div className="mac-title-bar h-[19px] flex items-center justify-center relative">
              <span
                className="bg-white px-2 font-[family-name:var(--font-retro)]"
                style={{ fontSize: "11px" }}
              >
                Alert
              </span>
            </div>
            <div className="p-4 flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <p style={{ fontSize: "12px" }}>
                Hmm, that doesn&apos;t seem right! Try again?
              </p>
            </div>
            <div className="flex justify-center pb-3">
              <button
                onClick={dismissError}
                className="mac-beveled bg-mac-bg px-6 py-1"
                style={{ fontSize: "11px" }}
                autoFocus
              >
                OK
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
```

### Research Insights — LockScreenScene

**Mobile keyboard (critical):**
- `dvh` does NOT respond to virtual keyboards by default. The `interactive-widget=resizes-content` meta tag fixes Android but is not supported on iOS Safari.
- `svh` (small viewport height) is more stable than `dvh` for sections that shouldn't resize dynamically.
- `overflow-y-auto` on the scene container allows the user to scroll if the keyboard still covers content — a critical fallback.
- `pt-[12svh]` positions the form high enough to remain visible above most mobile keyboards (~40-50% of screen).
- No `visualViewport` JavaScript API needed — CSS-only is sufficient for a single password field.
- iOS Safari blocks programmatic `focus()` from triggering the keyboard — the user must tap the input field. The auto-focus just provides a visual focus ring.

**Form pattern:** Using `<form onSubmit>` instead of a click handler + `onKeyDown` is the correct approach. It handles both Enter key submission and button click natively, works with screen readers, and follows HTML form semantics.

**Error dialog simplification:** The original plan specified focus trapping and `aria-modal`. For a birthday site with a single-button dialog, this is over-engineered. The simplified version uses `role="alertdialog"` (zero-cost accessibility attribute), `autoFocus` on the OK button, and Escape/Enter key handling via a simple `useEffect` — the same 5-line pattern already used by `MacWindow.tsx`.

**Password storage:** The password is in the client bundle — visible in DevTools. This is fine for a birthday puzzle. Do not attempt to obfuscate it.

---

### Phase 4: Modify DesktopScene (`app/components/DesktopScene.tsx`)

Merge birthday greeting content into the desktop as wallpaper.

**Changes:**
1. **Add wallpaper text**: Render "Happy Birthday, Ka Sharon!" as large, semi-transparent text centered behind the desktop icons. Use Playfair Display font (`font-display`), white text with low opacity (~0.15-0.2) so icons remain readable on top.
2. **Add subtitle**: "From all of us who love you dearly" below the main heading, also semi-transparent.
3. **Mark wallpaper heading as decorative**: Add `aria-hidden="true"` since it is purely visual wallpaper, not primary content.
4. **Remove scroll dependency**: Change layout from `min-h-screen` to `h-svh`. Ensure everything fits in a single viewport.
5. **Fix font class bug**: Replace all `font-[family-name:var(--font-retro)] font-[family-name:var(--font-retro-fallback)]` double-class instances with single `font-[family-name:var(--font-retro)]`. The double class causes the second to override the first, meaning ChicagoFLF never applies.
6. **Keep existing functionality**: Menu bar, desktop icons (Gallery, Wishes), MacWindow modals — all preserved as-is.

**Wallpaper layer structure:**
```tsx
{/* Wallpaper text layer — behind icons, decorative only */}
<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
  <h1
    aria-hidden="true"
    className="font-[family-name:var(--font-display)] text-white/15 text-6xl md:text-8xl text-center px-4"
  >
    Happy Birthday, Ka Sharon!
  </h1>
  <p
    aria-hidden="true"
    className="font-[family-name:var(--font-display)] text-white/10 text-xl mt-4"
  >
    From all of us who love you dearly
  </p>
</div>
```

### Research Insights — DesktopScene

**Font class bug (P0):** The pattern `font-[family-name:var(--font-retro)] font-[family-name:var(--font-retro-fallback)]` appears in DesktopScene (lines 24, 56, 82), MacWindow (line 47), GalleryContent (lines 21, 50, 87), and WishesContent (lines 23, 37). The second Tailwind class overrides the first, so `--font-retro-fallback` (VT323) always wins. The `--font-retro` variable already includes VT323 as a fallback (`'ChicagoFLF', 'VT323', monospace`), so the fix is to use only `font-[family-name:var(--font-retro)]`. Fix this across ALL existing files during this change.

**`aria-hidden` on wallpaper:** The heading is decorative background text, not informational content. Without `aria-hidden="true"`, screen readers would announce "Happy Birthday, Ka Sharon!" as primary page content, which is confusing in the context of the Mac desktop UI.

**GalleryContent bug (P0 — fix during this change):** In `GalleryContent.tsx`, `cardPositions` uses `Math.random()` directly in the render body. Every time `topCard` state changes (on drag), all positions recompute with new random values — cards visually jump. Fix by wrapping in `useMemo(() => ..., [])`.

---

### Phase 5: Update page.tsx, Fix Existing Bugs, and Clean Up

**`app/page.tsx` changes:**
1. Replace imports: `PowerOnScene`, `BootLoadingScene`, `LockScreenScene` instead of old components
2. Remove `BirthdayGreeting` import
3. Scene 4 renders only `<DesktopScene />` (no wrapping scroll div, no `BirthdayGreeting`)
4. Stabilize `advance()` with `useRef` + `useCallback` (see Phase 0)

**Delete old components:**
- `app/components/DarkRoomScene.tsx`
- `app/components/LampEffectScene.tsx`
- `app/components/DoorOpenScene.tsx`
- `app/components/BirthdayGreeting.tsx`

**CSS changes in `globals.css`:**
- Add `pulse` keyframe (power button glow)
- Add `progressFill` keyframe (boot loading bar)
- Remove `swingOpen` keyframe (was used by DoorOpenScene — deleted)
- Remove `lampGlow` keyframe (was used by LampEffectScene — deleted)
- Remove `float` keyframe (was used only by BirthdayGreeting — deleted)
- Remove `gentleBounce` keyframe (was used only by BirthdayGreeting + LampEffectScene — both deleted)
- Remove `flicker` keyframe (was defined but never used by any component)
- Remove `bday-*` theme colors (`bday-light`, `bday-sky`, `bday-highlight`, `bday-dark`, `bday-text`) — only used by BirthdayGreeting and DoorOpenScene, both deleted
- Remove corresponding `--animate-swing-open` and `--animate-flicker` theme variables
- Keep `fadeIn` (used by MacWindow) and `hintFade` (used by PowerOnScene)

**Audio cleanup:**
- Remove references to `/audio/switch.mp3`, `/audio/knock.mp3`, `/audio/door-open.mp3`
- New audio files needed: `/audio/chime.mp3` (startup chime), `/audio/alert.mp3` (optional error sound)

**Fix existing bugs (while files are open):**

1. **`GalleryContent.tsx`** — Wrap `cardPositions` in `useMemo`:
   ```tsx
   const cardPositions = useMemo(
     () => photos.map((_, i) => ({
       x: (i % 3) * 120 - 100 + Math.random() * 40,
       y: Math.floor(i / 3) * 100 + Math.random() * 30,
       rotate: -15 + Math.random() * 30,
     })),
     [] // photos is static — compute once
   );
   ```

2. **Font class fix across all files** — Replace double font class:
   ```diff
   - font-[family-name:var(--font-retro)] font-[family-name:var(--font-retro-fallback)]
   + font-[family-name:var(--font-retro)]
   ```
   In: `DesktopScene.tsx`, `MacWindow.tsx`, `GalleryContent.tsx`, `WishesContent.tsx`

3. **`WishesContent.tsx`** — Capture ref at effect time:
   ```tsx
   useEffect(() => {
     const container = containerRef.current; // capture here
     return () => {
       const videos = container?.querySelectorAll("video");
       videos?.forEach((v) => { v.pause(); v.currentTime = 0; });
     };
   }, []);
   ```

4. **`MacWindow.tsx`** — Guard Escape listener:
   ```tsx
   useEffect(() => {
     if (!isOpen) return; // don't attach when closed
     const handleEsc = (e: KeyboardEvent) => {
       if (e.key === "Escape") onClose();
     };
     window.addEventListener("keydown", handleEsc);
     return () => window.removeEventListener("keydown", handleEsc);
   }, [isOpen, onClose]);
   ```

---

## Technical Considerations

### Mobile Virtual Keyboard (Lock Screen)
The lock screen uses a CSS-only approach for mobile keyboard visibility:
- Container: `h-svh overflow-y-auto` — `svh` (small viewport height) is more stable than `dvh` for forms
- Form position: `pt-[12svh]` — keeps form in upper portion, above keyboard
- `overflow-y-auto` fallback — if keyboard still pushes content, user can scroll
- No JavaScript `visualViewport` API needed — adds complexity for minimal gain on a birthday site
- Note: `dvh` does NOT respond to virtual keyboards by default; `svh` is the correct choice here

### Asset Strategy
- **Happy Mac icon**: Compact SVG with `<path>` elements and `shapeRendering="crispEdges"` — max 20 lines of SVG. No external image dependency.
- **Power button**: CSS-only with the `⏻` unicode character — no asset needed
- **Sharon's avatar**: User will provide; use Next.js `<Image>` when available, fallback to a styled `<div>` with letter "S" in a beveled circle (not a reusable Avatar component — just inline)
- **Audio files**: Must be provided/sourced by user and placed in `/public/audio/`. `playSound()` silently catches errors, so scenes work without audio files.

### Font Loading
- ChicagoFLF (`@font-face` in globals.css) has `font-display: swap` — browser shows VT323 fallback immediately, swaps to Chicago when loaded
- The `--font-retro` CSS variable already includes the full fallback chain: `'ChicagoFLF', 'VT323', monospace`
- During the ~3s boot sequence, any font swap is acceptable (looks like a retro boot)
- Optional improvement: add `<link rel="preload" href="/fonts/ChicagoFLF.woff2" as="font" type="font/woff2" crossOrigin="anonymous">` in layout.tsx to eliminate the swap entirely

### No State Persistence
The full boot sequence replays on every page load. This is intentional — the boot experience IS the gift. No `localStorage`/`sessionStorage` caching.

### Architecture Decisions (confirmed by review)
- **Linear state machine is correct** for a 4-scene one-directional narrative — do not introduce a reducer or state machine library
- **Conditional rendering is correct** — do not introduce AnimatePresence or cross-fade transitions. Each scene manages its own entrance animation.
- **`page.tsx` stays `"use client"`** — server component gives no benefit since all rendering is client-side with hooks
- **SceneProps stays locally defined** in each component file — this is the established codebase convention. Optionally extract to `app/lib/types.ts` during this change since all consuming files are being replaced anyway.
- **RetroAlertDialog stays inline** in LockScreenScene — it is <40 lines of JSX with exactly one consumer. Extract only if it grows or gains a second use.

---

## Acceptance Criteria

- [x] Scene 1: Black screen with pulsing power button, hint after 3s, click plays chime and advances
- [x] Scene 1: Double-click guard prevents multiple advance() calls
- [x] Scene 2: Happy Mac SVG icon + progress bar, auto-advances after ~3s via `animationend`
- [x] Scene 2: `onComplete` ref pattern prevents stale closure on animationend
- [x] Scene 3: Lock screen with avatar, "Sharon" username, password input (auto-focused)
- [x] Scene 3: `<form onSubmit>` handles both Enter key and button click
- [x] Scene 3: Correct password "080426" advances to desktop
- [x] Scene 3: Wrong password shows System 7 alert dialog, dismissing clears input and re-focuses
- [x] Scene 3: "Hint: DDMMYY" visible below password field
- [x] Scene 3: Welcome text "Hey there! Are you ready to have fun with us?" displayed
- [x] Scene 3: Password field visible above mobile keyboard (uses `svh` + `pt-[12svh]` + `overflow-y-auto`)
- [x] Scene 4: Birthday greeting rendered as semi-transparent wallpaper text with `aria-hidden="true"`
- [x] Scene 4: Single viewport (`h-svh`), no scrolling — menu bar + icons + wallpaper all fit
- [x] Scene 4: Gallery and Wishes icons open MacWindow modals (existing behavior preserved)
- [x] All scenes use Classic Mac OS visual style (beveled, Chicago font, gray/teal palette)
- [x] Font class bug fixed: single `font-[family-name:var(--font-retro)]` across all files
- [x] GalleryContent cardPositions wrapped in `useMemo` (no more jumping cards on drag)
- [x] WishesContent cleanup captures ref at effect time
- [x] MacWindow Escape listener only attached when open
- [x] `advance()` stabilized with `useRef` + `useCallback` in page.tsx
- [x] Old components deleted: DarkRoomScene, LampEffectScene, DoorOpenScene, BirthdayGreeting
- [x] Dead CSS removed: `swingOpen`, `lampGlow`, `float`, `gentleBounce`, `flicker` keyframes + `bday-*` colors
- [x] All new components include `"use client"` directive and `playSound` import

## Assets Required (from user)

- [ ] Sharon's profile picture (for lock screen avatar)
- [ ] Startup chime audio file (`/public/audio/chime.mp3`)
- [ ] Error alert audio file (`/public/audio/alert.mp3`) — optional

## Dependencies & Risks

| Risk | Mitigation |
|------|------------|
| Sharon's avatar photo not provided | Inline fallback: `<div>` with letter "S" in beveled circle |
| Audio files not provided | `playSound()` silently catches errors — scenes work without audio |
| Mobile keyboard covers lock screen | `svh` + `pt-[12svh]` + `overflow-y-auto` — CSS-only, no JS needed |
| Chicago font fails to load | `--font-retro` already cascades to VT323 then monospace |
| iOS Safari blocks auto-focus keyboard | User must tap input — auto-focus just shows visual focus ring |

## File Changes Summary

| File | Action |
|------|--------|
| `app/page.tsx` | **Modify** — stabilize `advance()`, update imports, simplify Scene 4 |
| `app/components/PowerOnScene.tsx` | **Create** |
| `app/components/BootLoadingScene.tsx` | **Create** |
| `app/components/LockScreenScene.tsx` | **Create** |
| `app/components/DesktopScene.tsx` | **Modify** — add wallpaper text, `h-svh`, fix font class |
| `app/components/MacWindow.tsx` | **Modify** — fix font class, guard Escape listener |
| `app/components/GalleryContent.tsx` | **Modify** — fix font class, wrap cardPositions in `useMemo` |
| `app/components/WishesContent.tsx` | **Modify** — fix font class, capture ref in cleanup |
| `app/globals.css` | **Modify** — add `pulse` + `progressFill`, remove 5 dead keyframes + `bday-*` colors |
| `app/components/DarkRoomScene.tsx` | **Delete** |
| `app/components/LampEffectScene.tsx` | **Delete** |
| `app/components/DoorOpenScene.tsx` | **Delete** |
| `app/components/BirthdayGreeting.tsx` | **Delete** |

## References

- Brainstorm: `docs/brainstorms/2026-04-08-mac-boot-flow-brainstorm.md`
- Existing Mac styling: `app/globals.css:71-88` (beveled classes)
- Scene state machine: `app/page.tsx:10-38`
- Audio utility: `app/lib/audio.ts`
- DesktopScene: `app/components/DesktopScene.tsx`
- MacWindow: `app/components/MacWindow.tsx`
- System7.css reference: https://system7.style/
- CSS viewport units guide: https://web.dev/blog/viewport-units
- `interactive-widget` meta tag: https://www.htmhell.dev/adventcalendar/2024/4/
- Mobile keyboard handling: https://www.franciscomoretti.com/blog/fix-mobile-keyboard-overlap-with-visualviewport
