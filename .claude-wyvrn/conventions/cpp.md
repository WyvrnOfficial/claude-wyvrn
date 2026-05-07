# Conventions: cpp

**Stack:** cpp
**Applies to extensions:** .cpp, .cc, .cxx, .h, .hpp, .hxx

## Naming

- Types, classes, structs: `PascalCase`.
- Enum types: `PascalCase` with a leading `E` (`EApplicationState`, `EThreadPriority`, `EWorldLeafType`).
- Functions, methods: `PascalCase` (`DrawCanvas`, `InitDevice`, `GetDeviceCount`).
- Function parameters: `PascalCase` (`Init(int Index, uint32_t SizeInBytes)`).
- Local variables: `PascalCase` for new code. When extending an existing file with a different style, match the file.
- Public class/struct data members: `PascalCase` (`RetryPolicy.InitialDelayMs`).
- Non-public (private/protected) members: `m_PascalCase` (`m_Buffer`, `m_Count`).
- Globals: `g_PascalCase`. File-scope statics: `s_PascalCase`.
- Constants: `PascalCase` (`MaxBufferSize`). Prefer `constexpr` over `#define` for compile-time constants.
- Enum members:
  - **Plain `enum`** — members are `<Prefix>_<Value>` because they leak into the surrounding scope and need disambiguation. The prefix is a short identifier derived from the enum type name: usually the capital letters (`EApplicationState` → `AS_Idle`, `AS_Progress`; `EWorldLeafType` → `WLT_Geometry`, `WLT_Light`) or a short abbreviation when initials would be ambiguous (`EThreadPriority` → `TPri_Highest`, `TPri_Normal`). The chosen prefix applies to every member of that type — no mixing.
  - **`enum class`** — members are plain `PascalCase` (`EApplicationState::Idle`, `EWorldLeafType::Geometry`). The type already scopes them; adding a prefix would be redundant.
- Macros: `SCREAMING_SNAKE_CASE`. Reserve macros for header guards, platform gates, and compiler-feature detection (`__has_include`, `__cpp_lib_*`) only.
- Files: `PascalCase.cpp` / `PascalCase.h`. One primary class per pair, file name matches class name (`GroupInstance.cpp` declares `class GroupInstance`).
- Template parameters: `PascalCase` (`typename Range`, `typename Allocator`). Concept names are `PascalCase` and read as adjectives or noun phrases (`Sortable`, `RandomAccessIterator`).

## Formatting

- C++20 baseline. Concepts, ranges and views, `std::span`, `std::string_view`, `std::format`, three-way comparison, `std::jthread`, `std::latch`, `std::barrier`, `std::counting_semaphore`, `constinit`, `consteval` are baseline.
- C++23 features (`std::expected`, `std::print` / `std::println`, `std::flat_map`, `std::mdspan`, `std::generator`, `if consteval`, deducing `this`, `[[assume]]`, modules) are aspirational — adopt them only after the project's build flips to `/std:c++23`.
- `clang-format` with the project's `.clang-format` file is authoritative when present. If absent, the rules in this doc are authoritative — do not fall back to Google style.
- Allman braces: opening brace on its own line for functions, classes, structs, enums, namespaces, and control flow.
- 4-space indent. No hard column limit.
- West const (`const int x`) for new code. Existing files may use east const; do not mix within a translation unit.
- Pointer/reference sigil binds to the type: `int* p`, not `int *p`. Match the file if it uses the other style.
- Brace-initialize (`T x{...}`) by default to prevent narrowing. Use `=` only for primitives where narrowing is intended and obvious.
- Almost-always-`auto` for local variables when the type is obvious from the right-hand side or irrelevant to the reader. Spell the type out when the contract matters (return types of public APIs, function parameters, members).

## File organization

- Header (`.h`/`.hpp`) declares; implementation (`.cpp`) defines. Inline definitions in headers only for templates and trivial accessors.
- Header guards use `#pragma once`. Include-guard macros (`PROJECT_MODULE_FILE_H_`) only when the toolchain does not support `#pragma once`.
- Include order: corresponding header first, blank line, C system headers, blank line, C++ standard headers, blank line, third-party, blank line, project headers. Each group alphabetized.
- One class per header unless classes are tightly coupled (PIMPL, friend pairs).
- Forward-declare in headers when the full definition is not needed; include in the `.cpp`.
- C++20 modules are aspirational — do not mass-convert headers. Until the build adopts modules end-to-end, new code stays as `#include`-based headers.

## Imports and dependencies

- Use angle brackets for system and third-party (`<vector>`, `<boost/optional.hpp>`); quotes for project headers (`"foo/Bar.h"`).
- New third-party libraries require a decision record per `CONVENTIONS.md` §2.3 and an entry in the build system (CMake `find_package`, vcpkg manifest, wyvrnpm, or equivalent).
- No `using namespace` directives in headers (`.h` / `.hpp` / `.hxx`) — at any scope, for any namespace. Headers must not pollute the namespace of every translation unit that includes them.
- `using namespace` is acceptable in `.cpp` files only. Prefer function-body scope; file-scope `using namespace` is allowed but should be narrow (e.g., `using namespace std::chrono_literals;`) and is discouraged for `std`.
- The `using std::swap; swap(a, b);` two-step is a `using`-declaration (one symbol), not a `using`-directive — it is the documented customization-point idiom and is allowed anywhere, including headers.
- Prefer standard library over hand-rolled. Prefer Boost over hand-rolled when Boost is already a dependency.

