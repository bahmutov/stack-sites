'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')
const resolve = require('path').resolve

/* global describe, it */
describe('stack-sites', () => {
  const stackSites = require('.')
  it('is a function', () => {
    la(is.fn(stackSites))
  })

  it('returns list of stack sites', () => {
    const sites = stackSites()
    la(is.array(sites))
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
})
