const fs = require('fs');
const path = require('path');

const GITHUB_USER = 'kapit4n';
const API_BASE = `https://api.github.com`;
const LIMIT = 20;
const DATA_FILE = path.resolve(__dirname, '../public/data/projects-all.json');

async function fetch(url) {
  const res = await fetch(url, {
    headers: { Accept: 'application/vnd.github.v3+json', 'User-Agent': 'l-projects' },
  });
  if (!res.ok) throw new Error(`GitHub API error ${res.status}: ${url}`);
  return res.json();
}

function parseRepo(repo) {
  const {
    name,
    description,
    html_url: dir,
    created_at: startDate,
    updated_at: updatedDate,
    pushed_at,
    language,
    size,
    open_issues_count: openIssues,
    topics,
    homepage,
  } = repo;

  return {
    id: repo.id,
    startDate,
    updatedDate: pushed_at || updatedDate,
    name,
    dir,
    img: homepage || '',
    features: [],
    categories: topics && topics.length ? [topics[0]] : [],
    skills: topics || [],
    contributions: 0,
    description: description || '',
    languageKeys: language ? [language] : [],
    language: language || '',
    size: size || 0,
    openIssues: openIssues || 0,
    languages: {},
  };
}

async function getLanguages(repoName) {
  try {
    return await fetch(`${API_BASE}/repos/${GITHUB_USER}/${repoName}/languages`);
  } catch {
    return {};
  }
}

async function getContributions(repoName) {
  try {
    const data = await fetch(`${API_BASE}/repos/${GITHUB_USER}/${repoName}/contributors`);
    if (Array.isArray(data) && data[0]) return data[0].contributions || 0;
    return 0;
  } catch {
    return 0;
  }
}

async function main() {
  console.log(`Fetching repos for ${GITHUB_USER}...`);

  const repos = await fetch(`${API_BASE}/users/${GITHUB_USER}/repos?per_page=100&sort=updated&direction=desc`);

  const top20 = repos.slice(0, LIMIT);
  console.log(`Got ${repos.length} repos, taking top ${LIMIT} by last updated.\n`);

  const entries = [];
  for (const repo of top20) {
    console.log(`  Processing ${repo.name}...`);
    const entry = parseRepo(repo);

    try {
      entry.languages = await getLanguages(repo.name);
      entry.languageKeys = Object.keys(entry.languages);
      entry.language = entry.languageKeys[0] || entry.language;
    } catch {}

    try {
      entry.contributions = await getContributions(repo.name);
    } catch {}

    entries.push(entry);
  }

  entries.sort((a, b) => new Date(b.updatedDate) - new Date(a.updatedDate));

  const existing = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  const existingMap = new Map();
  existing.forEach((p) => {
    const key = p.name;
    if (!existingMap.has(key) || p.id < existingMap.get(key).id) {
      existingMap.set(key, p);
    }
  });

  let merged = [];
  for (const entry of entries) {
    if (existingMap.has(entry.name)) {
      const old = existingMap.get(entry.name);
      merged.push({ ...old, ...entry, id: old.id });
    } else {
      const maxId = merged.reduce((m, p) => Math.max(m, p.id), 0);
      entry.id = maxId + 1;
      merged.push(entry);
    }
    existingMap.delete(entry.name);
  }

  existingMap.forEach((p) => merged.push(p));

  fs.writeFileSync(DATA_FILE, JSON.stringify(merged, null, 2) + '\n');
  console.log(`\nDone. Updated ${entries.length} projects in projects-all.json.`);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
