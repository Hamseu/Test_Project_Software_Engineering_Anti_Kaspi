# AGENTS.md — Web-Shop API

## 1. Project mission and boundaries

Build and maintain a responsive online shop app using **real world data data**. Users can examine products, its details, categories and follow link to see it on kaspi, also they can add likes to products. Application uses angular(frontend) and django frameworks(backend).

Out of scope unless the user explicitly changes the requirements:
- authentication, and login.
- Payments, notifications, and real reservation workflows.
- External deployments of any kind: do not deploy, publish, or push the app to any hosting service. Local development and preview only.
- Secrets: never hardcode API keys, tokens, passwords, or credentials in source, and never commit `.env`, key files, or credential stores.
- Adding new frameworks, packages, architectural layers, or unrelated features, unless asked for permission.

Work within the existing language, framework, directory structure, and naming conventions. Inspect the repository before assuming file names, functions, scripts, or UI components exist.

## 2. Existing features and scope control

- Inspect the actual implementation and tests before making changes.
- Keep existing product details, links, and db access.
- Implement only the requested feature or fix; avoid unrelated cleanup, sweeping renames, and broad refactors.
- Prefer minimal, reviewable diffs over replacement of whole modules.
- If requirements appear contradictory, identify the conflict and choose the smallest interpretation consistent.

## 3. Engineering rules

- Prefer **pure functions** for validation, time logic, availability, and filtering: same inputs, same outputs, no side effects.
- Keep domain logic independent of rendering and framework-specific UI concerns where practical.
- Prefer straightforward functions, early returns, and clear names instead of unnecessary abstractions.
- Introduce at most **two design patterns**, and only when their benefits justify the complexity. Existing language constructs and ordinary functions do not require design-pattern labels.
- Do not mutate inputs: avoid in-place `sort`, `splice`, `push`, `clear`, or equivalent operations on caller-owned arrays/objects. Make copies only when necessary.
- Avoid duplicated logic. Reuse existing tested functions where appropriate.
- Keep error handling predictable; invalid user input should not crash the UI.
- Follow existing formatting, module, type, and accessibility conventions.

## 4. Responsive UI and feedback

- Preserve usable behavior on mobile, tablet, and desktop viewports.
- Show clear, immediate feedback for available, unavailable, and invalid input states.
- Use accessible labels, keyboard-friendly controls, and text in addition to color for status information.
- Keep the interface aligned with the current design; do not redesign unrelated screens.

## 5. Dependencies and package installation

- Read the root `package.json` and existing scripts before installing anything.
- Add **only** dependencies required by the requested change. Prefer already installed libraries and standard platform APIs.
- Use `npm install` to install required dependencies; do not silently switch package managers.
- Before adding or relying on a third-party package, verify its exact published package name using the `name` field in that **package's own** `package.json` (e.g. the installed package under `node_modules/<package>/package.json`). **Do not use the top-level project's `package.json` `name` field** for this check. For scoped packages, verify the complete scoped name.
- Keep dependency changes and lockfile changes consistent. Do not add a package merely for a trivial function.
- Do not change unrelated scripts, versions, or configuration.
- Never commit or install anything containing secrets. If a change appears to require a key or token, stop and report it instead of adding one.


## 6. Vitest testing policy (mandatory)
* Use Vitest for unit and regression tests. Respect the project's existing test structure and conventions.
* Always run the existing test suite using exactly npm test as the normal verification command.
* If the tests cannot start because dependencies are missing or not installed, run npm install once, then retry npm test one * * additional time. Do not loop installation retries.
* If tests execute and reveal failures caused by the change, fix the code and rerun npm test until the suite is green. Do not weaken * or delete a legitimate test to force a pass.
* Every changed piece of logic must have focused tests, even if tests were not explicitly requested. Add regression tests for each fixed defect.
* Keep tests deterministic and independent of network, system clock, external services, and test execution order. Inject or mock the current time as needed.
* Do not claim that tests passed unless the command actually ran and its result was observed.
* If tests cannot run after the single install-and-retry sequence, report the exact blocker and command output; do not invent a  green result.
* 
## 7. Mandatory workflow for every task

1. **Inspect:** Read relevant code,`README.md`, `AGENTS.md`, package scripts, and existing Vitest tests. Identify existing behavior.
2. **Baseline:** Run tests if there are any. Record any pre-existing failures separately. If there are no tests, offer to create them 
3. **Plan:** Choose the smallest implementation change. Note whether an additional pattern or dependency is genuinely necessary.
4. **Implement:** Change only relevant files. Preserve data immutability, feature behavior, responsive UI.
5. **Test:** Add focused tests for changed logic and regression tests for fixes.
6. **Review:** Backend - frontend connection, UI feedback, responsive behavior, and whether the diff includes unnecessary changes.
7. **Report:** Provide a concise change summary with file paths, rationale, and observed test evidence.

## 8. Required final report format

At the end of a coding task, report:

- **Changed files:** Exact file paths, including added/modified test files.
- **Changes and rationale:** What changed, why it was necessary, and which acceptance criteria it protects.
- **Design/dependencies:** Any new pattern or package and why it is justified; otherwise state none added.
- **Test evidence:** Commands executed, pass/fail counts if available, and which new regression cases were verified. Clearly distinguish baseline failures from newly introduced failures.
- **Outstanding issues:** Any unverified UI behavior, blocked test execution, or remaining known limitation. State none only if confirmed.

Never report success based on assumptions. The final summary must reflect actual file changes and executed commands.
