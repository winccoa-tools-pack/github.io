---
title: "epic: AI Skills Cook Book"
description: "Vision idea tracked as GitHub issue #57."
---

- Status: **open**
- GitHub issue: [winccoa-tools-pack/.github#57](https://github.com/winccoa-tools-pack/.github/issues/57)
- Last sync: 2026-04-30 05:37:03 UTC
- Labels:
- enhancement

---

﻿## Overview

Systematic rollout of APM-based AI skills across the organization so every developer and every AI tool (GitHub Copilot, Claude, Cursor) shares the same knowledge base automatically.

## Infrastructure (already done checheck)

- apm-org - org-wide skills package
- apm-vscode-extension - VS Code extension specific skills
- apm-npm-package - npm package specific skills
- action-publish-skills-docs - reusable action: SKILL.md -> Docusaurus
- Skills live at https://winccoa-tools-pack.github.io (AI Skills section)

## Sub-issues

- [ ] winccoa-tools-pack/apm-org#2 - Auto-update APM lockfiles (Dependabot-style)
- [ ] winccoa-tools-pack/apm-vscode-extension#2 - Publishing skill for apm-vscode-extension
- [ ] winccoa-tools-pack/apm-vscode-extension#3 - dev-setup skill for apm-vscode-extension? (check title)
- [ ] winccoa-tools-pack/apm-vscode-extension#4 - Testing skill for apm-vscode-extension
- [ ] winccoa-tools-pack/apm-npm-package#2 - dev-setup skill for apm-npm-package
- [ ] winccoa-tools-pack/apm-npm-package#3 - Publishing skill for apm-npm-package
- [ ] winccoa-tools-pack/apm-npm-package#4 - exports/CJS+ESM+types skill for apm-npm-package
- [ ] winccoa-tools-pack/apm-vscode-extension#5 - CI publish workflow for apm-vscode-extension
- [ ] winccoa-tools-pack/apm-npm-package#5 - CI publish workflow for apm-npm-package
- [ ] winccoa-tools-pack/apm-org#3 - Bind APM to production repositories

## Done when

All production repositories have apm.yml + up-to-date apm.lock.yaml, all domain skills are written and published to the docs site, and lockfile updates are automated.

