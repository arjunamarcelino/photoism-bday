---
title: "feat: Interactive Birthday Website for Ka Sharon"
type: feat
date: 2026-04-08
brainstorm: docs/brainstorms/2026-04-08-birthday-website-brainstorm.md
deepened: 2026-04-08
---

# feat: Interactive Birthday Website for Ka Sharon

## Enhancement Summary

**Deepened on:** 2026-04-08
**Research agents used:** Frontend Design, TypeScript Reviewer, Performance Oracle, Simplicity Reviewer, Frontend Races Reviewer, Architecture Strategist, Pattern Recognition, Mac OS CSS Explorer, Lamp/Door CSS Explorer, Security Sentinel

### Key Improvements
1. **Drop use-sound** — use native `Audio` API (saves 25KB bundle, 3 lines per sound)
2. **Add transition guard** — `isTransitioning` state prevents double-clicks skipping scenes
3. **Use `animationend` event** — not `setTimeout` for door animation completion
4. **Pre-blur wallpaper image** — avoid `backdrop-filter` (saves 20-30ms/frame on mobile)
5. **Use static imports** for JSON data (no fetch, no loading states, works offline)
6. **Add `robots.txt` + noindex** — prevent search engine indexing of personal content

### Simplification Decisions
- **Keep Motion library** — drag interaction is core to the gallery experience per user's vision
- **Drop use-sound** — native `new Audio().play()` is sufficient for 3 sound effects
- **Keep separate component files** — 8 files is manageable and keeps each scene focused
- **Use TypeScript data file** instead of JSON — `data/content.ts` exports typed arrays directly

---

## Overview

Build a cinematic, single-page birthday website that takes visitors through a 5-scene journey: dark room with light switch → lamp effect with greeting → door swing-open → birthday message → retro Mac OS (90s) desktop with Gallery and Wishes "apps". The site is a gift from 10+ friends, featuring group photos and personal wish cards.

**Deadline: TODAY (2026-04-08)** — prioritize working core journey over polish.

## Technical Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Next.js | 16.2.2 | Framework (App Router, `'use client'`) |
| React | 19.2.4 | UI library |
| Tailwind CSS | 4 | Styling via `@theme` in CSS (no config JS) |
| TypeScript | 5 | Type safety |
| Motion | latest | Drag interactions for gallery cards |
| ~~use-sound~~ | ~~latest~~ | ~~Lightweight sound effects~~ → Use native `Audio` API instead |
| pnpm | — | Package manager |

**No retro UI library** — we'll build the Mac OS chrome with Tailwind + custom CSS to stay lightweight and avoid dependency issues.

### Research Insight: Dependencies

**Install only Motion:**
```bash
pnpm add motion
```

**Sound effects via native Audio API** (no library needed):
```typescript
const playSound = (src: string) => {
  const audio = new Audio(src);
  audio.play().catch(() => {}); // Silently fail if blocked
};
```
This saves ~25KB bundle size and removes the Howler.js transitive dependency.

---

## Architecture

### Single-Page Scene Manager

All 5 scenes live on one page (`app/page.tsx`). A `currentScene` state variable controls which scene is visible. Transitions are CSS-driven (opacity, transform).

```
app/page.tsx ("use client")
├── SceneManager (state: currentScene 1-5)
│   ├── DarkRoomScene        (Scene 1)
│   ├── LampEffectScene      (Scene 2)
│   ├── DoorOpenScene        (Scene 3)
│   └── BirthdayDesktop      (Scenes 4+5, shared scroll container)
│       ├── BirthdayGreeting
│       ├── DesktopIcon (Gallery)
│       ├── DesktopIcon (Wishes)
│       ├── MacWindow (Gallery) → GalleryContent
│       └── MacWindow (Wishes) → WishesContent
```

### Research Insight: Architecture Grade A-

**Keep `useState`** — Context is unnecessary for this linear flow where state is only consumed by immediate children. No prop drilling (just `onComplete` callback one level deep).

**Static imports for data** — JSON is tiny metadata; actual media loads from `/public`. Static import means no loading states, works offline, tree-shakeable:
```typescript
import { wishes, photos } from '@/data/content';
```

