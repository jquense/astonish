import { useLayoutEffect, useState } from 'react'
import { findDOMNode } from 'react-dom'

export default function useDebounce(ref) {
  const [bounds, setBounds] = useState(null)

  useLayoutEffect(() => {
    let current
    try {
      current = ref.current && findDOMNode(ref.current)
    } catch (err) {
      // ignore
    }

    if (!current) return

    const nextBounds = current.getBoundingClientRect()
    if (
      !bounds ||
      nextBounds.left !== bounds.left ||
      bounds.bottom !== nextBounds.bottom ||
      bounds.top !== nextBounds.top ||
      bounds.right !== nextBounds.right
    )
      setBounds(nextBounds)
  })

  return bounds
}
