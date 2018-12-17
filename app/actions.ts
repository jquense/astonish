import { createStandardAction as action } from 'typesafe-actions'
import { CursorPosition, PanePosition } from './types'

export const useTransformer = action('USE_TRANSFORMER')<boolean>()

export const movePane = action('MOVE_PANE')<{
  pathTo: string
  pathFrom: string
  position: PanePosition
}>()

export const updateInput = action('UPDATE_INPUT')<{
  value: string
}>()

export const updateAst = action('UPDATE_AST')<{
  ast: any
}>()

export const updateParserOptions = action('UPDATE_PARSER_OPTIONS')<{
  options: {}
}>()

export const hoverNode = action('HOVER_NODE')<{
  range: null | [number, number]
}>()

export const leaveNode = action('LEAVE_NODE')()

export const editorCursorChange = action('EDITOR_CURSOR_CHANGE')<
  CursorPosition
>()
