---
title: "Create an npm-based validator that checks WinCC OA panel files (`.pnl` or `.xml`) against a selected XML schema."
description: "Vision idea tracked as GitHub issue #42."
---

- Status: **open**
- GitHub issue: [winccoa-tools-pack/.github#42](https://github.com/winccoa-tools-pack/.github/issues/42)
- Last sync: 2026-04-16 05:10:41 UTC

---

### Idea title

Create an npm-based validator that checks WinCC OA panel files (`.pnl` or `.xml`) against a selected XML schema.

### Describe your idea


# WinCC OA XML Validator (Research Proposal)

This document describes a separate feature idea that should be tracked as its own issue (not part of the first delivery of the Panel Viewer).

## Summary

Create an npm-based validator that checks WinCC OA panel files (`.pnl` or `.xml`) against a selected XML schema.

Key idea:
- A strict, version-aware validator enables “quality gates” with low effort (translations, allowed colors, required metadata, etc.).

## Scope

### Supported WinCC OA versions

Schemas will be self-maintained only for:
- WinCC OA 3.20
- WinCC OA 3.21

Older versions are out of scope due to effort.

### Inputs

The validator should accept:
- `.xml` file(s) directly
- `.pnl` file(s) by converting to XML first (conversion step is an implementation detail)

Notes:
- `.bak` files should be ignored by default.

### Output

The validator should produce:
- Human-readable CLI output (errors/warnings with file + location when possible)
- Machine-readable output for CI (e.g., JSON)

## Schema strategy

There is no official panel XML schema, so we will maintain schemas ourselves.

### Schema-per-version

We likely need a schema per WinCC OA version (at least 3.20 and 3.21). Differences should not be hidden; they should be explicit in the schema packages.

### User-provided schemas (derived/overrides)

The validator should support loading schema definitions from:
- Installed npm package(s)
- A local filesystem path (so users can check out the schema version they need)

This enables teams to maintain their own “derived” rules without forking the validator.

## Proposed repository / package split

Suggested structure (separate repositories/projects):

- `npm-winccoa-ui-xml-validator`
	- CLI and API for validation.
	- Chooses schema based on WinCC OA version or explicit schema path.

- `npm-winccoa-ui-xml-schema` (internal “main”, not necessarily public)
	- Staging area to prepare the next schema releases.

- `npm-winccoa-ui-xml-schema-3.20`
	- Published schema for WinCC OA 3.20.

- `npm-winccoa-ui-xml-schema-3.21`
	- Published schema for WinCC OA 3.21.

## CLI UX (draft)

Minimal commands:

- `validate &lt;file-or-dir&gt;`
	- Accepts a file or directory (recursive option).
	- Supports `.xml` and `.pnl`.

Flags (draft):
- `--winccoa-version 3.20|3.21`
- `--schema &lt;npm-package|path&gt;`
- `--recursive`
- `--format text|json`
- `--fail-on warning|error`

## Example validations (high value)

Examples of checks that teams typically want:
- Translation completeness: required languages exist for all strings.
- Style rules: allowed colors only, forbidden fonts, minimum contrast, etc.
- Required metadata: mandatory attributes present.
- Forbidden content: detect banned scripts/events, banned shapes.
- Consistency rules: naming conventions for shapes, unique IDs, etc.

## Integration with Panel Viewer (later)

The Panel Viewer can integrate this validator in a later milestone:
- Run validation on the loaded panel XML snapshot.
- Surface violations in the tree/details UI.

## References (research only)

- Existing panel conversion tool:
	- https://github.com/winccoa-tools-pack/npm-winccoa-ui-pnl-xml?tab=readme-ov-file#-usage-api
- Existing handling patterns (do not copy code; use for understanding only):
	- https://github.com/siemens/CtrlppCheck/tree/main/WinCCOA_QualityChecks/scripts/libs/classes/QualityGates/QgStaticCheck/Panels/PanelFile


