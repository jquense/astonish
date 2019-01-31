import * as Actions from './actions'
import { Thunk } from './store'

export const updateInputCode = (input: string): Thunk => async (
  dispatch,
  getState
) => {
  dispatch(Actions.updateInput({ value: input }))

  const { parser } = getState().parsing
  if (parser)
    dispatch(
      Actions.updateAst({
        ast: await parser.parse(input),
      })
    )
}

export const updateParserOptions = (options: {}): Thunk => async (
  dispatch,
  getState
) => {
  dispatch(Actions.updateParserOptions({ options }))

  const { parser, input } = getState().parsing

  if (parser) parser.updateOptions(options)
  dispatch(
    Actions.updateAst({
      ast: await parser.parse(input),
    })
  )
}
