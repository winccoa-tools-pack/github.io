import fs from 'node:fs';
import path from 'node:path';

const OWNER = 'winccoa-tools-pack';
const REPO = '.github';
const ISSUE_TYPE = 'Feature';

const REPO_WEB = `https://github.com/${OWNER}/${REPO}`;
const ISSUES_WEB = `${REPO_WEB}/issues`;

const OUTPUT_DIR = path.join('docs', 'vision');
const OUTPUT_IDEAS_DIR = path.join(OUTPUT_DIR, 'ideas');
const INDEX_PATH = path.join(OUTPUT_DIR, 'index.mdx');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeFileIfChanged(filePath, content) {
  const exists = fs.existsSync(filePath);
  const prev = exists ? fs.readFileSync(filePath, 'utf8') : null;
  if (prev === content) return false;
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80) || 'vision';
}

function yamlDoubleQuoted(value) {
  const safe = String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\"/g, '\\"')
    .replace(/\r\n/g, '\\n')
    .replace(/\n/g, '\\n');
  return `"${safe}"`;
}

function escapeMdxText(value) {
  return value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function extractIdeaTitleFromBody(issueBody) {
  if (!issueBody) return null;

  // Match a heading line exactly like: ### Idea title
  const lines = issueBody.replace(/\r\n/g, '\n').split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (/^###\s*Idea title\s*$/i.test(lines[i].trim())) {
      for (let j = i + 1; j < lines.length; j++) {
        const candidate = lines[j].trim();
        if (!candidate) continue;
        if (candidate.startsWith('#')) continue;
        return candidate;
      }
    }
  }

  // Sometimes it's on same line: ### Idea title: Foo
  const inline = issueBody.match(/^###\s*Idea title\s*: ?\s*(.+)$/im);
  if (inline?.[1]?.trim()) return inline[1].trim();

  return null;
}

function getDisplayTitle(issue) {
  return extractIdeaTitleFromBody(issue.body) ?? issue.title;
}

function sanitizeIssueBodyForMdx(rawBody) {
  if (!rawBody) return '';

  const lines = rawBody.replace(/\r\n/g, '\n').split('\n');

  // 1) Convert GitHub-issue pseudo fences like:
  // `json
  // { ... }
  // `
  // into proper fenced code blocks.
  // Also handles:
  // `
  // filename.yml
  // `
  let inFence = false;
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const triple = line.match(/^\s*```/);
    if (triple) {
      inFence = !inFence;
      out.push(line);
      continue;
    }

    if (!inFence) {
      const open = line.match(/^\s*`\s*([A-Za-z0-9_-]+)?\s*$/);
      if (open) {
        const lang = open[1] ? open[1] : '';
        // find closing line that is just a backtick
        let foundClose = -1;
        for (let j = i + 1; j < lines.length; j++) {
          const maybe = lines[j];
          if (/^\s*```/.test(maybe)) break; // don't cross real fences
          if (/^\s*`\s*$/.test(maybe)) {
            foundClose = j;
            break;
          }
        }
        if (foundClose !== -1) {
          out.push(`\`\`\`${lang}`.trimEnd());
          for (let k = i + 1; k < foundClose; k++) {
            out.push(lines[k]);
          }
          out.push('```');
          i = foundClose;
          continue;
        }
      }
    }

    out.push(line);
  }

  // 2) Escape MDX-troublesome sequences outside of fenced code blocks.
  const sanitized = [];
  inFence = false;
  const allowedTags = new Set([
    'details',
    'summary',
    'br',
    'kbd',
    'sub',
    'sup',
    'code',
    'pre',
  ]);

  function escapeAngleBracketToken(token) {
    const inner = token.slice(1, -1).trim();
    if (!inner) return token;

    // Keep URL/email autolinks.
    if (/^(https?:\/\/|mailto:)/i.test(inner)) return token;

    // Allow a small set of common HTML tags (optionally self-closing or closing tags).
    const m = inner.match(/^\/?([A-Za-z][A-Za-z0-9-]*)\s*\/?$/);
    if (m && allowedTags.has(m[1].toLowerCase())) return token;

    // Everything else is safer escaped to avoid MDX JSX parsing.
    return `&lt;${inner}&gt;`;
  }

  for (const line of out) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      sanitized.push(line);
      continue;
    }

    if (inFence) {
      sanitized.push(line);
      continue;
    }

    let s = line;

    // Escape angle-bracket placeholders like <org>, <repo>, <host>, <version>, <...>
    // which MDX would otherwise treat as JSX.
    s = s.replace(/<[^>\n]+>/g, (token) => escapeAngleBracketToken(token));

    // Escape braces that can start MDX expressions.
    s = s.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');

    sanitized.push(s);
  }

  return sanitized.join('\n');
}

