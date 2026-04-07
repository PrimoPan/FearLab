import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { PersonCard } from '../components/people/PersonCard'
import { PeopleDirectoryHero } from '../components/people/PeopleDirectoryHero'
import { PersonDetailSection } from '../components/people/PersonDetailSection'
import { people, peopleBySlug, type PersonRecord } from '../data/people'
import { staggerIn } from '../lib/animations'

export function PeoplePage() {
  const [searchParams, setSearchParams] = useSearchParams()
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

    window.setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
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
    <section className={`directory-page${selectedPerson ? ' directory-page--detail-open' : ''}`}>
      <PeopleDirectoryHero />

      <motion.div
        className="people-grid people-grid--flat"
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
