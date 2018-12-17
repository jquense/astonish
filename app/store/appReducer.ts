import { hoverNode, leaveNode, editorCursorChange } from '../actions'
import { getType as t, ActionType } from 'typesafe-actions'
import { CursorPosition, Range } from '../types'

export interface AppState {
  ast: any
  input: string
  cursor: CursorPosition
  activeRange: Range | null
}

export type AppAction = ActionType<
  typeof hoverNode | typeof leaveNode | typeof editorCursorChange
>

const initial = {
  ast: null,
  input: '',
  activeRange: null,
  cursor: {
    position: null,
    offset: 0,
  },
}

export default (state: AppState = initial, action: AppAction): AppState => {
  switch (action.type) {
    case t(hoverNode):
      return { ...state, activeRange: action.payload.range }
    case t(leaveNode):
      return { ...state, activeRange: null }
    case t(editorCursorChange):
      return { ...state, cursor: action.payload }
  }
  return state
}
