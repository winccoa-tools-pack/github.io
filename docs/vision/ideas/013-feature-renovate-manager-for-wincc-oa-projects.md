---
title: "[FEATURE] Renovate Manager for WinCC OA Projects"
description: "Vision idea tracked as GitHub issue #13."
---

- Status: **open**
- GitHub issue: [winccoa-tools-pack/.github#13](https://github.com/winccoa-tools-pack/.github/issues/13)
- Last sync: 2026-04-09 04:40:35 UTC
- Labels:
- enhancement
- CI
- DevOps
- gh-oa-actions

---

## Description:
Build a tool that automates dependency and version management for OA projects.

The WinCC OA missed any dependency managment tool. No body knows which sub-projects needs which dependencies / version of dependncies ... . It will be helpfull to have an dependancy autoamted management which will download and bind my dependencies.

## Key Features:

Versioning for panels, scripts, PARA files
Dependency management for OA packages
Automatic PRs for new OA versions
Validation of project structure

## Acceptance Criteria:

Detects outdated OA components
Creates PRs with version updates
Validates project structure against defined schema
Includes configuration options for CI/CD

> noe: try to ask WinCC OA community if there are similar solutions. I think, there was  a solution to download GH repositories as well. This idea shall be not oriented only on GH
