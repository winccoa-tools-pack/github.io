---
title: " [FEATURE] WinCC OA CTRL Debugger – VS Code Extension (Feature Proposal / High Level Plan)"
description: "Vision idea tracked as GitHub issue #22."
---

- Status: **open**
- GitHub issue: [winccoa-tools-pack/.github#22](https://github.com/winccoa-tools-pack/.github/issues/22)
- Last sync: 2026-05-04 05:41:58 UTC
- Labels:
- enhancement
- ctrl-lang
- vs-code-extension

---

1. Goal

Develop a VS Code extension that provides a full-featured debugger for WinCC OA CTRL scripts.  
The debugger will be based on the Debug Adapter Protocol (DAP) and communicate with a dedicated CTRL Debug Manager via REST + WebSocket.

The goal is to bring CTRL development up to modern standards:
- Breakpoints
- Step execution
- Variable inspection
- Call stack navigation
- Output console
- Future: panel event debugging, DP inspection, profiling

---

2. High-Level Architecture

```text
VS Code
  └─ VS Code Extension
       ├─ Debug Adapter (DAP, Node.js/TypeScript)
       └─ UI Integration (launch config, breakpoints, variables view)

Debug Adapter
  ├─ speaks DAP with VS Code
  └─ communicates with CTRL Debug Manager via REST + WebSocket

CTRL Debug Manager (custom WinCC OA ctrl manager)
  ├─ simple ctrl manager which will use the internal WinCC OA ctrl-debugger DP as API.
  ├─ executes CTRL code in a step-capable way
  ├─ manages breakpoints
  ├─ provides variable + call stack data
  ├─ exposes REST API for commands
  └─ pushes events (breakpoint hit, output, exceptions) via WebSocket

This will works also for older WinCC OA version
To make it much more easy, we can also use the integrated WinCC OA nodejs solution which can interact directly with the internal WinCC DPs. Maybe is the development faster, but it will works only with version 3.21 and higher (maybe 3.20)


---

3. Debug Adapter Protocol (DAP) – Required Messages

The Debug Adapter must implement at least:

Requests
- initialize
- launch
- setBreakpoints
- configurationDone
- threads (single-threaded is fine)
- stackTrace
- scopes
- variables
- continue
- next (stepOver)
- stepIn
- stepOut
- disconnect

Events
- initialized
- stopped (breakpoint, step, pause)
- output
- terminated

---

4. CTRL Debug Manager – REST + WebSocket API

4.1 REST API (Commands)

Base URL: http://<host>:<port>/debug

POST /start
Start a debug session.

Input:
`json
{ "script": "myScript.ctl", "entryPoint": "main" }
```

Output:
```json
{ "sessionId": "abc123" }
```

POST /breakpoints
Set breakpoints for a script.

Input:
```json
{
  "sessionId": "abc123",
  "script": "myScript.ctl",
  "breakpoints": [12, 25, 40]
}
```

Output:
```json
{
  "verified": [12, 25],
  "unverified": [40]
}
```

POST /step
Execute a step.

Input:
```json
{
  "sessionId": "abc123",
  "action": "stepOver"
}
```

Output:
```json
{
  "line": 26,
  "script": "myScript.ctl",
  "threadId": 1
}
```

GET /variables
Output:
```json
{
  "locals": { "x": 42, "flag": true },
  "globals": { "gCounter": 12 }
}
```

GET /callstack
Output:
```json
{
  "stack": [
    { "frameId": 1, "function": "clicked", "script": "panel.ctl", "line": 26 },
    { "frameId": 2, "function": "helperFunc", "script": "lib.ctl", "line": 12 }
  ]
}
```

POST /stop
Stop the session.

---

4.2 WebSocket API (Events)

Endpoint: ws://&lt;host&gt;:&lt;port&gt;/debug/ws

Events sent from CTRL Manager → Debug Adapter:

Breakpoint hit
```json
{
  "event": "breakpointHit",
  "sessionId": "abc123",
  "script": "myScript.ctl",
  "line": 42,
  "threadId": 1
}
```

Output
```json
{
  "event": "output",
  "sessionId": "abc123",
  "category": "stdout",
  "message": "Debug: x = 42"
}
```

Exception
```json
{
  "event": "exception",
  "sessionId": "abc123",
  "message": "Division by zero",
  "script": "myScript.ctl",
  "line": 33
}
```

Terminated
```json
{
  "event": "terminated",
  "sessionId": "abc123"
}
```

---

5. CTRL Debug Manager – Internal Requirements

The manager must:

- Execute CTRL code line-by-line or statement-by-statement
- Track the current execution line
- Maintain a breakpoint table per script
- Pause execution when a breakpoint is hit
- Extract:
  - local variables
  - global variables
  - DP values (optional)
- Build and maintain a call stack
- Support stepping:
  - stepOver
  - stepInto
  - stepOut
  - continue
  - pause

---

6. VS Code Extension – Integration Details

6.1 package.json contributions

Debugger
```json
"contributes": {
  "debuggers": [
    {
      "type": "ctrl",
      "label": "WinCC OA CTRL Debugger",
      "program": "./out/debugAdapter.js",
      "languages": ["ctrl"]
    }
  ]
}
```

Language (optional)
```json
"contributes": {
  "languages": [
    {
      "id": "ctrl",
      "extensions": [".ctl"],
      "aliases": ["CTRL"]
    }
  ]
}
```

Breakpoints
```json
"contributes": {
  "breakpoints": [
    { "language": "ctrl" }
  ]
}
```

6.2 Launch configuration example

```json
{
  "type": "ctrl",
  "request": "launch",
  "name": "Debug CTRL Script",
  "script": "${file}",
  "project": "/path/to/project",
  "debugServerHost": "localhost",
  "debugServerPort": 12345
}
```

---

7. To Do List (for GitHub Issue)

7.1 VS Code Debug Adapter
- [ ] Create VS Code extension scaffold
- [ ] Implement Debug Adapter skeleton
- [ ] Implement initialize
- [ ] Implement launch
- [ ] Implement setBreakpoints
- [ ] Implement configurationDone
- [ ] Implement threads
- [ ] Implement stackTrace
- [ ] Implement scopes
- [ ] Implement variables
- [ ] Implement stepping (continue, next, stepIn, stepOut)
- [ ] Implement disconnect
- [ ] Add WebSocket client for CTRL Manager events
- [ ] Map WebSocket events → DAP events (stopped, output, terminated)

7.2 CTRL Debug Manager
- [ ] Create new WinCC OA manager project
- [ ] Implement REST server
- [ ] Implement WebSocket server
- [ ] Implement step-capable CTRL execution loop
- [ ] Implement breakpoint handling
- [ ] Implement variable extraction
- [ ] Implement call stack tracking
- [ ] Implement exception handling
- [ ] Implement logging/output forwarding

7.3 Developer Experience
- [ ] Basic CTRL syntax highlighting (optional)
- [ ] Snippets for CTRL
- [ ] Documentation
- [ ] Example project + demo scripts
- [ ] Screenshots / GIFs for debugging workflow

---

8. Future Enhancements
- Conditional breakpoints
- Logpoints
- Live DP value inspection
- Panel event debugging (e.g., clicked: handlers)
- Multi-manager debugging
- Integration with Panel Explorer
- Performance profiling (ccn, nloc, execution time)

---

9. Short Description for GitHub Issue

> Feature Idea:  
> A VS Code extension that provides a full debugging experience for WinCC OA CTRL scripts using the Debug Adapter Protocol (DAP).  
> A dedicated CTRL Debug Manager exposes a REST + WebSocket API to control execution, manage breakpoints, and deliver runtime data (variables, call stack, output).  
> This would modernize CTRL development and bring it to the level of contemporary languages like TypeScript or Python.

