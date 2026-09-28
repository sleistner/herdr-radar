'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { scrollTop } = require('../lib/scroll-window');
const { settingsSections, nextSection, sectionWindow } = require('../lib/settings-sections');
const { FIELDS, SETTINGS_SECTIONS, keyHint, listWindow } = require('../bin/settings');

test('settings sections preserve the requested tab order and every field', () => {
  assert.deepEqual(
    SETTINGS_SECTIONS.map((section) => section.name),
    ['Panel', 'Agent state', 'Groups', 'Rows', 'Appearance'],
  );
  assert.equal(SETTINGS_SECTIONS.flatMap((section) => section.fields).length, FIELDS.length);
});

test('tab navigation wraps in both directions', () => {
  const sectionCount = 5;
  assert.equal(nextSection(sectionCount - 1, 1, sectionCount), 0);
  assert.equal(nextSection(0, -1, sectionCount), sectionCount - 1);
});

test('a tab list scrolls only within its active section', () => {
  const fields = [{ key: 'one' }, { key: 'two' }, { key: 'three' }, { key: 'four' }];
  const visible = sectionWindow(fields, 3, 2, 0, scrollTop);
  assert.deepEqual(
    visible.fields.map((field) => field.key),
    ['three', 'four'],
  );
  assert.equal(visible.hiddenAbove, 2);
  assert.equal(visible.hiddenBelow, 0);
});

test('the popup list receives only the selected tab fields', () => {
  const rows = listWindow(SETTINGS_SECTIONS[2].fields, 4, 3, 0).fields;
  assert.deepEqual(
    rows.map((field) => field.key),
    ['split_corner', 'trim_group_prefix', 'worktree_mark'],
  );
});

test('the full section key hint fits an 84-column popup', () => {
  assert.equal(keyHint(82), '↑↓ select · tab section · ←→ change · ↵ edit · r default · s save & apply · q close');
});
