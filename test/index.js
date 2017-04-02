const Rebaser = require('../src');
const tap = require('tap');
const fs = require('fs');
const path = require('path');
const through = require('through2');
const cleanCSS = require('./lib/clean-css');

tap.test('rebaser', function (test) {
  test.plan(10);

  test.test('should handle valid region syntax', function (test) {
    let rebaser = new Rebaser();

    let regionfixtures = [
      ' line 2, foo/bar.scss '
    ];

    regionfixtures.forEach(function (fixture) {
      test.test('"' + fixture + '"', function (test) {
        let result = rebaser.processCommentNode({
          content: fixture,
          start: {
            line: 99
          }
        });

        test.same(result, {
          path: 'foo/bar.scss',
          start: 99,
          end: null
        });

        test.end();
      });
    });

    test.end();
  });

  test.test('should handle invalid region syntax', function (test) {
    let rebaser = new Rebaser();

    let regionfixtures = [
      'line 2, foo/bar.scss',
      'line 2,foo/bar.scss',
      'line 2 foo/bar.scss'
    ];

    regionfixtures.forEach(function (fixture) {
      test.test('"' + fixture + '"', function (test) {
        let result = rebaser.processCommentNode({
          content: fixture,
          start: {
            line: 99
          }
        });

        test.equal(result, null);

        test.end();
      });
    });

    test.end();
  });

  test.test('should support "base" option', function (test) {
    let rebaser = new Rebaser({
      base: '/foo'
    });

    let file = path.resolve('test/fixtures/option-base/index.css');
    let data = null;

    fs.createReadStream(file)
      .pipe(rebaser)
      .pipe(through(function (chunk, enc, cb) {
        data = chunk.toString();

        cb();
      }))
      .on('finish', function () {
        fs.readFile(path.resolve('test/fixtures/option-base/wanted.css'), function (err, readData) {
          test.equal(cleanCSS(data), cleanCSS(readData.toString()));

          test.end();
        });
      })
      .on('error', function (err) {
          test.fail(err);

          test.end();
        }
      );
  });

  test.test('should handle single-quote uri', function (test) {
    let rebaser = new Rebaser();

    let file = path.resolve('test/fixtures/single-quote.css');
    let data = null;

    fs.createReadStream(file)
      .pipe(rebaser)
      .pipe(through(function (chunk, enc, cb) {
        data = chunk.toString();

        cb();
      }))
      .on('finish', function () {
        fs.readFile(path.resolve('test/fixtures/wanted.css'), function (err, readData) {
          test.equal(cleanCSS(data), cleanCSS(readData.toString()));

          test.end();
        });
      })
      .on('error', function (err) {
          test.fail(err);

          test.end();
        }
      );
  });

  test.test('should handle double-quote uri', function (test) {
    let rebaser = new Rebaser();

    let file = path.resolve('test/fixtures/double-quote.css');
    let data = null;

    fs.createReadStream(file)
      .pipe(rebaser)
      .pipe(through(function (chunk, enc, cb) {
        data = chunk.toString();

        cb();
      }))
      .on('finish', function () {
        fs.readFile(path.resolve('test/fixtures/wanted.css'), function (err, readData) {
          test.equal(cleanCSS(data), cleanCSS(readData.toString()));

          test.end();
        });
      })
      .on('error', function (err) {
          test.fail(err);

          test.end();
        }
      );
  });

  test.test('should handle no-quote uri', function (test) {
    let rebaser = new Rebaser();

    let file = path.resolve('test/fixtures/no-quote.css');
    let data = null;

    fs.createReadStream(file)
      .pipe(rebaser)
      .pipe(through(function (chunk, enc, cb) {
        data = chunk.toString();

        cb();
      }))
      .on('finish', function () {
        fs.readFile(path.resolve('test/fixtures/wanted.css'), function (err, readData) {
          test.equal(cleanCSS(data), cleanCSS(readData.toString()));

          test.end();
        });
      })
      .on('error', function (err) {
          test.fail(err);

          test.end();
        }
      );
  });

  test.test('should handle unsupported comment', function (test) {
    let rebaser = new Rebaser();

    let file = path.resolve('test/fixtures/unsupported-comment.css');
    let data = null;

    fs.createReadStream(file)
      .pipe(rebaser)
      .pipe(through(function (chunk, enc, cb) {
        data = chunk.toString();

        cb();
      }))
      .on('finish', function () {
        fs.readFile(path.resolve('test/fixtures/unsupported-comment.css'), function (err, readData) {
          test.equal(cleanCSS(data), cleanCSS(readData.toString()));

          test.end();
        });
      })
      .on('error', function (err) {
          test.fail(err);

          test.end();
        }
      );
  });

  test.test('should emit "error" event', function (test) {
    let rebaser = new Rebaser();

    let file = path.resolve('test/fixtures/error.css');
    let error = null;

    fs.createReadStream(file)
      .pipe(rebaser)
      .on('finish', function () {
        test.fail();

        test.end();
      })
      .on('error', function (err) {
          test.ok(err);

          test.end();
        }
      );
  });

  test.test('should handle remote and absolute paths', function (test) {
    let rebaser = new Rebaser();

    let file = path.resolve('test/fixtures/remote-and-absolute/index.css');
    let data = null;

    fs.createReadStream(file)
      .pipe(rebaser)
      .pipe(through(function (chunk, enc, cb) {
        data = chunk.toString();

        cb();
      }))
      .on('finish', function () {
        fs.readFile(path.resolve('test/fixtures/remote-and-absolute/wanted.css'), function (err, readData) {
          test.equal(cleanCSS(data), cleanCSS(readData.toString()));

          test.end();
        });
      })
      .on('error', function (err) {
          test.fail(err);

          test.end();
        }
      );
  });

  test.test('should emit "rebase" event', function (test) {
    let rebaser = new Rebaser();

    let file = path.resolve('test/fixtures/double-quote.css');
    let rebased = [];

    fs.createReadStream(file)
      .pipe(rebaser)
      .on('finish', function () {
        test.same(rebased.sort(), [
          'foo/bar',
          'bar/foo'
        ].sort());

        test.end();
      })
      .on('rebase', function (file) {
          rebased.push(file);
        }
      );
  });
});