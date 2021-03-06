const { parseAsync } = require('@babel/core')
const Parser = require('@astonish/ast-parser')
const { stripIndent } = require('common-tags')

const defaultOptions = {
  allowImportExportEverywhere: true,
  allowReturnOutsideFunction: true,
  allowSuperOutsideMethod: true,
  sourceType: 'unambiguous',
  sourceFilename: true,

  plugins: [
    'jsx',
    'doExpressions',
    'objectRestSpread',
    'typescript',
    ['decorators', { decoratorsBeforeExport: true }],
    'classProperties',
    'classPrivateProperties',
    'classPrivateMethods',
    'exportDefaultFrom',
    'exportNamespaceFrom',
    'asyncGenerators',
    'functionBind',
    'functionSent',
    'dynamicImport',
    'numericSeparator',
    'optionalChaining',
    'importMeta',
    'bigInt',
    'optionalCatchBinding',
    'throwExpressions',
    ['pipelineOperator', { proposal: 'minimal' }],
    'nullishCoalescingOperator',
  ],
}

class BabelParser extends Parser {
  constructor(options = defaultOptions) {
    super({
      parserOptions: options,
      mimeTypes: ['text/javascript'],
      example: stripIndent`
      /**
       * Paste or drop some JavaScript here and explore
       * the syntax tree created by chosen parser.
       * You can use all the cool new features from ES6
       * and even more. Enjoy!
       */

      let tips = [
        "Click on any AST node with a '+' to expand it",

        "Hovering over a node highlights the \\
         corresponding part in the source code",

        "Shift click on an AST node expands the whole substree"
      ];

      function printTips() {
        tips.forEach((tip, i) => console.log(\`Tip \${i}:\` + tip));
      }

      `,
    })
  }

  async init() {}

  expandedByDefault(node, key) {
    return (
      node.type === 'File' ||
      node.type === 'Program' ||
      key === 'body' ||
      key === 'elements' || // array literals
      key === 'declarations' || // variable declaration
      key === 'expression' // expression statements
    )
  }

  getNodeName(node) {
    switch (typeof node.type) {
      case 'string':
        return node.type
      case 'object':
        return `Token (${node.type.label})`
    }
  }

  getNodeRange(node) {
    if (typeof node.start === 'number') {
      return [node.start, node.end]
    }
  }

  parse(input) {
    return parseAsync(input, { parserOpts: this.parserOptions })
  }

  async transform() {
    throw new Error('Not implemented')
  }
}

module.exports = new BabelParser()
