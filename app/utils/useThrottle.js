import { useCallback } from 'react'

import throttle from 'lodash/throttle'

export default function useThrottle(fn, ms = 100, opts) {
  return useCallback(throttle(fn, ms, opts), [ms])
}
