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

function isInternal (line) {
  return line.includes('(internal/')
}

function isAnonymous (line) {
  return line.includes('(<anonymous>)')
}

function stackSites (stack) {
  stack = stack || ((new Error('stack-sites').stack))
  debug(stack)

  try {
    const parsed = stack.split('\n')
      .slice(1) // remove exception itself
      .filter(hasLineInfo)
      .filter(line => !isNative(line))
      .filter(line => !isInternal(line))
      .filter(line => !isAnonymous(line))
      .filter(isModule)
      .map(parseStackLine)
    // maybe limit stack sites to valid existing file?
    debug('parsed and cleaned up stack')
    debug(parsed)
    return parsed
  } catch (e) {
    console.error('Cannot parse stack trace')
    console.error(stack)
    throw e
  }
}

module.exports = stackSites
