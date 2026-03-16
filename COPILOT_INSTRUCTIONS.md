
# COPILOT\_INSTRUCTIONS.md

**Purpose:**  
A repeatable set of instructions for maintaining and extending the **winccoa-tools-pack** website (GitHub Pages), including **daily automation**, **repository overview generation**, **founder & team pages**, **success stories**, and **assets (images/videos)**.

> **Primary site generator:** **Docusaurus** (modern design, MDX support, videos/images, blog, custom React pages)  
> **Site URL:** `https://winccoa-tools-pack.github.io/` (recommended repository name: `winccoa-tools-pack.github.io`)  
> **Org-wide reusable workflow repo:** `winccoa-tools-pack/.github`

***

## 0) Quick Summary

*   Use **Docusaurus** for a modern site.
*   Store **images** under `static/img/`, **videos** under `static/video/`.
*   Daily workflow:
  *   (Optional) Generates `docs/team/index.md` from `docs/team/people/*.md`.
  *   Builds & deploys via the **reusable workflow** in `.github`.

***

## 1) Repository Structure (Docusaurus)

Create a repository named **`winccoa-tools-pack.github.io`** with the following structure:

    winccoa-tools-pack.github.io/
      docs/
        tools/
          index.md                           # ← tools landing page (grouped by categories)
          npm/                               # ← npm-winccoa-* tool docs
          vscode-extension/                  # ← vscode-winccoa-* tool docs
          templates/                         # ← template-* docs
          ci-automation/                     # ← CI/workflow docs
          other/                             # ← legacy/misc repos
          concepts/                          # ← roadmap / ideas
        success-stories/
          index.md                           # overview (manual)
          oalint-improved-code-quality.md    # examples (manual)
          faster-ci-with-gh-actions.md
        about/
          martin-pokorny.md                  # founder page (manual)
        team/
          index.md                           # team landing (manual or auto-built)
          people/
            martin-pokorny.md                # one file per person (manual)
            jane-doe.md
      static/
        img/
          people/
          success-stories/
          marketing/
          logos/
        video/
          success-stories/
      src/
        pages/
          index.js                           # custom modern homepage (React)
          team.js                            # optional: modern team grid page
          founder.js                         # optional: rich founder page
      sidebars.js
      docusaurus.config.js
      package.json
      .github/
        workflows/
          site.yml                           # calls the reusable deploy workflow

***

## 2) Assets (Images & Videos)

*   **Images** → `static/img/...` → reference with `/img/...`
*   **Videos (mp4)** → `static/video/...` → reference with `/video/...`

**Examples in MDX:**

```mdx
/img/success-stories/oalint-quality/graph.png

/video/success-stories/oalint-demo.mp4
```

***

## 3) Daily Auto-Generation & Deployment

> Uses a **reusable workflow** hosted in `winccoa-tools-pack/.github`.

### 3.1 Create reusable workflow in `.github` (once)

**Repo:** `winccoa-tools-pack/.github`  
**File:** `.github/workflows/deploy-pages.yml`

```yaml
name: Reusable — Build & Deploy Pages (Node/Python/Hugo)

on:
  workflow_call:
    inputs:
      build_system:
        required: true
        type: string
        description: "docusaurus | mkdocs | hugo"
      node_version:
        required: false
        type: string
        default: "20"
      python_version:
        required: false
        type: string
        default: "3.11"
      build_dir:
        required: true
        type: string
        description: "Directory with built static site (e.g., build, site, public)"
      install_cmd:
        required: false
        type: string
        default: ""
      build_cmd:
        required: true
        type: string
        description: "Command to build the site"

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    concurrency:
      group: pages
      cancel-in-progress: true
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup for Docusaurus
        if: inputs.build_system == 'docusaurus'
        uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node_version }}

      - name: Setup for MkDocs
        if: inputs.build_system == 'mkdocs'
        uses: actions/setup-python@v5
        with:
          python-version: ${{ inputs.python_version }}

      - name: Setup for Hugo
        if: inputs.build_system == 'hugo'
        uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: '0.125.7'
          extended: true

      - name: Install
        if: inputs.install_cmd != ''
        run: ${{ inputs.install_cmd }}

      - name: Build
        run: ${{ inputs.build_cmd }}

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ${{ inputs.build_dir }}

      - name: Deploy to GitHub Pages
        id: deploy
        uses: actions/deploy-pages@v4
```

