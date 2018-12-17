import { useRef, useEffect, RefObject } from 'react'

type Handler = (rect: DOMRect) => void

const targetMap = new WeakMap<Element, Handler>()
const observer = new ResizeObserver(entries => {
  entries.forEach(entry => {
    targetMap.get(entry.target)!(entry.contentRect as DOMRect)
  })
})

export default function useResizeObserver<T extends Element>(
  ref: RefObject<T>,
  handler: Handler,
  fireInitial: boolean = false
) {
  useEffect(
    () => {
      const { current: el } = ref
      if (!el || targetMap.has(el)) return

      targetMap.set(el, handler)
      observer.observe(el)
      fireInitial && handler(el.getBoundingClientRect() as DOMRect)
    },
    [ref.current, handler]
  )
}
