# triviality-detector

Lightweight prompt-completeness and triviality check. Decides whether a flow can collapse to single-agent inline execution, skip the clarifier phase, or run the full standard flow.

## Trigger

Invoked at flow start by `flow-feature`, `flow-fix`, and `flow-refactor`, after Phase 1 (Read), before Phase 2 (Clarify). Not human-invocable.

## Description

Performs an in-context evaluation against the initial prompt and the project's `triviality` and `clarifier` settings in `PROJECT.md`. Returns one of three verdicts: `trivial`, `prompt_complete`, or `standard`. The orchestrator gates Phase 2 (Clarify) and Phase 4 (Verify) invocations on the verdict.

The check runs entirely in the orchestrator's context. It does **not** invoke a subagent. The flow skill applies the procedure in this file directly using the harness state already loaded in Phase 1.

## Inputs

- Flow type (`feature`, `fix`, or `refactor`).
- Initial prompt verbatim.
- Spec template (already loaded per `HARNESS.md` §3.1 step 6).
- The flow-specific delta file (`FEATURE.md`, `FIX.md`, or `REFACTOR.md`), specifically its prompt-gated fields list (already loaded).
- Project settings from `.claude-wyvrn-local/PROJECT.md` if present (already loaded per `HARNESS.md` §3.1 step 7).

## Behavior

### 1. Read project settings

From `PROJECT.md`:

- `triviality:` — value is `enabled` or `disabled`. Default `enabled` if `PROJECT.md` is absent or the field is absent.
- `clarifier:` — value is `auto` or `required`. Default `auto` if `PROJECT.md` is absent or the field is absent.

### 2. Evaluate prompt completeness (`prompt_complete`)

Set `prompt_complete = yes` only if both hold:

1. **All prompt-gated fields are present.** The flow-specific delta file lists them in its §2.1:
    - Feature: task title, intent.
    - Fix: task title, expected outcome, current outcome, reproduction steps or conditions.
    - Refactor: task title, target area, preservation statement.
    Missing any field → `no`.

2. **No UNDECIDED-class language.** The prompt names concrete identifiers — file paths, line numbers, symbol names, exact replacement values — instead of vague references. Examples:
    - Concrete (passes): "change line 42 of `src/auth.ts` to call `validateToken(req.headers.x)`", "rename `foo` to `bar` in `lib/utils.py`", "in `WidgetView.swift`, replace the `init(_:)` body with the version pasted below".
    - Ambiguous (fails): "fix the auth thing", "improve error handling", "make the parser better", "tidy up the helpers", "the date parsing is wrong somehow".

If `clarifier=required`, force `prompt_complete = no` regardless of the prompt content. The project has opted out of skip-clarifier behavior.

### 3. Evaluate trivial scope (`trivial_scope`)

Set `trivial_scope = yes` only if all five hold:

1. **Single file.** The prompt names exactly one source file (or one symbol within one file). Edits localized to that file only.
2. **Small change.** Estimated change size ≤ 20 lines. Heuristic: edits to a single function, a single block, or a single line. No new modules. No multi-region restructuring.
3. **No new public symbols.** The prompt does not introduce a new exported function, class, method, or top-level constant. Edits to existing public symbols are permitted; new private helpers within the same file are permitted.
4. **No test additions outside the touched file.** Adding a test that lives in or co-located with the touched file is fine. Anything that requires writing tests in a different file fails this gate.
5. **No `ARCHITECTURE.md` changes.** The change does not introduce a new module, alter a module boundary, or change a declared interface.

If `triviality=disabled`, force `trivial_scope = no`. The project has opted out of single-agent collapse.

### 4. Verdict

| `trivial_scope` | `prompt_complete` | Verdict |
|---|---|---|
| yes | yes | `trivial` |
| no | yes | `prompt_complete` |
| yes | no | `standard` |
| no | no | `standard` |

Verdict semantics per `HARNESS.md` §10.3:

- `trivial`: orchestrator runs Read + Work + self-check pass inline. Does not invoke `clarifier`, `verifier`, or `code-reviewer` subagents. Writes the spec, the verifier report, and any decision records itself. The template-verifier hook still fires on every artifact write per `HARNESS.md` §4.6.
- `prompt_complete`: orchestrator skips the `clarifier` subagent and writes the spec directly from the prompt. Phases 3 (Work), 4 (Verify), and 5 (Validate) run normally with subagent invocations.
- `standard`: full flow per `WORKFLOW.md`.

### 5. Bias on uncertainty

When borderline between concrete and ambiguous, or between trivial-scope and not, bias toward `standard`. The cost of an unnecessary clarifier round or subagent verifier pass is low. The cost of skipping clarification on a real ambiguity, or skipping subagent verification on a non-trivial change, is high.

### 6. Return

Return a structured verdict to the invoking flow skill:

- **Verdict:** `trivial | prompt_complete | standard`.
- **Reason:** one short sentence naming the gate that drove the decision. Examples:
    - "Prompt names `src/auth.ts:42` and a concrete replacement; single file, ≤20 lines."
    - "Prompt-complete but spec implies new public symbol `parseUrl`."
    - "Ambiguous: 'fix the date parsing' lacks a concrete identifier."
    - "`clarifier=required` set in `PROJECT.md`."

The flow skill records both in the spec artifact's Implementation notes section so a reader can audit which path the flow took.

## Outputs

- Return value: verdict and reason.
- Side effect: none. The skill does not write any artifact directly. The flow skill records the verdict in the spec artifact during Phase 2.

## Invokes

- None. Runs in the orchestrator's context.

## Constraints

- Do not invoke any subagent.
- Do not write any file.
- Honor `clarifier=required` and `triviality=disabled` overrides absolutely. They are project-level instructions and override prompt heuristics.
- Bias toward `standard` on borderline cases per §5.
