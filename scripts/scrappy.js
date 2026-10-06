#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const GITHUB_USER = 'kapit4n';

const USAGE = `
Usage:
  node scripts/scrappy.js generate <project-name> [options]   Scaffold contract files
  node scripts/scrappy.js scrape <project-name|dir> [options]  Discover existing contract files

Options:
  --dir <path>      Project directory (default: ../<project-name> relative to scripts/)
  --area <name>     Feature area to scaffold (default: dashboard). Use "all" for multiple areas.
  --help            Show this help

Examples:
  node scripts/scrappy.js generate l-projects
  node scripts/scrappy.js generate l-projects --area dashboard --area details
  node scripts/scrappy.js scrape l-projects --dir ../l-projects
  node scripts/scrappy.js scrape ../some-project
`.trim();

// ─── Helpers ────────────────────────────────────────────────────────────────

function resolveDir(projectName, flagDir) {
  if (flagDir) return path.resolve(flagDir);
  const defaultPath = path.resolve(__dirname, '..', projectName);
  return fs.existsSync(defaultPath) ? defaultPath : null;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`  ✓ ${path.relative(process.cwd(), filePath)}`);
}

function prettifyName(name) {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function placeholderPng(filePath) {
  ensureDir(path.dirname(filePath));
  // Minimal 1x1 transparent PNG
  const MINI_PNG = Buffer.from([
    0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A,0x00,0x00,0x00,0x0D,0x49,0x48,0x44,0x52,
    0x00,0x00,0x00,0x01,0x00,0x00,0x00,0x01,0x08,0x06,0x00,0x00,0x00,0x1F,0x15,0xC4,
    0x89,0x00,0x00,0x00,0x0A,0x49,0x44,0x41,0x54,0x78,0x9C,0x62,0x00,0x00,0x00,0x02,
    0x00,0x01,0x48,0xAF,0xA8,0x9B,0x00,0x00,0x00,0x00,0x49,0x45,0x4E,0x44,0xAE,0x42,
    0x60,0x82
  ]);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, MINI_PNG);
    console.log(`  ✓ ${path.relative(process.cwd(), filePath)} (placeholder)`);
  }
}

// ─── Templates ──────────────────────────────────────────────────────────────

function screenshotMd(projectName, area) {
  return `# ${prettifyName(area)}

The primary ${area} view. This section describes the main interface and interactions.

**Key capabilities:**
- Overview of ${area} functionality
- Primary user interactions and workflows
- Data visualization and feedback mechanisms
- Responsive layout considerations
`;
}

function architectureMd(projectName) {
  return `# Architecture & Technology Stack

## Overview
${prettifyName(projectName)} is a software project. [2-3 sentences describing the project's purpose and high-level architecture.]

## System Architecture
\`\`\`
┌────────────┐     ┌────────────┐     ┌────────────┐
│   Client   │────►│   Server   │────►│  Database  │
│  (Frontend)│     │  (Backend)  │     │            │
└────────────┘     └─────┬──────┘     └────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │  External    │
                  │  Services    │
                  └──────────────┘
\`\`\`

## Technology Stack
| Layer | Technology |
|---|---|
| Frontend |  |
| Backend |  |
| Database |  |
| Testing |  |
| DevOps |  |

## Data Flow
[Describe how data moves through the system — from client request to database and back.]

## Installation / Setup
\`\`\`bash
# Clone the repository
git clone https://github.com/${GITHUB_USER}/${projectName}.git
cd ${projectName}

# Install dependencies
# ...

# Run the project
# ...
\`\`\`

## Deployment
[Describe deployment process, hosting platform, and any infrastructure requirements.]
`;
}

function docTemplate(projectName, docName) {
  return `# ${prettifyName(docName)}

## Overview
This document describes ${docName} for ${projectName}.

## Details
Add detailed content here.

## Usage
\`\`\`
# Example usage or configuration
\`\`\`

## Notes
- Point one
- Point two
- Point three
`;
}

// ─── Generate ───────────────────────────────────────────────────────────────