### 3.2 Site workflow in `winccoa-tools-pack.github.io`

**Repo:** `winccoa-tools-pack.github.io`  
**File:** `.github/workflows/site.yml`

```yaml
name: Website — Generate Overview & Deploy

on:
  schedule:
    - cron: "5 2 * * *"   # daily at 02:05 UTC
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: write   # to commit generated pages
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  # Optional: auto-build the team landing from local markdown
  generate-team-index:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build team index from local people/*.md
        run: |
          node -e "
          const fs = require('fs'), path = require('path');
          const dir = 'docs/team/people';
          const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.md') || f.endsWith('.mdx')) : [];
          const people = [];
          for (const f of files) {
            const p = path.join(dir, f);
            const raw = fs.readFileSync(p, 'utf8');
            const match = raw.match(/^---[\\s\\S]*?---/);
            let fm = {};
            if (match) {
              const yaml = match[0].replace(/^---|---$/g, '');
              yaml.split('\\n').forEach(line => {
                const m = line.match(/^([A-Za-z0-9_]+):\\s*(.*)$/);
                if (m) {
                  const k = m[1].trim(), v = m[2].trim();
                  if (v.startsWith('[') && v.endsWith(']')) {
                    fm[k] = v.slice(1, -1).split(',').map(s => s.trim());
                  } else {
                    fm[k] = v.replace(/^\"|\"$/g,'');
                  }
                }
              });
            }
            const title = fm.title || f.replace(/\\.(md|mdx)$/,'').replace(/[-_]/g,' ');
            people.push({
              title,
              role: fm.role || '',
              path: './people/' + f,
            });
          }
          people.sort((a,b) => a.title.localeCompare(b.title));
          const out = [
            '---',
            'title: Team & Contributors',
            'description: The people behind winccoa-tools-pack.',
            '---',
            '',
            '# Team & Contributors',
            '',
            'Below are the people who make this ecosystem possible.',
            '',
            people.map(p => `- ${p.path}${p.role ? ' — ' + p.role : ''}`).join('\\n'),
            '',
            '> Want to be featured? Add your profile to `docs/team/people/` and open a PR.',
            ''
          ].join('\\n');
          fs.mkdirSync('docs/team', { recursive: true });
          fs.writeFileSync('docs/team/index.md', out);
          "
      - name: Commit team index (if changed)
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "chore(docs): rebuild team index [skip ci]"
          file_pattern: docs/team/index.md

  deploy:
    needs: [generate-team-index]
    uses: winccoa-tools-pack/.github/.github/workflows/deploy-pages.yml@main
    with:
      build_system: docusaurus
      node_version: "20"
      install_cmd: npm ci
      build_cmd: npm run build
      build_dir: build
```

**After first push**, go to **Settings → Pages → Build and deployment → Source = GitHub Actions**.

***

## 4) Docusaurus Essentials

### 4.1 Install & Init (one-time)

```bash
# from inside winccoa-tools-pack.github.io
npx create-docusaurus@latest . classic --typescript
npm i
npm run start
```

*   Put your **logo** under `static/img/logo/`.
*   Configure navbar/footer in `docusaurus.config.js`.

### 4.2 Sidebar entries (`sidebars.js`)

Example:

