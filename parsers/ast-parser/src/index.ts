import { stripIndent } from 'common-tags'
import { entries } from 'iter-tools'

export interface ParserOptions {
  example?: string
  mimeTypes?: string[]
  ignoredProperties?: Iterable<string>
  parserOptions?: {}
}

export interface NodeProperties {
  value: any
  key?: string
  computed: boolean
}

export type NodeRange = [number, number]

abstract class Parser<TNodeType = any> {
  example: string
  public parserOptions?: {}

  private ignoredProperties: Set<string>

  constructor({
    parserOptions,
    example,
    ignoredProperties,
  }: ParserOptions = {}) {
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

  abstract init(): Promise<void>

  abstract parse(input: string): Promise<any>

  abstract getNodeName(node: TNodeType): string

  abstract getNodeRange(node: TNodeType | TNodeType[]): NodeRange | null

  expandedByDefault(_node: TNodeType, _key: string): boolean {
    return false
  }

  transform?(input: string): Promise<string>

  updateOptions(nextOptions: {}) {
    this.parserOptions = nextOptions
  }

  *propertiesForNode(node: TNodeType | TNodeType[]): Iterable<NodeProperties> {
    const isArray = Array.isArray(node)

    for (let [key, value] of entries<any>(node as any)) {
      if (this.ignoredProperties.has(key)) continue
      yield { value, key: isArray ? undefined : key, computed: false }
    }
  }
}

export default Parser
