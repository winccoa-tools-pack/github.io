---
title: "This proposal outlines a new open‑source initiative to create a fully automated, event‑driven testing and documentation ecosystem for WinCC OA."
description: "Vision idea tracked as GitHub issue #40."
---

- Status: **open**
- GitHub issue: [winccoa-tools-pack/.github#40](https://github.com/winccoa-tools-pack/.github/issues/40)
- Last sync: 2026-04-17 04:54:44 UTC

---

### Idea title

This proposal outlines a new open‑source initiative to create a fully automated, event‑driven testing and documentation ecosystem for WinCC OA.  

### Describe your idea

## The core idea:  
Record real user interactions + internal system events → generate Mermaid/DOT graphs → generate test scripts → replay → diff → document → integrate with AI agents.

This creates a complete feedback loop for engineering, QA, and documentation — without external dependencies and without writing test code manually.

---

## Motivation
WinCC OA projects often suffer from:

- undocumented user flows  
- hidden config dependencies  
- unclear DP interactions  
- scripts that are hard to test  
- missing or outdated test documentation  
- no automated regression testing  
- no visibility into what the system actually does internally  

Existing tools do not provide a unified way to observe, document, test, and analyze WinCC OA behavior.

This project aims to change that.

---

## Core Concept
The system captures all relevant runtime events directly inside WinCC OA:

- user actions (clicks, popups, inputs)  
- script execution paths (via code coverage)  
- DP operations (dpGet, dpSet, dpQuery)  
- config access (paCfgGetValue, paCfgSetValue)  
- database interactions  
- stack traces for every event  

These events form a complete, chronological trace of what happened — both on the UI level and inside the technical logic.

From this trace, the system automatically generates:

- Mermaid diagrams (Flowchart, Sequence, State)  
- DOT graphs (technical call graphs, coverage graphs)  
- test scripts (code‑less engineering)  
- documentation artifacts (PDF/Markdown exports)  
- diff reports (real run vs. replayed test)  

This creates a single source of truth for testing, documentation, and analysis.

---

## Key Features

1. Full User‑Event Tracking
Every user action is recorded in real order:

- button clicks  
- popup openings  
- confirmations  
- text inputs  
- navigation events  

This enables automatic generation of user‑flow diagrams and test scripts.

---

2. System‑Event Tracking
Hooked macros capture:

- paCfgGetValue / paCfgSetValue  
- dpGet / dpSet / dpQuery  
- SQL queries  
- script calls  
- DP value changes  
- stack traces  

This reveals hidden dependencies and internal logic flows.

---

3. Code Coverage → DOT Graphs
Ctrl code coverage is transformed into DOT graphs:

- executed lines  
- branches  
- call chains  
- script‑to‑script transitions  

DOT is ideal for large, technical graphs and deep analysis.

---

4. Mermaid Diagrams for Documentation & Testing
Mermaid is used for:

- user flows  
- sequence diagrams  
- state diagrams  

These diagrams are:

- human‑readable  
- machine‑interpretable  
- perfect for test documentation  
- easy to embed in GitHub, Confluence, TestRail, etc.

---

5. Automatic Test Script Generation
Mermaid diagrams become executable test scripts:

- no coding required  
- deterministic replay  
- stable regression tests  
- reproducible behavior  

This enables code‑less engineering.

---

6. Replay + Diff Engine
The system can replay the recorded test and compare:

- expected vs. actual events  
- DP values  
- config accesses  
- script paths  
- UI behavior  

Differences are visualized in a simple, understandable way.

---

7. AI‑Agent Integration
Because all artifacts are structured (Mermaid, DOT, JSON), AI agents can:

- understand what is being tested  
- propose missing test cases  
- detect risky areas  
- analyze dependencies  
- generate documentation  
- optimize test coverage  

This turns the system into an intelligent engineering assistant.

---

## Why This Matters
This project introduces capabilities that WinCC OA currently lacks:

- automated documentation  
- automated test generation  
- automated dependency discovery  
- automated regression testing  
- full observability of UI + logic  
- AI‑assisted engineering  

It reduces manual effort, increases reliability, and makes complex systems transparent.
