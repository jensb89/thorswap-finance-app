import { useEffect, useState } from 'react'

/**
 * Debounce the change of given value
 *
 * @param value value changes will only be returned after timeout
 * @param timeout timeout in ms passed to setTimeout()
 */
const useDebounce = <T>(value: T, timeout: number) => {
  const [state, setState] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setState(value), timeout)

    return () => clearTimeout(handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return state
}

export default useDebounce
