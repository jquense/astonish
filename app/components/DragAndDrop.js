import React, {
  useState,
  useContext,
  useReducer,
  useRef,
  useCallback,
} from 'react'
import useDebounce from '../utils/useDebounce'

import { css } from 'astroturf'

const styles = css`
  .droppable {
    & * {
      pointer-events: none;
    }
  }
`
function sourceReducer(state, { type, payload }) {
  // console.log(type, payload)
  switch (type) {
    case 'DRAG_START':
      return { ...state, data: payload }
    case 'DRAG_END':
      return { ...state, data: null }
    case 'MOVE':
      return { ...state, position: payload }
  }
  return state
}

export default function createDragAndDrop() {
  const DispatchContext = React.createContext(null)

  const SourceContext = React.createContext({
    position: null,
    isDown: false,
    isDragging: false,
    hasCapture: false,
    dispatch() {},
  })

  function useDragSource({ getData } = {}) {
    const dispatch = useContext(DispatchContext)

    return {
      onDragStart: useCallback(event => {
        event.stopPropagation()
        event.dataTransfer.dropEffect = 'move'
        event.dataTransfer.setData('text/plain', 'dumb')
        dispatch({
          type: 'DRAG_START',
          payload: getData ? getData(event) : null,
        })
      }, []),
      onDragEnd: useCallback(event => {
        event.stopPropagation()
        dispatch({ type: 'DRAG_END' })
      }, []),
    }
  }

  function useDragTarget({ onDrop } = {}) {
    const [isOver, setOver] = useState(false)
    const dispatch = useContext(DispatchContext)
    const { position, data } = useContext(SourceContext)
    const debouncedDispatch = useDebounce(dispatch, 50)

    return [
      isOver ? position : null,
      {
        onDrop: useCallback(
          event => {
            event.target.classList.remove(styles.droppable)
            onDrop && onDrop(data, position)
            setOver(false)
            dispatch({ type: 'DRAG_END' })
          },
          [data, position.x, position.y]
        ),
        onDragEnter: useCallback(event => {
          event.target.classList.add(styles.droppable)
          setOver(true)
        }, []),
        onDragLeave: useCallback(event => {
          event.target.classList.remove(styles.droppable)
          setOver(false)
        }, []),
        onDragOver: useCallback(
          event => {
            event.preventDefault()

            if (position.x !== event.clientX || position.y !== event.clientY) {
              debouncedDispatch({
                type: 'MOVE',
                payload: { x: event.clientX, y: event.clientY },
              })
            }
          },
          [position.x, position.y]
        ),
      },
    ]
  }

  function DragAndDropProvider({ children }) {
    const initialState = {
      position: { x: null, y: null },
      isDown: false,
      hasCapture: false,
      isDragging: false,
      isOver: useRef(false),
      callbacks: useRef({ onDrop: null }),
    }
    const [state, dispatch] = useReducer(sourceReducer, initialState)

    return (
      <>
        <DispatchContext.Provider value={dispatch}>
          <SourceContext.Provider value={state}>
            {children}
          </SourceContext.Provider>
        </DispatchContext.Provider>
      </>
    )
  }

  return { DragAndDropProvider, useDragTarget, useDragSource }
}
