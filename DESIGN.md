---
name: Sprout Planner
description: A calm, encouraging daily habit tracker where a translucent jelly sprout grows as you complete your day.
colors:
  sprout-primary: "#16a34a"
  sprout-bright: "#22c55e"
  sprout-deep: "#15803d"
  sprout-tint: "#f0fdf4"
  surface: "#f7fdf8"
  surface-muted: "#eef8f1"
  surface-dark: "#0d1710"
  surface-dark-muted: "#141f17"
  ink: "#1a2e1e"
  ink-muted: "#4b6255"
  ink-subtle: "#6b8c76"
  on-accent: "#ffffff"
  flame: "#f97316"
  progress-amber: "#fbbf24"
  missed-red: "#f87171"
typography:
  display:
    fontFamily: "Roboto, Prompt, 'Noto Sans SC', 'Noto Sans TC', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(4.5rem, 12vw, 6rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Roboto, Prompt, 'Noto Sans SC', 'Noto Sans TC', ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "normal"
  title:
    fontFamily: "Roboto, Prompt, 'Noto Sans SC', 'Noto Sans TC', ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Roboto, Prompt, 'Noto Sans SC', 'Noto Sans TC', ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: "Roboto, Prompt, 'Noto Sans SC', 'Noto Sans TC', ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.05em"
rounded:
  cell: "8px"
  chip: "12px"
  control: "16px"
  sheet: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.sprout-primary}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.control}"
    padding: "12px 16px"
  button-primary-hover:
    backgroundColor: "{colors.sprout-deep}"
    textColor: "{colors.on-accent}"
  button-pill:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.sprout-deep}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
  install-cta:
    backgroundColor: "{colors.sprout-primary}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.full}"
    padding: "10px 20px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px 16px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "16px"
  task-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "16px"
  task-row-done:
    backgroundColor: "{colors.sprout-tint}"
    textColor: "{colors.ink-subtle}"
    rounded: "{rounded.control}"
    padding: "16px"
  tab-selected:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.sprout-deep}"
    rounded: "{rounded.chip}"
    padding: "8px 8px"
---

# Design System: Sprout Planner

> Sprout Planner is the first module of **Sprout Universe**. The same system
> below dresses the universe's marketing landing page (`src/landing/`) — one
> sprout-green family, tinted neutrals, 16px control radius, flat-at-rest, and
> the jelly-sprout mascots as the brand imagery.

## 1. Overview

**Creative North Star: "The Living Terrarium"**

Sprout Planner is a small glass garden you tend once a day. Everything happens inside a softly glowing, sprout-tinted world: the surfaces are barely-green panes of frosted glass, the mascot is a translucent jelly sprout that grows happier as your day fills in, and progress is shown as something _living_ — a watering can, a sprout breaking soil, a celebration — rather than a number on a chart. The system's job is to make checking off a task feel warm, gentle, and quietly rewarding, never like operating a productivity dashboard.

The aesthetic is **calm encouragement**. Type is friendly and rounded, corners are generous (16px is the resting radius), motion is soft and exponential (ease-out, never bouncy), and color is restrained: one green family carries the entire identity, applied to tinted neutrals so nothing is ever pure white or black. The app explicitly rejects the visual language of corporate habit-trackers and gamified streak apps: no neon-on-black, no dark techy gradients, no badges-and-XP clutter, no SaaS hero-metric cards. Where competitors shout, Sprout grows.

Depth is mostly tonal: layers are distinguished by slightly different green-tinted surfaces, and shadows stay out of sight until you interact, at which point elements gently lift. The signature moment is the **progression hero** — a full-viewport screen where the mascot, a giant living percentage, and a rising "growth fill" gradient reflect exactly how far through today you are.

**Key Characteristics:**

- One green family (the `sprout` scale) carries identity; neutrals are all green-tinted.
- Generous 16px "control" radius everywhere; pills and avatars are fully round.
- Flat at rest, lift on interaction — exponential ease-out, no bounce.
- A translucent jelly-sprout mascot is the emotional core, posed per progress state.
- Bilingual-first typography (Latin + Thai + Chinese) from a single weighted family.

## 2. Colors

A single sprout-green family, applied generously, against neutrals that are all faintly tinted toward that same green so the world feels like one continuous pane of living glass.

### Primary

- **Sprout Leaf** (`#16a34a`, sprout-600): The primary action color. Solid-fill buttons, the add-task button, the install CTA, completed-task checkmarks.
- **Sprout Glow** (`#22c55e`, sprout-500): The brighter signal green. Progress-ring arcs, completed-day fills, the focus-ring color, "today" highlight rings.
- **Sprout Deep** (`#15803d`, sprout-700): The brand-text green. The "Sprout" wordmark, pill-button labels, active tab text. Reads as confident, not loud.
- **Sprout Tint** (`#f0fdf4`, sprout-50): The faintest green wash. Completed/selected backgrounds, milestone banners, the resting state of soft chips.

