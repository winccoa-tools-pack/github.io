---
title: "Automate repo settings & GitFlow protections via YAML + Rulesets (main, develop, release/, hotfix/, v tags)*"
description: "Vision idea tracked as GitHub issue #35."
---

- Status: **done**
- GitHub issue: [winccoa-tools-pack/.github#35](https://github.com/winccoa-tools-pack/.github/issues/35)
- Last sync: 2026-05-06 05:36:11 UTC
- Labels:
- good first issue
- CI
- DevOps
- gh-automation
- configuration
- needs-triage
- good-first-issue

---

### Short title

CaC for github settings

### What CI/CD gap does this address?

We want to codify repository settings and GitFlow protections in versioned YAML files and apply them via a single GitHub Actions workflow.
This uses Repository Rulesets (instead of legacy branch protection) to enforce policies on main, develop, release/, hotfix/, and semantic version tags (v*.*.*). Rulesets give us layered, transparent, and testable enforcement modes (active / evaluate). [stackoverflow.com]
Implementation is driven by:

.github/repository.settings.yml → repo metadata, topics, security toggles
.github/rulesets/*.yml → one ruleset per file (branches/tags)

The workflow parses YAML → JSON and applies settings with the GitHub REST API (PATCH /repos, PUT /repos/&#123;owner&#125;/&#123;repo&#125;/topics, security toggles, and Rulesets POST/PUT /repos/&#123;owner&#125;/&#123;repo&#125;/rulesets). You can view effective rules via GET /repos/&#123;owner&#125;/&#123;repo&#125;/rules/branches/&#123;branch&#125;.

### Proposed workflow or action

Repo settings (YAML)

File: .github/repository.settings.yml
Manage: description, homepage, default_branch, visibility, has_issues, has_wiki, merge options (allow_squash_merge, allow_merge_commit, allow_rebase_merge), delete_branch_on_merge. [meta.jlericson.com]
Topics: replace all topics with &#123; names: [...] &#125; (lowercase). [docs.github.com]
Security toggles: enable dependency alerts & automated security fixes. [github.com], [stackoverflow.com]



Rulesets (YAML) — GitFlow

01-main-protection.yml: strict protection for main.
02-develop-protection.yml: protection for develop (1 approval).
03-release-hotfix.yml: protect release/* and hotfix/* (1 approval).
04-release-tags.yml: protect v*.*.* tags (block deletion/rewrites).
Manage via Repos → Rules → Rulesets endpoints; query rules for a given branch/tag to verify. [tryapis.com]



Workflow

File: .github/workflows/apply-settings-and-rulesets.yml
Trigger: on changes to .github/repository.settings.yml and .github/rulesets/**, and workflow_dispatch.
Steps: install PyYAML → parse YAML → JSON → call REST endpoints (PATCH repo, PUT topics, enable security, POST/PUT rulesets). [tryapis.com], [[meta.jlericson.com]](https://meta.jlericson.com/t/fetching-github-discussions-via-the-api/419)
Auth: use GITHUB_TOKEN (requires admin actor). Fallback to REPO_ADMIN_TOKEN secret with repo admin scope if needed.

[meta.jlericson.com]




📦 Files to Add
A) .github/repository.settings.yml
```yml

description: "Shared tooling for WinCC OA linting, CI and checks"
homepage: "https://example.org"
default_branch: "main"
visibility: "public"
has_issues: true
has_wiki: false

allow_squash_merge: true
allow_merge_commit: false
allow_rebase_merge: false
delete_branch_on_merge: true

topics:
  - winccoa
  - oalint
  - ci
  - automation

security:
  enable_vulnerability_alerts: true      # PUT /repos/{owner}/{repo}/vulnerability-alerts
  enable_automated_security_fixes: true  # PUT /repos/{owner}/{repo}/automated-security-fixes
```

B) .github/rulesets/01-main-protection.yml
```yml

name: "Main branch protection"
target: "branch"
enforcement: "active"   # start with "evaluate" if you want to dry-run first

bypass_actors:
  - actor_id: 1
    actor_type: "RepositoryRole"
    bypass_mode: "always"

conditions:
  ref_name:
    include: ["main"]
    exclude: []

rules:
  - type: "non_fast_forward"
  - type: "pull_request"
      strict_required_status_checks: true    parameters:
      require_last_push_approval: false
      required_status_checks:
        - "build"
        - "lint"
        # - "tests" (add if available)
  - type: "required_conversation_resolution"
  - type: "required_linear_history"
      required_approving_review_count: 1     # small team; change to 2 later if needed
      dismiss_stale_reviews_on_push: true
      require_code_owner_review: true
  - type: "required_status_checks"
    parameters:

```
C) .github/rulesets/02-develop-protection.yml
```yml

name: "Develop branch protection"
target: "branch"
enforcement: "active"

bypass_actors:
  - actor_id: 1
    actor_type: "RepositoryRole"
    bypass_mode: "always"

conditions:
  ref_name:
    include: ["develop"]
    exclude: []

rules:
  - type: "non_fast_forward"
  - type: "pull_request"
    parameters:
      required_approving_review_count: 1
      dismiss_stale_reviews_on_push: true
      require_code_owner_review: true
  - type: "required_status_checks"
    parameters:
      strict_required_status_checks: true
      require_last_push_approval: false
      required_status_checks:
        - "build"
        - "lint"
  - type: "required_conversation_resolution"
  - type: "required_linear_history"

```
D) .github/rulesets/03-release-hotfix.yml
```yml

name: "Release & Hotfix protection"
target: "branch"
enforcement: "active"

bypass_actors:
  - actor_id: 1
    actor_type: "RepositoryRole"
    bypass_mode: "always"

conditions:
  ref_name:
    include:
      - "release/*"
      - "hotfix/*"
    exclude: []

rules:
  - type: "non_fast_forward"
  - type: "pull_request"
    parameters:
      require_last_push_approval: false      required_approving_review_count: 1
      required_status_checks:
        - "build"
        - "lint"
        # - "tests"
  - type: "required_conversation_resolution"
  - type: "required_linear_history"
      dismiss_stale_reviews_on_push: true
      require_code_owner_review: true
  - type: "required_status_checks"
    parameters:
      strict_required_status_checks: true

```
E) .github/rulesets/04-release-tags.yml
```yml

name: "Release tags protection"
target: "tag"
enforcement: "active"

bypass_actors:
  - actor_id: 1
    actor_type: "RepositoryRole"
    bypass_mode: "always"

conditions:
  ref_name:
    include:
      - "v*.*.*"        # semantic version tags
    exclude: []

rules:
  - type: "non_fast_forward"  # prevent rewriting/deleting tags

```

F) .github/workflows/apply-settings-and-rulesets.yml
```yml

name: Apply Repo Settings & Rulesets (YAML)

on:
  push:
    paths:
      - ".github/repository.settings.yml"
      - ".github/rulesets/**"
  workflow_dispatch:

permissions:
  contents: read

jobs:
  apply:
    runs-on: ubuntu-latest
    env:
      REPO: ${{ github.repository }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install tooling (Python & gh)
        run: |
          python3 --version
          gh --version || sudo apt-get update && sudo apt-get install -y gh
          python3 -m pip install --upgrade pip
          python3 -m pip install pyyaml

      - name: Authenticate gh
        run: |
          TOKEN="${{ secrets.REPO_ADMIN_TOKEN || github.token }}"
          echo "$TOKEN" | gh auth login --with-token

      # Parse repo settings
      - name: Parse repository.settings.yml to JSON
        id: parse_repo
        run: |
          FILE=".github/repository.settings.yml"
          if [ -f "$FILE" ]; then
            python3 - <<'PY'
import yaml, json
data = yaml.safe_load(open(".github/repository.settings.yml")) or {}
patch_keys = {
  "description","homepage","default_branch","visibility",
  "has_issues","has_wiki",
  "allow_squash_merge","allow_merge_commit","allow_rebase_merge",
  "delete_branch_on_merge"
}
patch = {k:v for k,v in data.items() if k in patch_keys and v is not None}
open("repo_patch.json","w").write(json.dumps(patch))
open("topics.json","w").write(json.dumps(data.get("topics",[])))
open("security.json","w").write(json.dumps(data.get("security",{})))
PY
            echo "has_settings=true" >> $GITHUB_OUTPUT
          else
            echo "{}" > repo_patch.json
            echo "[]" > topics.json
            echo "{}" > security.json
            echo "has_settings=false" >> $GITHUB_OUTPUT
          fi

      - name: Update repository (PATCH /repos)
        if: steps.parse_repo.outputs.has_settings == 'true'
        run: |
          IFS='/' read -r OWNER NAME <<< "$REPO"
          if [ "$(jq 'length' repo_patch.json)" -gt 0 ]; then
            gh api --method PATCH -H "Accept: application/vnd.github+json" \
              "repos/$OWNER/$NAME" --input repo_patch.json
          fi
        # Repo update. [4](https://meta.jlericson.com/t/fetching-github-discussions-via-the-api/419)

      - name: Replace topics (PUT /topics)
        if: steps.parse_repo.outputs.has_settings == 'true'
        run: |
          IFS='/' read -r OWNER NAME <<< "$REPO"
          jq -n --argfile t topics.json '{names: $t}' > topics_payload.json
          gh api --method PUT -H "Accept: application/vnd.github+json" \
            "repos/$OWNER/$NAME/topics" --input topics_payload.json
        # Replace all topics. [5](https://docs.github.com/en/rest/secret-scanning)

      - name: Enable security features
        if: steps.parse_repo.outputs.has_settings == 'true'
        run: |
          IFS='/' read -r OWNER NAME <<< "$REPO"
          if jq -e '.enable_vulnerability_alerts==true' security.json >/dev/null; then
            gh api --method PUT "repos/$OWNER/$NAME/vulnerability-alerts"
          fi
          if jq -e '.enable_automated_security_fixes==true' security.json >/dev/null; then
            gh api --method PUT "repos/$OWNER/$NAME/automated-security-fixes"
          fi
        # Security toggles. [6](https://github.com/github/docs/blob/main/content/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets.md)[7](https://stackoverflow.com/questions/64419340/how-can-i-use-the-github-rest-api-to-update-a-repository-that-is-part-of-an-orga)

      - name: Discover ruleset YAML files
        id: gather
        run: |
          FILES=$(ls -1 .github/rulesets/*.yml 2>/dev/null || true)
          echo "files<<EOF" >> $GITHUB_OUTPUT
          echo "$FILES" >> $GITHUB_OUTPUT
          echo "EOF" >> $GITHUB_OUTPUT

      - name: Upsert repository rulesets (POST/PUT)
        if: steps.gather.outputs.files != ''
        run: |
          set -euo pipefail
          IFS='/' read -r OWNER NAME <<< "$REPO"

          gh api "repos/$OWNER/$NAME/rulesets" > existing.json

          for f in ${{ steps.gather.outputs.files }}; do
            python3 - <<PY
import yaml,json
data=yaml.safe_load(open("$f"))
open("ruleset_payload.json","w").write(json.dumps(data))
PY

            NAME_RS=$(jq -r '.name' ruleset_payload.json)
            if [ -z "$NAME_RS" ] || [ "$NAME_RS" = "null" ]; then
              echo "Ruleset $f missing .name; skipping."; continue
            fi

            ID=$(jq -r --arg n "$NAME_RS" '.[] | select(.name==$n) | .id' existing.json | head -n1)

            if [ -n "$ID" ] && [ "$ID" != "null" ]; then
              gh api --method PUT -H "Accept: application/vnd.github+json" \
                "repos/$OWNER/$NAME/rulesets/$ID" --input ruleset_payload.json
            else
              gh api --method POST -H "Accept: application/vnd.github+json" \
                "repos/$OWNER/$NAME/rulesets" --input ruleset_payload.json
            fi
          done
        # Rulesets endpoints. [1](https://tryapis.com/github/api/issues-list-for-repo/)

```
✅ Acceptance Criteria

-  [ ] Workflow runs on push to YAML config folders and on manual dispatch.

-  [ ]  Repo settings are patched and topics are fully replaced from YAML.
-  [ ]  Security features are enabled when specified.
-  [ ]  Rulesets created/updated for:

-  [ ]  main (PR required, 1 approval, checks: build, lint, optional tests), no force push
-  [ ]  develop (same as above, 1 approval)
-  [ ]  release/* & hotfix/* (1 approval, checks)
-  [ ]  v*.*.* tags protected (no rewriting/deleting)


 -  [ ] Team can view rulesets under Settings → Rules → Rulesets and verify via API:
    + GET /repos/&#123;owner&#125;/&#123;repo&#125;/rulesets
    + GET /repos/&#123;owner&#125;/&#123;repo&#125;/rules/branches/&#123;branch&#125; (check applied rules) [tryapis.com]


-  [ ] provide rules for:
  + organization repository
  + all template repositories

-  [ ] roll out rules from templates into working repositories
-  [ ] provide useful set of **topics** per template to group the repositories. It will be possible to find all repositories with topic wincc-oa-github-action ...

🔒 Auth / Secrets

Prefer built‑in GITHUB_TOKEN (works when actor has admin on the repo).
If we see 403/404, add repo/org secret REPO_ADMIN_TOKEN (classic or fine‑grained PAT) with repo admin scope; workflow will use it automatically. [[meta.jlericson.com]](https://meta.jlericson.com/t/fetching-github-discussions-via-the-api/419)


⚠️ Risks / Notes

Status check names must match CI contexts exactly (e.g., build, lint, tests). If names change, update the rulesets YAML accordingly. [tryapis.com]
New rulesets can start in evaluate mode to observe compliance without blocking merges; then flip to active. [stackoverflow.com]
Topics must be lowercase; sending [] clears all topics. [[docs.github.com]](https://docs.github.com/en/rest/secret-scanning)


📚 References

Repository Rulesets API (create/update/list, get rules for branch): see “REST API endpoints for rules” (Repos → Rules). [tryapis.com]
Update repository / Replace topics / Security toggles: Repos REST API (update repo, topics, vulnerability alerts, automated security fixes). [meta.jlericson.com], [docs.github.com], [[github.com]](https://github.com/github/docs/blob/main/content/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets.md), [[stackoverflow.com]](https://stackoverflow.com/questions/64419340/how-can-i-use-the-github-rest-api-to-update-a-repository-that-is-part-of-an-orga)
Issue templates / issue forms (YAML): GitHub Docs. [docs.github.com]
