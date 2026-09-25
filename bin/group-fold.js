#!/usr/bin/env node
'use strict';

require('../lib/node-version');

// Fold or unfold the Agents-panel group the focused workspace belongs to. A
// member folds its parent's group, so the key works from any row of it.
//
//   node bin/group-fold.js

const herdr = require('../lib/herdr');
const state = require('../lib/state');
const folds = require('../lib/folds');

async function main() {
  const list = await herdr.workspacesAsync();
  const focused = list.find((ws) => ws.focused === true);
  if (!focused) {
    console.log('group fold: no focused workspace');
    process.exitCode = 1;
    return;
  }
  const { parents } = state.worktreeParents(list);
  const top = parents.get(focused.workspace_id) ?? focused.workspace_id;
  const label = list.find((ws) => ws.workspace_id === top)?.label ?? top;
  console.log(`group fold: ${label} ${folds.toggle(top) ? 'folded' : 'unfolded'}`);
}

main();
