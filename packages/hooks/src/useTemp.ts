import { useRef } from 'react'

export default function useTemp<T extends {}, LT extends {}>(
  data: T,
  lastData?: LT
): T & LT {
  const cache = useRef({ ...data, ...lastData! })
  Object.entries(lastData || {}).forEach(([k, v]) => {
    Reflect.set(cache.current, k, v)
  })
  return cache.current
}
