---
title: "This plan outlines the migration of GitHub Actions workflows to reusable workflows in the organization repository (winccoa-tools-pack/.github) to enable centralized Dependabot updates and reduce maintenance overhead across >20 repositories. This update includes handling of publishing secrets to ensure secure and centralized management."
description: "Vision idea tracked as GitHub issue #43."
---

- Status: **open**
- GitHub issue: [winccoa-tools-pack/.github#43](https://github.com/winccoa-tools-pack/.github/issues/43)
- Last sync: 2026-03-17 04:24:53 UTC
- Labels:
- CI
- gh-automation
- priority/high

---

### Idea title

This plan outlines the migration of GitHub Actions workflows to reusable workflows in the organization repository (winccoa-tools-pack/.github) to enable centralized Dependabot updates and reduce maintenance overhead across >20 repositories. This update includes handling of publishing secrets to ensure secure and centralized management.

### Describe your idea


## Current State Analysis

### Workflow Comparison: template-vscode-extension vs vscode-winccoa-ui-panel-viewer
- **Files Present**: Both directories contain identical workflow files:
  - apply-settings-and-rulesets.yml
  - ci-cd.yml
  - create-release-branch.yml
  - dependabot-auto-merge.yml
  - gitflow-validation.yml
  - gitflow.yml
  - pr-labels.yml
  - pre-release-develop.yml
  - pre-release.yml
  - prerelease-reusable.yml
  - release-reusable.yml
  - release.yml

- **Actions Used** (excluding @main references):
  - actions/checkout@v6
  - actions/setup-node@v6
  - actions/upload-artifact@v5
  - actions/labeler@v6
  - softprops/action-gh-release@v2
  - github/codeql-action/init@v3
  - github/codeql-action/autobuild@v3
  - github/codeql-action/analyze@v3
  - Azure/container-scan@v0

### Existing Reusable Workflows
- **Organization Repository** (workflows):
  - sync-labels-reusable.yml
  - fanout-labels.yml (uses sync-labels-reusable.yml)
  - run-single-sync.yml (uses sync-labels-reusable.yml)

- **Current Usage**: Some repositories already reference `winccoa-tools-pack/.github/.github/workflows/sync-labels-reusable.yml@main`

### Secret Management Current State
- **VS Code Extensions**: Currently use per-repository publish tokens (e.g., `VSCE_PAT`)
- **Target**: Repository-level secrets with organization fallback
- **NPM Packages**: Currently use organization PAT (`ORG_PAT`) for publishing
- **Issue**: Per-repo secrets for VS Code publishing create maintenance overhead and inconsistency

## Identified Reusable Workflow Candidates

### Common Across All Templates
1. **Changelog Validation** - Used in ci-cd.yml across templates
2. **Linting** - Node.js linting steps
3. **Testing** - Test execution
4. **Build** - Build processes
5. **Security Scanning** - CodeQL, container scanning
6. **Label Management** - PR labeling (already partially reusable)
7. **Release Preparation** - Pre-release steps
8. **Publishing** - Release publishing (with centralized secrets)

### Template-Specific Reusables
1. **VS Code Extension Specific**:
   - Extension packaging
   - Marketplace publishing (using org secrets)
   - VS Code specific testing

2. **NPM Package Specific**:
   - NPM publishing (using org PAT)
   - Package validation

### Cross-Template Reusables
1. **Changelog Generation** - Used across all repository types
2. **Git Flow Validation** - Branch naming and flow validation
3. **Dependabot Auto-merge** - Automated merging of Dependabot PRs

## Proposed Reusable Workflows Structure

### Organization Repository Structure
```
.github/
  workflows/
    reusable/
      changelog-validation.yml
      lint-node.yml
      test-node.yml
      build-node.yml
      security-scan.yml
      label-pr.yml
      prepare-release.yml
      publish-release.yml
      changelog-generate.yml
      gitflow-validate.yml
      dependabot-automerge.yml
      vscode/
        package-extension.yml
        publish-marketplace.yml  # Uses org secrets
        test-extension.yml
      npm/
        publish-package.yml  # Uses org PAT
        validate-package.yml
```

### Template-Specific Composites
- Keep template-specific workflows as composites that call reusable workflows
- VS Code template calls: changelog-validation, lint-node, test-node, build-node, package-extension, publish-marketplace, etc.
- NPM template calls: changelog-validation, lint-node, test-node, build-node, validate-package, publish-package, etc.

## Secret Management Strategy

### VS Code Extension Publishing
- **Current**: Per-repository `VSCE_PAT` secrets
- **Target**: Repository-level secrets with organization fallback
- **Implementation**:
  - Use `secrets.VSCE_PAT` (repo secret) with fallback to `secrets.ORG_VSCE_PAT` (org secret)
  - Update reusable workflow to check for repo secret first, then org secret
  - Remove per-repo secrets after migration

### NPM Package Publishing
- **Current**: Uses `secrets.ORG_PAT` (org secret)
- **Target**: Maintain consistency, ensure all NPM publishing uses org PAT
- **Implementation**:
  - Confirm all NPM workflows use `secrets.ORG_PAT`
  - Update any inconsistent usage

### General Secret Handling in Reusable Workflows
- Reusable workflows must access secrets from calling repository
- Use conditional logic for fallback secrets
- Document required secrets in workflow READMEs

## Migration Strategy

### Phase 1: Create Core Reusable Workflows
1. Create reusable workflows for common actions in `.github/workflows/reusable/`
2. Implement secret fallback logic in publishing workflows
3. Tag initial versions (v1.0.0)
4. Update organization repository workflows to use new reusables

### Phase 2: Update Templates
1. Modify template-vscode-extension workflows to use reusable workflows with secret fallbacks
2. Modify template-npm-shared-library workflows to use reusable workflows
3. Update dependabot.yml in templates
4. Add documentation for required secrets

### Phase 3: Migrate Secrets
1. Add organization-level secrets (`ORG_VSCE_PAT`, confirm `ORG_PAT`)
2. Update repository secrets to use repo-level `VSCE_PAT` where needed
3. Test secret access in reusable workflows
4. Remove old per-repo secrets after validation

### Phase 4: Rollout to Existing Repositories
1. Update all existing repositories to use new reusable workflows
2. Update dependabot.yml in all repositories
3. Configure Dependabot access for private repos
4. Validate secret access across all repositories

### Phase 5: Maintenance and Monitoring
1. Establish versioning policy for reusable workflows
2. Set up monitoring for workflow failures
3. Document update procedures and secret requirements
4. Regular audit of secret usage

## Dependabot Configuration

### Template dependabot.yml
```yaml
version: 2
updates:
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
registries:
  org-gh-registry:
    type: git
    url: https://github.com
    username: x-access-token
    password: ${{ secrets.DEPENDABOT_PAT }}
```

### Implementation Steps
1. Create reusable workflows in organization repo with secret handling
2. Set up organization secrets for publishing
3. Update templates to reference reusables with version tags
4. Update all consumer repositories
5. Configure Dependabot in all repositories
6. Set up Dependabot PAT for private repo access
7. Test and validate across all repositories

## Risks and Mitigations
- **Breaking Changes**: Version workflows to allow gradual rollout
- **Private Repo Access**: Use Dependabot PAT or org-level permissions
- **Secret Access**: Test fallback logic thoroughly before rollout
- **Template Drift**: Keep templates as thin wrappers around reusables
- **Testing**: Ensure all workflows tested before rollout, including secret access

## Success Metrics
- All repositories using reusable workflows with version tags
- Dependabot creating update PRs automatically
- Centralized secret management for publishing
- Reduced workflow maintenance overhead
- Consistent CI/CD behavior across repositories
- No per-repo publishing secrets (except where repo-specific tokens required)
