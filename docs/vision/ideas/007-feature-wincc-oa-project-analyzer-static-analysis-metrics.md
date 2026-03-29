---
title: "[FEATURE] WinCC OA Project Analyzer (Static Analysis + Metrics)"
description: "Vision idea tracked as GitHub issue #7."
---

- Status: **open**
- GitHub issue: [winccoa-tools-pack/.github#7](https://github.com/winccoa-tools-pack/.github/issues/7)
- Last sync: 2026-03-29 04:43:19 UTC
- Labels:
- enhancement
- CI
- ctrl-lang
- oa-lint
- QG
- vs-code-extension
- oa-pnl
- gh-oa-actions
- oa-test

---


**Description:**  
Create a CLI tool that scans WinCC OA projects and identifies structural issues and complexity metrics.

**Features:**  
- Detect unused panels, scripts, and data points  
- Identify cyclic dependencies  
- Naming convention violations  
- Complexity metrics for CTRL code  
- Duplicate code detection  

**Acceptance Criteria:**  
- CLI runs on any OA project folder  
- Outputs a detailed report in JSON and HTML  
- Supports at least 5 checks (unused files, naming, complexity, duplicates, dependencies)  
- Includes CI integration example  
- sonar-qube supported output
- output must contains fix-proposals
- the AI agents shall understand the output to support faster development (vs-code)

try to use the existing ctrlppcheck QGs