**Separate animation state from scene state:**
```typescript
const [scene, setScene] = useState<Scene>(1);
const [isTransitioning, setIsTransitioning] = useState(false);
```

### Data Flow

```
/data/content.ts  ──→ Scene5 (statically imported, typed arrays)
/public/images/   ──→ All scenes (photos, loaded via <Image>)
/public/audio/    ──→ Scene1, Scene2, Scene3 (sound effects via Audio API)
```

---

## Implementation Phases

### Phase 1: Foundation & Data Layer

**Goal:** Project setup, data files, global styles, layout.

#### 1.1 Install dependencies

```bash
pnpm add motion
```

#### 1.2 Update `app/globals.css` with Tailwind 4 theme

```css
@import "tailwindcss";

@font-face {
  font-family: 'ChicagoFLF';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/ChicagoFLF.woff2') format('woff2');
}

@theme {
  /* Birthday palette */
  --color-bday-light: #ADD8E6;
  --color-bday-sky: #87CEFA;
  --color-bday-highlight: #E0F4FF;
  --color-bday-dark: #0a0a0a;
  --color-bday-text: #1a1a2e;

  /* Classic Mac OS palette */
  --color-mac-bg: #c0c0c0;
  --color-mac-desktop: #008080;
  --color-mac-titlebar: #000080;
  --color-mac-border: #000000;
  --color-mac-highlight: #ffffff;
  --color-mac-shadow: #808080;
  --color-mac-dark: #454545;

  /* Fonts */
  --font-retro: 'ChicagoFLF', 'VT323', monospace;
  --font-display: 'Playfair Display', serif;

  /* Animations */
  --animate-fade-in: fadeIn 0.6s ease-out;
  --animate-swing-open: swingOpen 1.2s cubic-bezier(0.65, 0, 0.35, 1) forwards;
  --animate-flicker: flicker 0.15s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes swingOpen {
  from { transform: perspective(1200px) rotateY(0deg); }
  50% { transform: perspective(1200px) rotateY(-130deg); }
  to { transform: perspective(1200px) rotateY(-120deg); }
}

@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* Mac OS window chrome styles */
.mac-title-bar {
  background: repeating-linear-gradient(
    90deg, white 0px, white 1px, black 1px, black 2px
  );
}

.mac-beveled {
  box-shadow:
    inset 1px 1px 0 #ffffff,
    inset -1px -1px 0 #808080,
    2px 2px 0 rgba(0, 0, 0, 0.3);
}

.mac-beveled-inset {
  box-shadow:
    inset 1px 1px 0 #808080,
    inset -1px -1px 0 #ffffff;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Research Insight: Mac OS Typography**

Use **ChicagoFLF** (free, public domain revival by Robin Casady) for retro Mac scenes. Download from [FontsArena](https://fontsarena.com/chicago-flf-by-robin-casady/) and place in `/public/fonts/ChicagoFLF.woff2`.

**Fallback:** If Chicago font unavailable, use VT323 from Google Fonts:
```typescript
// layout.tsx
import { VT323 } from 'next/font/google';
const vt323 = VT323({ weight: '400', subsets: ['latin'], variable: '--font-retro' });
```

Use **Playfair Display** for the Scene 4 birthday title (elegant, sophisticated serif).

File: `app/globals.css`

#### 1.3 Update `app/layout.tsx`

- Set metadata: title "Happy Birthday Ka Sharon!", description
- Add `<meta name="robots" content="noindex, nofollow" />` for privacy
- Load retro font (ChicagoFLF or VT323 fallback)
- Set `<html>` and `<body>` to full height

File: `app/layout.tsx`

#### 1.4 Create data file

**Use a TypeScript file instead of JSON** — simpler, type-safe by default, no wrapper interfaces:

**`data/content.ts`:**
```typescript
export type MediaType = "photo" | "video" | "gif";

export interface Wish {
  id: string;
  author: string;
  mediaType: MediaType;
  mediaUrl: string;
  message: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption?: string;
}