## Resource management and ownership

- **Rule of Zero.** Default. Compose existing RAII types (smart pointers, containers, file/socket wrappers) and let the compiler generate special members. Author Rule-of-Five types only when wrapping a raw resource — and then `=delete` or `=default` every special member explicitly.
- **No raw `new` / `delete`.** Allocate through `std::make_unique`, `std::make_shared`, containers, or allocator-aware factories. Placement-new is permitted only inside allocator-aware code and intrusive containers.
- **Ownership in signatures is contractual:**
  - `std::unique_ptr<T>` by value — sink (callee takes ownership).
  - `std::shared_ptr<T>` by value — sink that shares ownership. Never `shared_ptr<T>&` or `const shared_ptr<T>&` unless you genuinely need to rebind or inspect the control block.
  - `T&` / `const T&` — non-owning, non-null borrow.
  - `T*` — non-owning, nullable borrow. Prefer references when null is not a valid state.
  - `std::string_view` for read-only string parameters; `std::span<T>` / `std::span<const T>` for contiguous-range parameters. Never store either as a member unless lifetime is guaranteed by construction.
- `std::weak_ptr` to break ownership cycles and for observer/cache references that must not extend lifetime.
- `std::enable_shared_from_this` when an instance must hand out `shared_ptr`s to itself (typically for async callbacks that outlive the immediate caller).
- `shared_ptr` is only thread-safe at the control-block level. Concurrent mutation of the pointee still needs synchronization.
- Move-only types are the default for unique resources. Make types non-copyable by holding a `unique_ptr` member rather than `=delete`-ing copy operations by hand.
- Subsystem-specific intrusive ref-counting types (e.g., a project's own `Ref<T>` / `WeakRef<T>`) are documented in that subsystem's `.claude-wyvrn-local/conventions/cpp.md`, not here.

## Const, constexpr, and compile-time

- Prefer `constexpr` over `const` for compile-time constants. Prefer `constexpr` variables and functions over macros.
- `consteval` for functions that must run at compile time (e.g., format-string validation, ID hashing).
- `constinit` on non-trivial namespace-scope objects to guarantee constant initialization and avoid static-init-order issues.
- `const`-qualify member functions that don't mutate observable state. Mark data members `mutable` only for caches and synchronization primitives.
- `[[nodiscard]]` on every function returning `std::optional`, `std::expected`, error codes, RAII handles, or any value whose silent discard is a likely bug. Apply to types as well (`[[nodiscard]] class ScopeGuard { ... };`).
- `static_assert` for compile-time invariants. `[[assume(expr)]]` is C++23 — aspirational until the build flips.

## Types and idioms

- **Sized integer types only.** Use `int8_t` / `int16_t` / `int32_t` / `int64_t` (or project typedefs like `int16` / `int32` / `int64` when the project defines them) instead of bare `int`, `short`, `long`, `long long`. Same for unsigned (`uint32_t` over `unsigned int`). Width is part of the contract — spell it. `size_t` and `ptrdiff_t` remain preferred for sizes and pointer differences. Loop counters and integer literals where the platform-defined width is genuinely irrelevant are the only exception, and only when the value can't escape into serialization, ABI, or storage.
- `enum` and `enum class` are both allowed. Prefer `enum class` for new types when scoped values are wanted; plain `enum` is acceptable when the surrounding module's pattern uses it. Type names always start with `E`. Member naming differs by form — see *Naming* (plain `enum` carries a type-derived prefix to disambiguate at file scope; `enum class` members are plain `PascalCase` since the type already scopes them).
- Strong typedefs (named-type wrappers) for primitive IDs and units when mixing them is a likely bug — don't pass three `int`s when you mean `UserId`, `OrderId`, `Quantity`.
- Concepts replace SFINAE for new generic code. Constrain template parameters with `requires` clauses or concept-named parameters (`template <std::ranges::input_range R>`).
- Range-based `for` and `<ranges>` over hand-written index loops. Pipelines (`Vec | std::views::filter(...) | std::views::transform(...)`) when they read more clearly than the loop they replace — not for their own sake.
- Lambdas over named functor types for local callbacks. Capture by reference only when the lambda cannot outlive the captured object; capture by value (or `[Ptr = std::move(Ptr)]`) otherwise. No default captures (`[=]`, `[&]`) — list them.
- `std::format` for formatted output. `std::println` is C++23 and aspirational; `fmt::print` is acceptable when `{fmt}` is already a project dependency. No `printf`-family in new code. No `iostream` chaining for non-trivial formatting.

## Error handling

- Match the surrounding module's error idiom. `std::expected<T, E>` (C++23) or a project-equivalent `Expected`-shaped type for expected failures with a value; `std::optional<T>` when the absence is itself the only failure mode; error codes only at C ABI boundaries. Subsystem-specific result types live in the subsystem's local override.
- Don't introduce a new error scheme without a decision record.
- Exceptions for genuinely exceptional conditions only.
- Do not throw across DLL/SO boundaries unless the build configuration explicitly supports it.
- `noexcept` on move constructors, move assignment, destructors, and swap functions. `noexcept` on any function that genuinely cannot throw — it enables optimizations and is part of the type's contract.
- `assert()` for invariant checks in debug builds. For release-time invariants, use the project's `CHECK` / `DCHECK` pair that aborts with diagnostics.
- No bare `catch (...)` without rethrow.

## Concurrency

- `std::jthread` for owned threads. It joins on destruction and carries a `std::stop_token` — use it instead of ad-hoc atomic-bool cancellation flags.
- `std::latch`, `std::barrier`, `std::counting_semaphore` for coordination. Reach for these before hand-rolling condition-variable dances.
- `std::async` is permitted only with an explicit launch policy (`std::launch::async`). The defaulted policy is a foot-gun (may run deferred on the calling thread) — do not rely on it.
- Shared mutable state needs `std::mutex` / `std::shared_mutex` / `std::atomic`. `shared_ptr` does not make the pointee thread-safe (see *Resource management*).
- No naked `std::thread`. Use `std::jthread`, `std::async` with explicit policy, or the project's task system.
- Subsystem-specific runtime threading models (e.g., a Main + Render thread + double-buffered lambda queue) are documented in that subsystem's local override and `docs/Architecture.md`.

## Testing

**Test framework:** GoogleTest (gtest) with GoogleMock for new tests. Catch2 v3 acceptable when already in use.
**Test file pattern:** `[Component]Tests.cpp` co-located with the source under `tests/` mirroring the source tree (PascalCase to match the rest of the codebase).
**Test runner command:** `ctest --output-on-failure --parallel` from the build directory; `ctest --rerun-failed --output-on-failure` to iterate on failures.

- One `TEST(SuiteName, CaseName)` per behavior. Use `TEST_F` fixtures for shared setup.
- Death tests for `CHECK` and `assert` paths via `EXPECT_DEATH`.
- Mocks via `gmock`. Do not hand-roll mock classes when a `MOCK_METHOD` will do.
- Sanitizers (ASan, UBSan, TSan) run in CI on test builds. Tests must pass under all enabled sanitizers.
- Pre-existing bare-`int main()` + `assert()` tests stay until the file is touched; do not bulk-migrate. New tests use GoogleTest.

## Wyvrn-wide rules

- **Project namespace.** All project-owned types live somewhere inside `namespace Wyvrn`. Direct members are fine (`Wyvrn::SomeClass`), and subsystem nesting is fine (`Wyvrn::Chroma::DeviceManager`, `Wyvrn::Renderer::Mesh`). What is not allowed is a subsystem namespace at global scope as a sibling of `Wyvrn` — no `::Chroma::Foo` or `::Renderer::Bar`. Everything goes under `Wyvrn` first.
- **Thread-safety annotation.** Every public class and function carries one of `Thread-safe`, `Thread-compatible`, or `Thread-confined` in its doc comment immediately above the declaration.
- **OS types stay behind a HAL boundary (forward-looking).** New cross-subsystem headers should not expose raw `DWORD`, `HANDLE`, `HRESULT`, `SOCKET`, etc. Hide them behind the subsystem's HAL/platform module (e.g., Chroma's `WyvrnPlatform`) — a `using FileHandle = HANDLE;` typedef inside `Wyvrn::Platform` is enough; a full RAII wrapper isn't required. Pre-existing exposures are grandfathered: they stay until the file is touched for an unrelated reason or a dedicated refactor, and they are not bulk-rewritten. Subsystems that don't yet have a HAL module are exempt until one is added — adding the HAL is a decision record per `CONVENTIONS.md` §2.3, not a blocker on day-to-day work.

## Stack-specific prohibitions

- No `std::endl` in hot paths; use `'\n'`.
- No C-style casts. Use `static_cast`, `const_cast`, `reinterpret_cast`, `dynamic_cast`.
- No raw `new` / `delete` outside placement-new in allocator-aware code.
- No `std::shared_ptr` when `std::unique_ptr` suffices.
- No `shared_ptr<T>&` or `const shared_ptr<T>&` parameters unless rebinding or inspecting the control block.
- No bare `catch (...)` without rethrow.
- No naked threads. Use `std::jthread`, `std::async` with explicit launch policy, or the project's task system.
- No default-capture lambdas (`[=]`, `[&]`) — capture lists must be explicit.
- No `printf`-family or unstructured `iostream` chains for new formatted output — use `std::format` / `fmt::print`.
- No `using namespace` directives in headers (`.h` / `.hpp` / `.hxx`) — at any scope, for any namespace. `.cpp` files only.
- No bare `int`, `short`, `long`, `long long`, or their unsigned counterparts in declarations. Use sized types (`int32_t` / `uint64_t` / project `int32` / `uint64`).
