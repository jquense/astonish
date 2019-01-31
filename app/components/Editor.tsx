import { useRef, useLayoutEffect } from 'react'
import { css } from 'astroturf'
import * as monaco from 'monaco-editor'
import useResizeObserver from '../utils/useResizeObserver'

import { useStoreState, useStoreDispatch } from '../store'
import * as React from 'react'
import { editorCursorChange } from '../actions'

type MonacoEditor = monaco.editor.IStandaloneCodeEditor

const styles = css`
  .highlight {
    color: red !important;
  }
`

const propTypes = {}

function useCursorPositionChange(editorRef: React.RefObject<MonacoEditor>) {
  const dispatch = useStoreDispatch()

  useLayoutEffect(() => {
    const editor = editorRef.current

    editor.onDidChangeCursorPosition(({ position }) =>
      dispatch(
        editorCursorChange({
          position,
          offset: editor.getModel().getOffsetAt(position),
        })
      )
    )
  }, [])
}

function useHighlightRange(editorRef: React.RefObject<MonacoEditor>) {
  const decorations = useRef([])
  const [start, end] = useStoreState(s => s.app.activeRange) || [null, null]

  useLayoutEffect(
    () => {
      const editor = editorRef.current
      if (!editor) return

      if (start == null) {
        if (decorations.current.length)
          editor.deltaDecorations(decorations.current, [])

        return
      }

      const startPos = editor.getModel().getPositionAt(start)
      const endPos = editor.getModel().getPositionAt(end)

      decorations.current = editor.deltaDecorations(decorations.current, [
        {
          range: new monaco.Range(
            startPos.lineNumber,
            startPos.column,
            endPos.lineNumber,
            endPos.column + 1
          ),
          options: { inlineClassName: styles.highlight },
        },
      ])
    },
    [editorRef.current, start, end]
  )
}

export interface UseEditorOptions {
  defaultValue?: string
  value?: string
  language?: string
  onChange: (v: string, evt: monaco.editor.IModelContentChangedEvent) => void
}

export function useEditor(
  containerRef: React.RefObject<HTMLElement>,
  { defaultValue, value, onChange, language = 'typescript' }: UseEditorOptions
) {
  const editorRef = useRef<MonacoEditor>(null)
  useResizeObserver(containerRef, () => {
    editorRef.current && editorRef.current.layout()
  })

  useLayoutEffect(
    () => {
      if (!containerRef.current) return
      let editor = editorRef.current

      if (!editor) {
        editor = monaco.editor.create(containerRef.current, {
          value: defaultValue || value,
          language,
          theme: 'vs-dark',
          // @ts-ignore
          tabSize: 2,
          minimap: {
            enabled: false,
          },
        })

        editor.onDidChangeModelContent(event => {
          onChange && onChange(editor.getValue(), event)
        })
      } else if (value) {
        editor.setValue(value)
      }

      editorRef.current = editor

      return () => {
        if (editorRef.current) {
          editorRef.current.dispose()
        }
        editorRef.current = null
      }
    },
    [!!containerRef.current, value || '']
  )

  return editorRef
}

function Editor({
  className,
  ...props
}: UseEditorOptions & { className?: string }) {
  const container = useRef<HTMLDivElement>(null)

  const editor = useEditor(container, props)

  useCursorPositionChange(editor)
  useHighlightRange(editor)

  return (
    <div
      ref={container}
      className={className}
      style={{
        top: 0,
        bottom: 0,
        position: 'absolute',
        width: '100%',
        overflow: 'hidden',
      }}
    />
  )
}

Editor.propTypes = propTypes

export default Editor