```js
module.exports = {
  docs: [
    'intro',
    { type: 'category', label: 'Tools', items: ['tools/index'] },
    { type: 'category', label: 'Success Stories', items: [
      'success-stories/index',
      // add additional story files here
    ]},
    { type: 'category', label: 'About', items: ['about/martin-pokorny'] },
    { type: 'category', label: 'Community', items: ['team/index'] },
  ],
};
```

### 4.3 Modern Homepage (`src/pages/index.js`)

Create a modern hero + CTA page. Example skeleton:

```jsx
import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

export default function Home() {
  return (
    <Layout title="WinCC OA Tools Pack" description="Modern open-source tooling for WinCC OA">
      <header className={styles.heroBanner}>
        <div className="container">
          <h1 className={styles.heroTitle}>WinCC OA Tools Pack</h1>
          <p className={styles.heroSubtitle}>
            Modern open-source tooling for developers, QA engineers, and automation experts.
          </p>
          <div className={styles.buttons}>
            <Link className="button button--primary button--lg" to="/docs/tools">
              Browse Tools
            </Link>
            <Link className="button button--secondary button--lg" to="/docs/success-stories">
              Success Stories
            </Link>
          </div>
        </div>
      </header>
      <main>
        {/* Add marketing sections, images or an embedded MP4 here */}
        <section className="container padding-vert--lg">
          <h2>Your WinCC OA development, modernized</h2>
          <p>High-quality tooling, automated QA, CI/CD integrations, and a great developer experience.</p>
        </section>
      </main>
    </Layout>
  );
}
```

Create a small CSS file `src/pages/index.module.css` for styling (hero background, spacing, etc.).

***

## 5) Content Templates

### 5.1 Founder page (Markdown) — `docs/about/martin-pokorny.md`

```md
---
title: Martin Pokorný
subtitle: Founder of winccoa-tools-pack
role: Senior Key Developer & Key QA (WinCC OA)
location: Eisenstadt, AT
photo: /img/people/martin-pokorny.jpg
---

# About Martin

I’m a Senior Key Developer and Key QA Engineer focused on the **WinCC OA** ecosystem.
I founded **winccoa-tools-pack** to bring **modern engineering practices** to WinCC OA projects:
- Code quality (**linters**, rule packs)
- **CI/CD** integrations (GitHub Actions, Jenkins, Azure)
- **Developer experience** (VS Code extensions, CLIs)
- **QA workflows** (checklist-driven reviews, security hygiene)

## Mission
Make WinCC OA development **faster, safer, and more consistent** by providing open, reusable tools.
```

### 5.2 Team person file — `docs/team/people/<name>.md`

```md
---
title: Jane Doe
role: Contributor — CI/CD & QA
photo: /img/people/jane-doe.jpg
links:
  github: https://github.com/jane
  linkedin: https://www.linkedin.com/in/jane
areas: [OALint, GitHub Actions, Jenkins]
repos: [oalint, github-oalint, jenkins-oalint]
---

I contribute to CI and QA tooling across **winccoa-tools-pack**, focusing on reproducible builds,
code quality gates, and developer experience.
```

### 5.3 Team landing (manual) — `docs/team/index.md`

```md
---
title: Team & Contributors
description: The people behind winccoa-tools-pack.
---

# Team & Contributors

These repositories reflect a collaborative effort — thank you to everyone participating.

> Want to be featured here? Open a PR adding a Markdown file to `docs/team/people/`.
```

*(If you enable the generator job, this file will be auto-rebuilt daily.)*

### 5.4 Success stories — `docs/success-stories/*.md`

```md
---
title: OALint Reduced Pre‑QA Defects by 70%
tags: [oalint, code-quality, automation]
---

# OALint Reduced Pre‑QA Defects by 70%

/img/success-stories/oalint-quality/graph.png

Here is a short demo:

/video/success-stories/oalint-demo.mp4</video>

## Before
- Manual enforcement of standards
- Frequent regressions

## After adopting OALint
- 70% fewer pre‑QA defects
- Faster onboarding
- Standardized coding practices
```

