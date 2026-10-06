import { useEffect, useId, useRef } from 'react'
import { buttonClass, primaryClass } from './portalStyles'

type Props = { open: boolean; busy: boolean; title: string; message: string; onDiscard: () => void; onCancel: () => void }

export function DiscardChangesDialog({ open, busy, title, message, onDiscard, onCancel }: Props) {
  const id = useId()
  const dialog = useRef<HTMLDialogElement>(null)
  const cancel = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const element = dialog.current
    element?.showModal()
    cancel.current?.focus()
    return () => { element?.close(); if (previous?.isConnected) previous.focus({ preventScroll: true }) }
  }, [open])
  return <dialog ref={dialog} aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} aria-busy={busy}
    onCancel={event => { event.preventDefault(); onCancel() }}
    className="fixed inset-0 m-auto h-fit max-h-[calc(100svh_-_2rem)] w-[min(34rem,calc(100%_-_2rem))] overflow-y-auto border border-line bg-site p-7 text-ink shadow-site backdrop:bg-black/65 backdrop:backdrop-blur-sm max-[500px]:p-5">
    <h2 id={`${id}-title`} className="mt-0 text-2xl font-medium tracking-tight">{busy ? 'Please wait a moment' : title}</h2>
    <p id={`${id}-description`} className="text-base leading-relaxed text-ink-soft">{busy ? 'Your request is still running. Wait for it to finish before leaving, or cancel this navigation and stay on the page.' : message}</p>
    <div className="mt-7 flex flex-wrap justify-end gap-3">
      <button ref={cancel} className={buttonClass} type="button" onClick={onCancel}>Keep editing</button>
      <button className={primaryClass} type="button" onClick={onDiscard} disabled={busy}>Discard &amp; leave</button>
    </div>
  </dialog>
}
