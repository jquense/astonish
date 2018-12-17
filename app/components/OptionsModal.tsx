import { useRef } from 'react'
import Button from 'react-bootstrap/lib/Button'
import Modal from 'react-bootstrap/lib/Modal'
import { useEditor, UseEditorOptions } from './Editor'
import * as React from 'react'
import { useStoreDispatch, useStoreState } from '../store'
import { updateParserOptions } from '../actions'

interface Props {
  show: boolean
  onHide: () => void
}

function Editor(props: UseEditorOptions) {
  const editorNode = useRef<HTMLDivElement>(null)
  useEditor(editorNode, { ...props, language: 'json' })

  return <div ref={editorNode} style={{ height: '100%' }} />
}

function OptionsModal({ show, onHide }: Props) {
  const options = useStoreState(s => s.parsing.options)

  const dispatch = useStoreDispatch()

  const onChange = (value: string) => {
    let json: {}
    try {
      json = JSON.parse(value)
    } catch (err) {
      return
    }
    dispatch(updateParserOptions({ options: json }))
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Body style={{ height: 'calc(90vh - 71px)' }}>
        {show && (
          <Editor
            defaultValue={JSON.stringify(options, null, 2)}
            onChange={onChange}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Save</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default OptionsModal
