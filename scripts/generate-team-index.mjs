import fs from 'node:fs/promises';
import path from 'node:path';

function parseFrontMatterTitleAndRole(raw) {
  const fmMatch = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!fmMatch) return {title: null, role: null};

  const fm = fmMatch[1];
  const title = fm.match(/^title:\s*(.+)\s*$/m)?.[1]?.trim() ?? null;
  const role = fm.match(/^role:\s*(.+)\s*$/m)?.[1]?.trim() ?? null;
  return {
    title: title?.replace(/^"|"$/g, '') ?? null,
    role: role?.replace(/^"|"$/g, '') ?? null,
  };
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const peopleDir = path.join('docs', 'team', 'people');
  const hasDir = await fileExists(peopleDir);
  const files = hasDir
    ? (await fs.readdir(peopleDir)).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    : [];

  const people = [];
  for (const fileName of files) {
    const filePath = path.join(peopleDir, fileName);
    const raw = await fs.readFile(filePath, 'utf8');
    const fm = parseFrontMatterTitleAndRole(raw);
    const fallbackTitle = fileName.replace(/\.(md|mdx)$/i, '').replace(/[-_]/g, ' ');
    people.push({
      title: fm.title || fallbackTitle,
      role: fm.role || '',
      relPath: './people/' + fileName,
    });
  }

  people.sort((a, b) => a.title.localeCompare(b.title));

  const list = people.length
    ? people.map((p) => `- ${p.relPath}${p.role ? ' — ' + p.role : ''}`).join('\n')
    : '_No profiles yet. Add one under `docs/team/people/`._';

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
    list,
    '',
    '> Want to be featured? Add your profile to `docs/team/people/` and open a PR.',
    '',
  ].join('\n');

  const outDir = path.join('docs', 'team');
  await fs.mkdir(outDir, {recursive: true});
  const outFile = path.join(outDir, 'index.md');
  await fs.writeFile(outFile, out, 'utf8');

  // eslint-disable-next-line no-console
  console.log(JSON.stringify({people: people.length, outFile}));
}

await main();
