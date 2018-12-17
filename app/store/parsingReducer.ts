import { updateInput, updateParserOptions } from '../actions'
import { getType as t, ActionType } from 'typesafe-actions'
import { Parser } from '../types'

export interface ParsingState {
  ast: any
  input: string

  parserModule: string
  parser?: Parser
  options?: {}
}

export type ParsingAction = ActionType<
  typeof updateInput | typeof updateParserOptions
>

const initial = {
  ast: null,
  input: '',
  parserModule: '',
}

export default (state: ParsingState = initial, action: ParsingAction) => {
  switch (action.type) {
    case t(updateInput):
      return { ...state, ...action.payload }
    case t(updateParserOptions):
      return { ...state, options: action.payload.options }
  }
  return state
}
