'use strict';

// The popup tabs follow the field order. Each tab owns a selectable list, so
// labels never take cursor positions or consume vertical list room.
function settingsSections(fields) {
  const sections = [];
  let current;
  for (const field of fields) {
    if (!current || current.name !== field.section) {
      current = { name: field.section, fields: [] };
      sections.push(current);
    }
    current.fields.push(field);
  }
  return sections;
}

function nextSection(index, direction, count) {
  return (index + direction + count) % count;
}

// Herdr's settings use left/right as tab navigation too. Keep that decoding
// separate from the editor so it is easy to verify no arrow key changes a
// setting value.
function sectionDirection(key) {
  if (key === '\x1b[C' || key === 'l') return 1;
  if (key === '\x1b[D' || key === 'h') return -1;
  return 0;
}

function sectionWindow(fields, cursor, room, top, scrollTop) {
  const nextTop = scrollTop(fields.length, cursor, room, top);
  return {
    top: nextTop,
    fields: fields.slice(nextTop, nextTop + room),
    hiddenAbove: nextTop,
    hiddenBelow: Math.max(0, fields.length - nextTop - room),
  };
}

module.exports = { settingsSections, nextSection, sectionDirection, sectionWindow };
