# Sikiza Companion — integration record (external workstream)

Documented 2026-11-08 from the vendor plan
`Sikiza Companion 90-Day Delivery Plan.docx` (Ramtech) and from a review of the
old Womb Atlas app's "Aminata" chat. **Ramtech adds the companion — this repo
does not build it.** This document records what is coming, the boundaries it
must respect, and what another developer's work may NOT leave behind here.

## What Sikiza is

A text **and voice** companion for Womb Atlas — the participant's listening
companion. The name is Swahili for *"listen."* It is NOT a medical advisor:
it listens, relays what the participant saved, and reflects observations back.
That is the same stance the v1 companion took ("an observational companion,
not a medical advisor") — the stance carries over; the implementation does not.

Delivered by Ramtech in 90 days: **Nov 9 2026 → Feb 6 2027**, closing when the
acceptance workbook passes on a named staging build. Production authorization
is granted separately by Womb Atlas.

## V1 lineage (what Aminata was — context only, do NOT rebuild from it)

The old app's Aminata was: Gemini 2.5 Flash (Vertex AI), 40-turn history from
Postgres, voice both ways via Google STT/TTS, and — critically — a giant
per-request context built from the old app's **Observation / Atlas Record
read-model**: demographics, archetypes, constellation scores, "observed
patterns." It had no consent gate before chat (only a footer disclaimer).

**None of that architecture may be brought over.** This app has no Atlas
Records, no archetypes, no constellation, no demographics — and that stays
true even when Sikiza arrives. What the companion may read here is only what
the user has explicitly chosen to share: her name, her cycle profile, and her
own diary entries — each surface gated behind an explicit consent choice.

*(If the old code must ever be inspected for reference: persona boundaries in
`Womb Atlas\src\lib\chat\system-prompt.ts`, context assembly in
`src\lib\chat\context.ts` — reference-only, same rule as the rest of the old
repo: no code copying.)*

## The vendor's plan at a glance (for our team's awareness)

**Gating decisions (proposed dates; a missing decision blocks its cases):**

| Decision | Needed by | Blocks |
|---|---|---|
| DEC-008: allow model-based conversational extraction | Nov 29 | Free conversation + extraction (SK-04, SK-06, SK-11) |
| Separate approval to train/fine-tune a model | Dec 6 | All fine-tuning (until then: prompting + retrieval only) |
| Coverage matrix by locale, modality, life stage | Nov 29 | Language coverage (SK-17) + benchmark corpus |
| REQ-029: inherited MVP defect classification | Nov 29 | Fix scope and any additional fee |
| Approved storage, contribution, sharing choices (+ policy versions) | Dec 6 | Consent & save (SK-07, SK-08) |
| Benchmark sample sizes, thresholds, signed (Womb Atlas + Edwin) | Dec 13 | Every benchmarked case (SK-19) |

**Milestones:** M1 Baseline (Nov 29) · M2 Conversation (Dec 20 — text +
approved voice in staging, correction, consent, one atomic save) ·
M3 Observatory (Jan 10 — evidence-linked outputs, history readback,
migration dry run) · M4 Integration (Jan 31 — route equivalence, directory
invocation, failure recovery, handover) · Release review (Feb 6).

**Vendor stack (proposed — self-confessed replaceable):** self-hosted 7–9B
instruct model (Llama 3.1 8B / Qwen 2.5 7B / Mistral 7B) via Ollama in
staging; faster-whisper STT + open TTS; Python/FastAPI/Pydantic contracts;
Postgres + Alembic; deterministic versioned rule files (no model call decides
an assignment); output validation ahead of display; acceptance via a workbook
(precision/recall, p50/p95 latency, cost per session); OpenTelemetry with
redaction at source.

## Boundaries that bind the Sikiza workstream in THIS repo

1. **One identity: Sikiza.** No "Aminata" strings, avatars, configs, or
   campaign copy anywhere — not as deprecation shims, not in comments. The
   rename is a replacement, not an alias. *(No residue.)*
2. **Isolated module.** The companion lives in its own service/folder contract
   (Ramtech owns it) and never modifies participant-app surfaces (the 3
   screens, onboarding, the 4-table schema) beyond an agreed entry point.
   A partner endpoint must not reshape our tables.
3. **Data surface = ours, consented.** Its evidence context is limited to our
   existing 4 tables (name, profile, entries) — no new tables for v1 of the
   companion beyond its own conversation store, agreed in the M1 contracts
   (SK-08). Sharing/diary access rides on the consent decision (Dec 6
   threshold). The "tomorrow's behavior" test still governs any column.
4. **Not medical.** Ambient disclaimer in every surface the companion renders,
   same stance as v1: "observational and educational — not a diagnosis or
   medical advice." Redirect clinical questions to healthcare providers.
5. **No observatory terms** (Atlas Records, steward, analyst, archetype,
   constellation, review queues) may appear in this repo, including in Sikiza
   UI copy served from here. Where the vendor plan's SK-14/15 workstream
   presumes the observatory, Ramtech scopes it to the simple app in M1 — or
   those cases are declared out of scope with the client (Julie).
6. **Voice waits for its milestone.** SK-16 voice is vendor scope, but no
   recording/TTS affordances appear in the participant app before M2 voice
   approval + the required device/mic consent UI exists.

## Conflict on the record: service stacks

The vendor proposes Python/FastAPI for the companion service; our API is Rust
(axum). This is acceptable **if and only if** the companion runs as a separate
service — its own process/container, its own storage namespace, talking to our
API (or DB schema space) through agreed contracts with its own auth layer.
The vendor's own stack table says conflicting rows "are replaced rather than
added" — this row is ours to reconcile in M1. What is NOT acceptable is a
Python service embedded in `backend/` (that folder is the Rust API) or any
migration of `backend/` off Rust.

## Our side of the deal (what this repo does for the workstream)

- Keep participant surfaces stable so the companion integrates against a
  predictable app (the API contract in `prompts/00-backend-architecture.md`).
- Attend the M1 contracts review (SK-08/SK-20 affect our schema namespace).
- Own the decisions on the gating list that are Womb Atlas's to make
  (with the user): DEC-008, training approval, coverage matrix, storage/
  sharing policy, benchmark sign-off.
- Deployment for staging builds follows `docs/DEPLOYMENT.md`.