### Tertiary (status signals only)

- **Streak Flame** (`#f97316`, orange-500): The streak flame icon and best-streak accent. The only warm color in the system; reserved for momentum.
- **In-Progress Amber** (`#fbbf24`): "Today, not yet finished" — the in-progress ring arc and today's calendar/week cell.
- **Missed Red** (`#f87171`): A soft, non-punitive red for missed days. Muted on purpose; a gentle nudge, never an alarm.

### Neutral

- **Ink** (`#1a2e1e`): Primary text. A near-black tinted green, never pure `#000`.
- **Ink Muted** (`#4b6255`): Body and secondary text; holds ≥4.5:1 on light surfaces.
- **Ink Subtle** (`#6b8c76`): Placeholders, decorative labels, weekday letters.
- **Surface** (`#f7fdf8`) / **Surface Muted** (`#eef8f1`): The two light panes — base and recessed.
- **Surface Dark** (`#0d1710`) / **Surface Dark Muted** (`#141f17`): The two dark panes for dark mode.
- **On Accent** (`#ffffff`): White text/icons, used _only_ on saturated sprout-green fills. Never as a surface.

### Named Rules

**The Tinted-Neutral Rule.** Pure `#ffffff` and `#000000` are forbidden as surfaces or text. Every neutral leans toward the sprout hue. White exists only as ink on top of saturated green.

**The One-Family Rule.** Identity is carried by the single sprout scale. Amber, orange, and red appear _only_ as status signals (in-progress, streak, missed) and never as decoration or alternate brand colors.

## 3. Typography

**Display / Body Font:** A single weighted, language-aware stack — Roboto (Latin), Prompt (Thai), Noto Sans SC / TC (Chinese), falling back to `ui-sans-serif, system-ui`. The active language reorders the stack so each script renders in its native companion face.

**Character:** Friendly, rounded, and humanist. There is no separate display face; hierarchy comes entirely from scale and weight, which keeps the four languages visually consistent. The voice is encouraging, never corporate.

### Hierarchy

- **Display** (700, `clamp(4.5rem, 12vw, 6rem)`, line-height 1): The living percentage in the progression hero. The single largest element in the app; tabular numerals, tight tracking.
- **Headline** (700, `1.875rem` / text-3xl, line-height 1.15): Page titles ("Today").
- **Title** (700, `1.125rem` / text-lg): Dialog and section headings.
- **Body** (500, `0.875rem` / text-sm, line-height 1.5): Task titles, descriptions, the default reading size. Medium weight by default for warmth.
- **Label** (600, `0.75rem` / text-xs, letter-spacing `0.05em`, UPPERCASE): Section eyebrows ("THIS WEEK"), stat captions, the scroll cue.

### Named Rules

**The Tabular-Number Rule.** Every number that animates or updates — percentages, streak counts, stats, day cells — uses tabular numerals so digits never reflow as they count up.

**The One-Family Rule (type).** No second typeface. Emphasis is weight (500 → 700) and scale, never a contrasting font.

## 4. Elevation

The system is **flat at rest with tonal layering**, and shadows are reserved as a _response to interaction_. Depth between panels comes from the two-step surface ramp (Surface vs. Surface Muted), not from drop shadows. When something becomes interactive — a button press, a card hover, a focus — it gently lifts with a soft, green- or warm-tinted shadow and a 1-2px translateY. The one always-on shadow is the diffuse glow beneath the mascot, which makes the jelly figure feel like it's floating in the terrarium.

### Shadow Vocabulary

- **Button Lift** (`box-shadow: 0 10px 24px rgba(22,101,52,0.10)` + `translateY(-1px)`): Default button hover. Active state drops to `translateY(0) scale(0.97)`.
- **Card Lift** (`box-shadow: 0 18px 40px rgba(251,146,60,0.08–0.20), 0 4px 14px rgba(22,101,52,0.06)` + `translateY(-2px)`): The `motion-card` hover (streak card). The orange component intensifies with streak length.
- **Mascot Float** (`drop-shadow: 0 18px 30px rgba(22,101,52,0.18)`): The always-on glow under the hero mascot; paired with a slow vertical float.
- **Sheet** (`shadow-2xl`): Modals and the iOS install sheet, lifted clearly above the dimmed, blurred backdrop.
- **Input Glow** (`box-shadow: 0 0 0 4px rgba(34,197,94,0.12)`): The focus halo on text inputs — a soft green ring rather than a hard border.
- **Focus Ring** (`ring-2` Sprout Glow `+ 2px offset`): The global `:focus-visible` treatment. Never removed without this replacement.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. A shadow is a reaction — to hover, focus, or elevation above a backdrop — never decoration on a static element.

**The Lift-Don't-Pop Rule.** Interaction lifts elements 1-2px with a soft, wide, low-opacity shadow. If it looks like a hard 2014 drop shadow (dark, tight blur, offset down), it's wrong.