export const wishes: Wish[] = [
  {
    id: "1",
    author: "Person Name",
    mediaType: "photo",
    mediaUrl: "/images/wishes/person1.jpg",
    message: "Happy birthday Ka Sharon! Wishing you all the best..."
  },
];

export const photos: GalleryPhoto[] = [
  {
    id: "1",
    url: "/images/gallery/group1.jpg",
    caption: "Our trip to Bali 2025",
  },
];
```

**Research Insight:** This eliminates separate JSON files, the types file, and wrapper interfaces (`WishesData`, `GalleryData`). TypeScript infers everything. Contributors edit `data/content.ts` directly.

File: `data/content.ts`

#### 1.5 Create placeholder assets & privacy files

```
public/
├── fonts/
│   └── ChicagoFLF.woff2        (retro Mac font)
├── images/
│   ├── gallery/                 (group photos - user provides later)
│   ├── wishes/                  (per-person media - user provides later)
│   └── wallpaper-blurred.jpg   (pre-blurred desktop wallpaper)
├── audio/
│   ├── switch.mp3               (light switch click)
│   ├── knock.mp3                (door knock)
│   └── door-open.mp3            (door creak open)
└── robots.txt                   (prevent search indexing)
```

**`public/robots.txt`:**
```
User-agent: *
Disallow: /
```

Use placeholder images initially. User adds real photos later and updates `data/content.ts`.

**Research Insight: Pre-blur the wallpaper** — use ImageMagick or any editor to blur the wallpaper image before adding it. Do NOT use CSS `backdrop-filter: blur()` at runtime — it causes repaints every frame and drops to 30fps on mobile.

---

### Phase 2: Scenes 1-3 (Dark Intro Sequence)

**Goal:** The dark, cinematic intro — switch, lamp, door.

#### 2.1 Scene Manager with transition guard

```typescript
// app/page.tsx
'use client'

import { useState } from 'react'

type Scene = 1 | 2 | 3 | 4 | 5;

interface SceneProps {
  onComplete: () => void;
}

export default function BirthdayPage() {
  const [scene, setScene] = useState<Scene>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const advance = () => {
    if (isTransitioning) return; // Prevent double-click skipping
    setIsTransitioning(true);
    setScene(prev => {
      const next = prev + 1;
      return (next <= 5 ? next : 5) as Scene;
    });
    setTimeout(() => setIsTransitioning(false), 600);
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      {scene === 1 && <DarkRoomScene onComplete={advance} />}
      {scene === 2 && <LampEffectScene onComplete={advance} />}
      {scene === 3 && <DoorOpenScene onComplete={advance} />}
      {scene >= 4 && <BirthdayDesktop />}
    </main>
  );
}
```

**Research Insights:**
- **Transition guard** prevents rapid clicks from skipping scenes (critical race condition)
- **Type-safe advance** avoids `as Scene` assertion — uses conditional check instead
- **SceneProps interface** defined once, shared by all scene components
- **PascalCase naming** without underscores follows React conventions

File: `app/page.tsx`

#### 2.2 Scene 1 — The Dark Room

- Pure black background with subtle noise grain texture (CSS SVG filter)
- Centered light switch (saklar) — realistic toggle switch
- Subtle hint text: "Find the switch" (fades in after 2s if no interaction)
- Click switch → play `switch.mp3` → animate flicker → advance to Scene 2
- **Touch target:** min 48x48px for mobile

**Research Insight: Switch Styling**
```css
.saklar-plate {
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%);
  box-shadow:
    inset 2px 2px 4px rgba(255, 255, 255, 0.05),
    inset -2px -2px 4px rgba(0, 0, 0, 0.8),
    0 4px 12px rgba(0, 0, 0, 0.9);
}
```
Subtle glow on hover: `filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.25))`

File: `app/components/DarkRoomScene.tsx`

#### 2.3 Scene 2 — Lamp Effect

- Dark background with layered radial gradient glow expanding from top-center
- Text fades in: "Hey there! Are you ready to have fun with us?"
- Below text: a door illustration (simple CSS door shape)
- Hint: "Knock on the door" with subtle bounce animation on door
- Click/tap door → play `knock.mp3` → advance to Scene 3

**Research Insight: Lamp Glow Implementation**

Use **3 layered divs** for realistic light physics — bright core, mid glow, ambient wash:

```css
/* Core bright spot */
.lamp-core {
  background: radial-gradient(circle,
    rgba(255, 249, 230, 1) 0%,
    rgba(255, 215, 0, 0.6) 50%,
    transparent 100%
  );
  filter: blur(4px);
}

