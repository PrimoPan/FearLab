import { motion } from 'framer-motion'
import { reveal, staggerIn } from '../../lib/animations'
import type { PublicationYearGroup } from '../../lib/publications'
import { PublicationEntry } from './PublicationEntry'

type PublicationYearSectionProps = {
  group: PublicationYearGroup
}

export function PublicationYearSection({ group }: PublicationYearSectionProps) {
  const workLabel = group.publications.length === 1 ? 'work' : 'works'

  return (
    <motion.section
      id={`publications-${group.year}`}
      className="publication-year-group"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.04 }}
      variants={staggerIn}
    >
      <motion.header className="publication-year-group__header" variants={reveal}>
        <h2>{group.year}</h2>
        <p>
          {group.publications.length} {workLabel}
        </p>
      </motion.header>

      <motion.div className="publication-list" variants={staggerIn}>
        {group.publications.map((publication) => (
          <PublicationEntry key={publication.id} publication={publication} />
        ))}
      </motion.div>
    </motion.section>
  )
}