async function ghJson(url, token) {
  const headers = {
    'User-Agent': 'winccoa-tools-pack-site',
    'Accept': 'application/vnd.github+json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GitHub API error ${res.status} for ${url}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

async function fetchAllFeatureIssues({ token }) {
  const results = [];
  const perPage = 100;

  // GitHub Search API supports issue-type filter.
  // Example: repo:owner/repo is:issue type:"Feature"
  const baseQ = `repo:${OWNER}/${REPO} is:issue type:\"${ISSUE_TYPE}\"`;

  for (let page = 1; page <= 10; page++) {
    const url = `https://api.github.com/search/issues?q=${encodeURIComponent(baseQ)}&per_page=${perPage}&page=${page}`;
    const data = await ghJson(url, token);
    const items = Array.isArray(data.items) ? data.items : [];
    results.push(...items);
    if (items.length < perPage) break;
  }

  // Filter out PRs just in case (Search issues can return PRs).
  return results.filter((i) => !i.pull_request);
}

function issuePagePath(issueNumber, ideaTitle) {
  const slug = slugify(ideaTitle);
  return path.join(OUTPUT_IDEAS_DIR, `${String(issueNumber).padStart(3, '0')}-${slug}.md`);
}

function renderIndex({ issues }) {
  const updated = new Date().toISOString().replace('T', ' ').replace(/\..+/, '') + ' UTC';

  const rows = issues
    .slice()
    .sort((a, b) => a.number - b.number)
    .map((issue) => {
      const issueTitle = issue.title;
      const ideaTitle = extractIdeaTitleFromBody(issue.body);
      const displayTitle = ideaTitle ?? issueTitle;

      const pageSlug = path.basename(issuePagePath(issue.number, displayTitle), '.md');
      const routeSlug = pageSlug.replace(/^\d+-/, '');
      const pageTo = `/docs/vision/ideas/${routeSlug}`;

      const done = issue.state === 'closed';
      const status = done
        ? '<span className="visionBadge visionBadge--done">done</span>'
        : '<span className="visionBadge visionBadge--open">open</span>';

      const labels = Array.isArray(issue.labels)
        ? issue.labels
            .map((l) => (typeof l === 'string' ? l : l?.name))
            .filter(Boolean)
            .map((name) => `<span className="visionLabel">${escapeMdxText(String(name))}</span>`)
            .join('')
        : '';

      const meta = `<div className="visionMeta">#${issue.number} ${status}${labels ? `<span className="visionLabels">${labels}</span>` : ''}</div>`;

      const ideaBlock = ideaTitle
        ? `<hr className="visionHr" />\
    <div className="visionIdea">${escapeMdxText(ideaTitle)}</div>`
        : '';

      return `\
<li className="visionItem">\
  <Link className="visionLink" to={"${pageTo}"}>\
    <div className="visionTitle">${escapeMdxText(issueTitle)}</div>\
    ${ideaBlock}\
    ${meta}\
  </Link>\
</li>`;
    })
    .join('\n');

  return `---
title: Vision
description: Why we do this, what we do, and what we don’t.
---

import Link from '@docusaurus/Link';

# 🚀 Project Vision
## How it started, how it grows, and where we want to go

## 🌱 How It Started
The winccoa-tools-pack project began with a simple observation shared by many WinCC OA developers and QA engineers:  
**the ecosystem lacked modern tooling, automation, and developer‑friendly workflows**.

Everyday tasks in WinCC OA projects often required:
- manual checks  
- repetitive QA steps  
- ad‑hoc scripting  
- inconsistent workflows  
- custom solutions hidden in team silos  

There was no central place for:
- repeatable CI/CD integrations  
- linting concepts  
- reusable automation blocks  
- standardized project management  
- shared best practices  

The project started as an attempt to explore ideas for better tooling — nothing official, nothing commercial — just a personal wish to improve the daily life of WinCC OA developers.

---

## 🌿 How It Grows
What began as a personal idea has slowly grown into a **collaborative toolkit ecosystem**.

Several topics emerged naturally:
- **CI/CD workflows** for GitHub Actions, Jenkins, and Azure DevOps  
- **Shared pipelines and reusable action blocks**  
- **Quality gates and automated review workflows**  
- **Documentation structures and project templates**  
- Early concepts like **OALint** (a future linting engine)  
- Early ideas like **OAPM** (WinCC OA project management inspired by NPM)  

More people started suggesting improvements, sharing ideas, testing workflows,  
or simply using the patterns in their own projects.  
This diversity of input is now a core part of what makes the ecosystem valuable.

The goal is **not** to build “one big tool,”  
but to provide **many small, reusable components**  
that teams can combine into their own workflows.

---

## 🌳 Where We Want to Go
The direction is clear:  
**Enable modern, automated, reliable WinCC OA development — for everyone.**

The future focus includes:
- Better collaboration tools for developers and QA  
- A standardized rule system for CONTROL code quality (future OALint)  
- A modern, package‑style project management idea (future OAPM)  
- Reusable CI/CD components for all major platforms  
- Developer‑centric DX improvements like VS Code extensions, CLIs, and templates  
- Documentation, examples, and success stories others can learn from  
- A community space where contributions, ideas, and improvements can grow organically  

The long‑term vision is to build an **open toolbox**, not a closed framework —  
a place where WinCC OA developers can pick the tools they need and avoid reinventing the wheel each time.

---

## 🤝 A Collaborative Effort
Even though the project started from a single idea,  
it is continually shaped by the contributions, testing, feedback,  
and creativity of many people.

Every improvement — big or small — helps move the ecosystem forward.

**Thank you to everyone participating, sharing, and building together.  
This project belongs to all of us who want better tools for WinCC OA.**

---

## Roadmap ideas

_Last update: ${updated}_

<ul className="visionList">
${rows}
</ul>

<div className="visionFooter">
  <div>
    Source of truth: <a href="${ISSUES_WEB}?q=type%3A%22Feature%22">GitHub Feature issues</a>
  </div>
</div>
`;
}

function renderIssuePage({ issue }) {
  const ideaTitle = getDisplayTitle(issue);
  const updated = new Date().toISOString().replace('T', ' ').replace(/\..+/, '') + ' UTC';
  const labels = Array.isArray(issue.labels)
    ? issue.labels
        .map((l) => (typeof l === 'string' ? l : l?.name))
        .filter(Boolean)
        .map((name) => `- ${String(name)}`)
        .join('\n')
    : '';

  const state = issue.state === 'closed' ? 'done' : 'open';

  const safeBody = sanitizeIssueBodyForMdx(issue.body);

  return `---
title: ${yamlDoubleQuoted(ideaTitle.replace(/\n/g, ' '))}
description: ${yamlDoubleQuoted(`Vision idea tracked as GitHub issue #${issue.number}.`)}
---

- Status: **${state}**
- GitHub issue: [${OWNER}/${REPO}#${issue.number}](${issue.html_url})
- Last sync: ${updated}
${labels ? `- Labels:\n${labels}\n` : ''}
---

${safeBody || '_No description provided in the issue._'}
`;
}

function cleanupOldIssuePages({ keepFileNames }) {
  if (!fs.existsSync(OUTPUT_IDEAS_DIR)) return;
  const existing = fs
    .readdirSync(OUTPUT_IDEAS_DIR)
    .filter((f) => f.endsWith('.md'));

  for (const file of existing) {
    if (!keepFileNames.has(file)) {
      fs.unlinkSync(path.join(OUTPUT_IDEAS_DIR, file));
    }
  }
}

async function main() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

  ensureDir(OUTPUT_IDEAS_DIR);

  const issues = await fetchAllFeatureIssues({ token });

  const keep = new Set();
  let changed = false;

  for (const issue of issues) {
    const ideaTitle = getDisplayTitle(issue);
    const filePath = issuePagePath(issue.number, ideaTitle);
    keep.add(path.basename(filePath));
    changed = writeFileIfChanged(filePath, renderIssuePage({ issue })) || changed;
  }

  cleanupOldIssuePages({ keepFileNames: keep });

  changed = writeFileIfChanged(INDEX_PATH, renderIndex({ issues })) || changed;

  const summary = {
    issues: issues.length,
    changed,
    index: INDEX_PATH,
    ideasDir: OUTPUT_IDEAS_DIR,
  };
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(summary));
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
