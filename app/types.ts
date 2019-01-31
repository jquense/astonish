
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
