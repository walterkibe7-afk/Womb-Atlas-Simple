# Deployment — GitHub + Cloudflare, milestone-gated

**Standalone, not a fork/branch of X-Store.** Womb Atlas Simple gets its own
GitHub repo and its own Cloudflare Pages project. X-Store and its infrastructure
remain untouched. The ST project is referenced here only as the working
*pattern* (GitHub-triggered Cloudflare builds) — its code, repo, and config are
not reused in any way.

**Both apps under one Cloudflare account:** a single Cloudflare account hosts
unlimited Pages/Workers projects side by side, each with its own repo, build
settings, URL (`x-store.pages.dev`, `womb-atlas-simple.pages.dev`), and
independent deploys. So yes — X-Store and Womb Atlas can live in the same
Cloudflare account with zero interference.

The one deliberate difference from the ST flow: **pushes to `main` happen only
after a major milestone is verified working** — not continuously.

## The pattern (borrowed from ST)

| Concern | ST does | We do |
|---|---|---|
| Source control | git → GitHub `walterkibe7-afk/X-Store`, branch `main` | git (this repo, initialized 2026-11-08) → new GitHub repo under the same account, branch `main` |
| Hosting | Cloudflare Workers + static assets + D1 + KV, `wrangler` config | Cloudflare **Pages** for the Vite SPA (plain static build — simpler than ST; no workers needed for the UI) |
| Live updates | push → Cloudflare builds → live | same; push to `main` triggers a Pages production build |
| Client/team access | live URL + per-deploy preview URLs | same: production URL + automatic preview URLs per milestone push |

## The gate: when pushes happen

A push to `main` = a deploy the client can see. Therefore a push happens **only
when a named milestone is complete AND locally verified**:

| Milestone-level examples | Verification required before push |
|---|---|
| First-run onboarding journey complete | `npm run lint` + `npm run build` pass; full in-browser click-through done |
| Storage layer attached (agents B1–B4 reports in) | lint + build + `podman build ./backend`; end-to-end journey incl. entry round-trip to Postgres proven |
| Home/Log/History adaptation signed off | all of the above + desktop variants reviewed |
| Sikiza staging touchpoint (future) | vendor milestone evidence per `docs/SIKIZA-COMPANION.md` |

Between milestones, work accumulates as local commits — as many as wanted.
The push is the announcement.

## One-time setup (needs the user once)

```pwsh
# 1) GitHub (the gh CLI is installed but not yet logged in):
gh auth login
gh repo create womb-atlas-simple --private --source . --remote origin --push
#    (or create the repo on github.com and: git remote add origin <url>; git push -u origin main)

# 2) Cloudflare Pages (dashboard is easiest, mirrors ST's link-from-GitHub flow):
#    - dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git
#    - pick the womb-atlas-simple repo, production branch: main
#    - build command: npm run build   ·  output directory: dist
#    - leave Node version default (20+) — Vite 8 needs it
```

Cloudflare Pages then builds on every push to `main` and emits a preview URL
per push — the "show the client" mechanism. No `wrangler.toml` is needed for
the SPA phase; add one only if/when the staging Rust API needs Cloudflare
Tunnel exposure, at which point ST's `wrangler.toml` is the working reference.

## What does NOT deploy to Cloudflare

The Rust API (`backend/`, port 4001) and Postgres (podman, 5433) are local
dev infra. Until a shared staging server exists, Pages builds of the SPA will
have the UI live but the API unreachable — acceptable for design reviews;
the client sees real screens, data comes from a running local backend only
on the dev machine. A staging host for the API is a later decision (a small
VPS + podman, or Cloudflare Tunnel from the dev box during scheduled demos).

## Discipline checklist before any push

1. Working tree clean (or knowingly clean-ish); lint + build (+ backend
   `podman build ./backend`
   once backend exists) green locally.
2. The milestone can be *demonstrated*: click the journey end-to-end yourself.
3. Commit message names the milestone (e.g. `milestone: first-run journey end-to-end`).
4. Push, then confirm the Pages build went green and paste the preview URL to
   the client/team thread.
