---
title: "Panel to Web Component Generator"
description: "Vision idea tracked as GitHub issue #17."
---

- Status: **open**
- GitHub issue: [winccoa-tools-pack/.github#17](https://github.com/winccoa-tools-pack/.github/issues/17)
- Last sync: 2026-03-16 13:23:04 UTC
- Labels:
- enhancement
- ctrl-lang
- vs-code-extension
- oa-pnl
- good for oa nodejs

---


**Description:**  
Create a generator that converts OA panels into modern web components.

**Features:**  
- Supports Lit, Svelte, React  
- Maps DP bindings to props  
- Preserves event logic  
- Generates reusable components  

**Acceptance Criteria:**  
- Converts at least one panel type  
- Outputs working web component  
- Includes usage guide  
- Supports customization  

PNL -> XML -> JSON 
  -> HTML
  -> JS (typescript)
  -> CSS

It might be done with the oficial node delivered by WinCC OA to reduce the ctrl2-to-typecript conversion, because the oa-node can call ctrl code as well. That  measn it shall be possible to start the 'old' ctrl code as well.
This will be tricky, in case the ctrl-code calls methdos with shapes (which in most cases do)
I whish you many luck. it is comple project, but it will be helpfull for big WinCC OA community to use the modern tolls instead the very old (but sitll good and vyer stable) pnl format.
