---
title: "[FEATURE] WinCC OA unit tests in vs-code"
description: "Vision idea tracked as GitHub issue #15."
---

- Status: **open**
- GitHub issue: [winccoa-tools-pack/.github#15](https://github.com/winccoa-tools-pack/.github/issues/15)
- Last sync: 2026-04-16 05:10:41 UTC
- Labels:
- CI
- containers
- QG
- vs-code-extension
- oa-test

---


**Description:**  
Provide simple way to exectue WinCC OA unit tests direct from vs-code.

**Features:**  
- Execute selected test script
- Executres test scripts recursive in a directory
- Find the correct WinCC OA project from file name (or let the user to select one if current registered)
- Coverage reports (maybe as an extra request - it can be used also in #3 )
- Performance report (maybe as an extra request - it can be used also in #3 )

Optional
- Mocking for `dpGet`/`dpSet`  (maybe as an extra request - it can be used also in #3 )
- Fake timers (maybe as an extra request - it can be used also in #3 )
- Runs tests without OA runtime  (in locale docker image) (maybe as an extra request - it can be used also in #3 )

**Acceptance Criteria:**  
- Outputs coverage in HTML (or check for similar solutions in other testing tools - jaccoco, cobertura)
- Outputs perf data in HTML  (the WinCC OA provide an heatmap. maybe we can use this solution)
- Includes CLI usage example - keep in mind, we can use this also in github pipeline
- Outputs test results

- Provides mocking utilities  

