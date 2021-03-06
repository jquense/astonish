import { useCallback } from 'react'
import Editor from './Editor'
import { UPDATE_INPUT } from '../ActionTypes'
import { useStoreDispatch, useStoreState } from '../store'
import { updateInput } from '../actions'
import * as React from 'react'
const propTypes = {}

function InputPane() {
  const dispatch = useStoreDispatch()
  const { parser, input } = useStoreState(s => s.parsing)

  const onChange = useCallback(
    async (value: string) => {
      const ast = await parser.parse(value)

      dispatch(updateInput({ ast, value }))
    },
    [parser]
  )

  return <Editor onChange={onChange} defaultValue={input} />
}

InputPane.propTypes = propTypes

export default InputPane
