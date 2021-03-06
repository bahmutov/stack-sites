'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')
const resolve = require('path').resolve
const {find, propEq} = require('ramda')

/* global describe, it */
describe('parsing stack line', () => {
  const parseStackLine = require('./parse-stack-line')
  it('is a function', () => {
    la(is.fn(parseStackLine))
  })

  it('parses line with more parts', () => {
    const line = 'at Test.t [as fn] (/foo/sum.test.js:12:3)'
    const site = parseStackLine(line)
    la(is.object(site), 'could not parse', line)
    la(site.filename === '/foo/sum.test.js', 'incorrect filename', site)
    la(site.line === 12, 'incorrect line', site)
    la(site.column === 3, 'incorrect column', site)
    la(site.functionName === 'Test.t', 'incorrect function name', site)
  })

  it('parses Windows path line', () => {
    const line = '  at stackSites (c:\\node_modules\\src\\index.js:14:3)'
    const site = parseStackLine(line)
    la(site.line === 14, 'invalid line', site)
    la(site.column === 3, 'invalid column', site)
  })
})

describe('stack-sites', () => {
  const stackSites = require('.')
  it('is a function', () => {
    la(is.fn(stackSites))
  })

  it('returns list of stack sites', () => {
    const sites = stackSites()
    la(is.array(sites))
  })

  it('returns at least 2 stacks', () => {
    const sites = stackSites()
    la(sites.length > 2, 'sites', sites)
  })

  it('returns library filename', () => {
    const sites = stackSites()
    const thisSite = sites[0]
    la(is.unemptyString(thisSite.filename), 'missing this site', sites)

    const stackSitesFilename = resolve(__dirname, 'index.js')
    la(thisSite.filename === stackSitesFilename, 'expected this filename',
      stackSitesFilename, 'got', thisSite.filename)
  })

  it('returns spec filename', () => {
    const sites = stackSites()
    const thisSite = sites[1]
    la(is.unemptyString(thisSite.filename), 'missing this site', sites)

    la(thisSite.filename === __filename, 'expected this filename',
      __filename, 'got', thisSite.filename)
  })

  it('has line numbers', () => {
    const sites = stackSites()
    sites.forEach(site => {
      la(is.positive(site.line), 'invalid line number', site)
    })
  })

  it('has column numbers', () => {
    const sites = stackSites()
    sites.forEach(site => {
      la(is.positive(site.column), 'invalid column number', site)
    })
  })

  it('has function names where possible', () => {
    const sites = stackSites()
    const firstTwo = sites.slice(0, 2)
    la(firstTwo.length === 2)
    sites.forEach(site => {
      la(is.unemptyString(site.functionName), 'missing function name', site)
    })
  })

  it('skips internal process module', () => {
    const stack = `
    Error: stack-sites
      at stackSites (/git/node_modules/stack-sites/src/index.js:20:22)
      at snapshot (/git/node_modules/subset-shot/src/index.js:36:17)
      at /git/test/search_entities.js:39:5
      at next (native)
      at fulfilled (/git/test/search_entities.js:4:58)
      at process._tickCallback (internal/process/next_tick.js:103:7)
    `
    const sites = stackSites(stack)
    la(is.not.empty(sites), 'expected sites', sites)
    const tickCallback = find(
      propEq('functionName', 'process._tickCallback'))(sites)
    la(!tickCallback, 'should not have tickCallback site',
      tickCallback, 'in', sites)
  })

  it('handles generator syntax', () => {
    const stack = `
      Error: stack-sites
        at stackSites (/git/node_modules/stack-sites/src/index.js:24:22)
        at snapshot (/git/node_modules/subset-shot/src/index.js:37:17)
        at Test.<anonymous> (/git/test/search_entities.ts:34:3)
        at Generator.next (<anonymous>)
        at step (/git/test/search_entities.js:6:191)
        at /git/test/search_entities.js:6:361
        at process._tickCallback (internal/process/next_tick.js:109:7)
    `
    const sites = stackSites(stack)
    la(is.not.empty(sites), 'expected sites', sites)
    const site = find(propEq('filename', '/git/test/search_entities.ts'))(sites)
    la(site, 'finds TypeScript file', sites)
    la(site.functionName === 'Test.<anonymous>', 'wrong filename', site, sites)
  })

  it('parses Windows stack', () => {
    const stack = `
    Error: stack-sites
      at stackSites (c:\\node_modules\\stack-sites\\src\\index.js:14:13)
      at snapshot (c:\\node_modules\\snap-shot\\src\\index.js:54:17)
      at Context.it (c:\\test\\snap-shot.test.js:6:5)
      at callFn (c:\\node_modules\\mocha\\lib\\runnable.js:345:21)
      at Test.Runnable.run (c:\\node_modules\\mocha\\lib\\runnable.js:337:7)
      at Runner.runTest (c:\\node_modules\\mocha\\lib\\runner.js:444:10)
      at c:\\node_modules\\mocha\\lib\\runner.js:550:12
      at next (c:\\node_modules\\mocha\\lib\\runner.js:361:14)
      at c:\\node_modules\\mocha\\lib\\runner.js:371:7
      at next (c:\\node_modules\\mocha\\lib\\runner.js:295:14)
      at Immediate.<anonymous> (c:\\node_modules\\mocha\\lib\\runner.js:339:5)
      at runCallback (timers.js:666:20)
      at tryOnImmediate (timers.js:639:5)
      at processImmediate [as _immediateCallback] (timers.js:611:5)
    `
    const sites = stackSites(stack)
    la(is.not.empty(sites), 'expected sites', sites)
    const first = sites[0]
    la(first.functionName === 'stackSites', first)
    la(first.line === 14, first)
    la(first.column === 13, first)
  })

  it('skips native lines', () => {
    const stack = `
    Error: example
      at next (native)
      at foo (bar.js:101:42)
    `
    const sites = stackSites(stack)
    la(sites.length === 1, 'wrong number of sites', sites)
    la(sites[0].functionName === 'foo', 'wrong function name', sites)
  })
})
