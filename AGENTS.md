# AGENTS.md — Smart Campus Room Availability Checker

## 1. Project mission and boundaries

Build and maintain a responsive Smart Campus room availability checker using **fictional, local data**. Users can examine room details and check whether a proposed time interval is available. The application **checks availability only**: it must not create, confirm, cancel, or persist reservations.

Out of scope unless the user explicitly changes the requirements:
- Backend services, servers, external APIs, databases, authentication, and login.
- Payments, notifications, and real reservation workflows.
- External deployments of any kind: do not deploy, publish, or push the app to any hosting service. Local development and preview only.
- Secrets: never hardcode API keys, tokens, passwords, or credentials in source, and never commit `.env`, key files, or credential stores.
- Adding new frameworks, packages, architectural layers, or unrelated features.

Work within the existing language, framework, directory structure, and naming conventions. Inspect the repository before assuming file names, functions, scripts, or UI components exist.

## 2. Non-negotiable acceptance criteria (AC1–AC5)

Apply these requirements to the availability check. Time values are **integer minutes after midnight on the same day**; `1440` means midnight at the end of the selected day.

- **AC1 — Valid time and future start:** `0 <= start < end <= 1440`; current time must be in `0 <= current < 1440`; `start > current`. Reject malformed or non-integer inputs rather than silently coercing them. An end time of exactly `1440` is valid.
- **AC2 — Maximum duration:** `end - start <= 120` minutes. Exactly 120 minutes is valid; zero and negative durations are invalid under AC1.
- **AC3 — Blocked room:** A blocked room is always unavailable.
- **AC4 — No overlap:** Reject a proposed interval `[start, end)` if it overlaps any existing interval `[bookingStart, bookingEnd)`. Touching endpoints are allowed: `end === bookingStart` or `start === bookingEnd` does **not** count as overlap. The logical condition is `start < bookingEnd && bookingStart < end`.
- **AC5 — Result contract:** Return `true` only when AC1–AC4 all pass; otherwise return `false`. Availability checks are read-only. Do **not** mutate the supplied booking array or its entries, room data, input values, or any other existing state.

Treat these as invariants for every change, including UI changes and refactoring. Maintain existing externally visible function signatures unless an explicit user request requires a change. Preserve any stricter, already-approved validation rules that do not contradict AC1–AC5.

## 3. Existing features and scope control

- Inspect the actual implementation and tests before making changes.
- Keep existing room details, availability checks, and room filtering behavior working. If capacity/equipment filtering exists, preserve its current acceptance criteria and semantics.
- Do not change booking data while computing availability or filtering rooms.
- Do not introduce booking submission, writes, or persistence under the guise of availability checking.
- Implement only the requested feature or fix; avoid unrelated cleanup, sweeping renames, and broad refactors.
- Prefer minimal, reviewable diffs over replacement of whole modules.
- If requirements appear contradictory, identify the conflict and choose the smallest interpretation consistent with AC1–AC5; do not silently weaken them.

## 4. Engineering rules

- Prefer **pure functions** for validation, time logic, availability, and filtering: same inputs, same outputs, no side effects.
- Keep domain logic independent of rendering and framework-specific UI concerns where practical.
- Prefer straightforward functions, early returns, and clear names instead of unnecessary abstractions.
- Introduce at most **two design patterns**, and only when their benefits justify the complexity. Existing language constructs and ordinary functions do not require design-pattern labels.
- Do not mutate inputs: avoid in-place `sort`, `splice`, `push`, `clear`, or equivalent operations on caller-owned arrays/objects. Make copies only when necessary.
- Avoid duplicated logic. Reuse existing tested functions where appropriate.
- Keep error handling predictable; invalid user input should not crash the UI.
- Follow existing formatting, module, type, and accessibility conventions.

## 5. Responsive UI and feedback

- Preserve usable behavior on mobile, tablet, and desktop viewports.
- Show clear, immediate feedback for available, unavailable, and invalid input states. Distinguish validation errors from a valid request for an unavailable room when the UI supports this distinction; the underlying availability function still returns only a Boolean.
- Prevent stale results when the user changes room, time, blocked status, or filters.
- Use accessible labels, keyboard-friendly controls, and text in addition to color for status information.
- Keep the interface aligned with the current design; do not redesign unrelated screens.
- If the UI uses fixed whole-hour time choices, convert them consistently to the domain's minutes-after-midnight values. Support `1440` as an end-of-day boundary without treating it as the next day's reservable start time.

## 6. Dependencies and package installation

