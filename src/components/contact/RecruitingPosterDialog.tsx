import { useId, useLayoutEffect, useRef, useState } from 'react'
import { posterUrl } from '../../content/recruitingAssets'
import { cn } from '../../lib/cn'
import { RecruitingPosterArtwork } from './RecruitingPosterArtwork'

type RecruitingPosterDialogProps = {
  open: boolean
  onClose: () => void
}

const controlClasses = 'inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-line bg-panel px-4 text-sm text-ink no-underline hover:bg-panel-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export function RecruitingPosterDialog({ open, onClose }: RecruitingPosterDialogProps) {
  const id = useId()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [zoomed, setZoomed] = useState(false)

  useLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!open || !dialog) return

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const bodyOverflow = document.body.style.overflow
    const rootOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    // A fitted landscape poster is unreadable on a phone. Start at its natural
    // width there, while keeping a one-tap overview available in the toolbar.
    setZoomed(window.matchMedia('(max-width: 900px)').matches)
    dialog.showModal()
    closeRef.current?.focus({ preventScroll: true })

    return () => {
      dialog.close()
      document.body.style.overflow = bodyOverflow
      document.documentElement.style.overflow = rootOverflow
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [open])

  useLayoutEffect(() => {
    if (open) scrollRef.current?.scrollTo({ left: 0, top: 0, behavior: 'instant' })
  }, [open, zoomed])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-help`}
      className="fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none flex-col overflow-hidden overscroll-contain border-0 bg-site p-0 text-ink open:flex backdrop:bg-black/80"
      onCancel={event => { event.preventDefault(); onClose() }}
    >
      <header className="z-10 flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b border-line bg-site px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))]">
        <h2 id={`${id}-title`} className="m-0 mr-auto text-base font-medium">Recruiting poster</h2>
        <button ref={closeRef} type="button" className={controlClasses} onClick={onClose} aria-label="Close recruiting poster">
          Close ×
        </button>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto" aria-label="Poster viewing controls">
          <button type="button" className={cn(controlClasses, !zoomed && 'border-accent text-accent')} aria-pressed={!zoomed} onClick={() => setZoomed(false)}>
            Fit width
          </button>
          <button type="button" className={cn(controlClasses, zoomed && 'border-accent text-accent')} aria-pressed={zoomed} onClick={() => setZoomed(true)}>
            100%
          </button>
          <a href={posterUrl} target="_blank" rel="noopener noreferrer" className={controlClasses}>Open original ↗</a>
        </div>
        <p id={`${id}-help`} className="m-0 w-full text-sm leading-relaxed text-ink-soft">
          {zoomed ? 'Scroll or swipe to move around the poster.' : 'Choose 100% to read the poster at full size.'}
        </p>
      </header>
      <div
        ref={scrollRef}
        tabIndex={0}
        role="region"
        aria-label="Scrollable recruiting poster"
        className="min-h-0 flex-1 overflow-auto overscroll-contain scroll-auto pb-[env(safe-area-inset-bottom)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
      >
        {open && (
          <RecruitingPosterArtwork
            alt="FEAR Lab MPhil recruiting poster, with requirements and the email fearlab@hkust-gz.edu.cn."
            loading="eager"
            className={cn('mx-auto', zoomed ? 'w-[1728px] max-w-none' : 'w-full max-w-[1728px]')}
          />
        )}
      </div>
    </dialog>
  )
}
