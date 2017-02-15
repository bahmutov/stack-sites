'use strict'

const parseStackLine = require('./parse-stack-line')

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
    .map(parseStackLine)
}

module.exports = stackSites
