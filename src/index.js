'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')

function isNotEmpty (s) {
  return s
}

// s is like (/src/index.js:4:13)
function parseAt (s) {
  const parts = s.replace(/\(/, '')
    .replace(/\)/, '')
    .trim()
    .split(':')
  la(parts.length === 3, 'invalid number of parts', s)
  return {
    filename: parts[0],
    line: parts[1],
    column: parts[2]
  }
}

function toSite (line) {
  la(is.unemptyString(line), 'invalid line', line)
  const parts = line.split(' ').filter(isNotEmpty)
  const at = parseAt(parts[2])
  return {
    functionName: parts[1],
    filename: at.filename,
    line: Number(at.line),
    column: Number(at.column)
  }
}

function hasLineInfo (line) {
  return line.includes('(') && line.includes(')')
}

function isModule (line) {
  return line.includes('(/')
}

function stackSites () {
  const e = new Error('stack-sites')
  return e.stack.split('\n')
    .slice(1) // remove exception itself
    .filter(hasLineInfo)
    .filter(isModule)
    .map(toSite)
}

module.exports = stackSites
