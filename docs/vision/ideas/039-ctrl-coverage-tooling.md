---
title: "CTRL Coverage Tooling"
description: "Vision idea tracked as GitHub issue #39."
---

- Status: **open**
- GitHub issue: [winccoa-tools-pack/.github#39](https://github.com/winccoa-tools-pack/.github/issues/39)
- Last sync: 2026-04-20 05:19:53 UTC

---

### Idea title

CTRL Coverage Tooling

### Describe your idea

# Vision: CTRL Coverage Tooling

## Problem Statement

WinCC OA CTRL TestFramework generates code coverage data when running tests with `CTRL_COVERAGE` enabled. However, there's no tooling to:
- Parse and aggregate coverage data
- Generate human-readable reports (HTML, JSON, LCOV)
- Integrate with CI/CD pipelines (GitHub Actions, GitLab CI)
- Visualize coverage in VS Code

## Proposed Solution

Create a new repository `npm-winccoa-ctrl-coverage` that provides:

### Core Library (npm package)
- Parse CTRL coverage output files
- Aggregate coverage across multiple test runs
- Calculate coverage percentages (statements, functions, lines)
- Export to standard formats (LCOV, Cobertura, JSON)

### CLI Tool
- `ctrl-coverage report` - Generate HTML/text reports
- `ctrl-coverage merge` - Combine multiple coverage files
- `ctrl-coverage check` - Fail CI if coverage below threshold

### VS Code Integration
- Coverage gutter indicators (green/red lines)
- Coverage summary in status bar
- Integration with `vscode-winccoa-ctrl-test-framework`

## Technical Considerations

1. **Coverage File Format**: Research WinCC OA CTRL coverage output format
2. **Language**: TypeScript (consistent with tools-pack ecosystem)
3. **VS Code API**: Use `vscode.TestCoverageController` for native integration
4. **CI Support**: GitHub Actions action for coverage reporting

## Related

- Enables `vscode-winccoa-ctrl-test-framework` issue #35 (CTRL_COVERAGE flag)
- Similar to istanbul/nyc for JavaScript coverage

## Labels

`enhancement`, `vision`, `P1`