- Read the root `package.json` and existing scripts before installing anything.
- Add **only** dependencies required by the requested change. Prefer already installed libraries and standard platform APIs.
- Use `npm install` to install required dependencies; do not silently switch package managers.
- Before adding or relying on a third-party package, verify its exact published package name using the `name` field in that **package's own** `package.json` (e.g. the installed package under `node_modules/<package>/package.json`). **Do not use the top-level project's `package.json` `name` field** for this check. For scoped packages, verify the complete scoped name.
- Keep dependency changes and lockfile changes consistent. Do not add a package merely for a trivial function.
- Do not change unrelated scripts, versions, or configuration.
- Never commit or install anything containing secrets. If a change appears to require a key or token, stop and report it instead of adding one.

## 7. Vitest testing policy (mandatory)

- Use **Vitest** for unit and regression tests. Respect the project's existing test structure and conventions.
- Always run the existing test suite using exactly `npm test` as the normal verification command.
- If the tests cannot start because dependencies are missing or not installed, run `npm install` **once**, then retry `npm test` **one additional time**. Do not loop installation retries.
- If tests execute and reveal failures caused by the change, fix the code and rerun `npm test` until the suite is green. Do not weaken or delete a legitimate test to force a pass.
- **Every changed piece of logic must have focused tests**, even if tests were not explicitly requested. Add regression tests for each fixed defect.
- Keep tests deterministic and independent of network, system clock, external services, and test execution order. Inject or mock the current time as needed.
- Do not claim that tests passed unless the command actually ran and its result was observed.
- If tests cannot run after the single install-and-retry sequence, report the exact blocker and command output; do not invent a green result.

### Required availability regression cases

Ensure existing coverage is preserved and add missing focused tests where relevant:

1. Valid future interval, with no overlaps, returns `true`.
2. Overlapping existing booking returns `false`.
3. Blocked room returns `false` even if the interval would otherwise be valid.
4. Duration exactly 120 minutes returns `true` when otherwise valid.
5. Duration 121 minutes returns `false`.
6. `start === current` returns `false`.
7. `end === 1440` is valid if all other criteria pass.
8. `end === existingStart` and `start === existingEnd` are both allowed.
9. A one-minute true overlap returns `false`.
10. Invalid bounds, zero/negative duration, and malformed time values return `false`.
11. Existing bookings and other caller-owned inputs remain unchanged after both successful and rejected checks.
12. If room filters are modified, test capacity boundary, equipment-all-required semantics, and exact equipment-name matching.

For a function with signature `can_book(current, start, end, is_blocked, existing)`, representative cases include:

```js
expect(can_book(540, 660, 720, false, [[600, 660]])).toBe(true);
expect(can_book(540, 630, 690, false, [[600, 660]])).toBe(false);
expect(can_book(540, 660, 720, true, [[600, 660]])).toBe(false);
expect(can_book(540, 720, 840, false, [[600, 660]])).toBe(true);
expect(can_book(540, 720, 841, false, [[600, 660]])).toBe(false);
expect(can_book(540, 540, 570, false, [[600, 660]])).toBe(false);
```

These examples apply only if the project uses that function/signature; adapt to the real code without silently changing its public API.

## 8. Mandatory workflow for every task

1. **Inspect:** Read relevant code, `AGENTS.md`, package scripts, and existing Vitest tests. Identify impacted ACs and existing behavior.
2. **Baseline:** Run `npm test` before modification when feasible. Record any pre-existing failures separately.
3. **Plan:** Choose the smallest implementation change. Note whether an additional pattern or dependency is genuinely necessary.
4. **Implement:** Change only relevant files. Preserve data immutability, feature behavior, responsive UI, and AC1–AC5.
5. **Test:** Add focused tests for changed logic and regression tests for fixes. Run `npm test` according to Section 7.
6. **Review:** Check edge cases, caller-owned input immutability, UI feedback, responsive behavior, and whether the diff includes unnecessary changes.
7. **Report:** Provide a concise change summary with file paths, rationale, and observed test evidence.

## 9. Required final report format

At the end of a coding task, report:

- **Changed files:** Exact file paths, including added/modified test files.
- **Changes and rationale:** What changed, why it was necessary, and which acceptance criteria it protects.
- **Design/dependencies:** Any new pattern or package and why it is justified; otherwise state none added.
- **Test evidence:** Commands executed, pass/fail counts if available, and which new regression cases were verified. Clearly distinguish baseline failures from newly introduced failures.
- **Outstanding issues:** Any unverified UI behavior, blocked test execution, or remaining known limitation. State none only if confirmed.

Never report success based on assumptions. The final summary must reflect actual file changes and executed commands.
