import { useCallback, useEffect, useRef, useState } from 'react'
import { useBlocker } from 'react-router-dom'

type LeaveAction = () => void | Promise<void>
type NavigationOptions = {
  dirty: boolean
  busy: boolean
  save: () => Promise<boolean>
  discard: () => void
  saveError: string
}
export type WorkspaceNavigationHandle = { requestLeave: (action: LeaveAction) => void }

export function useWorkspaceNavigation(options: NavigationOptions) {
  const latest = useRef(options)
  latest.current = options
  const [actionPending, setActionPending] = useState(false)
  const action = useRef<LeaveAction | null>(null)
  const [saving, setSaving] = useState(false)
  const savingRef = useRef(false)
  const leavingRef = useRef(false)
  const [saveAttempted, setSaveAttempted] = useState(false)
  const blocker = useBlocker(({ currentLocation, nextLocation }) =>
    (latest.current.dirty || latest.current.busy || savingRef.current) &&
    (currentLocation.pathname !== nextLocation.pathname || currentLocation.search !== nextLocation.search))
  const blockerRef = useRef(blocker)
  blockerRef.current = blocker
  const open = actionPending || blocker.state === 'blocked'

  const finish = useCallback(() => {
    // A successful save also clears dirty state. Its effect must not proceed
    // through the same blocked navigation a second time before React renders.
    if (leavingRef.current) return
    leavingRef.current = true
    const callback = action.current
    action.current = null
    setActionPending(false)
    setSaveAttempted(false)
    if (blockerRef.current.state === 'blocked') blockerRef.current.proceed()
    else void callback?.()
  }, [])
  const requestLeave = useCallback((callback: LeaveAction) => {
    if (savingRef.current) return
    if (!latest.current.dirty && !latest.current.busy) { void callback(); return }
    action.current = callback
    setSaveAttempted(false)
    setActionPending(true)
  }, [])
  const cancel = useCallback(() => {
    if (savingRef.current) return
    leavingRef.current = true
    action.current = null
    setActionPending(false)
    setSaveAttempted(false)
    if (blockerRef.current.state === 'blocked') blockerRef.current.reset()
  }, [])
  async function saveAndLeave() {
    if (savingRef.current || leavingRef.current || latest.current.busy) return
    savingRef.current = true
    setSaving(true)
    setSaveAttempted(true)
    try { if (await latest.current.save()) finish() }
    finally { savingRef.current = false; setSaving(false) }
  }
  function discardAndLeave() {
    if (savingRef.current || leavingRef.current || latest.current.busy) return
    latest.current.discard()
    finish()
  }
  useEffect(() => {
    // Navigation requested during an operation can continue once it finishes,
    // unless that operation leaves new unsaved material to resolve first.
    if (!open) leavingRef.current = false
    else if (!options.dirty && !options.busy && !savingRef.current && !saveAttempted) finish()
  }, [open, options.dirty, options.busy, saveAttempted, finish])
  useEffect(() => {
    if (!options.dirty && !options.busy) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [options.dirty, options.busy])

  return {
    requestLeave,
    dialog: { open, busy: saving, waiting: options.busy && !saving,
      error: saveAttempted && !saving ? options.saveError : '',
      onSave: saveAndLeave, onDiscard: discardAndLeave, onCancel: cancel }
  }
}
