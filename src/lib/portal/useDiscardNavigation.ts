import { useCallback, useEffect, useRef, useState } from 'react'
import { useBlocker } from 'react-router-dom'

type Action = () => void | Promise<void>
type Options = { dirty: boolean; busy: boolean; title?: string; message?: string }

export function useDiscardNavigation(options: Options) {
  const latest = useRef(options)
  latest.current = options
  const action = useRef<Action | null>(null)
  const settled = useRef(false)
  const [pending, setPending] = useState(false)
  const blocker = useBlocker(({ currentLocation, nextLocation }) =>
    (latest.current.dirty || latest.current.busy) &&
    (currentLocation.pathname !== nextLocation.pathname || currentLocation.search !== nextLocation.search))
  const blockerRef = useRef(blocker)
  blockerRef.current = blocker
  const open = pending || blocker.state === 'blocked'
  const finish = useCallback(() => {
    if (settled.current) return
    settled.current = true
    const callback = action.current
    action.current = null
    setPending(false)
    if (blockerRef.current.state === 'blocked') blockerRef.current.proceed()
    else void callback?.()
  }, [])
  const requestLeave = useCallback((callback: Action) => {
    if (!latest.current.dirty && !latest.current.busy) { void callback(); return }
    action.current = callback
    setPending(true)
  }, [])
  const cancel = useCallback(() => {
    settled.current = true
    action.current = null
    setPending(false)
    if (blockerRef.current.state === 'blocked') blockerRef.current.reset()
  }, [])
  useEffect(() => {
    if (!open) settled.current = false
    else if (!options.dirty && !options.busy) finish()
  }, [open, options.dirty, options.busy, finish])
  useEffect(() => {
    if (!options.dirty && !options.busy) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [options.dirty, options.busy])
  return { requestLeave, dialog: {
    open, busy: options.busy,
    title: options.title ?? 'Discard unsaved changes?',
    message: options.message ?? 'Your edits have not been saved. Discard them and leave this page?',
    onDiscard: () => { if (!latest.current.busy) finish() }, onCancel: cancel
  } }
}
