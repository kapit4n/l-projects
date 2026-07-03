const fs = require('fs');
const path = require('path');

const BACKEND_API = 'http://localhost:8000';
const GI_DIR = path.resolve(__dirname, '../..');
const DATA_FILE = path.resolve(__dirname, '../public/data/projects-all.json');

const EXCLUDE = ['.logs', '.git'];

const existing = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
const existingNames = new Set(existing.map((p) => p.name));

const giDirs = fs.readdirSync(GI_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !EXCLUDE.includes(d.name))
  .map((d) => d.name);

const missing = giDirs.filter((name) => !existingNames.has(name));

if (missing.length === 0) {
  console.log('All gi projects are already registered.');
  process.exit(0);
}

console.log(`Missing projects (${missing.length}):`);
missing.forEach((m) => console.log(`  - ${m}`));

const newEntries = missing.map((name) => ({
  name,
  startDate: new Date().toISOString(),
  updatedDate: new Date().toISOString(),
  dir: `https://github.com/kapit4n/${name}`,
  img: '',
  features: [],
  categories: [],
  skills: [],
  contributions: 0,
  description: '',
  languageKeys: [],
  language: '',
  size: 0,
  openIssues: 0,
  languages: {},
}));

(async () => {
  console.log(`\nSending ${newEntries.length} missing projects to backend at ${BACKEND_API}/projects/batch ...`);
  const res = await fetch(`${BACKEND_API}/projects/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newEntries),
  });

  if (!res.ok) {
    throw new Error(`Backend API error ${res.status}: ${await res.text()}`);
  }

  const results = await res.json();
  const created = results.filter(r => r.action === 'created').length;

  console.log(`\nAdded ${created} projects to the database.`);
})().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