/* Mid-range glow */
.lamp-glow {
  background: radial-gradient(circle,
    rgba(255, 215, 0, 0.3) 0%,
    rgba(255, 235, 205, 0.15) 20%,
    transparent 60%
  );
  filter: blur(60px);
}

/* Ambient light cone (optional) */
.lamp-cone {
  background: conic-gradient(
    from 70deg at center top,
    transparent 0deg,
    rgba(6, 182, 212, 0.3) 30deg,
    rgba(6, 182, 212, 0.5) 50deg,
    rgba(6, 182, 212, 0.3) 70deg,
    transparent 100deg
  );
}
```

Stagger the layers with `animation-delay` for a dramatic reveal effect.

**References:** [Aceternity Lamp Effect](https://ui.aceternity.com/components/lamp-effect), [CSS Spotlight Effect (Frontend Masters)](https://frontendmasters.com/blog/css-spotlight-effect/)

File: `app/components/LampEffectScene.tsx`

#### 2.4 Scene 3 — Door Opens

- Door centered on dark background
- Bright content (Scene 4) visible "behind" the door via CSS stacking
- Door swing-open animation using CSS 3D transforms
- Play `door-open.mp3` on enter
- **Use `animationend` event** (NOT `setTimeout`) to detect completion, then advance

**Research Insight: Door Animation**

```css
.door-panel {
  transform-origin: left center;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform; /* GPU acceleration */
}
```

**Critical:** Use `animationend` listener, not timers:
```typescript
useEffect(() => {
  const door = doorRef.current;
  const handleEnd = (e: AnimationEvent) => {
    if (e.animationName === 'swingOpen') onComplete();
  };
  door?.addEventListener('animationend', handleEnd);
  return () => door?.removeEventListener('animationend', handleEnd);
}, [onComplete]);
```

The easing `cubic-bezier(0.65, 0, 0.35, 1)` mimics the weight of a real door (slow start, slight overshoot at the end).

**Door surface styling** for realistic wood:
```css
background: linear-gradient(135deg, #8b4513 0%, #654321 100%);
box-shadow:
  inset 2px 2px 8px rgba(0, 0, 0, 0.6),
  -20px 0 40px rgba(0, 0, 0, 0.5);
```

**References:** [CSS 3D Door Animation (Manuel Strehl)](https://manuel-strehl.de/opening_door_in_css), [CodePen Simple Door](https://codepen.io/am_eu/pen/EgedaQ)

File: `app/components/DoorOpenScene.tsx`

---

### Phase 3: Scenes 4-5 (Birthday Content)

**Goal:** The bright birthday world — greeting, Mac OS desktop.

#### 3.1 Scene 4 — Birthday Greeting

- Light theme: gradient from `#ADD8E6` to `#87CEFA`
- Large, centered birthday message: "Happy Birthday, Ka Sharon!" using Playfair Display font
- Subtitle: heartfelt group message
- Floating particle effects (20 max, CSS-only or Motion)
- Scrollable — scroll down reveals Scene 5 (Mac desktop)
- Scene 4 and 5 are on the same scroll container (no state transition needed)

**Research Insight: Typography**
```css
.birthday-title {
  font-family: var(--font-display);
  font-size: clamp(3rem, 10vw, 6rem);
  color: #ffffff;
  text-shadow:
    0 2px 10px rgba(135, 206, 250, 0.5),
    0 4px 20px rgba(173, 216, 230, 0.3);
}
```

File: `app/components/BirthdayGreeting.tsx`

#### 3.2 Scene 5 — Mac OS Desktop

- Classic Mac OS 90s aesthetic built with Tailwind + custom CSS:
  - Menu bar at top: Apple logo (&#63743;), "File Edit View Special" text, clock
  - Pre-blurred group photo wallpaper as `background-image`
  - Two desktop icons: "Gallery" folder icon, "Wishes" notepad icon
  - Chicago font for all text
- Click icon → opens a Mac-style window
- Only one window open at a time
- Window state: `useState<'gallery' | 'wishes' | null>(null)`

**Research Insight: Mac OS Color Palette**
```
White: #ffffff, Light gray: #b9b9b9, Medium gray: #868686
Dark gray: #454545, Black: #000000, Desktop teal: #008080
```

**Desktop icon selection style:** Black background behind label text when selected.

File: `app/components/DesktopScene.tsx`

#### 3.3 Mac Window Component

Reusable `<MacWindow>` component:
```typescript
interface MacWindowProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
```

- Title bar with horizontal stripes pattern (repeating-linear-gradient)
- Close box (11x11px square) on top-left of title bar
- Content area with inset border styling
- Responsive: on mobile, window fills viewport; on desktop, centered with max-width
- ESC key closes window (defensive — check `isOpen` first)
- `role="dialog"` and `aria-modal="true"` for accessibility

**Research Insight: Title Bar Stripes**
```css
.mac-title-bar {
  height: 19px;
  background: repeating-linear-gradient(90deg, white 0px, white 1px, black 1px, black 2px);
  border-bottom: 1px solid black;
}

.mac-close-box {
  width: 11px; height: 11px;
  border: 1px solid black;
  background: white;
}
.mac-close-box:active { background: black; }
```

**Research Insight: ESC handler must be defensive:**
```typescript
useEffect(() => {
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) onClose();
  };
  window.addEventListener('keydown', handleEsc);
  return () => window.removeEventListener('keydown', handleEsc);
}, [isOpen, onClose]);
```

**References:** [system.css (System 7 CSS library)](https://sakofchit.github.io/system.css/), [system7.css](https://system7.style/)

File: `app/components/MacWindow.tsx`

#### 3.4 Gallery Window Content

- Uses Motion for draggable cards
- Each card: photo with optional caption below
- Cards stacked/scattered initially, user drags them around
- Drag constrained to window bounds
- Last-dragged card goes to top via explicit z-index state
- On mobile: cards in a scrollable row, tap to enlarge

```typescript
import { motion } from "motion/react"

// Z-index management via state, not whileDrag
const [topCard, setTopCard] = useState<string | null>(null);

<motion.div
  drag
  dragConstraints={containerRef}
  dragElastic={0.1}
  onDragStart={() => setTopCard(photo.id)}
  style={{
    x: initialX,
    y: initialY,
    rotate: randomRotation,
    zIndex: topCard === photo.id ? 50 : 1,
  }}
>
  <Image src={photo.url} alt={photo.caption ?? `Photo ${photo.id}`} ... />
</motion.div>
```

**Research Insight: Handle null caption** — `alt={photo.caption ?? `Photo ${photo.id}`}` prevents React warning for undefined alt text.

File: `app/components/GalleryContent.tsx`

#### 3.5 Wishes Window Content

- Scrollable grid/list of wish cards inside the Mac window
- Each card shows:
  - Author name (bold, top, Chicago font)
  - Media: `<Image>` for photo, `<video>` for video (manual play), `<img>` for gif
  - Message text below media
- Cards in a responsive grid: 1 column on mobile, 2 columns on desktop
- Videos: `preload="metadata"`, manual play, NOT autoplay
- Long messages: just use `overflow-y-auto` on the card (no truncation needed)
- Fallback: if media fails to load, show author name + message only

**Research Insight: Video cleanup on window close:**
```typescript
useEffect(() => {
  return () => {
    // Pause all videos when window unmounts
    const videos = containerRef.current?.querySelectorAll('video');
    videos?.forEach(v => { v.pause(); v.currentTime = 0; });
  };
}, []);
```
This prevents audio from continuing after the Mac window closes.

File: `app/components/WishesContent.tsx`

---

### Phase 4: Polish & Sound

**Goal:** Sound effects, transitions, responsive, final touches.

#### 4.1 Sound effects via native Audio API

```typescript
// app/lib/audio.ts
export function playSound(src: string) {
  try {
    const audio = new Audio(src);
    audio.volume = 0.5;
    audio.play().catch(() => {}); // Silently fail if autoplay blocked
  } catch {
    // Audio not supported, ignore
  }
}
```

Usage in components:
```typescript
import { playSound } from '@/app/lib/audio';

// In click handler:
playSound('/audio/switch.mp3');
advance();
```

- Sound plays on user click (no autoplay issues since it's user-initiated)
- If sound fails to load, silently ignore — visual experience still works
- No mute button needed (sounds are short, interaction-triggered only)

#### 4.2 Responsive design

| Breakpoint | Behavior |
|------------|----------|
| Mobile (<640px) | Full-screen scenes, Mac window fills viewport, gallery cards as horizontal scroll, single-column wishes |
| Desktop (>640px) | Centered Mac window with max-width, scattered gallery cards, 2-column wishes |

- Light switch: minimum 48x48px touch target
- Door: large click area (full door illustration)
- Desktop icons: minimum 64x64px with text label below

#### 4.3 Interaction affordances

- Scene 1: Switch has subtle glow on hover, hint text after 2s delay
- Scene 2: Door has gentle bounce animation, "Knock on the door" text
- Scene 5: Desktop icons highlight on hover (Mac OS selection: black bg behind label)
- Cursor changes: `cursor-pointer` on all interactive elements

#### 4.4 Security headers (add to next.config.ts)

```typescript
async headers() {
  return [{
    source: '/:path*',
    headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'no-referrer' },
    ],
  }];
}
```

---

## File Structure (Final)

```
app/
├── page.tsx                      # Scene manager ("use client")
├── layout.tsx                    # Root layout, metadata, retro font
├── globals.css                   # Tailwind 4 theme, Mac OS styles, animations
├── lib/
│   └── audio.ts                  # playSound() helper
└── components/
    ├── DarkRoomScene.tsx         # Scene 1: Light switch
    ├── LampEffectScene.tsx       # Scene 2: Lamp glow + door
    ├── DoorOpenScene.tsx         # Scene 3: Door swing animation
    ├── BirthdayGreeting.tsx      # Scene 4: Birthday message
    ├── DesktopScene.tsx          # Scene 5: Mac OS desktop with icons
    ├── MacWindow.tsx             # Reusable Mac OS window chrome
    ├── GalleryContent.tsx        # Draggable photo cards
    └── WishesContent.tsx         # Wish cards grid
data/
└── content.ts                    # Typed wishes + photos arrays
public/
├── fonts/
│   └── ChicagoFLF.woff2         # Retro Mac font
├── images/
│   ├── gallery/                  # Group photos
│   ├── wishes/                   # Per-person media
│   └── wallpaper-blurred.jpg    # Pre-blurred desktop background
├── audio/
│   ├── switch.mp3                # Light switch sound
│   ├── knock.mp3                 # Door knock sound
│   └── door-open.mp3            # Door creak sound
└── robots.txt                    # Prevent search indexing
```

## Acceptance Criteria

### Functional Requirements

- [ ] Scene 1: Black screen with clickable light switch, plays sound, transitions to Scene 2
- [ ] Scene 2: Lamp glow animation, greeting text, clickable door, plays knock sound
- [ ] Scene 3: Door swings open with 3D CSS animation, plays door sound, reveals bright Scene 4
- [ ] Scene 4: Birthday greeting for Ka Sharon with light blue theme
- [ ] Scene 5: Mac OS 90s desktop with menu bar, wallpaper, and two clickable icons
- [ ] Gallery window: Opens Mac-style window with draggable photo cards
- [ ] Wishes window: Opens Mac-style window with scrollable wish cards (photo/video/gif + text)
- [ ] Sound effects play on user interaction (switch, knock, door)
- [ ] Data file drives gallery and wishes content
- [ ] Responsive on mobile and desktop
- [ ] Transition guard prevents double-click scene skipping
- [ ] Door animation uses `animationend` event (not setTimeout)
- [ ] Videos pause when Mac window closes

### Non-Functional Requirements

- [ ] Works in Chrome, Safari, Firefox (latest versions)
- [ ] Page loads in < 3 seconds on fast connection
- [ ] Respects `prefers-reduced-motion` media query
- [ ] All interactive elements have minimum 48x48px touch targets
- [ ] Videos have manual play controls (no autoplay)
- [ ] Graceful degradation if sound/media fails to load
- [ ] `robots.txt` and noindex meta tag prevent search indexing

## Design Decisions & Edge Cases

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Skip intro? | No skip button | It's short (3 clicks), birthday gift should be experienced fully |
| Back navigation | Not supported | Linear journey, keep it simple. Refresh to restart. |
| Browser back button | Does nothing (single page) | No URL routing per scene |
| Page refresh | Restarts from Scene 1 | No state persistence needed for a birthday gift |
| Window behavior | One at a time | Simpler, no z-index management between windows |
| Video playback | Manual play, inline | Respect user control, no audio overlap |
| Long wish text | No truncation, scrollable card | Birthday wishes aren't essays; `overflow-y-auto` suffices |
| Missing media | Show message without media | Graceful fallback |
| Gallery on mobile | Horizontal swipe row | Drag is awkward on mobile, swipe is natural |
| Photo aspect ratio | `object-cover` with fixed card size | Consistent layout |
| Sound library | Native Audio API | 3 sounds don't justify a 25KB library |
| Wallpaper blur | Pre-blurred image | `backdrop-filter` kills performance on mobile |
| Data format | TypeScript file | No JSON parsing, no types file, no wrapper interfaces |
| Component naming | PascalCase (no underscores) | Consistent React conventions |

## Dependencies & Risks

| Risk | Mitigation |
|------|------------|
| Birthday is TODAY | Focus phases 1-3 first (core journey), polish later. Content can use placeholders. |
| Sound files not ready | Site works perfectly without sound. Add later. |
| Photos not collected yet | Use placeholder images. User drops real photos into `/public/images/` and updates `data/content.ts`. |
| 3D door animation browser issues | Fallback: simple fade transition if `perspective` not supported |
| Motion library issues | Gallery cards still display without drag — drag is enhancement |
| Double-click skipping scenes | Transition guard with `isTransitioning` state |
| Door animation desync | Use `animationend` event, not `setTimeout` |
| Video audio leaking after close | Cleanup in `useEffect` return |

## Quick Start for Content Contributors

To add a wish, edit `data/content.ts`:
```typescript
// Add to the wishes array:
{
  id: "X",
  author: "Your Name",
  mediaType: "photo",
  mediaUrl: "/images/wishes/yourname.jpg",
  message: "Your birthday message here"
},
```
Then put your photo/video in `public/images/wishes/yourname.jpg`.

To add gallery photos:
```typescript
// Add to the photos array:
{
  id: "X",
  url: "/images/gallery/photoX.jpg",
  caption: "Optional caption",
},
```
Then put the group photo in `public/images/gallery/photoX.jpg`.

## References

- Brainstorm: `docs/brainstorms/2026-04-08-birthday-website-brainstorm.md`
- Lamp effect: [Aceternity Lamp Component](https://ui.aceternity.com/components/lamp-effect), [CSS Spotlight (Frontend Masters)](https://frontendmasters.com/blog/css-spotlight-effect/)
- Draggable cards: https://dev.pitstop.design/components/draggable-card
- Motion drag API: `drag`, `dragConstraints`, `dragElastic`, `onDragStart`
- Door animation: [CSS 3D Door (Manuel Strehl)](https://manuel-strehl.de/opening_door_in_css), [CodePen](https://codepen.io/am_eu/pen/EgedaQ)
- Mac OS CSS: [system.css](https://sakofchit.github.io/system.css/), [system7.css](https://system7.style/)
- Chicago font: [ChicagoFLF (FontsArena)](https://fontsarena.com/chicago-flf-by-robin-casady/)
- Tailwind CSS 4 `@theme`: https://tailwindcss.com/docs/theme
- Next.js 16 docs: `node_modules/next/dist/docs/`
