---
title: "[FEATURE] WinCC OA DataPoint Schema Validator"
description: "Vision idea tracked as GitHub issue #12."
---

- Status: **open**
- GitHub issue: [winccoa-tools-pack/.github#12](https://github.com/winccoa-tools-pack/.github/issues/12)
- Last sync: 2026-04-05 13:09:10 UTC
- Labels:
- enhancement
- CI
- QG
- vs-code-extension
- gh-oa-actions

---

**Description:**  
Create a validator that checks DP structures against defined schemas.


**Benefits:**  
- Ensures consistency  
- Enables CI checks  
- Supports automatic documentation  
- Prevents errors  
- vs-code support (command)

It might be helpfull by addig sub-projects, if the user DPs are from correct type with correct struct. Also It might be helpfull to check thedata integrite after WinCC OA update or upgrade.

**Acceptance Criteria:**  
- Validates DP structures against JSON schema  
- Provides CLI and CI integration  
- Outputs validation report  
- Includes usage examples  
