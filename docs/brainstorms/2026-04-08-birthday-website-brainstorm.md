# Birthday Website for Ka Sharon

**Date:** 2026-04-08
**Status:** Brainstorm complete

---

## What We're Building

An interactive, cinematic birthday website for Ka Sharon from her friend group (10+ people). The site takes visitors through a journey from darkness to celebration, culminating in a retro Mac OS-style desktop where they can explore a photo gallery and read personal wishes.

### User Journey (5 Scenes)

**Scene 1 - The Dark Room**
- Pitch-black screen with a single light switch (saklar)
- User clicks/flips the switch to proceed
- Theme: Dark

**Scene 2 - The Lamp Effect**
- Inspired by [pitstop lamp-effect component](https://dev.pitstop.design/components/lamp-effect)
- Dramatic lamp illumination reveals a greeting: "Are you ready to have fun with us?"
- A door appears at the bottom/center of the scene
- User knocks the door (click/tap interaction)
- Theme: Dark

**Scene 3 - The Door Opens**
- Door physically swings open with animation
- Reveals the bright birthday world behind it
- Transition from dark theme to light theme happens here
- Theme: Dark → Light transition

**Scene 4 - Birthday Greeting**
- General birthday message for Ka Sharon
- Bright, light theme with light blue palette
- Scrolls down to the "desktop"
- Theme: Light (ADD8E6 / 87CEFA palette)

**Scene 5 - The Desktop**
- Classic Mac OS (90s) aesthetic desktop
- Retro window chrome, Chicago-style font, pixel icons
- Two clickable desktop icons:
  - **Gallery** - Opens a Mac-style window with draggable photo cards (group photos)
  - **Wishes** - Opens a Mac-style window with cards from each person (10+ people)
- Theme: Light with retro Mac styling

### Gallery Details
- Group photos of the friend circle with Ka Sharon
- Draggable card interaction inspired by [pitstop draggable-card](https://dev.pitstop.design/components/draggable-card)
- Photos can be tossed/dragged around playfully

### Wishes Details
- 10+ individual wish cards
- Each card: photo/video/gif + written message from one person
- Card layout within a Mac-style window
- Scrollable if many wishes

---

## Why This Approach

**Single-Page Journey** - All 5 scenes live on one page with CSS/JS-driven transitions. No page reloads for a seamless, cinematic experience.

Reasons:
- Smooth transitions between scenes feel more immersive
- Dark-to-light theme transition is easier to control
- The "door opening" animation flows naturally into the birthday content
- Assets can be lazy-loaded per scene
- Simpler than coordinating animated route transitions

---

## Key Decisions

1. **Single-page architecture** - Scene-based transitions, no routing between journey steps
2. **Classic Mac OS (90s) desktop** - Grayscale window chrome, pixel icons, Chicago-style font for the main interactive area
3. **Color palette** - Dark theme (scenes 1-3), light blue theme ADD8E6/87CEFA (scenes 4-5)
4. **Door animation** - Physical swing-open revealing content behind it
5. **Gallery** - Draggable/tossable group photo cards
6. **Wishes** - Individual cards per person with flexible media (photo/video/gif) + text
7. **Tech stack** - Next.js 16, React 19, Tailwind CSS 4, TypeScript (already set up)
8. **Audio** - Sound effects only for interactions (switch, knock, door open)
9. **Mobile** - Responsive Mac desktop adapted for touch/small screens
10. **Media** - All assets in `/public` folder
11. **Content** - JSON data file for wishes and gallery items
12. **Language** - English throughout
13. **Desktop wallpaper** - Blurred/subtle group photo as the Mac OS background

---

## Resolved Questions

1. **Audio** - Sound effects only (switch flip, door knock, door open). No background music.
2. **Mobile** - Responsive desktop: keep the Mac desktop concept but adapt for touch/small screens.
3. **Media storage** - Public folder (`/public`). Simplest approach, no external dependencies.
4. **Content management** - JSON data file (e.g., `wishes.json`) for easy editing of wishes and gallery items.
5. **Deployment** - Decide later. Focus on building first.
6. **Timeline** - Birthday is TODAY (2026-04-08). Must move fast and prioritize core journey.
