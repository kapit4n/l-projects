const fs = require('fs');
const path = require('path');

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

const maxId = existing.reduce((max, p) => Math.max(max, p.id), 0);
let nextId = maxId + 1;

const newEntries = missing.map((name) => ({
  id: nextId++,
  startDate: new Date().toISOString(),
  updatedDate: new Date().toISOString(),
  name,
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

existing.push(...newEntries);

fs.writeFileSync(DATA_FILE, JSON.stringify(existing, null, 2) + '\n');

console.log(`\nAdded ${newEntries.length} projects to projects-all.json`);
