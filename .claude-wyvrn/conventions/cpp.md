# Conventions: cpp

**Stack:** cpp
**Applies to extensions:** .cpp, .cc, .cxx, .h, .hpp, .hxx

## Naming

- Types, classes, structs, enums: `PascalCase`.
- Functions, methods, variables: `camelCase`.
- Constants and enum members: `kPascalCase` (e.g., `kMaxBufferSize`).
- Macros: `SCREAMING_SNAKE_CASE`. Reserve macros for header guards and platform gates only.
- Member variables: trailing underscore (`buffer_`, `count_`). No `m_` prefix.
- Files: `snake_case.cpp` / `snake_case.h`. One primary class per pair, file name matches class name.

## Formatting

- C++20 baseline. Concepts, ranges, `std::span`, `std::format`, three-way comparison, modules, and `std::jthread` are baseline — do not gate behind project opt-ins.
- `clang-format` with the project's `.clang-format` file is authoritative. If absent, Google style with 4-space indent and 100-column lines.
- East const (`int const x`) or west const (`const int x`) — match the file. Do not mix within a translation unit.
- Braces on the same line for functions and control flow (Stroustrup is acceptable when matching existing file).
- Pointer/reference sigil binds to the type: `int* p`, not `int *p`. Match the file if it uses the other style.

## File organization

- Header (`.h`/`.hpp`) declares; implementation (`.cpp`) defines. Inline definitions in headers only for templates and trivial accessors.
- Header guards use `#pragma once`. Include-guard macros (`PROJECT_MODULE_FILE_H_`) only when the toolchain does not support `#pragma once`.
- Include order: corresponding header first, blank line, C system headers, blank line, C++ standard headers, blank line, third-party, blank line, project headers. Each group alphabetized.
- One class per header unless classes are tightly coupled (PIMPL, friend pairs).
- Forward-declare in headers when the full definition is not needed; include in the `.cpp`.

## Imports and dependencies

- Use angle brackets for system and third-party (`<vector>`, `<boost/optional.hpp>`); quotes for project headers (`"foo/bar.h"`).
- New third-party libraries require a decision record per `CONVENTIONS.md` §2.3 and an entry in the build system (CMake `find_package`, vcpkg manifest, or equivalent).
- No `using namespace std;` at file or header scope. Inside function bodies only when scoped narrowly.
- Prefer standard library over hand-rolled. Prefer Boost over hand-rolled when Boost is already a dependency.

## Error handling

- Exceptions for exceptional conditions. Return values (`std::optional`, `std::expected`, error codes) for expected failures.
- Do not throw across DLL/SO boundaries unless the build configuration explicitly supports it.
- Resource ownership via RAII. Raw `new`/`delete` is prohibited outside placement-new and intrusive containers. Use `std::unique_ptr` and `std::shared_ptr`.
- `noexcept` on move constructors, move assignment, destructors, and swap functions.
- `assert()` for invariant checks in debug builds. For release-time invariants, use a custom `CHECK` macro that aborts with diagnostics.

## Testing

**Test framework:** GoogleTest (gtest) with GoogleMock. Catch2 v3 acceptable when already in use.
**Test file pattern:** `[component]_test.cpp` co-located with the source under `tests/` mirroring the source tree.
**Test runner command:** `ctest --output-on-failure` from the build directory, or `ninja test` / `make test`.

- One `TEST(SuiteName, CaseName)` per behavior. Use `TEST_F` fixtures for shared setup.
- Death tests for `CHECK` and `assert` paths via `EXPECT_DEATH`.
- Mocks via `gmock`. Do not hand-roll mock classes when a `MOCK_METHOD` will do.
- Sanitizers (ASan, UBSan, TSan) run in CI on test builds. Tests must pass under all enabled sanitizers.

## Stack-specific prohibitions

- No `std::endl` in hot paths; use `'\n'`.
- No C-style casts. Use `static_cast`, `const_cast`, `reinterpret_cast`, `dynamic_cast`.
- No `std::shared_ptr` when `std::unique_ptr` suffices.
- No bare `catch (...)` without rethrow.
- No naked threads. Use `std::jthread`, `std::async`, or the project's task system.
