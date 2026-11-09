# WOMB ATLAS — PERMANENT AI CODING AGENT INSTRUCTIONS

These instructions apply to EVERY task and EVERY session in this project.

They take priority over the agent's assumptions, suggestions and preferred implementation approaches.

## 1. Follow the user's exact instructions

- Implement only what the user explicitly requests.
- Do not introduce additional features, functionality or design changes.
- Do not reinterpret requirements to suit your own preferences.
- Do not replace an existing implementation simply because you prefer another approach.
- Do not silently change previously agreed decisions.
- Do not remove functionality unless explicitly instructed.

## 2. Strict task boundaries

- Work only on the task currently assigned.
- Do not bundle unrelated improvements into the same task.
- Do not refactor unrelated components.
- Do not rename files, components, variables or routes unnecessarily.
- Do not change application architecture unless the task requires it.
- Do not modify backend code during frontend-only tasks.
- Do not modify frontend code during backend-only tasks unless explicitly requested.

If an additional change appears necessary, explain why and request approval before implementing it.

## 3. Preserve existing work

- Inspect relevant existing code before making changes.
- Preserve all existing user modifications.
- Never reset, revert, clean, stash or discard user work without explicit permission.
- Reuse existing components and functionality wherever possible.
- Avoid duplicate implementations.
- Make the smallest changes necessary to achieve the requested result.

## 4. Never invent requirements

- Do not invent data, features, user flows or business rules.
- Do not replace real functionality with mock implementations without permission.
- Do not assume that a feature is unnecessary because it is difficult to implement.
- If a requirement is unclear, ask one focused question rather than guessing.

## 5. Womb Atlas product decisions

Preserve these established decisions:

- Mobile-first application experience.
- One shared LandingScreen implementation.
- Landing content responds to the user's actual onboarding and cycle state.
- Privacy consent precedes app-lock setup.
- App-lock setup precedes personal onboarding.
- Skip all is available for personal onboarding, not privacy consent.
- Skipping personal onboarding must not falsely mark onboarding complete.
- Incomplete onboarding must be resumable.
- Returning users must not repeat onboarding unnecessarily.
- Mobile navigation should feel like a real application, not a website with page tabs.
- Desktop and mobile share application state and functionality.

Do not reverse or silently modify these decisions.

## 6. Development server restrictions

CRITICAL — NEVER VIOLATE THIS RULE.

- The development server MUST use port 3000.
- Never open another port.
- Never switch to 3001, 3002 or another port.
- Never start a second development server.
- Never kill or restart the existing server without permission.
- If port 3000 is unavailable, stop and report the problem.

The user accesses the development server from their phone.

## 7. Code quality

- Follow existing project conventions.
- Avoid unnecessary dependencies.
- Avoid unnecessary complexity.
- Keep components maintainable.
- Handle loading, empty, success and error states appropriately.
- Never expose secrets or sensitive user information.
- Do not introduce frontend debug noise into production.

## 8. Verification and honesty

- Test the actual functionality changed.
- Do not claim a feature works simply because lint or build passes.
- Do not claim tests were performed when they were not.
- Report known limitations honestly.
- Do not hide failures.

## 9. Completion reports

After every task, report:

1. What was requested.
2. What was actually implemented.
3. Exact files changed.
4. Tests and verification performed.
5. Any remaining limitations.

Do not include unrelated suggestions or claim additional work was completed.

## 10. Scope protection

The user's instructions define the product.

The agent is an implementer, not an independent product manager.

Do not add, remove, redesign, refactor or alter anything outside the explicitly approved task scope.

When in doubt, preserve existing behaviour and ask before making an unrequested change.