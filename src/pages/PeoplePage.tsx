import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { PersonCard } from '../components/people/PersonCard'
import { PeopleDirectoryHero } from '../components/people/PeopleDirectoryHero'
import { PersonDetailSection } from '../components/people/PersonDetailSection'
import type { PersonRecord } from '../data/people'
import { staggerIn } from '../lib/animations'
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
  const { people, peopleBySlug } = usePeopleDirectory()
  const detailRef = useRef<HTMLElement | null>(null)
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const lastSelectedSlug = useRef<string | null>(null)

  const selectedSlug = searchParams.get('member')
  const selectedPerson = selectedSlug ? peopleBySlug[selectedSlug] : undefined

  useEffect(() => {
    if (!selectedPerson || !detailRef.current) {
      return
    }

    lastSelectedSlug.current = selectedPerson.slug

    const timeout = window.setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
    return () => window.clearTimeout(timeout)
  }, [selectedPerson])

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

      <motion.div
        className={gridClasses}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerIn}
      >
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
      </motion.div>

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
