# Womb Atlas Simple — Agent Context

Read this before doing anything. This file is the single source of truth for what this project is and what it must become.

## What this project is

A **from-scratch rebuild** of "Womb Atlas", a **menstrual and reproductive health tracking app**. Users log symptoms (flow, pain, mood, notes) and the app reflects that data back as simple, calm insights.

That one sentence is the whole product. Everything in this file exists to keep the build aligned with that sentence.

## Why this project exists

The original Womb Atlas (at `D:\Web Designs\Womb Atlas`) grew into something far more complex than the product required: a 65-question wizard, 4 user roles (participant/steward/admin/analyst), ~47 database tables, steward review queues, analyst dashboards, a translation pipeline, AI chat personas, and an "Atlas Records" abstraction layer. It works, but it is over-engineered for its purpose (A period-symptom tracker with insights).

**This project is the simplification: strip it back to the core. Participant-side first.**

## ⚠️ Rule: DO NOT copy code from the old project

`D:\Web Designs\Womb Atlas` is **reference material only** — for visual style, tone of voice, and the login/auth approach. Do not copy its code files. Do not copy its data model. It informed every decision below; everything worth taking is already written down here or in the design prompt. If something from the old repo seems needed, extract the *idea* and write fresh, minimal code.

## Scope — v1 (participant side only)

**Three screens. Nothing else.**

1. **Home / Today**
   - Greeting + a calm status card (current cycle phase, "How are you feeling today?" affordance)
   - One gentle insight line ("Your pain is usually lighter on day 3 of your period")
   - Quick links to Log and History
   - No number-heavy dashboard. No charts on this screen.

2. **Log**
   - Short entry form: flow level (4 pill options), pain level (0–5 slider), top symptoms (max ~6 chips), mood, one optional note field
   - One question group per view, large touch targets, "Save entry" is the only primary button
   - Max 3 simple progress dots — this is NOT the old 20-screen wizard

3. **History**
   - Month calendar with dots marking period / heavy-flow / pain days
   - Reversed list of past entries (date + one-line summary); tap to view full entry
   - At most one simple chart

