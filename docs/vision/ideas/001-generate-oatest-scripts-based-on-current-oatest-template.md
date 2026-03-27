---
title: "Generate OaTest scripts based on current OaTest template"
description: "Vision idea tracked as GitHub issue #1."
---

- Status: **open**
- GitHub issue: [winccoa-tools-pack/.github#1](https://github.com/winccoa-tools-pack/.github/issues/1)
- Last sync: 2026-03-27 04:39:49 UTC
- Labels:
- enhancement
- ctrl-lang
- QG
- oa-test
- AI-topic

---



✅ Feature Request: AI‑Driven Test Case Generation for WinCC OA (OaTest Template)

📌 Summary
Introduce an AI‑powered workflow inside the WinCC OA Tools‑Pack VS Code extension that automatically generates OaTest‑compatible test cases using predefined, domain‑specific WinCC OA prompt templates.

This feature should streamline test creation, reduce repetitive work, and ensure consistent test structure across projects.

---

🎯 Motivation
Creating OaTest test cases manually is time‑consuming and error‑prone, especially when teams need to follow a consistent structure.  
Since the extension already focuses on developer productivity and modular workflows, adding AI‑assisted test generation is a natural next step.

This feature would allow developers to:

- Generate structured test cases from natural‑language descriptions  
- Use predefined WinCC OA–specific prompt templates  
- Maintain consistent formatting and naming conventions  
- Reduce onboarding time for new team members  
- Speed up test development in CI/CD‑driven environments  

---

✅ Proposed Functionality

1. Command Palette Action
WinCC OA: Generate OaTest Test Case (AI)  
- Opens an input box for the user to describe the test scenario  
- Uses predefined prompt templates to guide the AI  
- Generates a fully structured OaTest test file

2. Context Menu Integration
Right‑click on a folder → “Generate OaTest Test Case (AI)”  
- Output file is created in the selected directory  
- Naming follows project conventions

3. Prompt Template System
The extension should ship with a set of predefined WinCC OA prompts, for example:

- Test case structure  
- Naming conventions  
- Common OaTest patterns  
- WinCC OA API usage hints  
- Error handling and logging patterns  

Templates should be modular and override‑able via workspace settings.

4. Generated Output
The AI should produce:

- A complete OaTest test file  
- Proper imports  
- Setup/teardown blocks  
- Test steps with comments  
- Assertions based on the scenario  
- Optional mock/stub suggestions  

---

📂 Example Workflow
1. User runs the command  
2. User enters:  
   “Verify that a datapoint value change triggers the correct alert and logs the event.”  
3. Extension generates a ready‑to‑use OaTest file with:  
   - Test metadata  
   - Setup of datapoint  
   - Triggering value change  
   - Assertions for alert + log entry  

---

✅ Acceptance Criteria
- [ ] Command palette action exists  
- [ ] AI prompt templates are included and configurable  
- [ ] Generated test cases follow OaTest structure  - based on current wincc oa test template class
- [ ] Output is deterministic and consistent  
- [ ] Works with workspace‑level configuration  
- [ ] Documentation added to README  

---

📎 Additional Notes
This feature aligns with the long‑term goal of building a modular, AI‑assisted WinCC OA developer ecosystem inside VS Code, reducing friction and improving test quality.