function generate(projectName, options) {
  const targetDir = options.dir || path.resolve(process.cwd(), projectName);
  console.log(`\nGenerating contract scaffolding for "${projectName}" → ${targetDir}\n`);

  // 1. Screenshot
  placeholderPng(path.join(targetDir, 'mockups', 'screenshots', 'main.png'));

  // 2. Feature mockups
  const areas = options.areas && options.areas.length
    ? options.areas
    : ['dashboard'];

  for (const area of areas) {
    const areaDir = path.join(targetDir, 'mockups', 'features', area);
    writeFile(path.join(areaDir, 'main.md'), screenshotMd(projectName, area));
    placeholderPng(path.join(areaDir, 'main.png'));
  }

  // 3. Architecture doc
  writeFile(path.join(targetDir, 'ARCHITECTURE.md'), architectureMd(projectName));

  // 4. Documentation files (required: markdown + PDF)
  const docDir = path.join(targetDir, 'docs');
  const defaultDocs = ['getting-started', 'api-reference', 'deployment'];
  for (const doc of defaultDocs) {
    writeFile(path.join(docDir, `${doc}.md`), docTemplate(projectName, doc));
  }

  // 5. Video demo (optional — uncomment or create manually)
  const videoPath = path.join(docDir, 'demo.mp4');
  console.log(`  ~ ${path.relative(process.cwd(), videoPath)} (skipped — optional, add a demo video if available)`);

  // 6. README placeholder hint
  const readmePath = path.join(targetDir, 'README.md');
  if (!fs.existsSync(readmePath)) {
    console.log(`  ~ ${path.relative(process.cwd(), readmePath)} (skipped — create manually)`);
  }

  console.log(`\nDone. Contract scaffolding created in ${targetDir}`);
}

// ─── Scrape ─────────────────────────────────────────────────────────────────

function scrape(targetDir) {
  console.log(`\nScraping contract files in ${targetDir}\n`);

  const absDir = path.resolve(targetDir);
  if (!fs.existsSync(absDir)) {
    console.error(`✗ Directory not found: ${absDir}`);
    process.exit(1);
  }

  const EXCLUDED_DIRS = new Set(['node_modules', '.git', '__pycache__', 'build', 'dist', '.next']);
  const EXCLUDED_FILES = new Set([
    'README.md', 'ARCHITECTURE.md', 'LICENSE.md', 'LICENSE',
    'CONTRIBUTING.md', 'CHANGELOG.md', 'package-lock.json', 'yarn.lock'
  ]);
  const DOC_EXTENSIONS = new Set(['.md', '.mdx', '.rst', '.pdf', '.mp4', '.webm', '.mov']);

  const findings = {
    screenshots: [],
    features: [],
    architecture: null,
    documents: [],
    issues: [],
  };

  function walk(dir, relativePath) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch { return; }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = relativePath ? path.join(relativePath, entry.name) : entry.name;

      if (entry.isDirectory()) {
        if (!EXCLUDED_DIRS.has(entry.name)) {
          walk(fullPath, relPath);
        }
        continue;
      }

      const ext = path.extname(entry.name).toLowerCase();
      const baseName = entry.name.toLowerCase();

      // Screenshots
      const isImage = ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext);
      if (
        (baseName.startsWith('screenshot') && isImage) ||
        (relPath.startsWith('mockups/screenshots') && isImage)
      ) {
        findings.screenshots.push(relPath);
        continue;
      }

      // Architecture
      const archCandidates = ['ARCHITECTURE.md', 'docs/architecture.md', 'docs/ARCHITECTURE.md', 'ARCHITECTURE.txt'];
      if (archCandidates.includes(relPath.replace(/\\/g, '/'))) {
        findings.architecture = relPath;
        continue;
      }

      // Feature mockups
      if (relPath.startsWith('mockups/features/') && ext === '.md') {
        const pngPath = relPath.replace(/\.md$/, '.png');
        const fullPng = path.join(absDir, pngPath);
        findings.features.push({
          md: relPath,
          png: fs.existsSync(fullPng) ? pngPath : null,
          hasPair: fs.existsSync(fullPng),
        });
        continue;
      }

      // Documents
      if (DOC_EXTENSIONS.has(ext)) {
        if (EXCLUDED_FILES.has(entry.name)) continue;
        const parentDir = relativePath ? relativePath.split(path.sep)[0] : '';
        if (parentDir === '.' || parentDir === '' || parentDir === 'docs' || parentDir === 'guides') {
          findings.documents.push(relPath);
        }
        continue;
      }
    }
  }

  walk(absDir, '');

  // ─── Report ──────────────────────────────────────────────────────────────

  console.log('─── Scrape Report ───\n');

  // Screenshots
  console.log(`Screenshots (${findings.screenshots.length})`);
  if (findings.screenshots.length === 0) {
    console.log('  ✗ No screenshot found — add mockups/screenshots/main.png or screenshot.png');
  } else {
    for (const s of findings.screenshots) {
      console.log(`  ✓ ${s}`);
    }
  }
  console.log();

  // Architecture
  console.log(`Architecture (${findings.architecture ? 1 : 0})`);
  if (findings.architecture) {
    console.log(`  ✓ ${findings.architecture}`);
  } else {
    console.log('  ✗ No architecture document — add ARCHITECTURE.md or docs/architecture.md');
  }
  console.log();

  // Feature mockups
  const grouped = {};
  for (const f of findings.features) {
    const areaMatch = f.md.match(/mockups\/features\/([^/]+)/);
    const area = areaMatch ? areaMatch[1] : 'unknown';
    if (!grouped[area]) grouped[area] = [];
    grouped[area].push(f);
  }

  console.log(`Feature Mockups (${findings.features.length} files in ${Object.keys(grouped).length} groups)`);
  if (findings.features.length === 0) {
    console.log('  ✗ No feature mockups — add mockups/features/<area>/main.md + main.png');
  } else {
    for (const [area, files] of Object.entries(grouped)) {
      const unpaired = files.filter(f => !f.hasPair);
      const ok = files.filter(f => f.hasPair);
      if (ok.length) console.log(`  ✓ ${area}: ${ok.length} paired`);
      if (unpaired.length) {
        for (const f of unpaired) {
          console.log(`  ✗ ${f.md} has no matching .png`);
          findings.issues.push(`Missing pair: ${f.md}`);
        }
      }
    }
  }
  console.log();

  // Documents (required: text + PDF / optional: video)
  const textDocs = [];
  const videoDocs = [];
  for (const d of findings.documents) {
    const ext = path.extname(d).toLowerCase();
    if (['.mp4', '.webm', '.mov'].includes(ext)) {
      videoDocs.push(d);
    } else {
      textDocs.push(d);
    }
  }

  console.log(`Documents — Text & PDF (${textDocs.length}) [Required]`);
  if (textDocs.length === 0) {
    console.log('  ✗ No text documents or PDFs — add .md, .mdx, .rst, or .pdf files under docs/');
  } else {
    for (const d of textDocs) {
      console.log(`  ✓ ${d}`);
    }
  }
  console.log(`Documents — Video (${videoDocs.length}) [Optional]`);
  if (videoDocs.length > 0) {
    for (const d of videoDocs) {
      console.log(`  ✓ ${d}`);
    }
  } else {
    console.log('  ~ No videos found (optional — add .mp4/.webm/.mov demos if desired)');
  }
  console.log();

  // README
  const hasReadme = fs.existsSync(path.join(absDir, 'README.md'));
  console.log(`README: ${hasReadme ? '✓' : '✗'} ${hasReadme ? 'README.md found' : 'README.md missing'}`);
  console.log();

  // Summary — only required items count toward score
  const score = [
    findings.screenshots.length > 0,
    !!findings.architecture,
    findings.features.filter(f => f.hasPair).length > 0,
    textDocs.length > 0,
    hasReadme,
  ].filter(Boolean).length;

  const total = 5;
  console.log(`Contract Compliance: ${score}/${total} (${Math.round(score / total * 100)}%)`);
  console.log(`  Required: screenshots, architecture, feature mockups (paired), text docs/PDFs, README`);
  console.log(`  Optional (not scored): video demos`);
  if (findings.issues.length) {
    console.log(`\nIssues to fix (${findings.issues.length}):`);
    for (const issue of findings.issues) {
      console.log(`  • ${issue}`);
    }
  }
  console.log();
}

