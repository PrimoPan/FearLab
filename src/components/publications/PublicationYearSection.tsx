import { motion } from 'framer-motion'
import { reveal, staggerIn } from '../../lib/animations'
import type { PublicationYearGroup } from '../../lib/publications'
import { PublicationEntry } from './PublicationEntry'
import { publicationLayoutStyles } from './publicationLayoutStyles'

type PublicationYearSectionProps = {
  group: PublicationYearGroup
}

export function PublicationYearSection({ group }: PublicationYearSectionProps) {
  const workLabel = group.publications.length === 1 ? 'work' : 'works'

  return (
    <motion.section
      id={`publications-${group.year}`}
      className={publicationLayoutStyles.yearGroup}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.04 }}
      variants={staggerIn}
    >
      <motion.header className={publicationLayoutStyles.yearHeader} variants={reveal}>
        <h2 className={publicationLayoutStyles.yearHeading}>{group.year}</h2>
        <p className={publicationLayoutStyles.yearCount}>
          {group.publications.length} {workLabel}
        </p>
      </motion.header>

      <motion.div className={publicationLayoutStyles.publicationList} variants={staggerIn}>
        {group.publications.map((publication) => (
          <PublicationEntry key={publication.id} publication={publication} />
        ))}
      </motion.div>
    </motion.section>
  )
}
