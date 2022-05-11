import { useCallback, useLayoutEffect, useRef } from 'react'

export default function useLatestScope<T extends Function>(handler: T) {
    const fnRef = useRef<T>(handler)

    useLayoutEffect(() => {
        fnRef.current = handler
    })

    return useCallback((...args) => fnRef.current?.(...args), [])
}
