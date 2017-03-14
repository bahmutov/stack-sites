# stack-sites

[![Greenkeeper badge](https://badges.greenkeeper.io/bahmutov/stack-sites.svg)](https://greenkeeper.io/)

> Returns current stack as call sites

[![NPM][npm-icon] ][npm-url]

[![Build status][ci-image] ][ci-url]
[![semantic-release][semantic-image] ][semantic-url]
[![js-standard-style][standard-image]][standard-url]

## Install

```
npm install -S stack-sites
```

```js
const stackSites = require('stack-sites')
function foo () {
  const sites = stackSites()
  // sites[0] - stackSites itself
  // sites[1] - this file
  // sites[2] - caller to this function
  const caller = sites[2]
  console.log('I got called from %s in %s line %d column %d',
    caller.functionName,
    caller.filename,
    caller.line, caller.column
  )
}
module.exports = foo
```

## Why?

V8 stack API does not return accurate source locations if the source file
has been transpiled on load, see
[Accurate call sites](https://glebbahmutov.com/blog/accurate-call-sites/)
blog post. Exception stack on the other hand can take source maps into
the account, producing correct line and column information.

### Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2017

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://glebbahmutov.com/blog)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/stack-sites/issues) on Github

## MIT License

Copyright (c) 2017 Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[npm-icon]: https://nodei.co/npm/stack-sites.svg?downloads=true
[npm-url]: https://npmjs.org/package/stack-sites
[ci-image]: https://travis-ci.org/bahmutov/stack-sites.svg?branch=master
[ci-url]: https://travis-ci.org/bahmutov/stack-sites
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/
