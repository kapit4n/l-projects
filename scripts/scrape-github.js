const BACKEND_API = 'http://localhost:8000';

const GITHUB_USER = 'kapit4n';
const API_BASE = `https://api.github.com`;
const LIMIT = 20;

async function githubFetch(url) {
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
    name,
    startDate,
    updatedDate: pushed_at || updatedDate,
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
    return await githubFetch(`${API_BASE}/repos/${GITHUB_USER}/${repoName}/languages`);
  } catch {
    return {};
  }
}

async function getContributions(repoName) {
  try {
    const data = await githubFetch(`${API_BASE}/repos/${GITHUB_USER}/${repoName}/contributors`);
    if (Array.isArray(data) && data[0]) return data[0].contributions || 0;
    return 0;
  } catch {
    return 0;
  }
}

async function main() {
  console.log(`Fetching repos for ${GITHUB_USER}...`);

  const repos = await githubFetch(`${API_BASE}/users/${GITHUB_USER}/repos?per_page=100&sort=updated&direction=desc`);

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

  console.log(`\nSending ${entries.length} projects to backend at ${BACKEND_API}/projects/batch ...`);
  const res = await fetch(`${BACKEND_API}/projects/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entries),
  });

  if (!res.ok) {
    throw new Error(`Backend API error ${res.status}: ${await res.text()}`);
  }

  const results = await res.json();
  const updated = results.filter(r => r.action === 'updated').length;
  const created = results.filter(r => r.action === 'created').length;
  console.log(`\nDone. Created ${created}, Updated ${updated} projects in the database.`);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