***

## 6) Conventions & Expectations

*   **Repo descriptions** (in each repo’s settings or `.github/repository.settings.yml`) should be maintained; they are used as the **first info** in the overview.
*   Repos should include: `README.md`, `LICENSE`, `CHANGELOG.md`, `FUNDING.md` or `.github/FUNDING.yml`, `SECURITY.md`, `CONTRIBUTING.md` (the generator attempts common paths).
*   **Discussions / Wiki / Issues** links appear if **enabled** in the repo settings.
*   **Artifacts:** link provided to **Actions** and **Releases** pages (GitHub doesn’t provide a static “artifacts” index URL per repo).

***

## 7) Switch to MkDocs or Hugo (optional later)

If you ever switch:

*   **MkDocs (Material):**
    *   Replace the deploy job inputs:
            build_system: mkdocs
            python_version: "3.11"
            install_cmd: |
              pip install --upgrade pip
              pip install mkdocs-material
            build_cmd: mkdocs build --strict
            build_dir: site
    *   Move/keep Markdown under `docs/` and configure `mkdocs.yml`.

*   **Hugo:**
    *   Content goes under `content/`.
    *   Inputs:
            build_system: hugo
            build_cmd: hugo --minify
            build_dir: public

***

## 8) Copilot Prompts (Reusable Snippets)

Use the following prompts with GitHub Copilot Chat in the **site repo** to quickly scaffold or extend content.

### Prompt: Create a new success story

    Create a new success story page under docs/success-stories/ named:
    <file-name>.md
    Use front matter with title and tags, and include placeholders for images (/img/success-stories/<slug>/...) and a video (/video/success-stories/<slug>.mp4). The story should have sections: Before, Solution, Results, and a short testimonial quote.

### Prompt: Add a new team member

    Create docs/team/people/<slug>.md with front matter (title, role, photo, links.github, links.linkedin, areas, repos). Add a 3-5 sentence bio focusing on contributions to OALint or CI/CD.

### Prompt: Improve the homepage hero

    Open src/pages/index.js and add a hero section with a background image (/img/marketing/hero-bg.jpg), a main headline, subtitle, and two CTA buttons linking to /docs/tools and /docs/success-stories. Keep the design clean and modern.

### Prompt: Add a new “How-To” doc

    Create docs/how-to/integrate-oalint-in-github-actions.md with a step-by-step guide, including code blocks for a minimal workflow, and a troubleshooting section.

***

## 9) First-Time Setup Checklist

1.  Create repo **`winccoa-tools-pack.github.io`**.
2.  Initialize **Docusaurus** (`npx create-docusaurus@latest . classic --typescript`).
3.  Add **sidebars.js** entries for Repositories, Success Stories, About, Community.
4.  Add **site workflow** (`.github/workflows/site.yml`) and set **Pages Source = GitHub Actions**.
5.  In org **`.github`** repo, add **reusable deploy workflow** (`deploy-pages.yml`).
6.  Commit founder page, one success story, and (optionally) a team person file.
7.  Add any images/videos under `static/img` and `static/video`.
8.  Push to `main` → verify build & deployment.
9.  Confirm daily cron runs at **02:05 UTC**.

***

## 10) Maintenance

*   Update repo descriptions → reflected next daily build automatically.
*   Add new success stories / team members → pick up on next daily build (or on push).
*   If you enable the team index generator, new profiles appear automatically the next run.
*   Keep Docusaurus packages updated periodically (`npm outdated` / `npm update`).

***

**That’s it.**  
Store this file in your repo. It’s designed so **you (and Copilot)** can re-use it anytime to remember the structure, workflows, and conventions for your GH Pages site.

If you want, I can also generate:

*   The **starter Docusaurus project files** (pre-filled),
*   A **polished homepage** with your branding,
*   A **first success story** and **founder page** filled with your details.
