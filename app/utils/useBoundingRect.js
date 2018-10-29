import { useLayoutEffect, useState } from 'react'

export default function useDebounce(ref) {
  const [bounds, setBounds] = useState(null)

  useLayoutEffect(() => {
    if (!ref.current) return

    const nextBounds = ref.current.getBoundingClientRect()
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
