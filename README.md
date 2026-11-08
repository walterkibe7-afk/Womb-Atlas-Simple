# Womb Atlas Simple

A calm, private menstrual and reproductive health tracker — participant-side only.
Warm, minimal, mobile-first. Like a caring midwife, not a medical device.

## The product (v1 scope — three screens, nothing else)

1. **Home / Today** — greeting, cycle phase, a gentle insight, quick links to Log and History
2. **Log** — flow, pain, symptoms, mood, one optional note; one step per view; "Save entry"
3. **History** — month calendar with period/pain dots, list of past entries, one simple chart

Explicitly out of scope: multi-step wizards, admin panels, AI chat, translations, data export.

## Stack

- Vite + React + TypeScript (local-first prototype — no backend yet)
- Tailwind CSS v4 for styling
- `motion/react` (Framer Motion) for gentle animation
- Data persists in React state with seeded demo entries (localStorage + onboarding are the next steps)

See `AGENTS.md` for the full product contract, design language, and locked decisions.

## Run locally

```bash
npm install
npm run dev
```

Then open the printed localhost URL. Use the banner switcher to view the desktop
adaptation or the 375 × 812 mobile device frame.

## Type-check

```bash
npm run lint
```
