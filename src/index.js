'use strict'

const debug = require('debug')('stack-sites')
const parseStackLine = require('./parse-stack-line')

function hasLineInfo (line) {
  return line.includes('(') && line.includes(')')
}

function isModule (line) {
  return line.includes('(/') ||
    line.includes(' (') // on Windows: at stackSites (c:\Users...)
}

function isNative (line) {
  return line.includes('(native)')
}

function stackSites (stack) {
  stack = stack || ((new Error('stack-sites').stack))
  debug(stack)
  const parsed = stack.split('\n')
    .slice(1) // remove exception itself
    .filter(hasLineInfo)
    .filter(line => !isNative(line))
    .filter(isModule)
    .map(parseStackLine)
  debug('parsed and cleaned up stack')
  debug(parsed)
  return parsed
}

module.exports = stackSites
