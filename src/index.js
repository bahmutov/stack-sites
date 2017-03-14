'use strict'

const parseStackLine = require('./parse-stack-line')

function hasLineInfo (line) {
  return line.includes('(') && line.includes(')')
}

function isModule (line) {
  return line.includes('(/') ||
    line.includes(' (') // on Windows: at stackSites (c:\Users...)
}

function stackSites (stack) {
  stack = stack || ((new Error('stack-sites').stack))
  return stack.split('\n')
    .slice(1) // remove exception itself
    .filter(hasLineInfo)
    .filter(isModule)
    .map(parseStackLine)
}

module.exports = stackSites
