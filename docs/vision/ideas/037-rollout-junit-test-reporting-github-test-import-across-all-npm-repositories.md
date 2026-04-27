---
title: "Rollout JUnit Test Reporting + GitHub Test Import Across All npm Repositories"
description: "Vision idea tracked as GitHub issue #37."
---

- Status: **open**
- GitHub issue: [winccoa-tools-pack/.github#37](https://github.com/winccoa-tools-pack/.github/issues/37)
- Last sync: 2026-04-27 05:31:20 UTC
- Labels:
- gh-automation
- needs-triage

---

### Short title

Rollout: Standardized JUnit Test Reporting & GitHub Test Import for All npm Repositories

### What CI/CD gap does this address?

What CI/CD gap does this address?

Our current npm‑based repositories do not consistently produce machine‑readable test results that GitHub Actions can import into the native Tests dashboard.  
This leads to:

- Missing or inconsistent PR annotations  
- No unified test reporting across repositories  
- Reduced visibility into failing tests  
- Manual effort to inspect logs instead of structured results  
- Fragmented CI/CD behavior across packages

To improve reliability, observability, and standardization, we need a unified approach for generating and importing test results.


### Proposed workflow or action

Proposed workflow or action

Introduce a standardized JUnit test output + GitHub Test Report Import workflow and roll it out across all npm‑based repositories in the organization.

1. Update npm scripts
Add a dedicated CI test script that produces JUnit XML:

```json
{
  "scripts": {
    "test": "npm run test:unit",
    "test:ci": "npm run test:unit -- --reporter=junit --reporter-options output=test-results/junit.xml"
  }
}
```

(Framework‑specific reporters will be added as needed: Jest, Mocha, Vitest, Playwright, Cypress, etc.)

2. Add GitHub Actions steps
Integrate the official GitHub test results import:

```yaml
- name: Run tests
  run: npm run test:ci

- name: Upload test results
  uses: actions/upload-artifact@v4
  with:
    name: junit-results
    path: test-results/junit.xml

- name: Import test results
  uses: actions/upload-test-results@v2
  with:
    files: test-results/junit.xml
```

3. Apply this workflow to all npm repositories
- Create a reusable workflow in .github  
- Roll out via repository‑level PRs  
- Ensure consistent naming, folder structure, and artifact conventions  
- Validate that each repository’s test framework supports JUnit output

4. Benefits
- Unified CI/CD behavior across all npm projects  
- Native GitHub test reporting (Tests tab)  
- Inline PR annotations for failed tests  
- Better debugging and developer experience  
- Foundation for future automation (coverage, flaky test detection, etc.)
