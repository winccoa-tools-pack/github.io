import fs from 'node:fs/promises';
import path from 'node:path';

const ORG = 'winccoa-tools-pack';

// NOTE: These are intentionally “example” cookbook entries.
// Repos can be adjusted as they are created/migrated.
const COOKBOOKS = [
  {title: 'WinCC OA CI/CD', repo: 'winccoa-cookbook-ci-cd'},
  {title: 'WinCC OA Node.js', repo: 'winccoa-cookbook-nodejs'},
  {title: 'WinCC OA Linter', repo: 'winccoa-cookbook-linter'},
  {title: 'WinCC OA Project Manager', repo: 'winccoa-cookbook-project-manager'},
  {title: 'WinCC OA in containers', repo: 'winccoa-cookbook-containers'},
  {title: 'Dependency & version management', repo: 'winccoa-cookbook-dependency-version-management'},
];

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function fetchRepoDescription({org, repo, token}) {
  const url = `https://api.github.com/repos/${org}/${repo}`;
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'winccoa-tools-pack.github.io (generate-cookbooks)',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {headers});
  if (!res.ok) {
    return {
      description: null,
      url: `https://github.com/${org}/${repo}`,
      ok: false,
      status: res.status,
    };
  }
  const json = await res.json();
  return {
    description: json.description || null,
    url: json.html_url || `https://github.com/${org}/${repo}`,
    ok: true,
    status: 200,
  };
}

function renderMdx({cards}) {
  const cardHtml = cards
    .map((c) => {
      const desc = c.description
        ? escapeHtml(c.description)
        : c.ok
          ? 'No repository description set yet.'
          : `Repository not available yet (HTTP ${c.status}).`;

      return `  <div className="cookbookCard">
    <h3>${escapeHtml(c.title)}</h3>
    <p className="cookbookDesc">${desc}</p>
    <div className="cookbookLinks">
      <a href="${c.url}">Repository</a>
    </div>
  </div>`;
    })
    .join('\n\n');

  return `---
title: Cookbooks
description: Practical, copy-pasteable recipes for WinCC OA engineering, CI/CD, and tooling.
---

<div className="admonition admonition--info" style={{marginTop: '1rem'}}>
  <div className="admonition-heading"><h5>Work in progress</h5></div>
  <div className="admonition-content">
    <p>
      This page is an early preview. The goal is to host a small set of focused “cookbook” repositories and mirror their content here,
      so it can be browsed and later generated consistently across all cookbooks.
    </p>
    <p>
      Planned approach: each cookbook repo will ship GitHub Pages-compatible markdown, and we’ll provide reusable actions that
      copy/transform the cookbook content into this documentation site.
    </p>
    <p>
      See the initial concept repository: <a href="https://github.com/winccoa-tools-pack/winccoa-cookbook">winccoa-cookbook</a>.
    </p>
  </div>
</div>

<div className="cookbooksGrid">
${cardHtml}
</div>
`;
}

async function main() {
  const token = process.env.GITHUB_TOKEN || '';
  const cards = [];
  for (const cb of COOKBOOKS) {
    const meta = await fetchRepoDescription({org: ORG, repo: cb.repo, token});
    cards.push({...cb, ...meta});
  }

  const outDir = path.join('docs', 'cookbooks');
  await fs.mkdir(outDir, {recursive: true});
  const outFile = path.join(outDir, 'index.mdx');
  await fs.writeFile(outFile, renderMdx({cards}), 'utf8');

  // eslint-disable-next-line no-console
  console.log(JSON.stringify({cookbooks: cards.length, changed: true, outFile}, null, 2));
}

await main();
