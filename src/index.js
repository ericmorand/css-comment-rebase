const fs = require('fs');
const path = require('path');
const unquote = require('unquote');
const Transform = require('stream').Transform;
const Url = require('url');

class Rebaser extends Transform {
  constructor(options) {
    options = options || {};

    super(options);

    this.regionRegex = /^(?:\s)line(?:\s)(?:\S+),(?:\s)(\S+)(?:\s)$/;
  }

  /**
   *
   * @param {{content: String, start: {line: Number}}} node
   */
  processCommentNode(node) {
    let regionResult = this.regionRegex.exec(node.content);

    if (regionResult) {
      let path = regionResult[1];

      return {
        path: path,
        start: node.start.line,
        end: null
      };
    }

    return null;
  }

  _transform(chunk, encoding, callback) {
    try {
      let self = this;

      let parseTree = require('gonzales-pe').parse(chunk.toString(), {
        syntax: 'css'
      });

      let currentRegion = null;
      let regions = [];

      parseTree.traverseByType('multilineComment', function (node) {
        let region = self.processCommentNode(node);

        if (region) {
          if (currentRegion) {
            currentRegion.end = region.start;
          }

          currentRegion = region;

          regions.push(currentRegion);
        }
      });

      parseTree.traverseByType('uri', function (node) {
        let nodeRegion = regions.find(function(region) {
          return (!region.end || (region.start <= node.start.line) && (region.end >= node.start.line));
        });

        if (nodeRegion) {
          let contentNode = node.first('string');

          if (!contentNode) {
            contentNode = node.first('raw');
          }

          let contentNodeContent = unquote(contentNode.content);

          let url = Url.parse(contentNodeContent);

          if (!url.host && !path.isAbsolute(contentNodeContent)) {
            contentNode.content = path.join(path.dirname(nodeRegion.path), unquote(contentNode.content));

            self.emit('rebase', contentNode.content);
          }
        }
      });

      self.push(parseTree.toString());

      callback();
    }
    catch (err) {
      callback(err);
    }
  }
}

module.exports = Rebaser;