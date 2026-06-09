/**
 * Documentation generator for steem-js.
 *
 * The `steem.api` and `steem.broadcast` surfaces are generated at runtime from
 * `src/api/methods.js` and `src/broadcast/operations.js`. This script reads the
 * same data files to drive a COMPLETE list (every method/operation, with the
 * correct signature, required roles, and RPC name) and splices in hand-authored
 * Markdown detail for each entry from `docs/_details/`. Coverage can therefore
 * never drift from the code, while the prose stays rich.
 *
 * Detail files (`docs/_details/api.md`, `docs/_details/broadcast.md`) are split
 * into per-entry blocks separated by a line of the form:
 *
 *     === methodName
 *
 * Everything until the next `=== ` line (or EOF) is that entry's Markdown body
 * (free-form: description, a Parameters table, an Example, a Returns block, …).
 *
 * Run with: npm run docs:generate   (uses babel-node)
 */

import fs from 'fs';
import path from 'path';
import methods from '../src/api/methods';
import operations from '../src/broadcast/operations';
import { camelCase } from '../src/utils';

const DOCS_DIR = path.resolve(__dirname, '..', 'docs');
const DETAILS_DIR = path.join(DOCS_DIR, '_details');
const REFERENCE_DIR = path.join(DOCS_DIR, 'reference');

const REPO = 'https://github.com/blazeapps007/steem-js/blob/master';

// Broadcast auth helpers live in src/broadcast/helpers.js, not operations.js.
// They take a single options object; bodies are authored in _details/broadcast.md.
const HELPERS = [
  {
    name: 'addAccountAuth',
    signature:
      "steem.broadcast.addAccountAuth({ signingKey, username, authorizedUsername, role, weight }, cb)",
  },
  {
    name: 'removeAccountAuth',
    signature:
      "steem.broadcast.removeAccountAuth({ signingKey, username, authorizedUsername, role }, cb)",
  },
  {
    name: 'addKeyAuth',
    signature:
      "steem.broadcast.addKeyAuth({ signingKey, username, authorizedKey, role, weight }, cb)",
  },
  {
    name: 'removeKeyAuth',
    signature:
      "steem.broadcast.removeKeyAuth({ signingKey, username, authorizedKey, role }, cb)",
  },
];

// --- parse a details file into { name -> body } -----------------------------
function loadDetails(file) {
  const full = path.join(DETAILS_DIR, file);
  if (!fs.existsSync(full)) return {};
  const text = fs.readFileSync(full, 'utf8');
  const blocks = {};
  let current = null;
  let buf = [];
  const flush = () => {
    if (current) blocks[current] = buf.join('\n').trim();
    buf = [];
  };
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^===\s+([A-Za-z0-9_]+)\s*$/);
    if (m) {
      flush();
      current = m[1];
    } else if (current) {
      buf.push(line);
    }
  }
  flush();
  return blocks;
}

function frontMatter(fields) {
  const body = Object.entries(fields)
    .map(([k, v]) => `${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`)
    .join('\n');
  return `---\n${body}\n---\n\n`;
}

function groupTitle(apiKey) {
  return (
    apiKey
      .replace(/_api$/, '')
      .split('_')
      .map(w => (w === 'rc' ? 'RC' : w.charAt(0).toUpperCase() + w.slice(1)))
      .join(' ') + ' API'
  );
}

// ---------------------------------------------------------------------------
// API reference
// ---------------------------------------------------------------------------
function generateApi() {
  const details = loadDetails('api.md');
  const missing = [];

  const groups = {};
  for (const m of methods) {
    const name = m.method_name || camelCase(m.method);
    const params = m.params || [];
    (groups[m.api] = groups[m.api] || []).push({ name, params, m });
  }

  let body = frontMatter({
    title: 'API (steem.api)',
    parent: 'Reference',
    nav_order: 1,
  });

  body += `# API reference (\`steem.api\`)\n\n`;
  body +=
    `Read calls against a Steem RPC node. Every method below is generated from ` +
    `[\`src/api/methods.js\`](${REPO}/src/api/methods.js).\n\n`;
  body +=
    `All examples assume:\n\n` +
    '```js\n' +
    "import steem from '@steemit/steem-js';\n" +
    "// CommonJS: const steem = require('@steemit/steem-js');\n" +
    '```\n\n';
  body +=
    `Each method has four call styles, created automatically:\n\n` +
    `| Style | Signature | Notes |\n|---|---|---|\n` +
    `| Positional + callback | \`steem.api.name(...args, cb)\` | classic Node callback |\n` +
    `| Positional + promise | \`steem.api.nameAsync(...args)\` | returns a Promise |\n` +
    `| Options object + callback | \`steem.api.nameWith({ ...opts }, cb)\` | pass params by name |\n` +
    `| Options object + promise | \`steem.api.nameWithAsync({ ...opts })\` | returns a Promise |\n\n` +
    `Methods flagged **(object arg)** take a single object argument instead of positional params. ` +
    `Examples below use the callback form; swap in the \`Async\` form for Promises.\n\n` +
    `Total methods: **${methods.length}**.\n\n`;

  for (const key of Object.keys(groups).sort()) {
    body += `## ${groupTitle(key)}\n\n`;
    body += `<small>RPC namespace: \`${key}\`</small>\n\n`;
    for (const { name, params, m } of groups[key].sort((a, b) =>
      a.name.localeCompare(b.name)
    )) {
      const sig =
        params.length === 0
          ? `steem.api.${name}(callback)`
          : `steem.api.${name}(${params.join(', ')}, callback)`;
      body += `### ${name}${m.is_object ? ' **(object arg)**' : ''}\n\n`;
      body += '```js\n' + sig + '\n```\n\n';
      if (details[name]) body += details[name] + '\n\n';
      else missing.push(name);
      body += `<small>RPC method: \`${m.method}\`</small>\n\n`;
    }
  }

  fs.writeFileSync(path.join(REFERENCE_DIR, 'api.md'), body);
  return { count: methods.length, missing };
}

