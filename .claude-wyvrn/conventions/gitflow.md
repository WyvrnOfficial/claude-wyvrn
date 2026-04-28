# Conventions: gitflow

Branching, commit, and merge protocol for repositories that follow this Wyvrn harness. Read on demand at the first Git operation of a flow. See `CONVENTIONS.md` §1.3.

## 1. Branching model

- `master` is the release branch. Production-ready code only. Direct commits prohibited.
- `develop` is the integration branch. All flow work targets `develop` via pull request.
- `master` advances only by merging `develop` (or a release branch cut from `develop`) when the human declares a release.

## 2. Branch types and naming

Branch names match the pattern `<type>/<DEVINITIALS>_<branchNameCamelCase>`.

| Type | Prefix | Used for |
|---|---|---|
| Feature | `feature/` | FEAT-NNNN flows |
| Fix | `fix/` | FIX-NNNN flows |
| Refactor | `refacto/` | REF-NNNN flows |
| Chore | `chore/` | Non-flow housekeeping (tooling, deps, docs, CI) |

`<DEVINITIALS>` is the developer's uppercase initials (2 or 3 characters).

`<branchNameCamelCase>` is a short, behavior-describing camelCase phrase. Lowercase first letter, no separators, no flow ID.

### 2.1 Flow-to-branch mapping

| Flow ID | Branch prefix |
|---|---|
| `FEAT-NNNN-[slug]` | `feature/` |
| `FIX-NNNN-[slug]` | `fix/` |
| `REF-NNNN-[slug]` | `refacto/` |
| (no flow ID) | `chore/` |

- Branch is created at the start of the implementation phase, not at flow start.
- Spec, clarification batch, and decision artifacts are written on `develop` before the implementation branch is cut, unless project policy says otherwise.

### 2.2 Examples

- `feature/TR_newConversionMethod`
- `fix/AL_keyframeArrayOverflow`
- `refacto/TR_extractPaymentService`
- `chore/TR_bumpEslintToV9`

### 2.3 Prohibited

- No spaces, slashes (beyond the type prefix), underscores other than the one separating initials and name, or special characters.
- No flow ID in the branch name.
- No long phrases. Aim under 50 characters total.
- No reuse of a merged branch name.

## 3. Commits

- Format: `<type>(<scope>): <subject>`.
- Type: one of `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `build`, `ci`.
- Subject: imperative mood, lowercase first letter, no trailing period, under 72 characters.
- Body: blank-line separated; wrap at 100 columns; explains *why*, not *what*.
- Footer: `Refs: FEAT-0123` or `Fixes: FIX-0045`. Mandatory on flow branches. Forbidden on chore branches.
- One logical change per commit.

### 3.1 Example

```
feat(auth): add SAML SSO provider

Implements the SAML 2.0 redirect binding. Configuration lives in
config/auth.yaml under the new providers.saml block.

Refs: FEAT-0123
```

## 4. Pull requests and merges

- Every branch except `develop` and `master` reaches `develop` via PR. No direct pushes to `develop` or `master`.
- PR title matches the branch name's intent. PR description references the spec artifact path.
- Squash-merge is the default. The squash commit follows §3.
- Rebase-merge only when the branch contains semantically meaningful intermediate commits the human wants preserved.
- `develop` → `master` merges happen at release time only, declared by the human. Use a merge commit (no squash) so release history is traceable.
- Delete the source branch after merge.

## 5. Tags and releases

- Releases are tagged on `master` after the `develop` → `master` merge.
- Tag format: `v<MAJOR>.<MINOR>.<PATCH>` per semver. Pre-releases: `v<MAJOR>.<MINOR>.<PATCH>-<label>.<n>`.
- Annotated tags only. Lightweight tags prohibited.

## 6. Prohibitions

- No force-push to `master`, `develop`, or any open PR branch with reviewers assigned.
- No rewriting commits that have been pushed and reviewed.
- No commits with secrets, credentials, large binaries (>10 MB), or generated artifacts.
- No merging a branch with failing CI without a decision record citing why.