// ─── CLI ────────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.length === 0) {
    console.log(USAGE);
    process.exit(0);
  }

  const mode = args[0];
  const projectName = args[1];
  if (!projectName) {
    console.error('Error: project name is required\n');
    console.log(USAGE);
    process.exit(1);
  }

  const options = { areas: [] };
  for (let i = 2; i < args.length; i++) {
    if (args[i] === '--dir' && args[i + 1]) {
      options.dir = args[++i];
    } else if (args[i] === '--area' && args[i + 1]) {
      options.areas.push(args[++i]);
    }
  }

  return { mode, projectName, options };
}

function main() {
  const { mode, projectName, options } = parseArgs();

  switch (mode) {
    case 'generate': {
      const targetDir = options.dir || path.resolve(process.cwd(), projectName);
      if (!options.dir) {
        const rel = path.relative(process.cwd(), targetDir);
        console.log(`Target directory: ${rel}`);
      }
      generate(projectName, { ...options, dir: targetDir });
      break;
    }

    case 'scrape': {
      const targetDir = options.dir || projectName;
      const absDir = path.resolve(targetDir);
      // If the argument looks like a project name, try to resolve it
      if (!options.dir && !fs.existsSync(absDir)) {
        const resolved = resolveDir(projectName, null);
        if (resolved) {
          scrape(resolved);
        } else {
          console.error(`✗ Cannot find directory for "${projectName}"`);
          console.error(`  Provide --dir <path> or run from the parent of ${projectName}/`);
          process.exit(1);
        }
      } else {
        scrape(absDir);
      }
      break;
    }

    default:
      console.error(`Unknown mode: ${mode}`);
      console.log(USAGE);
      process.exit(1);
  }
}

main();