## 5. Components

### Buttons

- **Shape:** Generously rounded — 16px "control" radius for solid buttons, fully round (pill) for toggles and the install CTA.
- **Primary:** Sprout Leaf (`#16a34a`) fill, white label/icon, `12px 16px` padding; minimum 44×44px touch target. Hover deepens to Sprout Deep (`#15803d`) and lifts; active scales to 0.97.
- **Pill / Toggle:** Surface Muted fill with a Sprout-100 border and Sprout Deep label (e.g. "Manage monthly recurring tasks"). Selected state fills with Sprout Tint and a Sprout-300 border.
- **Install CTA:** Sprout Leaf pill with a soft `shadow-sprout-600/25` glow; appears only on handheld devices that aren't already installed.

### Chips & Cells

- **Day / Week Cells:** 8px "cell" radius squares, colored by status — Sprout Glow fill for complete, soft amber for in-progress, soft red wash for missed, tinted-neutral for empty. Today carries a Sprout Glow ring with surface offset.
- **Status Badge:** Fully-round pill, tinted background + matching text per status (e.g. Sprout for done, soft red for missed).

### Cards / Containers

- **Corner Style:** 16px "control" radius for cards; 24px "sheet" radius for modals.
- **Background:** Surface (light) / Surface Dark Muted (dark).
- **Border:** A hairline Sprout-100 / Sprout-950 border, not a shadow, defines the resting edge.
- **Shadow Strategy:** None at rest. See Elevation — `motion-card` lifts only on hover.
- **Internal Padding:** 16px default (`md`), 24px (`lg`) for modals.

### Inputs / Fields

- **Style:** Surface fill, hairline gray/sprout border, 16px radius, `12px 16px` padding.
- **Focus:** Border shifts to Sprout-400 and a soft green Input Glow halo appears. No hard outline.

### Navigation

- **Tab Bar:** A three-up segmented control inside a rounded `chip` (12px) container on a Surface Muted track. Selected tab gets a Surface fill, Sprout Deep label, soft ring, and lift; unselected tabs are Ink Muted and tint green on hover. Icons sit above labels; each tab is ≥52px tall.
- **Top Bar:** Sticky, translucent (`bg-surface/85` + `backdrop-blur-md`) so the full-bleed hero shows through, with a hairline bottom border.

### Signature Component — The Progression Hero

A full-viewport (`100svh`) screen that visualizes today's completion: a stage-matched mascot (sad → notepad → watering → celebrating across the 0/25/50/75% thresholds) floating over a soft glow, a giant living Display percentage, an encouraging stage line, the streak flame, and a bottom-anchored "growth fill" gradient that scales vertically with progress (transform only, never animating height). A 100% completion triggers a seed-burst celebration. Scroll reveals the week strip and task list.

### Signature Component — The Mascot System

A translucent jelly sprout rendered in transparent PNGs, posed per state: `logo` (head), `neutral`, `progress` (notepad), `success` (celebrating), `fail` (sad), `empty` (watering), `streak` (weightlifting). The mascot is the emotional narrator of every state — empty, in-progress, complete, missed.

## 6. Do's and Don'ts

### Do:

- **Do** carry identity with the single sprout-green family; use amber/orange/red strictly as status signals.
- **Do** tint every neutral toward the sprout hue; keep two-step surface ramps (Surface / Surface Muted) for layering.
- **Do** use the 16px "control" radius as the resting shape; reserve full-round for pills, avatars, and checkboxes.
- **Do** keep elements flat at rest and lift them 1-2px with a soft, wide, low-opacity shadow on interaction.
- **Do** animate with exponential ease-out (`cubic-bezier(0.22, 1, 0.36, 1)`) and honor `prefers-reduced-motion`.
- **Do** use tabular numerals for every counting/animating number.
- **Do** let the mascot narrate emotional state; match its pose to the progress stage.
- **Do** keep every interactive control ≥44px and provide a visible `:focus-visible` Sprout ring.

### Don't:

- **Don't** use pure `#ffffff` or `#000000` as a surface or text color — ever. White is ink-on-green only.
- **Don't** introduce a second brand color or a second typeface; emphasis is weight and scale.
- **Don't** ship the gamified habit-tracker look: neon-on-black, dark techy gradients, XP bars, badge clutter.
- **Don't** use the SaaS hero-metric cliché — a gradient-accented stat card with big number + supporting stats. The sanctioned big-number moment is the mascot-anchored progression hero, nothing else.
- **Don't** use gradient text (`background-clip: text`), colored side-stripe borders (`border-left` accents), or decorative glassmorphism. The only glass is the mascot itself.
- **Don't** apply hard, dark, tight-blur drop shadows at rest. If it looks like a 2014 app card, the shadow is wrong.
- **Don't** animate layout properties for the growth fill or transitions; use transform/opacity only.
- **Don't** use bounce or elastic easing anywhere.
