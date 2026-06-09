/**
 * Documentation generator for steem-js.
 *
 * The `steem.api` and `steem.broadcast` surfaces are generated at runtime from
 * `src/api/methods.js` and `src/broadcast/operations.js`. This script reads the
 * exact same data files and emits an exhaustive Markdown reference, so the docs
 * can never drift from the code.
 *
 * Run with: npm run docs:generate   (which uses babel-node)
 *
 * Optional per-method prose is layered in from YAML overlays in docs/_data so the
 * reference can carry rich descriptions/params/returns without losing completeness.
 */

import fs from 'fs';
import path from 'path';
import methods from '../src/api/methods';
import operations from '../src/broadcast/operations';
import { camelCase } from '../src/utils';

const DOCS_DIR = path.resolve(__dirname, '..', 'docs');
const DATA_DIR = path.join(DOCS_DIR, '_data');
const REFERENCE_DIR = path.join(DOCS_DIR, 'reference');

// --- tiny YAML reader (flat map of name -> { description, params, returns }) ---
// Avoids adding a YAML dependency; supports the limited shape we author by hand.
function loadNotes(file) {
  const full = path.join(DATA_DIR, file);
  if (!fs.existsSync(full)) return {};
  const lines = fs.readFileSync(full, 'utf8').split(/\r?\n/);
  const notes = {};
  let current = null;
  let key = null;
  for (const raw of lines) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    const top = raw.match(/^([A-Za-z0-9_]+):\s*$/);
    if (top) {
      current = {};
      key = top[1];
      notes[key] = current;
      continue;
    }
    const field = raw.match(/^\s{2}(description|params|returns):\s*(.*)$/);
    if (field && current) {
      let val = field[2].trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      current[field[1]] = val;
    }
  }
  return notes;
}

function loadHelpers() {
  // broadcast-helpers.yml: name + signature + description, one block each.
  const full = path.join(DATA_DIR, 'broadcast-helpers.yml');
  if (!fs.existsSync(full)) return [];
  const lines = fs.readFileSync(full, 'utf8').split(/\r?\n/);
  const helpers = [];
  let current = null;
  for (const raw of lines) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    const top = raw.match(/^([A-Za-z0-9_]+):\s*$/);
    if (top) {
      current = { name: top[1] };
      helpers.push(current);
      continue;
    }
    const field = raw.match(/^\s{2}(signature|description):\s*(.*)$/);
    if (field && current) {
      let val = field[2].trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      current[field[1]] = val;
    }
  }
  return helpers;
}

function frontMatter(fields) {
  const body = Object.entries(fields)
    .map(([k, v]) => `${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`)
    .join('\n');
  return `---\n${body}\n---\n\n`;
}

function noteBlock(note) {
  if (!note) return '';
  let out = '';
  if (note.description) out += `${note.description}\n\n`;
  if (note.params) out += `**Parameters:** ${note.params}\n\n`;
  if (note.returns) out += `**Returns:** ${note.returns}\n\n`;
  return out;
}

