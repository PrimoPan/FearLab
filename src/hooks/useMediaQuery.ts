import { useEffect, useState } from 'react'

const getMatches = (query: string) =>
  typeof window !== 'undefined' ? window.matchMedia(query).matches : false

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => getMatches(query))

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const media = window.matchMedia(query)
    const syncMatches = () => {
      setMatches(media.matches)
    }

    syncMatches()
    media.addEventListener('change', syncMatches)

    return () => {
      media.removeEventListener('change', syncMatches)
    }
  }, [query])

  return matches
}
