import { useMutationEffect, useCallback, useRef } from 'react'

export default function useEventCallback(fn, dependencies) {
  const ref = useRef(() => {
    throw new Error('Cannot call an event handler while rendering.')
  })

  useMutationEffect(
    () => {
      ref.current = fn
    },
    [fn, ...dependencies]
  )

  return useCallback(
    (...args) => {
      if (!ref.current) return

      ref.current(...args)
    },
    [ref]
  )
}
