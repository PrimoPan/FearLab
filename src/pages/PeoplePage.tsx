import { useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { PersonCard } from '../components/people/PersonCard'
import { PeopleDirectoryHero } from '../components/people/PeopleDirectoryHero'
import { PersonDetailSection } from '../components/people/PersonDetailSection'
import type { PersonRecord } from '../data/people'
import { cn } from '../lib/cn'
import { usePeopleDirectory } from '../lib/people/usePeopleDirectory'

const pageClasses = cn(
  'relative z-[1] mx-auto pb-16 pt-[clamp(1.6rem,4vw,2.8rem)]',
  'w-[min(var(--page-max),calc(100%_-_(var(--gutter)_*_2)))]'
)

const gridClasses = cn(
  'grid max-w-[1080px] grid-cols-4 gap-x-[1.4rem] gap-y-[1.8rem]',
  'max-[900px]:grid-cols-3',
  'max-[700px]:grid-cols-2 max-[700px]:gap-x-4 max-[700px]:gap-y-5',
  'max-[520px]:max-w-[320px] max-[520px]:grid-cols-1 max-[520px]:gap-[1.1rem]'
)

export function PeoplePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { people, peopleBySlug, isLoading, error, retry } = usePeopleDirectory()
  const detailRef = useRef<HTMLElement | null>(null)
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const lastSelectedSlug = useRef<string | null>(null)

  const selectedSlug = searchParams.get('member')
  const selectedPerson = !isLoading && selectedSlug ? peopleBySlug[selectedSlug] : undefined

  useEffect(() => {
    if (!selectedPerson || !detailRef.current) {
      return
    }

    lastSelectedSlug.current = selectedPerson.slug

    const timeout = window.setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
    return () => window.clearTimeout(timeout)
  }, [selectedPerson?.slug])

  const openPerson = (person: PersonRecord) => {
    setSearchParams({ member: person.slug })
  }

  const closePerson = () => {
    const slug = lastSelectedSlug.current
    setSearchParams({})

    window.setTimeout(() => {
      if (!slug) {
        return
      }

      cardRefs.current[slug]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }, 80)
  }

  return (
    <section className={cn(pageClasses, selectedPerson && 'pb-0')}>
      <PeopleDirectoryHero />
      <section aria-labelledby="join-us-title" className="mb-10">
        <Link to="/contact" className="group flex items-center justify-between gap-6 rounded-2xl border border-line bg-panel p-6 text-inherit no-underline transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
          <div>
            <h2 id="join-us-title" className="m-0 text-3xl font-medium tracking-[-0.04em] group-hover:text-accent">Join us</h2>
            <p className="mb-0 mt-3 text-sm leading-relaxed text-ink-soft">Explore opportunities to join FEAR Lab and view our recruiting poster.</p>
          </div>
          <span className="text-2xl text-accent" aria-hidden="true">→</span>
        </Link>
      </section>

      {isLoading ? (
        <div className="min-h-[32rem] py-8 text-ink-soft" role="status">
          Loading our team…
        </div>
      ) : <div className={gridClasses}>
        {people.map((person) => (
          <PersonCard
            key={person.slug}
            person={person}
            isSelected={selectedPerson?.slug === person.slug}
            onOpen={openPerson}
            buttonRef={(node) => {
              cardRefs.current[person.slug] = node
            }}
          />
        ))}
      </div>}

      {error && !isLoading && (
        <p role="status" className="mt-6 text-sm text-ink-soft">
          Some team profiles could not be refreshed.{' '}
          <button type="button" className="cursor-pointer border-0 bg-transparent p-0 text-accent underline underline-offset-4" onClick={() => void retry()}>
            Try again
          </button>
        </p>
      )}

      <AnimatePresence mode="wait">
        {selectedPerson ? (
          <PersonDetailSection
            key={selectedPerson.slug}
            person={selectedPerson}
            detailRef={detailRef}
            onClose={closePerson}
          />
        ) : null}
      </AnimatePresence>
    </section>
  )
}
