import { useEffect, useId, useRef } from 'react'

export type LightboxPhoto = {
  src: string
  alt: string
  caption?: string
}

type PhotoLightboxProps = {
  photo: LightboxPhoto | null
  onClose: () => void
}

export function PhotoLightbox({ photo, onClose }: PhotoLightboxProps) {
  const id = useId()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const backdropPointerDown = useRef(false)
  const open = photo !== null

  useEffect(() => {
    const dialog = dialogRef.current
    if (!open || !dialog) return

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const bodyOverflow = document.body.style.overflow
    const rootOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    dialog.showModal()
    closeRef.current?.focus({ preventScroll: true })

    return () => {
      dialog.close()
      document.body.style.overflow = bodyOverflow
      document.documentElement.style.overflow = rootOverflow
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [open])

  function isBackdrop(target: EventTarget, x: number, y: number) {
    const dialog = dialogRef.current
    if (!dialog || target !== dialog) return false
    const bounds = dialog.getBoundingClientRect()
    return x < bounds.left || x > bounds.right || y < bounds.top || y > bounds.bottom
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label="Enlarged photograph"
      aria-describedby={photo?.caption ? `${id}-caption` : undefined}
      className="fixed inset-0 m-auto max-h-[calc(100dvh_-_2rem)] w-fit max-w-[calc(100vw_-_2rem)] flex-col gap-3 overflow-y-auto overscroll-contain rounded-2xl border border-line bg-site p-3 text-ink shadow-site open:flex backdrop:bg-black/80 backdrop:backdrop-blur-sm sm:p-4"
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onPointerDown={(event) => {
        backdropPointerDown.current = isBackdrop(event.target, event.clientX, event.clientY)
      }}
      onClick={(event) => {
        if (backdropPointerDown.current && isBackdrop(event.target, event.clientX, event.clientY)) onClose()
        backdropPointerDown.current = false
      }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close enlarged photograph"
        className="flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center gap-2 self-end rounded-full border border-line bg-panel px-4 text-sm text-ink transition-colors hover:bg-panel-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
      >
        <span>Close</span>
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>
      {photo && (
        <figure className="m-0 min-h-0 min-w-0">
          <img
            src={photo.src}
            alt={photo.alt}
            className="mx-auto block max-h-[calc(100dvh_-_10rem)] max-w-full rounded-lg object-contain"
          />
          {photo.caption && (
            <figcaption id={`${id}-caption`} className="mx-auto mb-1 mt-3 max-w-[65ch] text-center text-sm leading-relaxed text-ink-soft">
              {photo.caption}
            </figcaption>
          )}
        </figure>
      )}
    </dialog>
  )
}
