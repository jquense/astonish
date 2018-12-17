const { stripIndent } = require('common-tags')
const { entries, map, filter } = require('iter-tools')

export interface ParserOptions {
  example?: string
  mimeTypes?: string[]
  ignoredProperties?: Iterable<string>
  parserOptions?: {}
}

export interface NodeProperties {
  value: Node
  key?: string
  computed: boolean
}

class Parser<TNodeType = any> {
  example: string
  parserOptions?: {}

  private mimeTypes?: string[]
  private ignoredProperties: Set<string>

  constructor({
    parserOptions,
    mimeTypes,
    example,
    ignoredProperties,
  }: ParserOptions = {}) {
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

  updateOptions(nextOptions: {}) {
    this.parserOptions = nextOptions
  }

  getNodeName(node: any) {
    switch (typeof node.type) {
      case 'string':
        return node.type
      case 'object':
        return `Token (${node.type.label})`
    }
  }

  *propertiesForNode(node: TNodeType | TNodeType[]): Iterable<NodeProperties> {
    const isArray = Array.isArray(node)

    for (let [key, value] of entries(node)) {
      if (this.ignoredProperties.has(key)) continue
      yield { value, key: isArray ? undefined : key, computed: false }
    }
  }
}

module.exports = Parser
