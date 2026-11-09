import { useEffect, useId, useRef, useState } from 'react'
import { useCourseContent } from '../../lib/course/CourseAccessContext'
import { cn } from '../../lib/cn'
import { projectLabel } from './ProjectReveal'

export function CourseProjectNavigation() {
  const { courseResearchTemplate } = useCourseContent()
  const navigationItems = [
    { id: 'project-title', number: '00', title: 'Title & team' },
    { id: 'teaser', number: '', title: 'Project teaser' },
    ...courseResearchTemplate,
  ]
  const [isOpen, setIsOpen] = useState(false)
  const panelId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  function closeAndFocusTrigger() {
    setIsOpen(false)
    buttonRef.current?.focus()
  }

  useEffect(() => {
    if (!isOpen) return

    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false)
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  return (
    <div ref={containerRef} className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-[var(--gutter)] z-40 flex flex-col items-end gap-3">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen(open => !open)}
        className="order-2 inline-flex min-h-12 cursor-pointer items-center gap-5 rounded-full border border-line bg-panel-strong px-5 text-sm text-ink shadow-site backdrop-blur-xl transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        On this page <span aria-hidden="true" className={cn('text-accent transition-transform motion-reduce:transition-none', isOpen && 'rotate-180')}>↑</span>
      </button>
      {isOpen && (
        <nav id={panelId} aria-label="On this page" className="order-1 max-h-[calc(100dvh-var(--site-header-height)-7rem)] w-[min(22rem,calc(100vw-var(--gutter)*2))] overflow-y-auto overscroll-contain rounded-2xl border border-line bg-panel-strong p-3 shadow-site backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between gap-4 border-b border-line pb-2 pl-3">
            <p className={cn(projectLabel, 'm-0')}>Project sections</p>
            <button type="button" onClick={closeAndFocusTrigger} aria-label="Close section navigation" className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-xl text-ink-soft hover:bg-panel hover:text-ink focus-visible:outline-2 focus-visible:outline-accent">×</button>
          </div>
          <ol className="m-0 list-none p-0">
            {navigationItems.map(item => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => {
                    setIsOpen(false)
                    document.getElementById(item.id)?.focus({ preventScroll: true })
                  }}
                  className={cn('flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm leading-snug text-ink-soft no-underline transition-colors hover:bg-panel hover:text-accent focus-visible:outline-2 focus-visible:outline-accent', !item.number && 'pl-10')}
                >
                  {item.number && <span className="shrink-0 font-mono text-xs text-accent">{item.number}</span>}
                  {item.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </div>
  )
}
