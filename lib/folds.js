'use strict';

// Which groups are folded in the Agents panel: a folded group shows its own
// header and hides every workspace hanging under it (lib/frame.js). Kept on
// disk so a fold survives a daemon restart, and in stateRoot so the daemon's
// directory watcher repaints the moment a key flips one.

const fs = require('node:fs');
const path = require('node:path');

const { stateRoot, ensureDir } = require('./paths');

const FILE_NAME = 'folded-groups';
const FILE = () => path.join(stateRoot, FILE_NAME);

// The folded top-level workspace ids. A missing or unreadable file is no folds.
function read() {
  try {
    return new Set(
      fs
        .readFileSync(FILE(), 'utf8')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
    );
  } catch {
    return new Set();
  }
}

function write(folded) {
  ensureDir(stateRoot);
  fs.writeFileSync(FILE(), [...folded].sort().join('\n'), 'utf8');
}

// Folds `workspaceId` when it is open and opens it when it is folded. Returns
// whether it is folded afterwards.
function toggle(workspaceId) {
  const folded = read();
  if (folded.has(workspaceId)) folded.delete(workspaceId);
  else folded.add(workspaceId);
  write(folded);
  return folded.has(workspaceId);
}

// Keeps only the ids still open, so a closed workspace's fold does not
// resurface on a later workspace that happens to reuse its id.
function prune(openIds) {
  const folded = read();
  const kept = new Set([...folded].filter((id) => openIds.has(id)));
  if (kept.size !== folded.size) write(kept);
  return kept;
}

module.exports = { FILE_NAME, read, toggle, prune };
