# Conventions: typescript

**Stack:** typescript
**Applies to extensions:** .ts, .tsx, .mts, .cts

## Naming

- All naming rules from `javascript.md` apply.
- Types, interfaces, type aliases, enums: `PascalCase`. No `I` prefix on interfaces (`User`, not `IUser`).
- Generic type parameters: single capital letter for trivial cases (`T`, `K`, `V`); `PascalCase` with descriptive name otherwise (`TItem`, `TResponse`).
- Type-only imports: `import type { Foo } from '...'`.
- Discriminated union tags: lowercase string literals (`type: 'success' | 'error'`).

## Formatting

- All formatting rules from `javascript.md` apply.
- Prettier handles `.ts` and `.tsx`.
- ESLint with `@typescript-eslint` plugin. The project's rule set is authoritative.
- Trailing commas in multi-line type literals and parameter lists.
- Explicit return types on exported functions; inferred return types on internal functions.

## File organization

- All file organization rules from `javascript.md` apply.
- Type definitions co-located with the code they describe. Shared cross-module types in `types/` or `[domain]/types.ts`.
- Ambient declarations (`*.d.ts`) for third-party packages without types or for global augmentation. Do not write `.d.ts` for project code.
- Barrel files (`index.ts`) re-export types and values; no logic.

## Imports and dependencies

- All import rules from `javascript.md` apply.
- `tsconfig.json` `strict: true` is mandatory. `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes` cannot be disabled per-file.
- Path aliases (`@/foo`) defined in `tsconfig.json` and `vite`/`webpack`/`tsx` config. Do not introduce ad-hoc path mappings.
- `@types/*` packages live in `devDependencies`.

## Error handling

- All error handling rules from `javascript.md` apply.
- `unknown` for caught errors, narrow before use: `catch (err) { if (err instanceof MyError) { ... } }`.
- Discriminated unions for expected-failure return types: `type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }`. Use only when the project already uses this pattern.
- Type guards via `is` predicates: `function isUser(x: unknown): x is User`.
- Do not use non-null assertions (`!`) to bypass strict null checks unless the assertion is provably safe and commented.

## Testing

**Test framework:** Vitest for Vite projects, Jest with `ts-jest` or `@swc/jest` otherwise.
**Test file pattern:** `[name].test.ts` or `[name].test.tsx`, co-located or under `__tests__/`.
**Test runner command:** `npm test`.

- All testing rules from `javascript.md` apply.
- Type tests via `expectTypeOf` (Vitest) or `tsd` for type-level assertions when the project tests types.
- Test files include the same `tsconfig` strictness as production code. No relaxed settings for tests.
- Mock factories return correctly-typed objects. No `as unknown as T` to satisfy the type checker.

## Stack-specific prohibitions

- No `any`. Use `unknown` and narrow.
- No `// @ts-ignore`. Use `// @ts-expect-error` with a comment explaining why; the directive is then mandatory to remove when the error is fixed.
- No `Function` type. Use a specific signature.
- No `Object` or `{}` as a type. Use `Record<string, unknown>` or a specific shape.
- No `as` casts that widen types unsafely. Use type guards.
- No enums when a union of string literals will do.
