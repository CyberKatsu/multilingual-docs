/**
 * scripts/validate-manifest.mjs
 *
 * Validates translation-manifest.json against the locale list in routing config.
 *
 * Checks:
 *   1. Manifest is valid JSON
 *   2. Every doc entry has a key for every supported locale
 *   3. Every status value is one of the four valid strings
 *   4. Every MDX file in content/[locale]/docs/ has a matching manifest entry
 *
 * Run manually:  node scripts/validate-manifest.mjs
 * Run in CI:     automatically called by .github/workflows/ci.yml
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ─── Load config ──────────────────────────────────────────────────────────────

const VALID_STATUSES = ['complete', 'needs-review', 'machine-translated', 'missing'];

// Read locales directly from routing.ts source — avoids transpiling TS
const routingSource = readFileSync(join(ROOT, 'src/i18n/routing.ts'), 'utf8');
const localesMatch = routingSource.match(/locales:\s*\[([^\]]+)\]/);
if (!localesMatch) {
  console.error('❌  Could not parse locales from src/i18n/routing.ts');
  process.exit(1);
}
const LOCALES = localesMatch[1]
  .split(',')
  .map((s) => s.trim().replace(/['"]/g, ''))
  .filter(Boolean);

// Load and parse manifest
let manifest;
const manifestPath = join(ROOT, 'translation-manifest.json');
try {
  manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
} catch (e) {
  console.error(`❌  translation-manifest.json is not valid JSON: ${e.message}`);
  process.exit(1);
}

// ─── Validation ───────────────────────────────────────────────────────────────

let errors = 0;

function fail(msg) {
  console.error(`  ❌  ${msg}`);
  errors++;
}

// 1. Every manifest entry must have all locales, with a valid status
console.log(`\nChecking manifest entries against locales: [${LOCALES.join(', ')}]\n`);

for (const [docKey, localeMap] of Object.entries(manifest)) {
  for (const locale of LOCALES) {
    if (!(locale in localeMap)) {
      fail(`"${docKey}" is missing locale "${locale}"`);
      continue;
    }
    const entry = localeMap[locale];
    if (!VALID_STATUSES.includes(entry.status)) {
      fail(
        `"${docKey}" > "${locale}" has invalid status "${entry.status}". ` +
          `Must be one of: ${VALID_STATUSES.join(', ')}`
      );
    }
  }
}

// 2. Every MDX file on disk must have a manifest entry
for (const locale of LOCALES) {
  const docsDir = join(ROOT, 'content', locale, 'docs');
  if (!existsSync(docsDir)) continue;

  for (const file of readdirSync(docsDir)) {
    if (!file.endsWith('.mdx')) continue;
    const slug = file.replace(/\.mdx$/, '');
    const key = `docs/${slug}`;
    if (!(key in manifest)) {
      fail(`content/${locale}/docs/${file} exists but "${key}" is not in the manifest`);
    }
  }
}

// 3. Every English doc must have a manifest entry (English is canonical)
const enDocsDir = join(ROOT, 'content', 'en', 'docs');
if (existsSync(enDocsDir)) {
  for (const file of readdirSync(enDocsDir)) {
    if (!file.endsWith('.mdx')) continue;
    const slug = file.replace(/\.mdx$/, '');
    const key = `docs/${slug}`;
    if (!(key in manifest)) {
      fail(`content/en/docs/${file} exists but "${key}" has no manifest entry — add it to translation-manifest.json`);
    }
  }
}

// ─── Result ───────────────────────────────────────────────────────────────────

if (errors === 0) {
  const docCount = Object.keys(manifest).length;
  console.log(`✅  Manifest valid — ${docCount} docs × ${LOCALES.length} locales (${docCount * LOCALES.length} entries)\n`);
  process.exit(0);
} else {
  console.error(`\n❌  ${errors} error${errors === 1 ? '' : 's'} found — fix them before merging\n`);
  process.exit(1);
}