**Explicitly excluded from v1 (for THIS repo's agents):** wizard screens beyond the short form, steward/analyst/admin roles or queues, Atlas Records, translations/localization, voice input, TTS, export, settings trees. If a feature is not in the list above, it is out of scope — do not build it "while you're there." **Exception for another team's work:** the AI chat companion — renamed from "Aminata" to **Sikiza** — is being added by Ramtech as an external 90-day workstream (Nov 2026–Feb 2027); see `docs/SIKIZA-COMPANION.md` for its scope, boundaries, and the no-residue rules. Our agents still never build it unsolicited.

## Stack

- **Frontend: Vite + React + TypeScript** SPA — the screens in `src/` match the v1 design. No Next.js migration.
- **Backend (added 2026-11-08, user decision — supersedes the local-first-only plan):** Rust (the user chose Rust over Node/Go/Python for scaling), axum + tokio + sqlx in `backend/`, port 4001, pin hashing via the argon2 crate (Argon2id). The API and DB are the ONLY holders of user data.
- **Database: PostgreSQL 16 in a podman container** (WSL machine; host port **5433** — 5432 is occupied by the old project's DB). Started from root `compose.yaml`. See `prompts/00-backend-architecture.md` for the 4 tables (User/Profile/Entry/Session), enums, and the API contract — that file is the schema's single source of truth.
- **Tailwind CSS v4** (`@tailwindcss/vite`) for styling
- **Framer Motion (`motion/react`)** for animation
- **What got superseded:** the pure-localStorage persistence plan (prompts archived at `prompts/archive-localstorage/`). The session token lives in `sessionStorage` (`wombatlas:v1:api-token`) while a browser tab is open; the pin hash and all diary data live server-side in Postgres.

## Locked decisions (do not re-litigate in future sessions)

- **Onboarding spec (v1):** unlock (local passphrase, skippable) → **name (REQUIRED — user decision 2026-11-08, not skippable; keep a disabled-until-filled Continue, no skip link)** → last period start date + one reproductive-state chip (currently cycling · postpartum · perimenopause · pregnant/recovering · not sure; "not sure" → Home learning-mode, no forced answer) → rhythm sliders (cycle 21–35 d, period 2–7 d) + one quiet birth-control toggle. All steps except the name are skippable. Stored as a single local `Profile` record: `name, lastPeriodStart?, cycleLength (default 28), periodLength (default 5), reproductiveState, onHormonalBirthControl?, hasCompletedOnboarding`. Only 3–4 gentle screens, one question group per view; no progress meters.
- **The "tomorrow's behavior" test — final sweep (re-confirmed 2026-11-08):** a data-collection question survives only if app behavior differs the next morning for answer A vs answer B. Permanently excluded: **name-adjacent identity data such as age/DOB (debated explicitly and rejected — no age card), weight, birth country, nationality/current country, cultural background, family medical history, pregnancy history, medical history/diagnoses, care-access questions**. The "bleeding-pattern survey" idea is subsumed by daily logging itself. If a question's answer changes nothing tomorrow, it does not exist. (The old project collected these for its observatory/research layer — participant dashboards, steward review queues, analyst aggregates, mined signals/"Atlas Records", AI chat "Aminata". All out of scope here; the new app is a private diary, not a research instrument, and has no moderator: an entry is real the moment the user saves it. The companion now arrives as "Sikiza" via the external workstream — it must NOT reintroduce observatory fields; its data surface is our 4 tables behind explicit consent (`docs/SIKIZA-COMPANION.md`).)
- **Future roles, compressed (v2+ only, never built unsolicited):** the old 4-role research pyramid (participant/steward/admin/analyst) collapses to: *the participant app* (this app) + one future "Ops" surface (admin+steward tasks) + an analyst *view* (aggregate-only grant or exported report — a permission, not a person-type). The participant surface must never carry visible traces of the observatory (no review states, no queue badges). AI chat ("Aminata" → now delivered externally as Sikiza) is likewise a separate optional future module with its own consent story — see `docs/SIKIZA-COMPANION.md`.
- **Research data, if ever wanted:** only via a clearly-labeled, skippable, post-onboarding survey module writing to separate storage — never woven into first login or daily flows.
- **Prototype lineage:** the screen designs originate from an AI Studio iteration (Vite SPA). The 2026-11-08 merge ported that iteration's first-login flow (Unlock + 3 onboarding cards + phase/learning landing states) into this root app **on top of the dynamic-date foundation** (`getTodayIso()`/`getSeedEntries()` — no hardcoded "2026-11-07" anchors anywhere). Passcode handling is now server-side: Argon2id hash in the DB via the API; never plain anywhere.

## Design language (non-negotiable)

- Tone: calm, private, encouraging — "a caring midwife, not a medical device"
- Palette: warm cream background `#F7F3EC`, deep plum text `#4A2B33`, muted rose-gold accent `#C99A86`, soft sage support `#A8B5A2`
- Type: **Fraunces** (serif, headings — poetic, sentence case) + **Manrope** (sans, body)
- Cards: rounded 16–20px, soft shadows, generous whitespace
- Copy is short, warm, never clinical, avoids all-caps labels

## UI design prompt (for design tools / reference for the agent)

> Design a clean, warm, minimal mobile-first UI for a menstrual and reproductive health tracking app called **Womb Atlas**. Tone: calm, private, encouraging — like a caring midwife, not a medical device.
>
> **Brand/style:** cream `#F7F3EC` background, deep plum `#4A2B33` text, muted rose-gold `#C99A86` accent, soft sage `#A8B5A2` support. Fraunces-style poetic serif headings (sentence case), Manrope-style clean sans body. Rounded cards (16–20px), soft shadows, generous whitespace, no clinical-looking graphs.
>
> **Screens (only 3):**
> 1. **Home / Today** — greeting ("Good morning, Achieng"), calm status card: cycle phase + "How are you feeling today?" button. One gentle insight ("Your pain is usually lighter on day 3 of your period"). Quick links to Log and History. No clutter, no numbers-heavy dashboard.
> 2. **Log** — short friendly entry form: flow level (4 pill options), pain level (slider 0–5), top symptoms (max 6 chips), mood, one optional note. Large touch targets, one question group per view, "Save entry" as the only primary button. Progress shown as 3 simple dots, not a multi-step wizard.
> 3. **History** — simple month calendar with dots marking period/heavy-flow/pain days; reversed list of past entries (date + one-line summary); tap to see full entry. One emotion-free chart max.
>
> **Explicitly exclude:** multi-step wizard with progress meters, "Atlas Records," admin panels, review queues, chat/AI companions, settings trees, language toggles, data export. If in doubt, remove the element.
>
> **Output:** mobile screens (375×812) plus one desktop adaptation of Home.

## Animation direction

Gentle and purposeful only: soft screen fades, card entrance slides, springy micro-interactions on the log flow (pills, slider, save confirmation). Framer Motion. Nothing flashy, nothing scroll-jacking.

## Working agreements

- Mobile-first; desktop is a stretched adaptation, not a separate design
- When this file and some ambient assumption disagree, this file wins
- Any scope addition (roles, translations, extra screens) requires explicit user request — suggest it, don't build it (the one standing scope exception: the Sikiza companion is Ramtech's external workstream — see `docs/SIKIZA-COMPANION.md`; build nothing of it here)
- **No residue:** no legacy-companion leftovers may exist in this repo — no "Aminata" naming or strings, no copied chat/context code from the old project, no observatory terms (Atlas Records, steward, analyst, archetype, constellation) in any UI copy or schema ever added here
- **Milestone-gated deploys:** git is local-first of habit; a push to GitHub `main` (which triggers the Cloudflare Pages live build the client/team sees) happens ONLY after a named milestone is verified — lint + build (+ `cd backend && cargo check` once it exists) green and the journey clicked through end-to-end. Details and one-time setup: `docs/DEPLOYMENT.md`
