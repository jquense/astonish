export interface ParserOptions {
  example?: string
  mimetypes?: string[]
  ignoredProperties?: Iterable<string>
  parserOptions: any
}

export interface Node {}

export interface NodeProperties {
  value: Node
  key?: string
  computed: boolean
}

export declare class Parser {
  constructor(opts: ParserOptions)

  static defaultOptions: {}

  mimeTypes?: string[]
  parserOptions: {}

  updateOptions(parserOptions): void

  init(): Promise<void>

  parse(input: string): Promise<any>

  transform(input: string): Promise<string>

  getNodeName(node: Node): string

  propertiesForNode(node: Node): Iterable<NodeProperties>
}

export type Range = [number, number]

export interface CursorPosition {
  position: any | null
  offset: number
}

export type PanePosition = 'right' | 'left' | 'bottom' | 'top' | 'full'

export enum Language {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
}
