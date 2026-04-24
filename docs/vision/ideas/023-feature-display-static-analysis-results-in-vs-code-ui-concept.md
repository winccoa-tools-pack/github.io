---
title: "[FEATURE] Display Static Analysis Results in VS Code – UI Concept"
description: "Vision idea tracked as GitHub issue #23."
---

- Status: **open**
- GitHub issue: [winccoa-tools-pack/.github#23](https://github.com/winccoa-tools-pack/.github/issues/23)
- Last sync: 2026-04-24 05:14:43 UTC
- Labels:
- oa-lint
- QG
- vs-code-extension

---

Description:
We already have a static analysis tools for WinCC OA (CTRL, Panels, Pictures, Overloaded Files, etc ) the ctrlppcheck. Now, the goal is to design how these analysis results should be displayed inside VS Code for maximum usability. Below is a proven approach based on best practices from modern VS Code extensions like ESLint, SonarLint, GitLens, and Docker.

4 Best Ways to Show Static Analysis in VS Code

1. Tree View (Sidebar) – Ideal for Complex Structures
This is the most common and effective method for hierarchical data.
Perfect for:

Panel structure
CTRL structure
Overloaded file graph
DP bindings
Complexity hotspots
Grouped issues/warnings

Example:
WinCC OA Analyzer
 ├── CTRL
 │   ├── myScript.ctl
 │   │   ├── Issues (3)
 │   │   ├── Complexity: 12
 │   │   └── Functions
 │   │       ├── main() (ccn: 4)
 │   │       └── helper() (ccn: 2)
 ├── Panels
 │   ├── main.pnl
 │   │   ├── Objects (14)
 │   │   ├── Events (6)
 │   │   └── Issues (2)
 ├── Pictures
 └── Overloads

Advantages:

Clear and structured
Click → navigate to file/line
Supports icons, badges, tooltips
Perfect for your JSON analysis


2. Problems View (Diagnostics API) – Like ESLint
If your tool produces errors, warnings, or hints, integrate them into VS Code’s Problems View.
Example:
myScript.ctl:12 warning Unused variable 'x'
main.pnl:44 error Invalid DP reference 'System1:TempX'

Advantages:

Familiar to developers
Click → jump to line
Severity levels (error/warning/info)
Ideal for static analysis

How to implement:

Use vscode.DiagnosticCollection
Provide Range, Message, and Severity


3. Custom Webview Panel – For Visual Representation
Use a Webview for complex visualizations like:

Panel AST diagrams
Overload graphs
DP dependency graphs
Complexity heatmaps
Static panel previews

Example UI:

Left: Tree
Right: Graphviz diagram
Bottom: Details

Advantages:

Fully customizable (HTML/CSS/JS)
Perfect for diagrams and interactive views


4. CodeLens + Inline Decorations – Directly in CTRL Code
Show analysis info inside the editor.
Examples:

Above a function:



// CCN: 4 | NLOC: 12 | 1 issue
function main()
- Inline warnings:  

dpSet("System1:TempX", 42) ← Unknown DP

**Features:**  
- CodeLens above functions  
- Inline decorations (underline, color)  
- Hover tooltips  

**Advantages:**  
- Immediate feedback for developers  
- Great for complexity metrics and DP checks  

---

#### **🔥 Recommended Combination**
For a professional developer experience:  
1. **Tree View** → Structure, metrics, categories  
2. **Problems View** → Errors and warnings  
3. **CodeLens + Hover** → Inline insights  

Optional:  
- **Webview** → Visual diagrams  
- **Docs Integration** → Show `user.md` inside VS Code  

---

#### **Docs Integration**
- Command: `Open Documentation` → Opens `docs/user.md` in editor or styled Webview  
- Tree View node:  

WinCC OA Analyzer
├── Analysis
├── Issues
└── Documentation
└── User Guide
- Hover tooltips: Show relevant doc excerpts for issues  

---

### **Acceptance Criteria**
- Implements Tree View for analysis results  
- Integrates diagnostics into Problems View  
- Adds CodeLens and hover tooltips for CTRL files  
- Provides optional Webview for diagrams  
- Includes command to open documentation  
- Supports navigation from UI to source code  
