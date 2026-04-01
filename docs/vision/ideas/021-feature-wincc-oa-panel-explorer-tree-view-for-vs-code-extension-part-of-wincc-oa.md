---
title: "[FEATURE] WinCC OA Panel Explorer – Tree View for VS Code Extension (part of WinCC OA project explorer)"
description: "Vision idea tracked as GitHub issue #21."
---

- Status: **open**
- GitHub issue: [winccoa-tools-pack/.github#21](https://github.com/winccoa-tools-pack/.github/issues/21)
- Last sync: 2026-04-01 04:52:53 UTC
- Labels:
- ctrl-lang
- vs-code-extension
- oa-pnl

---

# WinCC OA UI Panel Viewer (Research Proposal)


## Problem

- The WinCC OA `.pnl` format is not readable for humans and hard to process for tools.
- We can convert `.pnl ⇄ .xml` and use XML as a readable representation.
  - Existing converter reference:
    - https://github.com/winccoa-tools-pack/npm-winccoa-ui-pnl-xml?tab=readme-ov-file#-usage-api
- There is **no official panel XML schema**.

## Goal

Create a VS Code “Panel Viewer” that displays panel content in a readable, structured form.

Primary use cases:
- Inspect structure (shapes, properties, scripts/events, references)
- Show raw property values (e.g., colors)
- Preview the panel by launching WinCC OA UI with a `-p` panel path

## Non-goals (v1)

- No full editor / authoring workflow
- No promise of lossless XML↔PNL round-trip for arbitrary changes
- No decryption or display of encrypted/protected panel contents

## Minimal stable viewer model (v1)

The viewer should be tolerant (no strict schema dependency in v1) and show:

- Panel
  - properties (raw key/value)
  - shapes (tree)
    - per-shape properties
    - per-shape scripts (event-based)
    - nested shapes
  - panel references

## Conversion strategy

### Where generated XML should live

Two modes are needed:

1. **Viewer mode (default):**
   - Convert `.pnl → .xml` into a **temporary location**.
   - Load into viewer.
   - Remove the temp XML after load.
   - Goal: eliminate two sources inside the project tree (`.pnl` and `.xml`).

2. **Command mode (explicit user action):**
   - VS Code commands:
     - `pnl → xml` (single file)
     - `xml → pnl` (single file)
     - directory conversion (recursive)
   - Output goes next to the input file (same location) with `.xml` / `.pnl` extension.

### Panels without extension

If a panel file has no extension:
- Ask user what to do:
  - treat as `.pnl` and convert to `.xml`
  - skip
  - apply choice once / apply for all (this run)

### Change tracking

- When `.pnl` changes → re-convert and reload.
- When `.xml` changes → compare against `.pnl` conversion output (do not blindly overwrite `.pnl`).
- Ignore `.bak` files.

## Encrypted panels

Encrypted panels can be detected reliably:

- First line starts with: `PVSS_CRYPTED_PANEL`

Viewer behavior:
- Show “Encrypted panel; content not viewable” and stop parsing.

## Preview behavior (WinCC OA UI)

Preview should start WinCC OA UI with:

- `-p panels/relative/path/to/panel.pnl`

and use the active project context.

References (conceptual):
- UI component runner:
  - https://github.com/winccoa-tools-pack/npm-winccoa-core/blob/develop/src/types/components/implementations/UIComponent.ts
- Project context tooling:
  - https://github.com/winccoa-tools-pack/vscode-winccoa-project-admin

## Script viewing (CTL)

- Extract event scripts and display them as CTL.
- Provide CTL syntax highlighting in VS Code (read-only in v1).

## UX (minimal)

- Tree view of panel structure.
- Every tree level uses an icon (similar semantics as file explorer):
  - panel root, shapes, properties, scripts/events, references
- Details view shows:
  - property name + raw value
  - script contents

## Performance note

Provide a hint on first use/activation:
- Working with `.xml` directly (when available) is typically faster than converting from `.pnl` repeatedly.

## Validator (future)

The XML schema + validator idea is tracked separately (not part of the first delivery).


## Panel references (representation idea)

Represent references explicitly in the tree as nodes with clear type:
- Link/reference (points to another panel path)
- Embedded instance (panel used as a component, if distinguishable in XML)

At minimum, show:
- referenced panel path/name
- where the reference occurs (shape id/name)

## Placement in the ecosystem

The Panel Viewer should be a module under a broader “WinCC OA Project Viewer”, but reusable standalone.

Potential modules:
- config file viewer
- `progs/` viewer (raw + admin console/PMON)
- log viewer (existing extension; integrate/align)
- dp list viewer (`.dpl` raw + model preview + diff vs DB)
- DB view (browse DB content)


