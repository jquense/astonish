import { useState, useRef, useCallback } from 'react'

export default function usePointerDragPosition(onMove) {
  // const [position, setState] = useState({
  //   delta: { left: 0, top: 0 },
  //   postion: { x: null, y: null },
  // })
  const isActive = useRef(false)
  const { current: lastDelta } = useRef({ left: 0, top: 0 })

  return [
    null,
    {
      onPointerDown: useCallback(event => {
        isActive.current = true
        event.target.setPointerCapture(event.pointerId)
      }, []),
      onPointerUp: useCallback(() => {
        isActive.current = false
      }, []),
      onPointerMove: useCallback(({ clientX, clientY }) => {
        if (!isActive.current) return

        const delta = {
          left: clientX - lastDelta.left,
          top: clientY - lastDelta.top,
        }

        lastDelta.left = clientX
        lastDelta.top = clientY

        onMove(event, {
          delta,
          position: { x: clientX, y: clientY },
        })
      }, []),
    },
  ]
}
