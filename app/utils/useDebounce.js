import { useCallback } from 'react'

import debounce from 'lodash/debounce'

export default function useDebounce(fn, ms = 100, opts) {
  return useCallback(debounce(fn, ms, opts), [ms])
}
