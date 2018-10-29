import { useState, useRef, useCallback } from 'react'
import useThrottle from './useThrottle'

export default function useMousePosition() {
  const [position, setState] = useState({ x: null, y: null })
  const isOverRef = useRef(false)
  const throttledSetState = useThrottle(setState, 100)

  return [
    position,
    {
      onPointerEnter: useCallback(() => {
        isOverRef.current = true
      }, []),
      onPointerLeave: useCallback(() => {
        isOverRef.current = false
      }, []),
      onPointerMove: useCallback(({ clientX, clientY }) => {
        if (isOverRef.current) throttledSetState({ x: clientX, y: clientY })
      }, []),
    },
  ]
}
