---
title: "[FEATURE] CI WinCC OA TestFramework Integration in vs-code"
description: "Vision idea tracked as GitHub issue #3."
---

- Status: **open**
- GitHub issue: [winccoa-tools-pack/.github#3](https://github.com/winccoa-tools-pack/.github/issues/3)
- Last sync: 2026-03-18 04:30:27 UTC
- Labels:
- enhancement
- CI
- containers
- QG
- vs-code-extension
- gh-oa-actions
- oa-test

---

﻿## Description

Integrate with WinCC OA TestFramework to provide comprehensive testing capabilities within VS Code.

## Features

### Test Management
- **Test Discovery**: Automatically find TestFramework tests
- **Test Organization**: Group tests by suite/category
- **Test Creation**: Wizard for creating new tests

### Test Execution
- **Run Tests**: Execute TestFramework tests from VS Code
- **Test Configuration**: Configure test parameters
- **Parallel Execution**: Run multiple tests concurrently
- **Selective Execution**: Run single test, suite, or all tests

### Results & Reporting
- **Live Results**: Real-time test results as tests run
- **Result Details**: Detailed failure information
- **Test History**: Track test results over time
- **Export Results**: Save results in various formats
-  **Performance report**
- **Ctrl Code coverage** report

Validate testRuns.config config
Validate testSuite.config file
Validate etstProj.config file
Execute testRun direct from testRuns.config file (RMC on testRun ID)


### Integration Points
- Test Explorer view
- Code lens for tests
- Debug test execution
- CI/CD integration (gihub action, jenkins shared lib)
- OCI image. Provide ready to use base OCI image with WinCC OA testframework 3.19, 3.20, 3.21 with mouted WinCC_OA_Test derectory. The user helper tools, projects ... must be installed in the finale image.

## Technical Requirements

- Communication with TestFramework
- Parse TestFramework results
- Handle TestFramework configuration
- Support for TestFramework versions

## Benefits

- Professional testing workflow
- Better test visibility
- Faster test iterations

&lt;!-- sub-issues:start --&gt;
### Sub-issues

This issue tracks the following sub-issues from winccoa-tools-pack/vscode-winccoa-ctrl-test-framework:

- [ ] winccoa-tools-pack/vscode-winccoa-ctrl-test-framework#8 - [EPIC] CTRL TestFramework integration (VS Code + CI)
- [ ] winccoa-tools-pack/vscode-winccoa-ctrl-test-framework#9 - Spec: config files + execution model (testRuns/testSuite/testProj + run by ID)
- [ ] winccoa-tools-pack/vscode-winccoa-ctrl-test-framework#10 - Core runner: execute TestFramework + emit machine-readable results
- [ ] winccoa-tools-pack/vscode-winccoa-ctrl-test-framework#11 - Results: parse TestFramework output  VS Code test results + exports
- [ ] winccoa-tools-pack/vscode-winccoa-ctrl-test-framework#12 - VS Code: Test Explorer discovery + grouping (suite/category)
- [ ] winccoa-tools-pack/vscode-winccoa-ctrl-test-framework#13 - VS Code: run single/suite/all + live progress (+ parallelism)
- [ ] winccoa-tools-pack/vscode-winccoa-ctrl-test-framework#14 - CI: GitHub workflow/job to run TestFramework in OCI + upload artifacts
- [ ] winccoa-tools-pack/vscode-winccoa-ctrl-test-framework#15 - Containers: OCI base images plan (TF 3.19/3.20/3.21)
- [ ] winccoa-tools-pack/vscode-winccoa-ctrl-test-framework#16 - VS Code: CodeLens Run Test / Run Suite
- [ ] winccoa-tools-pack/vscode-winccoa-ctrl-test-framework#17 - Reporting: performance + CTRL code coverage (definition + artifacts)
- [ ] winccoa-tools-pack/vscode-winccoa-ctrl-test-framework#18 - Docs: usage (VS Code + CI), config examples, troubleshooting
&lt;!-- sub-issues:end --&gt;


