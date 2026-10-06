import { useEffect, useId, useRef } from 'react'
import { buttonClass, primaryClass } from './portalStyles'

type UnsavedChangesDialogProps = {
  open: boolean
  busy: boolean
  waiting: boolean
  error: string
  submitted: boolean
  onSave: () => void
  onDiscard: () => void
  onCancel: () => void
}

export function UnsavedChangesDialog({ open, busy, waiting, error, submitted, onSave, onDiscard, onCancel }: UnsavedChangesDialogProps) {
  const id = useId()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const keepEditingRef = useRef<HTMLButtonElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  function restoreFocus() {
    if (previousFocus.current?.isConnected) previousFocus.current.focus({ preventScroll: true })
    previousFocus.current = null
  }

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      dialog.showModal()
      if (keepEditingRef.current?.disabled) dialog.focus()
      else keepEditingRef.current?.focus()
    } else if (open && !busy && !dialog.contains(document.activeElement)) {
      keepEditingRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
      restoreFocus()
    }
  }, [open, busy])

  useEffect(() => () => {
    if (dialogRef.current?.open) dialogRef.current.close()
    restoreFocus()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      tabIndex={-1}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description${submitted ? ` ${id}-submitted` : ''}`}
      aria-modal="true"
      aria-busy={busy || waiting}
      className="fixed inset-0 m-auto h-fit max-h-[calc(100svh_-_2rem)] w-[min(35rem,calc(100%_-_2rem))] overflow-y-auto border border-line bg-site p-7 text-ink shadow-site backdrop:bg-black/65 backdrop:backdrop-blur-sm max-[500px]:p-5"
      onCancel={(event) => { event.preventDefault(); if (!busy) onCancel() }}
    >
      <p className="mb-4 mt-0 font-mono text-xs tracking-[0.14em] text-accent uppercase">{waiting ? 'Operation in progress' : 'Unsaved changes'}</p>
      <h2 id={`${id}-title`} className="m-0 text-[clamp(1.75rem,5vw,2.25rem)] font-medium leading-tight tracking-[-0.04em]">
        {waiting ? 'Please wait a moment' : 'Save changes before leaving?'}
      </h2>
      <p id={`${id}-description`} className="mb-0 mt-5 text-base leading-relaxed text-ink-soft">
        {waiting ? 'Your current operation is still running. Once it finishes, you can resolve any unsaved changes and continue.' : 'You have unsaved changes. Save them before leaving, or discard them and lose your edits since the last save.'}
      </p>
      {submitted && <p id={`${id}-submitted`} className="mb-0 mt-4 border-l-2 border-accent pl-4 text-sm leading-relaxed text-ink-soft">
        Saving changes returns your submitted proposal to Draft. You’ll need to submit it for review again.
      </p>}
      {waiting && <p className="mb-0 mt-5 text-sm text-accent" role="status">Finishing the current operation…</p>}
      {error && <p className="mb-0 mt-5 break-words border-l-2 border-accent pl-4 text-sm leading-relaxed text-accent" role="alert">{error}</p>}
      <div className="mt-7 flex flex-wrap justify-end gap-3 max-[500px]:grid max-[500px]:grid-cols-1">
        <button ref={keepEditingRef} autoFocus type="button" className={buttonClass} disabled={busy} onClick={onCancel}>Keep editing</button>
        <button type="button" className={buttonClass} disabled={busy || waiting} onClick={onDiscard}>Discard &amp; leave</button>
        <button type="button" className={primaryClass} disabled={busy || waiting} onClick={onSave}>{busy ? 'Saving…' : 'Save & leave'}</button>
      </div>
    </dialog>
  )
}
