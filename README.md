# 🌱 Sprout Universe

> A calm family of small, encouraging tools you tend once a day.
> Where other apps shout with streaks and badges, **Sprout grows.**

Sprout Universe is a personal-productivity product built around a single idea —
**"The Living Terrarium."** Everything happens inside a softly glowing, sprout-
tinted world where a translucent jelly-sprout mascot grows happier as you finish
your day. The first available module is **Sprout Planner**.

This repository contains a marketing **landing page** (`/`) and the **Sprout
Planner** Progressive Web App (`/app/`), built as a single Vite project with two
entry points.

> **License:** This is **not** open-source software. The hosted app is free for
> everyone to use, but the source code and assets are proprietary.
> See [Security & Privacy](#-security--privacy) and [License](#-license).

---

## ✨ Modules

| Module | Status | What it does |
| --- | --- | --- |
| **Sprout Planner** | ✅ Live | Tend a small set of daily & monthly tasks. Streaks, a calendar heatmap, gentle reminders, and a full-screen progression hero. |
| **Sprout Together** | 🌱 Coming soon · via LINE OA | Grow a shared garden with friends and family — gentle accountability, not competition. |
| **Sprout Finance** | 🌱 Coming soon · via LINE OA | Track income and expenses by chatting with your Sprout on LINE; savings grow into a money tree. |
| **Sprout Mood** | 🌱 Coming soon · via LINE OA | A one-tap daily mood check-in that blooms into a soft emotional garden. |

## 🧰 Tech stack

- **React 18** + **TypeScript** + **Vite 5**
- **Tailwind CSS 3** (design tokens mirror [`DESIGN.md`](DESIGN.md))
- **PWA** — offline app-shell via a hand-written service worker, installable
- **i18n** — English, Thai (default), Simplified & Traditional Chinese, with a
  language-aware font stack (Roboto / Prompt / Noto Sans SC·TC)
- **Optional AI** — Google Gemini powers the "Plan my day" assistant
- No backend: all user data lives in the browser's `localStorage`

## 📁 Project layout

```
index.html            Landing page entry  →  served at /
app/index.html        Planner app entry   →  served at /app/
src/
  landing/            Sprout Universe marketing page (Landing.tsx, modules.ts)
  components/          Planner UI (Today, Calendar, Dashboard, Settings, …)
  lib/                Domain logic, storage, i18n, AI, dates
public/               Mascot PNGs, icons, manifest, service worker
DESIGN.md / PRODUCT.md  Design system & product brief (source of truth)
```

## 🚀 Getting started

Requires Node.js 18+.

```bash
npm install         # install dependencies
npm run dev         # start the dev server (landing at /, planner at /app/)
npm run build       # type-check (tsc) + production build → dist/
npm run preview     # serve the production build locally
npm run test:domain # run the pure domain-logic tests
```

## 🔑 Environment variables

The AI assistant is **optional** — the app works fully without it. To enable it,
copy [`.env.example`](.env.example) to `.env` and add a free Google Gemini key:

```bash
cp .env.example .env
# then set VITE_GEMINI_API_KEY=...
```

> ⚠️ **This is a frontend-only app.** Any `VITE_*` value is compiled into the
> public JavaScript bundle and is visible to anyone who uses the app. For local
> use, a personal/free key is fine. **For a public deployment, do not ship your
> key** — put a small server-side proxy in front instead. The app already
> supports a custom AI endpoint for exactly this (`AISettings.endpoint`).

## 🔒 Security & Privacy

- **No secrets in git.** `.env`, keys, `node_modules/`, and the build `dist/`
  are git-ignored. Never commit a real API key — because it bundles into the
  client, a leaked key should be rotated immediately in Google AI Studio.
- **Client-side data.** All tasks, streaks, and settings are stored locally in
  `localStorage` on the user's device. There is no server collecting user data.
- **AI key exposure.** See the warning above — the bundled Gemini key is
  client-visible by design. Restrict it (referrer/quota) or proxy it for public
  deploys.
- **Third-party calls.** When the AI feature is enabled, prompts are sent to the
  configured AI endpoint (Google Gemini by default).

Before pushing, sanity-check that no key leaked into tracked files:

```bash
git ls-files | xargs grep -lE 'AIza[0-9A-Za-z_-]{30,}' 2>/dev/null   # expect: no output
```

## 📜 License

**Proprietary — © 2026 Sarit. All rights reserved.** This software is **not**
open source. You may **use** the hosted application for free, but you may not
copy, modify, redistribute, or sell the source code or assets without written
permission. Full terms in [`LICENSE`](LICENSE).

For commercial use, redistribution, or source access: **saritrungj27@gmail.com**