// ---------------------------------------------------------------------------
// Broadcast reference
// ---------------------------------------------------------------------------
function generateBroadcast() {
  const details = loadDetails('broadcast.md');
  const missing = [];

  let body = frontMatter({
    title: 'Broadcast (steem.broadcast)',
    parent: 'Reference',
    nav_order: 2,
  });

  body += `# Broadcast reference (\`steem.broadcast\`)\n\n`;
  body +=
    `Write operations. These sign a transaction and broadcast it to the network — they ` +
    `cause permanent changes on the blockchain. Generated from ` +
    `[\`src/broadcast/operations.js\`](${REPO}/src/broadcast/operations.js).\n\n`;
  body +=
    `All examples assume:\n\n` +
    '```js\n' +
    "import steem from '@steemit/steem-js';\n" +
    "// CommonJS: const steem = require('@steemit/steem-js');\n" +
    '```\n\n';
  body +=
    `Every method accepts a trailing callback **or** returns a Promise if you omit it ` +
    `(an \`Async\` suffix variant also exists). The first argument is the signing key ` +
    `(\`wif\`); the **Roles** line lists which key roles may authorize the operation — pass ` +
    `a WIF for one of them.\n\n` +
    `Total operations: **${operations.length}** (plus ${HELPERS.length} auth helpers at the end).\n\n`;

  body += `## Operations\n\n`;
  for (const op of operations
    .slice()
    .sort((a, b) => camelCase(a.operation).localeCompare(camelCase(b.operation)))) {
    const name = camelCase(op.operation);
    const params = op.params || [];
    const sig =
      params.length === 0
        ? `steem.broadcast.${name}(wif, callback)`
        : `steem.broadcast.${name}(wif, ${params.join(', ')}, callback)`;
    body += `### ${name}\n\n`;
    body += '```js\n' + sig + '\n```\n\n';
    body += `**Roles:** ${(op.roles || []).join(', ') || '—'}\n\n`;
    if (details[name]) body += details[name] + '\n\n';
    else missing.push(name);
    body += `<small>Operation: \`${op.operation}\`</small>\n\n`;
  }

  body += `## Account auth helpers\n\n`;
  body +=
    `Convenience methods (from [\`src/broadcast/helpers.js\`](${REPO}/src/broadcast/helpers.js)) ` +
    `that read an account, mutate one of its authorities, and broadcast an \`accountUpdate\` ` +
    `for you. Each takes a single options object.\n\n`;
  for (const h of HELPERS) {
    body += `### ${h.name}\n\n`;
    body += '```js\n' + h.signature + '\n```\n\n';
    if (details[h.name]) body += details[h.name] + '\n\n';
    else missing.push(h.name);
  }

  fs.writeFileSync(path.join(REFERENCE_DIR, 'broadcast.md'), body);
  return { count: operations.length, helpers: HELPERS.length, missing };
}

// ---------------------------------------------------------------------------
function main() {
  if (!fs.existsSync(REFERENCE_DIR)) fs.mkdirSync(REFERENCE_DIR, { recursive: true });

  const api = generateApi();
  const bc = generateBroadcast();

  console.log(`Generated docs/reference/api.md       — ${api.count} methods`);
  console.log(
    `Generated docs/reference/broadcast.md — ${bc.count} operations + ${bc.helpers} helpers`
  );

  const apiHave = api.count - api.missing.length;
  const bcTotal = bc.count + bc.helpers;
  const bcHave = bcTotal - bc.missing.length;
  console.log(`Detail coverage: ${apiHave}/${api.count} api, ${bcHave}/${bcTotal} broadcast.`);
  if (api.missing.length)
    console.log(`  api missing detail (${api.missing.length}): ${api.missing.join(', ')}`);
  if (bc.missing.length)
    console.log(`  broadcast missing detail (${bc.missing.length}): ${bc.missing.join(', ')}`);

  if (api.count === 0 || bc.count === 0) {
    console.error('ERROR: a reference set came out empty — aborting.');
    process.exit(1);
  }
}

main();
