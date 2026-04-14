---
title: "WinCC OA Topology Explorer"
description: "Vision idea tracked as GitHub issue #38."
---

- Status: **open**
- GitHub issue: [winccoa-tools-pack/.github#38](https://github.com/winccoa-tools-pack/.github/issues/38)
- Last sync: 2026-04-14 04:50:50 UTC
- Labels:
- enhancement
- vs-code-extension
- good for oa nodejs
- oa-pa
- AI-topic
- api
- needs-triage

---

### Idea title

WinCC OA Topology Explorer

### Describe your idea

What problem does this extension solve?

Working with distributed WinCC OA systems is difficult without proper tooling.  
Developers and integrators currently lack a clear, visual, and read‑only way to explore:

- which distributed systems exist  
- how hosts, managers, and redundancy roles are connected  
- which managers are running, stopped, or in standby  
- how start options differ across hosts  
- where configuration drift or inconsistencies appear  

This information is scattered across config files, logs, and pmon outputs.  
There is no unified, developer‑friendly topology view for WinCC OA — neither in VS Code nor in the browser.

---

Proposed functionality

A read‑only VS Code extension that visualizes WinCC OA distributed systems using the existing MCP as the single source of truth.

The extension must retrieve all data exclusively through the MCP, ensuring:

- WinCC OA authentication  
- centralized access control  
- consistent data  
- future AI‑assistance capabilities  

Core UX features

1. Topology Tree View (Sidebar)
A clean, collapsible tree:

```
System1 (redundant)
  hostA — primary
    event 1 ● running
    data 1 ● running
    ctrl 5 ● stopped
  hostB — backup
    event 1 ● standby
```

- Color‑coded status indicators  
- Hover tooltips  
- Smooth navigation from system → host → manager  

2. Manager Inspector (Webview Panel)
A modern, readable detail view:

- Manager type + number  
- Host and redundancy role  
- Status with visual cues  
- Parsed start options  
- Port usage  
- Optional: recent log lines  

3. Health Overview
A compact dashboard showing:

- missing or duplicated managers  
- redundancy mismatches  
- inconsistent start options  
- unreachable hosts  
- config drift  

Each issue links directly to the affected element.

4. Commands
- OA: Refresh Topology  
- OA: Show Health Report  
- OA: Inspect Manager  
- OA: Export Topology JSON  

5. Web‑Panel (Browser Frontend)
In addition to the VS Code extension, the same MCP‑powered API should support a read‑only web dashboard, accessible via browser and authenticated through WinCC OA.

This allows operators, auditors, and remote teams to explore the topology without VS Code.

---

Additional notes

- All data must come from the existing MCP to enable AI‑assistance and ensure secure, centralized access.  
- No write operations: no config changes, no manager control, no DB modifications.  
- Designed to be lightweight, safe, and easy for contributors to extend.  
- Builds on the open‑source Node.js modules in the WinCC OA tools ecosystem.  
- High‑impact project that fills a long‑standing gap in the OA community.