// Pretty title for an api group key, e.g. database_api -> Database API.
function groupTitle(apiKey) {
  return apiKey
    .replace(/_api$/, '')
    .split('_')
    .map(w => (w === 'rc' ? 'RC' : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ') + ' API';
}

// ---------------------------------------------------------------------------
// API reference
// ---------------------------------------------------------------------------
function generateApi() {
  const notes = loadNotes('api-notes.yml');
  let empty = 0;

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
    `[\`src/api/methods.js\`](https://github.com/blazeapps007/steem-js/blob/master/src/api/methods.js).\n\n`;
  body +=
    `Each method has four call styles, created automatically:\n\n` +
    `| Style | Signature | Notes |\n|---|---|---|\n` +
    `| Positional + callback | \`steem.api.name(...args, cb)\` | classic Node callback |\n` +
    `| Positional + promise | \`steem.api.nameAsync(...args)\` | returns a Promise |\n` +
    `| Options object + callback | \`steem.api.nameWith({ ...opts }, cb)\` | pass params by name |\n` +
    `| Options object + promise | \`steem.api.nameWithAsync({ ...opts })\` | returns a Promise |\n\n` +
    `Methods flagged **(object arg)** take a single object argument instead of positional params.\n\n` +
    `Total methods: **${methods.length}**.\n\n`;

  const groupKeys = Object.keys(groups).sort();
  for (const key of groupKeys) {
    body += `## ${groupTitle(key)}\n\n`;
    body += `<small>RPC namespace: \`${key}\`</small>\n\n`;
    for (const { name, params, m } of groups[key].sort((a, b) =>
      a.name.localeCompare(b.name)
    )) {
      const sig =
        params.length === 0
          ? `steem.api.${name}(callback)`
          : `steem.api.${name}(${params.join(', ')}, callback)`;
      const objFlag = m.is_object ? ' **(object arg)**' : '';
      body += `### ${name}${objFlag}\n\n`;
      body += '```js\n' + sig + '\n```\n\n';
      const note = notes[name];
      if (note) body += noteBlock(note);
      else empty++;
      body += `<small>RPC method: \`${m.method}\`</small>\n\n`;
    }
  }

  fs.writeFileSync(path.join(REFERENCE_DIR, 'api.md'), body);
  return { count: methods.length, empty };
}

// ---------------------------------------------------------------------------
// Broadcast reference
// ---------------------------------------------------------------------------
function generateBroadcast() {
  const notes = loadNotes('broadcast-notes.yml');
  const helpers = loadHelpers();
  let empty = 0;

  let body = frontMatter({
    title: 'Broadcast (steem.broadcast)',
    parent: 'Reference',
    nav_order: 2,
  });

  body += `# Broadcast reference (\`steem.broadcast\`)\n\n`;
  body +=
    `Write operations. These sign a transaction and broadcast it to the network — ` +
    `they cause permanent changes on the blockchain. Generated from ` +
    `[\`src/broadcast/operations.js\`](https://github.com/blazeapps007/steem-js/blob/master/src/broadcast/operations.js).\n\n`;
  body +=
    `Every method accepts a trailing callback **or** returns a Promise if you omit it ` +
    `(an \`Async\` suffix variant also exists for backwards compatibility). The first ` +
    `argument is the signing key (\`wif\`); the **Roles** column lists which key roles can ` +
    `authorize the operation — use a WIF for one of them.\n\n` +
    `Total operations: **${operations.length}** (plus ${helpers.length} auth helpers below).\n\n`;

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
    const roles = (op.roles || []).join(', ') || '—';
    body += `### ${name}\n\n`;
    body += '```js\n' + sig + '\n```\n\n';
    body += `**Roles:** ${roles}\n\n`;
    const note = notes[name];
    if (note) body += noteBlock(note);
    else empty++;
    body += `<small>Operation: \`${op.operation}\`</small>\n\n`;
  }

  if (helpers.length) {
    body += `## Account auth helpers\n\n`;
    body +=
      `Convenience methods (from ` +
      `[\`src/broadcast/helpers.js\`](https://github.com/blazeapps007/steem-js/blob/master/src/broadcast/helpers.js)) ` +
      `that read an account, mutate its authority, and broadcast an \`accountUpdate\` for you. ` +
      `They take a single options object.\n\n`;
    for (const h of helpers) {
      body += `### ${h.name}\n\n`;
      if (h.signature) body += '```js\n' + h.signature + '\n```\n\n';
      if (h.description) body += `${h.description}\n\n`;
    }
  }

  fs.writeFileSync(path.join(REFERENCE_DIR, 'broadcast.md'), body);
  return { count: operations.length, helpers: helpers.length, empty };
}

// ---------------------------------------------------------------------------
function main() {
  if (!fs.existsSync(REFERENCE_DIR)) fs.mkdirSync(REFERENCE_DIR, { recursive: true });

  const api = generateApi();
  const bc = generateBroadcast();

  console.log(`Generated docs/reference/api.md       — ${api.count} methods`);
  console.log(`Generated docs/reference/broadcast.md — ${bc.count} operations + ${bc.helpers} helpers`);
  console.log(
    `Notes coverage: ${api.count - api.empty}/${api.count} api, ` +
      `${bc.count - bc.empty}/${bc.count} broadcast have prose overlays.`
  );

  if (api.count === 0 || bc.count === 0) {
    console.error('ERROR: a reference set came out empty — aborting.');
    process.exit(1);
  }
}

main();
