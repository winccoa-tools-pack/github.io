---
title: AI Skills
description: AI agent skills powering GitHub Copilot, Claude, and Cursor across all winccoa-tools-pack repositories.
sidebar_position: 1
---

# AI Skills

These are the AI agent skills deployed across the **winccoa-tools-pack** organization via [APM (Agent Package Manager)](https://microsoft.github.io/apm/).

After cloning any repository and running `apm install`, your AI tool (GitHub Copilot, Claude, Cursor) automatically receives these skills as context — no manual configuration needed.

## Sections

- **[Org-Wide Skills](org/)** — skills shared across all repositories (conventional commits, git flow, versioning, etc.)

## How it works

Each APM package repository contains `.apm/skills/` source files. When changes are pushed, a workflow automatically converts them to this documentation and publishes them here.

To use the skills locally:

```bash
apm install   # run once after cloning any repo
```

See [`winccoa-tools-pack/apm-org`](https://github.com/winccoa-tools-pack/apm-org) for full setup instructions.
