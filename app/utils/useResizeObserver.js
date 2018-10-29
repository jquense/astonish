import { useRef, useEffect } from 'react'

const targetMap = new window.WeakMap()
const observer = new ResizeObserver(entries => {
  entries.forEach(entry => {
    targetMap.get(entry.target)(entry.contentRect)
  })
})

export default function useResizeObserver(handler, fireInitial) {
  const ref = useRef(null)
  useEffect(
    () => {
      const { current: el } = ref
      if (!el || targetMap.has(el)) return

      targetMap.set(el, handler)
      observer.observe(el)
      fireInitial && handler(el.getBoundingClientRect())
    },
    [ref.current, handler]
  )
  return ref
}
