import React, { useRef, useLayoutEffect } from 'react'
import * as monaco from 'monaco-editor'

import useResizeObserver from '../../utils/useResizeObserver'

const propTypes = {}

function useEditor(containerRef, { value, onChange }) {
  const editorRef = useRef(null)

  useLayoutEffect(
    () => {
      let editor = editorRef.current

      if (!editor) {
        editor = monaco.editor.create(containerRef.current, {
          value,
          language: 'javascript',

          // theme: 'vs-dark',
          tabSize: 2,
          minimap: {
            enabled: false,
          },
        })

        editor.onDidChangeModelContent(event => {
          onChange && onChange(editor.getValue(), event)
        })
      } else {
        editor.setValue(value)
      }

      editorRef.current = editor

      return () => {
        editor.dispose()
      }
    },
    [containerRef, value || '']
  )
  return editorRef
}

function Editor({ className, ...props }) {
  const container = useResizeObserver(() => {
    editor.current.layout()
  })

  const editor = useEditor(container, props)

  return <div className={className} style={{ flex: '1 0 0' }} ref={container} />
}

Editor.propTypes = propTypes

export default Editor
