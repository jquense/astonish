const { stripIndent } = require('common-tags')
const { entries, map, filter } = require('iter-tools')

class Parser {
  constructor({ parserOptions, mimeTypes, example, ignoredProperties }) {
    this.mimeTypes = mimeTypes
    this.parserOptions = parserOptions
    this.ignoredProperties = new Set(ignoredProperties)

    this.example =
      example ||
      stripIndent`
        function () {
          return 'hi there'
        }
      `
  }
  async init() {
    throw new Error('Not implemented')
  }

  async parse() {
    throw new Error('Not implemented')
  }
  async transform() {
    throw new Error('Not implemented')
  }

  updateOptions(nextOptions) {
    this.parserOptions = nextOptions
  }

  getNodeName(node) {
    switch (typeof node.type) {
      case 'string':
        return node.type
      case 'object':
        return `Token (${node.type.label})`
    }
  }

  *propertiesForNode(node) {
    const isArray = Array.isArray(node)

    for (let [key, value] of entries(node)) {
      if (this.ignoredProperties.has(key)) continue
      yield { value, key: isArray ? undefined : key, computed: false }
    }
  }
}

module.exports = Parser
