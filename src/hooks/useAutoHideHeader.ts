import { useCallback, useEffect, useRef, useState, type FocusEvent } from 'react'

const topRevealZone = 28
const topPinnedRange = 36
const hideAfter = 96
const hideDistance = 14
const revealDistance = 8

type ScrollDirection = 'up' | 'down'

export function useAutoHideHeader(resetKey: string) {
  const [isVisible, setIsVisible] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [height, setHeight] = useState<number | null>(null)
  const headerRef = useRef<HTMLElement | null>(null)
  const lastObservedScrollY = useRef(0)
  const directionAnchorScrollY = useRef(0)
  const lastDirection = useRef<ScrollDirection>('up')
  const hasFocusWithin = useRef(false)
  const animationFrame = useRef<number | null>(null)

  useEffect(() => {
    const currentScrollY = Math.max(window.scrollY, 0)
    lastObservedScrollY.current = currentScrollY
    directionAnchorScrollY.current = currentScrollY
    lastDirection.current = 'up'
    setIsVisible(true)
    setIsScrolled(currentScrollY > topPinnedRange)
  }, [resetKey])

  useEffect(() => {
    const headerElement = headerRef.current

    if (!headerElement) {
      return
    }

    const measureHeader = () => {
      setHeight(Math.ceil(headerElement.getBoundingClientRect().height))
    }

    measureHeader()

    const observer = new ResizeObserver(measureHeader)
    observer.observe(headerElement)
    window.addEventListener('resize', measureHeader)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measureHeader)
    }
  }, [])

  useEffect(() => {
    const updateFromScroll = () => {
      const nextScrollY = Math.max(window.scrollY, 0)
      const delta = nextScrollY - lastObservedScrollY.current
      const nextDirection: ScrollDirection = delta > 0 ? 'down' : delta < 0 ? 'up' : lastDirection.current

      setIsScrolled(nextScrollY > topPinnedRange)

      if (nextScrollY <= topPinnedRange) {
        lastDirection.current = 'up'
        directionAnchorScrollY.current = nextScrollY
        setIsVisible(true)
      } else {
        if (nextDirection !== lastDirection.current) {
          lastDirection.current = nextDirection
          directionAnchorScrollY.current = lastObservedScrollY.current
        }

        const distanceFromAnchor = nextScrollY - directionAnchorScrollY.current

        if (!hasFocusWithin.current) {
          if (
            nextDirection === 'down' &&
            nextScrollY > hideAfter &&
            distanceFromAnchor >= hideDistance
          ) {
            setIsVisible(false)
          } else if (nextDirection === 'up' && distanceFromAnchor <= -revealDistance) {
            setIsVisible(true)
          }
        }
      }

      lastObservedScrollY.current = nextScrollY
      animationFrame.current = null
    }

    const handleScroll = () => {
      if (animationFrame.current === null) {
        animationFrame.current = window.requestAnimationFrame(updateFromScroll)
      }
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && event.clientY <= topRevealZone) {
        setIsVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    return () => {
      if (animationFrame.current !== null) {
        window.cancelAnimationFrame(animationFrame.current)
      }

      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [])

  const handleFocusCapture = useCallback(() => {
    hasFocusWithin.current = true
    setIsVisible(true)
  }, [])

  const handleBlurCapture = useCallback((event: FocusEvent<HTMLElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) {
      return
    }

    hasFocusWithin.current = false
  }, [])

  return {
    headerRef,
    height,
    isVisible,
    isScrolled,
    handleFocusCapture,
    handleBlurCapture
  }
}
