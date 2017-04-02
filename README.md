# css-comment-rebase

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

Rebase your CSS assets based on node-sass source comments.

## Installation

```bash
npm install css-comment-rebase
```

## Example

From:
``` css
/* line 2, /path/to/the/scss/source/foo.scss */
.foo {
    background: url(./foo.png);
}
```

To:
``` css
/* line 2, /path/to/the/scss/source/foo.scss */
.foo {
    background: url(/path/to/the/scss/source/foo.png);
}
```

## API

`let Rebaser = require('css-comment-rebase')`

### rebaser = new Rebaser(opts={})

Return an object transform stream `rebaser` that expects entry filenames.

## Events

In addition to the usual events emitted by node.js streams, css-comment-rebase emits the following events:

### rebaser.on('rebase', function(file) {})

Every time an asset is rebased, this event fires with the rebased path.

## Contributing

* Fork the main repository
* Code
* Implement tests using [node-tap](https://github.com/tapjs/node-tap)
* Issue a pull request keeping in mind that all pull requests must reference an issue in the issue queue

## License

Apache-2.0 © [Eric MORAND]()

[npm-image]: https://badge.fury.io/js/css-comment-rebase.svg
[npm-url]: https://npmjs.org/package/css-comment-rebase
[travis-image]: https://travis-ci.org/ericmorand/css-comment-rebase.svg?branch=master
[travis-url]: https://travis-ci.org/ericmorand/css-comment-rebase
[daviddm-image]: https://david-dm.org/ericmorand/css-comment-rebase.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/ericmorand/css-comment-rebase
[coveralls-image]: https://coveralls.io/repos/github/ericmorand/css-comment-rebase/badge.svg
[coveralls-url]: https://coveralls.io/github/ericmorand/css-comment-rebase